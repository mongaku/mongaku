"use strict";

const queries = require("./queries");

const paramFilter = (values, keepSecondary) => {
    const all = {};
    const primary = [];
    const secondary = {};

    for (const name in values) {
        const query = queries[name];
        const value = values[name];

        if (!query) {
            console.error(`ERROR: Unknown field: ${name}.`);
            continue;
        }

        // Ignore queries that don't have a value
        if (value === undefined) {
            continue;
        }

        // Ignore params which are the same as the default value
        if (query.defaultValue && query.defaultValue(values) === value) {
            continue;
        }

        const fields = query.fields ?
            query.fields(value) :
            {[name]: value};

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
