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