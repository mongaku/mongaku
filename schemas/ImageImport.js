"use strict";

const os = require("os");
const fs = require("fs");
const path = require("path");

const async = require("async");
const unzip = require("unzip2");

const models = require("../lib/models");
const urls = require("../lib/urls");
const config = require("../lib/config");

const Import = require("./Import");

const states = [
    {
        id: "started",
        name: (req) => req.gettext("Awaiting processing..."),
        advance(batch, callback) {
            batch.processImages(callback);
        },
    },
    {
        id: "process.started",
        name: (req) => req.gettext("Processing..."),
    },
    {
        id: "process.completed",
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
    ERROR_READING_ZIP: (req) => req.gettext("Error opening zip file."),
    ZIP_FILE_EMPTY: (req) => req.gettext("Zip file has no images in it."),
    MALFORMED_IMAGE: (req) => req.gettext("There was an error processing " +
        "the image. Perhaps it is malformed in some way."),
    EMPTY_IMAGE: (req) => req.gettext("The image is empty."),
    NEW_VERSION: (req) => req.gettext("A new version of the image was " +
        "uploaded, replacing the old one."),
    TOO_SMALL: (req) => req.gettext("The image is too small to work with " +
        "the image similarity algorithm. It must be at least 150px on " +
        "each side."),
    ERROR_SAVING: (req) => req.gettext("Error saving image."),
};

const ImageImport = Import.extend({
    // The location of the uploaded zip file
    // (temporary, deleted after processing)
    zipFile: {
        type: String,
        required: true,
    },

    // The name of the original file (e.g. `foo.zip`)
    fileName: {
        type: String,
        required: true,
    },
});

Object.assign(ImageImport.methods, {
    getURL(lang) {
        return urls.gen(lang,
            `/source/${this.source}/admin?images=${this._id}`);
    },

    getError(req) {
        return models("ImageImport").getError(req, this.error);
    },

    getStates() {
        return states;
    },

    processImages(callback) {
        const zipFile = fs.createReadStream(this.zipFile);
        let zipError;
        const files = [];
        const extractDir = path.join(os.tmpdir(),
            (new Date).getTime().toString());

        fs.mkdir(extractDir, () => {
            zipFile.pipe(unzip.Parse()).on("entry", (entry) => {
                const fileName = path.basename(entry.path);
                const outFileName = path.join(extractDir, fileName);

                // Ignore things that aren't files (e.g. directories)
                // Ignore files that don't end with .jpe?g
                // Ignore files that start with '.'
                if (entry.type !== "File" ||
                        !/.+\.jpe?g$/i.test(fileName) ||
                        fileName.indexOf(".") === 0) {
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
            })
            .on("error", function() {
                // Hack from this ticket to force the stream to close:
                // https://github.com/glebdmitriew/node-unzip-2/issues/8
                this._streamEnd = true;
                this._streamFinish = true;
                zipError = true;
            })
            .on("close", () => {
                if (zipError) {
                    return callback(new Error("ERROR_READING_ZIP"));
                }

                if (files.length === 0) {
                    return callback(new Error("ZIP_FILE_EMPTY"));
                }

                // Import all of the files as images
                async.eachLimit(files, 1, (file, callback) => {
                    this.addResult(file, callback);
                }, (err) => {
                    /* istanbul ignore if */
                    if (err) {
                        return callback(err);
                    }

                    this.setSimilarityState(callback);
                });
            });
        });
    },

    setSimilarityState(callback) {
        const Image = models("Image");

        Image.update(
            {batch: this._id},
            {needsSimilarIndex: true},
            {multi: true},
            (err) => {
                /* istanbul ignore if */
                if (err) {
                    return callback(err);
                }

                Image.update(
                    {batch: {$ne: this._id}},
                    {needsSimilarUpdate: true},
                    {multi: true},
                    callback
                );
            }
        );
    },

    addResult(file, callback) {
        /* istanbul ignore if */
        if (config.NODE_ENV !== "test") {
            console.log("Adding Image:", path.basename(file));
        }

        models("Image").fromFile(this, file, (err, image, warnings) => {
            const fileName = path.basename(file);

            const result = {
                _id: fileName,
                fileName,
            };

            if (err) {
                result.error = err.message;

            } else {
                result.warnings = warnings;
                result.model = image._id;
            }

            // Add the result
            this.results.push(result);

            if (image) {
                image.save((err) => {
                    /* istanbul ignore if */
                    if (err) {
                        return callback(err);
                    }

                    this.save(callback);
                });
            } else {
                this.save(callback);
            }
        });
    },

    getFilteredResults() {
        return {
            models: this.results.filter((result) => result.model),
            errors: this.results.filter((result) => result.error),
            warnings: this.results
                .filter((result) => (result.warnings || []).length !== 0),
        };
    },
});

Object.assign(ImageImport.statics, {
    fromFile(fileName, source) {
        const ImageImport = models("ImageImport");
        return new ImageImport({source, fileName});
    },

    getError(req, error) {
        const msg = errors[error];
        return msg ? msg(req) : error;
    },
});

module.exports = ImageImport;
