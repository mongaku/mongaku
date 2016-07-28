"use strict";

const dotenv = require("dotenv");

dotenv.config({
    path: "../.env",
    silent: true,
});

const required = [
    "MONGODB_URL",
    "ELASTICSEARCH_URL",
    "PASTEC_URL",
];

const config = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: "3000",

    MONGODB_URL: "",
    ELASTICSEARCH_URL: "",
    PASTEC_URL: "",

    GM_PATH: "",

    S3_STATIC_BUCKET: "",
    S3_KEY: "",
    S3_SECRET: "",

    BASE_URL: "",
    BASE_DATA_URL: "/data",
    BASE_DATA_DIR: "",

    THUMB_SIZE: "220x220",
    SCALED_SIZE: "440x440",
    DEFAULT_UNIT: "mm",
    DEFAULT_SEARCH_UNIT: "cm",

    USE_I18N_SUBDOMAIN: "0",
    NO_INDEX: "",

    DEFAULT_START_DATE: "",
    DEFAULT_END_DATE: "",
    DEFAULT_ROWS: "100",
    DEFAULT_SORT: "dateAsc",

    MAX_UPLOAD_SIZE: "10485760",
};

/* istanbul ignore if */
if (config.NODE_ENV !== "test") {
    // Load in configuration options
    dotenv.load();
}

for (const envName in config) {
    if (envName in process.env) {
        config[envName] = process.env[envName];
    }
}

/* istanbul ignore if */
if (config.NODE_ENV !== "test") {
    for (const envName of required) {
        if (!config[envName]) {
            console.error(`ENV ${envName} not specified.`);
            process.exit(1);
        }
    }
}

module.exports = config;
