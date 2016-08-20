"use strict";

const fs = require("fs");
const path = require("path");

const rl = require("readline-sync");

const models = require("../lib/models");

module.exports = (args, callback) => {
    const _id = rl.question("Source ID (e.g. frick): ");
    const name = rl.question("Full Name (e.g. Frick Library): ");
    const shortName = rl.question("Short Name (e.g. Frick): ");
    const url = rl.question("URL (http://...): ");
    const convertor = rl.question("Data Convertor [default]: ", {
        defaultInput: "default",
    });

    const Source = models("Source");
    const source = new Source({
        _id,
        name,
        shortName,
        url,
        convertor,
    });

    source.save((err) => {
        if (err) {
            return callback(err);
        }

        // Create directories to hold images
        const dir = source.getDirBase();
        fs.mkdirSync(dir);
        fs.mkdirSync(path.join(dir, "images"));
        fs.mkdirSync(path.join(dir, "scaled"));
        fs.mkdirSync(path.join(dir, "thumbs"));

        console.log(`Source Created: ${_id}`);

        callback();
    });
};
