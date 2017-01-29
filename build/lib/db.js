"use strict";

var mongoose = require("mongoose");

var config = require("./config");

// Get Mongoose using native promises
mongoose.Promise = global.Promise;

/* istanbul ignore next */
var connect = function connect(callback) {
    /* istanbul ignore else */
    if (config.NODE_ENV === "test") {
        return process.nextTick(callback);
    }

    console.log("Connecting...");
    mongoose.connect(config.MONGODB_URL);

    mongoose.connection.on("error", function (err) {
        console.error("Mongo Connection Error:", err);
        callback(err);
    });

    mongoose.connection.once("open", callback);
};

module.exports = {
    mongoose: mongoose,
    schema: mongoose.Schema,
    types: mongoose.Types,

    connect: connect,

    model: function model(name, schema) {
        return mongoose.model(name, schema);
    }
};