const path = require("path");

const async = require("async");

const db = require("../lib/db");
const models = require("../lib/models");
const similar = require("../lib/similar");
const config = require("../lib/config");

const Image = require("./Image");

const uploadName = "uploads";

const UploadImage = new db.schema({
    // An ID for the image in the form: SOURCE/IMAGENAME
    _id: String,

    // The date that this item was created
    created: {
        type: Date,
        default: Date.now,
    },

    // The date that this item was updated
    modified: {
        type: Date,
    },

    // Source is always set to "uploads"
    source: {
        type: String,
        default: uploadName,
        required: true,
    },

    // The name of the original file (e.g. `foo.jpg`)
    fileName: {
        type: String,
        required: true,
    },

    // The hashed contents of the image
    hash: {
        type: String,
        required: true,
    },

    // The width of the image
    width: {
        type: Number,
        required: true,
        min: 1,
    },

    // The height of the image
    height: {
        type: Number,
        required: true,
        min: 1,
    },

    // Similar images (as determined by image similarity)
    similarImages: [
        {
            // The ID of the visually similar image
            _id: {
                type: String,
                required: true,
            },

            // The similarity score between the images
            score: {
                type: Number,
                required: true,
                min: 1,
            },
        },
    ],
});

const getDirBase = function() {
    return path.resolve(config.BASE_DATA_DIR, uploadName);
};

UploadImage.methods = Object.assign({}, Image.methods, {
    getFilePath() {
        return path.resolve(getDirBase(), `images/${this.hash}.jpg`);
    },

    // We don't save the uploaded files in the index so we override this
    // method to use `fileSimilar` to re-query every time.
    updateSimilarity(callback) {
        const Image = models("Image");

        const file = this.getFilePath();

        similar.fileSimilar(file, (err, matches) => {
            /* istanbul ignore if */
            if (err) {
                return callback(err);
            }

            async.mapLimit(
                matches,
                1,
                (match, callback) => {
                    // Skip matches for the image itself
                    if (match.id === this.hash) {
                        return callback();
                    }

                    Image.findOne(
                        {
                            hash: match.id,
                        },
                        (err, image) => {
                            if (err || !image) {
                                return callback();
                            }

                            callback(null, {
                                _id: image._id,
                                score: match.score,
                            });
                        },
                    );
                },
                (err, matches) => {
                    this.similarImages = matches.filter(match => match);
                    callback();
                },
            );
        });
    },
});

UploadImage.statics = Object.assign({}, Image.statics, {
    fromFile(file, callback) {
        const UploadImage = models("UploadImage");

        const sourceDir = getDirBase();

        this.processImage(file, sourceDir, (err, hash) => {
            if (err) {
                return callback(new Error("MALFORMED_IMAGE"));
            }

            this.getSize(file, (err, size) => {
                /* istanbul ignore if */
                if (err) {
                    return callback(new Error("MALFORMED_IMAGE"));
                }

                const width = size.width;
                const height = size.height;

                if (width <= 1 || height <= 1) {
                    return callback(new Error("EMPTY_IMAGE"));
                }

                if (width < 150 || height < 150) {
                    return callback(new Error("TOO_SMALL"));
                }

                const fileName = `${hash}.jpg`;
                const _id = `${uploadName}/${fileName}`;

                this.findById(_id, (err, image) => {
                    /* istanbul ignore if */
                    if (err) {
                        return callback(new Error("ERROR_RETRIEVING"));
                    }

                    if (image) {
                        return callback(null, image);
                    }

                    const model = new UploadImage({
                        _id,
                        fileName,
                        hash,
                        width,
                        height,
                    });

                    model.validate(err => {
                        /* istanbul ignore if */
                        if (err) {
                            return callback(new Error("ERROR_SAVING"));
                        }

                        callback(null, model);
                    });
                });
            });
        });
    },
});

module.exports = UploadImage;
