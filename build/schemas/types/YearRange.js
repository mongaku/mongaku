"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = require("react");
var yearRange = require("yearrange");

var YearRangeFilter = React.createFactory(require("../../views/types/filter/YearRange.js"));
var YearRangeDisplay = React.createFactory(require("../../views/types/view/YearRange.js"));
var YearRangeEdit = React.createFactory(require("../../views/types/edit/YearRange.js"));

var numRange = function numRange(bucket) {
    return bucket.to ? (bucket.from || 0) + "-" + bucket.to : bucket.from + "+";
};

var defaultRanges = [{ to: 999 }, { from: 1000, to: 1099 }, { from: 1100, to: 1199 }, { from: 1200, to: 1299 }, { from: 1300, to: 1399 }, { from: 1400, to: 1499 }, { from: 1500, to: 1599 }, { from: 1600, to: 1699 }, { from: 1700, to: 1799 }, { from: 1800 }];

var YearRange = function YearRange(options) {
    this.options = options;
    /*
    name
    type
    searchName
    ranges
    title(i18n)
    placeholder(i18n)
    */
};

YearRange.prototype = {
    searchName: function searchName() {
        return this.options.searchName || this.options.name;
    },
    value: function value(query) {
        var start = query[this.searchName() + ".start"];
        var end = query[this.searchName() + ".end"];

        if (start || end) {
            return { start: start, end: end };
        }
    },
    fields: function fields(value) {
        var _ref;

        return _ref = {}, _defineProperty(_ref, this.searchName() + ".start", value.start), _defineProperty(_ref, this.searchName() + ".end", value.end), _ref;
    },
    searchTitle: function searchTitle(value, i18n) {
        var title = this.options.title(i18n);
        var range = numRange({
            from: value.start,
            to: value.end
        });

        return title + ": " + range;
    },
    filter: function filter(value) {
        // NOTE(jeresig): There has got to be a better way to handle this.
        var start = value.start || -10000;
        var end = value.end || new Date().getYear() + 1900;

        var startInside = {
            bool: {
                must: [{
                    range: _defineProperty({}, this.options.name + ".start", {
                        lte: parseFloat(start)
                    })
                }, {
                    range: _defineProperty({}, this.options.name + ".end", {
                        gte: parseFloat(start)
                    })
                }]
            }
        };

        var endInside = {
            bool: {
                must: [{
                    range: _defineProperty({}, this.options.name + ".start", {
                        lte: parseFloat(end)
                    })
                }, {
                    range: _defineProperty({}, this.options.name + ".end", {
                        gte: parseFloat(end)
                    })
                }]
            }
        };

        var contains = {
            bool: {
                must: [{
                    range: _defineProperty({}, this.options.name + ".start", {
                        gte: parseFloat(start)
                    })
                }, {
                    range: _defineProperty({}, this.options.name + ".end", {
                        lte: parseFloat(end)
                    })
                }]
            }
        };

        return {
            bool: {
                should: [startInside, endInside, contains]
            }
        };
    },
    facet: function facet() {
        var _this = this;

        return _defineProperty({}, this.options.name, {
            title: function title(i18n) {
                return _this.options.title(i18n);
            },

            facet: function facet(value) {
                var ranges = _this.options.ranges || defaultRanges;

                if (value) {
                    var start = parseFloat(value.start);
                    var end = parseFloat(value.end);

                    if (start && end && end - start < 300) {
                        ranges = [];
                        for (var year = start; year < end; year += 10) {
                            ranges.push({
                                from: year,
                                to: year + 9
                            });
                        }
                    }
                }

                return {
                    range: {
                        field: _this.options.name + ".years",
                        ranges: ranges
                    }
                };
            },

            formatBuckets: function formatBuckets(buckets) {
                return buckets.map(function (bucket) {
                    return {
                        text: numRange(bucket),
                        count: bucket.doc_count,
                        url: _defineProperty({}, _this.options.name, {
                            start: bucket.from,
                            end: bucket.to
                        })
                    };
                });
            }
        });
    },
    sort: function sort() {
        return {
            asc: [_defineProperty({}, this.options.name + ".start", {
                order: "asc"
            }), _defineProperty({}, this.options.name + ".end", {
                order: "asc"
            })],

            desc: [_defineProperty({}, this.options.name + ".end", {
                order: "desc"
            }), _defineProperty({}, this.options.name + ".start", {
                order: "desc"
            })]
        };
    },
    renderFilter: function renderFilter(value, values, i18n) {
        return YearRangeFilter({
            name: this.options.name,
            searchName: this.searchName(),
            value: value,
            placeholder: this.options.placeholder(i18n),
            title: this.options.title(i18n)
        });
    },
    renderView: function renderView(value) {
        return YearRangeDisplay({
            name: this.options.name,
            type: this.options.type,
            value: value
        });
    },
    renderEdit: function renderEdit(value) {
        return YearRangeEdit({
            name: this.options.name,
            type: this.options.type,
            value: value
        });
    },
    schema: function schema(Schema) {
        var YearRangeSchema = new Schema({
            // An ID for the year range, computed from the original + start/end
            // properties before validation.
            _id: String,

            // The source string from which the year range was generated
            original: String,

            // A label associated with the year range (e.g. "modified")
            label: String,

            // If the year range should be treated as "circa"
            circa: Boolean,

            // The year range range start and end
            start: { type: Number, es_indexed: true },
            start_ca: Boolean,
            end: { type: Number, es_indexed: true },
            end_ca: Boolean,

            // If the end year is the current year
            current: { type: Boolean, es_indexed: true },

            // A generated list of years which this year range maps to. This is
            // indexed in Elasticsearch for things like histograms and
            // aggregations.
            years: [{ type: Number, es_indexed: true }]
        });

        YearRangeSchema.methods = {
            toJSON: function toJSON() {
                var obj = this.toObject();
                delete obj.original;
                delete obj.years;
                return obj;
            }
        };

        // We generate a list of years in which the record exists, in order
        // to improve querying inside Elasticsearch
        YearRangeSchema.pre("validate", function (next) {
            if (!this.start || !this.end || this.start > this.end) {
                return next();
            }

            var years = [];

            for (var year = this.start; year <= this.end; year += 1) {
                years.push(year);
            }

            this.years = years;

            next();
        });

        // Dynamically generate the _id attribute
        YearRangeSchema.pre("validate", function (next) {
            this._id = this.original || [this.start, this.end].join(",");
            next();
        });

        return {
            type: [YearRangeSchema],
            convert: function convert(obj) {
                return typeof obj === "string" ? yearRange.parse(obj) : obj;
            },
            validateArray: function validateArray(val) {
                return val.start || val.end;
            },
            validationMsg: function validationMsg(i18n) {
                return i18n.gettext("Dates must have a start or end specified.");
            }
        };
    }
};

module.exports = YearRange;