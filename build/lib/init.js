"use strict";

var async = require("async");

var db = require("./db");
var models = require("./models");

module.exports = function (callback) {
    return new Promise(function (resolve, reject) {
        async.series([function (callback) {
            return db.connect(callback);
        }, function (callback) {
            return models("Source").cacheSources(callback);
        }], function (err) {
            /* istanbul ignore if */
            if (callback) {
                callback(err);
            }

            /* istanbul ignore if */
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};