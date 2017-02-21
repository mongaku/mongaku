"use strict";

const async = require("async");
const formidable = require("formidable");

const db = require("../lib/db");
const { cloneModel } = require("../lib/clone");
const record = require("../lib/record");
const models = require("../lib/models");
const options = require("../lib/options");
const metadata = require("../lib/metadata");
const urls = require("../lib/urls")(options);

module.exports = function (app) {
    const Source = models("Source");
    const Image = models("Image");

    const cache = require("../server/middlewares/cache");
    const search = require("./shared/search-page");
    const auth = require("./shared/auth");

    return {
        search(req, res, next) {
            return search(req, res, next);
        },

        bySource(req, res, next) {
            const { i18n, params } = req;

            try {
                search(req, res, next, {
                    url: Source.getSource(params.source).url
                });
            } catch (e) {
                return res.status(404).render("Error", {
                    title: i18n.gettext("Source not found.")
                });
            }
        },

        show({ i18n, originalUrl, params, query }, res, next) {
            const typeName = params.type;

            if (!options.types[typeName]) {
                return res.status(404).render("Error", {
                    title: i18n.gettext("Page not found.")
                });
            }

            if (options.types[typeName].alwaysEdit) {
                return res.redirect(`${originalUrl}/edit`);
            }

            const Record = record(typeName);
            const compare = "compare" in query;
            const id = `${params.source}/${params.recordName}`;

            Record.findById(id, (err, record) => {
                if (err || !record) {
                    // We don't return a 404 here to allow this to pass
                    // through to other handlers
                    return next();
                }

                record.loadImages(true, () => {
                    // TODO: Handle error loading images?
                    const title = record.getTitle(i18n);
                    const social = {
                        imgURL: record.getOriginalURL(),
                        title,
                        url: record.getURL()
                    };

                    const clonedRecord = cloneModel(record, i18n);

                    clonedRecord.imageModels = record.images.map(image => cloneModel(image));

                    // Sort the similar records by score
                    clonedRecord.similarRecords = record.similarRecords.sort((a, b) => b.score - a.score);

                    if (!compare) {
                        const similarRecords = record.similarRecords.map(match => ({
                            _id: match._id,
                            score: match.score,
                            recordModel: cloneModel(match.recordModel, i18n)
                        }));

                        return res.render("Record", {
                            title,
                            social,
                            compare: false,
                            records: [clonedRecord],
                            similar: similarRecords,
                            sources: Source.getSourcesByType(typeName).map(source => cloneModel(source, i18n))
                        });
                    }

                    async.eachLimit(record.similarRecords, 4, (similar, callback) => {
                        similar.recordModel.loadImages(false, callback);
                    }, () => {
                        const similarRecords = record.similarRecords.map(similar => {
                            const clonedRecord = cloneModel(similar.recordModel, i18n);
                            clonedRecord.imageModels = record.images.map(image => cloneModel(image));
                            return clonedRecord;
                        });
                        res.render("Record", {
                            title,
                            social,
                            compare: true,
                            noIndex: true,
                            similar: [],
                            records: [clonedRecord].concat(similarRecords),
                            sources: Source.getSourcesByType(typeName).map(source => cloneModel(source, i18n))
                        });
                    });
                });
            });
        },

        editView({ params, i18n }, res) {
            const type = params.type;
            const Record = record(type);
            const id = `${params.source}/${params.recordName}`;

            Record.findById(id, (err, record) => {
                if (err || !record) {
                    return res.status(404).render("Error", {
                        title: i18n.gettext("Not found.")
                    });
                }

                const recordTitle = record.getTitle(i18n);
                const title = i18n.format(i18n.gettext("Updating '%(recordTitle)s'"), { recordTitle });

                record.loadImages(true, () => {
                    Record.getFacets(i18n, (err, globalFacets) => {
                        record.getDynamicValues(i18n, (err, dynamicValues) => {
                            res.render("EditRecord", {
                                title,
                                mode: "edit",
                                record: cloneModel(record, i18n),
                                globalFacets,
                                dynamicValues,
                                type
                            });
                        });
                    });
                });
            });
        },

        edit(req, res, next) {
            const { params, i18n, lang } = req;
            const props = {};
            const { type } = params;
            const model = metadata.model(type);
            const hasImageSearch = options.types[type].hasImageSearch();
            const id = params.recordName;
            const _id = `${params.source}/${id}`;

            const form = new formidable.IncomingForm();
            form.encoding = "utf-8";
            form.maxFieldsSize = options.maxUploadSize;
            form.multiples = true;

            form.parse(req, (err, fields, files) => {
                /* istanbul ignore if */
                if (err) {
                    return next(new Error(i18n.gettext("Error processing upload.")));
                }

                for (const prop in model) {
                    props[prop] = fields[prop];
                }

                Object.assign(props, {
                    id,
                    lang: lang,
                    source: params.source,
                    type
                });

                const Record = record(type);

                const { data, error } = Record.lintData(props, i18n);

                if (error) {
                    return next(new Error(error));
                }

                const mockBatch = {
                    _id: db.mongoose.Types.ObjectId().toString(),
                    source: params.source
                };

                const images = Array.isArray(files.images) ? files.images : files.images ? [files.images] : [];

                async.mapSeries(images, (file, callback) => {
                    if (!file.path || file.size <= 0) {
                        return process.nextTick(callback);
                    }

                    Image.fromFile(mockBatch, file, (err, image) => {
                        // TODO: Display better error message
                        if (err) {
                            return callback(new Error(i18n.gettext("Error processing image.")));
                        }

                        image.save(err => {
                            /* istanbul ignore if */
                            if (err) {
                                return callback(err);
                            }

                            callback(null, image);
                        });
                    });
                }, (err, unfilteredImages) => {
                    if (err) {
                        return next(err);
                    }

                    Record.findById(_id, (err, record) => {
                        if (err || !record) {
                            return res.status(404).render("Error", {
                                title: i18n.gettext("Not found.")
                            });
                        }

                        record.set(data);

                        for (const prop in model) {
                            if (!fields[prop] && !data[prop]) {
                                record[prop] = undefined;
                            }
                        }

                        record.images = record.images.concat(unfilteredImages.filter(image => image).map(image => image._id));

                        record.save(err => {
                            if (err) {
                                return next(new Error(i18n.gettext("Error saving record.")));
                            }

                            const finish = () => res.redirect(record.getURL(lang));

                            if (record.images.length === 0 || !hasImageSearch) {
                                return finish();
                            }

                            // If new images were added then we need to update
                            // their similarity and the similarity of all other
                            // images, as well.
                            Image.queueBatchSimilarityUpdate(mockBatch._id, finish);
                        });
                    });
                });
            });
        },

        removeImage(req, res, next) {
            const { params, i18n, lang } = req;
            const { type } = params;
            const Record = record(type);
            const hasImageSearch = options.types[type].hasImageSearch();
            const id = `${params.source}/${params.recordName}`;

            const form = new formidable.IncomingForm();
            form.encoding = "utf-8";

            form.parse(req, (err, fields) => {
                /* istanbul ignore if */
                if (err) {
                    return next(new Error(i18n.gettext("Error processing request.")));
                }

                const imageID = fields.image;

                Record.findById(id, (err, record) => {
                    if (err || !record) {
                        return next(new Error(i18n.gettext("Not found.")));
                    }

                    record.images = record.images.filter(image => image !== imageID);

                    record.save(err => {
                        if (err) {
                            return next(new Error(i18n.gettext("Error saving record.")));
                        }

                        const finish = () => res.redirect(record.getURL(lang));

                        if (!hasImageSearch) {
                            return finish();
                        }

                        record.updateSimilarity(finish);
                    });
                });
            });
        },

        facets({ i18n, params: { type } }, res, next) {
            const Record = record(type);

            Record.getFacets(i18n, (err, facets) => {
                if (err) {
                    return next(new Error(i18n.gettext("Error processing request.")));
                }

                res.json(facets);
            });
        },

        cloneView({ i18n, params }, res) {
            const { type } = params;
            const Record = record(type);
            const id = `${params.source}/${params.recordName}`;

            Record.findById(id, (err, oldRecord) => {
                if (err || !oldRecord) {
                    return res.status(404).render("Error", {
                        title: i18n.gettext("Not found.")
                    });
                }

                const recordTitle = record.getTitle(i18n);
                const title = i18n.format(i18n.gettext("Cloning '%(recordTitle)s'"), { recordTitle });

                const data = {
                    type,
                    source: oldRecord.source,
                    lang: oldRecord.lang
                };

                for (const typeName of options.types[type].cloneFields) {
                    data[typeName] = oldRecord[typeName];
                }

                const record = new Record(data);

                record.loadImages(true, () => {
                    Record.getFacets(i18n, (err, globalFacets) => {
                        record.getDynamicValues(i18n, (err, dynamicValues) => {
                            res.render("EditRecord", {
                                title,
                                mode: "clone",
                                record: cloneModel(record, i18n),
                                globalFacets,
                                dynamicValues,
                                type
                            });
                        });
                    });
                });
            });
        },

        createRedirect({ user, params: { type }, lang, i18n }, res) {
            const sources = user.getEditableSourcesByType(type);

            if (sources.length === 1) {
                return res.redirect(urls.gen(lang, `/${type}/${sources[0]._id}/create`));
            }

            // TODO(jeresig): Figure out a better way to handle multiple sources
            res.status(404).render("Error", {
                error: i18n.gettext("Page not found.")
            });
        },

        createView({ params: { type }, i18n }, res) {
            const Record = record(type);

            const title = i18n.format(i18n.gettext("%(recordName)s: Create New"), {
                recordName: options.types[type].name
            });

            Record.getFacets(i18n, (err, globalFacets) => {
                res.render("EditRecord", {
                    title,
                    mode: "create",
                    type,
                    globalFacets,
                    dynamicValues: {}
                });
            });
        },

        create(req, res, next) {
            const { params, i18n, lang } = req;
            const props = {};
            const { type } = params;
            const model = metadata.model(type);
            const hasImageSearch = options.types[type].hasImageSearch();

            const form = new formidable.IncomingForm();
            form.encoding = "utf-8";
            form.maxFieldsSize = options.maxUploadSize;
            form.multiples = true;

            form.parse(req, (err, fields, files) => {
                /* istanbul ignore if */
                if (err) {
                    return next(new Error(i18n.gettext("Error processing upload.")));
                }

                for (const prop in model) {
                    props[prop] = fields[prop];
                }

                if (options.types[type].autoID) {
                    props.id = db.mongoose.Types.ObjectId().toString();
                } else {
                    props.id = fields.id;
                }

                Object.assign(props, {
                    lang,
                    source: params.source,
                    type
                });

                const Record = record(type);

                const { data, error } = Record.lintData(props, i18n);

                if (error) {
                    return next(new Error(error));
                }

                const newRecord = new Record(data);

                const mockBatch = {
                    _id: db.mongoose.Types.ObjectId().toString(),
                    source: newRecord.source
                };

                const images = Array.isArray(files.images) ? files.images : files.images ? [files.images] : [];

                async.mapSeries(images, (file, callback) => {
                    if (!file.path || file.size <= 0) {
                        return process.nextTick(callback);
                    }

                    Image.fromFile(mockBatch, file, (err, image) => {
                        // TODO: Display better error message
                        if (err) {
                            return callback(new Error(i18n.gettext("Error processing image.")));
                        }

                        image.save(err => {
                            /* istanbul ignore if */
                            if (err) {
                                return callback(err);
                            }

                            callback(null, image);
                        });
                    });
                }, (err, unfilteredImages) => {
                    if (err) {
                        return next(err);
                    }

                    newRecord.images = unfilteredImages.filter(image => image).map(image => image._id);

                    newRecord.save(err => {
                        if (err) {
                            return next(new Error(i18n.gettext("Error saving record.")));
                        }

                        const finish = () => res.redirect(newRecord.getURL(lang));

                        if (newRecord.images.length === 0 || !hasImageSearch) {
                            return finish();
                        }

                        // If new images were added then we need to update
                        // their similarity and the similarity of all other
                        // images, as well.
                        Image.queueBatchSimilarityUpdate(mockBatch._id, finish);
                    });
                });
            });
        },

        json({ params, i18n }, res) {
            const id = `${params.source}/${params.recordName}`;
            const type = params.type;
            const Record = record(type);

            Record.findById(id, (err, record) => {
                if (record) {
                    return res.send(cloneModel(record));
                }

                res.status(404).send({
                    error: i18n.gettext("Record not found.")
                });
            });
        },

        routes() {
            app.get("/:type/search", cache(1), this.search);
            app.get("/:type/facets", cache(1), this.facets);
            app.get("/:type/create", auth, this.createRedirect);
            app.get("/:type/source/:source", cache(1), this.bySource);
            app.get("/:type/:source/create", auth, this.createView);
            app.post("/:type/:source/create", auth, this.create);

            for (const typeName in options.types) {
                const searchURLs = options.types[typeName].searchURLs;
                for (const path in searchURLs) {
                    app.get(`/:type${path}`, cache(1), (req, res, next) => searchURLs[path](req, res, next, search));
                }
            }

            // Handle these last as they'll catch almost anything
            app.get("/:type/:source/:recordName/edit", auth, this.editView);
            app.post("/:type/:source/:recordName/edit", auth, this.edit);
            app.get("/:type/:source/:recordName/clone", auth, this.cloneView);
            app.post("/:type/:source/:recordName/remove-image", auth, this.removeImage);
            app.get("/:type/:source/:recordName/json", this.json);
            app.get("/:type/:source/:recordName", this.show);
        }
    };
};