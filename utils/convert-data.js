"use strict";

/**
 * Parse a data file, given the specified converter, and return a JSON
 * representation to load into the database.
 */

const fs = require("fs");

const options = require("../lib/options");

module.exports = ([converterName, fileName], callback) => {
    // Import the converter module
    const converter = options.converters[converterName];

    converter.processFiles([fs.createReadStream(fileName)], (err, results) => {
        if (err) {
            callback(err);
        } else {
            console.log(JSON.stringify(results));
            callback();
        }
    });
};
