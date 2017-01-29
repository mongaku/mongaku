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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL0ltcG9ydC5qcyJdLCJuYW1lcyI6WyJhc3luYyIsInJlcXVpcmUiLCJtb2RlbHMiLCJjb25maWciLCJJbXBvcnQiLCJzY2hlbWEiLCJfaWQiLCJTdHJpbmciLCJjcmVhdGVkIiwidHlwZSIsIkRhdGUiLCJkZWZhdWx0Iiwibm93IiwibW9kaWZpZWQiLCJzb3VyY2UiLCJyZXF1aXJlZCIsInN0YXRlIiwiZXJyb3IiLCJyZXN1bHRzIiwibWV0aG9kcyIsImdldFNvdXJjZSIsInNhdmVTdGF0ZSIsImNhbGxiYWNrIiwic2F2ZSIsImdldEN1clN0YXRlIiwiZ2V0U3RhdGVzIiwiZmluZCIsImlkIiwiZ2V0TmV4dFN0YXRlIiwic3RhdGVzIiwiaW5kZXhPZiIsImdldFN0YXRlTmFtZSIsInJlcSIsImN1clN0YXRlIiwibmFtZSIsImZvcm1hdCIsImdldHRleHQiLCJnZXRFcnJvciIsImNhbkFkdmFuY2UiLCJhZHZhbmNlIiwibmV4dFN0YXRlIiwicHJvY2VzcyIsIm5leHRUaWNrIiwiZXJyIiwibWVzc2FnZSIsIm1hcmtNb2RpZmllZCIsInN0YXRpY3MiLCIkbmluIiwiYmF0Y2hlcyIsImxlbmd0aCIsInF1ZXVlcyIsImZpbHRlciIsImJhdGNoIiwiZm9yRWFjaCIsInB1c2giLCJlYWNoIiwiT2JqZWN0Iiwia2V5cyIsInF1ZXVlTmFtZSIsInF1ZXVlIiwiZWFjaExpbWl0IiwiZmluZEJ5SWQiLCJOT0RFX0VOViIsImNvbnNvbGUiLCJsb2ciLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFFBQVFDLFFBQVEsT0FBUixDQUFkOztBQUVBLElBQU1DLFNBQVNELFFBQVEsZUFBUixDQUFmO0FBQ0EsSUFBTUUsU0FBU0YsUUFBUSxlQUFSLENBQWY7O0FBRUEsSUFBTUcsU0FBUyxFQUFmOztBQUVBQSxPQUFPQyxNQUFQLEdBQWdCO0FBQ1o7QUFDQUMsU0FBS0MsTUFGTzs7QUFJWjtBQUNBQyxhQUFTO0FB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LEVBQWdCO0FBQ3JDO0FBQ0EsNEJBQUlqRCxPQUFPMkQsUUFBUCxLQUFvQixNQUF4QixFQUFnQztBQUM1QkMsb0NBQVFDLEdBQVIsQ0FBWSxlQUFhWixNQUFNOUMsR0FBbkIsYUFDTDhDLE1BQU14QixZQUFOLEdBQXFCRCxFQURoQixTQUFaO0FBRUg7QUFDRHlCLDhCQUFNYixPQUFOLENBQWNqQixRQUFkO0FBQ0gscUJBUEQ7QUFRSCxpQkFWRCxFQVVHQSxRQVZIO0FBV0gsYUFmRCxFQWVHQSxRQWZIO0FBZ0JILFNBdENEO0FBdUNIO0FBekNZLENBQWpCOztBQTRDQTJDLE9BQU9DLE9BQVAsR0FBaUI5RCxNQUFqQiIsImZpbGUiOiJJbXBvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBhc3luYyA9IHJlcXVpcmUoXCJhc3luY1wiKTtcblxuY29uc3QgbW9kZWxzID0gcmVxdWlyZShcIi4uL2xpYi9tb2RlbHNcIik7XG5jb25zdCBjb25maWcgPSByZXF1aXJlKFwiLi4vbGliL2NvbmZpZ1wiKTtcblxuY29uc3QgSW1wb3J0ID0ge307XG5cbkltcG9ydC5zY2hlbWEgPSB7XG4gICAgLy8gQW4gSUQgZm9yIHRoZSBpbXBvcnQsIGJhc2VkIG9uIHRoZSBzb3VyY2UgYW5kIHRpbWVcbiAgICBfaWQ6IFN0cmluZyxcblxuICAgIC8vIFRoZSBkYXRlIHRoYXQgdGhpcyBiYXRjaCB3YXMgY3JlYXRlZFxuICAgIGNyZWF0ZWQ6IHtcbiAgICAgICAgdHlwZTogRGF0ZSxcbiAgICAgICAgZGVmYXVsdDogRGF0ZS5ub3csXG4gICAgfSxcblxuICAgIC8vIFRoZSBkYXRlIHRoYXQgdGhpcyBiYXRjaCB3YXMgdXBkYXRlZFxuICAgIG1vZGlmaWVkOiB7XG4gICAgICAgIHR5cGU6IERhdGUsXG4gICAgfSxcblxuICAgIC8vIFRoZSBzb3VyY2UgdGhhdCB0aGUgaW1hZ2UgaXMgYXNzb2NpYXRlZCB3aXRoXG4gICAgc291cmNlOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgfSxcblxuICAgIC8vIFRoZSBzdGF0ZSBvZiB0aGUgYmF0Y2ggdXBsb2FkXG4gICAgc3RhdGU6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgZGVmYXVsdDogXCJzdGFydGVkXCIsXG4gICAgfSxcblxuICAgIC8vIEFuIGVycm9yIG1lc3NhZ2UsIGlmIHRoZSBzdGF0ZSBpcyBzZXQgdG8gXCJlcnJvclwiXG4gICAgZXJyb3I6IFwiU3RyaW5nXCIsXG5cbiAgICAvLyBUaGUgcmVzdWx0cyBvZiB0aGUgaW1wb3J0XG4gICAgcmVzdWx0czogW3t9XSxcbn07XG5cbkltcG9ydC5tZXRob2RzID0ge1xuICAgIGdldFNvdXJjZSgpIHtcbiAgICAgICAgcmV0dXJuIG1vZGVscyhcIlNvdXJjZVwiKS5nZXRTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgIH0sXG5cbiAgICBzYXZlU3RhdGUoc3RhdGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgdGhpcy5zYXZlKGNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgZ2V0Q3VyU3RhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFN0YXRlcygpLmZpbmQoKHN0YXRlKSA9PiBzdGF0ZS5pZCA9PT0gdGhpcy5zdGF0ZSk7XG4gICAgfSxcblxuICAgIGdldE5leHRTdGF0ZSgpIHtcbiAgICAgICAgY29uc3Qgc3RhdGVzID0gdGhpcy5nZXRTdGF0ZXMoKTtcbiAgICAgICAgcmV0dXJuIHN0YXRlc1tzdGF0ZXMuaW5kZXhPZih0aGlzLmdldEN1clN0YXRlKCkpICsgMV07XG4gICAgfSxcblxuICAgIGdldFN0YXRlTmFtZShyZXEpIHtcbiAgICAgICAgY29uc3QgY3VyU3RhdGUgPSB0aGlzLmdldEN1clN0YXRlKCk7XG4gICAgICAgIHJldHVybiBjdXJTdGF0ZSA/IGN1clN0YXRlLm5hbWUocmVxKSA6XG4gICAgICAgICAgICByZXEuZm9ybWF0KHJlcS5nZXR0ZXh0KFwiRXJyb3I6ICUoZXJyb3Ipc1wiKSxcbiAgICAgICAgICAgICAgICB7ZXJyb3I6IHRoaXMuZ2V0RXJyb3IocmVxKX0pO1xuICAgIH0sXG5cbiAgICBjYW5BZHZhbmNlKCkge1xuICAgICAgICBjb25zdCBjdXJTdGF0ZSA9IHRoaXMuZ2V0Q3VyU3RhdGUoKTtcbiAgICAgICAgaWYgKCFjdXJTdGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAhIWN1clN0YXRlLmFkdmFuY2U7XG4gICAgfSxcblxuICAgIGFkdmFuY2UoY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLmdldEN1clN0YXRlKCk7XG4gICAgICAgIGNvbnN0IG5leHRTdGF0ZSA9IHRoaXMuZ2V0TmV4dFN0YXRlKCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLmNhbkFkdmFuY2UoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2soY2FsbGJhY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zYXZlU3RhdGUobmV4dFN0YXRlLmlkLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3RhdGUuYWR2YW5jZSh0aGlzLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgd2FzIGFuIGVycm9yIHRoZW4gd2Ugc2F2ZSB0aGUgZXJyb3IgbWVzc2FnZVxuICAgICAgICAgICAgICAgIC8vIGFuZCBzZXQgdGhlIHN0YXRlIG9mIHRoZSBiYXRjaCB0byBcImVycm9yXCIgdG8gYXZvaWRcbiAgICAgICAgICAgICAgICAvLyByZXRyaWVzLlxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvciA9IGVyci5tZXNzYWdlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zYXZlU3RhdGUoXCJlcnJvclwiLCBjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gQWR2YW5jZSB0byB0aGUgbmV4dCBzdGF0ZVxuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRTdGF0ZSA9IHRoaXMuZ2V0TmV4dFN0YXRlKCk7XG4gICAgICAgICAgICAgICAgaWYgKG5leHRTdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtNb2RpZmllZChcInJlc3VsdHNcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2F2ZVN0YXRlKG5leHRTdGF0ZS5pZCwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG59O1xuXG5JbXBvcnQuc3RhdGljcyA9IHtcbiAgICBhZHZhbmNlKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuZmluZCh7XG4gICAgICAgICAgICBzdGF0ZToge1xuICAgICAgICAgICAgICAgICRuaW46IFtcImNvbXBsZXRlZFwiLCBcImVycm9yXCJdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSwgXCJfaWQgc3RhdGVcIiwge30sIChlcnIsIGJhdGNoZXMpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIgfHwgIWJhdGNoZXMgfHwgYmF0Y2hlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcXVldWVzID0ge307XG5cbiAgICAgICAgICAgIGJhdGNoZXNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKChiYXRjaCkgPT4gYmF0Y2guY2FuQWR2YW5jZSgpKVxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKChiYXRjaCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXF1ZXVlc1tiYXRjaC5zdGF0ZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlc1tiYXRjaC5zdGF0ZV0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHF1ZXVlc1tiYXRjaC5zdGF0ZV0ucHVzaChiYXRjaCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFJ1biBhbGwgdGhlIHF1ZXVlcyBpbiBwYXJhbGxlbFxuICAgICAgICAgICAgYXN5bmMuZWFjaChPYmplY3Qua2V5cyhxdWV1ZXMpLCAocXVldWVOYW1lLCBjYWxsYmFjaykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHF1ZXVlID0gcXVldWVzW3F1ZXVlTmFtZV07XG5cbiAgICAgICAgICAgICAgICAvLyBCdXQgZG8gZWFjaCBxdWV1ZSBpbiBzZXJpZXNcbiAgICAgICAgICAgICAgICBhc3luYy5lYWNoTGltaXQocXVldWUsIDEsIChiYXRjaCwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2Ugbm93IGxvYWQgdGhlIGNvbXBsZXRlIGJhdGNoIHdpdGggYWxsIGZpZWxkcyBpbnRhY3RcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5kQnlJZChiYXRjaC5faWQsIChlcnIsIGJhdGNoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb25maWcuTk9ERV9FTlYgIT09IFwidGVzdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEFkdmFuY2luZyAke2JhdGNoLl9pZH0gdG8gYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAke2JhdGNoLmdldE5leHRTdGF0ZSgpLmlkfS4uLmApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYmF0Y2guYWR2YW5jZShjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH0sIGNhbGxiYWNrKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW1wb3J0O1xuIl19