"use strict";

const path = require("path");

const config = require("./config");
const options = require("./default-options");

let optionsFile = config.MONGAKU_OPTIONS;

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
