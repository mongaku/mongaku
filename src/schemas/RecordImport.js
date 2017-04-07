const async = require("async");

const record = require("../lib/record");
const models = require("../lib/models");
const db = require("../lib/db");
const options = require("../lib/options");
const urls = require("../lib/urls")(options);
const config = require("../lib/config");

const Import = require("./Import");

const states = [
    {
        id: "started",
        name: i18n => i18n.gettext("Awaiting processing..."),
        advance(batch, callback) {
            batch.processRecords(callback);
        },
    },
    {
        id: "process.started",
        name: i18n => i18n.gettext("Processing..."),
    },
    {
        id: "process.completed",
        name: i18n => i18n.gettext("Confirmation required."),
        // NOTE(jeresig): Do not auto-advance to importing the data
        // we want the user to make the call on the results.
        // batch.importRecords(callback);
    },
    {
        id: "import.started",
        name: i18n => i18n.gettext("Importing data..."),
    },
    {
        id: "import.completed",
        name: i18n => i18n.gettext("Awaiting similarity sync..."),
        advance(batch, callback) {
            batch.updateSimilarity(callback);
        },
    },
    {
        id: "similarity.sync.started",
        name: i18n => i18n.gettext("Syncing similarity..."),
    },
    {
        id: "similarity.sync.completed",
        name: i18n => i18n.gettext("Completed."),
        advance(batch, callback) {
            // NOTE(jeresig): Currently nothing needs to be done to finish
            // up the import, other than moving it to the "completed" state.
            process.nextTick(callback);
        },
    },
    {
        id: "completed",
        name: i18n => i18n.gettext("Completed."),
    },
];

const errors = {
    ABANDONED: i18n => i18n.gettext("Data import abandoned."),
    ERROR_READING_DATA: i18n =>
        i18n.gettext("Error reading data from provided data files."),
    ERROR_SAVING: i18n => i18n.gettext("Error saving record."),
    ERROR_DELETING: i18n => i18n.gettext("Error deleting existing record."),
};

// TODO(jeresig): Remove this.
const i18n = {
    format: (msg, fields) =>
        msg.replace(/%\((.*?)\)s/g, (all, name) => fields[name]),
    gettext: msg => msg,
    lang: "en",
};

const RecordImport = new db.schema(
    Object.assign({}, Import.schema, {
        // The type of the record
        type: {
            type: String,
            required: true,
        },

        // The name of the original file (e.g. `foo.json`)
        fileName: {
            type: String,
            required: true,
        },
    })
);

Object.assign(RecordImport.methods, Import.methods, {
    getURL(lang) {
        return urls.gen(
            lang,
            `/${this.getSource().type}` +
                `/source/${this.source}/admin?records=${this._id}`
        );
    },

    getError(i18n) {
        return models("RecordImport").getError(i18n, this.error);
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

            this.results = results.map(data => ({
                data,
                result: "unknown",
            }));

            callback();
        });
    },

    processRecords(callback) {
        const Record = record(this.type);
        const incomingIDs = {};

        const results = this.results;

        async.eachLimit(
            results,
            1,
            (result, callback) => {
                const data = Object.assign(result.data, {
                    source: this.source,
                    type: this.type,
                });

                /* istanbul ignore if */
                if (config.NODE_ENV !== "test") {
                    console.log("Processing Record:", data.id);
                }

                Record.fromData(data, i18n, (err, record, warnings, isNew) => {
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
            },
            () => {
                /* istanbul ignore if */
                if (config.NODE_ENV !== "test") {
                    console.log("Finding records to delete...");
                }

                // Find records that need to be deleted
                Record.find({source: this.source})
                    .lean()
                    .distinct("_id")
                    .exec((err, ids) => {
                        for (const id of ids) {
                            if (id in incomingIDs) {
                                continue;
                            }

                            results.push({
                                _id: id,
                                model: id,
                                result: "deleted",
                                state: "process.completed",
                                data: {},
                            });
                        }

                        this.results = results;
                        callback();
                    });
            }
        );
    },

    manuallyApprove(callback) {
        this.saveState("import.started", err => {
            /* istanbul ignore if */
            if (err) {
                return callback(err);
            }

            // Delay the importing of the records to not block the UI
            process.nextTick(() =>
                this.importRecords(() => {
                    // Ignore the result, user doesn't care.
                })
            );

            callback();
        });
    },

    importRecords(callback) {
        const Record = record(this.type);
        const Source = models("Source");

        async.eachLimit(
            this.results,
            1,
            (result, callback) => {
                result.state = "import.started";

                /* istanbul ignore if */
                if (config.NODE_ENV !== "test") {
                    console.log("Importing", result.data.id);
                }

                if (
                    result.result === "created" || result.result === "changed"
                ) {
                    Record.fromData(result.data, i18n, (err, record) => {
                        record.save(err => {
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
                    Record.findById(result.model, (err, record) => {
                        /* istanbul ignore if */
                        if (err || !record) {
                            result.state = "error";
                            result.error = "ERROR_DELETING";
                            return callback(err);
                        }

                        record.remove(err => {
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
            },
            err => {
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
            }
        );
    },

    updateSimilarity(callback) {
        const results = this.getFilteredResults();

        // No need to update the similarity if no records were created
        // or deleted.
        if (results.created.length === 0 && results.deleted.length === 0) {
            return process.nextTick(callback);
        }

        // Update the similarity on all records, including the ones that
        // were just added.
        record(this.type).update(
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
                result => result.result === "unknown"
            ),
            created: this.results.filter(result => result.result === "created"),
            changed: this.results.filter(result => result.result === "changed"),
            deleted: this.results.filter(result => result.result === "deleted"),
            errors: this.results.filter(result => result.error),
            warnings: this.results.filter(
                result => (result.warnings || []).length !== 0
            ),
        };
    },
});

Object.assign(RecordImport.statics, Import.statics, {
    fromFile(fileName, source, type) {
        const RecordImport = models("RecordImport");
        return new RecordImport({source, fileName, type});
    },

    getError(i18n, error) {
        const msg = errors[error];
        return msg ? msg(i18n) : error;
    },
});

RecordImport.pre("validate", function(next) {
    // Create the ID if one hasn't been set before
    if (!this._id) {
        this._id = `${this.source}/${Date.now()}`;
    }

    next();
});

/* istanbul ignore next */
RecordImport.pre("save", function(next) {
    // Always updated the modified time on every save
    this.modified = new Date();

    next();
});

module.exports = RecordImport;
