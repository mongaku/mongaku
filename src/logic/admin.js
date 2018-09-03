const fs = require("fs");

const async = require("async");
const formidable = require("formidable");
const jdp = require("jsondiffpatch");

const {cloneModel} = require("../lib/clone");
const models = require("../lib/models");
const record = require("../lib/record");

module.exports = function(app) {
    const ImageImport = models("ImageImport");
    const RecordImport = models("RecordImport");

    const {auth, canEdit} = require("./shared/auth");

    const importRecords = ({i18n, lang, query, source}, res) => {
        const batchError = err => RecordImport.getError(i18n, err);
        const diff = delta => jdp.formatters.html.format(delta);

        RecordImport.findById(query.records, (err, batch) => {
            if (err || !batch) {
                return res.status(404).render("Error", {
                    title: i18n.gettext("Import not found."),
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

            const Record = record(batch.type);
            const adminURL = source.getAdminURL(lang);
            const cloned = cloneModel(batch, i18n);

            for (const result of cloned.results) {
                result.error = batchError(result.error || "");
                if (result.warnings) {
                    result.warnings = result.warnings.map(warning =>
                        batchError(warning || ""),
                    );
                }
                if (result.diff) {
                    result.diff = diff(result.diff);
                }
                if (result.model) {
                    result.url = Record.getURLFromID(lang, result.model);
                }
            }

            const title = i18n.format(
                i18n.gettext("Data Import: %(fileName)s"),
                {fileName: batch.fileName},
            );

            res.render("ImportRecords", {
                title,
                batch: cloned,
                expanded: query.expanded,
                adminURL,
            });
        });
    };

    const importImages = ({i18n, lang, query, source}, res) => {
        const Image = models("Image");

        const batchError = err => ImageImport.getError(i18n, err);

        ImageImport.findById(query.images, (err, batch) => {
            if (err || !batch) {
                return res.status(404).render("Error", {
                    title: i18n.gettext("Import not found."),
                });
            }

            for (const result of batch.results) {
                result.error = batchError(result.error || "");

                if (result.warnings) {
                    result.warnings = result.warnings.map(warning =>
                        batchError(warning),
                    );
                }
            }

            const {expanded} = query;
            const results = batch.results.filter(result => !!result.model);
            const toPopulate =
                expanded === "models" ? results : results.slice(0, 8);

            async.eachLimit(
                toPopulate,
                4,
                (result, callback) => {
                    Image.findById(result.model, (err, image) => {
                        if (image) {
                            result.model = cloneModel(image, i18n);
                        }

                        callback();
                    });
                },
                () => {
                    const adminURL = source.getAdminURL(lang);
                    const title = i18n.format(
                        i18n.gettext("Image Import: %(fileName)s"),
                        {fileName: batch.fileName},
                    );

                    res.render("ImportImages", {
                        title,
                        batch: cloneModel(batch, i18n),
                        expanded,
                        adminURL,
                    });
                },
            );
        });
    };

    const adminPage = ({source, i18n}, res, next) => {
        async.parallel(
            [
                callback =>
                    ImageImport.find(
                        {source: source._id},
                        null,
                        {sort: {created: "desc"}},
                        callback,
                    ),
                callback =>
                    RecordImport.find(
                        {source: source._id},
                        {
                            state: true,
                            fileName: true,
                            source: true,
                            created: true,
                            modified: true,
                            error: true,
                            "results.result": true,
                            "results.error": true,
                            "results.warnings": true,
                        },
                        {},
                        callback,
                    ),
            ],
            (err, results) => {
                /* istanbul ignore if */
                if (err) {
                    return next(
                        new Error(i18n.gettext("Error retrieving records.")),
                    );
                }

                const imageImport = results[0];
                const dataImport = results[1].sort(
                    (a, b) => b.created - a.created,
                );
                const title = i18n.format(i18n.gettext("%(name)s Admin Area"), {
                    name: source.getFullName(i18n),
                });

                res.render("Admin", {
                    title,
                    source: cloneModel(source, i18n),
                    imageImport: imageImport.map(batch =>
                        cloneModel(batch, i18n),
                    ),
                    dataImport: dataImport.map(batch =>
                        cloneModel(batch, i18n),
                    ),
                });
            },
        );
    };

    return {
        admin(req, res, next) {
            const {query} = req;

            if (query.records) {
                importRecords(req, res, next);
            } else if (query.images) {
                importImages(req, res, next);
            } else {
                adminPage(req, res, next);
            }
        },

        uploadImages(req, res, next) {
            const {source, i18n, lang} = req;

            const form = new formidable.IncomingForm();
            form.encoding = "utf-8";

            form.parse(req, (err, fields, files) => {
                /* istanbul ignore if */
                if (err) {
                    return next(
                        new Error(i18n.gettext("Error processing zip file.")),
                    );
                }

                const zipField = files && files.zipField;

                if (!zipField || !zipField.path || zipField.size === 0) {
                    return next(
                        new Error(i18n.gettext("No zip file specified.")),
                    );
                }

                const zipFile = zipField.path;
                const fileName = zipField.name;

                const batch = ImageImport.fromFile(fileName, source._id);
                batch.zipFile = zipFile;

                batch.save(err => {
                    /* istanbul ignore if */
                    if (err) {
                        return next(
                            new Error(i18n.gettext("Error saving zip file.")),
                        );
                    }

                    res.redirect(source.getAdminURL(lang));
                });
            });
        },

        uploadData(req, res, next) {
            const {source, i18n, lang} = req;

            const form = new formidable.IncomingForm();
            form.encoding = "utf-8";
            form.multiples = true;

            form.parse(req, (err, fields, files) => {
                /* istanbul ignore if */
                if (err) {
                    return next(
                        new Error(i18n.gettext("Error processing data files.")),
                    );
                }

                const inputFiles = (Array.isArray(files.files)
                    ? files.files
                    : files.files
                        ? [files.files]
                        : []
                ).filter(file => file.path && file.size > 0);

                if (inputFiles.length === 0) {
                    return next(
                        new Error(i18n.gettext("No data files specified.")),
                    );
                }

                const fileName = inputFiles.map(file => file.name).join(", ");
                const inputStreams = inputFiles.map(file =>
                    fs.createReadStream(file.path),
                );

                const batch = RecordImport.fromFile(
                    fileName,
                    source._id,
                    source.type,
                );

                batch.setResults(inputStreams, err => {
                    /* istanbul ignore if */
                    if (err) {
                        return next(
                            new Error(i18n.gettext("Error saving data file.")),
                        );
                    }

                    batch.save(err => {
                        /* istanbul ignore if */
                        if (err) {
                            return next(
                                new Error(
                                    i18n.gettext("Error saving data file."),
                                ),
                            );
                        }

                        res.redirect(source.getAdminURL(lang));
                    });
                });
            });
        },

        routes() {
            const source = (req, res, next) => {
                const {
                    params: {source},
                } = req;
                const Source = models("Source");
                req.source = Source.getSource(source);
                next();
            };

            app.get(
                "/:type/source/:source/admin",
                auth,
                canEdit,
                source,
                this.admin,
            );
            app.post(
                "/:type/source/:source/upload-images",
                auth,
                canEdit,
                source,
                this.uploadImages,
            );
            app.post(
                "/:type/source/:source/upload-data",
                auth,
                canEdit,
                source,
                this.uploadData,
            );
        },
    };
};
