const path = require("path");

const tap = require("tap");

const init = require("../init");
const {i18n, ImageImport} = init;

tap.test("getURL", {autoend: true}, t => {
    const batch = init.getBatch();
    t.equal(
        batch.getURL(i18n.lang),
        "/artworks/source/test/admin?images=test/started",
        "Get URL",
    );
});

tap.test("getSource", {autoend: true}, t => {
    const batch = init.getBatch();
    const source = init.getSource();
    t.equal(batch.getSource(), source, "Get Source");
});

tap.test("getCurState", {autoend: true}, t => {
    const batch = init.getBatch();
    const state = batch.getCurState();
    t.equal(state.id, "started", "Get State ID");
    t.equal(state.name(i18n), "Awaiting processing...", "Get State Name");
});

tap.test("getNextState", {autoend: true}, t => {
    const batch = init.getBatch();
    const state = batch.getNextState();
    t.equal(state.id, "process.started", "Get State ID");
    t.equal(state.name(i18n), "Processing...", "Get State Name");
});

tap.test("canAdvance", {autoend: true}, t => {
    const batch = init.getBatch();
    t.equal(batch.canAdvance(), true, "Check if state can advance");
});

tap.test("saveState", t => {
    const batch = init.getBatch();
    batch.saveState("process.started", () => {
        const state = batch.getCurState();
        t.equal(state.id, "process.started", "Get State ID");
        t.equal(state.name(i18n), "Processing...", "Get State Name");
        t.end();
    });
});

tap.test("getError", {autoend: true}, t => {
    const batch = init.getBatch();
    const errors = [
        "ERROR_READING_ZIP",
        "ZIP_FILE_EMPTY",
        "MALFORMED_IMAGE",
        "EMPTY_IMAGE",
        "NEW_VERSION",
        "TOO_SMALL",
        "ERROR_SAVING",
    ];
    for (const error of errors) {
        batch.error = error;
        t.ok(ImageImport.getError(i18n, batch.error), error);
        t.notEqual(ImageImport.getError(i18n, batch.error), error, error);
    }
});

tap.test("getFilteredResults", {autoend: true}, t => {
    const results = init.getBatches().map(batch => batch.getFilteredResults());
    t.same(results[0], {
        errors: [],
        models: [],
        warnings: [],
    });
    t.same(results[2], {
        errors: [
            {
                _id: "corrupted.jpg",
                error: "MALFORMED_IMAGE",
                fileName: "corrupted.jpg",
            },
            {
                _id: "empty.jpg",
                error: "EMPTY_IMAGE",
                fileName: "empty.jpg",
            },
        ],
        models: [
            {
                _id: "bar.jpg",
                fileName: "bar.jpg",
                model: "test/bar.jpg",
                warnings: [],
            },
            {
                _id: "foo.jpg",
                fileName: "foo.jpg",
                model: "test/foo.jpg",
                warnings: [],
            },
            {
                _id: "new1.jpg",
                fileName: "new1.jpg",
                model: "test/new1.jpg",
                warnings: [],
            },
            {
                _id: "new2.jpg",
                fileName: "new2.jpg",
                model: "test/new2.jpg",
                warnings: [],
            },
            {
                _id: "small.jpg",
                fileName: "small.jpg",
                model: "test/small.jpg",
                warnings: ["NEW_VERSION", "TOO_SMALL"],
            },
            {
                _id: "new3.jpg",
                fileName: "new3.jpg",
                model: "test/new3.jpg",
                warnings: [],
            },
            {
                _id: "nosimilar.jpg",
                fileName: "nosimilar.jpg",
                model: "test/nosimilar.jpg",
                warnings: ["NEW_VERSION"],
            },
        ],
        warnings: [
            {
                _id: "small.jpg",
                fileName: "small.jpg",
                model: "test/small.jpg",
                warnings: ["NEW_VERSION", "TOO_SMALL"],
            },
            {
                _id: "nosimilar.jpg",
                fileName: "nosimilar.jpg",
                model: "test/nosimilar.jpg",
                warnings: ["NEW_VERSION"],
            },
        ],
    });
    t.same(results[5], {
        errors: [],
        models: [],
        warnings: [],
    });
});

tap.test("validate", t => {
    const testZip = path.resolve(process.cwd(), "testData", "corrupted.zip");

    const batch = new ImageImport({
        _id: "test/corrupted",
        source: "test",
        zipFile: testZip,
        fileName: "corrupted.zip",
    });

    batch.validate(err => {
        t.error(err, "Error should be empty.");
        t.equal(batch._id, "test/corrupted", "ID should match");
        t.end();
    });
});

tap.test("validate", t => {
    const testZip = path.resolve(process.cwd(), "testData", "corrupted.zip");

    const batch = new ImageImport({
        source: "test",
        zipFile: testZip,
        fileName: "corrupted.zip",
    });

    batch.validate(err => {
        t.error(err, "Error should be empty.");
        t.ok(batch._id, "Should have an ID.");
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
