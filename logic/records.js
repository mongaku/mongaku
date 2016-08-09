"use strict";

const async = require("async");

const models = require("../lib/models");
const options = require("../lib/options");

module.exports = function(app) {
    const Record = models("Record");
    const Source = models("Source");

    const cache = require("../server/middlewares/cache");
    const search = require("./shared/search");

    return {
        search,

        bySource(req, res) {
            search(req, res, {
                url: req.source.url,
            });
        },

        show(req, res) {
            const compare = ("compare" in req.query);
            const id = `${req.params.source}/${req.params.recordName}`;

            Record.findById(id, (err, record) => {
                if (err || !record) {
                    return res.status(404).render("Error", {
                        title: req.gettext("Not found."),
                    });
                }

                record.loadImages(true, () => {
                    // TODO: Handle error loading images?
                    const title = record.getTitle(req);

                    // Sort the similar records by score
                    record.similarRecords = record.similarRecords
                        .sort((a, b) => b.score - a.score);

                    if (!compare) {
                        return res.render("Record", {
                            title,
                            compare: false,
                            records: [record],
                            similar: record.similarRecords,
                            sources: Source.getSources(),
                        });
                    }

                    async.eachLimit(record.similarRecords, 4,
                        (similar, callback) => {
                            similar.record.loadImages(false, callback);
                        }, () => {
                            res.render("Record", {
                                title,
                                compare: true,
                                noIndex: true,
                                similar: [],
                                records: [record]
                                    .concat(record.similarRecords
                                        .map((similar) => similar.record)),
                                sources: Source.getSources(),
                            });
                        });
                });
            });
        },

        routes() {
            app.get("/search", cache(1), this.search);
            // TODO(jeresig): Make this configurable
            app.get("/artworks/:source/:recordName", this.show);
            app.get("/source/:source", cache(1), this.bySource);

            for (const path in options.searchURLs) {
                app.get(path, cache(1), (req, res) =>
                    options.searchURLs[path](req, res, search));
            }

            // NOTE(jeresig): This is also used by the source admin pages
            // to extract the source from the URL.
            app.param("source", (req, res, next, id) => {
                try {
                    req.source = Source.getSource(id);
                    next();

                } catch (e) {
                    return res.status(404).render("Error", {
                        title: req.gettext("Source not found."),
                    });
                }
            });
        },
    };
};
