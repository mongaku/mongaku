"use strict";

const path = require("path");

const options = require("./default-options");

let optionsFile = process.argv[2];

if (optionsFile) {
    optionsFile = path.resolve(process.cwd(), optionsFile);
}

if (process.env.NODE_ENV === "test") {
    optionsFile = "../tests/options";
}

if (optionsFile) {
    const customOptions = require(optionsFile);
    Object.assign(options, customOptions);
}

module.exports = options;
