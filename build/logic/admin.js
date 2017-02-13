"use strict";

const fs = require("fs");

const async = require("async");
const formidable = require("formidable");
const jdp = require("jsondiffpatch");

const models = require("../lib/models");

module.exports = function (app) {
    const ImageImport = models("ImageImport");
    const RecordImport = models("RecordImport");

    const auth = require("./shared/auth");

    const importRecords = ({ i18n, lang, query, source }, res) => {
        const batchState = batch => batch.getStateName(i18n);
        const batchError = err => RecordImport.getError(i18n, err);

        RecordImport.findById(query.records, (err, batch) => {
            if (err || !batch) {
                return res.status(404).render("Error", {
                    title: i18n.gettext("Import not found.")
                });
            }

            if (query.abandon) {
                return batch.abandon(() => {
                    res.redirect(source.getAdminURL(lang));
                });
            } else if (query.finalize) {
                return batch.manuallyApprove(() => {
                    res.redirect(source.getAdminURL(lang));
                });
            }

            const adminURL = source.getAdminURL(lang);

            res.render("ImportRecords", {
                batch,
                results: batch.getFilteredResults(),
                expanded: query.expanded,
                adminURL,
                batchState,
                batchError,
                diff: delta => jdp.formatters.html.format(delta)
            });
        });
    };

    const importImages = ({ i18n, lang, query, source }, res) => {
        const Image = models("Image");

        const batchState = batch => batch.getCurState().name(i18n);
        const batchError = err => ImageImport.getError(i18n, err);

        ImageImport.findById(query.images, (err, batch) => {
            if (err || !batch) {
                return res.status(404).render("Error", {
                    title: i18n.gettext("Import not found.")
                });
            }

            const expanded = query.expanded;
            const results = batch.results.filter(result => !!result.model);
            const toPopulate = query.expanded === "models" ? results : results.slice(0, 8);

            async.eachLimit(toPopulate, 4, (result, callback) => {
                Image.findById(result.model, (err, image) => {
                    if (image) {
                        result.model = image;
                    }

                    callback();
                });
            }, () => {
                const adminURL = source.getAdminURL(lang);

                res.render("ImportImages", {
                    batch,
                    expanded,
                    adminURL,
                    batchState,
                    batchError
                });
            });
        });
    };

    const adminPage = ({ source, i18n }, res, next) => {
        const batchState = batch => batch.getCurState().name(i18n);
        const batchError = batch => batch.getError(i18n);

        async.parallel([callback => ImageImport.find({ source: source._id }, null, { sort: { created: "desc" } }, callback), callback => RecordImport.find({ source: source._id }, {
            state: true,
            fileName: true,
            source: true,
            created: true,
            modified: true,
            error: true,
            "results.result": true,
            "results.error": true,
            "results.warnings": true
        }, {}, callback)], (err, results) => {
            /* istanbul ignore if */
            if (err) {
                return next(new Error(i18n.gettext("Error retrieving records.")));
            }

            const imageImport = results[0];
            const dataImport = results[1].sort((a, b) => b.created - a.created);

            res.render("Admin", {
                source,
                imageImport,
                dataImport,
                batchState,
                batchError
            });
        });
    };

    return {
        admin(req, res, next) {
            const { query } = req;

            if (query.records) {
                importRecords(req, res, next);
            } else if (query.images) {
                importImages(req, res, next);
            } else {
                adminPage(req, res, next);
            }
        },

        uploadImages(req, res, next) {
            const { source, i18n, lang } = req;

            const form = new formidable.IncomingForm();
            form.encoding = "utf-8";

            form.parse(req, (err, fields, files) => {
                /* istanbul ignore if */
                if (err) {
                    return next(new Error(i18n.gettext("Error processing zip file.")));
                }

                const zipField = files && files.zipField;

                if (!zipField || !zipField.path || zipField.size === 0) {
                    return next(new Error(i18n.gettext("No zip file specified.")));
                }

                const zipFile = zipField.path;
                const fileName = zipField.name;

                const batch = ImageImport.fromFile(fileName, source._id);
                batch.zipFile = zipFile;

                batch.save(err => {
                    /* istanbul ignore if */
                    if (err) {
                        return next(new Error(i18n.gettext("Error saving zip file.")));
                    }

                    res.redirect(source.getAdminURL(lang));
                });
            });
        },

        uploadData(req, res, next) {
            const { source, i18n, lang } = req;

            const form = new formidable.IncomingForm();
            form.encoding = "utf-8";
            form.multiples = true;

            form.parse(req, (err, fields, files) => {
                /* istanbul ignore if */
                if (err) {
                    return next(new Error(i18n.gettext("Error processing data files.")));
                }

                const inputFiles = (Array.isArray(files.files) ? files.files : files.files ? [files.files] : []).filter(file => file.path && file.size > 0);

                if (inputFiles.length === 0) {
                    return next(new Error(i18n.gettext("No data files specified.")));
                }

                const fileName = inputFiles.map(file => file.name).join(", ");
                const inputStreams = inputFiles.map(file => fs.createReadStream(file.path));

                const batch = RecordImport.fromFile(fileName, source._id, source.type);

                batch.setResults(inputStreams, err => {
                    /* istanbul ignore if */
                    if (err) {
                        return next(new Error(i18n.gettext("Error saving data file.")));
                    }

                    batch.save(err => {
                        /* istanbul ignore if */
                        if (err) {
                            return next(new Error(i18n.gettext("Error saving data file.")));
                        }

                        res.redirect(source.getAdminURL(lang));
                    });
                });
            });
        },

        routes() {
            const source = (req, res, next) => {
                const { i18n, params } = req;
                const Source = models("Source");

                try {
                    req.source = Source.getSource(params.source);
                    next();
                } catch (e) {
                    return res.status(404).render("Error", {
                        title: i18n.gettext("Source not found.")
                    });
                }
            };

            app.get("/:type/source/:source/admin", auth, source, this.admin);
            app.post("/:type/source/:source/upload-images", auth, source, this.uploadImages);
            app.post("/:type/source/:source/upload-data", auth, source, this.uploadData);
        }
    };
};