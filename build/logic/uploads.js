"use strict";

var fs = require("fs");
var os = require("os");
var path = require("path");

var async = require("async");
var request = require("request");
var formidable = require("formidable");

var models = require("../lib/models");
var options = require("../lib/options");

// The maximum number of times to try downloading an image
var MAX_ATTEMPTS = 3;

// How long to wait, in milliseconds, for the download
var DOWNLOAD_TIMEOUT = 10000;

module.exports = function (app) {
    var Upload = models("Upload");
    var UploadImage = models("UploadImage");

    var genTmpFile = function genTmpFile() {
        return path.join(os.tmpdir(), new Date().getTime().toString());
    };

    var handleUpload = function handleUpload(req, res, next) {
        return function (err, file) {
            /* istanbul ignore if */
            if (err) {
                return next(err);
            }

            UploadImage.fromFile(file, function (err, image) {
                // TODO: Display better error message
                if (err) {
                    return next(new Error(req.gettext("Error processing image.")));
                }

                Upload.fromImage(image, req.params.type, function (err, upload) {
                    /* istanbul ignore if */
                    if (err) {
                        return next(err);
                    }

                    image.updateSimilarity(function (err) {
                        /* istanbul ignore if */
                        if (err) {
                            return next(err);
                        }

                        image.save(function (err) {
                            /* istanbul ignore if */
                            if (err) {
                                return next(err);
                            }

                            // TODO: Add in uploader's user name (once those exist)
                            upload.updateSimilarity(function () {
                                upload.save(function () {
                                    return res.redirect(upload.getURL(req.lang));
                                });
                            });
                        });
                    });
                });
            });
        };
    };

    var download = function download(imageURL, callback) {
        var attemptNum = 0;

        var downloadImage = function downloadImage() {
            attemptNum += 1;

            var tmpFile = genTmpFile();
            var outStream = fs.createWriteStream(tmpFile);

            outStream.on("close", function () {
                return callback(null, tmpFile);
            });

            var stream = request({
                url: imageURL,
                timeout: DOWNLOAD_TIMEOUT
            });

            stream.on("response", function (res) {
                if (res.statusCode === 200) {
                    return stream.pipe(outStream);
                }

                if (attemptNum < MAX_ATTEMPTS) {
                    downloadImage();
                } else {
                    callback(new Error("Error Downloading image."));
                }
            });
        };

        downloadImage();
    };

    return {
        urlUpload: function urlUpload(req, res, next) {
            var url = req.query.url;

            // Handle the user accidentally hitting enter
            if (!url || url === "http://") {
                return next(new Error(req.gettext("No image URL specified.")));
            }

            download(url, function (err, file) {
                return handleUpload(req, res, next)(err, file);
            });
        },
        fileUpload: function fileUpload(req, res, next) {
            var form = new formidable.IncomingForm();
            form.encoding = "utf-8";
            form.maxFieldsSize = options.maxUploadSize;

            form.parse(req, function (err, fields, files) {
                /* istanbul ignore if */
                if (err) {
                    return next(new Error(req.gettext("Error processing upload.")));
                }

                req.lang = fields.lang;

                if (files && files.file && files.file.path && files.file.size > 0) {
                    handleUpload(req, res, next)(null, files.file.path);
                } else {
                    next(new Error(req.gettext("No image specified.")));
                }
            });
        },
        show: function show(req, res) {
            // TODO: Update similar matches if new image data has
            // since come in since it was last updated.
            var _id = "uploads/" + req.params.upload;
            Upload.findById(_id, function (err, upload) {
                if (err || !upload) {
                    return res.status(404).render("Error", {
                        title: req.gettext("Uploaded image not found.")
                    });
                }

                upload.loadImages(true, function () {
                    async.eachLimit(upload.similarRecords, 4, function (similar, callback) {
                        similar.recordModel.loadImages(false, callback);
                    }, function () {
                        res.render("Upload", {
                            title: upload.getTitle(req),
                            similar: upload.similarRecords,
                            image: upload.images[0],
                            noIndex: true
                        });
                    });
                });
            });
        },
        routes: function routes() {
            app.get("/:type/uploads/:upload", this.show);
            app.get("/:type/url-upload", this.urlUpload);
            app.post("/:type/file-upload", this.fileUpload);
        }
    };
};