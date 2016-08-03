"use strict";

const fs = require("fs");
const path = require("path");

const dotenv = require("dotenv");

const required = [
    "MONGODB_URL",
    "ELASTICSEARCH_URL",
    "PASTEC_URL",
];

const config = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: "3000",

    MONGODB_URL: "mongodb://localhost/mongaku",
    ELASTICSEARCH_URL: "http://127.0.0.1:9200",
    PASTEC_URL: "localhost:4212",

    BASE_URL: "",
    BASE_DATA_URL: "/data",
    BASE_DATA_DIR: "data",

    MONGAKU_OPTIONS: "",

    GM_PATH: "",
};

/* istanbul ignore if */
if (config.NODE_ENV !== "test") {
    // Load in configuration options
    dotenv.config({
        path: path.resolve(process.cwd(), ".mongaku"),
        silent: true,
    });
}

for (const envName in config) {
    if (envName in process.env) {
        config[envName] = process.env[envName];
    }
}

// Resolve the base data directory relative to the current working directory
// This allows for the configuration to use a relative path
config.BASE_DATA_DIR = path.resolve(process.cwd(), config.BASE_DATA_DIR);

if (config.NODE_ENV !== "test") {
    try {
        fs.statSync(config.BASE_DATA_DIR).isDirectory();

    } catch (e) {
        console.error(`${config.BASE_DATA_DIR} does not exist.`);
        process.exit(1);
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
