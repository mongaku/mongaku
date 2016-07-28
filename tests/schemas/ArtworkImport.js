"use strict";

const fs = require("fs");
const path = require("path");

const tap = require("tap");

const init = require("../init");
const req = init.req;
const ArtworkImport = init.ArtworkImport;

tap.test("getURL", {autoend: true}, (t) => {
    const batch = init.getArtworkBatch();
    t.equal(batch.getURL(req.lang),
        "/source/test/admin?artworks=test/started",
        "Get URL");
});

tap.test("getSource", {autoend: true}, (t) => {
    const batch = init.getArtworkBatch();
    const source = init.getSource();
    t.equal(batch.getSource(), source, "Get Source");
});

tap.test("getCurState", {autoend: true}, (t) => {
    const batch = init.getArtworkBatch();
    const state = batch.getCurState();
    t.equal(state.id, "started", "Get State ID");
    t.equal(state.name(req), "Awaiting processing...", "Get State Name");

    batch.state = "similarity.sync.started";

    const otherState = batch.getCurState();
    t.equal(otherState.id, "similarity.sync.started", "Get State ID");
    t.equal(otherState.name(req), "Syncing similarity...", "Get State Name");
});

tap.test("getNextState", {autoend: true}, (t) => {
    const batch = init.getArtworkBatch();
    const state = batch.getNextState();
    t.equal(state.id, "process.started", "Get State ID");
    t.equal(state.name(req), "Processing...", "Get State Name");
});

tap.test("canAdvance", {autoend: true}, (t) => {
    const batch = init.getArtworkBatch();
    t.equal(batch.canAdvance(), true, "Check if state can advance");
});

tap.test("getError", {autoend: true}, (t) => {
    const batch = init.getArtworkBatch();
    const errors = ["ABANDONED", "ERROR_READING_DATA", "ERROR_SAVING",
        "ERROR_DELETING"];
    for (const error of errors) {
        batch.error = error;
        t.ok(ArtworkImport.getError(req, batch.error), error);
        t.notEqual(ArtworkImport.getError(req, batch.error), error, error);
    }
});

tap.test("saveState", (t) => {
    const batch = init.getArtworkBatch();
    batch.saveState("process.started", () => {
        const state = batch.getCurState();
        t.equal(state.id, "process.started", "Get State ID");
        t.equal(state.name(req), "Processing...", "Get State Name");
        t.end();
    });
});

tap.test("abandon", (t) => {
    const batch = init.getArtworkBatch();
    batch.abandon(() => {
        t.equal(batch.state, "error", "Get State ID");
        t.equal(batch.error, "ABANDONED", "Get Error Message");
        t.end();
    });
});

tap.test("setResults", (t) => {
    const batch = init.getArtworkBatch();
    const dataFile = path.resolve(process.cwd(), "testData", "default.json");
    batch.setResults([fs.createReadStream(dataFile)], (err) => {
        t.error(err, "Error should be empty.");
        t.equal(batch.results.length, 6, "Check number of results");
        for (const result of batch.results) {
            t.equal(result.result, "unknown");
            t.ok(result.data);
            t.equal(result.data.lang, "en");
        }
        t.end();
    });
});

tap.test("setResults (with error)", (t) => {
    const error = [
        "Parse error on line 2:",
        "[    {        id: \"1234\",        ",
        "--------------^",
        "Expecting 'STRING', '}', got 'undefined'",
    ].join("\n");

    const batch = init.getArtworkBatch();
    const dataFile = path.resolve(process.cwd(), "testData",
        "default-error.json");
    batch.setResults([fs.createReadStream(dataFile)], (err) => {
        t.error(err, "Error should be empty.");
        t.equal(batch.error, error);
        t.equal(batch.getError(req), error);
        t.equal(batch.state, "error");
        t.equal(batch.results.length, 0, "Check number of results");
        t.end();
    });
});

tap.test("processArtworks", (t) => {
    const batch = init.getArtworkBatch();
    const dataFile = path.resolve(process.cwd(), "testData", "default.json");
    const expected = [
        {model: "test/1234", result: "unchanged", warnings: []},
        {
            model: "test/1235",
            result: "changed",
            warnings: [],
            diff: {
                "url": [
                    "http://google.com",
                    "http://yahoo.com",
                ],
                "locations": {
                    "0": [{"city": "New York City 2"}],
                    "_t": "a",
                    "_0": [{"city": "New York City"}, 0, 0],
                },
                "dates": {
                    "0": [{"circa": true, "start": 1455, "end": 1457}],
                    "_t": "a",
                    "_0": [{"start": 1456, "end": 1457, "circa": true}, 0, 0],
                },
                "dimensions": {
                    "0": [{"width": 123, "height": 140, "unit": "mm"}],
                    "_t": "a",
                    "_0": [{"width": 123, "height": 130, "unit": "mm"}, 0, 0],
                },
                "artists": {
                    "0": {
                        "dates": {
                            "0": [{"circa": true, "start": 1456, "end": 1458}],
                            "_t": "a",
                            "_0": [
                                {"start": 1456, "end": 1457, "circa": true},
                                0,
                                0,
                            ],
                        },
                    },
                    "_t": "a",
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
    batch.setResults([fs.createReadStream(dataFile)], (err) => {
        t.error(err);
        batch.processArtworks(() => {
            t.equal(batch.results.length, expected.length,
                "Check number of results");
            expected.forEach((expected, i) => {
                const result = batch.results[i];
                t.equal(result.state, "process.completed");
                for (const prop in expected) {
                    t.same(result[prop], expected[prop]);
                }
            });
            t.end();
        });
    });
});

tap.test("importArtworks", (t) => {
    const batch = init.getArtworkBatch();
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
    batch.setResults([fs.createReadStream(dataFile)], (err) => {
        t.error(err);
        batch.processArtworks(() => {
            batch.importArtworks(() => {
                t.equal(batch.results.length, expected.length,
                    "Check number of results");
                expected.forEach((expected, i) => {
                    const result = batch.results[i];
                    t.equal(result.state, "import.completed");
                    for (const prop in expected) {
                        t.same(result[prop], expected[prop]);
                    }
                });
                t.end();
            });
        });
    });
});

tap.test("updateSimilarity (empty results)", (t) => {
    const batch = init.getArtworkBatch();

    const artworkMap = init.getArtworks();
    const artworks = Object.keys(artworkMap)
        .map((id) => artworkMap[id]);

    batch.updateSimilarity(() => {
        artworks.forEach((artwork) => {
            t.equal(artwork.needsSimilarUpdate, false);
        });

        t.end();
    });
});

tap.test("updateSimilarity", (t) => {
    const batch = init.getArtworkBatch();
    const dataFile = path.resolve(process.cwd(), "testData", "default.json");

    const artworkMap = init.getArtworks();
    const artworks = Object.keys(artworkMap)
        .map((id) => artworkMap[id]);

    batch.setResults([fs.createReadStream(dataFile)], (err) => {
        t.error(err);
        batch.processArtworks(() => {
            batch.updateSimilarity(() => {
                artworks.forEach((artwork) => {
                    t.equal(artwork.needsSimilarUpdate, true);
                });

                t.end();
            });
        });
    });
});

tap.test("getFilteredResults", {autoend: true}, (t) => {
    const results = init.getArtworkBatch().getFilteredResults();
    t.same(results, {
        "unprocessed": [],
        "created": [],
        "changed": [],
        "deleted": [],
        "errors": [],
        "warnings": [],
    });

    const batch = new ArtworkImport({
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
        "unprocessed": [],
        "changed": [
            {
                "model": "test/1235",
                "result": "changed",
                "warnings": [],
            },
        ],
        "created": [
            {
                "model": "test/9234",
                "result": "created",
                "warnings": [],
            },
            {
                "model": "test/2234",
                "result": "created",
                "warnings": [
                    "Recommended field `objectType` is empty.",
                ],
            },
        ],
        "deleted": [
            {
                "model": "test/1236",
                "result": "deleted",
            },
            {
                "model": "test/1237",
                "result": "deleted",
            },
        ],
        "errors": [
            {
                "error": "Required field `images` is empty.",
                "result": "error",
            },
            {
                "error": "Required field `id` is empty.",
                "result": "error",
            },
        ],
        "warnings": [
            {
                "model": "test/2234",
                "result": "created",
                "warnings": [
                    "Recommended field `objectType` is empty.",
                ],
            },
        ],
    });
});

tap.test("ArtworkImport.advance", (t) => {
    const checkStates = (batches, states) => {
        t.equal(batches.length, states.length);
        for (const batch of batches) {
            t.equal(batch.state, states.shift());
            t.ok(batch.getCurState().name(req));
        }
    };

    const batch = init.getArtworkBatch();
    const dataFile = path.resolve(process.cwd(), "testData", "default.json");

    const getBatches = (callback) => {
        ArtworkImport.find({}, "", {}, (err, batches) => {
            callback(null, batches.filter((batch) => (batch.state !== "error" &&
                batch.state !== "completed")));
        });
    };

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

            ArtworkImport.advance((err) => {
                t.error(err, "Error should be empty.");

                getBatches((err, batches) => {
                    checkStates(batches, ["process.completed"]);

                    // Need to manually move to the next step
                    batch.importArtworks((err) => {
                        t.error(err, "Error should be empty.");

                        getBatches((err, batches) => {
                            checkStates(batches, ["import.completed"]);

                            ArtworkImport.advance((err) => {
                                t.error(err, "Error should be empty.");

                                getBatches((err, batches) => {
                                    checkStates(batches,
                                        ["similarity.sync.completed"]);

                                    ArtworkImport.advance((err) => {
                                        t.error(err, "Error should be empty.");

                                        t.ok(batch.getCurState().name(req));

                                        getBatches((err, batches) => {
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
