const async = require("async");

const models = require("../lib/models");
const config = require("../lib/config");

const Import = {};

Import.schema = {
    // An ID for the import, based on the source and time
    _id: String,

    // The date that this batch was created
    created: {
        type: Date,
        default: Date.now,
    },

    // The date that this batch was updated
    modified: {
        type: Date,
    },

    // The source that the image is associated with
    source: {
        type: String,
        required: true,
    },

    // The state of the batch upload
    state: {
        type: String,
        required: true,
        default: "started",
    },

    // An error message, if the state is set to "error"
    error: "String",

    // The results of the import
    results: [{}],

    // Can the import skip manual confirmation steps?
    skipConfirmation: {
        type: Boolean,
        default: false,
    },
};

Import.methods = {
    getSource() {
        return models("Source").getSource(this.source);
    },

    isCompleted() {
        return this.isSuccessful() || this.state === "error";
    },

    isSuccessful() {
        return this.state === "completed";
    },

    saveState(state, callback) {
        this.state = state;
        this.save(callback);
    },

    getCurState() {
        return this.getStates().find(state => state.id === this.state);
    },

    getNextState() {
        const states = this.getStates();
        return states[states.indexOf(this.getCurState()) + 1];
    },

    getStateName(i18n) {
        const curState = this.getCurState();
        return curState
            ? curState.name(i18n)
            : i18n.format(i18n.gettext("Error: %(error)s"), {
                  error: this.getError(i18n),
              });
    },

    canAdvance() {
        const curState = this.getCurState();
        if (!curState) {
            return false;
        }
        return (
            !!curState.advance ||
            (this.skipConfirmation && curState.requiresManualConfirmation)
        );
    },

    advance(callback) {
        const state = this.getCurState();
        const nextState = this.getNextState();

        if (!this.canAdvance()) {
            return process.nextTick(callback);
        }

        const advanceState = () => {
            // Advance to the next state
            const nextState = this.getNextState();
            if (nextState) {
                this.markModified("results");
                this.saveState(nextState.id, callback);
            } else {
                callback();
            }
        };

        this.saveState(nextState.id, err => {
            /* istanbul ignore if */
            if (err) {
                return callback(err);
            }

            if (!state.advance) {
                return advanceState();
            }

            state.advance(this, err => {
                // If there was an error then we save the error message
                // and set the state of the batch to "error" to avoid
                // retries.
                if (err) {
                    this.error = err.message;
                    return this.saveState("error", callback);
                }

                advanceState();
            });
        });
    },
};

Import.statics = {
    advance(callback) {
        this.find(
            {
                state: {
                    $nin: ["completed", "error"],
                },
            },
            "_id state",
            {},
            (err, batches) => {
                if (err || !batches || batches.length === 0) {
                    return callback(err);
                }

                const queues = {};

                batches.filter(batch => batch.canAdvance()).forEach(batch => {
                    if (!queues[batch.state]) {
                        queues[batch.state] = [];
                    }

                    queues[batch.state].push(batch);
                });

                // Run all the queues in parallel
                async.each(
                    Object.keys(queues),
                    (queueName, callback) => {
                        const queue = queues[queueName];

                        // But do each queue in series
                        async.eachLimit(
                            queue,
                            1,
                            (batch, callback) => {
                                // We now load the complete batch with all
                                // fields intact
                                this.findById(batch._id, (err, batch) => {
                                    /* istanbul ignore if */
                                    if (config.NODE_ENV !== "test") {
                                        console.log(
                                            `Advancing ${batch._id} to ` +
                                                `${batch.getNextState().id}...`,
                                        );
                                    }
                                    batch.advance(callback);
                                });
                            },
                            callback,
                        );
                    },
                    callback,
                );
            },
        );
    },
};

module.exports = Import;
