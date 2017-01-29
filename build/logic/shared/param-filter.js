"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var options = require("../../lib/options");

var queries = require("./queries");

var paramFilter = function paramFilter(values, keepSecondary) {
    var all = {};
    var primary = [];
    var secondary = {};
    var type = values.type || Object.keys(options.types)[0];
    var typeQueries = queries(type);

    for (var name in values) {
        var query = typeQueries[name];
        var value = values[name];

        if (!query) {
            console.error("ERROR: Unknown field: " + name + ".");
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

        var fields = query.fields ? query.fields(value) : _defineProperty({}, name, value);

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
        all: all,
        primary: primary,
        secondary: secondary
    };
};

module.exports = paramFilter;