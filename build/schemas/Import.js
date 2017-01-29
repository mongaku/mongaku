"use strict";

var async = require("async");

var models = require("../lib/models");
var config = require("../lib/config");

var Import = {};

Import.schema = {
    // An ID for the import, based on the source and time
    _id: String,

    // The date that this batch was created
    created: {
        type: Date,
        default: Date.now
    },

    // The date that this batch was updated
    modified: {
        type: Date
    },

    // The source that the image is associated with
    source: {
        type: String,
        required: true
    },

    // The state of the batch upload
    state: {
        type: String,
        required: true,
        default: "started"
    },

    // An error message, if the state is set to "error"
    error: "String",

    // The results of the import
    results: [{}]
};

Import.methods = {
    getSource: function getSource() {
        return models("Source").getSource(this.source);
    },
    saveState: function saveState(state, callback) {
        this.state = state;
        this.save(callback);
    },
    getCurState: function getCurState() {
        var _this = this;

        return this.getStates().find(function (state) {
            return state.id === _this.state;
        });
    },
    getNextState: function getNextState() {
        var states = this.getStates();
        return states[states.indexOf(this.getCurState()) + 1];
    },
    getStateName: function getStateName(req) {
        var curState = this.getCurState();
        return curState ? curState.name(req) : req.format(req.gettext("Error: %(error)s"), { error: this.getError(req) });
    },
    canAdvance: function canAdvance() {
        var curState = this.getCurState();
        if (!curState) {
            return false;
        }
        return !!curState.advance;
    },
    advance: function advance(callback) {
        var _this2 = this;

        var state = this.getCurState();
        var nextState = this.getNextState();

        if (!this.canAdvance()) {
            return process.nextTick(callback);
        }

        this.saveState(nextState.id, function (err) {
            /* istanbul ignore if */
            if (err) {
                return callback(err);
            }

            state.advance(_this2, function (err) {
                // If there was an error then we save the error message
                // and set the state of the batch to "error" to avoid
                // retries.
                if (err) {
                    _this2.error = err.message;
                    return _this2.saveState("error", callback);
                }

                // Advance to the next state
                var nextState = _this2.getNextState();
                if (nextState) {
                    _this2.markModified("results");
                    _this2.saveState(nextState.id, callback);
                } else {
                    callback();
                }
            });
        });
    }
};

Import.statics = {
    advance: function advance(callback) {
        var _this3 = this;

        this.find({
            state: {
                $nin: ["completed", "error"]
            }
        }, "_id state", {}, function (err, batches) {
            if (err || !batches || batches.length === 0) {
                return callback(err);
            }

            var queues = {};

            batches.filter(function (batch) {
                return batch.canAdvance();
            }).forEach(function (batch) {
                if (!queues[batch.state]) {
                    queues[batch.state] = [];
                }

                queues[batch.state].push(batch);
            });

            // Run all the queues in parallel
            async.each(Object.keys(queues), function (queueName, callback) {
                var queue = queues[queueName];

                // But do each queue in series
                async.eachLimit(queue, 1, function (batch, callback) {
                    // We now load the complete batch with all fields intact
                    _this3.findById(batch._id, function (err, batch) {
                        /* istanbul ignore if */
                        if (config.NODE_ENV !== "test") {
                            console.log("Advancing " + batch._id + " to " + (batch.getNextState().id + "..."));
                        }
                        batch.advance(callback);
                    });
                }, callback);
            }, callback);
        });
    }
};

module.exports = Import;