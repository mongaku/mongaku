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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL0ltYWdlLmpzIl0sIm5hbWVzIjpbImZzIiwicmVxdWlyZSIsInBhdGgiLCJmYXJtaGFzaCIsImltYWdlaW5mbyIsImdtIiwiYXN5bmMiLCJ2ZXJzaW9uZXIiLCJyZWNvcmQiLCJtb2RlbHMiLCJ1cmxzIiwiZGIiLCJzaW1pbGFyIiwiY29uZmlnIiwib3B0aW9ucyIsIkdNX1BBVEgiLCJzdWJDbGFzcyIsImFwcFBhdGgiLCJJbWFnZSIsInNjaGVtYSIsIl9pZCIsIlN0cmluZyIsImNyZWF0ZWQiLCJ0eXBlIiwiRGF0ZSIsImRlZmF1bHQiLCJub3ciLCJtb2RpZmllZCIsImJhdGNoIiwicmVmIiwic291cmNlIiwicmVxdWlyZWQiLCJmaWxlTmFtZSIsInVybCIsImhhc2giLCJ3aWR0aCIsIk51bWJlciIsIm1pbiIsImhlaWdodCIsIm5lZWRzU2ltaWxhckluZGV4IiwiQm9vbGVhbiIsIm5lZWRzU2ltaWxhclVwZGF0ZSIsInNpbWlsYXJJbWFnZXMiLCJzY29yZSIsIm1ldGhvZHMiLCJnZXRGaWxlUGF0aCIsInJlc29sdmUiLCJnZXRTb3VyY2UiLCJnZXREaXJCYXNlIiwiZ2V0T3JpZ2luYWxVUkwiLCJnZW5EYXRhIiwiZ2V0U2NhbGVkVVJMIiwiZ2V0VGh1bWJVUkwiLCJyZWxhdGVkUmVjb3JkcyIsImNhbGxiYWNrIiwibWFwIiwiT2JqZWN0Iiwia2V5cyIsInR5cGVzIiwiZmluZCIsImltYWdlcyIsImVyciIsInJlY29yZHNMaXN0IiwicmVkdWNlIiwiYWxsIiwicmVjb3JkcyIsImNvbmNhdCIsImNhbkluZGV4IiwidXBkYXRlU2ltaWxhcml0eSIsInByb2Nlc3MiLCJuZXh0VGljayIsIm1hdGNoZXMiLCJtYXBMaW1pdCIsIm1hdGNoIiwiaWQiLCJmaW5kT25lIiwiaW1hZ2UiLCJmaWx0ZXIiLCJpbmRleFNpbWlsYXJpdHkiLCJpZEluZGV4ZWQiLCJpbmRleGVkIiwiZmlsZSIsImFkZCIsInVwZGF0ZVJlbGF0ZWRSZWNvcmRzIiwiZWFjaExpbWl0Iiwic2F2ZSIsImxpbmtUb1JlY29yZHMiLCJpbWFnZUlkIiwiZWFjaFNlcmllcyIsIm1pc3NpbmdJbWFnZXMiLCJwdXNoIiwicmVtb3ZlIiwic3RhdGljcyIsImZyb21GaWxlIiwiU291cmNlIiwiZmlsZVBhdGgiLCJuYW1lIiwiYmFzZW5hbWUiLCJzb3VyY2VEaXIiLCJ3YXJuaW5ncyIsImZpbmRCeUlkIiwiRXJyb3IiLCJjcmVhdGluZyIsInByb2Nlc3NJbWFnZSIsImdldFNpemUiLCJzaXplIiwiZGF0YSIsIm1vZGVsIiwic2V0IiwidmFsaWRhdGUiLCJzb3VyY2VGaWxlIiwiYmFzZURpciIsImNvbnNvbGUiLCJsb2ciLCJlcnJvciIsInF1ZXVlQmF0Y2hTaW1pbGFyaXR5VXBkYXRlIiwiYmF0Y2hJRCIsInVwZGF0ZSIsIm11bHRpIiwiJG5lIiwicHJlIiwibmV4dCIsImNvbnZlcnQiLCJpbnB1dFN0cmVhbSIsIm91dHB1dEZpbGUiLCJzdHJlYW0iLCJhdXRvT3JpZW50Iiwib24iLCJwaXBlIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJwYXJzZVNpemUiLCJwYXJ0cyIsInNwbGl0IiwicGFyc2VGbG9hdCIsInJlYWRGaWxlIiwiaW5mbyIsIm1ha2VUaHVtYiIsImltYWdlRmlsZSIsInRodW1iRmlsZSIsImltYWdlVGh1bWJTaXplIiwiY3JlYXRlUmVhZFN0cmVhbSIsImltZyIsInJlc2l6ZSIsIm1ha2VTY2FsZWQiLCJzY2FsZWRGaWxlIiwic2NhbGVkIiwiaW1hZ2VTY2FsZWRTaXplIiwibWFrZVRodW1icyIsImZ1bGxQYXRoIiwiZGlybmFtZSIsInNlcmllcyIsImhhc2hJbWFnZSIsImJ1ZmZlciIsImhhc2gzMiIsInRvU3RyaW5nIiwiZXhpc3RzRXJyb3IiLCJpbWFnZUhhc2giLCJzdGF0Iiwic3RhdHMiLCJwbHVnaW4iLCJjb2xsZWN0aW9uIiwic3VwcHJlc3NWZXJzaW9uSW5jcmVtZW50Iiwic3VwcHJlc3NSZWZJZEluZGV4IiwicmVmSWRUeXBlIiwicmVtb3ZlVmVyc2lv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QUNILFNBNUJEO0FBNkJIO0FBbklVLENBQWY7O0FBc0lBaEIsTUFBTTZJLE1BQU4sQ0FBYXhKLFNBQWIsRUFBd0I7QUFDcEJ5SixnQ0FEb0I7QUFFcEJDLDhCQUEwQixLQUZOO0FBR3BCQyx3QkFBb0IsS0FIQTtBQUlwQkMsZUFBVzlJLE1BSlM7QUFLcEIrSSxvQkFBZ0IsS0FMSTtBQU1wQkMsY0FBVSxZQU5VO0FBT3BCQyxjQUFVM0osR0FBRzJKO0FBUE8sQ0FBeEI7O0FBVUFDLE9BQU9DLE9BQVAsR0FBaUJ0SixLQUFqQiIsImZpbGUiOiJJbWFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGZzID0gcmVxdWlyZShcImZzXCIpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuXG5jb25zdCBmYXJtaGFzaCA9IHJlcXVpcmUoXCJmYXJtaGFzaFwiKTtcbmNvbnN0IGltYWdlaW5mbyA9IHJlcXVpcmUoXCJpbWFnZWluZm9cIik7XG5sZXQgZ20gPSByZXF1aXJlKFwiZ21cIik7XG5jb25zdCBhc3luYyA9IHJlcXVpcmUoXCJhc3luY1wiKTtcbmNvbnN0IHZlcnNpb25lciA9IHJlcXVpcmUoXCJtb25nb29zZS12ZXJzaW9uXCIpO1xuXG5jb25zdCByZWNvcmQgPSByZXF1aXJlKFwiLi4vbGliL3JlY29yZFwiKTtcbmNvbnN0IG1vZGVscyA9IHJlcXVpcmUoXCIuLi9saWIvbW9kZWxzXCIpO1xuY29uc3QgdXJscyA9IHJlcXVpcmUoXCIuLi9saWIvdXJsc1wiKTtcbmNvbnN0IGRiID0gcmVxdWlyZShcIi4uL2xpYi9kYlwiKTtcbmNvbnN0IHNpbWlsYXIgPSByZXF1aXJlKFwiLi4vbGliL3NpbWlsYXJcIik7XG5jb25zdCBjb25maWcgPSByZXF1aXJlKFwiLi4vbGliL2NvbmZpZ1wiKTtcbmNvbnN0IG9wdGlvbnMgPSByZXF1aXJlKFwiLi4vbGliL29wdGlvbnNcIik7XG5cbi8vIEFkZCB0aGUgYWJpbGl0eSB0byBwcm92aWRlIGFuIGV4cGxpY2l0IGJhdGggdG8gdGhlIEdNIGJpbmFyeVxuLyogaXN0YW5idWwgaWdub3JlIGlmICovXG5pZiAoY29uZmlnLkdNX1BBVEgpIHtcbiAgICBnbSA9IGdtLnN1YkNsYXNzKHthcHBQYXRoOiBjb25maWcuR01fUEFUSH0pO1xufVxuXG5jb25zdCBJbWFnZSA9IG5ldyBkYi5zY2hlbWEoe1xuICAgIC8vIEFuIElEIGZvciB0aGUgaW1hZ2UgaW4gdGhlIGZvcm06IFNPVVJDRS9JTUFHRU5BTUVcbiAgICBfaWQ6IFN0cmluZyxcblxuICAgIC8vIFRoZSBkYXRlIHRoYXQgdGhpcyBpdGVtIHdhcyBjcmVhdGVkXG4gICAgY3JlYXRlZDoge1xuICAgICAgICB0eXBlOiBEYXRlLFxuICAgICAgICBkZWZhdWx0OiBEYXRlLm5vdyxcbiAgICB9LFxuXG4gICAgLy8gVGhlIGRhdGUgdGhhdCB0aGlzIGl0ZW0gd2FzIHVwZGF0ZWRcbiAgICBtb2RpZmllZDoge1xuICAgICAgICB0eXBlOiBEYXRlLFxuICAgIH0sXG5cbiAgICAvLyBUaGUgbW9zdCByZWNlbnQgYmF0Y2ggaW4gd2hpY2ggdGhlIGltYWdlIHdhcyB1cGxvYWRlZFxuICAgIC8vIE5PVEUoamVyZXNpZyk6IFRoaXMgaXMgbm90IHJlcXVpcmVkIGFzIHRoZSBpbWFnZSBjb3VsZCBoYXZlXG4gICAgLy8gYmVlbiB1cGxvYWRlZCBmb3IgdXNlIGluIGEgc2VhcmNoLlxuICAgIGJhdGNoOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgcmVmOiBcIkltYWdlSW1wb3J0XCIsXG4gICAgfSxcblxuICAgIC8vIFRoZSBzb3VyY2UgdGhhdCB0aGUgaW1hZ2UgaXMgYXNzb2NpYXRlZCB3aXRoXG4gICAgc291cmNlOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgfSxcblxuICAgIC8vIFRoZSBuYW1lIG9mIHRoZSBvcmlnaW5hbCBmaWxlIChlLmcuIGBmb28uanBnYClcbiAgICBmaWxlTmFtZToge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIH0sXG5cbiAgICAvLyBGdWxsIFVSTCBvZiB3aGVyZSB0aGUgaW1hZ2UgY2FtZS5cbiAgICB1cmw6IFN0cmluZyxcblxuICAgIC8vIFRoZSBoYXNoZWQgY29udGVudHMgb2YgdGhlIGltYWdlXG4gICAgaGFzaDoge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIH0sXG5cbiAgICAvLyBUaGUgd2lkdGggb2YgdGhlIGltYWdlXG4gICAgd2lkdGg6IHtcbiAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgbWluOiAxLFxuICAgIH0sXG5cbiAgICAvLyBUaGUgaGVpZ2h0IG9mIHRoZSBpbWFnZVxuICAgIGhlaWdodDoge1xuICAgICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICBtaW46IDEsXG4gICAgfSxcblxuICAgIC8vIEtlZXAgdHJhY2sgb2YgaWYgdGhlIGltYWdlIG5lZWRzIHRvIGluZGV4IGl0cyBpbWFnZSBzaW1pbGFyaXR5XG4gICAgbmVlZHNTaW1pbGFySW5kZXg6IHtcbiAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcblxuICAgIC8vIEtlZXAgdHJhY2sgb2YgaWYgdGhlIGltYWdlIG5lZWRzIHRvIHVwZGF0ZSBpdHMgaW1hZ2Ugc2ltaWxhcml0eVxuICAgIG5lZWRzU2ltaWxhclVwZGF0ZToge1xuICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB9LFxuXG4gICAgLy8gU2ltaWxhciBpbWFnZXMgKGFzIGRldGVybWluZWQgYnkgaW1hZ2Ugc2ltaWxhcml0eSlcbiAgICBzaW1pbGFySW1hZ2VzOiBbe1xuICAgICAgICAvLyBUaGUgSUQgb2YgdGhlIHZpc3VhbGx5IHNpbWlsYXIgaW1hZ2VcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBUaGUgc2ltaWxhcml0eSBzY29yZSBiZXR3ZWVuIHRoZSBpbWFnZXNcbiAgICAgICAgc2NvcmU6IHtcbiAgICAgICAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgbWluOiAxLFxuICAgICAgICB9LFxuICAgIH1dLFxufSk7XG5cbkltYWdlLm1ldGhvZHMgPSB7XG4gICAgZ2V0RmlsZVBhdGgoKSB7XG4gICAgICAgIHJldHVybiBwYXRoLnJlc29sdmUodGhpcy5nZXRTb3VyY2UoKS5nZXREaXJCYXNlKCksXG4gICAgICAgICAgICBgaW1hZ2VzLyR7dGhpcy5oYXNofS5qcGdgKTtcbiAgICB9LFxuXG4gICAgZ2V0T3JpZ2luYWxVUkwoKSB7XG4gICAgICAgIHJldHVybiB1cmxzLmdlbkRhdGEoXG4gICAgICAgICAgICBgLyR7dGhpcy5zb3VyY2V9L2ltYWdlcy8ke3RoaXMuaGFzaH0uanBnYCk7XG4gICAgfSxcblxuICAgIGdldFNjYWxlZFVSTCgpIHtcbiAgICAgICAgcmV0dXJuIHVybHMuZ2VuRGF0YShcbiAgICAgICAgICAgIGAvJHt0aGlzLnNvdXJjZX0vc2NhbGVkLyR7dGhpcy5oYXNofS5qcGdgKTtcbiAgICB9LFxuXG4gICAgZ2V0VGh1bWJVUkwoKSB7XG4gICAgICAgIHJldHVybiB1cmxzLmdlbkRhdGEoXG4gICAgICAgICAgICBgLyR7dGhpcy5zb3VyY2V9L3RodW1icy8ke3RoaXMuaGFzaH0uanBnYCk7XG4gICAgfSxcblxuICAgIGdldFNvdXJjZSgpIHtcbiAgICAgICAgcmV0dXJuIG1vZGVscyhcIlNvdXJjZVwiKS5nZXRTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgIH0sXG5cbiAgICByZWxhdGVkUmVjb3JkcyhjYWxsYmFjaykge1xuICAgICAgICBhc3luYy5tYXAoT2JqZWN0LmtleXMob3B0aW9ucy50eXBlcyksICh0eXBlLCBjYWxsYmFjaykgPT4ge1xuICAgICAgICAgICAgcmVjb3JkKHR5cGUpLmZpbmQoe2ltYWdlczogdGhpcy5faWR9LCBjYWxsYmFjayk7XG4gICAgICAgIH0sIChlcnIsIHJlY29yZHNMaXN0KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlY29yZHNMaXN0LnJlZHVjZShcbiAgICAgICAgICAgICAgICAoYWxsLCByZWNvcmRzKSA9PiBhbGwuY29uY2F0KHJlY29yZHMpKSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjYW5JbmRleCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGggPj0gMTUwICYmIHRoaXMuaGVpZ2h0ID49IDE1MDtcbiAgICB9LFxuXG4gICAgdXBkYXRlU2ltaWxhcml0eShjYWxsYmFjaykge1xuICAgICAgICAvLyBTa2lwIHNtYWxsIGltYWdlc1xuICAgICAgICBpZiAoIXRoaXMuY2FuSW5kZXgoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2soY2FsbGJhY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgc2ltaWxhci5zaW1pbGFyKHRoaXMuaGFzaCwgKGVyciwgbWF0Y2hlcykgPT4ge1xuICAgICAgICAgICAgaWYgKGVyciB8fCAhbWF0Y2hlcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhc3luYy5tYXBMaW1pdChtYXRjaGVzLCAxLCAobWF0Y2gsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gU2tpcCBtYXRjaGVzIGZvciB0aGUgaW1hZ2UgaXRzZWxmXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoLmlkID09PSB0aGlzLmhhc2gpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbW9kZWxzKFwiSW1hZ2VcIikuZmluZE9uZSh7XG4gICAgICAgICAgICAgICAgICAgIGhhc2g6IG1hdGNoLmlkLFxuICAgICAgICAgICAgICAgIH0sIChlcnIsIGltYWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIgfHwgIWltYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogaW1hZ2UuX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcmU6IG1hdGNoLnNjb3JlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIChlcnIsIG1hdGNoZXMpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNpbWlsYXJJbWFnZXMgPSBtYXRjaGVzLmZpbHRlcigobWF0Y2gpID0+IG1hdGNoKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBpbmRleFNpbWlsYXJpdHkoY2FsbGJhY2spIHtcbiAgICAgICAgc2ltaWxhci5pZEluZGV4ZWQodGhpcy5oYXNoLCAoZXJyLCBpbmRleGVkKSA9PiB7XG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5kZXhlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuZ2V0RmlsZVBhdGgoKTtcblxuICAgICAgICAgICAgc2ltaWxhci5hZGQoZmlsZSwgdGhpcy5oYXNoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gSWdub3JlIHNtYWxsIGltYWdlcywgd2UganVzdCB3b24ndCBpbmRleCB0aGVtXG4gICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICAgICAgaWYgKGVyciAmJiBlcnIudHlwZSAhPT0gXCJJTUFHRV9TSVpFX1RPT19TTUFMTFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCB0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgdXBkYXRlUmVsYXRlZFJlY29yZHMoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5yZWxhdGVkUmVjb3JkcygoZXJyLCByZWNvcmRzKSA9PiB7XG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXN5bmMuZWFjaExpbWl0KHJlY29yZHMsIDEsIChyZWNvcmQsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVjb3JkLnVwZGF0ZVNpbWlsYXJpdHkoKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZWNvcmQuc2F2ZShjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCBjYWxsYmFjayk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBsaW5rVG9SZWNvcmRzKGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IGltYWdlSWQgPSB0aGlzLl9pZDtcblxuICAgICAgICBhc3luYy5lYWNoU2VyaWVzKE9iamVjdC5rZXlzKG9wdGlvbnMudHlwZXMpLCAodHlwZSwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgIHJlY29yZCh0eXBlKS5maW5kKHttaXNzaW5nSW1hZ2VzOiBpbWFnZUlkfSwgKGVyciwgcmVjb3JkcykgPT4ge1xuICAgICAgICAgICAgICAgIGFzeW5jLmVhY2hMaW1pdChyZWNvcmRzLCA0LCAocmVjb3JkLCBjYWxsYmFjaykgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWNvcmQuaW1hZ2VzLnB1c2goaW1hZ2VJZCk7XG4gICAgICAgICAgICAgICAgICAgIHJlY29yZC5taXNzaW5nSW1hZ2VzLnJlbW92ZShpbWFnZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkLnNhdmUoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIH0sIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBjYWxsYmFjayk7XG4gICAgfSxcbn07XG5cbkltYWdlLnN0YXRpY3MgPSB7XG4gICAgZnJvbUZpbGUoYmF0Y2gsIGZpbGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IEltYWdlID0gbW9kZWxzKFwiSW1hZ2VcIik7XG4gICAgICAgIGNvbnN0IFNvdXJjZSA9IG1vZGVscyhcIlNvdXJjZVwiKTtcblxuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGZpbGUucGF0aCB8fCBmaWxlO1xuICAgICAgICBjb25zdCBmaWxlTmFtZSA9IGZpbGUubmFtZSB8fCBwYXRoLmJhc2VuYW1lKGZpbGVQYXRoKTtcbiAgICAgICAgY29uc3Qgc291cmNlID0gYmF0Y2guc291cmNlO1xuICAgICAgICBjb25zdCBfaWQgPSBgJHtzb3VyY2V9LyR7ZmlsZU5hbWV9YDtcbiAgICAgICAgY29uc3Qgc291cmNlRGlyID0gU291cmNlLmdldFNvdXJjZShzb3VyY2UpLmdldERpckJhc2UoKTtcbiAgICAgICAgY29uc3Qgd2FybmluZ3MgPSBbXTtcblxuICAgICAgICB0aGlzLmZpbmRCeUlkKF9pZCwgKGVyciwgaW1hZ2UpID0+IHtcbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IoXCJFUlJPUl9SRVRSSUVWSU5HXCIpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgY3JlYXRpbmcgPSAhaW1hZ2U7XG5cbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0ltYWdlKGZpbGVQYXRoLCBzb3VyY2VEaXIsIChlcnIsIGhhc2gpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IoXCJNQUxGT1JNRURfSU1BR0VcIikpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFRoZSBzYW1lIGltYWdlIHdhcyB1cGxvYWRlZCwgd2UgY2FuIGp1c3Qgc2tpcCB0aGUgcmVzdFxuICAgICAgICAgICAgICAgIGlmICghY3JlYXRpbmcgJiYgaGFzaCA9PT0gaW1hZ2UuaGFzaCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgaW1hZ2UsIHdhcm5pbmdzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmdldFNpemUoZmlsZVBhdGgsIChlcnIsIHNpemUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IoXCJNQUxGT1JNRURfSU1BR0VcIikpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgd2lkdGggPSBzaXplLndpZHRoO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBoZWlnaHQgPSBzaXplLmhlaWdodDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAod2lkdGggPD0gMSB8fCBoZWlnaHQgPD0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcihcIkVNUFRZX0lNQUdFXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXRjaDogYmF0Y2guX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNoLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IG1vZGVsID0gaW1hZ2U7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNyZWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbCA9IG5ldyBJbWFnZShkYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2FybmluZ3MucHVzaChcIk5FV19WRVJTSU9OXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwuc2V0KGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFtb2RlbC5jYW5JbmRleCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3YXJuaW5ncy5wdXNoKFwiVE9PX1NNQUxMXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbW9kZWwudmFsaWRhdGUoKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcihcIkVSUk9SX1NBVklOR1wiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIG1vZGVsLCB3YXJuaW5ncyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBwcm9jZXNzSW1hZ2Uoc291cmNlRmlsZSwgYmFzZURpciwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIGltYWdlcy5wcm9jZXNzSW1hZ2Uoc291cmNlRmlsZSwgYmFzZURpciwgY2FsbGJhY2spO1xuICAgIH0sXG5cbiAgICBnZXRTaXplKGZpbGVOYW1lLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gaW1hZ2VzLmdldFNpemUoZmlsZU5hbWUsIGNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgaW5kZXhTaW1pbGFyaXR5KGNhbGxiYWNrKSB7XG4gICAgICAgIG1vZGVscyhcIkltYWdlXCIpLmZpbmRPbmUoe1xuICAgICAgICAgICAgbmVlZHNTaW1pbGFySW5kZXg6IHRydWUsXG4gICAgICAgIH0sIChlcnIsIGltYWdlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyIHx8ICFpbWFnZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkluZGV4aW5nIFNpbWlsYXJpdHlcIiwgaW1hZ2UuX2lkKTtcblxuICAgICAgICAgICAgaW1hZ2UuaW5kZXhTaW1pbGFyaXR5KChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaW1hZ2UubmVlZHNTaW1pbGFySW5kZXggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpbWFnZS5uZWVkc1NpbWlsYXJVcGRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGltYWdlLnNhdmUoKGVycikgPT4gY2FsbGJhY2soZXJyLCB0cnVlKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHVwZGF0ZVNpbWlsYXJpdHkoY2FsbGJhY2spIHtcbiAgICAgICAgbW9kZWxzKFwiSW1hZ2VcIikuZmluZE9uZSh7XG4gICAgICAgICAgICBuZWVkc1NpbWlsYXJVcGRhdGU6IHRydWUsXG4gICAgICAgIH0sIChlcnIsIGltYWdlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyIHx8ICFpbWFnZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVwZGF0aW5nIFNpbWlsYXJpdHlcIiwgaW1hZ2UuX2lkKTtcblxuICAgICAgICAgICAgaW1hZ2UudXBkYXRlU2ltaWxhcml0eSgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGltYWdlLm5lZWRzU2ltaWxhclVwZGF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGltYWdlLnNhdmUoKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpbWFnZS51cGRhdGVSZWxhdGVkUmVjb3JkcygoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBxdWV1ZUJhdGNoU2ltaWxhcml0eVVwZGF0ZShiYXRjaElELCBjYWxsYmFjaykge1xuICAgICAgICB0aGlzLnVwZGF0ZShcbiAgICAgICAgICAgIHtiYXRjaDogYmF0Y2hJRH0sXG4gICAgICAgICAgICB7bmVlZHNTaW1pbGFySW5kZXg6IHRydWV9LFxuICAgICAgICAgICAge211bHRpOiB0cnVlfSxcbiAgICAgICAgICAgIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKFxuICAgICAgICAgICAgICAgICAgICB7YmF0Y2g6IHskbmU6IGJhdGNoSUR9fSxcbiAgICAgICAgICAgICAgICAgICAge25lZWRzU2ltaWxhclVwZGF0ZTogdHJ1ZX0sXG4gICAgICAgICAgICAgICAgICAgIHttdWx0aTogdHJ1ZX0sXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9LFxufTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbkltYWdlLnByZShcInNhdmVcIiwgZnVuY3Rpb24obmV4dCkge1xuICAgIC8vIEFsd2F5cyB1cGRhdGVkIHRoZSBtb2RpZmllZCB0aW1lIG9uIGV2ZXJ5IHNhdmVcbiAgICB0aGlzLm1vZGlmaWVkID0gbmV3IERhdGUoKTtcbiAgICBuZXh0KCk7XG59KTtcblxuY29uc3QgaW1hZ2VzID0ge1xuICAgIGNvbnZlcnQoaW5wdXRTdHJlYW0sIG91dHB1dEZpbGUsIGNvbmZpZywgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IHN0cmVhbSA9IGdtKGlucHV0U3RyZWFtKS5hdXRvT3JpZW50KCk7XG5cbiAgICAgICAgaWYgKGNvbmZpZykge1xuICAgICAgICAgICAgc3RyZWFtID0gY29uZmlnKHN0cmVhbSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdHJlYW1cbiAgICAgICAgICAgIC5zdHJlYW0oXCJqcGdcIilcbiAgICAgICAgICAgIC5vbihcImVycm9yXCIsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIGBFcnJvciBjb252ZXJ0aW5nIGZpbGUgdG8gSlBFRzogJHtlcnJ9YCkpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5waXBlKGZzLmNyZWF0ZVdyaXRlU3RyZWFtKG91dHB1dEZpbGUpKVxuICAgICAgICAgICAgLm9uKFwiZmluaXNoXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBvdXRwdXRGaWxlKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBwYXJzZVNpemUoc2l6ZSkge1xuICAgICAgICBjb25zdCBwYXJ0cyA9IHNpemUuc3BsaXQoXCJ4XCIpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3aWR0aDogcGFyc2VGbG9hdChwYXJ0c1swXSksXG4gICAgICAgICAgICBoZWlnaHQ6IHBhcnNlRmxvYXQocGFydHNbMF0pLFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBnZXRTaXplKGZpbGVOYW1lLCBjYWxsYmFjaykge1xuICAgICAgICBmcy5yZWFkRmlsZShmaWxlTmFtZSwgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGluZm8gPSBpbWFnZWluZm8oZGF0YSk7XG5cbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogaW5mby53aWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGluZm8uaGVpZ2h0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBtYWtlVGh1bWIoYmFzZURpciwgZmlsZU5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IGltYWdlRmlsZSA9IHBhdGgucmVzb2x2ZShiYXNlRGlyLCBcImltYWdlc1wiLCBmaWxlTmFtZSk7XG4gICAgICAgIGNvbnN0IHRodW1iRmlsZSA9IHBhdGgucmVzb2x2ZShiYXNlRGlyLCBcInRodW1ic1wiLCBmaWxlTmFtZSk7XG4gICAgICAgIGNvbnN0IHNpemUgPSB0aGlzLnBhcnNlU2l6ZShvcHRpb25zLmltYWdlVGh1bWJTaXplKTtcblxuICAgICAgICB0aGlzLmNvbnZlcnQoZnMuY3JlYXRlUmVhZFN0cmVhbShpbWFnZUZpbGUpLCB0aHVtYkZpbGUsIChpbWcpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBpbWcucmVzaXplKHNpemUud2lkdGgsIHNpemUuaGVpZ2h0KTtcbiAgICAgICAgfSwgY2FsbGJhY2spO1xuICAgIH0sXG5cbiAgICBtYWtlU2NhbGVkKGJhc2VEaXIsIGZpbGVOYW1lLCBjYWxsYmFjaykge1xuICAgICAgICBjb25zdCBpbWFnZUZpbGUgPSBwYXRoLnJlc29sdmUoYmFzZURpciwgXCJpbWFnZXNcIiwgZmlsZU5hbWUpO1xuICAgICAgICBjb25zdCBzY2FsZWRGaWxlID0gcGF0aC5yZXNvbHZlKGJhc2VEaXIsIFwic2NhbGVkXCIsIGZpbGVOYW1lKTtcbiAgICAgICAgY29uc3Qgc2NhbGVkID0gdGhpcy5wYXJzZVNpemUob3B0aW9ucy5pbWFnZVNjYWxlZFNpemUpO1xuXG4gICAgICAgIHRoaXMuY29udmVydChmcy5jcmVhdGVSZWFkU3RyZWFtKGltYWdlRmlsZSksIHNjYWxlZEZpbGUsIChpbWcpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBpbWcucmVzaXplKHNjYWxlZC53aWR0aCwgc2NhbGVkLmhlaWdodCwgXCI+XCIpO1xuICAgICAgICB9LCBjYWxsYmFjayk7XG4gICAgfSxcblxuICAgIG1ha2VUaHVtYnMoZnVsbFBhdGgsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IGJhc2VEaXIgPSBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKGZ1bGxQYXRoKSwgXCIuLlwiKTtcbiAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBwYXRoLmJhc2VuYW1lKGZ1bGxQYXRoKTtcblxuICAgICAgICBhc3luYy5zZXJpZXMoW1xuICAgICAgICAgICAgKGNhbGxiYWNrKSA9PiB0aGlzLm1ha2VUaHVtYihiYXNlRGlyLCBmaWxlTmFtZSwgY2FsbGJhY2spLFxuICAgICAgICAgICAgKGNhbGxiYWNrKSA9PiB0aGlzLm1ha2VTY2FsZWQoYmFzZURpciwgZmlsZU5hbWUsIGNhbGxiYWNrKSxcbiAgICAgICAgXSwgKGVycikgPT4ge1xuICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKFxuICAgICAgICAgICAgICAgICAgICBuZXcgRXJyb3IoYEVycm9yIGNvbnZlcnRpbmcgdGh1bWJuYWlsczogJHtlcnJ9YCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBbXG4gICAgICAgICAgICAgICAgcGF0aC5yZXNvbHZlKGJhc2VEaXIsIFwidGh1bWJzXCIsIGZpbGVOYW1lKSxcbiAgICAgICAgICAgICAgICBwYXRoLnJlc29sdmUoYmFzZURpciwgXCJzY2FsZWRcIiwgZmlsZU5hbWUpLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBoYXNoSW1hZ2Uoc291cmNlRmlsZSwgY2FsbGJhY2spIHtcbiAgICAgICAgZnMucmVhZEZpbGUoc291cmNlRmlsZSwgKGVyciwgYnVmZmVyKSA9PiB7XG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgZmFybWhhc2guaGFzaDMyKGJ1ZmZlcikudG9TdHJpbmcoKSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBwcm9jZXNzSW1hZ2Uoc291cmNlRmlsZSwgYmFzZURpciwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGhhc2g7XG4gICAgICAgIGxldCBpbWFnZUZpbGU7XG4gICAgICAgIGNvbnN0IGV4aXN0c0Vycm9yID0gbmV3IEVycm9yKFwiQWxyZWFkeSBleGlzdHMuXCIpO1xuXG4gICAgICAgIGFzeW5jLnNlcmllcyhbXG4gICAgICAgICAgICAvLyBHZW5lcmF0ZSBhIGhhc2ggZm9yIHRoZSBpbmNvbWluZyBpbWFnZSBmaWxlXG4gICAgICAgICAgICAoY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhc2hJbWFnZShzb3VyY2VGaWxlLCAoZXJyLCBpbWFnZUhhc2gpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaGFzaCA9IGltYWdlSGFzaDtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VGaWxlID0gcGF0aC5yZXNvbHZlKGJhc2VEaXIsIFwiaW1hZ2VzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBgJHtoYXNofS5qcGdgKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBBdm9pZCBkb2luZyB0aGUgcmVzdCBvZiB0aGlzIGlmIGl0IGFscmVhZHkgZXhpc3RzXG4gICAgICAgICAgICAgICAgICAgIGZzLnN0YXQoaW1hZ2VGaWxlLCAoZXJyLCBzdGF0cykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soc3RhdHMgPyBleGlzdHNFcnJvciA6IG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIENvbnZlcnQgdGhlIGltYWdlIGludG8gb3VyIHN0YW5kYXJkIGZvcm1hdFxuICAgICAgICAgICAgKGNhbGxiYWNrKSA9PiB0aGlzLmNvbnZlcnQoZnMuY3JlYXRlUmVhZFN0cmVhbShzb3VyY2VGaWxlKSxcbiAgICAgICAgICAgICAgICBpbWFnZUZpbGUsIG51bGwsIGNhbGxiYWNrKSxcblxuICAgICAgICAgICAgLy8gR2VuZXJhdGUgdGh1bWJuYWlscyBiYXNlZCBvbiB0aGUgaW1hZ2VcbiAgICAgICAgICAgIChjYWxsYmFjaykgPT4gdGhpcy5tYWtlVGh1bWJzKGltYWdlRmlsZSwgY2FsbGJhY2spLFxuICAgICAgICBdLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnIgPT09IGV4aXN0c0Vycm9yID8gbnVsbCA6IGVyciwgaGFzaCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG59O1xuXG5JbWFnZS5wbHVnaW4odmVyc2lvbmVyLCB7XG4gICAgY29sbGVjdGlvbjogYGltYWdlX3ZlcnNpb25zYCxcbiAgICBzdXBwcmVzc1ZlcnNpb25JbmNyZW1lbnQ6IGZhbHNlLFxuICAgIHN1cHByZXNzUmVmSWRJbmRleDogZmFsc2UsXG4gICAgcmVmSWRUeXBlOiBTdHJpbmcsXG4gICAgcmVtb3ZlVmVyc2lvbnM6IGZhbHNlLFxuICAgIHN0cmF0ZWd5OiBcImNvbGxlY3Rpb25cIixcbiAgICBtb25nb29zZTogZGIubW9uZ29vc2UsXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbWFnZTtcbiJdfQ==