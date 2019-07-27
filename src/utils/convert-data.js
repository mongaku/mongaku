/**
 * Parse a data file, given the specified converter, and return a JSON
 * representation to load into the database.
 */

const fs = require("fs");

const options = require("../lib/options");

module.exports = ([converterName, ...fileNames], callback) => {
    // Import the converter module
    const converter = options.converters[converterName];

    if (!converter) {
        console.error(`Converter not found: ${converterName}.`);
        process.exit(1);
    }

    if (fileNames.length === 0) {
        console.error(`No data file specified.`);
        process.exit(1);
    }

    try {
        const fileStreams = fileNames.map(fileName =>
            fs.createReadStream(fileName),
        );

        converter.processFiles(fileStreams, (err, results) => {
            if (err) {
                callback(err);
            } else {
                console.log(JSON.stringify(results));
                callback();
            }
        });
    } catch (e) {
        console.error(`Error opening files: ${fileNames.join(", ")}.`);
        process.exit(1);
    }
};
