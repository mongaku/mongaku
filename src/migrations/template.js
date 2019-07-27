const async = require("async");

const init = require("../lib/init");
const options = require("../lib/options");
const record = require("../lib/record");

exports.up = next => {
    init(() => {
        async.eachLimit(
            Object.keys(options.types),
            1,
            (type, callback) => {
                record(type)
                    .find({}, {}, {timeout: true})
                    .stream()
                    .on("data", function(record) {
                        this.pause();

                        console.log(`Migrating ${record._id}...`);

                        this.resume();
                    })
                    .on("close", callback);
            },
            next,
        );
    });
};

exports.down = next => {
    next();
};
