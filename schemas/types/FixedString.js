const React = require("react");

const FixedStringFilter = React.createFactory(
    require("../../views/types/filter/FixedString.jsx"));
const FixedStringDisplay = React.createFactory(
    require("../../views/types/view/FixedString.jsx"));
const FixedStringEdit = React.createFactory(
    require("../../views/types/edit/FixedString.jsx"));

const FixedString = function(options) {
    this.options = options;
    /*
    name
    type
    searchName
    allowUnknown: Bool
    values: {Key: title(i18n)}
    title(i18n)
    placeholder(i18n)
    url(value)
    recommended: Bool
    multiple: Bool
    */

    if (this.options.url) {
        this.url = this.options.url;
    }
};

FixedString.prototype = {
    searchName() {
        return this.options.searchName || this.options.name;
    },

    value(query) {
        return query[this.searchName()] || undefined;
    },

    fields(value) {
        return {[this.searchName()]: value};
    },

    searchTitle(name, i18n) {
        const values = this.options.values || {};
        const nameMap = values[name];
        return values.hasOwnProperty(name) && nameMap && nameMap.name ?
            nameMap.name(i18n) :
            name;
    },

    filter(value) {
        return {
            match: {
                [`${this.options.name}.raw`]: {
                    query: value,
                    operator: "or",
                    zero_terms_query: "all",
                },
            },
        };
    },

    facet() {
        return {
            [this.options.name]: {
                title: (i18n) => this.options.title(i18n),

                facet: () => ({
                    terms: {
                        field: `${this.options.name}.raw`,
                        size: 1000,
                    },
                }),

                formatBuckets: (buckets, i18n) => buckets.map((bucket) => ({
                    text: this.searchTitle(bucket.key, i18n),
                    count: bucket.doc_count,
                    url: {[this.options.name]: bucket.key},
                })),
            },
        };
    },

    getValueArray(i18n) {
        return Object.keys(this.options.values).map((id) => ({
            id,
            name: this.options.values[id].name(i18n),
        }));
    },

    renderFilter(value, allValues, i18n) {
        let values = this.getValueArray(i18n);

        if (values.length === 0) {
            values = allValues.map((text) => ({
                id: text,
                name: text,
            }));
        }

        return FixedStringFilter({
            name: this.options.name,
            searchName: this.searchName(),
            value,
            values,
            placeholder: this.options.placeholder(i18n),
            title: this.options.title(i18n),
            multiple: this.options.multiple,
        });
    },

    renderView(value, i18n) {
        return FixedStringDisplay({
            name: this.options.name,
            type: this.options.type,
            value,
            values: this.getValueArray(i18n),
            searchField: this.options.searchField,
        });
    },

    renderEdit(value, allValues, i18n) {
        let values = this.getValueArray(i18n);

        if (values.length === 0) {
            values = allValues.map((text) => ({
                id: text,
                name: text,
            }));
        }

        return FixedStringEdit({
            name: this.options.name,
            type: this.options.type,
            value,
            values,
            searchField: this.options.searchField,
            multiple: this.options.multiple,
        });
    },

    schema() {
        let validate = {};
        const values = Array.isArray(this.options.values) ?
            this.options.values :
            Object.keys(this.options.values);

        // Only validate the values if there are values to validate against
        // and if unknown values aren't allowed
        // NOTE(jeresig): We could require that the value be of one of
        // the pre-specified values, but that feels overly
        // restrictive, better to just warn them instead.
        if (values.length > 0 && !this.options.allowUnknown) {
            validate = {
                validate: (val) => values.indexOf(val) >= 0,
                validationMsg: (req) => req.format(req.gettext("`%(name)s` " +
                    "must be one of the following types: %(types)s."), {
                        name: this.options.name,
                        types: values.join(", "),
                    }),
            };
        }

        if (this.options.recommended) {
            validate.recommended = true;
        }

        const schema = Object.assign({
            type: String,
            es_indexed: true,
            es_type: "string",
            // A raw type to use for building aggregations in Elasticsearch
            es_fields: {
                name: {type: "string", index: "analyzed"},
                raw: {type: "string", index: "not_analyzed"},
            },
        }, validate);

        return this.options.multiple ? [schema] : schema;
    },
};

module.exports = FixedString;
