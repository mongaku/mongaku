"use strict";

const async = require("async");
const request = require("request");

const config = require("../lib/config");
const record = require("../lib/record");
const options = require("../lib/options");

module.exports = (callback) => {
    async.eachLimit(Object.keys(options.types), 1, (type, callback) => {
        const Record = record(type);

        console.log(`Deleting existing ${type} index...`);

        // TODO(jeresig): Make this configurable
        const esIndexURL = `${config.ELASTICSEARCH_URL}/${type}`;

        request.delete(esIndexURL, () => {
            console.log(`Re-building ${type} index...`);

            Record.createMapping((err) => {
                if (err) {
                    return callback(err);
                }

                let count = 0;

                Record.synchronize()
                    .on("data", () => {
                        count += 1;
                        console.log(`Indexed ${type} record #${count}`);
                    })
                    .on("close", callback)
                    .on("error", callback);
            });
        });
    }, callback);
};
