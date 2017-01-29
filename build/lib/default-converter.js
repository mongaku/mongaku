"use strict";

var jsonlint = require("jsonlint");
var concat = require("concat-stream");

module.exports = {
    files: ["Upload a JSON file (.json) containing metadata."],

    processFiles: function processFiles(files, callback) {
        files[0].pipe(concat(function (fileData) {
            try {
                var results = jsonlint.parse(fileData.toString("utf8"));
                callback(null, results);
            } catch (err) {
                callback(err);
            }
        }));
    }
};