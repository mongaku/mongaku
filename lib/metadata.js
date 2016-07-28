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

const model = {};

for (const name in options.model) {
    const settings = options.model[name];
    settings.name = name;
    const Type = types[settings.type];
    model[name] = new Type(settings);
}

module.exports = {
    model,

    schemas() {
        const schemas = {};

        for (const modelName in model) {
            schemas[modelName] = model[modelName].schema(db.schema);
        }

        return schemas;
    },
};
