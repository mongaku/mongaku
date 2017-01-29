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