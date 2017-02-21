"use strict";

const Location = function (options) {
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
    searchName() {
        return this.options.searchName || this.options.name;
    },

    value(query) {
        return query[this.searchName()];
    },

    defaultValue() {
        return "";
    },

    fields(value) {
        return {
            [this.searchName()]: value.name || value.city || value.country
        };
    },

    searchTitle(value, i18n) {
        const title = this.options.title(i18n);
        return `${title}: ${value}`;
    },

    filter(value, sanitize) {
        return {
            match: {
                [`${this.options.name}.name`]: {
                    query: sanitize(value),
                    operator: "and",
                    zero_terms_query: "all"
                }
            }
        };
    },

    schema(Schema) {
        const LocationSchema = new Schema({
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
            validateArray: location => location.name || location.city,
            validationMsg: i18n => i18n.gettext("Locations must have a " + "name or city specified.")
        };
    }
};

module.exports = Location;