const options = require("../../lib/options");

const queries = require("./queries");

const paramFilter = (values, keepSecondary) => {
    const all = {};
    const primary = [];
    const secondary = {};
    const type = values.type || Object.keys(options.types)[0];
    const typeQueries = queries(type);

    for (const name in values) {
        const query = typeQueries[name];
        const value = values[name];

        if (!query) {
            console.error(`ERROR: Unknown field: ${name}.`);
            continue;
        }

        // Ignore queries that don't have a value
        if (value === undefined) {
            continue;
        }

        // Ignore params which are entirely internal
        if (query.internal) {
            continue;
        }

        // Ignore params which are the same as the default value
        if (query.defaultValue && query.defaultValue(values) === value) {
            continue;
        }

        const fields = query.fields ? query.fields(value) : {[name]: value};

        if (query.secondary) {
            Object.assign(secondary, fields);
        } else {
            primary.push(name);
        }

        if (keepSecondary || !query.secondary) {
            Object.assign(all, fields);
        }
    }

    return {
        all,
        primary,
        secondary,
    };
};

module.exports = paramFilter;
