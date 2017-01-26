const async = require("async");

require("./babel");

const db = require("./db");
const models = require("./models");

module.exports = (callback) => {
    return new Promise((resolve, reject) => {
        async.series([
            (callback) => db.connect(callback),
            (callback) => models("Source").cacheSources(callback),
        ], (err) => {
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
