/**
 * Parse a data file, given the specified converter, and return a JSON
 * representation to load into the database.
 */

const fs = require("fs");

const options = require("../lib/options");

module.exports = ([converterName, fileName], callback) => {
    // Import the converter module
    const converter = options.converters[converterName];

    if (!converter) {
        console.error(`Converter not found: ${converterName}.`);
        process.exit(1);
    }

    if (!fileName) {
        console.error(`No data file specified.`);
        process.exit(1);
    }

    try {
        const fileStream = fs.createReadStream(fileName);

        converter.processFiles([fileStream], (err, results) => {
            if (err) {
                callback(err);
            } else {
                console.log(JSON.stringify(results));
                callback();
            }
        });
    } catch (e) {
        console.error(`Error opening file: ${fileName}.`);
        process.exit(1);
    }
};
