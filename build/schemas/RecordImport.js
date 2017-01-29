"use strict";

var async = require("async");

var record = require("../lib/record");
var models = require("../lib/models");
var db = require("../lib/db");
var urls = require("../lib/urls");
var config = require("../lib/config");

var Import = require("./Import");

var states = [{
    id: "started",
    name: function name(req) {
        return req.gettext("Awaiting processing...");
    },
    advance: function advance(batch, callback) {
        batch.processRecords(callback);
    }
}, {
    id: "process.started",
    name: function name(req) {
        return req.gettext("Processing...");
    }
}, {
    id: "process.completed",
    name: function name(req) {
        return req.gettext("Confirmation required.");
    }
}, {
    id: "import.started",
    name: function name(req) {
        return req.gettext("Importing data...");
    }
}, {
    id: "import.completed",
    name: function name(req) {
        return req.gettext("Awaiting similarity sync...");
    },
    advance: function advance(batch, callback) {
        batch.updateSimilarity(callback);
    }
}, {
    id: "similarity.sync.started",
    name: function name(req) {
        return req.gettext("Syncing similarity...");
    }
}, {
    id: "similarity.sync.completed",
    name: function name(req) {
        return req.gettext("Completed.");
    },
    advance: function advance(batch, callback) {
        // NOTE(jeresig): Currently nothing needs to be done to finish
        // up the import, other than moving it to the "completed" state.
        process.nextTick(callback);
    }
}, {
    id: "completed",
    name: function name(req) {
        return req.gettext("Completed.");
    }
}];

var errors = {
    ABANDONED: function ABANDONED(req) {
        return req.gettext("Data import abandoned.");
    },
    ERROR_READING_DATA: function ERROR_READING_DATA(req) {
        return req.gettext("Error reading data from " + "provided data files.");
    },
    ERROR_SAVING: function ERROR_SAVING(req) {
        return req.gettext("Error saving record.");
    },
    ERROR_DELETING: function ERROR_DELETING(req) {
        return req.gettext("Error deleting existing record.");
    }
};

// TODO(jeresig): Remove this.
var req = {
    format: function format(msg, fields) {
        return msg.replace(/%\((.*?)\)s/g, function (all, name) {
            return fields[name];
        });
    },
    gettext: function gettext(msg) {
        return msg;
    },
    lang: "en"
};

var RecordImport = new db.schema(Object.assign({}, Import.schema, {
    // The type of the record
    type: {
        type: String,
        required: true
    },

    // The name of the original file (e.g. `foo.json`)
    fileName: {
        type: String,
        required: true
    }
}));

Object.assign(RecordImport.methods, Import.methods, {
    getURL: function getURL(lang) {
        return urls.gen(lang, "/" + this.type + "/source/" + this.source + "/admin?records=" + this._id);
    },
    getError: function getError(req) {
        return models("RecordImport").getError(req, this.error);
    },
    getStates: function getStates() {
        return states;
    },
    setResults: function setResults(inputStreams, callback) {
        var _this = this;

        var source = this.getSource();

        source.processFiles(inputStreams, function (err, results) {
            if (err) {
                _this.error = err.message;
                return _this.saveState("error", callback);
            }

            _this.results = results.map(function (data) {
                return {
                    data: data,
                    result: "unknown"
                };
            });

            callback();
        });
    },
    processRecords: function processRecords(callback) {
        var _this2 = this;

        var Record = record(this.type);
        var incomingIDs = {};

        var results = this.results;

        async.eachLimit(results, 1, function (result, callback) {
            var data = Object.assign(result.data, {
                source: _this2.source,
                type: _this2.type
            });

            /* istanbul ignore if */
            if (config.NODE_ENV !== "test") {
                console.log("Processing Record:", data.id);
            }

            Record.fromData(data, req, function (err, record, warnings, isNew) {
                result.state = "process.completed";

                if (err) {
                    result.result = "error";
                    result.error = err.message;
                    return callback();
                }

                if (isNew) {
                    result.result = "created";
                } else {
                    result.diff = record.diff;
                    incomingIDs[record._id] = true;
                    result.model = record._id;
                    result.result = result.diff ? "changed" : "unchanged";
                }

                result.warnings = warnings;
                callback();
            });
        }, function () {
            /* istanbul ignore if */
            if (config.NODE_ENV !== "test") {
                console.log("Finding records to delete...");
            }

            // Find records that need to be deleted
            Record.find({ source: _this2.source }).lean().distinct("_id").exec(function (err, ids) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = ids[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var id = _step.value;

                        if (id in incomingIDs) {
                            continue;
                        }

                        results.push({
                            _id: id,
                            model: id,
                            result: "deleted",
                            state: "process.completed",
                            data: {}
                        });
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

                _this2.results = results;
                callback();
            });
        });
    },
    manuallyApprove: function manuallyApprove(callback) {
        var _this3 = this;

        this.saveState("import.started", function (err) {
            /* istanbul ignore if */
            if (err) {
                return callback(err);
            }

            // Delay the importing of the records to not block the UI
            process.nextTick(function () {
                return _this3.importRecords(function () {
                    // Ignore the result, user doesn't care.
                });
            });

            callback();
        });
    },
    importRecords: function importRecords(callback) {
        var _this4 = this;

        var Record = record(this.type);
        var Source = models("Source");

        async.eachLimit(this.results, 1, function (result, callback) {
            result.state = "import.started";

            /* istanbul ignore if */
            if (config.NODE_ENV !== "test") {
                console.log("Importing", result.data.id);
            }

            if (result.result === "created" || result.result === "changed") {
                Record.fromData(result.data, req, function (err, record) {
                    record.save(function (err) {
                        /* istanbul ignore if */
                        if (err) {
                            result.state = "error";
                            result.error = "ERROR_SAVING";
                        } else {
                            result.model = record._id;
                            result.state = "import.completed";
                        }

                        callback(err);
                    });
                });
            } else if (result.result === "deleted") {
                Record.findById(result.model, function (err, record) {
                    /* istanbul ignore if */
                    if (err || !record) {
                        result.state = "error";
                        result.error = "ERROR_DELETING";
                        return callback(err);
                    }

                    record.remove(function (err) {
                        /* istanbul ignore if */
                        if (err) {
                            result.state = "error";
                            result.error = "ERROR_DELETING";
                        } else {
                            result.state = "import.completed";
                        }

                        callback(err);
                    });
                });
            } else {
                result.state = "import.completed";
                process.nextTick(callback);
            }
        }, function (err) {
            /* istanbul ignore if */
            if (err) {
                _this4.error = err.message;
                return _this4.saveState("error", callback);
            }

            _this4.markModified("results");

            // Update the internal source cache
            Source.cacheSources(function () {
                // Advance to the next state
                _this4.saveState("import.completed", callback);
            });
        });
    },
    updateSimilarity: function updateSimilarity(callback) {
        var results = this.getFilteredResults();

        // No need to update the similarity if no records were created
        // or deleted.
        if (results.created.length === 0 && results.deleted.length === 0) {
            return process.nextTick(callback);
        }

        // Update the similarity on all records, including the ones that
        // were just added.
        record(this.type).update({}, { needsSimilarUpdate: true }, { multi: true }, callback);
    },
    abandon: function abandon(callback) {
        this.error = "ABANDONED";
        this.saveState("error", callback);
    },
    getFilteredResults: function getFilteredResults() {
        return {
            unprocessed: this.results.filter(function (result) {
                return result.result === "unknown";
            }),
            created: this.results.filter(function (result) {
                return result.result === "created";
            }),
            changed: this.results.filter(function (result) {
                return result.result === "changed";
            }),
            deleted: this.results.filter(function (result) {
                return result.result === "deleted";
            }),
            errors: this.results.filter(function (result) {
                return result.error;
            }),
            warnings: this.results.filter(function (result) {
                return (result.warnings || []).length !== 0;
            })
        };
    }
});

Object.assign(RecordImport.statics, Import.statics, {
    fromFile: function fromFile(fileName, source, type) {
        var RecordImport = models("RecordImport");
        return new RecordImport({ source: source, fileName: fileName, type: type });
    },
    getError: function getError(req, error) {
        var msg = errors[error];
        return msg ? msg(req) : error;
    }
});

RecordImport.pre("validate", function (next) {
    // Create the ID if one hasn't been set before
    if (!this._id) {
        this._id = this.source + "/" + Date.now();
    }

    next();
});

/* istanbul ignore next */
RecordImport.pre("save", function (next) {
    // Always updated the modified time on every save
    this.modified = new Date();

    next();
});

module.exports = RecordImport;