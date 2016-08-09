"use strict";

const cache = require("../server/middlewares/cache");

const models = require("../lib/models");

module.exports = (app) => {
    const Source = models("Source");

    return {
        index(req, res) {
            const sources = Source.getSources()
                .filter((source) => source.numRecords > 0);
            let recordTotal = 0;
            let imageTotal = 0;

            for (const source of sources) {
                recordTotal += source.numRecords;
                imageTotal += source.numImages;
            }

            res.render("Home", {
                sources,
                recordTotal,
                imageTotal,
            });
        },

        routes() {
            app.get("/", cache(1), this.index);
        },
    };
};
