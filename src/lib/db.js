const mongoose = require("mongoose");

const config = require("./config");

// Get Mongoose using native promises
mongoose.Promise = global.Promise;

module.exports = {
    mongoose: mongoose,
    schema: mongoose.Schema,
    types: mongoose.Types,

    connect(callback) {
        if (config.NODE_ENV === "test") {
            return process.nextTick(callback);
        }

        mongoose.connect(config.MONGODB_URL, {
            keepAlive: true,
            useNewUrlParser: true,
            // Get Mongoose using native promises
            promiseLibrary: global.Promise,
            reconnectTries: Number.MAX_VALUE,
        });

        const handleError = err => {
            console.error("Mongo Connection Error:", err);
            mongoose.connection.removeListener("open", handleOpen);
            callback(err);
        };

        const handleOpen = () => {
            mongoose.connection.removeListener("error", handleError);
            callback();
        };

        mongoose.connection.on("error", handleError);
        mongoose.connection.once("open", handleOpen);
    },

    close: () => {
        if (config.NODE_ENV !== "test") {
            mongoose.connection.close();
        }
    },

    model(name, schema) {
        return mongoose.model(name, schema);
    },
};
