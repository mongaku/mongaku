"use strict";

// How often queries should be performed
var QUERY_RATE = 5000;

var record = require("../lib/record");
var models = require("../lib/models");
var options = require("../lib/options");

module.exports = {
    updateRecordImport: function updateRecordImport() {
        var advance = function advance() {
            return models("RecordImport").advance(function () {
                return setTimeout(advance, QUERY_RATE);
            });
        };

        advance();
    },
    updateRecordSimilarity: function updateRecordSimilarity() {
        var _loop = function _loop(typeName) {
            var Record = record(typeName);
            var next = function next() {
                return setTimeout(update, QUERY_RATE);
            };
            var update = function update() {
                return Record.updateSimilarity(function (err, success) {
                    // If nothing happened then we wait to try again
                    if (err || !success) {
                        return next();
                    }

                    // If it worked immediately attempt to index or update
                    // another image.
                    process.nextTick(update);
                });
            };

            update();
        };

        for (var typeName in options.types) {
            _loop(typeName);
        }
    },
    updateImageImport: function updateImageImport() {
        var advance = function advance() {
            return models("ImageImport").advance(function () {
                return setTimeout(advance, QUERY_RATE);
            });
        };

        advance();
    },
    updateImageSimilarity: function updateImageSimilarity() {
        var Image = models("Image");
        var next = function next() {
            return setTimeout(update, QUERY_RATE);
        };
        var update = function update() {
            return Image.indexSimilarity(function (err, success) {
                // If we hit an error attempt again after a small delay
                /* istanbul ignore if */
                if (err) {
                    return next();
                }

                // If it worked immediately attempt to index or update
                // another image.
                if (success) {
                    return process.nextTick(update);
                }

                // If nothing happened attempt to update the similarity
                // of an image instead.
                Image.updateSimilarity(function (err, success) {
                    // If nothing happened then we wait to try again
                    if (err || !success) {
                        return next();
                    }

                    // If it worked immediately attempt to index or update
                    // another image.
                    process.nextTick(update);
                });
            });
        };

        update();
    },
    start: function start() {
        this.updateRecordImport();
        this.updateRecordSimilarity();
        this.updateImageImport();
        this.updateImageSimilarity();
    }
};