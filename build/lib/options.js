"use strict";

var fs = require("fs");
var path = require("path");

var options = require("./default-options");
var recordOptions = require("./default-record-options");

var loadFile = true;
var optionsFile = path.resolve(process.cwd(), "mongaku.js");

if (process.env.NODE_ENV === "test") {
    optionsFile = "../tests/options.js";
} else {
    try {
        // Detect if the file exists, throwing an exception if it does not
        fs.statSync(optionsFile);
    } catch (e) {
        console.warn("No options file found: mongaku.js not located.");
        loadFile = false;
    }
}

if (loadFile) {
    // If it exists, load in the options from it...
    var customOptions = require(optionsFile);
    Object.assign(options, customOptions);
}

for (var typeName in options.types) {
    options.types[typeName] = Object.assign({}, recordOptions, options.types[typeName]);
}

module.exports = options;