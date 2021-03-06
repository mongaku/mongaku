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

            const filteredResults = batch.getFilteredResults();
            const {expanded} = query;

            for (const name of Object.keys(filteredResults)) {
                if (!expanded || expanded !== name) {
                    filteredResults[name] = filteredResults[name].slice(0, 8);
                }
            }

            const title = i18n.format(
                i18n.gettext("Data Import: %(fileName)s"),
                {fileName: batch.fileName},
            );

            delete cloned.results;
            delete cloned.getFilteredResults;
            cloned.getFilteredResults = filteredResults;

            res.render("ImportRecords", {
                title,
                batch: cloned,
                expanded,
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

            const filteredResults = batch.getFilteredResults();
            const {expanded} = query;

            for (const name of Object.keys(filteredResults)) {
                if (!expanded || expanded !== name) {
                    filteredResults[name] = filteredResults[name].slice(0, 8);
                }
            }

            async.eachLimit(
                filteredResults.models,
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

                    const cloned = cloneModel(batch, i18n);
                    delete cloned.results;
                    delete cloned.getFilteredResults;
                    cloned.getFilteredResults = filteredResults;

                    res.render("ImportImages", {
                        title,
                        batch: cloned,
                        expanded,
                        adminURL,
                    });
                },
            );
        });
    };

    const adminPage = ({source, i18n}, res, next) => {
        const Image = models("Image");
        const Record = record(source.type);

        async.parallel(
            [
                callback =>
                    ImageImport.find(
                        {source: source._id},
                        {
                            state: true,
                            fileName: true,
                            source: true,
                            created: true,
                            modified: true,
                            error: true,
                            "results.model": true,
                            "results.error": true,
                            "results.warnings": true,
                        },
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
                callback => Image.count({source: source._id}, callback),
                callback =>
                    Image.count(
                        {source: source._id, needsSimilarIndex: false},
                        callback,
                    ),
                callback =>
                    Image.count(
                        {source: source._id, needsSimilarUpdate: false},
                        callback,
                    ),
                callback => Record.count({source: source._id}, callback),
                callback =>
                    Record.count(
                        {source: source._id, needsSimilarUpdate: false},
                        callback,
                    ),
            ],
            (
                err,
                [
                    imageImport,
                    dataImport,
                    numImages,
                    numImagesIndexed,
                    numImagesUpdated,
                    numRecords,
                    numRecordsUpdated,
                ],
            ) => {
                /* istanbul ignore if */
                if (err) {
                    return next(
                        new Error(i18n.gettext("Error retrieving records.")),
                    );
                }

                const title = i18n.format(i18n.gettext("%(name)s Admin Area"), {
                    name: source.getFullName(i18n),
                });

                res.render("SourceAdmin", {
                    title,
                    source: cloneModel(source, i18n),
                    imageImport: imageImport.map(batch => {
                        const cloned = cloneModel(batch, i18n);
                        delete cloned.results;
                        delete cloned.getFilteredResults;
                        return cloned;
                    }),
                    dataImport: dataImport
                        .sort((a, b) => b.created - a.created)
                        .map(batch => {
                            const cloned = cloneModel(batch, i18n);
                            delete cloned.results;
                            delete cloned.getFilteredResults;
                            return cloned;
                        }),
                    numImages,
                    numImagesIndexed,
                    numImagesUpdated,
                    numRecords,
                    numRecordsUpdated,
                    allImagesImported:
                        imageImport.length > 0 &&
                        imageImport.every(batch => batch.isCompleted()) &&
                        imageImport.some(batch => batch.isSuccessful()) ||
                        dataImport.length > 0,
                    allRecordsImported:
                        dataImport.length > 0 &&
                        dataImport.every(batch => batch.isCompleted()) &&
                        dataImport.some(batch => batch.isSuccessful()),
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

        uploadZipFile(req, res, next) {
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

        uploadDirectory(req, res, next) {
            const {source, i18n, lang} = req;

            const form = new formidable.IncomingForm();
            form.encoding = "utf-8";

            form.parse(req, (err, {directory}) => {
                /* istanbul ignore if */
                if (err) {
                    return next(
                        new Error(i18n.gettext("Error processing directory.")),
                    );
                }

                if (!directory) {
                    return next(
                        new Error(i18n.gettext("No directory specified.")),
                    );
                }

                const batch = ImageImport.fromFile(directory, source._id);
                batch.directory = directory;

                batch.save(err => {
                    /* istanbul ignore if */
                    if (err) {
                        return next(
                            new Error(i18n.gettext("Error saving directory.")),
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
                    false,
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

        updateImageSimilarity(req, res, next) {
            const {source, i18n, lang} = req;
            const Image = models("Image");

            Image.queueBatchSimilarityUpdate(source._id, err => {
                if (err) {
                    return next(
                        new Error(i18n.gettext("Error updating similarity.")),
                    );
                }

                res.redirect(source.getAdminURL(lang));
            });
        },

        updateSource(req, res, next) {
            const {source, i18n, lang} = req;
            const {name, shortName, url, isPrivate} = req.body;

            source.name = name;
            source.shortName = shortName;
            source.url = url;
            source.private = !!isPrivate;

            source.save(err => {
                if (err) {
                    return next(
                        new Error(i18n.gettext("Error updating source.")),
                    );
                }

                // Update the internal source cache
                const Source = models("Source");
                Source.cacheSources(() => {
                    res.redirect(source.getAdminURL(lang));
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
                "/:type/source/:source/upload-zip",
                auth,
                canEdit,
                source,
                this.uploadZipFile,
            );
            app.post(
                "/:type/source/:source/upload-directory",
                auth,
                canEdit,
                source,
                this.uploadDirectory,
            );
            app.post(
                "/:type/source/:source/upload-data",
                auth,
                canEdit,
                source,
                this.uploadData,
            );
            app.post(
                "/:type/source/:source/update-similarity",
                auth,
                canEdit,
                source,
                this.updateImageSimilarity,
            );
            app.post(
                "/:type/source/:source/update",
                auth,
                canEdit,
                source,
                this.updateSource,
            );
        },
    };
};
