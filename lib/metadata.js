"use strict";

const db = require("./db");
const options = require("./options");

const types = {
    Name: require("../schemas/types/Name.js"),
    YearRange: require("../schemas/types/YearRange.js"),
    FixedString: require("../schemas/types/FixedString.js"),
    SimpleString: require("../schemas/types/SimpleString.js"),
    Dimension: require("../schemas/types/Dimension.js"),
    Location: require("../schemas/types/Location.js"),
};

module.exports = {
    model(type) {
        const model = {};
        const modelType = options.types[type].model;

        for (const name in modelType) {
            const settings = Object.assign({}, modelType[name]);
            const Type = types[settings.type];
            settings.name = name;
            settings.type = type;
            model[name] = new Type(settings);
        }

        return model;
    },

    schemas(type) {
        const model = this.model(type);
        const schemas = {};

        for (const modelName in model) {
            schemas[modelName] = model[modelName].schema(db.schema);
        }

        return schemas;
    },
};
