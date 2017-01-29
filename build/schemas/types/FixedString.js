"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = require("react");

var FixedStringFilter = React.createFactory(require("../../views/types/filter/FixedString.js"));
var FixedStringDisplay = React.createFactory(require("../../views/types/view/FixedString.js"));
var FixedStringEdit = React.createFactory(require("../../views/types/edit/FixedString.js"));

var FixedString = function FixedString(options) {
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
    searchName: function searchName() {
        return this.options.searchName || this.options.name;
    },
    value: function value(query) {
        return query[this.searchName()] || undefined;
    },
    fields: function fields(value) {
        return _defineProperty({}, this.searchName(), value);
    },
    searchTitle: function searchTitle(name, i18n) {
        var values = this.options.values || {};
        var nameMap = values[name];
        return values.hasOwnProperty(name) && nameMap && nameMap.name ? nameMap.name(i18n) : name;
    },
    filter: function filter(value) {
        return {
            match: _defineProperty({}, this.options.name + ".raw", {
                query: value,
                operator: "or",
                zero_terms_query: "all"
            })
        };
    },
    facet: function facet() {
        var _this = this;

        return _defineProperty({}, this.options.name, {
            title: function title(i18n) {
                return _this.options.title(i18n);
            },

            facet: function facet() {
                return {
                    terms: {
                        field: _this.options.name + ".raw",
                        size: 1000
                    }
                };
            },

            formatBuckets: function formatBuckets(buckets, i18n) {
                return buckets.map(function (bucket) {
                    return {
                        text: _this.searchTitle(bucket.key, i18n),
                        count: bucket.doc_count,
                        url: _defineProperty({}, _this.options.name, bucket.key)
                    };
                });
            }
        });
    },
    getValueArray: function getValueArray(i18n) {
        var _this2 = this;

        return Object.keys(this.options.values).map(function (id) {
            return {
                id: id,
                name: _this2.options.values[id].name(i18n)
            };
        });
    },
    renderFilter: function renderFilter(value, allValues, i18n) {
        var values = this.getValueArray(i18n);

        if (values.length === 0) {
            values = allValues.map(function (text) {
                return {
                    id: text,
                    name: text
                };
            });
        }

        return FixedStringFilter({
            name: this.options.name,
            searchName: this.searchName(),
            value: value,
            values: values,
            placeholder: this.options.placeholder(i18n),
            title: this.options.title(i18n),
            multiple: this.options.multiple
        });
    },
    renderView: function renderView(value, i18n) {
        return FixedStringDisplay({
            name: this.options.name,
            type: this.options.type,
            value: value,
            values: this.getValueArray(i18n),
            searchField: this.options.searchField
        });
    },
    renderEdit: function renderEdit(value, allValues, i18n) {
        var values = this.getValueArray(i18n);

        if (values.length === 0) {
            values = allValues.map(function (text) {
                return {
                    id: text,
                    name: text
                };
            });
        }

        return FixedStringEdit({
            name: this.options.name,
            type: this.options.type,
            value: value,
            values: values,
            searchField: this.options.searchField,
            multiple: this.options.multiple
        });
    },
    schema: function schema() {
        var _this3 = this;

        var validate = {};
        var values = Array.isArray(this.options.values) ? this.options.values : Object.keys(this.options.values);

        // Only validate the values if there are values to validate against
        // and if unknown values aren't allowed
        // NOTE(jeresig): We could require that the value be of one of
        // the pre-specified values, but that feels overly
        // restrictive, better to just warn them instead.
        if (values.length > 0 && !this.options.allowUnknown) {
            validate = {
                validate: function validate(val) {
                    return values.indexOf(val) >= 0;
                },
                validationMsg: function validationMsg(req) {
                    return req.format(req.gettext("`%(name)s` " + "must be one of the following types: %(types)s."), {
                        name: _this3.options.name,
                        types: values.join(", ")
                    });
                }
            };
        }

        if (this.options.recommended) {
            validate.recommended = true;
        }

        var schema = Object.assign({
            type: String,
            es_indexed: true,
            es_type: "string",
            // A raw type to use for building aggregations in Elasticsearch
            es_fields: {
                name: { type: "string", index: "analyzed" },
                raw: { type: "string", index: "not_analyzed" }
            }
        }, validate);

        return this.options.multiple ? [schema] : schema;
    }
};

module.exports = FixedString;