"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const async = require("async");
const request = require("request");
const formidable = require("formidable");

const { cloneModel } = require("../lib/clone");
const models = require("../lib/models");
const options = require("../lib/options");

// The maximum number of times to try downloading an image
const MAX_ATTEMPTS = 3;

// How long to wait, in milliseconds, for the download
const DOWNLOAD_TIMEOUT = 10000;

module.exports = app => {
    const Upload = models("Upload");
    const UploadImage = models("UploadImage");
    const Source = models("Source");

    const genTmpFile = () => path.join(os.tmpdir(), new Date().getTime().toString());

    const handleUpload = ({
        i18n,
        params,
        lang
    }, res, next) => (err, file) => {
        /* istanbul ignore if */
        if (err) {
            return next(err);
        }

        UploadImage.fromFile(file, (err, image) => {
            // TODO: Display better error message
            if (err) {
                return next(new Error(i18n.gettext("Error processing image.")));
            }

            Upload.fromImage(image, params.type, (err, upload) => {
                /* istanbul ignore if */
                if (err) {
                    return next(err);
                }

                image.updateSimilarity(err => {
                    /* istanbul ignore if */
                    if (err) {
                        return next(err);
                    }

                    image.save(err => {
                        /* istanbul ignore if */
                        if (err) {
                            return next(err);
                        }

                        // TODO: Add in uploader's user name (once those exist)
                        upload.updateSimilarity(() => {
                            upload.save(() => res.redirect(upload.getURL(lang)));
                        });
                    });
                });
            });
        });
    };

    const download = (imageURL, callback) => {
        let attemptNum = 0;

        const downloadImage = () => {
            attemptNum += 1;

            const tmpFile = genTmpFile();
            const outStream = fs.createWriteStream(tmpFile);

            outStream.on("close", () => callback(null, tmpFile));

            const stream = request({
                url: imageURL,
                timeout: DOWNLOAD_TIMEOUT
            });

            stream.on("response", res => {
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
        urlUpload(req, res, next) {
            const { query: { url }, i18n } = req;

            // Handle the user accidentally hitting enter
            if (!url || url === "http://") {
                return next(new Error(i18n.gettext("No image URL specified.")));
            }

            download(url, (err, file) => handleUpload(req, res, next)(err, file));
        },

        fileUpload(req, res, next) {
            const { i18n } = req;
            const form = new formidable.IncomingForm();
            form.encoding = "utf-8";
            form.maxFieldsSize = options.maxUploadSize;

            form.parse(req, (err, fields, files) => {
                /* istanbul ignore if */
                if (err) {
                    return next(new Error(i18n.gettext("Error processing upload.")));
                }

                if (files && files.file && files.file.path && files.file.size > 0) {
                    handleUpload(req, res, next)(null, files.file.path);
                } else {
                    next(new Error(i18n.gettext("No image specified.")));
                }
            });
        },

        show({ params, i18n }, res) {
            // TODO: Update similar matches if new image data has
            // since come in since it was last updated.
            const _id = `uploads/${params.upload}`;
            Upload.findById(_id, (err, upload) => {
                if (err || !upload) {
                    return res.status(404).render("Error", {
                        title: i18n.gettext("Uploaded image not found.")
                    });
                }

                upload.loadImages(true, () => {
                    async.eachLimit(upload.similarRecords, 4, (similar, callback) => {
                        similar.recordModel.loadImages(false, callback);
                    }, () => {
                        const similarRecords = upload.similarRecords.map(match => ({
                            _id: match._id,
                            score: match.score,
                            recordModel: cloneModel(match.recordModel, i18n)
                        }));

                        res.render("Upload", {
                            title: upload.getTitle(i18n),
                            similar: similarRecords,
                            image: cloneModel(upload.images[0], i18n),
                            sources: Source.getSources().map(source => cloneModel(source, i18n)),
                            noIndex: true
                        });
                    });
                });
            });
        },

        routes() {
            app.get("/:type/uploads/:upload", this.show);
            app.get("/:type/url-upload", this.urlUpload);
            app.post("/:type/file-upload", this.fileUpload);
        }
    };
};