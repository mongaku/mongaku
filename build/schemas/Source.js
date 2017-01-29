"use strict";

var async = require("async");

var record = require("../lib/record");
var models = require("../lib/models");
var db = require("../lib/db");
var urls = require("../lib/urls");
var options = require("../lib/options");
var defaultConverter = require("../lib/default-converter");

var sourceCache = [];

var Source = new db.schema({
    // A short ID (e.g. "frick")
    _id: String,

    // The type of the record
    type: {
        type: String,
        required: true
    },

    // The URL to associate with the source
    url: String,

    // The full name of the source (e.g. "Frick Art Reference Library")
    name: {
        type: String,
        required: true
    },

    // A short name (e.g. "Frick")
    shortName: {
        type: String,
        required: true
    },

    // The name of the converter to use on the data when importing
    converter: {
        type: String,
        default: "default"
    }
});

Source.methods = {
    getURL: function getURL(locale) {
        return urls.gen(locale, "/" + this.type + "/source/" + this._id);
    },
    getAdminURL: function getAdminURL(locale) {
        return this.getURL(locale) + "/admin";
    },
    getDirBase: function getDirBase() {
        return urls.genLocalFile(this._id);
    },
    getFullName: function getFullName() {
        return this.name;
    },
    getShortName: function getShortName() {
        return this.shortName;
    },
    getConverter: function getConverter() {
        var converter = this.converter || "default";
        var converters = Object.assign({
            default: defaultConverter
        }, options.converters);

        /* istanbul ignore if */
        if (!converters[converter]) {
            throw new Error("Error: Converter not found: " + converter);
        }

        // Return the converter module
        return converters[converter];
    },
    getExpectedFiles: function getExpectedFiles() {
        return this.getConverter().files;
    },
    processFiles: function processFiles(files, callback) {
        this.getConverter().processFiles(files, callback);
    },
    cacheTotals: function cacheTotals(callback) {
        var _this = this;

        record(this.type).aggregate([{
            $match: {
                source: this._id
            }
        }, {
            $group: {
                _id: null,
                total: { $sum: 1 },
                totalImages: { $sum: { $size: "$images" } }
            }
        }], function (err, results) {
            if (results && results[0]) {
                _this.numRecords = results[0].total;
                _this.numImages = results[0].totalImages;
            } else {
                _this.numRecords = 0;
                _this.numImages = 0;
            }
            callback();
        });
    }
};

Source.statics = {
    cacheSources: function cacheSources(callback) {
        models("Source").find({}, function (err, sources) {
            sourceCache = sources;

            async.eachLimit(sources, 2, function (source, callback) {
                source.cacheTotals(callback);
            }, function () {
                callback(err, sources);
            });
        });
    },
    getSources: function getSources() {
        return sourceCache;
    },
    getSourcesByType: function getSourcesByType(type) {
        return this.getSources().filter(function (source) {
            return source.type === type;
        });
    },
    getSource: function getSource(sourceName) {
        var sources = this.getSources();

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = sources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var source = _step.value;

                if (source._id === sourceName) {
                    return source;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        throw new Error("Source not found: " + sourceName);
    }
};

module.exports = Source;