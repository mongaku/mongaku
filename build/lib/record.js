"use strict";

var url = require("url");

var mongoosastic = require("mongoosastic");
var versioner = require("mongoose-version");

var db = require("./db");
var config = require("./config");
var options = require("./options");
var metadata = require("./metadata");

var records = {};

module.exports = function (type) {
    if (records[type]) {
        return records[type];
    }

    var typeInfo = options.types[type];

    if (!typeInfo) {
        throw new Error("Type not found: " + type);
    }

    var Record = require("../schemas/Record");
    var modelProps = metadata.schemas(type);
    var schemaProps = Object.assign({}, Record.schema, modelProps);

    if (typeInfo.urlRequired) {
        schemaProps.url = Object.assign({ required: true }, schemaProps.url);
    }

    if (typeInfo.noImages) {
        schemaProps.images = Object.assign({ required: false }, schemaProps.images);
        schemaProps.defaultImageHash = Object.assign({ required: false }, schemaProps.defaultImageHash);
    } else if (typeInfo.imagesRequired) {
        schemaProps.images = Object.assign({ required: true }, schemaProps.images);
        schemaProps.defaultImageHash = Object.assign({ required: true }, schemaProps.defaultImageHash);
    } else {
        schemaProps.images = Object.assign({ recommended: true }, schemaProps.images);
        schemaProps.defaultImageHash = Object.assign({ recommended: true }, schemaProps.defaultImageHash);
    }

    var Schema = new db.schema(schemaProps, {
        collection: type
    });

    Schema.methods = Record.methods;
    Schema.statics = Object.assign({
        getType: function getType() {
            return type;
        }
    }, Record.statics);

    var es = url.parse(config.ELASTICSEARCH_URL);

    Schema.plugin(mongoosastic, {
        index: type,
        type: type,
        host: es.hostname,
        auth: es.auth,
        port: es.port,
        // Trim the trailing ":" from the protocol
        protocol: es.protocol.slice(0, -1)
    });

    Schema.plugin(versioner, {
        collection: type + "_versions",
        suppressVersionIncrement: false,
        suppressRefIdIndex: false,
        refIdType: String,
        removeVersions: false,
        strategy: "collection",
        mongoose: db.mongoose
    });

    // Dynamically generate the _id attribute
    Schema.pre("validate", function (next) {
        if (!this._id) {
            this._id = this.source + "/" + this.id;
        }
        next();
    });

    /* istanbul ignore next */
    Schema.pre("save", function (next) {
        // Always updated the modified time on every save
        this.modified = new Date();
        next();
    });

    records[type] = db.model(type, Schema);

    return records[type];
};