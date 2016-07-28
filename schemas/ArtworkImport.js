"use strict";

const async = require("async");

const models = require("../lib/models");
const urls = require("../lib/urls");
const config = require("../lib/config");

const Import = require("./Import");

const states = [
    {
        id: "started",
        name: (req) => req.gettext("Awaiting processing..."),
        advance(batch, callback) {
            batch.processArtworks(callback);
        },
    },
    {
        id: "process.started",
        name: (req) => req.gettext("Processing..."),
    },
    {
        id: "process.completed",
        name: (req) => req.gettext("Confirmation required."),
        // NOTE(jeresig): Do not auto-advance to importing the data
        // we want the user to make the call on the results.
        // batch.importArtworks(callback);
    },
    {
        id: "import.started",
        name: (req) => req.gettext("Importing data..."),
    },
    {
        id: "import.completed",
        name: (req) => req.gettext("Awaiting similarity sync..."),
        advance(batch, callback) {
            batch.updateSimilarity(callback);
        },
    },
    {
        id: "similarity.sync.started",
        name: (req) => req.gettext("Syncing similarity..."),
    },
    {
        id: "similarity.sync.completed",
        name: (req) => req.gettext("Completed."),
        advance(batch, callback) {
            // NOTE(jeresig): Currently nothing needs to be done to finish
            // up the import, other than moving it to the "completed" state.
            process.nextTick(callback);
        },
    },
    {
        id: "completed",
        name: (req) => req.gettext("Completed."),
    },
];

const errors = {
    ABANDONED: (req) => req.gettext("Data import abandoned."),
    ERROR_READING_DATA: (req) => req.gettext("Error reading data from " +
        "provided data files."),
    ERROR_SAVING: (req) => req.gettext("Error saving record."),
    ERROR_DELETING: (req) => req.gettext("Error deleting existing record."),
};

// TODO(jeresig): Remove this.
const req = {
    format: (msg, fields) =>
        msg.replace(/%\((.*?)\)s/g, (all, name) => fields[name]),
    gettext: (msg) => msg,
    lang: "en",
};

const ArtworkImport = Import.extend({
    // The name of the original file (e.g. `foo.json`)
    fileName: {
        type: String,
        required: true,
    },
});

Object.assign(ArtworkImport.methods, {
    getURL(lang) {
        return urls.gen(lang,
            `/source/${this.source}/admin?artworks=${this._id}`);
    },

    getError(req) {
        return models("ArtworkImport").getError(req, this.error);
    },

    getStates() {
        return states;
    },

    setResults(inputStreams, callback) {
        const source = this.getSource();

        source.processFiles(inputStreams, (err, results) => {
            if (err) {
                this.error = err.message;
                return this.saveState("error", callback);
            }

            this.results = results.map((data) => ({
                data,
                result: "unknown",
            }));

            callback();
        });
    },

    processArtworks(callback) {
        const Artwork = models("Artwork");
        const incomingIDs = {};

        async.eachLimit(this.results, 1, (result, callback) => {
            const data = Object.assign(result.data, {source: this.source});

            /* istanbul ignore if */
            if (config.NODE_ENV !== "test") {
                console.log("Processing Artwork:", data.id);
            }

            Artwork.fromData(data, req, (err, artwork, warnings, isNew) => {
                result.state = "process.completed";

                if (err) {
                    result.result = "error";
                    result.error = err.message;
                    return callback();
                }

                if (isNew) {
                    result.result = "created";

                } else {
                    result.diff = artwork.diff;
                    incomingIDs[artwork._id] = true;
                    result.model = artwork._id;
                    result.result = result.diff ? "changed" : "unchanged";
                }

                result.warnings = warnings;
                callback();
            });
        }, () => {
            /* istanbul ignore if */
            if (config.NODE_ENV !== "test") {
                console.log("Finding artworks to delete...");
            }

            // Find artworks that need to be deleted
            Artwork.find({source: this.source})
                .lean().distinct("_id")
                .exec((err, ids) => {
                    for (const id of ids) {
                        if (id in incomingIDs) {
                            continue;
                        }

                        this.results.push({
                            _id: id,
                            model: id,
                            result: "deleted",
                            state: "process.completed",
                            data: {},
                        });
                    }

                    callback();
                });
        });
    },

    manuallyApprove(callback) {
        this.saveState("import.started", (err) => {
            /* istanbul ignore if */
            if (err) {
                return callback(err);
            }

            // Delay the importing of the artworks to not block the UI
            process.nextTick(() => this.importArtworks(() => {
                // Ignore the result, user doesn't care.
            }));

            callback();
        });
    },

    importArtworks(callback) {
        const Artwork = models("Artwork");
        const Source = models("Source");

        async.eachLimit(this.results, 1, (result, callback) => {
            result.state = "import.started";

            /* istanbul ignore if */
            if (config.NODE_ENV !== "test") {
                console.log("Importing", result.data.id);
            }

            if (result.result === "created" ||
                    result.result === "changed") {
                Artwork.fromData(result.data, req, (err, artwork) => {
                    artwork.save((err) => {
                        /* istanbul ignore if */
                        if (err) {
                            result.state = "error";
                            result.error = "ERROR_SAVING";
                        } else {
                            result.model = artwork._id;
                            result.state = "import.completed";
                        }

                        callback(err);
                    });
                });

            } else if (result.result === "deleted") {
                Artwork.findByIdAndRemove(result.model, (err) => {
                    /* istanbul ignore if */
                    if (err) {
                        result.state = "error";
                        result.error = "ERROR_DELETING";
                    } else {
                        result.state = "import.completed";
                    }

                    callback(err);
                });

            } else {
                result.state = "import.completed";
                process.nextTick(callback);
            }
        }, (err) => {
            /* istanbul ignore if */
            if (err) {
                this.error = err.message;
                return this.saveState("error", callback);
            }

            this.markModified("results");

            // Update the internal source cache
            Source.cacheSources(() => {
                // Advance to the next state
                this.saveState("import.completed", callback);
            });
        });
    },

    updateSimilarity(callback) {
        const results = this.getFilteredResults();

        // No need to update the similarity if no artworks were created
        // or deleted.
        if (results.created.length === 0 && results.deleted.length === 0) {
            return process.nextTick(callback);
        }

        // Update the similarity on all artworks, including the ones that
        // were just added.
        models("Artwork").update(
            {},
            {needsSimilarUpdate: true},
            {multi: true},
            callback
        );
    },

    abandon(callback) {
        this.error = "ABANDONED";
        this.saveState("error", callback);
    },

    getFilteredResults() {
        return {
            unprocessed: this.results.filter(
                (result) => result.result === "unknown"),
            created: this.results.filter(
                (result) => result.result === "created"),
            changed: this.results.filter(
                (result) => result.result === "changed"),
            deleted: this.results.filter(
                (result) => result.result === "deleted"),
            errors: this.results.filter((result) => result.error),
            warnings: this.results
                .filter((result) => (result.warnings || []).length !== 0),
        };
    },
});

Object.assign(ArtworkImport.statics, {
    fromFile(fileName, source) {
        const ArtworkImport = models("ArtworkImport");
        return new ArtworkImport({source, fileName});
    },

    getError(req, error) {
        const msg = errors[error];
        return msg ? msg(req) : error;
    },
});

module.exports = ArtworkImport;
