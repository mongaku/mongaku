"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var async = require("async");
var validUrl = require("valid-url");
var jdp = require("jsondiffpatch").create({
    objectHash: function objectHash(obj) {
        return obj._id;
    }
});

var recordModel = require("../lib/record");
var models = require("../lib/models");
var urls = require("../lib/urls");
var config = require("../lib/config");
var options = require("../lib/options");
var metadata = require("../lib/metadata");

var Record = {};

Record.schema = {
    // UUID of the image (Format: SOURCE/ID)
    _id: {
        type: String,
        es_indexed: true
    },

    // Source ID
    id: {
        type: String,
        validate: function validate(v) {
            return (/^[a-z0-9_-]+$/i.test(v)
            );
        },
        validationMsg: function validationMsg(req) {
            return req.gettext("IDs can only contain " + "letters, numbers, underscores, and hyphens.");
        },
        required: true,
        es_indexed: true
    },

    // The type of the record
    type: {
        type: String,
        required: true,
        es_indexed: true
    },

    // The date that this item was created
    created: {
        type: Date,
        default: Date.now,
        es_indexed: true
    },

    // The date that this item was updated
    modified: {
        type: Date,
        default: Date.now,
        es_indexed: true
    },

    // The most recent batch in which the record data was uploaded
    batch: {
        type: String,
        ref: "RecordImport"
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
            name: { type: "string", index: "analyzed" },
            raw: { type: "string", index: "not_analyzed" }
        },
        required: true
    },

    // The language of the page from where the data is being extracted. This
    // will influence how extracted text is handled.
    lang: {
        type: String,
        required: true
    },

    // A link to the record at its source
    url: {
        type: String,
        validate: function validate(v) {
            return validUrl.isHttpsUri(v) || validUrl.isHttpUri(v);
        },
        validationMsg: function validationMsg(req) {
            return req.gettext("`url` must be properly-" + "formatted URL.");
        }
    },

    // A hash to use to render an image representing the record
    defaultImageHash: {
        type: String
    },

    // The images associated with the record
    images: {
        type: [{ type: String, ref: "Image" }],
        validateArray: function validateArray(v) {
            return (/^\w+\/[a-z0-9_-]+\.jpe?g$/i.test(v)
            );
        },
        validationMsg: function validationMsg(req) {
            return req.gettext("Images must be a valid " + "image file name. For example: `image.jpg`.");
        },
        convert: function convert(name, data) {
            return data.source + "/" + name;
        }
    },

    // Images associated with the record that haven't been uploaded yet
    missingImages: {
        type: [String],
        validateArray: function validateArray(v) {
            return (/^\w+\/[a-z0-9_-]+\.jpe?g$/i.test(v)
            );
        },
        validationMsg: function validationMsg(req) {
            return req.gettext("Images must be a valid " + "image file name. For example: `image.jpg`.");
        }
    },

    // Keep track of if the record needs to update its record similarity
    needsSimilarUpdate: {
        type: Boolean,
        default: false
    },

    // Computed by looking at the results of images.similarImages
    similarRecords: [{
        _id: String,

        record: {
            type: String,
            required: true
        },

        images: {
            type: [String],
            required: true
        },

        source: {
            type: String,
            es_indexed: true,
            required: true
        },

        score: {
            type: Number,
            es_indexed: true,
            required: true,
            min: 1
        }
    }]
};

Record.methods = {
    getURL: function getURL(locale) {
        return recordModel(this.type).getURLFromID(locale, this._id);
    },
    getEditURL: function getEditURL(locale) {
        return this.getURL(locale) + "/edit";
    },
    getCreateURL: function getCreateURL(locale) {
        return urls.gen(locale, "/" + this.type + "/" + this.source + "/create");
    },
    getCloneURL: function getCloneURL(locale) {
        return this.getURL(locale) + "/clone";
    },
    getRemoveImageURL: function getRemoveImageURL(locale) {
        return this.getURL(locale) + "/remove-image";
    },
    getOriginalURL: function getOriginalURL() {
        return urls.genData("/" + this.source + "/images/" + this.defaultImageHash + ".jpg");
    },
    getThumbURL: function getThumbURL() {
        if (!this.defaultImageHash) {
            return options.types[this.type].defaultImage;
        }

        return urls.genData("/" + this.source + "/thumbs/" + this.defaultImageHash + ".jpg");
    },
    getTitle: function getTitle(i18n) {
        return options.types[this.type].recordTitle(this, i18n);
    },
    getSource: function getSource() {
        return models("Source").getSource(this.source);
    },
    getImages: function getImages(callback) {
        async.mapLimit(this.images, 4, function (id, callback) {
            if (typeof id !== "string") {
                return process.nextTick(function () {
                    return callback(null, id);
                });
            }
            models("Image").findById(id, callback);
        }, callback);
    },
    getDynamicValues: function getDynamicValues(i18n, callback) {
        var _this = this;

        var model = metadata.model(this.type);

        async.mapValues(model, function (propModel, propName, callback) {
            var value = _this[propName];
            if (propModel.loadDynamicValue && value !== undefined) {
                propModel.loadDynamicValue(value, i18n, callback);
            } else {
                callback(null, value);
            }
        }, callback);
    },
    updateSimilarity: function updateSimilarity(callback) {
        var _this2 = this;

        /* istanbul ignore if */
        if (config.NODE_ENV !== "test") {
            console.log("Updating Similarity", this._id);
        }

        this.getImages(function (err, images) {
            /* istanbul ignore if */
            if (err) {
                return callback(err);
            }

            // Calculate record matches before saving
            var matches = images.map(function (image) {
                return image.similarImages;
            }).reduce(function (a, b) {
                return a.concat(b);
            }, []);
            var scores = matches.reduce(function (obj, match) {
                obj[match._id] = Math.max(match.score, obj[match._id] || 0);
                return obj;
            }, {});

            if (matches.length === 0) {
                _this2.needsSimilarUpdate = false;
                return callback();
            }

            var matchIds = matches.map(function (match) {
                return match._id;
            });
            var query = matches.map(function (match) {
                return {
                    images: match._id
                };
            });

            recordModel(_this2.type).find({
                $or: query,
                _id: { $ne: _this2._id }
            }, function (err, records) {
                /* istanbul ignore if */
                if (err) {
                    return callback(err);
                }

                _this2.similarRecords = records.map(function (similar) {
                    var score = similar.images.map(function (image) {
                        return scores[image] || 0;
                    }).reduce(function (a, b) {
                        return a + b;
                    });

                    return {
                        _id: similar._id,
                        record: similar._id,
                        images: similar.images.filter(function (id) {
                            return matchIds.indexOf(id) >= 0;
                        }),
                        score: score,
                        source: similar.source
                    };
                }).filter(function (similar) {
                    return similar.score > 0;
                }).sort(function (a, b) {
                    return b.score - a.score;
                });

                _this2.needsSimilarUpdate = false;
                callback();
            });
        });
    },
    loadImages: function loadImages(loadSimilarRecords, callback) {
        var _this3 = this;

        async.parallel([function (callback) {
            _this3.getImages(function (err, images) {
                // We filter out any invalid/un-found images
                // TODO: We should log out some details on when this
                // happens (hopefully never).
                _this3.images = images.filter(function (image) {
                    return !!image;
                });
                callback();
            });
        }, function (callback) {
            if (!loadSimilarRecords) {
                return process.nextTick(callback);
            }

            async.mapLimit(_this3.similarRecords, 4, function (similar, callback) {
                if (similar.recordModel) {
                    return process.nextTick(function () {
                        return callback(null, similar);
                    });
                }

                recordModel(_this3.type).findById(similar.record, function (err, record) {
                    /* istanbul ignore if */
                    if (err || !record) {
                        return callback();
                    }

                    similar.recordModel = record;
                    callback(null, similar);
                });
            }, function (err, similar) {
                // We filter out any invalid/un-found records
                // TODO: We should log out some details on when this
                // happens (hopefully never).
                _this3.similarRecords = similar.filter(function (similar) {
                    return !!similar;
                });
                callback();
            });
        }], callback);
    }
};

var internal = ["_id", "__v", "created", "modified", "defaultImageHash", "batch", "needsSimilarUpdate", "similarRecords"];

var getExpectedType = function getExpectedType(options, value) {
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
        return typeof value === "string" || value instanceof Date ? false : "date";
    }

    // Defaults to type of String
    return typeof value === "string" ? false : "string";
};

var stripProp = function stripProp(obj, name) {
    if (!obj) {
        return obj;
    }

    delete obj[name];

    for (var prop in obj) {
        var value = obj[prop];
        if (Array.isArray(value)) {
            value.forEach(function (item) {
                return stripProp(item, name);
            });
        } else if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
            stripProp(value, name);
        }
    }

    return obj;
};

Record.statics = {
    getURLFromID: function getURLFromID(locale, id) {
        var type = this.getType();
        return urls.gen(locale, "/" + type + "/" + id);
    },
    fromData: function fromData(tmpData, req, callback) {
        var Record = recordModel(this.getType());
        var Image = models("Image");

        var lint = this.lintData(tmpData, req);
        var warnings = lint.warnings;

        if (lint.error) {
            return process.nextTick(function () {
                return callback(new Error(lint.error));
            });
        }

        var data = lint.data;
        var recordId = data.source + "/" + data.id;
        var missingImages = [];
        var typeOptions = options.types[this.getType()];

        Record.findById(recordId, function (err, record) {
            var creating = !record;

            async.mapLimit(data.images || [], 2, function (imageId, callback) {
                Image.findById(imageId, function (err, image) {
                    if (!image) {
                        var fileName = imageId.replace(/^\w+[/]/, "");
                        missingImages.push(imageId);
                        warnings.push(req.format(req.gettext("Image file not found: %(fileName)s"), { fileName: fileName }));
                    }

                    callback(null, image);
                });
            }, function (err, images) {
                /* istanbul ignore if */
                if (err) {
                    return callback(new Error(req.gettext("Error accessing image data.")));
                }

                if (typeOptions.hasImages()) {
                    // Filter out any missing images
                    var filteredImages = images.filter(function (image) {
                        return !!image;
                    });

                    if (filteredImages.length === 0) {
                        var errMsg = req.gettext("No images found.");

                        if (typeOptions.imagesRequired) {
                            return callback(new Error(errMsg));
                        }

                        warnings.push(errMsg);
                    } else {
                        data.defaultImageHash = filteredImages[0].hash;
                    }

                    data.images = filteredImages.map(function (image) {
                        return image._id;
                    });
                    data.missingImages = missingImages;
                }

                var model = record;
                var original = void 0;

                if (creating) {
                    model = new Record(data);
                } else {
                    original = model.toJSON();
                    model.set(data);

                    // Delete missing fields
                    var schema = Record.schema;


                    for (var field in schema.paths) {
                        // Skip internal fields
                        if (internal.indexOf(field) >= 0) {
                            continue;
                        }

                        if (data[field] === undefined && model[field] && (model[field].length === undefined || model[field].length > 0)) {
                            model[field] = undefined;
                        }
                    }
                }

                model.validate(function (err) {
                    /* istanbul ignore if */
                    if (err) {
                        var msg = req.gettext("There was an error with the data format.");
                        var errors = Object.keys(err.errors).map(function (path) {
                            return err.errors[path].message;
                        }).join(", ");
                        return callback(new Error(msg + " " + errors));
                    }

                    if (!creating) {
                        model.diff = stripProp(jdp.diff(original, model.toJSON()), "_id");
                    }

                    callback(null, model, warnings, creating);
                });
            });
        });
    },
    lintData: function lintData(data, req, optionalSchema) {
        var _this4 = this;

        var schema = optionalSchema || recordModel(this.getType()).schema;

        var cleaned = {};
        var warnings = [];
        var error = void 0;

        for (var field in data) {
            var _options = schema.path(field);

            if (!_options || internal.indexOf(field) >= 0) {
                warnings.push(req.format(req.gettext("Unrecognized field `%(field)s`."), { field: field }));
                continue;
            }
        }

        var _loop = function _loop(_field) {
            // Skip internal fields
            if (internal.indexOf(_field) >= 0) {
                return "continue";
            }

            var value = data && data[_field];
            var options = schema.path(_field).options;

            if (value !== "" && value !== null && value !== undefined && (value.length === undefined || value.length > 0)) {
                // Coerce single items that should be arrays into arrays
                if (Array.isArray(options.type) && !Array.isArray(value)) {
                    value = [value];
                }

                // Coerce numbers that are strings into numbers
                if (options.type === Number && typeof value === "string") {
                    value = parseFloat(value);
                }

                var expectedType = getExpectedType(options, value);

                if (expectedType) {
                    value = null;
                    warnings.push(req.format(req.gettext("`%(field)s` is the wrong type. Expected a " + "%(type)s."), { field: _field, type: expectedType }));
                } else if (Array.isArray(options.type)) {
                    // Convert the value to its expected form, if a
                    // conversion method exists.
                    if (options.convert) {
                        value = value.map(function (obj) {
                            return options.convert(obj, data);
                        });
                    }

                    if (options.type[0].type) {
                        value = value.filter(function (entry) {
                            var expectedType = getExpectedType(options.type[0], entry);

                            if (expectedType) {
                                warnings.push(req.format(req.gettext("`%(field)s` value is the wrong type." + " Expected a %(type)s."), { field: _field, type: expectedType }));
                                return undefined;
                            }

                            return entry;
                        });
                    } else {
                        value = value.map(function (entry) {
                            var results = _this4.lintData(entry, req, options.type[0]);

                            if (results.error) {
                                warnings.push("`" + _field + "`: " + results.error);
                                return undefined;
                            }

                            var _iteratorNormalCompletion = true;
                            var _didIteratorError = false;
                            var _iteratorError = undefined;

                            try {
                                for (var _iterator = results.warnings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                    var warning = _step.value;

                                    warnings.push("`" + _field + "`: " + warning);
                                }
                            } catch (err) {
                                _didIteratorError = true;
                                _iteratorError = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion && _iterator.return) {
                                        _iterator.return();
                                    }
                                } finally {
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                            }

                            return results.data;
                        }).filter(function (entry) {
                            return !!entry;
                        });
                    }

                    // Validate the array entries
                    if (options.validateArray) {
                        var _results = value.filter(function (entry) {
                            return options.validateArray(entry);
                        });

                        if (value.length !== _results.length) {
                            warnings.push(options.validationMsg(req));
                        }

                        value = _results;
                    }
                } else {
                    // Validate the value
                    if (options.validate && !options.validate(value)) {
                        value = null;
                        warnings.push(options.validationMsg(req));
                    }
                }
            }

            if (value === null || value === undefined || value === "" || value.length === 0) {
                if (options.required) {
                    error = req.format(req.gettext("Required field `%(field)s` is empty."), { field: _field });
                    return "break";
                } else if (options.recommended) {
                    warnings.push(req.format(req.gettext("Recommended field `%(field)s` is empty."), { field: _field }));
                }
            } else {
                cleaned[_field] = value;
            }
        };

        _loop2: for (var _field in schema.paths) {
            var _ret = _loop(_field);

            switch (_ret) {
                case "continue":
                    continue;

                case "break":
                    break _loop2;}
        }

        if (error) {
            return { error: error, warnings: warnings };
        }

        return { data: cleaned, warnings: warnings };
    },
    updateSimilarity: function updateSimilarity(callback) {
        recordModel(this.getType()).findOne({
            needsSimilarUpdate: true
        }, function (err, record) {
            if (err || !record) {
                return callback(err);
            }

            record.updateSimilarity(function (err) {
                /* istanbul ignore if */
                if (err) {
                    console.error(err);
                    return callback(err);
                }

                record.save(function (err) {
                    /* istanbul ignore if */
                    if (err) {
                        return callback(err);
                    }

                    callback(null, true);
                });
            });
        });
    },
    getFacets: function getFacets(req, callback) {
        var _this5 = this;

        if (!this.facetCache) {
            this.facetCache = {};
        }

        if (this.facetCache[req.lang]) {
            return process.nextTick(function () {
                return callback(null, _this5.facetCache[req.lang]);
            });
        }

        var search = require("../logic/shared/search");

        search({
            type: this.getType(),
            noRedirect: true
        }, req, function (err, results) {
            if (err) {
                return callback(err);
            }

            var facets = {};

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = results.facets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var facet = _step2.value;

                    facets[facet.field] = facet.buckets;
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            _this5.facetCache[req.lang] = facets;
            callback(null, facets);
        });
    }
};

module.exports = Record;