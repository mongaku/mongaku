"use strict";

var fs = require("fs");

var async = require("async");
var formidable = require("formidable");
var jdp = require("jsondiffpatch");

var models = require("../lib/models");

module.exports = function (app) {
    var ImageImport = models("ImageImport");
    var RecordImport = models("RecordImport");

    var auth = require("./shared/auth");

    var importRecords = function importRecords(req, res) {
        var batchState = function batchState(batch) {
            return batch.getCurState().name(req);
        };
        var batchError = function batchError(err) {
            return RecordImport.getError(req, err);
        };

        RecordImport.findById(req.query.records, function (err, batch) {
            if (err || !batch) {
                return res.status(404).render("Error", {
                    title: req.gettext("Import not found.")
                });
            }

            if (req.query.abandon) {
                return batch.abandon(function () {
                    res.redirect(req.source.getAdminURL(req.lang));
                });
            } else if (req.query.finalize) {
                return batch.manuallyApprove(function () {
                    res.redirect(req.source.getAdminURL(req.lang));
                });
            }

            var adminURL = req.source.getAdminURL(req.lang);

            res.render("ImportRecords", {
                batch: batch,
                results: batch.getFilteredResults(),
                expanded: req.query.expanded,
                adminURL: adminURL,
                batchState: batchState,
                batchError: batchError,
                diff: function diff(delta) {
                    return jdp.formatters.html.format(delta);
                }
            });
        });
    };

    var importImages = function importImages(req, res) {
        var Image = models("Image");

        var batchState = function batchState(batch) {
            return batch.getCurState().name(req);
        };
        var batchError = function batchError(err) {
            return ImageImport.getError(req, err);
        };

        ImageImport.findById(req.query.images, function (err, batch) {
            if (err || !batch) {
                return res.status(404).render("Error", {
                    title: req.gettext("Import not found.")
                });
            }

            var expanded = req.query.expanded;
            var results = batch.results.filter(function (result) {
                return !!result.model;
            });
            var toPopulate = req.query.expanded === "models" ? results : results.slice(0, 8);

            async.eachLimit(toPopulate, 4, function (result, callback) {
                Image.findById(result.model, function (err, image) {
                    if (image) {
                        result.model = image;
                    }

                    callback();
                });
            }, function () {
                var adminURL = req.source.getAdminURL(req.lang);

                res.render("ImportImages", {
                    batch: batch,
                    expanded: expanded,
                    adminURL: adminURL,
                    batchState: batchState,
                    batchError: batchError
                });
            });
        });
    };

    var adminPage = function adminPage(req, res, next) {
        var source = req.source;
        var batchState = function batchState(batch) {
            return batch.getCurState().name(req);
        };
        var batchError = function batchError(batch) {
            return batch.getError(req);
        };

        async.parallel([function (callback) {
            return ImageImport.find({ source: source._id }, null, { sort: { created: "desc" } }, callback);
        }, function (callback) {
            return RecordImport.find({ source: source._id }, {
                state: true,
                fileName: true,
                source: true,
                created: true,
                modified: true,
                error: true,
                "results.result": true,
                "results.error": true,
                "results.warnings": true
            }, {}, callback);
        }], function (err, results) {
            /* istanbul ignore if */
            if (err) {
                return next(new Error(req.gettext("Error retrieving records.")));
            }

            var imageImport = results[0];
            var dataImport = results[1].sort(function (a, b) {
                return b.created - a.created;
            });

            res.render("Admin", {
                source: source,
                imageImport: imageImport,
                dataImport: dataImport,
                batchState: batchState,
                batchError: batchError
            });
        });
    };

    return {
        admin: function admin(req, res, next) {
            if (req.query.records) {
                importRecords(req, res, next);
            } else if (req.query.images) {
                importImages(req, res, next);
            } else {
                adminPage(req, res, next);
            }
        },
        uploadImages: function uploadImages(req, res, next) {
            var source = req.source;

            var form = new formidable.IncomingForm();
            form.encoding = "utf-8";

            form.parse(req, function (err, fields, files) {
                /* istanbul ignore if */
                if (err) {
                    return next(new Error(req.gettext("Error processing zip file.")));
                }

                var zipField = files && files.zipField;

                if (!zipField || !zipField.path || zipField.size === 0) {
                    return next(new Error(req.gettext("No zip file specified.")));
                }

                var zipFile = zipField.path;
                var fileName = zipField.name;

                var batch = ImageImport.fromFile(fileName, source._id);
                batch.zipFile = zipFile;

                batch.save(function (err) {
                    /* istanbul ignore if */
                    if (err) {
                        return next(new Error(req.gettext("Error saving zip file.")));
                    }

                    res.redirect(source.getAdminURL(req.lang));
                });
            });
        },
        uploadData: function uploadData(req, res, next) {
            var source = req.source;

            var form = new formidable.IncomingForm();
            form.encoding = "utf-8";
            form.multiples = true;

            form.parse(req, function (err, fields, files) {
                /* istanbul ignore if */
                if (err) {
                    return next(new Error(req.gettext("Error processing data files.")));
                }

                var inputFiles = (Array.isArray(files.files) ? files.files : files.files ? [files.files] : []).filter(function (file) {
                    return file.path && file.size > 0;
                });

                if (inputFiles.length === 0) {
                    return next(new Error(req.gettext("No data files specified.")));
                }

                var fileName = inputFiles.map(function (file) {
                    return file.name;
                }).join(", ");
                var inputStreams = inputFiles.map(function (file) {
                    return fs.createReadStream(file.path);
                });

                var batch = RecordImport.fromFile(fileName, source._id, source.type);

                batch.setResults(inputStreams, function (err) {
                    /* istanbul ignore if */
                    if (err) {
                        return next(new Error(req.gettext("Error saving data file.")));
                    }

                    batch.save(function (err) {
                        /* istanbul ignore if */
                        if (err) {
                            return next(new Error(req.gettext("Error saving data file.")));
                        }

                        res.redirect(source.getAdminURL(req.lang));
                    });
                });
            });
        },
        routes: function routes() {
            var source = function source(req, res, next) {
                var Source = models("Source");

                try {
                    req.source = Source.getSource(req.params.source);
                    next();
                } catch (e) {
                    return res.status(404).render("Error", {
                        title: req.gettext("Source not found.")
                    });
                }
            };

            app.get("/:type/source/:source/admin", auth, source, this.admin);
            app.post("/:type/source/:source/upload-images", auth, source, this.uploadImages);
            app.post("/:type/source/:source/upload-data", auth, source, this.uploadData);
        }
    };
};