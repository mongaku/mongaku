"use strict";

const jsonlint = require("jsonlint");
const concat = require("concat-stream");

module.exports = {
    files: ["Upload a JSON file (.json) containing metadata."],

    processFiles(files, callback) {
        files[0].pipe(concat(fileData => {
            try {
                const results = jsonlint.parse(fileData.toString("utf8"));
                callback(null, results);
            } catch (err) {
                callback(err);
            }
        }));
    }
};