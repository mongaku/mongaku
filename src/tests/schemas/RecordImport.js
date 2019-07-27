const fs = require("fs");
const path = require("path");

const tap = require("tap");

const init = require("../init");
const {i18n, RecordImport, mockFS} = init;

tap.test("getURL", {autoend: true}, t => {
    const batch = init.getRecordBatch();
    t.equal(
        batch.getURL(i18n.lang),
        "/artworks/source/test/admin?records=test/started",
        "Get URL",
    );
});

tap.test("getSource", {autoend: true}, t => {
    const batch = init.getRecordBatch();
    const source = init.getSource();
    t.equal(batch.getSource(), source, "Get Source");
});

tap.test("getCurState", {autoend: true}, t => {
    const batch = init.getRecordBatch();
    const state = batch.getCurState();
    t.equal(state.id, "started", "Get State ID");
    t.equal(state.name(i18n), "Awaiting processing...", "Get State Name");

    batch.state = "similarity.sync.started";

    const otherState = batch.getCurState();
    t.equal(otherState.id, "similarity.sync.started", "Get State ID");
    t.equal(otherState.name(i18n), "Syncing similarity...", "Get State Name");
});

tap.test("getNextState", {autoend: true}, t => {
    const batch = init.getRecordBatch();
    const state = batch.getNextState();
    t.equal(state.id, "process.started", "Get State ID");
    t.equal(state.name(i18n), "Processing...", "Get State Name");
});

tap.test("canAdvance", {autoend: true}, t => {
    const batch = init.getRecordBatch();
    t.equal(batch.canAdvance(), true, "Check if state can advance");
});

tap.test("getError", {autoend: true}, t => {
    const batch = init.getRecordBatch();
    const errors = [
        "ABANDONED",
        "ERROR_READING_DATA",
        "ERROR_SAVING",
        "ERROR_DELETING",
    ];
    for (const error of errors) {
        batch.error = error;
        t.ok(RecordImport.getError(i18n, batch.error), error);
        t.notEqual(RecordImport.getError(i18n, batch.error), error, error);
    }
});

tap.test("saveState", t => {
    const batch = init.getRecordBatch();
    batch.saveState("process.started", () => {
        const state = batch.getCurState();
        t.equal(state.id, "process.started", "Get State ID");
        t.equal(state.name(i18n), "Processing...", "Get State Name");
        t.end();
    });
});

tap.test("abandon", t => {
    const batch = init.getRecordBatch();
    batch.abandon(() => {
        t.equal(batch.state, "error", "Get State ID");
        t.equal(batch.error, "ABANDONED", "Get Error Message");
        t.end();
    });
});

tap.test("setResults", t => {
    const batch = init.getRecordBatch();
    const dataFile = path.resolve(process.cwd(), "testData", "default.json");
    mockFS(callback => {
        batch.setResults([fs.createReadStream(dataFile)], err => {
            t.error(err, "Error should be empty.");
            t.equal(batch.results.length, 6, "Check number of results");
            for (const result of batch.results) {
                t.equal(result.result, "unknown");
                t.ok(result.data);
                t.equal(result.data.lang, "en");
            }
            t.end();
            callback();
        });
    });
});

tap.test("setResults (with error)", t => {
    const error = [
        "Parse error on line 2:",
        '[    {        id: "1234",        ',
        "--------------^",
        "Expecting 'STRING', '}', got 'undefined'",
    ].join("\n");

    const batch = init.getRecordBatch();
    const dataFile = path.resolve(
        process.cwd(),
        "testData",
        "default-error.json",
    );

    mockFS(callback => {
        batch.setResults([fs.createReadStream(dataFile)], err => {
            t.error(err, "Error should be empty.");
            t.equal(batch.error, error);
            t.equal(batch.getError(i18n), error);
            t.equal(batch.state, "error");
            t.equal(batch.results.length, 0, "Check number of results");
            t.end();
            callback();
        });
    });
});

tap.test("processRecords", t => {
    const batch = init.getRecordBatch();
    const dataFile = path.resolve(process.cwd(), "testData", "default.json");
    const expected = [
        {model: "test/1234", result: "unchanged", warnings: []},
        {
            model: "test/1235",
            result: "changed",
            warnings: [],
            diff: {
                url: ["http://google.com", "http://yahoo.com"],
                locations: {
                    "0": [{city: "New York City 2"}],
                    _t: "a",
                    _0: [{city: "New York City"}, 0, 0],
                },
                dates: {
                    "0": [
                        {
                            circa: true,
                            start: 1455,
                            end: 1457,
                            original: "ca. 1455-1457",
                        },
                    ],
                    _t: "a",
                    _0: [
                        {
                            start: 1456,
                            end: 1457,
                            circa: true,
                            original: "ca. 1456-1457",
                        },
                        0,
                        0,
                    ],
                },
                dimensions: {
                    "0": [{width: 123, height: 140, unit: "mm"}],
                    _t: "a",
                    _0: [{width: 123, height: 130, unit: "mm"}, 0, 0],
                },
                artists: {
                    "0": {
                        dates: {
                            "0": [
                                {
                                    circa: true,
                                    start: 1456,
                                    end: 1458,
                                    original: "ca. 1456-1458",
                                },
                            ],
                            _t: "a",
                            _0: [
                                {
                                    start: 1456,
                                    end: 1457,
                                    circa: true,
                                    original: "ca. 1456-1457",
                                },
                                0,
                                0,
                            ],
                        },
                    },
                    _t: "a",
                },
            },
        },
        {result: "created", warnings: []},
        {
            result: "created",
            warnings: ["Recommended field `objectType` is empty."],
        },
        {
            result: "error",
            error: "Required field `images` is empty.",
        },
        {
            result: "error",
            error: "Required field `id` is empty.",
        },
        {model: "test/1236", result: "deleted"},
        {model: "test/1237", result: "deleted"},
    ];

    mockFS(callback => {
        batch.setResults([fs.createReadStream(dataFile)], err => {
            t.error(err);
            batch.processRecords(() => {
                t.equal(
                    batch.results.length,
                    expected.length,
                    "Check number of results",
                );
                expected.forEach((expected, i) => {
                    const result = batch.results[i];
                    t.equal(result.state, "process.completed");
                    for (const prop in expected) {
                        t.same(result[prop], expected[prop]);
                    }
                });
                t.end();
                callback();
            });
        });
    });
});

tap.test("importRecords", t => {
    const batch = init.getRecordBatch();
    const dataFile = path.resolve(process.cwd(), "testData", "default.json");
    const expected = [
        {model: "test/1234", result: "unchanged", warnings: []},
        {
            model: "test/1235",
            result: "changed",
            warnings: [],
        },
        {model: "test/9234", result: "created", warnings: []},
        {
            model: "test/2234",
            result: "created",
            warnings: ["Recommended field `objectType` is empty."],
        },
        {
            result: "error",
            error: "Required field `images` is empty.",
        },
        {
            result: "error",
            error: "Required field `id` is empty.",
        },
        {model: "test/1236", result: "deleted"},
        {model: "test/1237", result: "deleted"},
    ];

    mockFS(callback => {
        batch.setResults([fs.createReadStream(dataFile)], err => {
            t.error(err);
            batch.processRecords(() => {
                batch.importRecords(() => {
                    t.equal(
                        batch.results.length,
                        expected.length,
                        "Check number of results",
                    );
                    expected.forEach((expected, i) => {
                        const result = batch.results[i];
                        t.equal(result.state, "import.completed");
                        for (const prop in expected) {
                            t.same(result[prop], expected[prop]);
                        }
                    });
                    t.end();
                    callback();
                });
            });
        });
    });
});

tap.test("updateSimilarity (empty results)", t => {
    const batch = init.getRecordBatch();

    const recordMap = init.getRecords();
    const records = Object.keys(recordMap).map(id => recordMap[id]);

    batch.updateSimilarity(() => {
        records.forEach(record => {
            t.equal(record.needsSimilarUpdate, false);
        });

        t.end();
    });
});

tap.test("updateSimilarity", t => {
    const batch = init.getRecordBatch();
    const dataFile = path.resolve(process.cwd(), "testData", "default.json");

    const recordMap = init.getRecords();
    const records = Object.keys(recordMap).map(id => recordMap[id]);

    mockFS(callback => {
        batch.setResults([fs.createReadStream(dataFile)], err => {
            t.error(err);
            batch.processRecords(() => {
                batch.updateSimilarity(() => {
                    records.forEach(record => {
                        t.equal(record.needsSimilarUpdate, true);
                    });

                    t.end();
                    callback();
                });
            });
        });
    });
});

tap.test("getFilteredResults", {autoend: true}, t => {
    const results = init.getRecordBatch().getFilteredResults();
    t.same(results, {
        unprocessed: [],
        created: [],
        changed: [],
        deleted: [],
        errors: [],
        warnings: [],
    });

    const batch = new RecordImport({
        _id: "test/started",
        fileName: "data.json",
        source: "test",
        state: "process.completed",
        results: [
            {model: "test/1234", result: "unchanged", warnings: []},
            {
                model: "test/1235",
                result: "changed",
                warnings: [],
            },
            {model: "test/9234", result: "created", warnings: []},
            {
                model: "test/2234",
                result: "created",
                warnings: ["Recommended field `objectType` is empty."],
            },
            {
                result: "error",
                error: "Required field `images` is empty.",
            },
            {
                result: "error",
                error: "Required field `id` is empty.",
            },
            {model: "test/1236", result: "deleted"},
            {model: "test/1237", result: "deleted"},
        ],
    });

    t.same(batch.getFilteredResults(), {
        unprocessed: [],
        changed: [
            {
                model: "test/1235",
                result: "changed",
                warnings: [],
            },
        ],
        created: [
            {
                model: "test/9234",
                result: "created",
                warnings: [],
            },
            {
                model: "test/2234",
                result: "created",
                warnings: ["Recommended field `objectType` is empty."],
            },
        ],
        deleted: [
            {
                model: "test/1236",
                result: "deleted",
            },
            {
                model: "test/1237",
                result: "deleted",
            },
        ],
        errors: [
            {
                error: "Required field `images` is empty.",
                result: "error",
            },
            {
                error: "Required field `id` is empty.",
                result: "error",
            },
        ],
        warnings: [
            {
                model: "test/2234",
                result: "created",
                warnings: ["Recommended field `objectType` is empty."],
            },
        ],
    });
});

// prettier-ignore
tap.test("RecordImport.advance", (t) => {
    const checkStates = (batches, states) => {
        t.equal(batches.length, states.length);
        for (const batch of batches) {
            t.equal(batch.state, states.shift());
            t.ok(batch.getCurState().name(i18n));
        }
    };

    const batch = init.getRecordBatch();
    const dataFile = path.resolve(process.cwd(), "testData", "default.json");

    const getBatches = (callback) => {
        RecordImport.find({}, "", {}, (err, batches) => {
            callback(null, batches.filter((batch) => (batch.state !== "error" &&
                batch.state !== "completed")));
        });
    };

    mockFS((callback) => {
        batch.setResults([fs.createReadStream(dataFile)], (err) => {
            t.error(err, "Error should be empty.");
            t.equal(batch.results.length, 6, "Check number of results");
            for (const result of batch.results) {
                t.equal(result.result, "unknown");
                t.ok(result.data);
                t.equal(result.data.lang, "en");
            }

            getBatches((err, batches) => {
                checkStates(batches, ["started"]);

                RecordImport.advance((err) => {
                    t.error(err, "Error should be empty.");

                    getBatches((err, batches) => {
                        checkStates(batches, ["process.completed"]);

                        // Need to manually move to the next step
                        batch.importRecords((err) => {
                            t.error(err, "Error should be empty.");

                            getBatches((err, batches) => {
                                checkStates(batches, ["import.completed"]);

                                RecordImport.advance((err) => {
                                    t.error(err, "Error should be empty.");

                                    getBatches((err, batches) => {
                                        checkStates(batches,
                                            ["similarity.sync.completed"]);

                                        RecordImport.advance((err) => {
                                            t.error(err,
                                                "Error should be empty.");

                                            t.ok(batch.getCurState()
                                                .name(i18n));

                                            getBatches((err, batches) => {
                                                checkStates(batches, []);
                                                t.end();
                                                callback();
                                            });
                                        });

                                        t.ok(batch.getCurState().name(i18n));
                                    });
                                });

                                t.ok(batch.getCurState().name(i18n));
                            });
                        });

                        t.ok(batch.getCurState().name(i18n));
                    });
                });

                t.ok(batch.getCurState().name(i18n));
            });
        });
    });
});
