"use strict";

var fs = require("fs");
var path = require("path");

var tap = require("tap");

var init = require("../init");
var req = init.req;
var RecordImport = init.RecordImport;

tap.test("getURL", { autoend: true }, function (t) {
    var batch = init.getRecordBatch();
    t.equal(batch.getURL(req.lang), "/artworks/source/test/admin?records=test/started", "Get URL");
});

tap.test("getSource", { autoend: true }, function (t) {
    var batch = init.getRecordBatch();
    var source = init.getSource();
    t.equal(batch.getSource(), source, "Get Source");
});

tap.test("getCurState", { autoend: true }, function (t) {
    var batch = init.getRecordBatch();
    var state = batch.getCurState();
    t.equal(state.id, "started", "Get State ID");
    t.equal(state.name(req), "Awaiting processing...", "Get State Name");

    batch.state = "similarity.sync.started";

    var otherState = batch.getCurState();
    t.equal(otherState.id, "similarity.sync.started", "Get State ID");
    t.equal(otherState.name(req), "Syncing similarity...", "Get State Name");
});

tap.test("getNextState", { autoend: true }, function (t) {
    var batch = init.getRecordBatch();
    var state = batch.getNextState();
    t.equal(state.id, "process.started", "Get State ID");
    t.equal(state.name(req), "Processing...", "Get State Name");
});

tap.test("canAdvance", { autoend: true }, function (t) {
    var batch = init.getRecordBatch();
    t.equal(batch.canAdvance(), true, "Check if state can advance");
});

tap.test("getError", { autoend: true }, function (t) {
    var batch = init.getRecordBatch();
    var errors = ["ABANDONED", "ERROR_READING_DATA", "ERROR_SAVING", "ERROR_DELETING"];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = errors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var error = _step.value;

            batch.error = error;
            t.ok(RecordImport.getError(req, batch.error), error);
            t.notEqual(RecordImport.getError(req, batch.error), error, error);
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
});

tap.test("saveState", function (t) {
    var batch = init.getRecordBatch();
    batch.saveState("process.started", function () {
        var state = batch.getCurState();
        t.equal(state.id, "process.started", "Get State ID");
        t.equal(state.name(req), "Processing...", "Get State Name");
        t.end();
    });
});

tap.test("abandon", function (t) {
    var batch = init.getRecordBatch();
    batch.abandon(function () {
        t.equal(batch.state, "error", "Get State ID");
        t.equal(batch.error, "ABANDONED", "Get Error Message");
        t.end();
    });
});

tap.test("setResults", function (t) {
    var batch = init.getRecordBatch();
    var dataFile = path.resolve(process.cwd(), "testData", "default.json");
    batch.setResults([fs.createReadStream(dataFile)], function (err) {
        t.error(err, "Error should be empty.");
        t.equal(batch.results.length, 6, "Check number of results");
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = batch.results[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var result = _step2.value;

                t.equal(result.result, "unknown");
                t.ok(result.data);
                t.equal(result.data.lang, "en");
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

        t.end();
    });
});

tap.test("setResults (with error)", function (t) {
    var error = ["Parse error on line 2:", "[    {        id: \"1234\",        ", "--------------^", "Expecting 'STRING', '}', got 'undefined'"].join("\n");

    var batch = init.getRecordBatch();
    var dataFile = path.resolve(process.cwd(), "testData", "default-error.json");
    batch.setResults([fs.createReadStream(dataFile)], function (err) {
        t.error(err, "Error should be empty.");
        t.equal(batch.error, error);
        t.equal(batch.getError(req), error);
        t.equal(batch.state, "error");
        t.equal(batch.results.length, 0, "Check number of results");
        t.end();
    });
});

tap.test("processRecords", function (t) {
    var batch = init.getRecordBatch();
    var dataFile = path.resolve(process.cwd(), "testData", "default.json");
    var expected = [{ model: "test/1234", result: "unchanged", warnings: [] }, {
        model: "test/1235",
        result: "changed",
        warnings: [],
        diff: {
            "url": ["http://google.com", "http://yahoo.com"],
            "locations": {
                "0": [{ "city": "New York City 2" }],
                "_t": "a",
                "_0": [{ "city": "New York City" }, 0, 0]
            },
            "dates": {
                "0": [{ "circa": true, "start": 1455, "end": 1457 }],
                "_t": "a",
                "_0": [{ "start": 1456, "end": 1457, "circa": true }, 0, 0]
            },
            "dimensions": {
                "0": [{ "width": 123, "height": 140, "unit": "mm" }],
                "_t": "a",
                "_0": [{ "width": 123, "height": 130, "unit": "mm" }, 0, 0]
            },
            "artists": {
                "0": {
                    "dates": {
                        "0": [{ "circa": true, "start": 1456, "end": 1458 }],
                        "_t": "a",
                        "_0": [{ "start": 1456, "end": 1457, "circa": true }, 0, 0]
                    }
                },
                "_t": "a"
            }
        }
    }, { result: "created", warnings: [] }, {
        result: "created",
        warnings: ["Recommended field `objectType` is empty."]
    }, {
        result: "error",
        error: "Required field `images` is empty."
    }, {
        result: "error",
        error: "Required field `id` is empty."
    }, { model: "test/1236", result: "deleted" }, { model: "test/1237", result: "deleted" }];
    batch.setResults([fs.createReadStream(dataFile)], function (err) {
        t.error(err);
        batch.processRecords(function () {
            t.equal(batch.results.length, expected.length, "Check number of results");
            expected.forEach(function (expected, i) {
                var result = batch.results[i];
                t.equal(result.state, "process.completed");
                for (var prop in expected) {
                    t.same(result[prop], expected[prop]);
                }
            });
            t.end();
        });
    });
});

tap.test("importRecords", function (t) {
    var batch = init.getRecordBatch();
    var dataFile = path.resolve(process.cwd(), "testData", "default.json");
    var expected = [{ model: "test/1234", result: "unchanged", warnings: [] }, {
        model: "test/1235",
        result: "changed",
        warnings: []
    }, { model: "test/9234", result: "created", warnings: [] }, {
        model: "test/2234",
        result: "created",
        warnings: ["Recommended field `objectType` is empty."]
    }, {
        result: "error",
        error: "Required field `images` is empty."
    }, {
        result: "error",
        error: "Required field `id` is empty."
    }, { model: "test/1236", result: "deleted" }, { model: "test/1237", result: "deleted" }];
    batch.setResults([fs.createReadStream(dataFile)], function (err) {
        t.error(err);
        batch.processRecords(function () {
            batch.importRecords(function () {
                t.equal(batch.results.length, expected.length, "Check number of results");
                expected.forEach(function (expected, i) {
                    var result = batch.results[i];
                    t.equal(result.state, "import.completed");
                    for (var prop in expected) {
                        t.same(result[prop], expected[prop]);
                    }
                });
                t.end();
            });
        });
    });
});

tap.test("updateSimilarity (empty results)", function (t) {
    var batch = init.getRecordBatch();

    var recordMap = init.getRecords();
    var records = Object.keys(recordMap).map(function (id) {
        return recordMap[id];
    });

    batch.updateSimilarity(function () {
        records.forEach(function (record) {
            t.equal(record.needsSimilarUpdate, false);
        });

        t.end();
    });
});

tap.test("updateSimilarity", function (t) {
    var batch = init.getRecordBatch();
    var dataFile = path.resolve(process.cwd(), "testData", "default.json");

    var recordMap = init.getRecords();
    var records = Object.keys(recordMap).map(function (id) {
        return recordMap[id];
    });

    batch.setResults([fs.createReadStream(dataFile)], function (err) {
        t.error(err);
        batch.processRecords(function () {
            batch.updateSimilarity(function () {
                records.forEach(function (record) {
                    t.equal(record.needsSimilarUpdate, true);
                });

                t.end();
            });
        });
    });
});

tap.test("getFilteredResults", { autoend: true }, function (t) {
    var results = init.getRecordBatch().getFilteredResults();
    t.same(results, {
        "unprocessed": [],
        "created": [],
        "changed": [],
        "deleted": [],
        "errors": [],
        "warnings": []
    });

    var batch = new RecordImport({
        _id: "test/started",
        fileName: "data.json",
        source: "test",
        state: "process.completed",
        results: [{ model: "test/1234", result: "unchanged", warnings: [] }, {
            model: "test/1235",
            result: "changed",
            warnings: []
        }, { model: "test/9234", result: "created", warnings: [] }, {
            model: "test/2234",
            result: "created",
            warnings: ["Recommended field `objectType` is empty."]
        }, {
            result: "error",
            error: "Required field `images` is empty."
        }, {
            result: "error",
            error: "Required field `id` is empty."
        }, { model: "test/1236", result: "deleted" }, { model: "test/1237", result: "deleted" }]
    });

    t.same(batch.getFilteredResults(), {
        "unprocessed": [],
        "changed": [{
            "model": "test/1235",
            "result": "changed",
            "warnings": []
        }],
        "created": [{
            "model": "test/9234",
            "result": "created",
            "warnings": []
        }, {
            "model": "test/2234",
            "result": "created",
            "warnings": ["Recommended field `objectType` is empty."]
        }],
        "deleted": [{
            "model": "test/1236",
            "result": "deleted"
        }, {
            "model": "test/1237",
            "result": "deleted"
        }],
        "errors": [{
            "error": "Required field `images` is empty.",
            "result": "error"
        }, {
            "error": "Required field `id` is empty.",
            "result": "error"
        }],
        "warnings": [{
            "model": "test/2234",
            "result": "created",
            "warnings": ["Recommended field `objectType` is empty."]
        }]
    });
});

tap.test("RecordImport.advance", function (t) {
    var checkStates = function checkStates(batches, states) {
        t.equal(batches.length, states.length);
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = batches[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var _batch = _step3.value;

                t.equal(_batch.state, states.shift());
                t.ok(_batch.getCurState().name(req));
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }
    };

    var batch = init.getRecordBatch();
    var dataFile = path.resolve(process.cwd(), "testData", "default.json");

    var getBatches = function getBatches(callback) {
        RecordImport.find({}, "", {}, function (err, batches) {
            callback(null, batches.filter(function (batch) {
                return batch.state !== "error" && batch.state !== "completed";
            }));
        });
    };

    batch.setResults([fs.createReadStream(dataFile)], function (err) {
        t.error(err, "Error should be empty.");
        t.equal(batch.results.length, 6, "Check number of results");
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = batch.results[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var result = _step4.value;

                t.equal(result.result, "unknown");
                t.ok(result.data);
                t.equal(result.data.lang, "en");
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }

        getBatches(function (err, batches) {
            checkStates(batches, ["started"]);

            RecordImport.advance(function (err) {
                t.error(err, "Error should be empty.");

                getBatches(function (err, batches) {
                    checkStates(batches, ["process.completed"]);

                    // Need to manually move to the next step
                    batch.importRecords(function (err) {
                        t.error(err, "Error should be empty.");

                        getBatches(function (err, batches) {
                            checkStates(batches, ["import.completed"]);

                            RecordImport.advance(function (err) {
                                t.error(err, "Error should be empty.");

                                getBatches(function (err, batches) {
                                    checkStates(batches, ["similarity.sync.completed"]);

                                    RecordImport.advance(function (err) {
                                        t.error(err, "Error should be empty.");

                                        t.ok(batch.getCurState().name(req));

                                        getBatches(function (err, batches) {
                                            checkStates(batches, []);
                                            t.end();
                                        });
                                    });

                                    t.ok(batch.getCurState().name(req));
                                });
                            });

                            t.ok(batch.getCurState().name(req));
                        });
                    });

                    t.ok(batch.getCurState().name(req));
                });
            });

            t.ok(batch.getCurState().name(req));
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0cy9zY2hlbWFzL1JlY29yZEltcG9ydC5qcyJdLCJuYW1lcyI6WyJmcyIsInJlcXVpcmUiLCJwYXRoIiwidGFwIiwiaW5pdCIsInJlcSIsIlJlY29yZEltcG9ydCIsInRlc3QiLCJhdXRvZW5kIiwidCIsImJhdGNoIiwiZ2V0UmVjb3JkQmF0Y2giLCJlcXVhbCIsImdldFVSTCIsImxhbmciLCJzb3VyY2UiLCJnZXRTb3VyY2UiLCJzdGF0ZSIsImdldEN1clN0YXRlIiwiaWQiLCJuYW1lIiwib3RoZXJTdGF0ZSIsImdldE5leHRTdGF0ZSIsImNhbkFkdmFuY2UiLCJlcnJvcnMiLCJlcnJvciIsIm9rIiwiZ2V0RXJyb3IiLCJub3RFcXVhbCIsInNhdmVTdGF0ZSIsImVuZCIsImFiYW5kb24iLCJkYXRhRmlsZSIsInJlc29sdmUiLCJwcm9jZXNzIiwiY3dkIiwic2V0UmVzdWx0cyIsImNyZWF0ZVJlYWRTdHJlYW0iLCJlcnIiLCJyZXN1bHRzIiwibGVuZ3RoIiwicmVzdWx0IiwiZGF0YSIsImpvaW4iLCJleHBlY3RlZCIsIm1vZGVsIiwid2FybmluZ3MiLCJkaWZmIiwicHJvY2Vzc1JlY29yZHMiLCJmb3JFYWNoIiwiaSIsInByb3AiLCJzYW1lIiwiaW1wb3J0UmVjb3JkcyIsInJlY29yZE1hcCIsImdldFJlY29yZHMiLCJyZWNvcmRzIiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsInVwZGF0ZVNpbWlsYXJpdHkiLCJyZWNvcmQiLCJuZWVkc1NpbWlsYXJVcGRhdGUiLCJnZXRGaWx0ZXJlZFJlc3VsdHMiLCJfaWQiLCJmaWxlTmFtZSIsImNoZWNrU3RhdGVzIiwiYmF0Y2hlcyIsInN0YXRlcyIsInNoaWZ0IiwiZ2V0QmF0Y2hlcyIsImNhbGxiYWNrIiwiZmluZCIsImZpbHRlciIsImFkdmFuY2UiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsS0FBS0MsUUFBUSxJQUFSLENBQVg7QUFDQSxJQUFNQyxPQUFPRCxRQUFRLE1BQVIsQ0FB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O0FBQzFCN0Isa0NBQUVnQixLQUFGLENBQVFhLEdBQVIsRUFBYSx3QkFBYjs7QUFFQWdDLDJDQUFXLFVBQUNoQyxHQUFELEVBQU02QixPQUFOLEVBQWtCO0FBQ3pCRCxnREFBWUMsT0FBWixFQUNJLENBQUMsMkJBQUQsQ0FESjs7QUFHQTdELGlEQUFhb0UsT0FBYixDQUFxQixVQUFDcEMsR0FBRCxFQUFTO0FBQzFCN0IsMENBQUVnQixLQUFGLENBQVFhLEdBQVIsRUFBYSx3QkFBYjs7QUFFQTdCLDBDQUFFaUIsRUFBRixDQUFLaEIsTUFBTVEsV0FBTixHQUFvQkUsSUFBcEIsQ0FBeUJmLEdBQXpCLENBQUw7O0FBRUFpRSxtREFBVyxVQUFDaEMsR0FBRCxFQUFNNkIsT0FBTixFQUFrQjtBQUN6QkQsd0RBQVlDLE9BQVosRUFBcUIsRUFBckI7QUFDQTFELDhDQUFFcUIsR0FBRjtBQUNILHlDQUhEO0FBSUgscUNBVEQ7O0FBV0FyQixzQ0FBRWlCLEVBQUYsQ0FBS2hCLE1BQU1RLFdBQU4sR0FBb0JFLElBQXBCLENBQXlCZixHQUF6QixDQUFMO0FBQ0gsaUNBaEJEO0FBaUJILDZCQXBCRDs7QUFzQkFJLDhCQUFFaUIsRUFBRixDQUFLaEIsTUFBTVEsV0FBTixHQUFvQkUsSUFBcEIsQ0FBeUJmLEdBQXpCLENBQUw7QUFDSCx5QkExQkQ7QUEyQkgscUJBOUJEOztBQWdDQUksc0JBQUVpQixFQUFGLENBQUtoQixNQUFNUSxXQUFOLEdBQW9CRSxJQUFwQixDQUF5QmYsR0FBekIsQ0FBTDtBQUNILGlCQXJDRDtBQXNDSCxhQXpDRDs7QUEyQ0FJLGNBQUVpQixFQUFGLENBQUtoQixNQUFNUSxXQUFOLEdBQW9CRSxJQUFwQixDQUF5QmYsR0FBekIsQ0FBTDtBQUNILFNBL0NEO0FBZ0RILEtBekREO0FBMERILENBN0VEIiwiZmlsZSI6IlJlY29yZEltcG9ydC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGZzID0gcmVxdWlyZShcImZzXCIpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuXG5jb25zdCB0YXAgPSByZXF1aXJlKFwidGFwXCIpO1xuXG5jb25zdCBpbml0ID0gcmVxdWlyZShcIi4uL2luaXRcIik7XG5jb25zdCByZXEgPSBpbml0LnJlcTtcbmNvbnN0IFJlY29yZEltcG9ydCA9IGluaXQuUmVjb3JkSW1wb3J0O1xuXG50YXAudGVzdChcImdldFVSTFwiLCB7YXV0b2VuZDogdHJ1ZX0sICh0KSA9PiB7XG4gICAgY29uc3QgYmF0Y2ggPSBpbml0LmdldFJlY29yZEJhdGNoKCk7XG4gICAgdC5lcXVhbChiYXRjaC5nZXRVUkwocmVxLmxhbmcpLFxuICAgICAgICBcIi9hcnR3b3Jrcy9zb3VyY2UvdGVzdC9hZG1pbj9yZWNvcmRzPXRlc3Qvc3RhcnRlZFwiLFxuICAgICAgICBcIkdldCBVUkxcIik7XG59KTtcblxudGFwLnRlc3QoXCJnZXRTb3VyY2VcIiwge2F1dG9lbmQ6IHRydWV9LCAodCkgPT4ge1xuICAgIGNvbnN0IGJhdGNoID0gaW5pdC5nZXRSZWNvcmRCYXRjaCgpO1xuICAgIGNvbnN0IHNvdXJjZSA9IGluaXQuZ2V0U291cmNlKCk7XG4gICAgdC5lcXVhbChiYXRjaC5nZXRTb3VyY2UoKSwgc291cmNlLCBcIkdldCBTb3VyY2VcIik7XG59KTtcblxudGFwLnRlc3QoXCJnZXRDdXJTdGF0ZVwiLCB7YXV0b2VuZDogdHJ1ZX0sICh0KSA9PiB7XG4gICAgY29uc3QgYmF0Y2ggPSBpbml0LmdldFJlY29yZEJhdGNoKCk7XG4gICAgY29uc3Qgc3RhdGUgPSBiYXRjaC5nZXRDdXJTdGF0ZSgpO1xuICAgIHQuZXF1YWwoc3RhdGUuaWQsIFwic3RhcnRlZFwiLCBcIkdldCBTdGF0ZSBJRFwiKTtcbiAgICB0LmVxdWFsKHN0YXRlLm5hbWUocmVxKSwgXCJBd2FpdGluZyBwcm9jZXNzaW5nLi4uXCIsIFwiR2V0IFN0YXRlIE5hbWVcIik7XG5cbiAgICBiYXRjaC5zdGF0ZSA9IFwic2ltaWxhcml0eS5zeW5jLnN0YXJ0ZWRcIjtcblxuICAgIGNvbnN0IG90aGVyU3RhdGUgPSBiYXRjaC5nZXRDdXJTdGF0ZSgpO1xuICAgIHQuZXF1YWwob3RoZXJTdGF0ZS5pZCwgXCJzaW1pbGFyaXR5LnN5bmMuc3RhcnRlZFwiLCBcIkdldCBTdGF0ZSBJRFwiKTtcbiAgICB0LmVxdWFsKG90aGVyU3RhdGUubmFtZShyZXEpLCBcIlN5bmNpbmcgc2ltaWxhcml0eS4uLlwiLCBcIkdldCBTdGF0ZSBOYW1lXCIpO1xufSk7XG5cbnRhcC50ZXN0KFwiZ2V0TmV4dFN0YXRlXCIsIHthdXRvZW5kOiB0cnVlfSwgKHQpID0+IHtcbiAgICBjb25zdCBiYXRjaCA9IGluaXQuZ2V0UmVjb3JkQmF0Y2goKTtcbiAgICBjb25zdCBzdGF0ZSA9IGJhdGNoLmdldE5leHRTdGF0ZSgpO1xuICAgIHQuZXF1YWwoc3RhdGUuaWQsIFwicHJvY2Vzcy5zdGFydGVkXCIsIFwiR2V0IFN0YXRlIElEXCIpO1xuICAgIHQuZXF1YWwoc3RhdGUubmFtZShyZXEpLCBcIlByb2Nlc3NpbmcuLi5cIiwgXCJHZXQgU3RhdGUgTmFtZVwiKTtcbn0pO1xuXG50YXAudGVzdChcImNhbkFkdmFuY2VcIiwge2F1dG9lbmQ6IHRydWV9LCAodCkgPT4ge1xuICAgIGNvbnN0IGJhdGNoID0gaW5pdC5nZXRSZWNvcmRCYXRjaCgpO1xuICAgIHQuZXF1YWwoYmF0Y2guY2FuQWR2YW5jZSgpLCB0cnVlLCBcIkNoZWNrIGlmIHN0YXRlIGNhbiBhZHZhbmNlXCIpO1xufSk7XG5cbnRhcC50ZXN0KFwiZ2V0RXJyb3JcIiwge2F1dG9lbmQ6IHRydWV9LCAodCkgPT4ge1xuICAgIGNvbnN0IGJhdGNoID0gaW5pdC5nZXRSZWNvcmRCYXRjaCgpO1xuICAgIGNvbnN0IGVycm9ycyA9IFtcIkFCQU5ET05FRFwiLCBcIkVSUk9SX1JFQURJTkdfREFUQVwiLCBcIkVSUk9SX1NBVklOR1wiLFxuICAgICAgICBcIkVSUk9SX0RFTEVUSU5HXCJdO1xuICAgIGZvciAoY29uc3QgZXJyb3Igb2YgZXJyb3JzKSB7XG4gICAgICAgIGJhdGNoLmVycm9yID0gZXJyb3I7XG4gICAgICAgIHQub2soUmVjb3JkSW1wb3J0LmdldEVycm9yKHJlcSwgYmF0Y2guZXJyb3IpLCBlcnJvcik7XG4gICAgICAgIHQubm90RXF1YWwoUmVjb3JkSW1wb3J0LmdldEVycm9yKHJlcSwgYmF0Y2guZXJyb3IpLCBlcnJvciwgZXJyb3IpO1xuICAgIH1cbn0pO1xuXG50YXAudGVzdChcInNhdmVTdGF0ZVwiLCAodCkgPT4ge1xuICAgIGNvbnN0IGJhdGNoID0gaW5pdC5nZXRSZWNvcmRCYXRjaCgpO1xuICAgIGJhdGNoLnNhdmVTdGF0ZShcInByb2Nlc3Muc3RhcnRlZFwiLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YXRlID0gYmF0Y2guZ2V0Q3VyU3RhdGUoKTtcbiAgICAgICAgdC5lcXVhbChzdGF0ZS5pZCwgXCJwcm9jZXNzLnN0YXJ0ZWRcIiwgXCJHZXQgU3RhdGUgSURcIik7XG4gICAgICAgIHQuZXF1YWwoc3RhdGUubmFtZShyZXEpLCBcIlByb2Nlc3NpbmcuLi5cIiwgXCJHZXQgU3RhdGUgTmFtZVwiKTtcbiAgICAgICAgdC5lbmQoKTtcbiAgICB9KTtcbn0pO1xuXG50YXAudGVzdChcImFiYW5kb25cIiwgKHQpID0+IHtcbiAgICBjb25zdCBiYXRjaCA9IGluaXQuZ2V0UmVjb3JkQmF0Y2goKTtcbiAgICBiYXRjaC5hYmFuZG9uKCgpID0+IHtcbiAgICAgICAgdC5lcXVhbChiYXRjaC5zdGF0ZSwgXCJlcnJvclwiLCBcIkdldCBTdGF0ZSBJRFwiKTtcbiAgICAgICAgdC5lcXVhbChiYXRjaC5lcnJvciwgXCJBQkFORE9ORURcIiwgXCJHZXQgRXJyb3IgTWVzc2FnZVwiKTtcbiAgICAgICAgdC5lbmQoKTtcbiAgICB9KTtcbn0pO1xuXG50YXAudGVzdChcInNldFJlc3VsdHNcIiwgKHQpID0+IHtcbiAgICBjb25zdCBiYXRjaCA9IGluaXQuZ2V0UmVjb3JkQmF0Y2goKTtcbiAgICBjb25zdCBkYXRhRmlsZSA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBcInRlc3REYXRhXCIsIFwiZGVmYXVsdC5qc29uXCIpO1xuICAgIGJhdGNoLnNldFJlc3VsdHMoW2ZzLmNyZWF0ZVJlYWRTdHJlYW0oZGF0YUZpbGUpXSwgKGVycikgPT4ge1xuICAgICAgICB0LmVycm9yKGVyciwgXCJFcnJvciBzaG91bGQgYmUgZW1wdHkuXCIpO1xuICAgICAgICB0LmVxdWFsKGJhdGNoLnJlc3VsdHMubGVuZ3RoLCA2LCBcIkNoZWNrIG51bWJlciBvZiByZXN1bHRzXCIpO1xuICAgICAgICBmb3IgKGNvbnN0IHJlc3VsdCBvZiBiYXRjaC5yZXN1bHRzKSB7XG4gICAgICAgICAgICB0LmVxdWFsKHJlc3VsdC5yZXN1bHQsIFwidW5rbm93blwiKTtcbiAgICAgICAgICAgIHQub2socmVzdWx0LmRhdGEpO1xuICAgICAgICAgICAgdC5lcXVhbChyZXN1bHQuZGF0YS5sYW5nLCBcImVuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHQuZW5kKCk7XG4gICAgfSk7XG59KTtcblxudGFwLnRlc3QoXCJzZXRSZXN1bHRzICh3aXRoIGVycm9yKVwiLCAodCkgPT4ge1xuICAgIGNvbnN0IGVycm9yID0gW1xuICAgICAgICBcIlBhcnNlIGVycm9yIG9uIGxpbmUgMjpcIixcbiAgICAgICAgXCJbICAgIHsgICAgICAgIGlkOiBcXFwiMTIzNFxcXCIsICAgICAgICBcIixcbiAgICAgICAgXCItLS0tLS0tLS0tLS0tLV5cIixcbiAgICAgICAgXCJFeHBlY3RpbmcgJ1NUUklORycsICd9JywgZ290ICd1bmRlZmluZWQnXCIsXG4gICAgXS5qb2luKFwiXFxuXCIpO1xuXG4gICAgY29uc3QgYmF0Y2ggPSBpbml0LmdldFJlY29yZEJhdGNoKCk7XG4gICAgY29uc3QgZGF0YUZpbGUgPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgXCJ0ZXN0RGF0YVwiLFxuICAgICAgICBcImRlZmF1bHQtZXJyb3IuanNvblwiKTtcbiAgICBiYXRjaC5zZXRSZXN1bHRzKFtmcy5jcmVhdGVSZWFkU3RyZWFtKGRhdGFGaWxlKV0sIChlcnIpID0+IHtcbiAgICAgICAgdC5lcnJvcihlcnIsIFwiRXJyb3Igc2hvdWxkIGJlIGVtcHR5LlwiKTtcbiAgICAgICAgdC5lcXVhbChiYXRjaC5lcnJvciwgZXJyb3IpO1xuICAgICAgICB0LmVxdWFsKGJhdGNoLmdldEVycm9yKHJlcSksIGVycm9yKTtcbiAgICAgICAgdC5lcXVhbChiYXRjaC5zdGF0ZSwgXCJlcnJvclwiKTtcbiAgICAgICAgdC5lcXVhbChiYXRjaC5yZXN1bHRzLmxlbmd0aCwgMCwgXCJDaGVjayBudW1iZXIgb2YgcmVzdWx0c1wiKTtcbiAgICAgICAgdC5lbmQoKTtcbiAgICB9KTtcbn0pO1xuXG50YXAudGVzdChcInByb2Nlc3NSZWNvcmRzXCIsICh0KSA9PiB7XG4gICAgY29uc3QgYmF0Y2ggPSBpbml0LmdldFJlY29yZEJhdGNoKCk7XG4gICAgY29uc3QgZGF0YUZpbGUgPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgXCJ0ZXN0RGF0YVwiLCBcImRlZmF1bHQuanNvblwiKTtcbiAgICBjb25zdCBleHBlY3RlZCA9IFtcbiAgICAgICAge21vZGVsOiBcInRlc3QvMTIzNFwiLCByZXN1bHQ6IFwidW5jaGFuZ2VkXCIsIHdhcm5pbmdzOiBbXX0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG1vZGVsOiBcInRlc3QvMTIzNVwiLFxuICAgICAgICAgICAgcmVzdWx0OiBcImNoYW5nZWRcIixcbiAgICAgICAgICAgIHdhcm5pbmdzOiBbXSxcbiAgICAgICAgICAgIGRpZmY6IHtcbiAgICAgICAgICAgICAgICBcInVybFwiOiBbXG4gICAgICAgICAgICAgICAgICAgIFwiaHR0cDovL2dvb2dsZS5jb21cIixcbiAgICAgICAgICAgICAgICAgICAgXCJodHRwOi8veWFob28uY29tXCIsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcImxvY2F0aW9uc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiMFwiOiBbe1wiY2l0eVwiOiBcIk5ldyBZb3JrIENpdHkgMlwifV0sXG4gICAgICAgICAgICAgICAgICAgIFwiX3RcIjogXCJhXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiXzBcIjogW3tcImNpdHlcIjogXCJOZXcgWW9yayBDaXR5XCJ9LCAwLCAwXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiZGF0ZXNcIjoge1xuICAgICAgICAgICAgICAgICAgICBcIjBcIjogW3tcImNpcmNhXCI6IHRydWUsIFwic3RhcnRcIjogMTQ1NSwgXCJlbmRcIjogMTQ1N31dLFxuICAgICAgICAgICAgICAgICAgICBcIl90XCI6IFwiYVwiLFxuICAgICAgICAgICAgICAgICAgICBcIl8wXCI6IFt7XCJzdGFydFwiOiAxNDU2LCBcImVuZFwiOiAxNDU3LCBcImNpcmNhXCI6IHRydWV9LCAwLCAwXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiZGltZW5zaW9uc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiMFwiOiBbe1wid2lkdGhcIjogMTIzLCBcImhlaWdodFwiOiAxNDAsIFwidW5pdFwiOiBcIm1tXCJ9XSxcbiAgICAgICAgICAgICAgICAgICAgXCJfdFwiOiBcImFcIixcbiAgICAgICAgICAgICAgICAgICAgXCJfMFwiOiBbe1wid2lkdGhcIjogMTIzLCBcImhlaWdodFwiOiAxMzAsIFwidW5pdFwiOiBcIm1tXCJ9LCAwLCAwXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiYXJ0aXN0c1wiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiMFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImRhdGVzXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjBcIjogW3tcImNpcmNhXCI6IHRydWUsIFwic3RhcnRcIjogMTQ1NiwgXCJlbmRcIjogMTQ1OH1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiX3RcIjogXCJhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJfMFwiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcInN0YXJ0XCI6IDE0NTYsIFwiZW5kXCI6IDE0NTcsIFwiY2lyY2FcIjogdHJ1ZX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiX3RcIjogXCJhXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHtyZXN1bHQ6IFwiY3JlYXRlZFwiLCB3YXJuaW5nczogW119LFxuICAgICAgICB7XG4gICAgICAgICAgICByZXN1bHQ6IFwiY3JlYXRlZFwiLFxuICAgICAgICAgICAgd2FybmluZ3M6IFtcIlJlY29tbWVuZGVkIGZpZWxkIGBvYmplY3RUeXBlYCBpcyBlbXB0eS5cIl0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJlc3VsdDogXCJlcnJvclwiLFxuICAgICAgICAgICAgZXJyb3I6IFwiUmVxdWlyZWQgZmllbGQgYGltYWdlc2AgaXMgZW1wdHkuXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJlc3VsdDogXCJlcnJvclwiLFxuICAgICAgICAgICAgZXJyb3I6IFwiUmVxdWlyZWQgZmllbGQgYGlkYCBpcyBlbXB0eS5cIixcbiAgICAgICAgfSxcbiAgICAgICAge21vZGVsOiBcInRlc3QvMTIzNlwiLCByZXN1bHQ6IFwiZGVsZXRlZFwifSxcbiAgICAgICAge21vZGVsOiBcInRlc3QvMTIzN1wiLCByZXN1bHQ6IFwiZGVsZXRlZFwifSxcbiAgICBdO1xuICAgIGJhdGNoLnNldFJlc3VsdHMoW2ZzLmNyZWF0ZVJlYWRTdHJlYW0oZGF0YUZpbGUpXSwgKGVycikgPT4ge1xuICAgICAgICB0LmVycm9yKGVycik7XG4gICAgICAgIGJhdGNoLnByb2Nlc3NSZWNvcmRzKCgpID0+IHtcbiAgICAgICAgICAgIHQuZXF1YWwoYmF0Y2gucmVzdWx0cy5sZW5ndGgsIGV4cGVjdGVkLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBcIkNoZWNrIG51bWJlciBvZiByZXN1bHRzXCIpO1xuICAgICAgICAgICAgZXhwZWN0ZWQuZm9yRWFjaCgoZXhwZWN0ZWQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBiYXRjaC5yZXN1bHRzW2ldO1xuICAgICAgICAgICAgICAgIHQuZXF1YWwocmVzdWx0LnN0YXRlLCBcInByb2Nlc3MuY29tcGxldGVkXCIpO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcHJvcCBpbiBleHBlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICB0LnNhbWUocmVzdWx0W3Byb3BdLCBleHBlY3RlZFtwcm9wXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0LmVuZCgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuXG50YXAudGVzdChcImltcG9ydFJlY29yZHNcIiwgKHQpID0+IHtcbiAgICBjb25zdCBiYXRjaCA9IGluaXQuZ2V0UmVjb3JkQmF0Y2goKTtcbiAgICBjb25zdCBkYXRhRmlsZSA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBcInRlc3REYXRhXCIsIFwiZGVmYXVsdC5qc29uXCIpO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gW1xuICAgICAgICB7bW9kZWw6IFwidGVzdC8xMjM0XCIsIHJlc3VsdDogXCJ1bmNoYW5nZWRcIiwgd2FybmluZ3M6IFtdfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbW9kZWw6IFwidGVzdC8xMjM1XCIsXG4gICAgICAgICAgICByZXN1bHQ6IFwiY2hhbmdlZFwiLFxuICAgICAgICAgICAgd2FybmluZ3M6IFtdLFxuICAgICAgICB9LFxuICAgICAgICB7bW9kZWw6IFwidGVzdC85MjM0XCIsIHJlc3VsdDogXCJjcmVhdGVkXCIsIHdhcm5pbmdzOiBbXX0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG1vZGVsOiBcInRlc3QvMjIzNFwiLFxuICAgICAgICAgICAgcmVzdWx0OiBcImNyZWF0ZWRcIixcbiAgICAgICAgICAgIHdhcm5pbmdzOiBbXCJSZWNvbW1lbmRlZCBmaWVsZCBgb2JqZWN0VHlwZWAgaXMgZW1wdHkuXCJdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICByZXN1bHQ6IFwiZXJyb3JcIixcbiAgICAgICAgICAgIGVycm9yOiBcIlJlcXVpcmVkIGZpZWxkIGBpbWFnZXNgIGlzIGVtcHR5LlwiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICByZXN1bHQ6IFwiZXJyb3JcIixcbiAgICAgICAgICAgIGVycm9yOiBcIlJlcXVpcmVkIGZpZWxkIGBpZGAgaXMgZW1wdHkuXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHttb2RlbDogXCJ0ZXN0LzEyMzZcIiwgcmVzdWx0OiBcImRlbGV0ZWRcIn0sXG4gICAgICAgIHttb2RlbDogXCJ0ZXN0LzEyMzdcIiwgcmVzdWx0OiBcImRlbGV0ZWRcIn0sXG4gICAgXTtcbiAgICBiYXRjaC5zZXRSZXN1bHRzKFtmcy5jcmVhdGVSZWFkU3RyZWFtKGRhdGFGaWxlKV0sIChlcnIpID0+IHtcbiAgICAgICAgdC5lcnJvcihlcnIpO1xuICAgICAgICBiYXRjaC5wcm9jZXNzUmVjb3JkcygoKSA9PiB7XG4gICAgICAgICAgICBiYXRjaC5pbXBvcnRSZWNvcmRzKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0LmVxdWFsKGJhdGNoLnJlc3VsdHMubGVuZ3RoLCBleHBlY3RlZC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgIFwiQ2hlY2sgbnVtYmVyIG9mIHJlc3VsdHNcIik7XG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQuZm9yRWFjaCgoZXhwZWN0ZWQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYmF0Y2gucmVzdWx0c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgdC5lcXVhbChyZXN1bHQuc3RhdGUsIFwiaW1wb3J0LmNvbXBsZXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBwcm9wIGluIGV4cGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0LnNhbWUocmVzdWx0W3Byb3BdLCBleHBlY3RlZFtwcm9wXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0LmVuZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG5cbnRhcC50ZXN0KFwidXBkYXRlU2ltaWxhcml0eSAoZW1wdHkgcmVzdWx0cylcIiwgKHQpID0+IHtcbiAgICBjb25zdCBiYXRjaCA9IGluaXQuZ2V0UmVjb3JkQmF0Y2goKTtcblxuICAgIGNvbnN0IHJlY29yZE1hcCA9IGluaXQuZ2V0UmVjb3JkcygpO1xuICAgIGNvbnN0IHJlY29yZHMgPSBPYmplY3Qua2V5cyhyZWNvcmRNYXApXG4gICAgICAgIC5tYXAoKGlkKSA9PiByZWNvcmRNYXBbaWRdKTtcblxuICAgIGJhdGNoLnVwZGF0ZVNpbWlsYXJpdHkoKCkgPT4ge1xuICAgICAgICByZWNvcmRzLmZvckVhY2goKHJlY29yZCkgPT4ge1xuICAgICAgICAgICAgdC5lcXVhbChyZWNvcmQubmVlZHNTaW1pbGFyVXBkYXRlLCBmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHQuZW5kKCk7XG4gICAgfSk7XG59KTtcblxudGFwLnRlc3QoXCJ1cGRhdGVTaW1pbGFyaXR5XCIsICh0KSA9PiB7XG4gICAgY29uc3QgYmF0Y2ggPSBpbml0LmdldFJlY29yZEJhdGNoKCk7XG4gICAgY29uc3QgZGF0YUZpbGUgPSBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgXCJ0ZXN0RGF0YVwiLCBcImRlZmF1bHQuanNvblwiKTtcblxuICAgIGNvbnN0IHJlY29yZE1hcCA9IGluaXQuZ2V0UmVjb3JkcygpO1xuICAgIGNvbnN0IHJlY29yZHMgPSBPYmplY3Qua2V5cyhyZWNvcmRNYXApXG4gICAgICAgIC5tYXAoKGlkKSA9PiByZWNvcmRNYXBbaWRdKTtcblxuICAgIGJhdGNoLnNldFJlc3VsdHMoW2ZzLmNyZWF0ZVJlYWRTdHJlYW0oZGF0YUZpbGUpXSwgKGVycikgPT4ge1xuICAgICAgICB0LmVycm9yKGVycik7XG4gICAgICAgIGJhdGNoLnByb2Nlc3NSZWNvcmRzKCgpID0+IHtcbiAgICAgICAgICAgIGJhdGNoLnVwZGF0ZVNpbWlsYXJpdHkoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlY29yZHMuZm9yRWFjaCgocmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHQuZXF1YWwocmVjb3JkLm5lZWRzU2ltaWxhclVwZGF0ZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0LmVuZCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG5cbnRhcC50ZXN0KFwiZ2V0RmlsdGVyZWRSZXN1bHRzXCIsIHthdXRvZW5kOiB0cnVlfSwgKHQpID0+IHtcbiAgICBjb25zdCByZXN1bHRzID0gaW5pdC5nZXRSZWNvcmRCYXRjaCgpLmdldEZpbHRlcmVkUmVzdWx0cygpO1xuICAgIHQuc2FtZShyZXN1bHRzLCB7XG4gICAgICAgIFwidW5wcm9jZXNzZWRcIjogW10sXG4gICAgICAgIFwiY3JlYXRlZFwiOiBbXSxcbiAgICAgICAgXCJjaGFuZ2VkXCI6IFtdLFxuICAgICAgICBcImRlbGV0ZWRcIjogW10sXG4gICAgICAgIFwiZXJyb3JzXCI6IFtdLFxuICAgICAgICBcIndhcm5pbmdzXCI6IFtdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYmF0Y2ggPSBuZXcgUmVjb3JkSW1wb3J0KHtcbiAgICAgICAgX2lkOiBcInRlc3Qvc3RhcnRlZFwiLFxuICAgICAgICBmaWxlTmFtZTogXCJkYXRhLmpzb25cIixcbiAgICAgICAgc291cmNlOiBcInRlc3RcIixcbiAgICAgICAgc3RhdGU6IFwicHJvY2Vzcy5jb21wbGV0ZWRcIixcbiAgICAgICAgcmVzdWx0czogW1xuICAgICAgICAgICAge21vZGVsOiBcInRlc3QvMTIzNFwiLCByZXN1bHQ6IFwidW5jaGFuZ2VkXCIsIHdhcm5pbmdzOiBbXX0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbW9kZWw6IFwidGVzdC8xMjM1XCIsXG4gICAgICAgICAgICAgICAgcmVzdWx0OiBcImNoYW5nZWRcIixcbiAgICAgICAgICAgICAgICB3YXJuaW5nczogW10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge21vZGVsOiBcInRlc3QvOTIzNFwiLCByZXN1bHQ6IFwiY3JlYXRlZFwiLCB3YXJuaW5nczogW119LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG1vZGVsOiBcInRlc3QvMjIzNFwiLFxuICAgICAgICAgICAgICAgIHJlc3VsdDogXCJjcmVhdGVkXCIsXG4gICAgICAgICAgICAgICAgd2FybmluZ3M6IFtcIlJlY29tbWVuZGVkIGZpZWxkIGBvYmplY3RUeXBlYCBpcyBlbXB0eS5cIl0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJlc3VsdDogXCJlcnJvclwiLFxuICAgICAgICAgICAgICAgIGVycm9yOiBcIlJlcXVpcmVkIGZpZWxkIGBpbWFnZXNgIGlzIGVtcHR5LlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXN1bHQ6IFwiZXJyb3JcIixcbiAgICAgICAgICAgICAgICBlcnJvcjogXCJSZXF1aXJlZCBmaWVsZCBgaWRgIGlzIGVtcHR5LlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHttb2RlbDogXCJ0ZXN0LzEyMzZcIiwgcmVzdWx0OiBcImRlbGV0ZWRcIn0sXG4gICAgICAgICAgICB7bW9kZWw6IFwidGVzdC8xMjM3XCIsIHJlc3VsdDogXCJkZWxldGVkXCJ9LFxuICAgICAgICBdLFxuICAgIH0pO1xuXG4gICAgdC5zYW1lKGJhdGNoLmdldEZpbHRlcmVkUmVzdWx0cygpLCB7XG4gICAgICAgIFwidW5wcm9jZXNzZWRcIjogW10sXG4gICAgICAgIFwiY2hhbmdlZFwiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJtb2RlbFwiOiBcInRlc3QvMTIzNVwiLFxuICAgICAgICAgICAgICAgIFwicmVzdWx0XCI6IFwiY2hhbmdlZFwiLFxuICAgICAgICAgICAgICAgIFwid2FybmluZ3NcIjogW10sXG4gICAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBcImNyZWF0ZWRcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwibW9kZWxcIjogXCJ0ZXN0LzkyMzRcIixcbiAgICAgICAgICAgICAgICBcInJlc3VsdFwiOiBcImNyZWF0ZWRcIixcbiAgICAgICAgICAgICAgICBcIndhcm5pbmdzXCI6IFtdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm1vZGVsXCI6IFwidGVzdC8yMjM0XCIsXG4gICAgICAgICAgICAgICAgXCJyZXN1bHRcIjogXCJjcmVhdGVkXCIsXG4gICAgICAgICAgICAgICAgXCJ3YXJuaW5nc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgIFwiUmVjb21tZW5kZWQgZmllbGQgYG9iamVjdFR5cGVgIGlzIGVtcHR5LlwiLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBcImRlbGV0ZWRcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwibW9kZWxcIjogXCJ0ZXN0LzEyMzZcIixcbiAgICAgICAgICAgICAgICBcInJlc3VsdFwiOiBcImRlbGV0ZWRcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJtb2RlbFwiOiBcInRlc3QvMTIzN1wiLFxuICAgICAgICAgICAgICAgIFwicmVzdWx0XCI6IFwiZGVsZXRlZFwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgXCJlcnJvcnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJSZXF1aXJlZCBmaWVsZCBgaW1hZ2VzYCBpcyBlbXB0eS5cIixcbiAgICAgICAgICAgICAgICBcInJlc3VsdFwiOiBcImVycm9yXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJSZXF1aXJlZCBmaWVsZCBgaWRgIGlzIGVtcHR5LlwiLFxuICAgICAgICAgICAgICAgIFwicmVzdWx0XCI6IFwiZXJyb3JcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFwid2FybmluZ3NcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwibW9kZWxcIjogXCJ0ZXN0LzIyMzRcIixcbiAgICAgICAgICAgICAgICBcInJlc3VsdFwiOiBcImNyZWF0ZWRcIixcbiAgICAgICAgICAgICAgICBcIndhcm5pbmdzXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgXCJSZWNvbW1lbmRlZCBmaWVsZCBgb2JqZWN0VHlwZWAgaXMgZW1wdHkuXCIsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgfSk7XG59KTtcblxudGFwLnRlc3QoXCJSZWNvcmRJbXBvcnQuYWR2YW5jZVwiLCAodCkgPT4ge1xuICAgIGNvbnN0IGNoZWNrU3RhdGVzID0gKGJhdGNoZXMsIHN0YXRlcykgPT4ge1xuICAgICAgICB0LmVxdWFsKGJhdGNoZXMubGVuZ3RoLCBzdGF0ZXMubGVuZ3RoKTtcbiAgICAgICAgZm9yIChjb25zdCBiYXRjaCBvZiBiYXRjaGVzKSB7XG4gICAgICAgICAgICB0LmVxdWFsKGJhdGNoLnN0YXRlLCBzdGF0ZXMuc2hpZnQoKSk7XG4gICAgICAgICAgICB0Lm9rKGJhdGNoLmdldEN1clN0YXRlKCkubmFtZShyZXEpKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBiYXRjaCA9IGluaXQuZ2V0UmVjb3JkQmF0Y2goKTtcbiAgICBjb25zdCBkYXRhRmlsZSA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBcInRlc3REYXRhXCIsIFwiZGVmYXVsdC5qc29uXCIpO1xuXG4gICAgY29uc3QgZ2V0QmF0Y2hlcyA9IChjYWxsYmFjaykgPT4ge1xuICAgICAgICBSZWNvcmRJbXBvcnQuZmluZCh7fSwgXCJcIiwge30sIChlcnIsIGJhdGNoZXMpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGJhdGNoZXMuZmlsdGVyKChiYXRjaCkgPT4gKGJhdGNoLnN0YXRlICE9PSBcImVycm9yXCIgJiZcbiAgICAgICAgICAgICAgICBiYXRjaC5zdGF0ZSAhPT0gXCJjb21wbGV0ZWRcIikpKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGJhdGNoLnNldFJlc3VsdHMoW2ZzLmNyZWF0ZVJlYWRTdHJlYW0oZGF0YUZpbGUpXSwgKGVycikgPT4ge1xuICAgICAgICB0LmVycm9yKGVyciwgXCJFcnJvciBzaG91bGQgYmUgZW1wdHkuXCIpO1xuICAgICAgICB0LmVxdWFsKGJhdGNoLnJlc3VsdHMubGVuZ3RoLCA2LCBcIkNoZWNrIG51bWJlciBvZiByZXN1bHRzXCIpO1xuICAgICAgICBmb3IgKGNvbnN0IHJlc3VsdCBvZiBiYXRjaC5yZXN1bHRzKSB7XG4gICAgICAgICAgICB0LmVxdWFsKHJlc3VsdC5yZXN1bHQsIFwidW5rbm93blwiKTtcbiAgICAgICAgICAgIHQub2socmVzdWx0LmRhdGEpO1xuICAgICAgICAgICAgdC5lcXVhbChyZXN1bHQuZGF0YS5sYW5nLCBcImVuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0QmF0Y2hlcygoZXJyLCBiYXRjaGVzKSA9PiB7XG4gICAgICAgICAgICBjaGVja1N0YXRlcyhiYXRjaGVzLCBbXCJzdGFydGVkXCJdKTtcblxuICAgICAgICAgICAgUmVjb3JkSW1wb3J0LmFkdmFuY2UoKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHQuZXJyb3IoZXJyLCBcIkVycm9yIHNob3VsZCBiZSBlbXB0eS5cIik7XG5cbiAgICAgICAgICAgICAgICBnZXRCYXRjaGVzKChlcnIsIGJhdGNoZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tTdGF0ZXMoYmF0Y2hlcywgW1wicHJvY2Vzcy5jb21wbGV0ZWRcIl0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIE5lZWQgdG8gbWFudWFsbHkgbW92ZSB0byB0aGUgbmV4dCBzdGVwXG4gICAgICAgICAgICAgICAgICAgIGJhdGNoLmltcG9ydFJlY29yZHMoKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdC5lcnJvcihlcnIsIFwiRXJyb3Igc2hvdWxkIGJlIGVtcHR5LlwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0QmF0Y2hlcygoZXJyLCBiYXRjaGVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tTdGF0ZXMoYmF0Y2hlcywgW1wiaW1wb3J0LmNvbXBsZXRlZFwiXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWNvcmRJbXBvcnQuYWR2YW5jZSgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQuZXJyb3IoZXJyLCBcIkVycm9yIHNob3VsZCBiZSBlbXB0eS5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0QmF0Y2hlcygoZXJyLCBiYXRjaGVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja1N0YXRlcyhiYXRjaGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcInNpbWlsYXJpdHkuc3luYy5jb21wbGV0ZWRcIl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWNvcmRJbXBvcnQuYWR2YW5jZSgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5lcnJvcihlcnIsIFwiRXJyb3Igc2hvdWxkIGJlIGVtcHR5LlwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQub2soYmF0Y2guZ2V0Q3VyU3RhdGUoKS5uYW1lKHJlcSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0QmF0Y2hlcygoZXJyLCBiYXRjaGVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrU3RhdGVzKGJhdGNoZXMsIFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdC5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0Lm9rKGJhdGNoLmdldEN1clN0YXRlKCkubmFtZShyZXEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0Lm9rKGJhdGNoLmdldEN1clN0YXRlKCkubmFtZShyZXEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB0Lm9rKGJhdGNoLmdldEN1clN0YXRlKCkubmFtZShyZXEpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0Lm9rKGJhdGNoLmdldEN1clN0YXRlKCkubmFtZShyZXEpKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdfQ==