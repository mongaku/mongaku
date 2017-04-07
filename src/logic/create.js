// @flow

const async = require("async");
const formidable = require("formidable");

const db = require("../lib/db");
const {cloneModel} = require("../lib/clone");
const record = require("../lib/record");
const models = require("../lib/models");
const options = require("../lib/options");
const metadata = require("../lib/metadata");

module.exports = function(app: express$Application) {
    const Image = models("Image");
    const Source = models("Source");

    const {auth, canEdit} = require("./shared/auth");

    const cloneView = (
        {i18n, params: {type, source, recordName}}: express$Request,
        res
    ) => {
        const Record = record(type);
        const model = metadata.model(type);
        const id = `${source}/${recordName}`;

        Record.findById(id, (err, oldRecord) => {
            if (err || !oldRecord) {
                return res.status(404).render("Error", {
                    title: i18n.gettext("Not found."),
                });
            }

            const recordTitle = oldRecord.getTitle(i18n);
            const title = i18n.format(
                i18n.gettext("Cloning '%(recordTitle)s'"),
                {recordTitle}
            );

            const data = {
                type,
                source: oldRecord.source,
                lang: oldRecord.lang,
            };

            const cloneFields =
                options.types[type].cloneFields || Object.keys(model);

            for (const typeName of cloneFields) {
                data[typeName] = oldRecord[typeName];
            }

            const record = new Record(data);

            record.loadImages(true, () => {
                Record.getFacets(i18n, (err, globalFacets) => {
                    record.getDynamicValues(i18n, (err, dynamicValues) => {
                        const clonedRecord = cloneModel(record, i18n);
                        clonedRecord.imageModels = [];
                        res.render("EditRecord", {
                            title,
                            mode: "clone",
                            record: clonedRecord,
                            source,
                            globalFacets,
                            dynamicValues,
                            type,
                        });
                    });
                });
            });
        });
    };

    const createView = (
        {user, params: {type}, query: {source}, i18n}: express$Request,
        res,
        next
    ) => {
        if (!user) {
            return next();
        }

        const sources = user.getEditableSourcesByType()[type];

        if (sources.length === 0) {
            return res.status(403).render("Error", {
                title: i18n.gettext("Authorization required."),
            });
        }

        const Record = record(type);
        const title = i18n.format(i18n.gettext("%(recordName)s: Create New"), {
            recordName: options.types[type].name(i18n),
        });

        Record.getFacets(i18n, (err, globalFacets) => {
            res.render("EditRecord", {
                title,
                source,
                sources: sources
                    .map(source => Source.getSource(source))
                    .map(source => cloneModel(source, i18n)),
                mode: "create",
                type,
                globalFacets,
                dynamicValues: {},
            });
        });
    };

    const create = (req: express$Request, res, next) => {
        const {params: {type}, i18n, lang} = req;
        const props = {};
        const model = metadata.model(type);
        const typeOptions = options.types[type];
        const hasImageSearch = typeOptions.hasImageSearch();

        const form = new formidable.IncomingForm();
        form.encoding = "utf-8";
        form.maxFieldsSize = options.maxUploadSize;
        form.multiples = true;

        form.parse(req, (err, fields, files) => {
            /* istanbul ignore if */
            if (err) {
                return next(
                    new Error(i18n.gettext("Error processing upload."))
                );
            }

            const images = Array.isArray(files.images)
                ? files.images
                : files.images ? [files.images] : [];

            for (const prop in model) {
                props[prop] = fields[prop];
            }

            if (typeOptions.autoID) {
                props.id = db.mongoose.Types.ObjectId().toString();
            } else {
                props.id = fields.id;
            }

            Object.assign(props, {
                lang,
                source: fields.source,
                type,
                // Hack to help pass validator
                images: images.map(file => file.name).filter(file => file),
            });

            const Record = record(type);

            const {data, error} = Record.lintData(props, i18n);

            if (error) {
                return next(new Error(error));
            }

            const newRecord = new Record(data);

            const mockBatch = {
                _id: db.mongoose.Types.ObjectId().toString(),
                source: newRecord.source,
            };

            async.mapSeries(
                images,
                (file, callback) => {
                    if (!file.path || file.size <= 0) {
                        return process.nextTick(callback);
                    }

                    Image.fromFile(mockBatch, file, (err, image) => {
                        // TODO: Display better error message
                        if (err) {
                            return callback(
                                new Error(
                                    i18n.format(
                                        i18n.gettext(
                                            "Error processing image: %(image)s"
                                        ),
                                        {image: file.name}
                                    )
                                )
                            );
                        }

                        image.save(err => {
                            /* istanbul ignore if */
                            if (err) {
                                return callback(err);
                            }

                            callback(null, image);
                        });
                    });
                },
                (err, unfilteredImages) => {
                    if (err) {
                        return next(err);
                    }

                    const filteredImages = unfilteredImages.filter(
                        image => image
                    );
                    newRecord.images = filteredImages.map(image => image._id);

                    if (typeOptions.hasImages()) {
                        if (filteredImages.length === 0) {
                            // NOTE(jeresig): We shouldn't get to this point,
                            // hopefully we'll error out before then.
                            return next(
                                new Error(
                                    "No valid images found, " +
                                        "images are required."
                                )
                            );
                        }

                        newRecord.defaultImageHash = filteredImages[0].hash;
                    }

                    newRecord.save(err => {
                        if (err) {
                            console.error(`Error saving record: ${err}`);
                            return next(
                                new Error(i18n.gettext("Error saving record."))
                            );
                        }

                        const finish = () =>
                            res.redirect(newRecord.getURL(lang));

                        if (newRecord.images.length === 0 || !hasImageSearch) {
                            return finish();
                        }

                        // If new images were added then we need to update
                        // their similarity and the similarity of all other
                        // images, as well.
                        Image.queueBatchSimilarityUpdate(mockBatch._id, finish);
                    });
                }
            );
        });
    };

    return {
        routes() {
            app.get("/:type/create", auth, canEdit, createView);
            app.post("/:type/create", auth, canEdit, create);
            app.get(
                "/:type/:source/:recordName/clone",
                auth,
                canEdit,
                cloneView
            );
        },
    };
};
