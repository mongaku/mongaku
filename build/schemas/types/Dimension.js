"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var pd = require("parse-dimensions");
var React = require("react");

var DimensionFilter = React.createFactory(require("../../views/types/filter/Dimension.js"));
var DimensionDisplay = React.createFactory(require("../../views/types/view/Dimension.js"));

var numRange = function numRange(bucket) {
    return bucket.to ? (bucket.from || 0) + "-" + bucket.to + bucket.unit : "" + bucket.from + bucket.unit + "+";
};

var Dimension = function Dimension(options) {
    this.options = options;
    this.defaultUnit = options.defaultUnit || "mm";
    this.defaultSearchUnit = options.defaultSearchUnit || "cm";

    /*
    name
    type
    searchName
    defaultUnit
    defaultSearchUnit
    title(i18n)
    widthTitle(i18n)
    heightTitle(i18n)
    placeholder(i18n)
    */
};

Dimension.prototype = {
    searchName: function searchName() {
        return this.options.searchName || this.options.name;
    },
    value: function value(query) {
        var heightMin = query[this.searchName() + ".heightMin"];
        var heightMax = query[this.searchName() + ".heightMax"];
        var widthMin = query[this.searchName() + ".widthMin"];
        var widthMax = query[this.searchName() + ".widthMax"];
        var unit = query[this.searchName() + ".unit"] || this.defaultSearchUnit || this.defaultUnit;

        if (heightMin || heightMax || widthMin || widthMax) {
            return { heightMin: heightMin, heightMax: heightMax, widthMin: widthMin, widthMax: widthMax, unit: unit };
        }
    },
    searchTitle: function searchTitle(value, i18n) {
        var defaultUnit = this.defaultUnit;
        var unit = value.unit || this.defaultSearchUnit || this.defaultUnit;
        var title = [];

        if (value.heightMin || value.heightMax) {
            var name = this.options.heightTitle(i18n);
            var range = numRange({
                from: pd.convertNumber(value.heightMin, defaultUnit, unit),
                to: pd.convertNumber(value.heightMax, defaultUnit, unit),
                unit: unit
            });
            title.push(name + ": " + range);
        }

        if (value.widthMin || value.widthMax) {
            var _name = this.options.widthTitle(i18n);
            var _range = numRange({
                from: pd.convertNumber(value.widthMin, defaultUnit, unit),
                to: pd.convertNumber(value.widthMax, defaultUnit, unit),
                unit: unit
            });
            title.push(_name + ": " + _range);
        }

        return title.join(", ");
    },
    fields: function fields(value) {
        var ret = {};
        var defaultUnit = this.defaultSearchUnit || this.defaultUnit;

        if (value.heightMin) {
            ret[this.searchName() + ".heightMin"] = value.heightMin;
        }

        if (value.heightMax) {
            ret[this.searchName() + ".heightMax"] = value.heightMax;
        }

        if (value.widthMin) {
            ret[this.searchName() + ".widthMin"] = value.widthMin;
        }

        if (value.widthMax) {
            ret[this.searchName() + ".widthMax"] = value.widthMax;
        }

        if (value.unit && value.unit !== defaultUnit) {
            ret[this.searchName() + ".unit"] = value.unit;
        }

        return ret;
    },
    breadcrumb: function breadcrumb(value, i18n) {
        var breadcrumbs = [];

        if (value.heightMin || value.heightMax) {
            var title = this.options.heightTitle(i18n);
            var range = numRange({
                from: value.heightMin,
                to: value.heightMax,
                unit: value.unit
            });

            breadcrumbs.push({
                title: title + ": " + range,
                url: _defineProperty({}, this.options.name, {
                    heightMin: value.heightMin,
                    heightMax: value.heightMax
                })
            });
        }

        if (value.widthMin || value.widthMax) {
            var _title = this.options.widthTitle(i18n);
            var _range2 = numRange({
                from: value.widthMin,
                to: value.widthMax,
                unit: value.unit
            });

            breadcrumbs.push({
                title: _title + ": " + _range2,
                url: _defineProperty({}, this.options.name, {
                    widthMin: value.widthMin,
                    widthMax: value.widthMax
                })
            });
        }

        return breadcrumbs;
    },
    filter: function filter(value) {
        var filters = [];

        if (value.widthMin) {
            filters.push({
                range: _defineProperty({}, this.options.name + ".width", {
                    gte: pd.convertNumber(parseFloat(value.widthMin), value.unit, this.defaultUnit)
                })
            });
        }

        if (value.widthMax) {
            filters.push({
                range: _defineProperty({}, this.options.name + ".width", {
                    lte: pd.convertNumber(parseFloat(value.widthMax), value.unit, this.defaultUnit)
                })
            });
        }

        if (value.heightMin) {
            filters.push({
                range: _defineProperty({}, this.options.name + ".height", {
                    gte: pd.convertNumber(parseFloat(value.heightMin), value.unit, this.defaultUnit)
                })
            });
        }

        if (value.heightMax) {
            filters.push({
                range: _defineProperty({}, this.options.name + ".height", {
                    lte: pd.convertNumber(parseFloat(value.heightMax), value.unit, this.defaultUnit)
                })
            });
        }

        return filters;
    },
    facet: function facet() {
        var _this = this,
            _ref;

        var defaultUnit = this.defaultUnit;
        var unit = this.defaultSearchUnit || this.defaultUnit;

        var formatFacetBucket = function formatFacetBucket(bucket) {
            var text = numRange({
                from: pd.convertNumber(bucket.from, defaultUnit, unit),
                to: pd.convertNumber(bucket.to, defaultUnit, unit),
                unit: unit
            });

            return {
                text: text,
                count: bucket.doc_count,
                url: _defineProperty({}, _this.options.name, {
                    widthMin: bucket.from,
                    widthMax: bucket.to,
                    unit: unit
                })
            };
        };

        var ranges = [{ to: 99 }, { from: 100, to: 199 }, { from: 200, to: 299 }, { from: 300, to: 399 }, { from: 400, to: 499 }, { from: 500, to: 599 }, { from: 600, to: 699 }, { from: 700, to: 799 }, { from: 800, to: 899 }, { from: 900, to: 999 }, { from: 1000, to: 1249 }, { from: 1250, to: 1599 }, { from: 1500, to: 1749 }, { from: 1750, to: 1999 }, { from: 2000 }];

        return _ref = {}, _defineProperty(_ref, this.options.name + ".width", {
            title: function title(i18n) {
                return _this.options.widthTitle(i18n);
            },

            facet: function facet() {
                return {
                    range: {
                        field: _this.options.name + ".width",
                        ranges: ranges
                    }
                };
            },

            formatBuckets: function formatBuckets(buckets) {
                return buckets.map(formatFacetBucket);
            }
        }), _defineProperty(_ref, this.options.name + ".height", {
            title: function title(i18n) {
                return _this.options.heightTitle(i18n);
            },

            facet: function facet() {
                return {
                    range: {
                        field: _this.options.name + ".height",
                        ranges: ranges
                    }
                };
            },

            formatBuckets: function formatBuckets(buckets) {
                return buckets.map(formatFacetBucket);
            }
        }), _ref;
    },
    renderFilter: function renderFilter(value, values, i18n) {
        return DimensionFilter({
            name: this.options.name,
            searchName: this.searchName(),
            placeholder: this.options.placeholder(i18n),
            heightTitle: this.options.heightTitle(i18n),
            widthTitle: this.options.widthTitle(i18n),
            value: value
        });
    },
    renderView: function renderView(value) {
        return DimensionDisplay({
            name: this.options.name,
            type: this.options.type,
            value: value,
            defaultUnit: this.defaultSearchUnit
        });
    },
    schema: function schema(Schema) {
        var _this2 = this;

        var DimensionSchema = new Schema({
            // An ID for the dimension, computed from the original +
            // width/height properties before validation.
            _id: String,

            // The source string from which the dimensions were generated
            original: String,

            // The width/height/depth of the object (stored in millimeters)
            width: { type: Number, es_indexed: true },
            height: { type: Number, es_indexed: true },
            depth: { type: Number, es_indexed: true },

            // A label for the dimensions (e.g. "with frame")
            label: String,

            // The unit for the dimensions (defaults to millimeters)
            unit: { type: String, es_indexed: true }
        });

        DimensionSchema.methods = {
            toJSON: function toJSON() {
                var obj = this.toObject();
                delete obj.original;
                return obj;
            }
        };

        // Dynamically generate the _id attribute
        DimensionSchema.pre("validate", function (next) {
            this._id = this.original || [this.width, this.height, this.unit].join(",");
            next();
        });

        return {
            type: [DimensionSchema],
            convert: function convert(obj) {
                return typeof obj === "string" ? pd.parseDimension(obj, true, _this2.defaultUnit) : pd.convertDimension(obj, _this2.defaultUnit);
            },
            validateArray: function validateArray(val) {
                return (val.width || val.height) && val.unit;
            },
            validationMsg: function validationMsg(req) {
                return req.gettext("Dimensions must have a " + "unit specified and at least a width or height.");
            }
        };
    }
};

module.exports = Dimension;