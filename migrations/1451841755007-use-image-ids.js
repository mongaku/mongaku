"use strict";

const init = require("../lib/init");
const models = require("../lib/models");

exports.up = (next) => {
    init(() => {
        models("Artwork").find({}, {}, {timeout: true}).stream()
            .on("data", function(artwork) {
                this.pause();

                console.log(`Migrating ${artwork._id}...`);

                artwork.images.forEach((image) => {
                    image._id = image.imageName;
                    image.similarImages.forEach((match) => {
                        match._id = match.id;
                    });
                });

                artwork.similarArtworks.forEach((similar) => {
                    similar._id = similar.artwork;
                    similar.images = similar.imageNames;
                });

                // Remove collections that don't have any useful data
                artwork.collections = artwork.collections
                    .filter((item) => item.name || item.city || item.country);

                artwork.dates = artwork.dateCreateds;
                artwork.locations = artwork.collections;

                artwork.save((err) => {
                    if (err) {
                        console.error(artwork._id,
                            JSON.stringify(err, null, "    "));
                        return;
                    }

                    this.resume();
                });
            })
            .on("close", next);
    });
};

exports.down = (next) => {
    next();
};
