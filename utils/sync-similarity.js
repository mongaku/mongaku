"use strict";

const init = require("../lib/init");
const models = require("../lib/models");

init(() => {
    // Models
    const Artwork = models("Artwork");

    console.log("Finding artwork records...");

    Artwork.find({}, {}, {timeout: true}).stream()
        .on("data", function(artwork) {
            this.pause();

            console.log("Syncing", artwork._id);

            artwork.syncSimilarity((err) => {
                if (err) {
                    return console.error(err);
                }

                artwork.save(() => this.resume());
            });
        })
        .on("close", (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("DONE");
            }
            process.exit(0);
        });
});
