"use strict";

const fs = require("fs");

const async = require("async");

const init = require("../lib/init");
const models = require("../lib/models");

const sources = require("../config/data.sources.json");

const mapping = {};
const artworkBatches = {};
const imageBatches = {};

const genBatches = (callback) => {
    const ArtworkImport = models("ArtworkImport");
    const ImageImport = models("ImageImport");

    console.log("Generating Batches...");

    sources.forEach((sourceObj) => {
        const source = sourceObj.source;

        artworkBatches[source] = new ArtworkImport({
            _id: `${source}/${Date.now()}`,
            source,
            fileName: `${source}.json`,
            state: "completed",
            results: [],
        });

        imageBatches[source] = new ImageImport({
            _id: `${source}/${Date.now()}`,
            source,
            zipFile: `/tmp/${source}.zip`,
            fileName: `${source}.zip`,
            state: "completed",
            results: [],
        });
    });

    saveBatches(callback);
};

const saveBatches = (callback) => {
    console.log("Saving batches...");

    async.eachLimit(sources, 1, (sourceObj, callback) => {
        const source = sourceObj.source;

        artworkBatches[source].save((err) => {
            if (err) {
                console.error(err);
                return callback(err);
            }

            imageBatches[source].save((err) => {
                if (err) {
                    console.error(err);
                }

                callback(err);
            });
        });
    }, callback);
};

const genHashes = (callback) => {
    async.eachLimit(sources, 1, (source, callback) => {
        const images = fs.readdirSync(source.imageDir);

        console.log(`Processing ${source.name}...`);

        async.eachLimit(images, 2, (fileName, callback) => {
            /*
            const file = path.resolve(source.imageDir, fileName);

            images.hashImage(file, (err, hash) => {
                if (err) {
                    console.error("Error hashing:", file);
                    return callback();
                }

                mapping[hash] = {
                    _id: `${source.source}/${fileName}`,
                    fileName,
                };
                callback();
            });
            */
            callback();
        }, callback);
    }, callback);
};

const loadImages = (callback) => {
    models("Artwork").find({}, {}, {timeout: true}).stream()
        .on("data", function(artwork) {
            this.pause();

            const source = artwork.source;

            console.log(`Migrating ${artwork._id}...`);

            artwork.imageRefs = [];

            async.eachLimit(artwork.images, 1, (image, callback) => {
                const fileName = mapping[image._id].fileName;
                const _id = `${source}/${fileName}`;
                const date = artwork.created;

                if (!fileName) {
                    console.error("No file found:", _id);
                    return callback();
                }

                // TODO: Update syncSimilarity to get the true image ID

                const newImage = new Image({
                    _id,
                    created: date,
                    modified: date,
                    source,
                    fileName,
                    hash: image._id,
                    width: image.width,
                    height: image.height,
                    similarImages: image.similarImages.map((similar) => ({
                        _id: mapping[similar._id]._id,
                        score: similar.score,
                    })),
                });

                if (!artwork.defaultImageHash) {
                    artwork.defaultImageHash = newImage.hash;
                }

                artwork.imageRefs.push(_id);

                const batch = imageBatches[source];

                batch.results.push({
                    _id: image._id,
                    model: image._id,
                    state: "completed",
                    fileName,
                });

                newImage.batch = batch._id;
                newImage.save((err) => {
                    if (err) {
                        console.error("Error saving:", err);
                    }
                    callback();
                });
            }, () => {
                const batch = artworkBatches[source];

                batch.results.push({
                    _id: artwork._id,
                    model: artwork._id,
                    result: "created",
                    state: "completed",
                    data: {},
                });

                artwork.batch = batch._id;
                artwork.save((err) => {
                    if (err) {
                        console.log("Error saving:", err);
                    }

                    this.resume();
                });
            });
        })
        .on("close", callback);
};

exports.up = (next) => {
    init(() => {
        genBatches(() =>
            genHashes(() =>
                loadImages(() =>
                    saveBatches(next))));
    });
};

exports.down = (next) => {
    next();
};
