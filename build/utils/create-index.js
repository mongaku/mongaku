"use strict";

var async = require("async");
var request = require("request");

var config = require("../lib/config");
var record = require("../lib/record");
var options = require("../lib/options");

module.exports = function (args, callback) {
    async.eachLimit(Object.keys(options.types), 1, function (type, callback) {
        var Record = record(type);

        console.log("Deleting existing " + type + " index...");

        // TODO(jeresig): Make this configurable
        var esIndexURL = config.ELASTICSEARCH_URL + "/" + type;

        request.delete(esIndexURL, function () {
            console.log("Re-building " + type + " index...");

            request.put(esIndexURL, function () {
                Record.createMapping(function (err) {
                    if (err) {
                        return callback(err);
                    }

                    var count = 0;

                    Record.synchronize().on("data", function () {
                        count += 1;
                        console.log("Indexed " + type + " record #" + count);
                    }).on("close", callback).on("error", callback);
                });
            });
        });
    }, callback);
};