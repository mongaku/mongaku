"use strict";

const init = require("../lib/init");
const models = require("../lib/models");

exports.up = (next) => {
    init(() => {
        models("Record").find({}, {}, {timeout: true}).stream()
            .on("data", function(record) {
                this.pause();

                console.log(`Migrating ${record._id}...`);

                this.resume();
            })
            .on("close", next);
    });
};

exports.down = (next) => {
    next();
};
