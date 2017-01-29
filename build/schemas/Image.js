"use strict";

var fs = require("fs");
var path = require("path");

var farmhash = require("farmhash");
var imageinfo = require("imageinfo");
var gm = require("gm");
var async = require("async");
var versioner = require("mongoose-version");

var record = require("../lib/record");
var models = require("../lib/models");
var urls = require("../lib/urls");
var db = require("../lib/db");
var similar = require("../lib/similar");
var config = require("../lib/config");
var options = require("../lib/options");

// Add the ability to provide an explicit bath to the GM binary
/* istanbul ignore if */
if (config.GM_PATH) {
    gm = gm.subClass({ appPath: config.GM_PATH });
}

var Image = new db.schema({
    // An ID for the image in the form: SOURCE/IMAGENAME
    _id: String,

    // The date that this item was created
    created: {
        type: Date,
        default: Date.now
    },

    // The date that this item was updated
    modified: {
        type: Date
    },

    // The most recent batch in which the image was uploaded
    // NOTE(jeresig): This is not required as the image could have
    // been uploaded for use in a search.
    batch: {
        type: String,
        ref: "ImageImport"
    },

    // The source that the image is associated with
    source: {
        type: String,
        required: true
    },

    // The name of the original file (e.g. `foo.jpg`)
    fileName: {
        type: String,
        required: true
    },

    // Full URL of where the image came.
    url: String,

    // The hashed contents of the image
    hash: {
        type: String,
        required: true
    },

    // The width of the image
    width: {
        type: Number,
        required: true,
        min: 1
    },

    // The height of the image
    height: {
        type: Number,
        required: true,
        min: 1
    },

    // Keep track of if the image needs to index its image similarity
    needsSimilarIndex: {
        type: Boolean,
        default: false
    },

    // Keep track of if the image needs to update its image similarity
    needsSimilarUpdate: {
        type: Boolean,
        default: false
    },

    // Similar images (as determined by image similarity)
    similarImages: [{
        // The ID of the visually similar image
        _id: {
            type: String,
            required: true
        },

        // The similarity score between the images
        score: {
            type: Number,
            required: true,
            min: 1
        }
    }]
});

Image.methods = {
    getFilePath: function getFilePath() {
        return path.resolve(this.getSource().getDirBase(), "images/" + this.hash + ".jpg");
    },
    getOriginalURL: function getOriginalURL() {
        return urls.genData("/" + this.source + "/images/" + this.hash + ".jpg");
    },
    getScaledURL: function getScaledURL() {
        return urls.genData("/" + this.source + "/scaled/" + this.hash + ".jpg");
    },
    getThumbURL: function getThumbURL() {
        return urls.genData("/" + this.source + "/thumbs/" + this.hash + ".jpg");
    },
    getSource: function getSource() {
        return models("Source").getSource(this.source);
    },
    relatedRecords: function relatedRecords(callback) {
        var _this = this;

        async.map(Object.keys(options.types), function (type, callback) {
            record(type).find({ images: _this._id }, callback);
        }, function (err, recordsList) {
            if (err) {
                return callback(err);
            }

            callback(null, recordsList.reduce(function (all, records) {
                return all.concat(records);
            }));
        });
    },
    canIndex: function canIndex() {
        return this.width >= 150 && this.height >= 150;
    },
    updateSimilarity: function updateSimilarity(callback) {
        var _this2 = this;

        // Skip small images
        if (!this.canIndex()) {
            return process.nextTick(callback);
        }

        similar.similar(this.hash, function (err, matches) {
            if (err || !matches) {
                return callback(err);
            }

            async.mapLimit(matches, 1, function (match, callback) {
                // Skip matches for the image itself
                if (match.id === _this2.hash) {
                    return callback();
                }

                models("Image").findOne({
                    hash: match.id
                }, function (err, image) {
                    if (err || !image) {
                        return callback();
                    }

                    callback(null, {
                        _id: image._id,
                        score: match.score
                    });
                });
            }, function (err, matches) {
                _this2.similarImages = matches.filter(function (match) {
                    return match;
                });
                callback();
            });
        });
    },
    indexSimilarity: function indexSimilarity(callback) {
        var _this3 = this;

        similar.idIndexed(this.hash, function (err, indexed) {
            /* istanbul ignore if */
            if (err) {
                return callback(err);
            } else if (indexed) {
                return callback(null, true);
            }

            var file = _this3.getFilePath();

            similar.add(file, _this3.hash, function (err) {
                // Ignore small images, we just won't index them
                /* istanbul ignore if */
                if (err && err.type !== "IMAGE_SIZE_TOO_SMALL") {
                    return callback(err);
                } else if (err) {
                    return callback();
                }

                return callback(null, true);
            });
        });
    },
    updateRelatedRecords: function updateRelatedRecords(callback) {
        this.relatedRecords(function (err, records) {
            /* istanbul ignore if */
            if (err) {
                return callback(err);
            }

            async.eachLimit(records, 1, function (record, callback) {
                record.updateSimilarity(function (err) {
                    /* istanbul ignore if */
                    if (err) {
                        return callback(err);
                    }

                    record.save(callback);
                });
            }, callback);
        });
    },
    linkToRecords: function linkToRecords(callback) {
        var imageId = this._id;

        async.eachSeries(Object.keys(options.types), function (type, callback) {
            record(type).find({ missingImages: imageId }, function (err, records) {
                async.eachLimit(records, 4, function (record, callback) {
                    record.images.push(imageId);
                    record.missingImages.remove(imageId);
                    record.save(callback);
                }, callback);
            });
        }, callback);
    }
};

Image.statics = {
    fromFile: function fromFile(batch, file, callback) {
        var _this4 = this;

        var Image = models("Image");
        var Source = models("Source");

        var filePath = file.path || file;
        var fileName = file.name || path.basename(filePath);
        var source = batch.source;
        var _id = source + "/" + fileName;
        var sourceDir = Source.getSource(source).getDirBase();
        var warnings = [];

        this.findById(_id, function (err, image) {
            /* istanbul ignore if */
            if (err) {
                return callback(new Error("ERROR_RETRIEVING"));
            }

            var creating = !image;

            _this4.processImage(filePath, sourceDir, function (err, hash) {
                if (err) {
                    return callback(new Error("MALFORMED_IMAGE"));
                }

                // The same image was uploaded, we can just skip the rest
                if (!creating && hash === image.hash) {
                    return callback(null, image, warnings);
                }

                _this4.getSize(filePath, function (err, size) {
                    /* istanbul ignore if */
                    if (err) {
                        return callback(new Error("MALFORMED_IMAGE"));
                    }

                    var width = size.width;
                    var height = size.height;

                    if (width <= 1 || height <= 1) {
                        return callback(new Error("EMPTY_IMAGE"));
                    }

                    var data = {
                        _id: _id,
                        batch: batch._id,
                        source: source,
                        fileName: fileName,
                        hash: hash,
                        width: width,
                        height: height
                    };

                    var model = image;

                    if (creating) {
                        model = new Image(data);
                    } else {
                        warnings.push("NEW_VERSION");
                        model.set(data);
                    }

                    if (!model.canIndex()) {
                        warnings.push("TOO_SMALL");
                    }

                    model.validate(function (err) {
                        /* istanbul ignore if */
                        if (err) {
                            return callback(new Error("ERROR_SAVING"));
                        }

                        callback(null, model, warnings);
                    });
                });
            });
        });
    },
    processImage: function processImage(sourceFile, baseDir, callback) {
        return images.processImage(sourceFile, baseDir, callback);
    },
    getSize: function getSize(fileName, callback) {
        return images.getSize(fileName, callback);
    },
    indexSimilarity: function indexSimilarity(callback) {
        models("Image").findOne({
            needsSimilarIndex: true
        }, function (err, image) {
            if (err || !image) {
                return callback(err);
            }

            console.log("Indexing Similarity", image._id);

            image.indexSimilarity(function (err) {
                /* istanbul ignore if */
                if (err) {
                    console.error(err);
                    return callback(err);
                }

                image.needsSimilarIndex = false;
                image.needsSimilarUpdate = true;
                image.save(function (err) {
                    return callback(err, true);
                });
            });
        });
    },
    updateSimilarity: function updateSimilarity(callback) {
        models("Image").findOne({
            needsSimilarUpdate: true
        }, function (err, image) {
            if (err || !image) {
                return callback(err);
            }

            console.log("Updating Similarity", image._id);

            image.updateSimilarity(function (err) {
                /* istanbul ignore if */
                if (err) {
                    console.error(err);
                    return callback(err);
                }

                image.needsSimilarUpdate = false;
                image.save(function (err) {
                    /* istanbul ignore if */
                    if (err) {
                        return callback(err);
                    }

                    image.updateRelatedRecords(function (err) {
                        /* istanbul ignore if */
                        if (err) {
                            return callback(err);
                        }

                        callback(null, true);
                    });
                });
            });
        });
    },
    queueBatchSimilarityUpdate: function queueBatchSimilarityUpdate(batchID, callback) {
        var _this5 = this;

        this.update({ batch: batchID }, { needsSimilarIndex: true }, { multi: true }, function (err) {
            /* istanbul ignore if */
            if (err) {
                return callback(err);
            }

            _this5.update({ batch: { $ne: batchID } }, { needsSimilarUpdate: true }, { multi: true }, callback);
        });
    }
};

/* istanbul ignore next */
Image.pre("save", function (next) {
    // Always updated the modified time on every save
    this.modified = new Date();
    next();
});

var images = {
    convert: function convert(inputStream, outputFile, config, callback) {
        var stream = gm(inputStream).autoOrient();

        if (config) {
            stream = config(stream);
        }

        stream.stream("jpg").on("error", function (err) {
            callback(new Error("Error converting file to JPEG: " + err));
        }).pipe(fs.createWriteStream(outputFile)).on("finish", function () {
            callback(null, outputFile);
        });
    },
    parseSize: function parseSize(size) {
        var parts = size.split("x");

        return {
            width: parseFloat(parts[0]),
            height: parseFloat(parts[0])
        };
    },
    getSize: function getSize(fileName, callback) {
        fs.readFile(fileName, function (err, data) {
            /* istanbul ignore if */
            if (err) {
                return callback(err);
            }

            var info = imageinfo(data);

            callback(null, {
                width: info.width,
                height: info.height
            });
        });
    },
    makeThumb: function makeThumb(baseDir, fileName, callback) {
        var imageFile = path.resolve(baseDir, "images", fileName);
        var thumbFile = path.resolve(baseDir, "thumbs", fileName);
        var size = this.parseSize(options.imageThumbSize);

        this.convert(fs.createReadStream(imageFile), thumbFile, function (img) {
            return img.resize(size.width, size.height);
        }, callback);
    },
    makeScaled: function makeScaled(baseDir, fileName, callback) {
        var imageFile = path.resolve(baseDir, "images", fileName);
        var scaledFile = path.resolve(baseDir, "scaled", fileName);
        var scaled = this.parseSize(options.imageScaledSize);

        this.convert(fs.createReadStream(imageFile), scaledFile, function (img) {
            return img.resize(scaled.width, scaled.height, ">");
        }, callback);
    },
    makeThumbs: function makeThumbs(fullPath, callback) {
        var _this6 = this;

        var baseDir = path.resolve(path.dirname(fullPath), "..");
        var fileName = path.basename(fullPath);

        async.series([function (callback) {
            return _this6.makeThumb(baseDir, fileName, callback);
        }, function (callback) {
            return _this6.makeScaled(baseDir, fileName, callback);
        }], function (err) {
            /* istanbul ignore if */
            if (err) {
                return callback(new Error("Error converting thumbnails: " + err));
            }

            callback(null, [path.resolve(baseDir, "thumbs", fileName), path.resolve(baseDir, "scaled", fileName)]);
        });
    },
    hashImage: function hashImage(sourceFile, callback) {
        fs.readFile(sourceFile, function (err, buffer) {
            /* istanbul ignore if */
            if (err) {
                return callback(err);
            }

            callback(null, farmhash.hash32(buffer).toString());
        });
    },
    processImage: function processImage(sourceFile, baseDir, callback) {
        var _this7 = this;

        var hash = void 0;
        var imageFile = void 0;
        var existsError = new Error("Already exists.");

        async.series([
        // Generate a hash for the incoming image file
        function (callback) {
            _this7.hashImage(sourceFile, function (err, imageHash) {
                /* istanbul ignore if */
                if (err) {
                    return callback(err);
                }

                hash = imageHash;
                imageFile = path.resolve(baseDir, "images", hash + ".jpg");

                // Avoid doing the rest of this if it already exists
                fs.stat(imageFile, function (err, stats) {
                    callback(stats ? existsError : null);
                });
            });
        },

        // Convert the image into our standard format
        function (callback) {
            return _this7.convert(fs.createReadStream(sourceFile), imageFile, null, callback);
        },

        // Generate thumbnails based on the image
        function (callback) {
            return _this7.makeThumbs(imageFile, callback);
        }], function (err) {
            callback(err === existsError ? null : err, hash);
        });
    }
};

Image.plugin(versioner, {
    collection: "image_versions",
    suppressVersionIncrement: false,
    suppressRefIdIndex: false,
    refIdType: String,
    removeVersions: false,
    strategy: "collection",
    mongoose: db.mongoose
});

module.exports = Image;