"use strict";

const url = require("url");

const mongoosastic = require("mongoosastic");
const versioner = require("mongoose-version");

const db = require("./db");
const config = require("./config");
const options = require("./options");
const metadata = require("./metadata");

const records = {};

module.exports = (type) => {
    if (records[type]) {
        return records[type];
    }

    const typeInfo = options.types[type];

    if (!typeInfo) {
        throw new Error(`Type not found: ${type}`);
    }

    const Record = require("../schemas/Record");
    const modelProps = metadata.schemas(type);
    const schemaProps = Object.assign({}, Record.schema, modelProps);

    if (typeInfo.urlRequired) {
        schemaProps.url.required = true;
    }

    if (typeInfo.noImages) {
        schemaProps.images.required = false;
    } else if (typeInfo.imagesRequired) {
        schemaProps.images.required = true;
    } else {
        schemaProps.images.recommended = true;
    }

    const Schema = new db.schema(schemaProps, {
        collection: type,
    });

    Schema.methods = Record.methods;
    Schema.statics = Object.assign({
        getType: () => type,
    }, Record.statics);

    const es = url.parse(config.ELASTICSEARCH_URL);

    Schema.plugin(mongoosastic, {
        index: type,
        type,
        host: es.hostname,
        auth: es.auth,
        port: es.port,
        // Trim the trailing ":" from the protocol
        protocol: es.protocol.slice(0, -1),
    });

    Schema.plugin(versioner, {
        collection: `${type}_versions`,
        suppressVersionIncrement: false,
        strategy: "collection",
        mongoose: db.mongoose,
    });

    // Dynamically generate the _id attribute
    Schema.pre("validate", function(next) {
        if (!this._id) {
            this._id = `${this.source}/${this.id}`;
        }
        next();
    });

    /* istanbul ignore next */
    Schema.pre("save", function(next) {
        // Always updated the modified time on every save
        this.modified = new Date();
        next();
    });

    records[type] = db.model(type, Schema);

    return records[type];
};
