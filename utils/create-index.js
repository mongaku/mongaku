"use strict";

const request = require("request");

const config = require("../lib/config");
const models = require("../lib/models");

module.exports = (callback) => {
    const Artwork = models("Artwork");

    console.log("Deleting existing index...");

    const esIndexURL = `${config.ELASTICSEARCH_URL}/artworks`;

    request.delete(esIndexURL, () => {
        console.log("Re-building index...");

        Artwork.createMapping((err) => {
            if (err) {
                return callback(err);
            }

            let count = 0;

            Artwork.synchronize()
                .on("data", () => {
                    count += 1;
                    console.log(`Indexed record #${count}`);
                })
                .on("close", callback)
                .on("error", callback);
        });

    });
};
