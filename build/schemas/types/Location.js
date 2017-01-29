"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = require("react");

var LocationFilter = React.createFactory(require("../../views/types/filter/Location.js"));
var LocationDisplay = React.createFactory(require("../../views/types/view/Location.js"));

var Location = function Location(options) {
    this.options = options;
    /*
    name
    type
    searchName
    title(i18n)
    placeholder(i18n)
    */
};

Location.prototype = {
    searchName: function searchName() {
        return this.options.searchName || this.options.name;
    },
    value: function value(query) {
        return query[this.searchName()];
    },
    defaultValue: function defaultValue() {
        return "";
    },
    fields: function fields(value) {
        return _defineProperty({}, this.searchName(), value);
    },
    searchTitle: function searchTitle(value, i18n) {
        var title = this.options.title(i18n);
        return title + ": " + value;
    },
    filter: function filter(value, sanitize) {
        return {
            match: _defineProperty({}, this.options.name + ".name", {
                query: sanitize(value),
                operator: "and",
                zero_terms_query: "all"
            })
        };
    },
    renderFilter: function renderFilter(value, values, i18n) {
        return LocationFilter({
            name: this.options.name,
            searchName: this.searchName(),
            value: value,
            placeholder: this.options.placeholder(i18n),
            title: this.options.title(i18n)
        });
    },
    renderView: function renderView(value) {
        return LocationDisplay({
            name: this.options.name,
            type: this.options.type,
            value: value
        });
    },
    schema: function schema(Schema) {
        var LocationSchema = new Schema({
            // An ID for the name, computed from all the properties
            // before validation.
            _id: String,

            // The country and city representing the location
            country: { type: String, es_indexed: true },
            city: { type: String, es_indexed: true },

            // The name of the location
            name: { type: String, es_indexed: true }
        });

        // Dynamically generate the _id attribute
        LocationSchema.pre("validate", function (next) {
            this._id = [this.country, this.city, this.name].join(",");
            next();
        });

        return {
            type: [LocationSchema],
            validateArray: function validateArray(location) {
                return location.name || location.city;
            },
            validationMsg: function validationMsg(i18n) {
                return i18n.gettext("Locations must have a " + "name or city specified.");
            }
        };
    }
};

module.exports = Location;