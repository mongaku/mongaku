const async = require("async");
const validUrl = require("valid-url");
const jdp = require("jsondiffpatch").create({
    objectHash: (obj) => obj._id,
});

const recordModel = require("../lib/record");
const models = require("../lib/models");
const urls = require("../lib/urls");
const config = require("../lib/config");
const options = require("../lib/options");
const metadata = require("../lib/metadata");

const Record = {};

Record.schema = {
    // UUID of the image (Format: SOURCE/ID)
    _id: {
        type: String,
        es_indexed: true,
    },

    // Source ID
    id: {
        type: String,
        validate: (v) => /^[a-z0-9_-]+$/i.test(v),
        validationMsg: (i18n) => i18n.gettext("IDs can only contain " +
            "letters, numbers, underscores, and hyphens."),
        required: true,
        es_indexed: true,
    },

    // The type of the record
    type:  {
        type: String,
        required: true,
        es_indexed: true,
    },

    // The date that this item was created
    created: {
        type: Date,
        default: Date.now,
        es_indexed: true,
    },

    // The date that this item was updated
    modified: {
        type: Date,
        default: Date.now,
        es_indexed: true,
    },

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
        es_type: "string",
        // A raw name to use for building aggregations in Elasticsearch
        es_fields: {
            name: {type: "string", index: "analyzed"},
            raw: {type: "string", index: "not_analyzed"},
        },
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
        validate: (v) => validUrl.isHttpsUri(v) || validUrl.isHttpUri(v),
        validationMsg: (i18n) => i18n.gettext("`url` must be properly-" +
            "formatted URL."),
    },

    // A hash to use to render an image representing the record
    defaultImageHash: {
        type: String,
    },

    // The images associated with the record
    images: {
        type: [{type: String, ref: "Image"}],
        validateArray: (v) => /^\w+\/[a-z0-9_-]+\.jpe?g$/i.test(v),
        validationMsg: (i18n) => i18n.gettext("Images must be a valid " +
            "image file name. For example: `image.jpg`."),
        convert: (name, data) => `${data.source}/${name}`,
    },

    // Images associated with the record that haven't been uploaded yet
    missingImages: {
        type: [String],
        validateArray: (v) => /^\w+\/[a-z0-9_-]+\.jpe?g$/i.test(v),
        validationMsg: (i18n) => i18n.gettext("Images must be a valid " +
            "image file name. For example: `image.jpg`."),
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
};

Record.methods = {
    getURL(locale) {
        return recordModel(this.type).getURLFromID(locale, this._id);
    },

    getEditURL(locale) {
        return `${this.getURL(locale)}/edit`;
    },

    getCreateURL(locale) {
        return urls.gen(locale, `/${this.type}/${this.source}/create`);
    },

    getCloneURL(locale) {
        return `${this.getURL(locale)}/clone`;
    },

    getRemoveImageURL(locale) {
        return `${this.getURL(locale)}/remove-image`;
    },

    getOriginalURL() {
        return urls.genData(
            `/${this.source}/images/${this.defaultImageHash}.jpg`);
    },

    getThumbURL() {
        if (!this.defaultImageHash) {
            return options.types[this.type].defaultImage;
        }

        return urls.genData(
            `/${this.source}/thumbs/${this.defaultImageHash}.jpg`);
    },

    getTitle(i18n) {
        return options.types[this.type].recordTitle(this, i18n);
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

    getDynamicValues(i18n, callback) {
        const model = metadata.model(this.type);

        async.mapValues(model, (propModel, propName, callback) => {
            const value = this[propName];
            if (propModel.loadDynamicValue && value !== undefined) {
                propModel.loadDynamicValue(value, i18n, callback);
            } else {
                callback(null, value);
            }
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

            recordModel(this.type).find({
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
                        if (similar.recordModel) {
                            return process.nextTick(() =>
                                callback(null, similar));
                        }

                        recordModel(this.type).findById(similar.record,
                            (err, record) => {
                                /* istanbul ignore if */
                                if (err || !record) {
                                    return callback();
                                }

                                similar.recordModel = record;
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
    "batch", "needsSimilarUpdate", "similarRecords"];

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

    if (options.type === Date) {
        return (typeof value === "string" || value instanceof Date) ?
            false : "date";
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
        const type = this.getType();
        return urls.gen(locale, `/${type}/${id}`);
    },

    fromData(tmpData, i18n, callback) {
        const Record = recordModel(this.getType());
        const Image = models("Image");

        const lint = this.lintData(tmpData, i18n);
        const warnings = lint.warnings;

        if (lint.error) {
            return process.nextTick(() => callback(new Error(lint.error)));
        }

        const data = lint.data;
        const recordId = `${data.source}/${data.id}`;
        const missingImages = [];
        const typeOptions = options.types[this.getType()];

        Record.findById(recordId, (err, record) => {
            const creating = !record;

            async.mapLimit(data.images || [], 2, (imageId, callback) => {
                Image.findById(imageId, (err, image) => {
                    if (!image) {
                        const fileName = imageId.replace(/^\w+[/]/, "");
                        missingImages.push(imageId);
                        warnings.push(i18n.format(i18n.gettext(
                            "Image file not found: %(fileName)s"),
                            {fileName}));
                    }

                    callback(null, image);
                });
            }, (err, images) => {
                /* istanbul ignore if */
                if (err) {
                    return callback(new Error(i18n.gettext(
                        "Error accessing image data.")));
                }

                if (typeOptions.hasImages()) {
                    // Filter out any missing images
                    const filteredImages = images.filter((image) => !!image);

                    if (filteredImages.length === 0) {
                        const errMsg = i18n.gettext("No images found.");

                        if (typeOptions.imagesRequired) {
                            return callback(new Error(errMsg));
                        }

                        warnings.push(errMsg);

                    } else {
                        data.defaultImageHash = filteredImages[0].hash;
                    }

                    data.images = filteredImages.map((image) => image._id);
                    data.missingImages = missingImages;
                }

                let model = record;
                let original;

                if (creating) {
                    model = new Record(data);
                } else {
                    original = model.toJSON();
                    model.set(data);

                    // Delete missing fields
                    const {schema} = Record;

                    for (const field in schema.paths) {
                        // Skip internal fields
                        if (internal.indexOf(field) >= 0) {
                            continue;
                        }

                        if (data[field] === undefined && model[field] &&
                                (model[field].length === undefined ||
                                    model[field].length > 0)) {
                            model[field] = undefined;
                        }
                    }
                }

                model.validate((err) => {
                    /* istanbul ignore if */
                    if (err) {
                        const msg = i18n.gettext(
                            "There was an error with the data format.");
                        const errors = Object.keys(err.errors)
                            .map((path) => err.errors[path].message)
                            .join(", ");
                        return callback(new Error(`${msg} ${errors}`));
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

    lintData(data, i18n, optionalSchema) {
        const schema = optionalSchema ||
            recordModel(this.getType()).schema;

        const cleaned = {};
        const warnings = [];
        let error;

        for (const field in data) {
            const options = schema.path(field);

            if (!options || internal.indexOf(field) >= 0) {
                warnings.push(i18n.format(i18n.gettext(
                    "Unrecognized field `%(field)s`."), {field}));
                continue;
            }
        }

        for (const field in schema.paths) {
            // Skip internal fields
            if (internal.indexOf(field) >= 0) {
                continue;
            }

            let value = data && data[field];
            const options = schema.path(field).options;

            if (value !== "" && value !== null && value !== undefined &&
                    (value.length === undefined || value.length > 0)) {
                // Coerce single items that should be arrays into arrays
                if (Array.isArray(options.type) && !Array.isArray(value)) {
                    value = [value];
                }

                // Coerce numbers that are strings into numbers
                if (options.type === Number && typeof value === "string") {
                    value = parseFloat(value);
                }

                const expectedType = getExpectedType(options, value);

                if (expectedType) {
                    value = null;
                    warnings.push(i18n.format(i18n.gettext(
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
                                warnings.push(i18n.format(i18n.gettext(
                                    "`%(field)s` value is the wrong type." +
                                        " Expected a %(type)s."),
                                    {field, type: expectedType}));
                                return undefined;
                            }

                            return entry;
                        });
                    } else {
                        value = value.map((entry) => {
                            const results = this.lintData(entry, i18n,
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
                            warnings.push(options.validationMsg(i18n));
                        }

                        value = results;
                    }

                } else {
                    // Validate the value
                    if (options.validate && !options.validate(value)) {
                        value = null;
                        warnings.push(options.validationMsg(i18n));
                    }
                }
            }

            if (value === null || value === undefined || value === "" ||
                    value.length === 0) {
                if (options.required) {
                    error = i18n.format(i18n.gettext(
                        "Required field `%(field)s` is empty."), {field});
                    break;
                } else if (options.recommended) {
                    warnings.push(i18n.format(i18n.gettext(
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
        recordModel(this.getType()).findOne({
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

    getFacets(req, callback) {
        const {lang} = req;

        if (!this.facetCache) {
            this.facetCache = {};
        }

        if (this.facetCache[lang]) {
            return process.nextTick(() =>
                callback(null, this.facetCache[lang]));
        }

        const search = require("../logic/shared/search");

        search({
            type: this.getType(),
            noRedirect: true,
        }, req, (err, results) => {
            if (err) {
                return callback(err);
            }

            const facets = {};

            for (const facet of results.facets) {
                facets[facet.field] = facet.buckets;
            }

            this.facetCache[lang] = facets;
            callback(null, facets);
        });
    },
};

module.exports = Record;
