"use strict";

const async = require("async");
const validUrl = require("valid-url");
const jdp = require("jsondiffpatch").create({
    objectHash: (obj) => obj._id,
});

const models = require("../lib/models");
const db = require("../lib/db");
const urls = require("../lib/urls");
const config = require("../lib/config");
const metadata = require("../lib/metadata");
const options = require("../lib/options");

const modelProps = metadata.schemas();

const Record = new db.schema(Object.assign({
    // UUID of the image (Format: SOURCE/ID)
    _id: {
        type: String,
        es_indexed: true,
    },

    // Source ID
    id: {
        type: String,
        validate: (v) => /^[a-z0-9_-]+$/i.test(v),
        validationMsg: (req) => req.gettext("IDs can only contain " +
            "letters, numbers, underscores, and hyphens."),
        required: true,
        es_indexed: true,
    },

    // The date that this item was created
    created: {
        type: Date,
        default: Date.now,
    },

    // The date that this item was updated
    modified: Date,

    // The most recent batch in which the record data was uploaded
    batch: {
        type: String,
        ref: "RecordImport",
    },

    // The source of the image.
    // NOTE: We don't need to validate the source as it's not a
    // user-specified property.
    source: {
        type: String,
        es_indexed: true,
        required: true,
    },

    // The language of the page from where the data is being extracted. This
    // will influence how extracted text is handled.
    lang: {
        type: String,
        required: true,
    },

    // A link to the record at its source
    url: {
        type: String,
        required: true,
        validate: (v) => validUrl.isHttpsUri(v) || validUrl.isHttpUri(v),
        validationMsg: (req) => req.gettext("`url` must be properly-" +
            "formatted URL."),
    },

    // A hash to use to render an image representing the record
    defaultImageHash: {
        type: String,
        required: true,
    },

    // The images associated with the record
    images: {
        type: [{type: String, ref: "Image"}],
        required: true,
        validateArray: (v) => /^\w+\/[a-z0-9_-]+\.jpe?g$/i.test(v),
        validationMsg: (req) => req.gettext("Images must be a valid " +
            "image file name. For example: `image.jpg`."),
        convert: (name, data) => `${data.source}/${name}`,
    },

    // Keep track of if the record needs to update its record similarity
    needsSimilarUpdate: {
        type: Boolean,
        default: false,
    },

    // Computed by looking at the results of images.similarImages
    similarRecords: [{
        _id: String,

        record: {
            type: String,
            ref: "Record",
            required: true,
        },

        images: {
            type: [String],
            required: true,
        },

        source: {
            type: String,
            es_indexed: true,
            required: true,
        },

        score: {
            type: Number,
            es_indexed: true,
            required: true,
            min: 1,
        },
    }],
}, modelProps));

Record.methods = {
    getURL(locale) {
        return models("Record").getURLFromID(locale, this._id);
    },

    getOriginalURL() {
        return urls.genData(
            `/${this.source}/images/${this.defaultImageHash}.jpg`);
    },

    getThumbURL() {
        return urls.genData(
            `/${this.source}/thumbs/${this.defaultImageHash}.jpg`);
    },

    getTitle(i18n) {
        return options.recordTitle(this, i18n);
    },

    getSource() {
        return models("Source").getSource(this.source);
    },

    getImages(callback) {
        async.mapLimit(this.images, 4, (id, callback) => {
            if (typeof id !== "string") {
                return process.nextTick(() => callback(null, id));
            }
            models("Image").findById(id, callback);
        }, callback);
    },

    updateSimilarity(callback) {
        /* istanbul ignore if */
        if (config.NODE_ENV !== "test") {
            console.log("Updating Similarity", this._id);
        }

        this.getImages((err, images) => {
            /* istanbul ignore if */
            if (err) {
                return callback(err);
            }

            // Calculate record matches before saving
            const matches = images
                .map((image) => image.similarImages)
                .reduce((a, b) => a.concat(b), []);
            const scores = matches.reduce((obj, match) => {
                obj[match._id] = Math.max(match.score, obj[match._id] || 0);
                return obj;
            }, {});

            if (matches.length === 0) {
                this.needsSimilarUpdate = false;
                return callback();
            }

            const matchIds = matches.map((match) => match._id);
            const query = matches.map((match) => ({
                images: match._id,
            }));

            models("Record").find({
                $or: query,
                _id: {$ne: this._id},
            }, (err, records) => {
                /* istanbul ignore if */
                if (err) {
                    return callback(err);
                }

                this.similarRecords = records
                    .map((similar) => {
                        const score = similar.images
                            .map((image) => scores[image] || 0)
                            .reduce((a, b) => a + b);

                        return {
                            _id: similar._id,
                            record: similar._id,
                            images: similar.images
                                .filter((id) => matchIds.indexOf(id) >= 0),
                            score,
                            source: similar.source,
                        };
                    })
                    .filter((similar) => similar.score > 0)
                    .sort((a, b) => b.score - a.score);

                this.needsSimilarUpdate = false;
                callback();
            });
        });
    },

    loadImages(loadSimilarRecords, callback) {
        async.parallel([
            (callback) => {
                this.getImages((err, images) => {
                    // We filter out any invalid/un-found images
                    // TODO: We should log out some details on when this
                    // happens (hopefully never).
                    this.images = images.filter((image) => !!image);
                    callback();
                });
            },

            (callback) => {
                if (!loadSimilarRecords) {
                    return process.nextTick(callback);
                }

                async.mapLimit(this.similarRecords, 4,
                    (similar, callback) => {
                        if (typeof similar.record !== "string") {
                            return process.nextTick(() =>
                                callback(null, similar));
                        }

                        models("Record").findById(similar.record,
                            (err, record) => {
                                /* istanbul ignore if */
                                if (err || !record) {
                                    return callback();
                                }

                                similar.record = record;
                                callback(null, similar);
                            });
                    }, (err, similar) => {
                        // We filter out any invalid/un-found records
                        // TODO: We should log out some details on when this
                        // happens (hopefully never).
                        this.similarRecords =
                            similar.filter((similar) => !!similar);
                        callback();
                    });
            },
        ], callback);
    },
};

const internal = ["_id", "__v", "created", "modified", "defaultImageHash",
    "batch"];

const getExpectedType = (options, value) => {
    if (Array.isArray(options.type)) {
        return Array.isArray(value) ? false : "array";
    }

    if (options.type === Number) {
        return typeof value === "number" ? false : "number";
    }

    if (options.type === Boolean) {
        return typeof value === "boolean" ? false : "boolean";
    }

    // Defaults to type of String
    return typeof value === "string" ? false : "string";
};

const stripProp = (obj, name) => {
    if (!obj) {
        return obj;
    }

    delete obj[name];

    for (const prop in obj) {
        const value = obj[prop];
        if (Array.isArray(value)) {
            value.forEach((item) => stripProp(item, name));
        } else if (typeof value === "object") {
            stripProp(value, name);
        }
    }

    return obj;
};

Record.statics = {
    getURLFromID(locale, id) {
        // TODO(jeresig): Make this configurable
        return urls.gen(locale, `/artworks/${id}`);
    },

    fromData(tmpData, req, callback) {
        const Record = models("Record");
        const Image = models("Image");

        const lint = this.lintData(tmpData, req);
        const warnings = lint.warnings;

        if (lint.error) {
            return process.nextTick(() => callback(new Error(lint.error)));
        }

        const data = lint.data;
        const recordId = `${data.source}/${data.id}`;

        Record.findById(recordId, (err, record) => {
            const creating = !record;

            async.mapLimit(data.images, 2, (imageId, callback) => {
                Image.findById(imageId, (err, image) => {
                    if (!image) {
                        const fileName = imageId.replace(/^\w+[/]/, "");
                        warnings.push(req.format(req.gettext(
                            "Image file not found: %(fileName)s"),
                            {fileName}));
                    }

                    callback(null, image);
                });
            }, (err, images) => {
                /* istanbul ignore if */
                if (err) {
                    return callback(new Error(req.gettext(
                        "Error accessing image data.")));
                }

                // Filter out any missing images
                const filteredImages = images.filter((image) => !!image);

                if (filteredImages.length === 0) {
                    return callback(new Error(req.gettext(
                        "No images found.")));
                }

                data.defaultImageHash = filteredImages[0].hash;
                data.images = filteredImages.map((image) => image._id);

                let model = record;
                let original;

                if (creating) {
                    model = new Record(data);
                } else {
                    original = model.toJSON();
                    model.set(data);
                }

                model.validate((err) => {
                    /* istanbul ignore if */
                    if (err) {
                        return callback(new Error(req.gettext(
                            "There was an error with the data format.")));
                    }

                    if (!creating) {
                        model.diff = stripProp(
                            jdp.diff(original, model.toJSON()), "_id");
                    }

                    callback(null, model, warnings, creating);
                });
            });
        });
    },

    lintData(data, req, optionalSchema) {
        const schema = optionalSchema || Record;

        const cleaned = {};
        const warnings = [];
        let error;

        for (const field in data) {
            const options = schema.path(field);

            if (!options || internal.indexOf(field) >= 0) {
                warnings.push(req.format(req.gettext(
                    "Unrecognized field `%(field)s`."), {field}));
                continue;
            }
        }

        for (const field in schema.paths) {
            // Skip internal fields
            if (internal.indexOf(field) >= 0) {
                continue;
            }

            let value = data[field];
            const options = schema.path(field).options;

            if (value !== "" && value !== null && value !== undefined &&
                    (value.length === undefined || value.length > 0)) {
                const expectedType = getExpectedType(options, value);

                if (expectedType) {
                    value = null;
                    warnings.push(req.format(req.gettext(
                        "`%(field)s` is the wrong type. Expected a " +
                        "%(type)s."), {field, type: expectedType}));

                } else if (Array.isArray(options.type)) {
                    // Convert the value to its expected form, if a
                    // conversion method exists.
                    if (options.convert) {
                        value = value.map((obj) =>
                            options.convert(obj, data));
                    }

                    if (options.type[0].type) {
                        value = value.filter((entry) => {
                            const expectedType =
                                getExpectedType(options.type[0], entry);

                            if (expectedType) {
                                warnings.push(req.format(req.gettext(
                                    "`%(field)s` value is the wrong type." +
                                        " Expected a %(type)s."),
                                    {field, type: expectedType}));
                                return undefined;
                            }

                            return entry;
                        });
                    } else {
                        value = value.map((entry) => {
                            const results = this.lintData(entry, req,
                                options.type[0]);

                            if (results.error) {
                                warnings.push(
                                    `\`${field}\`: ${results.error}`);
                                return undefined;
                            }

                            for (const warning of results.warnings) {
                                warnings.push(
                                    `\`${field}\`: ${warning}`);
                            }

                            return results.data;
                        }).filter((entry) => !!entry);
                    }

                    // Validate the array entries
                    if (options.validateArray) {
                        const results = value.filter((entry) =>
                            options.validateArray(entry));

                        if (value.length !== results.length) {
                            warnings.push(options.validationMsg(req));
                        }

                        value = results;
                    }

                } else {
                    // Validate the value
                    if (options.validate && !options.validate(value)) {
                        value = null;
                        warnings.push(options.validationMsg(req));
                    }
                }
            }

            if (value === null || value === undefined || value === "" ||
                    value.length === 0) {
                if (options.required) {
                    error = req.format(req.gettext(
                        "Required field `%(field)s` is empty."), {field});
                    break;
                } else if (options.recommended) {
                    warnings.push(req.format(req.gettext(
                        "Recommended field `%(field)s` is empty."),
                        {field}));
                }
            } else {
                cleaned[field] = value;
            }
        }

        if (error) {
            return {error, warnings};
        }

        return {data: cleaned, warnings};
    },

    updateSimilarity(callback) {
        models("Record").findOne({
            needsSimilarUpdate: true,
        }, (err, record) => {
            if (err || !record) {
                return callback(err);
            }

            record.updateSimilarity((err) => {
                /* istanbul ignore if */
                if (err) {
                    console.error(err);
                    return callback(err);
                }

                record.save((err) => {
                    /* istanbul ignore if */
                    if (err) {
                        return callback(err);
                    }

                    callback(null, true);
                });
            });
        });
    },
};

// Dynamically generate the _id attribute
Record.pre("validate", function(next) {
    if (!this._id) {
        this._id = `${this.source}/${this.id}`;
    }
    next();
});

/* istanbul ignore next */
Record.pre("save", function(next) {
    // Always updated the modified time on every save
    this.modified = new Date();
    next();
});

module.exports = Record;
