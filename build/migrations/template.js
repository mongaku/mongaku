"use strict";

var async = require("async");

var init = require("../lib/init");
var options = require("../lib/options");
var record = require("../lib/record");

exports.up = function (next) {
    init(function () {
        async.eachLimit(Object.keys(options.types), 1, function (type, callback) {
            record(type).find({}, {}, { timeout: true }).stream().on("data", function (record) {
                this.pause();

                console.log("Migrating " + record._id + "...");

                this.resume();
            }).on("close", callback);
        }, next);
    });
};

exports.down = function (next) {
    next();
};