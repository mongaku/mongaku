const mongoose = require("mongoose");

const config = require("./config");

// Get Mongoose using native promises
mongoose.Promise = global.Promise;

/* istanbul ignore next */
const connect = (callback) => {
    /* istanbul ignore else */
    if (config.NODE_ENV === "test") {
        return process.nextTick(callback);
    }

    console.log("Connecting...");
    mongoose.connect(config.MONGODB_URL);

    mongoose.connection.on("error", (err) => {
        console.error("Mongo Connection Error:", err);
        callback(err);
    });

    mongoose.connection.once("open", callback);
};

module.exports = {
    mongoose: mongoose,
    schema: mongoose.Schema,
    types: mongoose.Types,

    connect,

    model(name, schema) {
        return mongoose.model(name, schema);
    },
};
