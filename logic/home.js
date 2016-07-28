"use strict";

const cache = require("../server/middlewares/cache");

const models = require("../lib/models");

module.exports = (app) => {
    const Source = models("Source");

    return {
        index(req, res) {
            const sources = Source.getSources()
                .filter((source) => source.numArtworks > 0);
            let artworkTotal = 0;
            let imageTotal = 0;

            for (const source of sources) {
                artworkTotal += source.numArtworks;
                imageTotal += source.numImages;
            }

            res.render("Home", {
                sources,
                artworkTotal,
                imageTotal,
            });
        },

        routes() {
            app.get("/", cache(1), this.index);
        },
    };
};
