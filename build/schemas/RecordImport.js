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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL1JlY29yZEltcG9ydC5qcyJdLCJuYW1lcyI6WyJhc3luYyIsInJlcXVpcmUiLCJyZWNvcmQiLCJtb2RlbHMiLCJkYiIsInVybHMiLCJjb25maWciLCJJbXBvcnQiLCJzdGF0ZXMiLCJpZCIsIm5hbWUiLCJyZXEiLCJnZXR0ZXh0IiwiYWR2YW5jZSIsImJhdGNoIiwiY2FsbGJhY2siLCJwcm9jZXNzUmVjb3JkcyIsInVwZGF0ZVNpbWlsYXJpdHkiLCJwcm9jZXNzIiwibmV4dFRpY2siLCJlcnJvcnMiLCJBQkFORE9ORUQiLCJFUlJPUl9SRUFESU5HX0RBVEEiLCJFUlJPUl9TQVZJTkciLCJFUlJPUl9ERUxFVElORyIsImZvcm1hdCIsIm1zZyIsImZpZWxkcyIsInJlcGxhY2UiLCJhbGwiLCJsYW5nIiwiUmVjb3JkSW1wb3J0Iiwic2NoZW1hIiwiT2JqZWN0IiwiYXNzaWduIiwidHlwZSIsIlN0cmluZyIsInJlcXVpcmVkIiwiZmlsZU5hbWUiLCJtZXRob2RzIiwiZ2V0VVJMIiwiZ2VuIiwic291cmNlIiwiX2lkIiwiZ2V0RXJyb3IiLCJlcnJvciIsImdldFN0YXRlcyIsInNldFJlc3VsdHMiLCJpbnB1dFN0cmVhbXMiLCJnZXRTb3VyY2UiLCJwcm9jZXNzRmlsZXMiLCJlcnIiLCJyZXN1bHRzIiwibWVzc2FnZSIsInNhdmVTdGF0ZSIsIm1hcCIsImRhdGEiLCJyZXN1bHQiLCJSZWNvcmQiLCJpbmNvbWluZ0lEcyIsImVhY2hMaW1pdCIsIk5PREVfRU5WIiwiY29uc29sZSIsImxvZyIsImZyb21EYXRhIiwid2FybmluZ3MiLCJpc05ldyIsInN0YXRlIiwiZGlmZiIsIm1vZGVsIiwiZmluZCIsImxlYW4iLCJkaXN0aW5jdCIsImV4ZWMiLCJpZHMiLCJwdXNoIiwibWFudWFsbHlBcHByb3ZlIiwiaW1wb3J0UmVjb3JkcyIsIlNvdXJjZSIsInNhdmUiLCJmaW5kQnlJZCIsInJlbW92ZSIsIm1hcmtNb2RpZmllZCIsImNhY2hlU291cmNlcyIsImdldEZpbHRlcmVkUmVzdWx0cyIsImNyZWF0ZWQiLCJsZW5ndGgiLCJkZWxldGVkIiwidXBkYXRlIiwibmVlZHNTaW1pbGFyVXBkYXRlIiwibXVsdGkiLCJhYmFuZG9uIiwidW5wcm9jZXNzZWQiLCJmaWx0ZXIiLCJjaGFuZ2VkIiwic3RhdGljcyIsImZyb21GaWxlIiwicHJlIiwibmV4dCIsIkRhdGUiLCJub3ciLCJtb2RpZmllZCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsUUFBUUMsUUFBUSxPQUFSLENBQWQ7O0FBRUEsSUFBTUMsU0FBU0QsUUFBUSxlQUFSLENBQWY7QUFDQSxJQUFNRSxTQUFTRixRQUFRLGVBQVIsQ0FBZjtBQUNBLElBQU1HLEtBQUtILFFBQVEsV0FBUixDQUFYO0FBQ0EsSUFBTUksT0FBT0osUUFBUSxhQUFSLENBQWI7QUFDQSxJQUFNSyxTQUFTTCxRQUFRLGVBQVIsQ0FBZjs7QUFFQSxJQUFNTSxTQUFTTixRQUFRLFVBQVIsQ0FBZjs7QUFFQSxJQUFNTyxTQUFTLENBQ1g7QUFDSUMsUUFBSSxTQURSO0FBRUlDLFVBQU0sY0FBQ0MsR0FBRDtBQUFBLGVBQVNBLElBQUlDLE9BQUosQ0FBWSx3QkFBWixDQUFUO0FBQUEsS0FGVjtBQUdJQyxXQUhKLG1CQUdZQyxLQUhaLEVBR21CQyxRQUhuQixFQUc2QjtBQUNyQkQsY0FBTUUsY0FBTixDQUFxQkQsUUFBckI7QUFDSDtBQUxMLENBRFcsRUFRWDtBQUNJTixRQUFJLGlCQURSO0FBRUlDLFVBQU0sY0FBQ0MsR0FBRDtBQUFBLGVBQVNBLElBQUlDLE9BQUosQ0FBWSxlQUFaLENBQVQ7QUFBQTtBQUZWLENBUlcsRUFZWDtBQUNJSCxRQUFJLG1CQURSO0FBRUlDLFVBQU0sY0FBQ0MsR0FBRDtBQUFBLGVBQVNBLElBQUlDLE9BQUosQ0FBWSx3QkFBWixDQUFUO0FBQUE7QUFGVixDQVpXLEVBbUJYO0FBQ0lILFFBQUksZ0JBRFI7QUFFSUMsVUFBTSxjQUFDQyxHQUFEO0FBQUEsZUFBU0Es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a0MsS0FOa0MsRUFNM0I7QUFDakIsWUFBTW5CLE1BQU1OLE9BQU95QixLQUFQLENBQVo7QUFDQSxlQUFPbkIsTUFBTUEsSUFBSWYsR0FBSixDQUFOLEdBQWlCa0MsS0FBeEI7QUFDSDtBQVQrQyxDQUFwRDs7QUFZQWQsYUFBYWtFLEdBQWIsQ0FBaUIsVUFBakIsRUFBNkIsVUFBU0MsSUFBVCxFQUFlO0FBQ3hDO0FBQ0EsUUFBSSxDQUFDLEtBQUt2RCxHQUFWLEVBQWU7QUFDWCxhQUFLQSxHQUFMLEdBQWMsS0FBS0QsTUFBbkIsU0FBNkJ5RCxLQUFLQyxHQUFMLEVBQTdCO0FBQ0g7O0FBRURGO0FBQ0gsQ0FQRDs7QUFTQTtBQUNBbkUsYUFBYWtFLEdBQWIsQ0FBaUIsTUFBakIsRUFBeUIsVUFBU0MsSUFBVCxFQUFlO0FBQ3BDO0FBQ0EsU0FBS0csUUFBTCxHQUFnQixJQUFJRixJQUFKLEVBQWhCOztBQUVBRDtBQUNILENBTEQ7O0FBT0FJLE9BQU9DLE9BQVAsR0FBaUJ4RSxZQUFqQiIsImZpbGUiOiJSZWNvcmRJbXBvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBhc3luYyA9IHJlcXVpcmUoXCJhc3luY1wiKTtcblxuY29uc3QgcmVjb3JkID0gcmVxdWlyZShcIi4uL2xpYi9yZWNvcmRcIik7XG5jb25zdCBtb2RlbHMgPSByZXF1aXJlKFwiLi4vbGliL21vZGVsc1wiKTtcbmNvbnN0IGRiID0gcmVxdWlyZShcIi4uL2xpYi9kYlwiKTtcbmNvbnN0IHVybHMgPSByZXF1aXJlKFwiLi4vbGliL3VybHNcIik7XG5jb25zdCBjb25maWcgPSByZXF1aXJlKFwiLi4vbGliL2NvbmZpZ1wiKTtcblxuY29uc3QgSW1wb3J0ID0gcmVxdWlyZShcIi4vSW1wb3J0XCIpO1xuXG5jb25zdCBzdGF0ZXMgPSBbXG4gICAge1xuICAgICAgICBpZDogXCJzdGFydGVkXCIsXG4gICAgICAgIG5hbWU6IChyZXEpID0+IHJlcS5nZXR0ZXh0KFwiQXdhaXRpbmcgcHJvY2Vzc2luZy4uLlwiKSxcbiAgICAgICAgYWR2YW5jZShiYXRjaCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGJhdGNoLnByb2Nlc3NSZWNvcmRzKGNhbGxiYWNrKTtcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgaWQ6IFwicHJvY2Vzcy5zdGFydGVkXCIsXG4gICAgICAgIG5hbWU6IChyZXEpID0+IHJlcS5nZXR0ZXh0KFwiUHJvY2Vzc2luZy4uLlwiKSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgaWQ6IFwicHJvY2Vzcy5jb21wbGV0ZWRcIixcbiAgICAgICAgbmFtZTogKHJlcSkgPT4gcmVxLmdldHRleHQoXCJDb25maXJtYXRpb24gcmVxdWlyZWQuXCIpLFxuICAgICAgICAvLyBOT1RFKGplcmVzaWcpOiBEbyBub3QgYXV0by1hZHZhbmNlIHRvIGltcG9ydGluZyB0aGUgZGF0YVxuICAgICAgICAvLyB3ZSB3YW50IHRoZSB1c2VyIHRvIG1ha2UgdGhlIGNhbGwgb24gdGhlIHJlc3VsdHMuXG4gICAgICAgIC8vIGJhdGNoLmltcG9ydFJlY29yZHMoY2FsbGJhY2spO1xuICAgIH0sXG4gICAge1xuICAgICAgICBpZDogXCJpbXBvcnQuc3RhcnRlZFwiLFxuICAgICAgICBuYW1lOiAocmVxKSA9PiByZXEuZ2V0dGV4dChcIkltcG9ydGluZyBkYXRhLi4uXCIpLFxuICAgIH0sXG4gICAge1xuICAgICAgICBpZDogXCJpbXBvcnQuY29tcGxldGVkXCIsXG4gICAgICAgIG5hbWU6IChyZXEpID0+IHJlcS5nZXR0ZXh0KFwiQXdhaXRpbmcgc2ltaWxhcml0eSBzeW5jLi4uXCIpLFxuICAgICAgICBhZHZhbmNlKGJhdGNoLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgYmF0Y2gudXBkYXRlU2ltaWxhcml0eShjYWxsYmFjayk7XG4gICAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlkOiBcInNpbWlsYXJpdHkuc3luYy5zdGFydGVkXCIsXG4gICAgICAgIG5hbWU6IChyZXEpID0+IHJlcS5nZXR0ZXh0KFwiU3luY2luZyBzaW1pbGFyaXR5Li4uXCIpLFxuICAgIH0sXG4gICAge1xuICAgICAgICBpZDogXCJzaW1pbGFyaXR5LnN5bmMuY29tcGxldGVkXCIsXG4gICAgICAgIG5hbWU6IChyZXEpID0+IHJlcS5nZXR0ZXh0KFwiQ29tcGxldGVkLlwiKSxcbiAgICAgICAgYWR2YW5jZShiYXRjaCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIC8vIE5PVEUoamVyZXNpZyk6IEN1cnJlbnRseSBub3RoaW5nIG5lZWRzIHRvIGJlIGRvbmUgdG8gZmluaXNoXG4gICAgICAgICAgICAvLyB1cCB0aGUgaW1wb3J0LCBvdGhlciB0aGFuIG1vdmluZyBpdCB0byB0aGUgXCJjb21wbGV0ZWRcIiBzdGF0ZS5cbiAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soY2FsbGJhY2spO1xuICAgICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgICBpZDogXCJjb21wbGV0ZWRcIixcbiAgICAgICAgbmFtZTogKHJlcSkgPT4gcmVxLmdldHRleHQoXCJDb21wbGV0ZWQuXCIpLFxuICAgIH0sXG5dO1xuXG5jb25zdCBlcnJvcnMgPSB7XG4gICAgQUJBTkRPTkVEOiAocmVxKSA9PiByZXEuZ2V0dGV4dChcIkRhdGEgaW1wb3J0IGFiYW5kb25lZC5cIiksXG4gICAgRVJST1JfUkVBRElOR19EQVRBOiAocmVxKSA9PiByZXEuZ2V0dGV4dChcIkVycm9yIHJlYWRpbmcgZGF0YSBmcm9tIFwiICtcbiAgICAgICAgXCJwcm92aWRlZCBkYXRhIGZpbGVzLlwiKSxcbiAgICBFUlJPUl9TQVZJTkc6IChyZXEpID0+IHJlcS5nZXR0ZXh0KFwiRXJyb3Igc2F2aW5nIHJlY29yZC5cIiksXG4gICAgRVJST1JfREVMRVRJTkc6IChyZXEpID0+IHJlcS5nZXR0ZXh0KFwiRXJyb3IgZGVsZXRpbmcgZXhpc3RpbmcgcmVjb3JkLlwiKSxcbn07XG5cbi8vIFRPRE8oamVyZXNpZyk6IFJlbW92ZSB0aGlzLlxuY29uc3QgcmVxID0ge1xuICAgIGZvcm1hdDogKG1zZywgZmllbGRzKSA9PlxuICAgICAgICBtc2cucmVwbGFjZSgvJVxcKCguKj8pXFwpcy9nLCAoYWxsLCBuYW1lKSA9PiBmaWVsZHNbbmFtZV0pLFxuICAgIGdldHRleHQ6IChtc2cpID0+IG1zZyxcbiAgICBsYW5nOiBcImVuXCIsXG59O1xuXG5jb25zdCBSZWNvcmRJbXBvcnQgPSBuZXcgZGIuc2NoZW1hKE9iamVjdC5hc3NpZ24oe30sIEltcG9ydC5zY2hlbWEsIHtcbiAgICAvLyBUaGUgdHlwZSBvZiB0aGUgcmVjb3JkXG4gICAgdHlwZTogIHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICB9LFxuXG4gICAgLy8gVGhlIG5hbWUgb2YgdGhlIG9yaWdpbmFsIGZpbGUgKGUuZy4gYGZvby5qc29uYClcbiAgICBmaWxlTmFtZToge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIH0sXG59KSk7XG5cbk9iamVjdC5hc3NpZ24oUmVjb3JkSW1wb3J0Lm1ldGhvZHMsIEltcG9ydC5tZXRob2RzLCB7XG4gICAgZ2V0VVJMKGxhbmcpIHtcbiAgICAgICAgcmV0dXJuIHVybHMuZ2VuKGxhbmcsXG4gICAgICAgICAgICBgLyR7dGhpcy50eXBlfS9zb3VyY2UvJHt0aGlzLnNvdXJjZX0vYWRtaW4/cmVjb3Jkcz0ke3RoaXMuX2lkfWApO1xuICAgIH0sXG5cbiAgICBnZXRFcnJvcihyZXEpIHtcbiAgICAgICAgcmV0dXJuIG1vZGVscyhcIlJlY29yZEltcG9ydFwiKS5nZXRFcnJvcihyZXEsIHRoaXMuZXJyb3IpO1xuICAgIH0sXG5cbiAgICBnZXRTdGF0ZXMoKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZXM7XG4gICAgfSxcblxuICAgIHNldFJlc3VsdHMoaW5wdXRTdHJlYW1zLCBjYWxsYmFjaykge1xuICAgICAgICBjb25zdCBzb3VyY2UgPSB0aGlzLmdldFNvdXJjZSgpO1xuXG4gICAgICAgIHNvdXJjZS5wcm9jZXNzRmlsZXMoaW5wdXRTdHJlYW1zLCAoZXJyLCByZXN1bHRzKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvciA9IGVyci5tZXNzYWdlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNhdmVTdGF0ZShcImVycm9yXCIsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5yZXN1bHRzID0gcmVzdWx0cy5tYXAoKGRhdGEpID0+ICh7XG4gICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICAgICByZXN1bHQ6IFwidW5rbm93blwiLFxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgcHJvY2Vzc1JlY29yZHMoY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3QgUmVjb3JkID0gcmVjb3JkKHRoaXMudHlwZSk7XG4gICAgICAgIGNvbnN0IGluY29taW5nSURzID0ge307XG5cbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IHRoaXMucmVzdWx0cztcblxuICAgICAgICBhc3luYy5lYWNoTGltaXQocmVzdWx0cywgMSwgKHJlc3VsdCwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBPYmplY3QuYXNzaWduKHJlc3VsdC5kYXRhLCB7XG4gICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICBpZiAoY29uZmlnLk5PREVfRU5WICE9PSBcInRlc3RcIikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUHJvY2Vzc2luZyBSZWNvcmQ6XCIsIGRhdGEuaWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBSZWNvcmQuZnJvbURhdGEoZGF0YSwgcmVxLCAoZXJyLCByZWNvcmQsIHdhcm5pbmdzLCBpc05ldykgPT4ge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5zdGF0ZSA9IFwicHJvY2Vzcy5jb21wbGV0ZWRcIjtcblxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnJlc3VsdCA9IFwiZXJyb3JcIjtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gZXJyLm1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpc05ldykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucmVzdWx0ID0gXCJjcmVhdGVkXCI7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuZGlmZiA9IHJlY29yZC5kaWZmO1xuICAgICAgICAgICAgICAgICAgICBpbmNvbWluZ0lEc1tyZWNvcmQuX2lkXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5tb2RlbCA9IHJlY29yZC5faWQ7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5yZXN1bHQgPSByZXN1bHQuZGlmZiA/IFwiY2hhbmdlZFwiIDogXCJ1bmNoYW5nZWRcIjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXN1bHQud2FybmluZ3MgPSB3YXJuaW5ncztcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5OT0RFX0VOViAhPT0gXCJ0ZXN0XCIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZpbmRpbmcgcmVjb3JkcyB0byBkZWxldGUuLi5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEZpbmQgcmVjb3JkcyB0aGF0IG5lZWQgdG8gYmUgZGVsZXRlZFxuICAgICAgICAgICAgUmVjb3JkLmZpbmQoe3NvdXJjZTogdGhpcy5zb3VyY2V9KVxuICAgICAgICAgICAgICAgIC5sZWFuKCkuZGlzdGluY3QoXCJfaWRcIilcbiAgICAgICAgICAgICAgICAuZXhlYygoZXJyLCBpZHMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBpZCBvZiBpZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpZCBpbiBpbmNvbWluZ0lEcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWw6IGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdDogXCJkZWxldGVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGU6IFwicHJvY2Vzcy5jb21wbGV0ZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXN1bHRzID0gcmVzdWx0cztcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIG1hbnVhbGx5QXBwcm92ZShjYWxsYmFjaykge1xuICAgICAgICB0aGlzLnNhdmVTdGF0ZShcImltcG9ydC5zdGFydGVkXCIsIChlcnIpID0+IHtcbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBEZWxheSB0aGUgaW1wb3J0aW5nIG9mIHRoZSByZWNvcmRzIHRvIG5vdCBibG9jayB0aGUgVUlcbiAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4gdGhpcy5pbXBvcnRSZWNvcmRzKCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBJZ25vcmUgdGhlIHJlc3VsdCwgdXNlciBkb2Vzbid0IGNhcmUuXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBpbXBvcnRSZWNvcmRzKGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IFJlY29yZCA9IHJlY29yZCh0aGlzLnR5cGUpO1xuICAgICAgICBjb25zdCBTb3VyY2UgPSBtb2RlbHMoXCJTb3VyY2VcIik7XG5cbiAgICAgICAgYXN5bmMuZWFjaExpbWl0KHRoaXMucmVzdWx0cywgMSwgKHJlc3VsdCwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgIHJlc3VsdC5zdGF0ZSA9IFwiaW1wb3J0LnN0YXJ0ZWRcIjtcblxuICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICBpZiAoY29uZmlnLk5PREVfRU5WICE9PSBcInRlc3RcIikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSW1wb3J0aW5nXCIsIHJlc3VsdC5kYXRhLmlkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlc3VsdC5yZXN1bHQgPT09IFwiY3JlYXRlZFwiIHx8XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5yZXN1bHQgPT09IFwiY2hhbmdlZFwiKSB7XG4gICAgICAgICAgICAgICAgUmVjb3JkLmZyb21EYXRhKHJlc3VsdC5kYXRhLCByZXEsIChlcnIsIHJlY29yZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWNvcmQuc2F2ZSgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuc3RhdGUgPSBcImVycm9yXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gXCJFUlJPUl9TQVZJTkdcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Lm1vZGVsID0gcmVjb3JkLl9pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuc3RhdGUgPSBcImltcG9ydC5jb21wbGV0ZWRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0LnJlc3VsdCA9PT0gXCJkZWxldGVkXCIpIHtcbiAgICAgICAgICAgICAgICBSZWNvcmQuZmluZEJ5SWQocmVzdWx0Lm1vZGVsLCAoZXJyLCByZWNvcmQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIgfHwgIXJlY29yZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnN0YXRlID0gXCJlcnJvclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gXCJFUlJPUl9ERUxFVElOR1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZWNvcmQucmVtb3ZlKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5zdGF0ZSA9IFwiZXJyb3JcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuZXJyb3IgPSBcIkVSUk9SX0RFTEVUSU5HXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5zdGF0ZSA9IFwiaW1wb3J0LmNvbXBsZXRlZFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuc3RhdGUgPSBcImltcG9ydC5jb21wbGV0ZWRcIjtcbiAgICAgICAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvciA9IGVyci5tZXNzYWdlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNhdmVTdGF0ZShcImVycm9yXCIsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tYXJrTW9kaWZpZWQoXCJyZXN1bHRzXCIpO1xuXG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIGludGVybmFsIHNvdXJjZSBjYWNoZVxuICAgICAgICAgICAgU291cmNlLmNhY2hlU291cmNlcygoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gQWR2YW5jZSB0byB0aGUgbmV4dCBzdGF0ZVxuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZVN0YXRlKFwiaW1wb3J0LmNvbXBsZXRlZFwiLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHVwZGF0ZVNpbWlsYXJpdHkoY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IHRoaXMuZ2V0RmlsdGVyZWRSZXN1bHRzKCk7XG5cbiAgICAgICAgLy8gTm8gbmVlZCB0byB1cGRhdGUgdGhlIHNpbWlsYXJpdHkgaWYgbm8gcmVjb3JkcyB3ZXJlIGNyZWF0ZWRcbiAgICAgICAgLy8gb3IgZGVsZXRlZC5cbiAgICAgICAgaWYgKHJlc3VsdHMuY3JlYXRlZC5sZW5ndGggPT09IDAgJiYgcmVzdWx0cy5kZWxldGVkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2soY2FsbGJhY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBzaW1pbGFyaXR5IG9uIGFsbCByZWNvcmRzLCBpbmNsdWRpbmcgdGhlIG9uZXMgdGhhdFxuICAgICAgICAvLyB3ZXJlIGp1c3QgYWRkZWQuXG4gICAgICAgIHJlY29yZCh0aGlzLnR5cGUpLnVwZGF0ZShcbiAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAge25lZWRzU2ltaWxhclVwZGF0ZTogdHJ1ZX0sXG4gICAgICAgICAgICB7bXVsdGk6IHRydWV9LFxuICAgICAgICAgICAgY2FsbGJhY2tcbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgYWJhbmRvbihjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmVycm9yID0gXCJBQkFORE9ORURcIjtcbiAgICAgICAgdGhpcy5zYXZlU3RhdGUoXCJlcnJvclwiLCBjYWxsYmFjayk7XG4gICAgfSxcblxuICAgIGdldEZpbHRlcmVkUmVzdWx0cygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVucHJvY2Vzc2VkOiB0aGlzLnJlc3VsdHMuZmlsdGVyKFxuICAgICAgICAgICAgICAgIChyZXN1bHQpID0+IHJlc3VsdC5yZXN1bHQgPT09IFwidW5rbm93blwiKSxcbiAgICAgICAgICAgIGNyZWF0ZWQ6IHRoaXMucmVzdWx0cy5maWx0ZXIoXG4gICAgICAgICAgICAgICAgKHJlc3VsdCkgPT4gcmVzdWx0LnJlc3VsdCA9PT0gXCJjcmVhdGVkXCIpLFxuICAgICAgICAgICAgY2hhbmdlZDogdGhpcy5yZXN1bHRzLmZpbHRlcihcbiAgICAgICAgICAgICAgICAocmVzdWx0KSA9PiByZXN1bHQucmVzdWx0ID09PSBcImNoYW5nZWRcIiksXG4gICAgICAgICAgICBkZWxldGVkOiB0aGlzLnJlc3VsdHMuZmlsdGVyKFxuICAgICAgICAgICAgICAgIChyZXN1bHQpID0+IHJlc3VsdC5yZXN1bHQgPT09IFwiZGVsZXRlZFwiKSxcbiAgICAgICAgICAgIGVycm9yczogdGhpcy5yZXN1bHRzLmZpbHRlcigocmVzdWx0KSA9PiByZXN1bHQuZXJyb3IpLFxuICAgICAgICAgICAgd2FybmluZ3M6IHRoaXMucmVzdWx0c1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoKHJlc3VsdCkgPT4gKHJlc3VsdC53YXJuaW5ncyB8fCBbXSkubGVuZ3RoICE9PSAwKSxcbiAgICAgICAgfTtcbiAgICB9LFxufSk7XG5cbk9iamVjdC5hc3NpZ24oUmVjb3JkSW1wb3J0LnN0YXRpY3MsIEltcG9ydC5zdGF0aWNzLCB7XG4gICAgZnJvbUZpbGUoZmlsZU5hbWUsIHNvdXJjZSwgdHlwZSkge1xuICAgICAgICBjb25zdCBSZWNvcmRJbXBvcnQgPSBtb2RlbHMoXCJSZWNvcmRJbXBvcnRcIik7XG4gICAgICAgIHJldHVybiBuZXcgUmVjb3JkSW1wb3J0KHtzb3VyY2UsIGZpbGVOYW1lLCB0eXBlfSk7XG4gICAgfSxcblxuICAgIGdldEVycm9yKHJlcSwgZXJyb3IpIHtcbiAgICAgICAgY29uc3QgbXNnID0gZXJyb3JzW2Vycm9yXTtcbiAgICAgICAgcmV0dXJuIG1zZyA/IG1zZyhyZXEpIDogZXJyb3I7XG4gICAgfSxcbn0pO1xuXG5SZWNvcmRJbXBvcnQucHJlKFwidmFsaWRhdGVcIiwgZnVuY3Rpb24obmV4dCkge1xuICAgIC8vIENyZWF0ZSB0aGUgSUQgaWYgb25lIGhhc24ndCBiZWVuIHNldCBiZWZvcmVcbiAgICBpZiAoIXRoaXMuX2lkKSB7XG4gICAgICAgIHRoaXMuX2lkID0gYCR7dGhpcy5zb3VyY2V9LyR7RGF0ZS5ub3coKX1gO1xuICAgIH1cblxuICAgIG5leHQoKTtcbn0pO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuUmVjb3JkSW1wb3J0LnByZShcInNhdmVcIiwgZnVuY3Rpb24obmV4dCkge1xuICAgIC8vIEFsd2F5cyB1cGRhdGVkIHRoZSBtb2RpZmllZCB0aW1lIG9uIGV2ZXJ5IHNhdmVcbiAgICB0aGlzLm1vZGlmaWVkID0gbmV3IERhdGUoKTtcblxuICAgIG5leHQoKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlY29yZEltcG9ydDtcbiJdfQ==