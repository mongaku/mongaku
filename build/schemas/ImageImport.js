"use strict";

var os = require("os");
var fs = require("fs");
var path = require("path");

var async = require("async");
var unzip = require("unzip2");

var models = require("../lib/models");
var db = require("../lib/db");
var urls = require("../lib/urls");
var config = require("../lib/config");

var Import = require("./Import");

var states = [{
    id: "started",
    name: function name(req) {
        return req.gettext("Awaiting processing...");
    },
    advance: function advance(batch, callback) {
        batch.processImages(callback);
    }
}, {
    id: "process.started",
    name: function name(req) {
        return req.gettext("Processing...");
    }
}, {
    id: "process.completed",
    name: function name(req) {
        return req.gettext("Completed.");
    },
    advance: function advance(batch, callback) {
        // NOTE(jeresig): Currently nothing needs to be done to finish
        // up the import, other than moving it to the "completed" state.
        process.nextTick(callback);
    }
}, {
    id: "completed",
    name: function name(req) {
        return req.gettext("Completed.");
    }
}];

var errors = {
    ERROR_READING_ZIP: function ERROR_READING_ZIP(req) {
        return req.gettext("Error opening zip file.");
    },
    ZIP_FILE_EMPTY: function ZIP_FILE_EMPTY(req) {
        return req.gettext("Zip file has no images in it.");
    },
    MALFORMED_IMAGE: function MALFORMED_IMAGE(req) {
        return req.gettext("There was an error processing " + "the image. Perhaps it is malformed in some way.");
    },
    EMPTY_IMAGE: function EMPTY_IMAGE(req) {
        return req.gettext("The image is empty.");
    },
    NEW_VERSION: function NEW_VERSION(req) {
        return req.gettext("A new version of the image was " + "uploaded, replacing the old one.");
    },
    TOO_SMALL: function TOO_SMALL(req) {
        return req.gettext("The image is too small to work with " + "the image similarity algorithm. It must be at least 150px on " + "each side.");
    },
    ERROR_SAVING: function ERROR_SAVING(req) {
        return req.gettext("Error saving image.");
    }
};

var ImageImport = new db.schema(Object.assign({}, Import.schema, {
    // The location of the uploaded zip file
    // (temporary, deleted after processing)
    zipFile: {
        type: String,
        required: true
    },

    // The name of the original file (e.g. `foo.zip`)
    fileName: {
        type: String,
        required: true
    }
}));

Object.assign(ImageImport.methods, Import.methods, {
    getURL: function getURL(lang) {
        return urls.gen(lang, "/" + this.getSource().type + "/source" + ("/" + this.source + "/admin?images=" + this._id));
    },
    getError: function getError(req) {
        return models("ImageImport").getError(req, this.error);
    },
    getStates: function getStates() {
        return states;
    },
    processImages: function processImages(callback) {
        var _this = this;

        var zipFile = fs.createReadStream(this.zipFile);
        var zipError = void 0;
        var files = [];
        var extractDir = path.join(os.tmpdir(), new Date().getTime().toString());

        fs.mkdir(extractDir, function () {
            zipFile.pipe(unzip.Parse()).on("entry", function (entry) {
                var fileName = path.basename(entry.path);
                var outFileName = path.join(extractDir, fileName);

                // Ignore things that aren't files (e.g. directories)
                // Ignore files that don't end with .jpe?g
                // Ignore files that start with '.'
                if (entry.type !== "File" || !/.+\.jpe?g$/i.test(fileName) || fileName.indexOf(".") === 0) {
                    return entry.autodrain();
                }

                // Don't attempt to add files that already exist
                if (files.indexOf(outFileName) >= 0) {
                    return entry.autodrain();
                }

                /* istanbul ignore if */
                if (config.NODE_ENV !== "test") {
                    console.log("Extracting:", path.basename(outFileName));
                }

                files.push(outFileName);
                entry.pipe(fs.createWriteStream(outFileName));
            }).on("error", function () {
                // Hack from this ticket to force the stream to close:
                // https://github.com/glebdmitriew/node-unzip-2/issues/8
                this._streamEnd = true;
                this._streamFinish = true;
                zipError = true;
            }).on("close", function () {
                if (zipError) {
                    return callback(new Error("ERROR_READING_ZIP"));
                }

                if (files.length === 0) {
                    return callback(new Error("ZIP_FILE_EMPTY"));
                }

                // Import all of the files as images
                async.eachLimit(files, 1, function (file, callback) {
                    _this.addResult(file, callback);
                }, function (err) {
                    /* istanbul ignore if */
                    if (err) {
                        return callback(err);
                    }

                    _this.setSimilarityState(callback);
                });
            });
        });
    },
    setSimilarityState: function setSimilarityState(callback) {
        var Image = models("Image");
        Image.queueBatchSimilarityUpdate(this._id, callback);
    },
    addResult: function addResult(file, callback) {
        var _this2 = this;

        /* istanbul ignore if */
        if (config.NODE_ENV !== "test") {
            console.log("Adding Image:", path.basename(file));
        }

        models("Image").fromFile(this, file, function (err, image, warnings) {
            var fileName = path.basename(file);

            var result = {
                _id: fileName,
                fileName: fileName
            };

            if (err) {
                result.error = err.message;
            } else {
                result.warnings = warnings;
                result.model = image._id;
            }

            // Add the result
            _this2.results.push(result);

            if (image) {
                image.save(function (err) {
                    /* istanbul ignore if */
                    if (err) {
                        return callback(err);
                    }

                    image.linkToRecords(function () {
                        return _this2.save(callback);
                    });
                });
            } else {
                _this2.save(callback);
            }
        });
    },
    getFilteredResults: function getFilteredResults() {
        return {
            models: this.results.filter(function (result) {
                return result.model;
            }),
            errors: this.results.filter(function (result) {
                return result.error;
            }),
            warnings: this.results.filter(function (result) {
                return (result.warnings || []).length !== 0;
            })
        };
    }
});

Object.assign(ImageImport.statics, Import.statics, {
    fromFile: function fromFile(fileName, source) {
        var ImageImport = models("ImageImport");
        return new ImageImport({ source: source, fileName: fileName });
    },
    getError: function getError(req, error) {
        var msg = errors[error];
        return msg ? msg(req) : error;
    }
});

ImageImport.pre("validate", function (next) {
    // Create the ID if one hasn't been set before
    if (!this._id) {
        this._id = this.source + "/" + Date.now();
    }

    next();
});

/* istanbul ignore next */
ImageImport.pre("save", function (next) {
    // Always updated the modified time on every save
    this.modified = new Date();

    next();
});

module.exports = ImageImport;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL0ltYWdlSW1wb3J0LmpzIl0sIm5hbWVzIjpbIm9zIiwicmVxdWlyZSIsImZzIiwicGF0aCIsImFzeW5jIiwidW56aXAiLCJtb2RlbHMiLCJkYiIsInVybHMiLCJjb25maWciLCJJbXBvcnQiLCJzdGF0ZXMiLCJpZCIsIm5hbWUiLCJyZXEiLCJnZXR0ZXh0IiwiYWR2YW5jZSIsImJhdGNoIiwiY2FsbGJhY2siLCJwcm9jZXNzSW1hZ2VzIiwicHJvY2VzcyIsIm5leHRUaWNrIiwiZXJyb3JzIiwiRVJST1JfUkVBRElOR19aSVAiLCJaSVBfRklMRV9FTVBUWSIsIk1BTEZPUk1FRF9JTUFHRSIsIkVNUFRZX0lNQUdFIiwiTkVXX1ZFUlNJT04iLCJUT09fU01BTEwiLCJFUlJPUl9TQVZJTkciLCJJbWFnZUltcG9ydCIsInNjaGVtYSIsIk9iamVjdCIsImFzc2lnbiIsInppcEZpbGUiLCJ0eXBlIiwiU3RyaW5nIiwicmVxdWlyZWQiLCJmaWxlTmFtZSIsIm1ldGhvZHMiLCJnZXRVUkwiLCJsYW5nIiwiZ2VuIiwiZ2V0U291cmNlIiwic291cmNlIiwiX2lkIiwiZ2V0RXJyb3IiLCJlcnJvciIsImdldFN0YXRlcyIsImNyZWF0ZVJlYWRTdHJlYW0iLCJ6aXBFcnJvciIsImZpbGVzIiwiZXh0cmFjdERpciIsImpvaW4iLCJ0bXBkaXIiLCJEYXRlIiwiZ2V0VGltZSIsInRvU3RyaW5nIiwibWtkaXIiLCJwaXBlIiwiUGFyc2UiLCJvbiIsImVudHJ5IiwiYmFzZW5hbWUiLCJvdXRGaWxlTmFtZSIsInRlc3QiLCJpbmRleE9mIiwiYXV0b2RyYWluIiwiTk9ERV9FTlYiLCJjb25zb2xlIiwibG9nIiwicHVzaCIsImNyZWF0ZVdyaXRlU3RyZWFtIiwiX3N0cmVhbUVuZCIsIl9zdHJlYW1GaW5pc2giLCJFcnJvciIsImxlbmd0aCIsImVhY2hMaW1pdCIsImZpbGUiLCJhZGRSZXN1bHQiLCJlcnIiLCJzZXRTaW1pbGFyaXR5U3RhdGUiLCJJbWFnZSIsInF1ZXVlQmF0Y2hTaW1pbGFyaXR5VXBkYXRlIiwiZnJvbUZpbGUiLCJpbWFnZSIsIndhcm5pbmdzIiwicmVzdWx0IiwibWVzc2FnZSIsIm1vZGVsIiwicmVzdWx0cyIsInNhdmUiLCJsaW5rVG9SZWNvcmRzIiwiZ2V0RmlsdGVyZWRSZXN1bHRzIiwiZmlsdGVyIiwic3RhdGljcyIsIm1zZyIsInByZSIsIm5leHQiLCJub3ciLCJtb2RpZmllZCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsS0FBS0MsUUFBUSxJQUFSLENBQVg7QUFDQSxJQUFNQyxLQUFLRCxRQUFRLElBQVIsQ0FBWDtBQUNBLElBQU1FLE9BQU9GLFFBQVEsTUFBUixDQUFiOztBQUVBLElBQU1HLFFBQVFILFFBQVEsT0FBUixDQUFkO0FBQ0EsSUFBTUksUUFBUUosUUFBUSxRQUFSLENBQWQ7O0FBRUEsSUFBTUssU0FBU0wsUUFBUSxlQUFSLENBQWY7QUFDQSxJQUFNTSxLQUFLTixRQUFRLFdBQVIsQ0FBWDtBQUNBLElBQU1PLE9BQU9QLFFBQVEsYUFBUixDQUFiO0FBQ0EsSUFBTVEsU0FBU1IsUUFBUSxlQUFSLENBQWY7O0FBRUEsSUFBTVMsU0FBU1QsUUFBUSxVQUFSLENBQWY7O0FBRUEsSUFBTVUsU0FBUyxDQUNYO0FBQ0lDLFFBQUksU0FEUjtBQUVJQyxVQUFNLGNBQUNDLEdBQUQ7QUFBQSxlQUFTQSxJQUFJQyxPQUFKLENBQVksd0JBQVosQ0FBVDtBQUFBLEtBRlY7QUFHSUMsV0FISixtQkFHWUMsS0FIWixFQUdtQkMsUUFIbkIsRUFHNkI7QUFDckJELGNBQU1FLGFBQU4sQ0FBb0JELFFBQXBCO0FBQ0g7QUFMTCxDQURXLEVBUVg7QUFDSU4sUUFBSSxpQkFEUjtBQUVJQyxVQUFNLGNBQUNDLEdBQUQ7QUFBQSxlQUFTQSxJQUFJQyxPQUFKLENBQVksZUFBWixDQUFUO0FBQUE7QUFGVixDQVJXLEVBWVg7QUFDSUgsUUFBSSxtQkFEUjtBQUVJQyxVQUFNLGNBQUNDLEdBQUQ7QUFBQSxlQUFT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cUYsT0FBMUMsRUFBbUQ7QUFDL0NYLFlBRCtDLG9CQUN0QzlDLFFBRHNDLEVBQzVCTSxNQUQ0QixFQUNwQjtBQUN2QixZQUFNZCxjQUFjeEIsT0FBTyxhQUFQLENBQXBCO0FBQ0EsZUFBTyxJQUFJd0IsV0FBSixDQUFnQixFQUFDYyxjQUFELEVBQVNOLGtCQUFULEVBQWhCLENBQVA7QUFDSCxLQUo4QztBQU0vQ1EsWUFOK0Msb0JBTXRDaEMsR0FOc0MsRUFNakNpQyxLQU5pQyxFQU0xQjtBQUNqQixZQUFNaUQsTUFBTTFFLE9BQU95QixLQUFQLENBQVo7QUFDQSxlQUFPaUQsTUFBTUEsSUFBSWxGLEdBQUosQ0FBTixHQUFpQmlDLEtBQXhCO0FBQ0g7QUFUOEMsQ0FBbkQ7O0FBWUFqQixZQUFZbUUsR0FBWixDQUFnQixVQUFoQixFQUE0QixVQUFTQyxJQUFULEVBQWU7QUFDdkM7QUFDQSxRQUFJLENBQUMsS0FBS3JELEdBQVYsRUFBZTtBQUNYLGFBQUtBLEdBQUwsR0FBYyxLQUFLRCxNQUFuQixTQUE2QlcsS0FBSzRDLEdBQUwsRUFBN0I7QUFDSDs7QUFFREQ7QUFDSCxDQVBEOztBQVNBO0FBQ0FwRSxZQUFZbUUsR0FBWixDQUFnQixNQUFoQixFQUF3QixVQUFTQyxJQUFULEVBQWU7QUFDbkM7QUFDQSxTQUFLRSxRQUFMLEdBQWdCLElBQUk3QyxJQUFKLEVBQWhCOztBQUVBMkM7QUFDSCxDQUxEOztBQU9BRyxPQUFPQyxPQUFQLEdBQWlCeEUsV0FBakIiLCJmaWxlIjoiSW1hZ2VJbXBvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBvcyA9IHJlcXVpcmUoXCJvc1wiKTtcbmNvbnN0IGZzID0gcmVxdWlyZShcImZzXCIpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuXG5jb25zdCBhc3luYyA9IHJlcXVpcmUoXCJhc3luY1wiKTtcbmNvbnN0IHVuemlwID0gcmVxdWlyZShcInVuemlwMlwiKTtcblxuY29uc3QgbW9kZWxzID0gcmVxdWlyZShcIi4uL2xpYi9tb2RlbHNcIik7XG5jb25zdCBkYiA9IHJlcXVpcmUoXCIuLi9saWIvZGJcIik7XG5jb25zdCB1cmxzID0gcmVxdWlyZShcIi4uL2xpYi91cmxzXCIpO1xuY29uc3QgY29uZmlnID0gcmVxdWlyZShcIi4uL2xpYi9jb25maWdcIik7XG5cbmNvbnN0IEltcG9ydCA9IHJlcXVpcmUoXCIuL0ltcG9ydFwiKTtcblxuY29uc3Qgc3RhdGVzID0gW1xuICAgIHtcbiAgICAgICAgaWQ6IFwic3RhcnRlZFwiLFxuICAgICAgICBuYW1lOiAocmVxKSA9PiByZXEuZ2V0dGV4dChcIkF3YWl0aW5nIHByb2Nlc3NpbmcuLi5cIiksXG4gICAgICAgIGFkdmFuY2UoYmF0Y2gsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBiYXRjaC5wcm9jZXNzSW1hZ2VzKGNhbGxiYWNrKTtcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgaWQ6IFwicHJvY2Vzcy5zdGFydGVkXCIsXG4gICAgICAgIG5hbWU6IChyZXEpID0+IHJlcS5nZXR0ZXh0KFwiUHJvY2Vzc2luZy4uLlwiKSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgaWQ6IFwicHJvY2Vzcy5jb21wbGV0ZWRcIixcbiAgICAgICAgbmFtZTogKHJlcSkgPT4gcmVxLmdldHRleHQoXCJDb21wbGV0ZWQuXCIpLFxuICAgICAgICBhZHZhbmNlKGJhdGNoLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgLy8gTk9URShqZXJlc2lnKTogQ3VycmVudGx5IG5vdGhpbmcgbmVlZHMgdG8gYmUgZG9uZSB0byBmaW5pc2hcbiAgICAgICAgICAgIC8vIHVwIHRoZSBpbXBvcnQsIG90aGVyIHRoYW4gbW92aW5nIGl0IHRvIHRoZSBcImNvbXBsZXRlZFwiIHN0YXRlLlxuICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhjYWxsYmFjayk7XG4gICAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlkOiBcImNvbXBsZXRlZFwiLFxuICAgICAgICBuYW1lOiAocmVxKSA9PiByZXEuZ2V0dGV4dChcIkNvbXBsZXRlZC5cIiksXG4gICAgfSxcbl07XG5cbmNvbnN0IGVycm9ycyA9IHtcbiAgICBFUlJPUl9SRUFESU5HX1pJUDogKHJlcSkgPT4gcmVxLmdldHRleHQoXCJFcnJvciBvcGVuaW5nIHppcCBmaWxlLlwiKSxcbiAgICBaSVBfRklMRV9FTVBUWTogKHJlcSkgPT4gcmVxLmdldHRleHQoXCJaaXAgZmlsZSBoYXMgbm8gaW1hZ2VzIGluIGl0LlwiKSxcbiAgICBNQUxGT1JNRURfSU1BR0U6IChyZXEpID0+IHJlcS5nZXR0ZXh0KFwiVGhlcmUgd2FzIGFuIGVycm9yIHByb2Nlc3NpbmcgXCIgK1xuICAgICAgICBcInRoZSBpbWFnZS4gUGVyaGFwcyBpdCBpcyBtYWxmb3JtZWQgaW4gc29tZSB3YXkuXCIpLFxuICAgIEVNUFRZX0lNQUdFOiAocmVxKSA9PiByZXEuZ2V0dGV4dChcIlRoZSBpbWFnZSBpcyBlbXB0eS5cIiksXG4gICAgTkVXX1ZFUlNJT046IChyZXEpID0+IHJlcS5nZXR0ZXh0KFwiQSBuZXcgdmVyc2lvbiBvZiB0aGUgaW1hZ2Ugd2FzIFwiICtcbiAgICAgICAgXCJ1cGxvYWRlZCwgcmVwbGFjaW5nIHRoZSBvbGQgb25lLlwiKSxcbiAgICBUT09fU01BTEw6IChyZXEpID0+IHJlcS5nZXR0ZXh0KFwiVGhlIGltYWdlIGlzIHRvbyBzbWFsbCB0byB3b3JrIHdpdGggXCIgK1xuICAgICAgICBcInRoZSBpbWFnZSBzaW1pbGFyaXR5IGFsZ29yaXRobS4gSXQgbXVzdCBiZSBhdCBsZWFzdCAxNTBweCBvbiBcIiArXG4gICAgICAgIFwiZWFjaCBzaWRlLlwiKSxcbiAgICBFUlJPUl9TQVZJTkc6IChyZXEpID0+IHJlcS5nZXR0ZXh0KFwiRXJyb3Igc2F2aW5nIGltYWdlLlwiKSxcbn07XG5cbmNvbnN0IEltYWdlSW1wb3J0ID0gbmV3IGRiLnNjaGVtYShPYmplY3QuYXNzaWduKHt9LCBJbXBvcnQuc2NoZW1hLCB7XG4gICAgLy8gVGhlIGxvY2F0aW9uIG9mIHRoZSB1cGxvYWRlZCB6aXAgZmlsZVxuICAgIC8vICh0ZW1wb3JhcnksIGRlbGV0ZWQgYWZ0ZXIgcHJvY2Vzc2luZylcbiAgICB6aXBGaWxlOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgfSxcblxuICAgIC8vIFRoZSBuYW1lIG9mIHRoZSBvcmlnaW5hbCBmaWxlIChlLmcuIGBmb28uemlwYClcbiAgICBmaWxlTmFtZToge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIH0sXG59KSk7XG5cbk9iamVjdC5hc3NpZ24oSW1hZ2VJbXBvcnQubWV0aG9kcywgSW1wb3J0Lm1ldGhvZHMsIHtcbiAgICBnZXRVUkwobGFuZykge1xuICAgICAgICByZXR1cm4gdXJscy5nZW4obGFuZyxcbiAgICAgICAgICAgIGAvJHt0aGlzLmdldFNvdXJjZSgpLnR5cGV9L3NvdXJjZWAgK1xuICAgICAgICAgICAgYC8ke3RoaXMuc291cmNlfS9hZG1pbj9pbWFnZXM9JHt0aGlzLl9pZH1gKTtcbiAgICB9LFxuXG4gICAgZ2V0RXJyb3IocmVxKSB7XG4gICAgICAgIHJldHVybiBtb2RlbHMoXCJJbWFnZUltcG9ydFwiKS5nZXRFcnJvcihyZXEsIHRoaXMuZXJyb3IpO1xuICAgIH0sXG5cbiAgICBnZXRTdGF0ZXMoKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZXM7XG4gICAgfSxcblxuICAgIHByb2Nlc3NJbWFnZXMoY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3QgemlwRmlsZSA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0odGhpcy56aXBGaWxlKTtcbiAgICAgICAgbGV0IHppcEVycm9yO1xuICAgICAgICBjb25zdCBmaWxlcyA9IFtdO1xuICAgICAgICBjb25zdCBleHRyYWN0RGlyID0gcGF0aC5qb2luKG9zLnRtcGRpcigpLFxuICAgICAgICAgICAgKG5ldyBEYXRlKS5nZXRUaW1lKCkudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgZnMubWtkaXIoZXh0cmFjdERpciwgKCkgPT4ge1xuICAgICAgICAgICAgemlwRmlsZS5waXBlKHVuemlwLlBhcnNlKCkpLm9uKFwiZW50cnlcIiwgKGVudHJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBwYXRoLmJhc2VuYW1lKGVudHJ5LnBhdGgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG91dEZpbGVOYW1lID0gcGF0aC5qb2luKGV4dHJhY3REaXIsIGZpbGVOYW1lKTtcblxuICAgICAgICAgICAgICAgIC8vIElnbm9yZSB0aGluZ3MgdGhhdCBhcmVuJ3QgZmlsZXMgKGUuZy4gZGlyZWN0b3JpZXMpXG4gICAgICAgICAgICAgICAgLy8gSWdub3JlIGZpbGVzIHRoYXQgZG9uJ3QgZW5kIHdpdGggLmpwZT9nXG4gICAgICAgICAgICAgICAgLy8gSWdub3JlIGZpbGVzIHRoYXQgc3RhcnQgd2l0aCAnLidcbiAgICAgICAgICAgICAgICBpZiAoZW50cnkudHlwZSAhPT0gXCJGaWxlXCIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICEvLitcXC5qcGU/ZyQvaS50ZXN0KGZpbGVOYW1lKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWUuaW5kZXhPZihcIi5cIikgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVudHJ5LmF1dG9kcmFpbigpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIERvbid0IGF0dGVtcHQgdG8gYWRkIGZpbGVzIHRoYXQgYWxyZWFkeSBleGlzdFxuICAgICAgICAgICAgICAgIGlmIChmaWxlcy5pbmRleE9mKG91dEZpbGVOYW1lKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbnRyeS5hdXRvZHJhaW4oKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgICAgICBpZiAoY29uZmlnLk5PREVfRU5WICE9PSBcInRlc3RcIikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkV4dHJhY3Rpbmc6XCIsIHBhdGguYmFzZW5hbWUob3V0RmlsZU5hbWUpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmaWxlcy5wdXNoKG91dEZpbGVOYW1lKTtcbiAgICAgICAgICAgICAgICBlbnRyeS5waXBlKGZzLmNyZWF0ZVdyaXRlU3RyZWFtKG91dEZpbGVOYW1lKSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm9uKFwiZXJyb3JcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy8gSGFjayBmcm9tIHRoaXMgdGlja2V0IHRvIGZvcmNlIHRoZSBzdHJlYW0gdG8gY2xvc2U6XG4gICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2dsZWJkbWl0cmlldy9ub2RlLXVuemlwLTIvaXNzdWVzLzhcbiAgICAgICAgICAgICAgICB0aGlzLl9zdHJlYW1FbmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0cmVhbUZpbmlzaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgemlwRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5vbihcImNsb3NlXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoemlwRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcihcIkVSUk9SX1JFQURJTkdfWklQXCIpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZmlsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IoXCJaSVBfRklMRV9FTVBUWVwiKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSW1wb3J0IGFsbCBvZiB0aGUgZmlsZXMgYXMgaW1hZ2VzXG4gICAgICAgICAgICAgICAgYXN5bmMuZWFjaExpbWl0KGZpbGVzLCAxLCAoZmlsZSwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRSZXN1bHQoZmlsZSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIH0sIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTaW1pbGFyaXR5U3RhdGUoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzZXRTaW1pbGFyaXR5U3RhdGUoY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3QgSW1hZ2UgPSBtb2RlbHMoXCJJbWFnZVwiKTtcbiAgICAgICAgSW1hZ2UucXVldWVCYXRjaFNpbWlsYXJpdHlVcGRhdGUodGhpcy5faWQsIGNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgYWRkUmVzdWx0KGZpbGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICBpZiAoY29uZmlnLk5PREVfRU5WICE9PSBcInRlc3RcIikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBZGRpbmcgSW1hZ2U6XCIsIHBhdGguYmFzZW5hbWUoZmlsZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbW9kZWxzKFwiSW1hZ2VcIikuZnJvbUZpbGUodGhpcywgZmlsZSwgKGVyciwgaW1hZ2UsIHdhcm5pbmdzKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmaWxlTmFtZSA9IHBhdGguYmFzZW5hbWUoZmlsZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICBfaWQ6IGZpbGVOYW1lLFxuICAgICAgICAgICAgICAgIGZpbGVOYW1lLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5lcnJvciA9IGVyci5tZXNzYWdlO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdC53YXJuaW5ncyA9IHdhcm5pbmdzO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5tb2RlbCA9IGltYWdlLl9pZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQWRkIHRoZSByZXN1bHRcbiAgICAgICAgICAgIHRoaXMucmVzdWx0cy5wdXNoKHJlc3VsdCk7XG5cbiAgICAgICAgICAgIGlmIChpbWFnZSkge1xuICAgICAgICAgICAgICAgIGltYWdlLnNhdmUoKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpbWFnZS5saW5rVG9SZWNvcmRzKCgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNhdmUoY2FsbGJhY2spKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGdldEZpbHRlcmVkUmVzdWx0cygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG1vZGVsczogdGhpcy5yZXN1bHRzLmZpbHRlcigocmVzdWx0KSA9PiByZXN1bHQubW9kZWwpLFxuICAgICAgICAgICAgZXJyb3JzOiB0aGlzLnJlc3VsdHMuZmlsdGVyKChyZXN1bHQpID0+IHJlc3VsdC5lcnJvciksXG4gICAgICAgICAgICB3YXJuaW5nczogdGhpcy5yZXN1bHRzXG4gICAgICAgICAgICAgICAgLmZpbHRlcigocmVzdWx0KSA9PiAocmVzdWx0Lndhcm5pbmdzIHx8IFtdKS5sZW5ndGggIT09IDApLFxuICAgICAgICB9O1xuICAgIH0sXG59KTtcblxuT2JqZWN0LmFzc2lnbihJbWFnZUltcG9ydC5zdGF0aWNzLCBJbXBvcnQuc3RhdGljcywge1xuICAgIGZyb21GaWxlKGZpbGVOYW1lLCBzb3VyY2UpIHtcbiAgICAgICAgY29uc3QgSW1hZ2VJbXBvcnQgPSBtb2RlbHMoXCJJbWFnZUltcG9ydFwiKTtcbiAgICAgICAgcmV0dXJuIG5ldyBJbWFnZUltcG9ydCh7c291cmNlLCBmaWxlTmFtZX0pO1xuICAgIH0sXG5cbiAgICBnZXRFcnJvcihyZXEsIGVycm9yKSB7XG4gICAgICAgIGNvbnN0IG1zZyA9IGVycm9yc1tlcnJvcl07XG4gICAgICAgIHJldHVybiBtc2cgPyBtc2cocmVxKSA6IGVycm9yO1xuICAgIH0sXG59KTtcblxuSW1hZ2VJbXBvcnQucHJlKFwidmFsaWRhdGVcIiwgZnVuY3Rpb24obmV4dCkge1xuICAgIC8vIENyZWF0ZSB0aGUgSUQgaWYgb25lIGhhc24ndCBiZWVuIHNldCBiZWZvcmVcbiAgICBpZiAoIXRoaXMuX2lkKSB7XG4gICAgICAgIHRoaXMuX2lkID0gYCR7dGhpcy5zb3VyY2V9LyR7RGF0ZS5ub3coKX1gO1xuICAgIH1cblxuICAgIG5leHQoKTtcbn0pO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuSW1hZ2VJbXBvcnQucHJlKFwic2F2ZVwiLCBmdW5jdGlvbihuZXh0KSB7XG4gICAgLy8gQWx3YXlzIHVwZGF0ZWQgdGhlIG1vZGlmaWVkIHRpbWUgb24gZXZlcnkgc2F2ZVxuICAgIHRoaXMubW9kaWZpZWQgPSBuZXcgRGF0ZSgpO1xuXG4gICAgbmV4dCgpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSW1hZ2VJbXBvcnQ7XG4iXX0=