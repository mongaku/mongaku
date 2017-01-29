"use strict";

var path = require("path");

var async = require("async");

var db = require("../lib/db");
var models = require("../lib/models");
var urls = require("../lib/urls");
var similar = require("../lib/similar");

var Image = require("./Image");

var uploadName = "uploads";

var UploadImage = new db.schema({
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

    // Source is always set to "uploads"
    source: {
        type: String,
        default: uploadName,
        required: true
    },

    // The name of the original file (e.g. `foo.jpg`)
    fileName: {
        type: String,
        required: true
    },

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

var getDirBase = function getDirBase() {
    return urls.genLocalFile(uploadName);
};

UploadImage.methods = Object.assign({}, Image.methods, {
    getFilePath: function getFilePath() {
        return path.resolve(getDirBase(), "images/" + this.hash + ".jpg");
    },


    // We don't save the uploaded files in the index so we override this
    // method to use `fileSimilar` to re-query every time.
    updateSimilarity: function updateSimilarity(callback) {
        var _this = this;

        var Image = models("Image");

        var file = this.getFilePath();

        similar.fileSimilar(file, function (err, matches) {
            /* istanbul ignore if */
            if (err) {
                return callback(err);
            }

            async.mapLimit(matches, 1, function (match, callback) {
                // Skip matches for the image itself
                if (match.id === _this.hash) {
                    return callback();
                }

                Image.findOne({
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
                _this.similarImages = matches.filter(function (match) {
                    return match;
                });
                callback();
            });
        });
    }
});

UploadImage.statics = Object.assign({}, Image.statics, {
    fromFile: function fromFile(file, callback) {
        var _this2 = this;

        var UploadImage = models("UploadImage");

        var sourceDir = getDirBase();

        this.processImage(file, sourceDir, function (err, hash) {
            if (err) {
                return callback(new Error("MALFORMED_IMAGE"));
            }

            _this2.getSize(file, function (err, size) {
                /* istanbul ignore if */
                if (err) {
                    return callback(new Error("MALFORMED_IMAGE"));
                }

                var width = size.width;
                var height = size.height;

                if (width <= 1 || height <= 1) {
                    return callback(new Error("EMPTY_IMAGE"));
                }

                if (width < 150 || height < 150) {
                    return callback(new Error("TOO_SMALL"));
                }

                var fileName = hash + ".jpg";
                var _id = uploadName + "/" + fileName;

                _this2.findById(_id, function (err, image) {
                    /* istanbul ignore if */
                    if (err) {
                        return callback(new Error("ERROR_RETRIEVING"));
                    }

                    if (image) {
                        return callback(null, image);
                    }

                    var model = new UploadImage({
                        _id: _id,
                        fileName: fileName,
                        hash: hash,
                        width: width,
                        height: height
                    });

                    model.validate(function (err) {
                        /* istanbul ignore if */
                        if (err) {
                            return callback(new Error("ERROR_SAVING"));
                        }

                        callback(null, model);
                    });
                });
            });
        });
    }
});

module.exports = UploadImage;