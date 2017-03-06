// @flow

const async = require("async");
const formidable = require("formidable");

const db = require("../lib/db");
const {cloneModel} = require("../lib/clone");
const record = require("../lib/record");
const models = require("../lib/models");
const options = require("../lib/options");
const metadata = require("../lib/metadata");
const urls = require("../lib/urls")(options);

module.exports = function(app: express$Application) {
    const Image = models("Image");

    const {auth, canEdit} = require("./shared/auth");

    const removeRecord = (req: express$Request, res, next) => {
        const {params, i18n, lang} = req;
        const {type} = params;
        const Record = record(type);
        const id = `${params.source}/${params.recordName}`;

        Record.findById(id, (err, record) => {
            if (err || !record) {
                return next(new Error(i18n.gettext("Not found.")));
            }

            record.remove((err) => {
                if (err) {
                    return next(new Error(
                        i18n.gettext("Error removing record.")));
                }

                res.redirect(urls.gen(lang, "/"));
            });
        });
    };

    const editView = ({
        params: {type, source, recordName},
        i18n,
    }: express$Request, res) => {
        const Record = record(type);
        const id = `${source}/${recordName}`;

        Record.findById(id, (err, record) => {
            if (err || !record) {
                return res.status(404).render("Error", {
                    title: i18n.gettext("Page not found."),
                });
            }

            const recordTitle = record.getTitle(i18n);
            const title = i18n.format(
                i18n.gettext("Updating '%(recordTitle)s'"),
                    {recordTitle});

            record.loadImages(true, () => {
                Record.getFacets(i18n, (err, globalFacets) => {
                    record.getDynamicValues(i18n, (err, dynamicValues) => {
                        res.render("EditRecord", {
                            title,
                            mode: "edit",
                            record: cloneModel(record, i18n),
                            globalFacets,
                            dynamicValues,
                            type,
                        });
                    });
                });
            });
        });
    };

    const edit = (req: express$Request, res, next) => {
        const {params: {type, recordName, source}, i18n, lang} = req;
        const props = {};
        const model = metadata.model(type);
        const hasImageSearch = options.types[type].hasImageSearch();
        const _id = `${source}/${recordName}`;

        const form = new formidable.IncomingForm();
        form.encoding = "utf-8";
        form.maxFieldsSize = options.maxUploadSize;
        form.multiples = true;

        form.parse(req, (err, fields, files) => {
            /* istanbul ignore if */
            if (err) {
                return next(new Error(
                    i18n.gettext("Error processing upload.")));
            }

            if (fields.removeRecord) {
                return removeRecord(req, res, next);
            }

            for (const prop in model) {
                props[prop] = fields[prop];
            }

            Object.assign(props, {
                id: recordName,
                lang: lang,
                source,
                type,
            });

            const Record = record(type);

            const {data, error} = Record.lintData(props, i18n);

            if (error) {
                return next(new Error(error));
            }

            const mockBatch = {
                _id: db.mongoose.Types.ObjectId().toString(),
                source,
            };

            const images = Array.isArray(files.images) ?
                files.images :
                files.images ?
                    [files.images] :
                    [];

            async.mapSeries(images, (file, callback) => {
                if (!file.path || file.size <= 0) {
                    return process.nextTick(callback);
                }

                Image.fromFile(mockBatch, file, (err, image) => {
                    // TODO: Display better error message
                    if (err) {
                        return callback(
                            new Error(
                                i18n.gettext("Error processing image.")));
                    }

                    image.save((err) => {
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
                            title: i18n.gettext("Not found."),
                        });
                    }

                    record.set(data);

                    for (const prop in model) {
                        if (!fields[prop] && !data[prop]) {
                            record[prop] = undefined;
                        }
                    }

                    record.images = record.images.concat(
                        unfilteredImages
                            .filter((image) => image)
                            .map((image) => image._id));

                    record.save((err) => {
                        if (err) {
                            return next(new Error(
                                i18n.gettext("Error saving record.")));
                        }

                        const finish = () =>
                            res.redirect(record.getURL(lang));

                        if (record.images.length === 0 || !hasImageSearch) {
                            return finish();
                        }

                        // If new images were added then we need to update
                        // their similarity and the similarity of all other
                        // images, as well.
                        Image.queueBatchSimilarityUpdate(mockBatch._id,
                            finish);
                    });
                });
            });
        });
    };

    const removeImage = (req: express$Request, res, next) => {
        const {params: {type, source, recordName}, i18n, lang} = req;
        const Record = record(type);
        const hasImageSearch = options.types[type].hasImageSearch();
        const id = `${source}/${recordName}`;

        const form = new formidable.IncomingForm();
        form.encoding = "utf-8";

        form.parse(req, (err, fields) => {
            /* istanbul ignore if */
            if (err) {
                return next(new Error(
                    i18n.gettext("Error processing request.")));
            }

            const imageID = fields.image;

            Record.findById(id, (err, record) => {
                if (err || !record) {
                    return next(new Error(i18n.gettext("Not found.")));
                }

                record.images = record.images
                    .filter((image) => image !== imageID);

                record.save((err) => {
                    if (err) {
                        return next(new Error(
                            i18n.gettext("Error saving record.")));
                    }

                    const finish = () =>
                        res.redirect(record.getURL(lang));

                    if (!hasImageSearch) {
                        return finish();
                    }

                    record.updateSimilarity(finish);
                });
            });
        });
    };

    return {
        routes() {
            // Handle these last as they'll catch almost anything
            app.get("/:type/:source/:recordName/edit", auth, canEdit,
                editView);
            app.post("/:type/:source/:recordName/edit", auth, canEdit,
                edit);
            app.post("/:type/:source/:recordName/remove-image", auth, canEdit,
                removeImage);
        },
    };
};
