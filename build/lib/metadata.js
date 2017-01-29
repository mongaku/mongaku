"use strict";

var db = require("./db");
var options = require("./options");

var types = {
    Name: require("../schemas/types/Name.js"),
    YearRange: require("../schemas/types/YearRange.js"),
    FixedString: require("../schemas/types/FixedString.js"),
    SimpleString: require("../schemas/types/SimpleString.js"),
    SimpleNumber: require("../schemas/types/SimpleNumber.js"),
    SimpleDate: require("../schemas/types/SimpleDate.js"),
    Dimension: require("../schemas/types/Dimension.js"),
    Location: require("../schemas/types/Location.js"),
    LinkedRecord: require("../schemas/types/LinkedRecord.js")
};

module.exports = {
    model: function model(type) {
        if (!options.types[type]) {
            throw new Error("Type " + type + " not found.");
        }

        var model = {};
        var modelType = options.types[type].model;

        for (var name in modelType) {
            var settings = Object.assign({}, modelType[name]);
            var Type = types[settings.type];
            settings.name = name;
            settings.type = type;
            model[name] = new Type(settings);
        }

        return model;
    },
    schemas: function schemas(type) {
        var model = this.model(type);
        var schemas = {};

        for (var modelName in model) {
            schemas[modelName] = model[modelName].schema(db.schema);
        }

        return schemas;
    }
};