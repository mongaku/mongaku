"use strict";

const init = require("../lib/init");
const models = require("../lib/models");

exports.up = (next) => {
    init(() => {
        models("Artwork").find({}, {}, {timeout: true}).stream()
            .on("data", function(artwork) {
                this.pause();

                console.log(`Migrating ${artwork._id}...`);
                artwork.images = artwork.imageRefs;
                artwork.save(() => this.resume());
            })
            .on("close", next);
    });
};

exports.down = (next) => {
    next();
};
