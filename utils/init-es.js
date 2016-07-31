"use strict";

/*
 * Run this to delete the existing index.
 *   curl -XDELETE 'http://127.0.0.1:9200/artworks'
 */

const init = require("../lib/init");
const models = require("../lib/models");

init(() => {
    console.log("Re-building index...");

    const Artwork = models("Artwork");

    Artwork.createMapping((err) => {
        if (err) {
            return console.error(err);
        }

        let count = 0;

        Artwork.synchronize()
            .on("data", () => {
                count++;
                console.log(`indexed ${count}`);
            })
            .on("close", () => {
                process.exit(0);
            })
            .on("error", (err) => {
                console.log(err);
            });
    });
});
