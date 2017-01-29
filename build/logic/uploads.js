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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sb2dpYy91cGxvYWRzLmpzIl0sIm5hbWVzIjpbImZzIiwicmVxdWlyZSIsIm9zIiwicGF0aCIsImFzeW5jIiwicmVxdWVzdCIsImZvcm1pZGFibGUiLCJtb2RlbHMiLCJvcHRpb25zIiwiTUFYX0FUVEVNUFRTIiwiRE9XTkxPQURfVElNRU9VVCIsIm1vZHVsZSIsImV4cG9ydHMiLCJhcHAiLCJVcGxvYWQiLCJVcGxvYWRJbWFnZSIsImdlblRtcEZpbGUiLCJqb2luIiwidG1wZGlyIiwiRGF0ZSIsImdldFRpbWUiLCJ0b1N0cmluZyIsImhhbmRsZVVwbG9hZCIsInJlcSIsInJlcyIsIm5leHQiLCJlcnIiLCJmaWxlIiwiZnJvbUZpbGUiLCJpbWFnZSIsIkVycm9yIiwiZ2V0dGV4dCIsImZyb21JbWFnZSIsInBhcmFtcyIsInR5cGUiLCJ1cGxvYWQiLCJ1cGRhdGVTaW1pbGFyaXR5Iiwic2F2ZSIsInJlZGlyZWN0IiwiZ2V0VVJMIiwibGFuZyIsImRvd25sb2FkIiwiaW1hZ2VVUkwiLCJjYWxsYmFjayIsImF0dGVtcHROdW0iLCJkb3dubG9hZEltYWdlIiwidG1wRmlsZSIsIm91dFN0cmVhbSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwib24iLCJzdHJlYW0iLCJ1cmwiLCJ0aW1lb3V0Iiwic3RhdHVzQ29kZSIsInBpcGUiLCJ1cmxVcGxvYWQiLCJxdWVyeSIsImZpbGVVcGxvYWQiLCJmb3JtIiwiSW5jb21pbmdGb3JtIiwiZW5jb2RpbmciLCJtYXhGaWVsZHNTaXplIiwibWF4VXBsb2FkU2l6ZSIsInBhcnNlIiwiZmllbGRzIiwiZmlsZXMiLCJzaXplIiwic2hvdyIsIl9pZCIsImZpbmRCeUlkIiwic3RhdHVzIiwicmVuZGVyIiwidGl0bGUiLCJsb2FkSW1hZ2VzIiwiZWFjaExpbWl0Iiwic2ltaWxhclJlY29yZHMiLCJzaW1pbGFyIiwicmVjb3JkTW9kZWwiLCJnZXRUaXRsZSIsImltYWdlcyIsIm5vSW5kZXgiLCJyb3V0ZXMiLCJnZXQiLCJw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QWtCLElBQWxCLEVBQXdCLFlBQU07QUFDMUJyRSwwQkFBTXNFLFNBQU4sQ0FBZ0J2QyxPQUFPd0MsY0FBdkIsRUFBdUMsQ0FBdkMsRUFDSSxVQUFDQyxPQUFELEVBQVVqQyxRQUFWLEVBQXVCO0FBQ25CaUMsZ0NBQVFDLFdBQVIsQ0FBb0JKLFVBQXBCLENBQStCLEtBQS9CLEVBQXNDOUIsUUFBdEM7QUFDSCxxQkFITCxFQUdPLFlBQU07QUFDTG5CLDRCQUFJK0MsTUFBSixDQUFXLFFBQVgsRUFBcUI7QUFDakJDLG1DQUFPckMsT0FBTzJDLFFBQVAsQ0FBZ0J2RCxHQUFoQixDQURVO0FBRWpCcUQscUNBQVN6QyxPQUFPd0MsY0FGQztBQUdqQjlDLG1DQUFPTSxPQUFPNEMsTUFBUCxDQUFjLENBQWQsQ0FIVTtBQUlqQkMscUNBQVM7QUFKUSx5QkFBckI7QUFNSCxxQkFWTDtBQVdILGlCQVpEO0FBYUgsYUFwQkQ7QUFxQkgsU0E5REU7QUFnRUhDLGNBaEVHLG9CQWdFTTtBQUNMcEUsZ0JBQUlxRSxHQUFKLENBQVEsd0JBQVIsRUFBa0MsS0FBS2YsSUFBdkM7QUFDQXRELGdCQUFJcUUsR0FBSixDQUFRLG1CQUFSLEVBQTZCLEtBQUszQixTQUFsQztBQUNBMUMsZ0JBQUlzRSxJQUFKLENBQVMsb0JBQVQsRUFBK0IsS0FBSzFCLFVBQXBDO0FBQ0g7QUFwRUUsS0FBUDtBQXNFSCxDQXRKRCIsImZpbGUiOiJ1cGxvYWRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZnMgPSByZXF1aXJlKFwiZnNcIik7XG5jb25zdCBvcyA9IHJlcXVpcmUoXCJvc1wiKTtcbmNvbnN0IHBhdGggPSByZXF1aXJlKFwicGF0aFwiKTtcblxuY29uc3QgYXN5bmMgPSByZXF1aXJlKFwiYXN5bmNcIik7XG5jb25zdCByZXF1ZXN0ID0gcmVxdWlyZShcInJlcXVlc3RcIik7XG5jb25zdCBmb3JtaWRhYmxlID0gcmVxdWlyZShcImZvcm1pZGFibGVcIik7XG5cbmNvbnN0IG1vZGVscyA9IHJlcXVpcmUoXCIuLi9saWIvbW9kZWxzXCIpO1xuY29uc3Qgb3B0aW9ucyA9IHJlcXVpcmUoXCIuLi9saWIvb3B0aW9uc1wiKTtcblxuLy8gVGhlIG1heGltdW0gbnVtYmVyIG9mIHRpbWVzIHRvIHRyeSBkb3dubG9hZGluZyBhbiBpbWFnZVxuY29uc3QgTUFYX0FUVEVNUFRTID0gMztcblxuLy8gSG93IGxvbmcgdG8gd2FpdCwgaW4gbWlsbGlzZWNvbmRzLCBmb3IgdGhlIGRvd25sb2FkXG5jb25zdCBET1dOTE9BRF9USU1FT1VUID0gMTAwMDA7XG5cbm1vZHVsZS5leHBvcnRzID0gKGFwcCkgPT4ge1xuICAgIGNvbnN0IFVwbG9hZCA9IG1vZGVscyhcIlVwbG9hZFwiKTtcbiAgICBjb25zdCBVcGxvYWRJbWFnZSA9IG1vZGVscyhcIlVwbG9hZEltYWdlXCIpO1xuXG4gICAgY29uc3QgZ2VuVG1wRmlsZSA9ICgpID0+IHBhdGguam9pbihvcy50bXBkaXIoKSxcbiAgICAgICAgKG5ldyBEYXRlKS5nZXRUaW1lKCkudG9TdHJpbmcoKSk7XG5cbiAgICBjb25zdCBoYW5kbGVVcGxvYWQgPSAocmVxLCByZXMsIG5leHQpID0+IChlcnIsIGZpbGUpID0+IHtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXh0KGVycik7XG4gICAgICAgIH1cblxuICAgICAgICBVcGxvYWRJbWFnZS5mcm9tRmlsZShmaWxlLCAoZXJyLCBpbWFnZSkgPT4ge1xuICAgICAgICAgICAgLy8gVE9ETzogRGlzcGxheSBiZXR0ZXIgZXJyb3IgbWVzc2FnZVxuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvcihyZXEuZ2V0dGV4dChcIkVycm9yIHByb2Nlc3NpbmcgaW1hZ2UuXCIpKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFVwbG9hZC5mcm9tSW1hZ2UoaW1hZ2UsIHJlcS5wYXJhbXMudHlwZSwgKGVyciwgdXBsb2FkKSA9PiB7XG4gICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV4dChlcnIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGltYWdlLnVwZGF0ZVNpbWlsYXJpdHkoKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5leHQoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGltYWdlLnNhdmUoKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5leHQoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogQWRkIGluIHVwbG9hZGVyJ3MgdXNlciBuYW1lIChvbmNlIHRob3NlIGV4aXN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkLnVwZGF0ZVNpbWlsYXJpdHkoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZC5zYXZlKCgpID0+IHJlcy5yZWRpcmVjdChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkLmdldFVSTChyZXEubGFuZykpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgY29uc3QgZG93bmxvYWQgPSAoaW1hZ2VVUkwsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIGxldCBhdHRlbXB0TnVtID0gMDtcblxuICAgICAgICBjb25zdCBkb3dubG9hZEltYWdlID0gKCkgPT4ge1xuICAgICAgICAgICAgYXR0ZW1wdE51bSArPSAxO1xuXG4gICAgICAgICAgICBjb25zdCB0bXBGaWxlID0gZ2VuVG1wRmlsZSgpO1xuICAgICAgICAgICAgY29uc3Qgb3V0U3RyZWFtID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0odG1wRmlsZSk7XG5cbiAgICAgICAgICAgIG91dFN0cmVhbS5vbihcImNsb3NlXCIsICgpID0+IGNhbGxiYWNrKG51bGwsIHRtcEZpbGUpKTtcblxuICAgICAgICAgICAgY29uc3Qgc3RyZWFtID0gcmVxdWVzdCh7XG4gICAgICAgICAgICAgICAgdXJsOiBpbWFnZVVSTCxcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiBET1dOTE9BRF9USU1FT1VULFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHN0cmVhbS5vbihcInJlc3BvbnNlXCIsIChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1c0NvZGUgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyZWFtLnBpcGUob3V0U3RyZWFtKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYXR0ZW1wdE51bSA8IE1BWF9BVFRFTVBUUykge1xuICAgICAgICAgICAgICAgICAgICBkb3dubG9hZEltYWdlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKFwiRXJyb3IgRG93bmxvYWRpbmcgaW1hZ2UuXCIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBkb3dubG9hZEltYWdlKCk7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHVybFVwbG9hZChyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gcmVxLnF1ZXJ5LnVybDtcblxuICAgICAgICAgICAgLy8gSGFuZGxlIHRoZSB1c2VyIGFjY2lkZW50YWxseSBoaXR0aW5nIGVudGVyXG4gICAgICAgICAgICBpZiAoIXVybCB8fCB1cmwgPT09IFwiaHR0cDovL1wiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9yKHJlcS5nZXR0ZXh0KFwiTm8gaW1hZ2UgVVJMIHNwZWNpZmllZC5cIikpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG93bmxvYWQodXJsLCAoZXJyLCBmaWxlKSA9PlxuICAgICAgICAgICAgICAgIGhhbmRsZVVwbG9hZChyZXEsIHJlcywgbmV4dCkoZXJyLCBmaWxlKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmlsZVVwbG9hZChyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICAgICAgY29uc3QgZm9ybSA9IG5ldyBmb3JtaWRhYmxlLkluY29taW5nRm9ybSgpO1xuICAgICAgICAgICAgZm9ybS5lbmNvZGluZyA9IFwidXRmLThcIjtcbiAgICAgICAgICAgIGZvcm0ubWF4RmllbGRzU2l6ZSA9IG9wdGlvbnMubWF4VXBsb2FkU2l6ZTtcblxuICAgICAgICAgICAgZm9ybS5wYXJzZShyZXEsIChlcnIsIGZpZWxkcywgZmlsZXMpID0+IHtcbiAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcS5nZXR0ZXh0KFwiRXJyb3IgcHJvY2Vzc2luZyB1cGxvYWQuXCIpKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVxLmxhbmcgPSBmaWVsZHMubGFuZztcblxuICAgICAgICAgICAgICAgIGlmIChmaWxlcyAmJiBmaWxlcy5maWxlICYmIGZpbGVzLmZpbGUucGF0aCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXMuZmlsZS5zaXplID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVVcGxvYWQocmVxLCByZXMsIG5leHQpKG51bGwsIGZpbGVzLmZpbGUucGF0aCk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXh0KG5ldyBFcnJvcihyZXEuZ2V0dGV4dChcIk5vIGltYWdlIHNwZWNpZmllZC5cIikpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBzaG93KHJlcSwgcmVzKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBVcGRhdGUgc2ltaWxhciBtYXRjaGVzIGlmIG5ldyBpbWFnZSBkYXRhIGhhc1xuICAgICAgICAgICAgLy8gc2luY2UgY29tZSBpbiBzaW5jZSBpdCB3YXMgbGFzdCB1cGRhdGVkLlxuICAgICAgICAgICAgY29uc3QgX2lkID0gYHVwbG9hZHMvJHtyZXEucGFyYW1zLnVwbG9hZH1gO1xuICAgICAgICAgICAgVXBsb2FkLmZpbmRCeUlkKF9pZCwgKGVyciwgdXBsb2FkKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVyciB8fCAhdXBsb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwNCkucmVuZGVyKFwiRXJyb3JcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHJlcS5nZXR0ZXh0KFwiVXBsb2FkZWQgaW1hZ2Ugbm90IGZvdW5kLlwiKSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdXBsb2FkLmxvYWRJbWFnZXModHJ1ZSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBhc3luYy5lYWNoTGltaXQodXBsb2FkLnNpbWlsYXJSZWNvcmRzLCA0LFxuICAgICAgICAgICAgICAgICAgICAgICAgKHNpbWlsYXIsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2ltaWxhci5yZWNvcmRNb2RlbC5sb2FkSW1hZ2VzKGZhbHNlLCBjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnJlbmRlcihcIlVwbG9hZFwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiB1cGxvYWQuZ2V0VGl0bGUocmVxKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2ltaWxhcjogdXBsb2FkLnNpbWlsYXJSZWNvcmRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZTogdXBsb2FkLmltYWdlc1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9JbmRleDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcm91dGVzKCkge1xuICAgICAgICAgICAgYXBwLmdldChcIi86dHlwZS91cGxvYWRzLzp1cGxvYWRcIiwgdGhpcy5zaG93KTtcbiAgICAgICAgICAgIGFwcC5nZXQoXCIvOnR5cGUvdXJsLXVwbG9hZFwiLCB0aGlzLnVybFVwbG9hZCk7XG4gICAgICAgICAgICBhcHAucG9zdChcIi86dHlwZS9maWxlLXVwbG9hZFwiLCB0aGlzLmZpbGVVcGxvYWQpO1xuICAgICAgICB9LFxuICAgIH07XG59O1xuIl19