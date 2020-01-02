const fs = require("fs");
const path = require("path");

const rl = require("readline-sync");

const models = require("../lib/models");
const options = require("../lib/options");

module.exports = (args, callback) => {
    const types = Object.keys(options.types);

    const _id = rl.question("Source ID (e.g. frick): ");
    const name = rl.question("Full Name (e.g. Frick Library): ");
    const shortName = rl.question("Short Name (e.g. Frick): ");
    const url = rl.question("URL (http://...): ");
    const isPrivate = rl.keyInYN("Private?: ");
    const type = rl.question(`Data Type (${types.join(", ")}): `);
    const converter = rl.question("Data Convertor [default]: ", {
        defaultInput: "default",
    });

    const Source = models("Source");
    const source = new Source({
        _id,
        name,
        shortName,
        url,
        private: isPrivate,
        type,
        converter,
    });

    source.save(err => {
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
