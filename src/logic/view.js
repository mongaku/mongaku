// @flow

const async = require("async");

const {cloneModel} = require("../lib/clone");
const record = require("../lib/record");
const models = require("../lib/models");
const options = require("../lib/options");

module.exports = function(app: express$Application) {
    const Source = models("Source");

    const show = (
        {i18n, originalUrl, params, query, user}: express$Request,
        res,
        next,
    ) => {
        const typeName = params.type;

        if (!options.types[typeName]) {
            return res.status(404).render("Error", {
                title: i18n.gettext("Page not found."),
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

            if (!record.canView(user)) {
                return res.status(403).send({
                    error: i18n.gettext("Permission denied"),
                });
            }

            record.loadImages(true, () => {
                // TODO: Handle error loading images?
                const title = record.getTitle(i18n);
                const social = {
                    imgURL: record.getOriginalURL(),
                    title,
                    url: record.getURL(),
                };

                const clonedRecord = cloneModel(record, i18n);

                clonedRecord.imageModels = record.images.map(image =>
                    cloneModel(image, i18n),
                );

                // Filter out record matches from sources that the user isn't
                // allowed to see
                const similarRecords = record.similarRecords.filter(match =>
                    match.recordModel.canView(user),
                );

                // Sort the similar records by score
                clonedRecord.similarRecords = similarRecords.sort(
                    (a, b) => b.score - a.score,
                );

                if (!compare) {
                    const formattedSimilarRecords = similarRecords.map(
                        match => ({
                            _id: match._id,
                            score: match.score,
                            recordModel: cloneModel(match.recordModel, i18n),
                        }),
                    );

                    return res.render("Record", {
                        title,
                        social,
                        compare: false,
                        records: [clonedRecord],
                        similar: formattedSimilarRecords,
                        sources: Source.getSourcesByViewableType(
                            user,
                            typeName,
                        ).map(source => cloneModel(source, i18n)),
                    });
                }

                async.eachLimit(
                    similarRecords,
                    4,
                    (similar, callback) => {
                        similar.recordModel.loadImages(false, callback);
                    },
                    () => {
                        const formattedSimilarRecords = similarRecords.map(
                            similar => {
                                const clonedRecord = cloneModel(
                                    similar.recordModel,
                                    i18n,
                                );
                                clonedRecord.imageModels = similar.recordModel.images.map(
                                    image => cloneModel(image, i18n),
                                );
                                return clonedRecord;
                            },
                        );
                        res.render("Record", {
                            title,
                            social,
                            compare: true,
                            noIndex: true,
                            similar: [],
                            records: [clonedRecord].concat(
                                formattedSimilarRecords,
                            ),
                            sources: Source.getSourcesByViewableType(
                                user,
                                typeName,
                            ).map(source => cloneModel(source, i18n)),
                        });
                    },
                );
            });
        });
    };

    const json = (
        {params: {type, source, recordName}, i18n}: express$Request,
        res,
    ) => {
        const id = `${source}/${recordName}`;
        const Record = record(type);

        Record.findById(id, (err, record) => {
            if (record) {
                return res.send(cloneModel(record, i18n));
            }

            res.status(404).send({
                error: i18n.gettext("Record not found."),
            });
        });
    };

    return {
        routes() {
            // Handle these last as they'll catch almost anything
            app.get("/:type/:source/:recordName/json", json);
            app.get("/:type/:source/:recordName", show);
        },
    };
};
