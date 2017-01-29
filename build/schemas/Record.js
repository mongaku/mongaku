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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL1JlY29yZC5qcyJdLCJuYW1lcyI6WyJhc3luYyIsInJlcXVpcmUiLCJ2YWxpZFVybCIsImpkcCIsImNyZWF0ZSIsIm9iamVjdEhhc2giLCJvYmoiLCJfaWQiLCJyZWNvcmRNb2RlbCIsIm1vZGVscyIsInVybHMiLCJjb25maWciLCJvcHRpb25zIiwibWV0YWRhdGEiLCJSZWNvcmQiLCJzY2hlbWEiLCJ0eXBlIiwiU3RyaW5nIiwiZXNfaW5kZXhlZCIsImlkIiwidmFsaWRhdGUiLCJ2IiwidGVzdCIsInZhbGlkYXRpb25Nc2ciLCJyZXEiLCJnZXR0ZXh0IiwicmVxdWlyZWQiLCJjcmVhdGVkIiwiRGF0ZSIsImRlZmF1bHQiLCJub3ciLCJtb2RpZmllZCIsImJhdGNoIiwicmVmIiwic291cmNlIiwiZXNfdHlwZSIsImVzX2ZpZWxkcyIsIm5hbWUiLCJpbmRleCIsInJhdyIsImxhbmciLCJ1cmwiLCJpc0h0dHBzVXJpIiwiaXNIdHRwVXJpIiwiZGVmYXVsdEltYWdlSGFzaCIsImltYWdlcyIsInZhbGlkYXRlQXJyYXkiLCJjb252ZXJ0IiwiZGF0YSIsIm1pc3NpbmdJbWFnZXMiLCJuZWVkc1NpbWlsYXJVcGRhdGUiLCJCb29sZWFuIiwic2ltaWxhclJlY29yZHMiLCJyZWNvcmQiLCJzY29yZSIsIk51bWJlciIsIm1pbiIsIm1ldGhvZHMiLCJnZXRVUkwiLCJsb2NhbGUiLCJnZXRVUkxGcm9tSUQiLCJnZXRFZGl0VVJMIiwiZ2V0Q3JlYXRlVVJMIiwiZ2VuIiwiZ2V0Q2xvbmVVUkwiLCJnZXRSZW1vdmVJbWFnZVVSTCIsImdldE9yaWdpbmFsVVJMIiwiZ2VuRGF0YSIsImdldFRodW1iVVJMIiwidHlwZXMiLCJkZWZhdWx0SW1hZ2UiLCJnZXRUaXRsZSIsImkxOG4iLCJyZWNvcmRUaXRsZSIsImdldFNvdXJjZSIsImdldEltYWdlcyIsImNhbGxiYWNrIiwibWFwTGltaXQiLCJwcm9jZXNzIiwibmV4dFRpY2siLCJmaW5kQnlJZCIsImdldER5bmFtaWNWYWx1ZXMiLCJtb2RlbCIsIm1hcFZhbHVlcyIsInByb3BNb2RlbCIsInByb3BOYW1lIiwidmFsdWUiLCJsb2FkRHluYW1pY1ZhbHVlIiwidW5kZWZpbmVkIiwidXBkYXRlU2ltaWxhcml0eSIsIk5PREVfRU5WIiwiY29uc29sZSIsImxvZyIsImVyciIsIm1hdGNoZXMiLCJtYXAiLCJpbWFnZSIsInNpbWlsYXJJbWFnZXMiLCJyZWR1Y2UiLCJhIiwiYiIsImNvbmNhdCIsInNjb3JlcyIsIm1hdGNoIiwiTWF0aCIsIm1heCIsImxlbmd0aCIsIm1hdGNoSWRzIiwicXVlcnkiLCJmaW5kIiwiJG9yIiwiJG5lIiwicmVjb3JkcyIsInNpbWlsYXIiLCJmaWx0ZXIiLCJpbmRleE9mIiwic29ydCIsImxvYWRJbWFnZXMiLCJsb2FkU2ltaWxhclJlY29yZHMiLCJwYXJhbGxlbCIsImludGVybmFsIiwiZ2V0RXhwZWN0ZWRUeXBlIiwiQXJyYXkiLCJpc0FycmF5Iiwic3RyaXBQcm9wIiwicHJvcCIsImZvckVhY2giLCJpdGVtIiwic3RhdGljcyIsImdldFR5cGUiLCJmcm9tRGF0YSIsInRtcERhdGEiLCJJbWFnZSIsImxpbnQiLCJsaW50RGF0YSIsIndhcm5pbmdzIiwiZXJyb3IiLCJFcnJvciIsInJlY29yZElkIiwidHlwZU9wdGlvbnMiLCJjcmVhdGluZyIsImltYWdlSWQiLCJmaWxlTmFtZSIsInJlcGxhY2UiLCJwdXNoIiwiZm9ybWF0IiwiaGFzSW1hZ2VzIiwiZmlsdGVyZWRJbWFnZXMiLCJlcnJNc2ciLCJpbWFnZXNSZXF1aXJlZCIsImhhc2giLCJvcmlnaW5hbCIsInRvSlNPTiIsInNldCIsImZpZWxkIiwicGF0aHMiLCJtc2ciLCJlcnJvcnMiLCJPYmplY3QiLCJrZXlzIiwicGF0aCIsIm1lc3NhZ2UiLCJqb2luIiwiZGlmZiIsIm9wdGlvbmFsU2NoZW1hIiwiY2xlYW5lZCIsInBhcnNlRmxvYXQiLCJleHBlY3RlZFR5cGUiLCJlbnRyeSIsInJlc3VsdHMiLCJ3YXJuaW5nIiwicmVjb21tZW5kZWQiLCJmaW5kT25lIiwic2F2ZSIsImdldEZhY2V0cyIsImZhY2V0Q2FjaGUiLCJzZWFyY2giLCJub1JlZGlyZWN0IiwiZmFjZXRzIiwiZmFjZXQiLCJidWNrZXRzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQU1BLFFBQVFDLFFBQVEsT0FBUixDQUFkO0FBQ0EsSUFBTUMsV0FBV0QsUUFBUSxXQUFSLENBQWpCO0FBQ0EsSUFBTUUsTUFBTUYsUUFBUSxlQUFSLEVBQXlCRyxNQUF6QixDQUFnQztBQUN4Q0MsZ0JBQVksb0JBQUNDLEdBQUQ7QUFBQSxlQUFTQSxJQUFJQyxHQUFiO0FBQUE7QUFENEIsQ0FBaEMsQ0FBWjs7QUFJQSxJQUFNQyxjQUFjUCxRQUFRLGVBQVIsQ0FBcEI7QUFDQSxJQUFNUSxTQUFTUixRQUFRLGVBQVIsQ0FBZjtBQUNBLElBQU1TLE9BQU9ULFFBQVEsYUFBUixDQUFiO0FBQ0EsSUFBTVUsU0FBU1YsUUFBUSxlQUFSLENBQWY7QUFDQSxJQUFNVyxVQUFVWCxRQUFRLGdCQUFSLENBQWhCO0FBQ0EsSUFBTVksV0FBV1osUUFBUSxpQkFBUixDQUFqQjs7QUFFQSxJQUFNYSxTQUFTLEVBQWY7O0FBRUFBLE9BQU9DLE1BQVAsR0FBZ0I7QUFDWjtBQUNBUixTQUFLO0FBQ0RTLGNBQU1DLE1BREw7QUFFREMsb0JBQVk7QUFGWCxLQUZPOztBQU9aO0FBQ0FDLFFBQUk7QUFDQUgsY0FBTUMsTUFETjtBQUVBRyxrQkFBVSxrQkFBQ0MsQ0FBRDtBQUFBLG1CQUFPLGtCQUFpQkMsSUFBakIsQ0FBc0JELENBQXRCO0FBQVA7QUFBQSxTQUZWO0FBR0FFLHVCQUFlLHVCQUFDQyxHQUFEO0FBQUEsbUJBQVNBLElBQUlDLE9BQUosQ0FBWSwwQkFDaEMsNkNBRG9CLENBQVQ7QUFBQSxTQUhmO0FBS0FDLGtCQUFVLElBTFY7QUFNQVIsb0JBQVk7QUFOWixLQVJROztBQWlCWjtBQUNBRixVQUFPO0FBQ0hBLGNBQU1DLE1BREg7QUFFSFMsa0JBQVUsSUFGUDtB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QURvQjtBQUFBLGFBQWpCLENBQVA7QUFFSDs7QUFFRCxZQUFNd0ksU0FBUy9LLFFBQVEsd0JBQVIsQ0FBZjs7QUFFQStLLGVBQU87QUFDSGhLLGtCQUFNLEtBQUtpSCxPQUFMLEVBREg7QUFFSGdELHdCQUFZO0FBRlQsU0FBUCxFQUdHekosR0FISCxFQUdRLFVBQUNxRSxHQUFELEVBQU00RSxPQUFOLEVBQWtCO0FBQ3RCLGdCQUFJNUUsR0FBSixFQUFTO0FBQ0wsdUJBQU9qQixTQUFTaUIsR0FBVCxDQUFQO0FBQ0g7O0FBRUQsZ0JBQU1xRixTQUFTLEVBQWY7O0FBTHNCO0FBQUE7QUFBQTs7QUFBQTtBQU90QixzQ0FBb0JULFFBQVFTLE1BQTVCLG1JQUFvQztBQUFBLHdCQUF6QkMsS0FBeUI7O0FBQ2hDRCwyQkFBT0MsTUFBTXpCLEtBQWIsSUFBc0J5QixNQUFNQyxPQUE1QjtBQUNIO0FBVHFCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBV3RCLG1CQUFLTCxVQUFMLENBQWdCdkosSUFBSWdCLElBQXBCLElBQTRCMEksTUFBNUI7QUFDQXRHLHFCQUFTLElBQVQsRUFBZXNHLE1BQWY7QUFDSCxTQWhCRDtBQWlCSDtBQS9TWSxDQUFqQjs7QUFrVEFHLE9BQU9DLE9BQVAsR0FBaUJ4SyxNQUFqQiIsImZpbGUiOiJSZWNvcmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBhc3luYyA9IHJlcXVpcmUoXCJhc3luY1wiKTtcbmNvbnN0IHZhbGlkVXJsID0gcmVxdWlyZShcInZhbGlkLXVybFwiKTtcbmNvbnN0IGpkcCA9IHJlcXVpcmUoXCJqc29uZGlmZnBhdGNoXCIpLmNyZWF0ZSh7XG4gICAgb2JqZWN0SGFzaDogKG9iaikgPT4gb2JqLl9pZCxcbn0pO1xuXG5jb25zdCByZWNvcmRNb2RlbCA9IHJlcXVpcmUoXCIuLi9saWIvcmVjb3JkXCIpO1xuY29uc3QgbW9kZWxzID0gcmVxdWlyZShcIi4uL2xpYi9tb2RlbHNcIik7XG5jb25zdCB1cmxzID0gcmVxdWlyZShcIi4uL2xpYi91cmxzXCIpO1xuY29uc3QgY29uZmlnID0gcmVxdWlyZShcIi4uL2xpYi9jb25maWdcIik7XG5jb25zdCBvcHRpb25zID0gcmVxdWlyZShcIi4uL2xpYi9vcHRpb25zXCIpO1xuY29uc3QgbWV0YWRhdGEgPSByZXF1aXJlKFwiLi4vbGliL21ldGFkYXRhXCIpO1xuXG5jb25zdCBSZWNvcmQgPSB7fTtcblxuUmVjb3JkLnNjaGVtYSA9IHtcbiAgICAvLyBVVUlEIG9mIHRoZSBpbWFnZSAoRm9ybWF0OiBTT1VSQ0UvSUQpXG4gICAgX2lkOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgZXNfaW5kZXhlZDogdHJ1ZSxcbiAgICB9LFxuXG4gICAgLy8gU291cmNlIElEXG4gICAgaWQ6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICB2YWxpZGF0ZTogKHYpID0+IC9eW2EtejAtOV8tXSskL2kudGVzdCh2KSxcbiAgICAgICAgdmFsaWRhdGlvbk1zZzogKHJlcSkgPT4gcmVxLmdldHRleHQoXCJJRHMgY2FuIG9ubHkgY29udGFpbiBcIiArXG4gICAgICAgICAgICBcImxldHRlcnMsIG51bWJlcnMsIHVuZGVyc2NvcmVzLCBhbmQgaHlwaGVucy5cIiksXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICBlc19pbmRleGVkOiB0cnVlLFxuICAgIH0sXG5cbiAgICAvLyBUaGUgdHlwZSBvZiB0aGUgcmVjb3JkXG4gICAgdHlwZTogIHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgZXNfaW5kZXhlZDogdHJ1ZSxcbiAgICB9LFxuXG4gICAgLy8gVGhlIGRhdGUgdGhhdCB0aGlzIGl0ZW0gd2FzIGNyZWF0ZWRcbiAgICBjcmVhdGVkOiB7XG4gICAgICAgIHR5cGU6IERhdGUsXG4gICAgICAgIGRlZmF1bHQ6IERhdGUubm93LFxuICAgICAgICBlc19pbmRleGVkOiB0cnVlLFxuICAgIH0sXG5cbiAgICAvLyBUaGUgZGF0ZSB0aGF0IHRoaXMgaXRlbSB3YXMgdXBkYXRlZFxuICAgIG1vZGlmaWVkOiB7XG4gICAgICAgIHR5cGU6IERhdGUsXG4gICAgICAgIGRlZmF1bHQ6IERhdGUubm93LFxuICAgICAgICBlc19pbmRleGVkOiB0cnVlLFxuICAgIH0sXG5cbiAgICAvLyBUaGUgbW9zdCByZWNlbnQgYmF0Y2ggaW4gd2hpY2ggdGhlIHJlY29yZCBkYXRhIHdhcyB1cGxvYWRlZFxuICAgIGJhdGNoOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgcmVmOiBcIlJlY29yZEltcG9ydFwiLFxuICAgIH0sXG5cbiAgICAvLyBUaGUgc291cmNlIG9mIHRoZSBpbWFnZS5cbiAgICAvLyBOT1RFOiBXZSBkb24ndCBuZWVkIHRvIHZhbGlkYXRlIHRoZSBzb3VyY2UgYXMgaXQncyBub3QgYVxuICAgIC8vIHVzZXItc3BlY2lmaWVkIHByb3BlcnR5LlxuICAgIHNvdXJjZToge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIGVzX2luZGV4ZWQ6IHRydWUsXG4gICAgICAgIGVzX3R5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIC8vIEEgcmF3IG5hbWUgdG8gdXNlIGZvciBidWlsZGluZyBhZ2dyZWdhdGlvbnMgaW4gRWxhc3RpY3NlYXJjaFxuICAgICAgICBlc19maWVsZHM6IHtcbiAgICAgICAgICAgIG5hbWU6IHt0eXBlOiBcInN0cmluZ1wiLCBpbmRleDogXCJhbmFseXplZFwifSxcbiAgICAgICAgICAgIHJhdzoge3R5cGU6IFwic3RyaW5nXCIsIGluZGV4OiBcIm5vdF9hbmFseXplZFwifSxcbiAgICAgICAgfSxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgfSxcblxuICAgIC8vIFRoZSBsYW5ndWFnZSBvZiB0aGUgcGFnZSBmcm9tIHdoZXJlIHRoZSBkYXRhIGlzIGJlaW5nIGV4dHJhY3RlZC4gVGhpc1xuICAgIC8vIHdpbGwgaW5mbHVlbmNlIGhvdyBleHRyYWN0ZWQgdGV4dCBpcyBoYW5kbGVkLlxuICAgIGxhbmc6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICB9LFxuXG4gICAgLy8gQSBsaW5rIHRvIHRoZSByZWNvcmQgYXQgaXRzIHNvdXJjZVxuICAgIHVybDoge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIHZhbGlkYXRlOiAodikgPT4gdmFsaWRVcmwuaXNIdHRwc1VyaSh2KSB8fCB2YWxpZFVybC5pc0h0dHBVcmkodiksXG4gICAgICAgIHZhbGlkYXRpb25Nc2c6IChyZXEpID0+IHJlcS5nZXR0ZXh0KFwiYHVybGAgbXVzdCBiZSBwcm9wZXJseS1cIiArXG4gICAgICAgICAgICBcImZvcm1hdHRlZCBVUkwuXCIpLFxuICAgIH0sXG5cbiAgICAvLyBBIGhhc2ggdG8gdXNlIHRvIHJlbmRlciBhbiBpbWFnZSByZXByZXNlbnRpbmcgdGhlIHJlY29yZFxuICAgIGRlZmF1bHRJbWFnZUhhc2g6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgIH0sXG5cbiAgICAvLyBUaGUgaW1hZ2VzIGFzc29jaWF0ZWQgd2l0aCB0aGUgcmVjb3JkXG4gICAgaW1hZ2VzOiB7XG4gICAgICAgIHR5cGU6IFt7dHlwZTogU3RyaW5nLCByZWY6IFwiSW1hZ2VcIn1dLFxuICAgICAgICB2YWxpZGF0ZUFycmF5OiAodikgPT4gL15cXHcrXFwvW2EtejAtOV8tXStcXC5qcGU/ZyQvaS50ZXN0KHYpLFxuICAgICAgICB2YWxpZGF0aW9uTXNnOiAocmVxKSA9PiByZXEuZ2V0dGV4dChcIkltYWdlcyBtdXN0IGJlIGEgdmFsaWQgXCIgK1xuICAgICAgICAgICAgXCJpbWFnZSBmaWxlIG5hbWUuIEZvciBleGFtcGxlOiBgaW1hZ2UuanBnYC5cIiksXG4gICAgICAgIGNvbnZlcnQ6IChuYW1lLCBkYXRhKSA9PiBgJHtkYXRhLnNvdXJjZX0vJHtuYW1lfWAsXG4gICAgfSxcblxuICAgIC8vIEltYWdlcyBhc3NvY2lhdGVkIHdpdGggdGhlIHJlY29yZCB0aGF0IGhhdmVuJ3QgYmVlbiB1cGxvYWRlZCB5ZXRcbiAgICBtaXNzaW5nSW1hZ2VzOiB7XG4gICAgICAgIHR5cGU6IFtTdHJpbmddLFxuICAgICAgICB2YWxpZGF0ZUFycmF5OiAodikgPT4gL15cXHcrXFwvW2EtejAtOV8tXStcXC5qcGU/ZyQvaS50ZXN0KHYpLFxuICAgICAgICB2YWxpZGF0aW9uTXNnOiAocmVxKSA9PiByZXEuZ2V0dGV4dChcIkltYWdlcyBtdXN0IGJlIGEgdmFsaWQgXCIgK1xuICAgICAgICAgICAgXCJpbWFnZSBmaWxlIG5hbWUuIEZvciBleGFtcGxlOiBgaW1hZ2UuanBnYC5cIiksXG4gICAgfSxcblxuICAgIC8vIEtlZXAgdHJhY2sgb2YgaWYgdGhlIHJlY29yZCBuZWVkcyB0byB1cGRhdGUgaXRzIHJlY29yZCBzaW1pbGFyaXR5XG4gICAgbmVlZHNTaW1pbGFyVXBkYXRlOiB7XG4gICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIH0sXG5cbiAgICAvLyBDb21wdXRlZCBieSBsb29raW5nIGF0IHRoZSByZXN1bHRzIG9mIGltYWdlcy5zaW1pbGFySW1hZ2VzXG4gICAgc2ltaWxhclJlY29yZHM6IFt7XG4gICAgICAgIF9pZDogU3RyaW5nLFxuXG4gICAgICAgIHJlY29yZDoge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIH0sXG5cbiAgICAgICAgaW1hZ2VzOiB7XG4gICAgICAgICAgICB0eXBlOiBbU3RyaW5nXSxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICB9LFxuXG4gICAgICAgIHNvdXJjZToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZXNfaW5kZXhlZDogdHJ1ZSxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICB9LFxuXG4gICAgICAgIHNjb3JlOiB7XG4gICAgICAgICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICAgICAgICBlc19pbmRleGVkOiB0cnVlLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBtaW46IDEsXG4gICAgICAgIH0sXG4gICAgfV0sXG59O1xuXG5SZWNvcmQubWV0aG9kcyA9IHtcbiAgICBnZXRVUkwobG9jYWxlKSB7XG4gICAgICAgIHJldHVybiByZWNvcmRNb2RlbCh0aGlzLnR5cGUpLmdldFVSTEZyb21JRChsb2NhbGUsIHRoaXMuX2lkKTtcbiAgICB9LFxuXG4gICAgZ2V0RWRpdFVSTChsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuZ2V0VVJMKGxvY2FsZSl9L2VkaXRgO1xuICAgIH0sXG5cbiAgICBnZXRDcmVhdGVVUkwobG9jYWxlKSB7XG4gICAgICAgIHJldHVybiB1cmxzLmdlbihsb2NhbGUsIGAvJHt0aGlzLnR5cGV9LyR7dGhpcy5zb3VyY2V9L2NyZWF0ZWApO1xuICAgIH0sXG5cbiAgICBnZXRDbG9uZVVSTChsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuZ2V0VVJMKGxvY2FsZSl9L2Nsb25lYDtcbiAgICB9LFxuXG4gICAgZ2V0UmVtb3ZlSW1hZ2VVUkwobG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLmdldFVSTChsb2NhbGUpfS9yZW1vdmUtaW1hZ2VgO1xuICAgIH0sXG5cbiAgICBnZXRPcmlnaW5hbFVSTCgpIHtcbiAgICAgICAgcmV0dXJuIHVybHMuZ2VuRGF0YShcbiAgICAgICAgICAgIGAvJHt0aGlzLnNvdXJjZX0vaW1hZ2VzLyR7dGhpcy5kZWZhdWx0SW1hZ2VIYXNofS5qcGdgKTtcbiAgICB9LFxuXG4gICAgZ2V0VGh1bWJVUkwoKSB7XG4gICAgICAgIGlmICghdGhpcy5kZWZhdWx0SW1hZ2VIYXNoKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy50eXBlc1t0aGlzLnR5cGVdLmRlZmF1bHRJbWFnZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1cmxzLmdlbkRhdGEoXG4gICAgICAgICAgICBgLyR7dGhpcy5zb3VyY2V9L3RodW1icy8ke3RoaXMuZGVmYXVsdEltYWdlSGFzaH0uanBnYCk7XG4gICAgfSxcblxuICAgIGdldFRpdGxlKGkxOG4pIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMudHlwZXNbdGhpcy50eXBlXS5yZWNvcmRUaXRsZSh0aGlzLCBpMThuKTtcbiAgICB9LFxuXG4gICAgZ2V0U291cmNlKCkge1xuICAgICAgICByZXR1cm4gbW9kZWxzKFwiU291cmNlXCIpLmdldFNvdXJjZSh0aGlzLnNvdXJjZSk7XG4gICAgfSxcblxuICAgIGdldEltYWdlcyhjYWxsYmFjaykge1xuICAgICAgICBhc3luYy5tYXBMaW1pdCh0aGlzLmltYWdlcywgNCwgKGlkLCBjYWxsYmFjaykgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpZCAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9jZXNzLm5leHRUaWNrKCgpID0+IGNhbGxiYWNrKG51bGwsIGlkKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtb2RlbHMoXCJJbWFnZVwiKS5maW5kQnlJZChpZCwgY2FsbGJhY2spO1xuICAgICAgICB9LCBjYWxsYmFjayk7XG4gICAgfSxcblxuICAgIGdldER5bmFtaWNWYWx1ZXMoaTE4biwgY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBtZXRhZGF0YS5tb2RlbCh0aGlzLnR5cGUpO1xuXG4gICAgICAgIGFzeW5jLm1hcFZhbHVlcyhtb2RlbCwgKHByb3BNb2RlbCwgcHJvcE5hbWUsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXNbcHJvcE5hbWVdO1xuICAgICAgICAgICAgaWYgKHByb3BNb2RlbC5sb2FkRHluYW1pY1ZhbHVlICYmIHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBwcm9wTW9kZWwubG9hZER5bmFtaWNWYWx1ZSh2YWx1ZSwgaTE4biwgY2FsbGJhY2spO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlU2ltaWxhcml0eShjYWxsYmFjaykge1xuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgaWYgKGNvbmZpZy5OT0RFX0VOViAhPT0gXCJ0ZXN0XCIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVXBkYXRpbmcgU2ltaWxhcml0eVwiLCB0aGlzLl9pZCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdldEltYWdlcygoZXJyLCBpbWFnZXMpID0+IHtcbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDYWxjdWxhdGUgcmVjb3JkIG1hdGNoZXMgYmVmb3JlIHNhdmluZ1xuICAgICAgICAgICAgY29uc3QgbWF0Y2hlcyA9IGltYWdlc1xuICAgICAgICAgICAgICAgIC5tYXAoKGltYWdlKSA9PiBpbWFnZS5zaW1pbGFySW1hZ2VzKVxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuY29uY2F0KGIpLCBbXSk7XG4gICAgICAgICAgICBjb25zdCBzY29yZXMgPSBtYXRjaGVzLnJlZHVjZSgob2JqLCBtYXRjaCkgPT4ge1xuICAgICAgICAgICAgICAgIG9ialttYXRjaC5faWRdID0gTWF0aC5tYXgobWF0Y2guc2NvcmUsIG9ialttYXRjaC5faWRdIHx8IDApO1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgICAgICB9LCB7fSk7XG5cbiAgICAgICAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMubmVlZHNTaW1pbGFyVXBkYXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG1hdGNoSWRzID0gbWF0Y2hlcy5tYXAoKG1hdGNoKSA9PiBtYXRjaC5faWQpO1xuICAgICAgICAgICAgY29uc3QgcXVlcnkgPSBtYXRjaGVzLm1hcCgobWF0Y2gpID0+ICh7XG4gICAgICAgICAgICAgICAgaW1hZ2VzOiBtYXRjaC5faWQsXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHJlY29yZE1vZGVsKHRoaXMudHlwZSkuZmluZCh7XG4gICAgICAgICAgICAgICAgJG9yOiBxdWVyeSxcbiAgICAgICAgICAgICAgICBfaWQ6IHskbmU6IHRoaXMuX2lkfSxcbiAgICAgICAgICAgIH0sIChlcnIsIHJlY29yZHMpID0+IHtcbiAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuc2ltaWxhclJlY29yZHMgPSByZWNvcmRzXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoKHNpbWlsYXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNjb3JlID0gc2ltaWxhci5pbWFnZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKChpbWFnZSkgPT4gc2NvcmVzW2ltYWdlXSB8fCAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IHNpbWlsYXIuX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZDogc2ltaWxhci5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VzOiBzaW1pbGFyLmltYWdlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKChpZCkgPT4gbWF0Y2hJZHMuaW5kZXhPZihpZCkgPj0gMCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiBzaW1pbGFyLnNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoKHNpbWlsYXIpID0+IHNpbWlsYXIuc2NvcmUgPiAwKVxuICAgICAgICAgICAgICAgICAgICAuc29ydCgoYSwgYikgPT4gYi5zY29yZSAtIGEuc2NvcmUpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5uZWVkc1NpbWlsYXJVcGRhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBsb2FkSW1hZ2VzKGxvYWRTaW1pbGFyUmVjb3JkcywgY2FsbGJhY2spIHtcbiAgICAgICAgYXN5bmMucGFyYWxsZWwoW1xuICAgICAgICAgICAgKGNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRJbWFnZXMoKGVyciwgaW1hZ2VzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIGZpbHRlciBvdXQgYW55IGludmFsaWQvdW4tZm91bmQgaW1hZ2VzXG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IFdlIHNob3VsZCBsb2cgb3V0IHNvbWUgZGV0YWlscyBvbiB3aGVuIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgLy8gaGFwcGVucyAoaG9wZWZ1bGx5IG5ldmVyKS5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZXMgPSBpbWFnZXMuZmlsdGVyKChpbWFnZSkgPT4gISFpbWFnZSk7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAoY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWxvYWRTaW1pbGFyUmVjb3Jkcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvY2Vzcy5uZXh0VGljayhjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYXN5bmMubWFwTGltaXQodGhpcy5zaW1pbGFyUmVjb3JkcywgNCxcbiAgICAgICAgICAgICAgICAgICAgKHNpbWlsYXIsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2ltaWxhci5yZWNvcmRNb2RlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9jZXNzLm5leHRUaWNrKCgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHNpbWlsYXIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkTW9kZWwodGhpcy50eXBlKS5maW5kQnlJZChzaW1pbGFyLnJlY29yZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZXJyLCByZWNvcmQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIgfHwgIXJlY29yZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaW1pbGFyLnJlY29yZE1vZGVsID0gcmVjb3JkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBzaW1pbGFyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSwgKGVyciwgc2ltaWxhcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgZmlsdGVyIG91dCBhbnkgaW52YWxpZC91bi1mb3VuZCByZWNvcmRzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiBXZSBzaG91bGQgbG9nIG91dCBzb21lIGRldGFpbHMgb24gd2hlbiB0aGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBoYXBwZW5zIChob3BlZnVsbHkgbmV2ZXIpLlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaW1pbGFyUmVjb3JkcyA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2ltaWxhci5maWx0ZXIoKHNpbWlsYXIpID0+ICEhc2ltaWxhcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0sIGNhbGxiYWNrKTtcbiAgICB9LFxufTtcblxuY29uc3QgaW50ZXJuYWwgPSBbXCJfaWRcIiwgXCJfX3ZcIiwgXCJjcmVhdGVkXCIsIFwibW9kaWZpZWRcIiwgXCJkZWZhdWx0SW1hZ2VIYXNoXCIsXG4gICAgXCJiYXRjaFwiLCBcIm5lZWRzU2ltaWxhclVwZGF0ZVwiLCBcInNpbWlsYXJSZWNvcmRzXCJdO1xuXG5jb25zdCBnZXRFeHBlY3RlZFR5cGUgPSAob3B0aW9ucywgdmFsdWUpID0+IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvcHRpb25zLnR5cGUpKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKSA/IGZhbHNlIDogXCJhcnJheVwiO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnR5cGUgPT09IE51bWJlcikge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiID8gZmFsc2UgOiBcIm51bWJlclwiO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnR5cGUgPT09IEJvb2xlYW4pIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJib29sZWFuXCIgPyBmYWxzZSA6IFwiYm9vbGVhblwiO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnR5cGUgPT09IERhdGUpIHtcbiAgICAgICAgcmV0dXJuICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgfHwgdmFsdWUgaW5zdGFuY2VvZiBEYXRlKSA/XG4gICAgICAgICAgICBmYWxzZSA6IFwiZGF0ZVwiO1xuICAgIH1cblxuICAgIC8vIERlZmF1bHRzIHRvIHR5cGUgb2YgU3RyaW5nXG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiA/IGZhbHNlIDogXCJzdHJpbmdcIjtcbn07XG5cbmNvbnN0IHN0cmlwUHJvcCA9IChvYmosIG5hbWUpID0+IHtcbiAgICBpZiAoIW9iaikge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIGRlbGV0ZSBvYmpbbmFtZV07XG5cbiAgICBmb3IgKGNvbnN0IHByb3AgaW4gb2JqKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gb2JqW3Byb3BdO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhbHVlLmZvckVhY2goKGl0ZW0pID0+IHN0cmlwUHJvcChpdGVtLCBuYW1lKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICBzdHJpcFByb3AodmFsdWUsIG5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbn07XG5cblJlY29yZC5zdGF0aWNzID0ge1xuICAgIGdldFVSTEZyb21JRChsb2NhbGUsIGlkKSB7XG4gICAgICAgIGNvbnN0IHR5cGUgPSB0aGlzLmdldFR5cGUoKTtcbiAgICAgICAgcmV0dXJuIHVybHMuZ2VuKGxvY2FsZSwgYC8ke3R5cGV9LyR7aWR9YCk7XG4gICAgfSxcblxuICAgIGZyb21EYXRhKHRtcERhdGEsIHJlcSwgY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3QgUmVjb3JkID0gcmVjb3JkTW9kZWwodGhpcy5nZXRUeXBlKCkpO1xuICAgICAgICBjb25zdCBJbWFnZSA9IG1vZGVscyhcIkltYWdlXCIpO1xuXG4gICAgICAgIGNvbnN0IGxpbnQgPSB0aGlzLmxpbnREYXRhKHRtcERhdGEsIHJlcSk7XG4gICAgICAgIGNvbnN0IHdhcm5pbmdzID0gbGludC53YXJuaW5ncztcblxuICAgICAgICBpZiAobGludC5lcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2soKCkgPT4gY2FsbGJhY2sobmV3IEVycm9yKGxpbnQuZXJyb3IpKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYXRhID0gbGludC5kYXRhO1xuICAgICAgICBjb25zdCByZWNvcmRJZCA9IGAke2RhdGEuc291cmNlfS8ke2RhdGEuaWR9YDtcbiAgICAgICAgY29uc3QgbWlzc2luZ0ltYWdlcyA9IFtdO1xuICAgICAgICBjb25zdCB0eXBlT3B0aW9ucyA9IG9wdGlvbnMudHlwZXNbdGhpcy5nZXRUeXBlKCldO1xuXG4gICAgICAgIFJlY29yZC5maW5kQnlJZChyZWNvcmRJZCwgKGVyciwgcmVjb3JkKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjcmVhdGluZyA9ICFyZWNvcmQ7XG5cbiAgICAgICAgICAgIGFzeW5jLm1hcExpbWl0KGRhdGEuaW1hZ2VzIHx8IFtdLCAyLCAoaW1hZ2VJZCwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgICAgICBJbWFnZS5maW5kQnlJZChpbWFnZUlkLCAoZXJyLCBpbWFnZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWltYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWxlTmFtZSA9IGltYWdlSWQucmVwbGFjZSgvXlxcdytbL10vLCBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pc3NpbmdJbWFnZXMucHVzaChpbWFnZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhcm5pbmdzLnB1c2gocmVxLmZvcm1hdChyZXEuZ2V0dGV4dChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkltYWdlIGZpbGUgbm90IGZvdW5kOiAlKGZpbGVOYW1lKXNcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2ZpbGVOYW1lfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgaW1hZ2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgKGVyciwgaW1hZ2VzKSA9PiB7XG4gICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKHJlcS5nZXR0ZXh0KFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJFcnJvciBhY2Nlc3NpbmcgaW1hZ2UgZGF0YS5cIikpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZU9wdGlvbnMuaGFzSW1hZ2VzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRmlsdGVyIG91dCBhbnkgbWlzc2luZyBpbWFnZXNcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsdGVyZWRJbWFnZXMgPSBpbWFnZXMuZmlsdGVyKChpbWFnZSkgPT4gISFpbWFnZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpbHRlcmVkSW1hZ2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyTXNnID0gcmVxLmdldHRleHQoXCJObyBpbWFnZXMgZm91bmQuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZU9wdGlvbnMuaW1hZ2VzUmVxdWlyZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKGVyck1zZykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB3YXJuaW5ncy5wdXNoKGVyck1zZyk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuZGVmYXVsdEltYWdlSGFzaCA9IGZpbHRlcmVkSW1hZ2VzWzBdLmhhc2g7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBkYXRhLmltYWdlcyA9IGZpbHRlcmVkSW1hZ2VzLm1hcCgoaW1hZ2UpID0+IGltYWdlLl9pZCk7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEubWlzc2luZ0ltYWdlcyA9IG1pc3NpbmdJbWFnZXM7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IG1vZGVsID0gcmVjb3JkO1xuICAgICAgICAgICAgICAgIGxldCBvcmlnaW5hbDtcblxuICAgICAgICAgICAgICAgIGlmIChjcmVhdGluZykge1xuICAgICAgICAgICAgICAgICAgICBtb2RlbCA9IG5ldyBSZWNvcmQoZGF0YSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWwgPSBtb2RlbC50b0pTT04oKTtcbiAgICAgICAgICAgICAgICAgICAgbW9kZWwuc2V0KGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIERlbGV0ZSBtaXNzaW5nIGZpZWxkc1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7c2NoZW1hfSA9IFJlY29yZDtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGZpZWxkIGluIHNjaGVtYS5wYXRocykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2tpcCBpbnRlcm5hbCBmaWVsZHNcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnRlcm5hbC5pbmRleE9mKGZpZWxkKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhW2ZpZWxkXSA9PT0gdW5kZWZpbmVkICYmIG1vZGVsW2ZpZWxkXSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobW9kZWxbZmllbGRdLmxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbFtmaWVsZF0ubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbFtmaWVsZF0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBtb2RlbC52YWxpZGF0ZSgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtc2cgPSByZXEuZ2V0dGV4dChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlRoZXJlIHdhcyBhbiBlcnJvciB3aXRoIHRoZSBkYXRhIGZvcm1hdC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvcnMgPSBPYmplY3Qua2V5cyhlcnIuZXJyb3JzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKHBhdGgpID0+IGVyci5lcnJvcnNbcGF0aF0ubWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuam9pbihcIiwgXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcihgJHttc2d9ICR7ZXJyb3JzfWApKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghY3JlYXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsLmRpZmYgPSBzdHJpcFByb3AoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgamRwLmRpZmYob3JpZ2luYWwsIG1vZGVsLnRvSlNPTigpKSwgXCJfaWRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBtb2RlbCwgd2FybmluZ3MsIGNyZWF0aW5nKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgbGludERhdGEoZGF0YSwgcmVxLCBvcHRpb25hbFNjaGVtYSkge1xuICAgICAgICBjb25zdCBzY2hlbWEgPSBvcHRpb25hbFNjaGVtYSB8fFxuICAgICAgICAgICAgcmVjb3JkTW9kZWwodGhpcy5nZXRUeXBlKCkpLnNjaGVtYTtcblxuICAgICAgICBjb25zdCBjbGVhbmVkID0ge307XG4gICAgICAgIGNvbnN0IHdhcm5pbmdzID0gW107XG4gICAgICAgIGxldCBlcnJvcjtcblxuICAgICAgICBmb3IgKGNvbnN0IGZpZWxkIGluIGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSBzY2hlbWEucGF0aChmaWVsZCk7XG5cbiAgICAgICAgICAgIGlmICghb3B0aW9ucyB8fCBpbnRlcm5hbC5pbmRleE9mKGZpZWxkKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgd2FybmluZ3MucHVzaChyZXEuZm9ybWF0KHJlcS5nZXR0ZXh0KFxuICAgICAgICAgICAgICAgICAgICBcIlVucmVjb2duaXplZCBmaWVsZCBgJShmaWVsZClzYC5cIiksIHtmaWVsZH0pKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgZmllbGQgaW4gc2NoZW1hLnBhdGhzKSB7XG4gICAgICAgICAgICAvLyBTa2lwIGludGVybmFsIGZpZWxkc1xuICAgICAgICAgICAgaWYgKGludGVybmFsLmluZGV4T2YoZmllbGQpID49IDApIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHZhbHVlID0gZGF0YSAmJiBkYXRhW2ZpZWxkXTtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSBzY2hlbWEucGF0aChmaWVsZCkub3B0aW9ucztcblxuICAgICAgICAgICAgaWYgKHZhbHVlICE9PSBcIlwiICYmIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgKHZhbHVlLmxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlLmxlbmd0aCA+IDApKSB7XG4gICAgICAgICAgICAgICAgLy8gQ29lcmNlIHNpbmdsZSBpdGVtcyB0aGF0IHNob3VsZCBiZSBhcnJheXMgaW50byBhcnJheXNcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvcHRpb25zLnR5cGUpICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IFt2YWx1ZV07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gQ29lcmNlIG51bWJlcnMgdGhhdCBhcmUgc3RyaW5ncyBpbnRvIG51bWJlcnNcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy50eXBlID09PSBOdW1iZXIgJiYgdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgZXhwZWN0ZWRUeXBlID0gZ2V0RXhwZWN0ZWRUeXBlKG9wdGlvbnMsIHZhbHVlKTtcblxuICAgICAgICAgICAgICAgIGlmIChleHBlY3RlZFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB3YXJuaW5ncy5wdXNoKHJlcS5mb3JtYXQocmVxLmdldHRleHQoXG4gICAgICAgICAgICAgICAgICAgICAgICBcImAlKGZpZWxkKXNgIGlzIHRoZSB3cm9uZyB0eXBlLiBFeHBlY3RlZCBhIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiJSh0eXBlKXMuXCIpLCB7ZmllbGQsIHR5cGU6IGV4cGVjdGVkVHlwZX0pKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvcHRpb25zLnR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgdGhlIHZhbHVlIHRvIGl0cyBleHBlY3RlZCBmb3JtLCBpZiBhXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnZlcnNpb24gbWV0aG9kIGV4aXN0cy5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuY29udmVydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5tYXAoKG9iaikgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmNvbnZlcnQob2JqLCBkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy50eXBlWzBdLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuZmlsdGVyKChlbnRyeSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cGVjdGVkVHlwZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEV4cGVjdGVkVHlwZShvcHRpb25zLnR5cGVbMF0sIGVudHJ5KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleHBlY3RlZFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2FybmluZ3MucHVzaChyZXEuZm9ybWF0KHJlcS5nZXR0ZXh0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJgJShmaWVsZClzYCB2YWx1ZSBpcyB0aGUgd3JvbmcgdHlwZS5cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgRXhwZWN0ZWQgYSAlKHR5cGUpcy5cIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZmllbGQsIHR5cGU6IGV4cGVjdGVkVHlwZX0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW50cnk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUubWFwKChlbnRyeSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdHMgPSB0aGlzLmxpbnREYXRhKGVudHJ5LCByZXEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudHlwZVswXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0cy5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YXJuaW5ncy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYFxcYCR7ZmllbGR9XFxgOiAke3Jlc3VsdHMuZXJyb3J9YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCB3YXJuaW5nIG9mIHJlc3VsdHMud2FybmluZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2FybmluZ3MucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBcXGAke2ZpZWxkfVxcYDogJHt3YXJuaW5nfWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRzLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KS5maWx0ZXIoKGVudHJ5KSA9PiAhIWVudHJ5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIFZhbGlkYXRlIHRoZSBhcnJheSBlbnRyaWVzXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnZhbGlkYXRlQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdHMgPSB2YWx1ZS5maWx0ZXIoKGVudHJ5KSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudmFsaWRhdGVBcnJheShlbnRyeSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoICE9PSByZXN1bHRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhcm5pbmdzLnB1c2gob3B0aW9ucy52YWxpZGF0aW9uTXNnKHJlcSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHJlc3VsdHM7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFZhbGlkYXRlIHRoZSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy52YWxpZGF0ZSAmJiAhb3B0aW9ucy52YWxpZGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhcm5pbmdzLnB1c2gob3B0aW9ucy52YWxpZGF0aW9uTXNnKHJlcSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gXCJcIiB8fFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5yZXF1aXJlZCkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvciA9IHJlcS5mb3JtYXQocmVxLmdldHRleHQoXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlJlcXVpcmVkIGZpZWxkIGAlKGZpZWxkKXNgIGlzIGVtcHR5LlwiKSwge2ZpZWxkfSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5yZWNvbW1lbmRlZCkge1xuICAgICAgICAgICAgICAgICAgICB3YXJuaW5ncy5wdXNoKHJlcS5mb3JtYXQocmVxLmdldHRleHQoXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlJlY29tbWVuZGVkIGZpZWxkIGAlKGZpZWxkKXNgIGlzIGVtcHR5LlwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtmaWVsZH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNsZWFuZWRbZmllbGRdID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiB7ZXJyb3IsIHdhcm5pbmdzfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7ZGF0YTogY2xlYW5lZCwgd2FybmluZ3N9O1xuICAgIH0sXG5cbiAgICB1cGRhdGVTaW1pbGFyaXR5KGNhbGxiYWNrKSB7XG4gICAgICAgIHJlY29yZE1vZGVsKHRoaXMuZ2V0VHlwZSgpKS5maW5kT25lKHtcbiAgICAgICAgICAgIG5lZWRzU2ltaWxhclVwZGF0ZTogdHJ1ZSxcbiAgICAgICAgfSwgKGVyciwgcmVjb3JkKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyIHx8ICFyZWNvcmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVjb3JkLnVwZGF0ZVNpbWlsYXJpdHkoKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZWNvcmQuc2F2ZSgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHRydWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBnZXRGYWNldHMocmVxLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAoIXRoaXMuZmFjZXRDYWNoZSkge1xuICAgICAgICAgICAgdGhpcy5mYWNldENhY2hlID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5mYWNldENhY2hlW3JlcS5sYW5nXSkge1xuICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2soKCkgPT5cbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB0aGlzLmZhY2V0Q2FjaGVbcmVxLmxhbmddKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzZWFyY2ggPSByZXF1aXJlKFwiLi4vbG9naWMvc2hhcmVkL3NlYXJjaFwiKTtcblxuICAgICAgICBzZWFyY2goe1xuICAgICAgICAgICAgdHlwZTogdGhpcy5nZXRUeXBlKCksXG4gICAgICAgICAgICBub1JlZGlyZWN0OiB0cnVlLFxuICAgICAgICB9LCByZXEsIChlcnIsIHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZmFjZXRzID0ge307XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgZmFjZXQgb2YgcmVzdWx0cy5mYWNldHMpIHtcbiAgICAgICAgICAgICAgICBmYWNldHNbZmFjZXQuZmllbGRdID0gZmFjZXQuYnVja2V0cztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5mYWNldENhY2hlW3JlcS5sYW5nXSA9IGZhY2V0cztcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGZhY2V0cyk7XG4gICAgICAgIH0pO1xuICAgIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlY29yZDtcbiJdfQ==