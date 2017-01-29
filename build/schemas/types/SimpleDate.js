"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = require("react");

var FixedStringDisplay = React.createFactory(require("../../views/types/view/FixedString.js"));
var SimpleDateEdit = React.createFactory(require("../../views/types/edit/SimpleDate.js"));

var SimpleDate = function SimpleDate(options) {
    this.options = options;

    this.options.interval = options.interval || "year";
    this.options.format = options.format || "yyyy";

    /*
    name
    type
    searchName
    title(i18n)
    placeholder(i18n)
    multiple: Bool
    recommended: Bool
    interval: String
    format: String
    */
};

SimpleDate.prototype = {
    searchName: function searchName() {
        return this.options.searchName || this.options.name;
    },
    value: function value(query) {
        return query[this.searchName()];
    },
    fields: function fields(value) {
        return _defineProperty({}, this.searchName(), value);
    },
    formatDate: function formatDate(value) {
        return value;
    },
    searchTitle: function searchTitle(value, i18n) {
        var title = this.options.title(i18n);
        var date = this.formatDate(value, i18n);
        return title + ": " + date;
    },
    renderView: function renderView(value) {
        return FixedStringDisplay({
            name: this.options.name,
            type: this.options.type,
            value: value,
            multiline: this.options.multiline
        });
    },
    renderEdit: function renderEdit(value) {
        return SimpleDateEdit({
            name: this.options.name,
            type: this.options.type,
            value: value,
            multiline: this.options.multiline
        });
    },
    filter: function filter(value) {
        return {
            range: _defineProperty({}, this.options.name, {
                gte: value,
                lte: value,
                format: this.options.format
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
                    date_histogram: {
                        field: _this.options.name,
                        interval: _this.options.interval,
                        format: _this.options.format
                    }
                };
            },

            formatBuckets: function formatBuckets(buckets, i18n) {
                return buckets.map(function (bucket) {
                    return {
                        text: bucket.key_as_string,
                        count: bucket.doc_count,
                        url: _defineProperty({}, _this.options.name, _this.formatDate(bucket.key_as_string, i18n))
                    };
                }).reverse();
            }
        });
    },
    schema: function schema() {
        var type = {
            type: Date,
            es_indexed: true,
            recommended: !!this.options.recommended
        };

        return this.options.multiple ? [type] : type;
    }
};

module.exports = SimpleDate;