"use strict";

const url = require("url");

const versioner = require("mongoose-version");
const mongoosastic = require("mongoosastic");

const db = require("./db");
const config = require("./config");

const models = {};
const es = url.parse(config.ELASTICSEARCH_URL);

const mongoosasticServer = {
    host: es.hostname,
    auth: es.auth,
    port: es.port,
    // Trim the trailing ":" from the protocol
    protocol: es.protocol.slice(0, -1),
};

// TODO: Move these into the schema definitions
const bindPlugins = {
    Record(schema, mongoose) {
        schema.plugin(mongoosastic, mongoosasticServer);
        schema.plugin(versioner, {
            collection: "record_versions",
            suppressVersionIncrement: false,
            strategy: "collection",
            mongoose: mongoose,
        });
    },

    Image(schema, mongoose) {
        schema.plugin(versioner, {
            collection: "image_versions",
            suppressVersionIncrement: false,
            strategy: "collection",
            mongoose: mongoose,
        });
    },
};

module.exports = (name) => {
    if (models[name]) {
        return models[name];
    }

    const schema = require(`../schemas/${name}.js`);

    if (bindPlugins[name]) {
        bindPlugins[name](schema, db.mongoose);
    }

    models[name] = db.model(name, schema);

    return models[name];
};
