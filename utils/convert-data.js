"use strict";

/**
 * Parse a data file, given the specified converter, and return a JSON
 * representation to load into the database.
 */

const fs = require("fs");
const path = require("path");

const init = require("../lib/init");
const models = require("../lib/models");

const sourceName = process.argv[2];
const sources = require("../config/data.sources.json");

init(() => {
    const source = models("Source").getSource(sourceName);
    const options = sources.find((item) => item.source === sourceName);

    if (!options) {
        console.error("Source not found in data.config.json.");
        process.exit(0);
    }

    // Import the converter module
    const converter = source.getConverter();

    options.dataFiles = options.dataFiles.map((file) =>
        path.resolve(__dirname, "..", file));

    options.dataFiles.forEach((file) => {
        if (!fs.existsSync(file)) {
            console.error(`Error: Data file not found: ${file}`);
            process.exit(0);
        }
    });

    // Start a stream for the source's data file
    const fileStreams = options.dataFiles.map(
        (file) => fs.createReadStream(file));

    converter.processFiles(fileStreams, (err, results) => {
        if (err) {
            console.error(err);
        } else {
            console.log(JSON.stringify(results));
        }
        process.exit(0);
    });
});
