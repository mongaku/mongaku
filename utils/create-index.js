"use strict";

const request = require("request");

const config = require("../lib/config");
const models = require("../lib/models");

module.exports = (callback) => {
    const Record = models("Record");

    console.log("Deleting existing index...");

    // TODO(jeresig): Make this configurable
    const esIndexURL = `${config.ELASTICSEARCH_URL}/artworks`;

    request.delete(esIndexURL, () => {
        console.log("Re-building index...");

        Record.createMapping((err) => {
            if (err) {
                return callback(err);
            }

            let count = 0;

            Record.synchronize()
                .on("data", () => {
                    count += 1;
                    console.log(`Indexed record #${count}`);
                })
                .on("close", callback)
                .on("error", callback);
        });

    });
};
