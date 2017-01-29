"use strict";

var path = require("path");

var tap = require("tap");

var init = require("../init");
var stub = init.stub;
var req = init.req;
var ImageImport = init.ImageImport;

tap.test("getURL", { autoend: true }, function (t) {
    var batch = init.getBatch();
    t.equal(batch.getURL(req.lang), "/artworks/source/test/admin?images=test/started", "Get URL");
});

tap.test("getSource", { autoend: true }, function (t) {
    var batch = init.getBatch();
    var source = init.getSource();
    t.equal(batch.getSource(), source, "Get Source");
});

tap.test("getCurState", { autoend: true }, function (t) {
    var batch = init.getBatch();
    var state = batch.getCurState();
    t.equal(state.id, "started", "Get State ID");
    t.equal(state.name(req), "Awaiting processing...", "Get State Name");
});

tap.test("getNextState", { autoend: true }, function (t) {
    var batch = init.getBatch();
    var state = batch.getNextState();
    t.equal(state.id, "process.started", "Get State ID");
    t.equal(state.name(req), "Processing...", "Get State Name");
});

tap.test("canAdvance", { autoend: true }, function (t) {
    var batch = init.getBatch();
    t.equal(batch.canAdvance(), true, "Check if state can advance");
});

tap.test("saveState", function (t) {
    var batch = init.getBatch();
    batch.saveState("process.started", function () {
        var state = batch.getCurState();
        t.equal(state.id, "process.started", "Get State ID");
        t.equal(state.name(req), "Processing...", "Get State Name");
        t.end();
    });
});

tap.test("getError", { autoend: true }, function (t) {
    var batch = init.getBatch();
    var errors = ["ERROR_READING_ZIP", "ZIP_FILE_EMPTY", "MALFORMED_IMAGE", "EMPTY_IMAGE", "NEW_VERSION", "TOO_SMALL", "ERROR_SAVING"];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = errors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var error = _step.value;

            batch.error = error;
            t.ok(ImageImport.getError(req, batch.error), error);
            t.notEqual(ImageImport.getError(req, batch.error), error, error);
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

tap.test("getFilteredResults", { autoend: true }, function (t) {
    var results = init.getBatches().map(function (batch) {
        return batch.getFilteredResults();
    });
    t.same(results[0], {
        errors: [],
        models: [],
        warnings: []
    });
    t.same(results[2], {
        "errors": [{
            "_id": "corrupted.jpg",
            "error": "MALFORMED_IMAGE",
            "fileName": "corrupted.jpg"
        }, {
            "_id": "empty.jpg",
            "error": "EMPTY_IMAGE",
            "fileName": "empty.jpg"
        }],
        "models": [{
            "_id": "bar.jpg",
            "fileName": "bar.jpg",
            "model": "test/bar.jpg",
            "warnings": []
        }, {
            "_id": "foo.jpg",
            "fileName": "foo.jpg",
            "model": "test/foo.jpg",
            "warnings": []
        }, {
            "_id": "new1.jpg",
            "fileName": "new1.jpg",
            "model": "test/new1.jpg",
            "warnings": []
        }, {
            "_id": "new2.jpg",
            "fileName": "new2.jpg",
            "model": "test/new2.jpg",
            "warnings": []
        }, {
            "_id": "small.jpg",
            "fileName": "small.jpg",
            "model": "test/small.jpg",
            "warnings": ["NEW_VERSION", "TOO_SMALL"]
        }, {
            "_id": "new3.jpg",
            "fileName": "new3.jpg",
            "model": "test/new3.jpg",
            "warnings": []
        }, {
            "_id": "nosimilar.jpg",
            "fileName": "nosimilar.jpg",
            "model": "test/nosimilar.jpg",
            "warnings": ["NEW_VERSION"]
        }],
        "warnings": [{
            "_id": "small.jpg",
            "fileName": "small.jpg",
            "model": "test/small.jpg",
            "warnings": ["NEW_VERSION", "TOO_SMALL"]
        }, {
            "_id": "nosimilar.jpg",
            "fileName": "nosimilar.jpg",
            "model": "test/nosimilar.jpg",
            "warnings": ["NEW_VERSION"]
        }]
    });
    t.same(results[5], {
        errors: [],
        models: [],
        warnings: []
    });
});

tap.test("validate", function (t) {
    var testZip = path.resolve(process.cwd(), "testData", "corrupted.zip");

    var batch = new ImageImport({
        _id: "test/corrupted",
        source: "test",
        zipFile: testZip,
        fileName: "corrupted.zip"
    });

    batch.validate(function (err) {
        t.error(err, "Error should be empty.");
        t.equal(batch._id, "test/corrupted", "ID should match");
        t.end();
    });
});

tap.test("validate", function (t) {
    var testZip = path.resolve(process.cwd(), "testData", "corrupted.zip");

    var batch = new ImageImport({
        source: "test",
        zipFile: testZip,
        fileName: "corrupted.zip"
    });

    batch.validate(function (err) {
        t.error(err, "Error should be empty.");
        t.ok(batch._id, "Should have an ID.");
        t.end();
    });
});

tap.test("processImages", function (t) {
    var batch = init.getBatch();
    batch.processImages(function (err) {
        t.error(err, "Error should be empty.");

        var expected = init.getImageResultsData();

        t.equal(batch.results.length, expected.length);
        expected.forEach(function (item, i) {
            t.same(batch.results[i], item);
        });

        t.end();
    });
});

tap.test("processImages (Corrupted File)", function (t) {
    var testZip = path.resolve(process.cwd(), "testData", "corrupted.zip");

    var batch = new ImageImport({
        _id: "test/started",
        source: "test",
        zipFile: testZip,
        fileName: "corrupted.zip"
    });

    batch.processImages(function (err) {
        t.ok(err, "Expecting an error");
        t.equal(err.message, "ERROR_READING_ZIP");
        t.end();
    });
});

tap.test("processImages (Empty File)", function (t) {
    var testZip = path.resolve(process.cwd(), "testData", "empty.zip");

    var batch = new ImageImport({
        _id: "test/started",
        source: "test",
        zipFile: testZip,
        fileName: "empty.zip"
    });

    batch.processImages(function (err) {
        t.ok(err, "Expecting an error");
        t.equal(err.message, "ZIP_FILE_EMPTY");
        t.end();
    });
});

tap.test("processImages (advance, started)", function (t) {
    var batch = init.getBatch();
    t.equal(batch.getCurState().name(req), "Awaiting processing...");
    batch.advance(function (err) {
        t.error(err, "Error should be empty.");

        var expected = init.getImageResultsData();

        t.equal(batch.results.length, expected.length);
        expected.forEach(function (item, i) {
            t.same(batch.results[i], item);
        });

        t.equal(batch.state, "process.completed");

        t.end();
    });
});

tap.test("processImages (advance, process.started)", function (t) {
    var batch = init.getBatches()[1];
    t.equal(batch.getCurState().name(req), "Processing...");
    batch.advance(function (err) {
        t.error(err, "Error should be empty.");
        t.equal(batch.results.length, 0);
        t.equal(batch.state, "process.started");
        t.end();
    });
});

tap.test("processImages (advance, process.completed)", function (t) {
    var batch = init.getBatches()[2];
    t.equal(batch.getCurState().name(req), "Completed.");
    batch.advance(function (err) {
        t.error(err, "Error should be empty.");

        var expected = init.getImageResultsData();

        t.equal(batch.results.length, expected.length);
        expected.forEach(function (item, i) {
            t.same(batch.results[i], item);
        });

        t.equal(batch.state, "completed");

        t.end();
    });
});

tap.test("processImages (advance, completed)", function (t) {
    var batch = init.getBatches()[4];
    t.equal(batch.getCurState().name(req), "Completed.");
    batch.advance(function (err) {
        t.error(err, "Error should be empty.");

        var expected = init.getImageResultsData();

        t.equal(batch.results.length, expected.length);
        expected.forEach(function (item, i) {
            t.same(batch.results[i], item);
        });

        t.equal(batch.state, "completed");

        t.end();
    });
});

tap.test("processImages (advance, error)", function (t) {
    var batch = init.getBatches()[5];
    t.notOk(batch.getCurState());
    batch.advance(function (err) {
        t.error(err, "Error should be empty.");
        t.equal(batch.results.length, 0);
        t.equal(batch.state, "error");
        t.end();
    });
});

tap.test("processImages (advance, Corrupted File)", function (t) {
    var testZip = path.resolve(process.cwd(), "testData", "corrupted.zip");

    var batch = new ImageImport({
        _id: "test/started",
        source: "test",
        zipFile: testZip,
        fileName: "corrupted.zip"
    });

    stub(batch, "save", process.nextTick);

    batch.advance(function (err) {
        t.error(err, "Error should be empty.");
        t.equal(batch.error, "ERROR_READING_ZIP");
        t.equal(batch.results.length, 0);
        t.equal(batch.state, "error");
        t.end();
    });
});

// NOTE(jeresig): Disabled as they intermittently fail on Travis CI
/*
// NOTE(jeresig): Increase the timeout as this test can take a while to run
tap.test("ImageImport.advance", {timeout: 20000}, (t) => {
    const checkStates = (batches, states) => {
        t.equal(batches.length, states.length);
        for (const batch of batches) {
            t.equal(batch.state, states.shift());
        }
    };

    const getBatches = (callback) => {
        ImageImport.find({}, "", {}, (err, batches) => {
            callback(null, batches.filter((batch) => (batch.state !== "error" &&
                batch.state !== "completed")));
        });
    };

    getBatches((err, batches) => {
        checkStates(batches,
            ["started", "process.started", "process.completed",
                "process.completed"]);

        ImageImport.advance((err) => {
            t.error(err, "Error should be empty.");

            getBatches((err, batches) => {
                checkStates(batches, ["process.completed", "process.started"]);

                ImageImport.advance((err) => {
                    t.error(err, "Error should be empty.");

                    getBatches((err, batches) => {
                        checkStates(batches, ["process.started"]);

                        // Force all batches to be completed
                        init.getBatches()[1].state = "completed";

                        ImageImport.advance((err) => {
                            t.error(err, "Error should be empty.");

                            getBatches((err, batches) => {
                                checkStates(batches, []);
                                t.end();
                            });
                        });
                    });
                });
            });
        });
    });
});
*/