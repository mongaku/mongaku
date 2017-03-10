const db = require("./db");
const options = require("./options");

const types = {
    Dimension: require("../schemas/types/Dimension.js"),
    FixedString: require("../schemas/types/FixedString.js"),
    LinkedRecord: require("../schemas/types/LinkedRecord.js"),
    Location: require("../schemas/types/Location.js"),
    Name: require("../schemas/types/Name.js"),
    SimpleDate: require("../schemas/types/SimpleDate.js"),
    SimpleNumber: require("../schemas/types/SimpleNumber.js"),
    SimpleString: require("../schemas/types/SimpleString.js"),
    URL: require("../schemas/types/URL.js"),
    YearRange: require("../schemas/types/YearRange.js"),
};

module.exports = {
    model(type) {
        if (!options.types[type]) {
            throw new Error(`Type ${type} not found.`);
        }

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
