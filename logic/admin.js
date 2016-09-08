"use strict";

const fs = require("fs");

const async = require("async");
const formidable = require("formidable");
const jdp = require("jsondiffpatch");

const models = require("../lib/models");

module.exports = function(app) {
    const ImageImport = models("ImageImport");
    const RecordImport = models("RecordImport");

    const auth = require("./shared/auth");

    const importRecords = (req, res) => {
        const batchState = (batch) => batch.getCurState().name(req);
        const batchError = (err) => RecordImport.getError(req, err);

        RecordImport.findById(req.query.records, (err, batch) => {
            if (err || !batch) {
                return res.status(404).render("Error", {
                    title: req.gettext("Import not found."),
                });
            }

            if (req.query.abandon) {
                return batch.abandon(() => {
                    res.redirect(req.source.getAdminURL(req.lang));
                });

            } else if (req.query.finalize) {
                return batch.manuallyApprove(() => {
                    res.redirect(req.source.getAdminURL(req.lang));
                });
            }

            const adminURL = req.source.getAdminURL(req.lang);

            res.render("ImportRecords", {
                batch,
                results: batch.getFilteredResults(),
                expanded: req.query.expanded,
                adminURL,
                batchState,
                batchError,
                diff: (delta) => jdp.formatters.html.format(delta),
            });
        });
    };

    const importImages = (req, res) => {
        const Image = models("Image");

        const batchState = (batch) => batch.getCurState().name(req);
        const batchError = (err) => ImageImport.getError(req, err);

        ImageImport.findById(req.query.images, (err, batch) => {
            if (err || !batch) {
                return res.status(404).render("Error", {
                    title: req.gettext("Import not found."),
                });
            }

            const expanded = req.query.expanded;
            const results = batch.results
                .filter((result) => !!result.model);
            const toPopulate = req.query.expanded === "models" ?
                results :
                results.slice(0, 8);

            async.eachLimit(toPopulate, 4, (result, callback) => {
                Image.findById(result.model, (err, image) => {
                    if (image) {
                        result.model = image;
                    }

                    callback();
                });
            }, () => {
                const adminURL = req.source.getAdminURL(req.lang);

                res.render("ImportImages", {
                    batch,
                    expanded,
                    adminURL,
                    batchState,
                    batchError,
                });
            });
        });
    };

    const adminPage = (req, res, next) => {
        const source = req.source;
        const batchState = (batch) => batch.getCurState().name(req);
        const batchError = (batch) => batch.getError(req);

        async.parallel([
            (callback) => ImageImport.find({source: source._id}, null,
                {sort: {created: "desc"}}, callback),
            (callback) => RecordImport.find({source: source._id}, {
                state: true,
                fileName: true,
                source: true,
                modified: true,
                error: true,
                "results.result": true,
                "results.error": true,
                "results.warnings": true,
            }, {sort: {created: "desc"}}, callback),
        ], (err, results) => {
            /* istanbul ignore if */
            if (err) {
                return next(new Error(
                    req.gettext("Error retrieving records.")));
            }

            const imageImport = results[0];
            const dataImport = results[1];

            res.render("Admin", {
                source,
                imageImport,
                dataImport,
                batchState,
                batchError,
            });
        });
    };

    return {
        admin(req, res, next) {
            if (req.query.records) {
                importRecords(req, res, next);

            } else if (req.query.images) {
                importImages(req, res, next);

            } else {
                adminPage(req, res, next);
            }
        },

        uploadImages(req, res, next) {
            const source = req.source;

            const form = new formidable.IncomingForm();
            form.encoding = "utf-8";

            form.parse(req, (err, fields, files) => {
                /* istanbul ignore if */
                if (err) {
                    return next(new Error(
                        req.gettext("Error processing zip file.")));
                }

                const zipField = files && files.zipField;

                if (!zipField || !zipField.path || zipField.size === 0) {
                    return next(
                        new Error(req.gettext("No zip file specified.")));
                }

                const zipFile = zipField.path;
                const fileName = zipField.name;

                const batch = ImageImport.fromFile(fileName, source._id);
                batch.zipFile = zipFile;

                batch.save((err) => {
                    /* istanbul ignore if */
                    if (err) {
                        return next(new Error(
                            req.gettext("Error saving zip file.")));
                    }

                    res.redirect(source.getAdminURL(req.lang));
                });
            });
        },

        uploadData(req, res, next) {
            const source = req.source;

            const form = new formidable.IncomingForm();
            form.encoding = "utf-8";
            form.multiples = true;

            form.parse(req, (err, fields, files) => {
                /* istanbul ignore if */
                if (err) {
                    return next(new Error(
                        req.gettext("Error processing data files.")));
                }

                const inputFiles = (Array.isArray(files.files) ?
                    files.files :
                    files.files ? [files.files] : [])
                    .filter((file) => file.path && file.size > 0);

                if (inputFiles.length === 0) {
                    return next(
                        new Error(req.gettext("No data files specified.")));
                }

                const fileName = inputFiles
                    .map((file) => file.name).join(", ");
                const inputStreams = inputFiles
                    .map((file) => fs.createReadStream(file.path));

                const batch = RecordImport.fromFile(fileName, source._id,
                    source.type);

                batch.setResults(inputStreams, (err) => {
                    /* istanbul ignore if */
                    if (err) {
                        return next(new Error(
                            req.gettext("Error saving data file.")));
                    }

                    batch.save((err) => {
                        /* istanbul ignore if */
                        if (err) {
                            return next(new Error(
                                req.gettext("Error saving data file.")));
                        }

                        res.redirect(source.getAdminURL(req.lang));
                    });
                });
            });
        },

        routes() {
            const source = (req, res, next) => {
                const Source = models("Source");

                try {
                    req.source = Source.getSource(req.params.source);
                    next();

                } catch (e) {
                    return res.status(404).render("Error", {
                        title: req.gettext("Source not found."),
                    });
                }
            };

            app.get("/source/:source/admin", auth, source, this.admin);
            app.post("/source/:source/upload-images", auth, source,
                this.uploadImages);
            app.post("/source/:source/upload-data", auth, source,
                this.uploadData);
        },
    };
};
