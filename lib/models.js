"use strict";

const db = require("./db");

const models = {};

module.exports = (name) => {
    if (models[name]) {
        return models[name];
    }

    const schema = require(`../schemas/${name}.js`);

    models[name] = db.model(name, schema);

    return models[name];
};
