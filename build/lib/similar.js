"use strict";

var config = require("./config");

var similar = void 0;

/* istanbul ignore else */
if (config.PASTEC_URL) {
    similar = require("pastec")({
        server: config.PASTEC_URL
    });
}

// TODO(jeresig): Implement TinEye MatchEngine option

module.exports = similar;