const mongoose = require("mongoose");

const config = require("./config");

// Get Mongoose using native promises
mongoose.Promise = global.Promise;

module.exports = {
    mongoose: mongoose,
    schema: mongoose.Schema,
    types: mongoose.Types,

    connect(callback) {
        mongoose.connect(config.MONGODB_URL);

        mongoose.connection.on("error", (err) => {
            console.error("Mongo Connection Error:", err);
            callback(err);
        });

        mongoose.connection.once("open", callback);
    },

    close: () => mongoose.connection.close(),

    model(name, schema) {
        return mongoose.model(name, schema);
    },
};
