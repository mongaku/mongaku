"use strict";

var db = require("./db");

var models = {};

module.exports = function (name) {
    if (models[name]) {
        return models[name];
    }

    var schema = require("../schemas/" + name + ".js");

    models[name] = db.model(name, schema);

    return models[name];
};