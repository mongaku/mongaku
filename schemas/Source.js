"use strict";

const async = require("async");

const record = require("../lib/record");
const models = require("../lib/models");
const db = require("../lib/db");
const urls = require("../lib/urls");
const options = require("../lib/options");
const defaultConverter = require("../lib/default-converter");

let sourceCache = [];

const Source = new db.schema({
    // A short ID (e.g. "frick")
    _id: String,

    // The type of the record
    type:  {
        type: String,
        required: true,
    },

    // The URL to associate with the source
    url: String,

    // The full name of the source (e.g. "Frick Art Reference Library")
    name: {
        type: String,
        required: true,
    },

    // A short name (e.g. "Frick")
    shortName: {
        type: String,
        required: true,
    },

    // The name of the converter to use on the data when importing
    converter: {
        type: String,
        default: "default",
    },
});

Source.methods = {
    getURL(locale) {
        return urls.gen(locale, `/${this.type}/source/${this._id}`);
    },

    getAdminURL(locale) {
        return `${this.getURL(locale)}/admin`;
    },

    getDirBase() {
        return urls.genLocalFile(this._id);
    },

    getFullName() {
        return this.name;
    },

    getShortName() {
        return this.shortName;
    },

    getConverter() {
        const converter = this.converter || "default";
        const converters = Object.assign({
            default: defaultConverter,
        }, options.converters);

        /* istanbul ignore if */
        if (!converters[converter]) {
            throw new Error(`Error: Converter not found: ${converter}`);
        }

        // Return the converter module
        return converters[converter];
    },

    getExpectedFiles() {
        return this.getConverter().files;
    },

    processFiles(files, callback) {
        this.getConverter().processFiles(files, callback);
    },

    cacheTotals(callback) {
        record(this.type).aggregate([
            {
                $match: {
                    source: this._id,
                },
            },
            {
                $group: {
                    _id: null,
                    total: {$sum: 1},
                    totalImages: {$sum: {$size: "$images"}},
                },
            },
        ], (err, results) => {
            if (results && results[0]) {
                this.numRecords = results[0].total;
                this.numImages = results[0].totalImages;
            } else {
                this.numRecords = 0;
                this.numImages = 0;
            }
            callback();
        });
    },
};

Source.statics = {
    cacheSources(callback) {
        models("Source").find({}, (err, sources) => {
            sourceCache = sources;

            async.eachLimit(sources, 2, (source, callback) => {
                source.cacheTotals(callback);
            }, () => {
                callback(err, sources);
            });
        });
    },

    getSources() {
        return sourceCache;
    },

    getSourcesByType(type) {
        return this.getSources().filter((source) => source.type === type);
    },

    getSource(sourceName) {
        const sources = this.getSources();

        for (const source of sources) {
            if (source._id === sourceName) {
                return source;
            }
        }

        throw new Error(`Source not found: ${sourceName}`);
    },
};

module.exports = Source;
