"use strict";

const config = require("./config");

let similar;

/* istanbul ignore else */
if (config.PASTEC_URL) {
    similar = require("pastec")({
        server: config.PASTEC_URL,
    });
}

// TODO(jeresig): Implement TinEye MatchEngine option

/* istanbul ignore if */
if (!similar) {
    console.error("No image similarity engine specified.");
}

module.exports = similar;
