const path = require("path");

const mongoose = require("mongoose");

const config = require("./config");

// Get Mongoose using native promises
mongoose.Promise = global.Promise;

const mongooseConnect = (dbUrl, callback) => {
    console.log("Connecting...");
    mongoose.connect(dbUrl);

    mongoose.connection.on("error", (err) => {
        console.error("Mongo Connection Error:", err);
        callback(err);
    });

    mongoose.connection.once("open", callback);
};

/* istanbul ignore next */
const connect = (callback) => {
    /* istanbul ignore if */
    if (config.NODE_ENV !== "test") {
        return mongooseConnect(config.MONGODB_URL, callback);
    }

    const MongoInMemory = require("mongo-in-memory");
    const db = new MongoInMemory(27018);
    const testDBFiles = path.resolve(__dirname,
        "..", "..", "tests", "db");

    db.start((err) => {
        if (err) {
            return callback(err);
        }

        db.addDirectoryOfCollections("test", testDBFiles, (err) => {
            if (err) {
                return callback(err);
            }

            mongooseConnect(db.getMongouri("test"), callback);
        });
    });
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
