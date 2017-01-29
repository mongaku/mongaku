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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zY2hlbWFzL3R5cGVzL0RpbWVuc2lvbi5qcyJdLCJuYW1lcyI6WyJwZCIsInJlcXVpcmUiLCJSZWFjdCIsIkRpbWVuc2lvbkZpbHRlciIsImNyZWF0ZUZhY3RvcnkiLCJEaW1lbnNpb25EaXNwbGF5IiwibnVtUmFuZ2UiLCJidWNrZXQiLCJ0byIsImZyb20iLCJ1bml0IiwiRGltZW5zaW9uIiwib3B0aW9ucyIsImRlZmF1bHRVbml0IiwiZGVmYXVsdFNlYXJjaFVuaXQiLCJwcm90b3R5cGUiLCJzZWFyY2hOYW1lIiwibmFtZSIsInZhbHVlIiwicXVlcnkiLCJoZWlnaHRNaW4iLCJoZWlnaHRNYXgiLCJ3aWR0aE1pbiIsIndpZHRoTWF4Iiwic2VhcmNoVGl0bGUiLCJpMThuIiwidGl0bGUiLCJoZWlnaHRUaXRsZSIsInJhbmdlIiwiY29udmVydE51bWJlciIsInB1c2giLCJ3aWR0aFRpdGxlIiwiam9pbiIsImZpZWxkcyIsInJldCIsImJyZWFkY3J1bWIiLCJicmVhZGNydW1icyIsInVybCIsImZpbHRlciIsImZpbHRlcnMiLCJndGUiLCJwYXJzZUZsb2F0IiwibHRlIiwiZmFjZXQiLCJmb3JtYXRGYWNldEJ1Y2tldCIsInRleHQiLCJjb3VudCIsImRvY19jb3VudCIsInJhbmdlcyIsImZpZWxkIiwiZm9ybWF0QnVja2V0cyIsImJ1Y2tldHMiLCJtYXAiLCJyZW5kZXJGaWx0ZXIiLCJ2YWx1ZXMiLCJwbGFjZWhvbGRlciIsInJlbmRlclZpZXciLCJ0eXBlIiwic2NoZW1hIiwiU2NoZW1hIiwiRGltZW5zaW9uU2NoZW1hIiwiX2lkIiwiU3RyaW5nIiwib3JpZ2luYWwiLCJ3aWR0aCIsIk51bWJlciIsImVzX2luZGV4ZWQiLCJoZWlnaHQiLCJkZXB0aCIsImxhYmVsIiwibWV0aG9kcyIsInRvSlNPTiIsIm9iaiIsInRvT2JqZWN0IiwicHJlIiwibmV4dCIsImNvbnZlcnQiLCJwYXJzZURpbWVuc2lvbiIsImNvbnZlcnREaW1lbnNpb24iLCJ2YWxpZGF0ZUFycmF5IiwidmFsIiwidmFsaWRhdGlvbk1zZyIsInJlcSIsImdldHRleHQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBTUEsS0FBS0MsUUFBUSxrQkFBUixDQUFYO0FBQ0EsSUFBTUMsUUFBUUQsUUFBUSxPQUFSLENBQWQ7O0FBRUEsSUFBTUUsa0JBQWtCRCxNQUFNRSxhQUFOLENBQ3BCSCxRQUFRLHVDQUFSLENBRG9CLENBQXhCO0FBRUEsSUFBTUksbUJBQW1CSCxNQUFNRSxhQUFOLENBQ3JCSCxRQUFRLHFDQUFSLENBRHFCLENBQXpCOztBQUdBLElBQU1LLFdBQVcsU0FBWEEsUUFBVyxDQUFDQyxNQUFEO0FBQUEsV0FBWUEsT0FBT0MsRUFBUCxJQUN0QkQsT0FBT0UsSUFBUCxJQUFlLENBRE8sVUFDRkYsT0FBT0MsRUFETCxHQUNVRCxPQUFPRyxJQURqQixRQUV0QkgsT0FBT0UsSUFGZSxHQUVSRixPQUFPRyxJQUZDLE1BQVo7QUFBQSxDQUFqQjs7QUFJQSxJQUFNQyxZQUFZLFNBQVpBLFNBQVksQ0FBU0MsT0FBVCxFQUFrQjtBQUNoQyxTQUFLQSxPQUFMLEdBQWVBLE9BQWY7QUFDQSxTQUFLQyxXQUFMLEdBQW1CRCxRQUFRQyxXQUFSLElBQXVCLElBQTFDO0FBQ0EsU0FBS0MsaUJBQUwsR0FBeUJGLFFBQVFFLGlCQUFSLElBQTZCLElBQXREOztBQUVBOzs7Ozs7Ozs7OztBQVdILENBaEJEOztBQWtCQUgsVUFBVUksU0FBVixHQUFzQjtBQUNsQkMsY0FEa0Isd0JBQ0w7QUFDVCxlQUFPLEtBQUtKLE9BQUwsQ0FBYUksVUFBYixJQUEyQixLQUFLSixPQUFMLENBQWFLLElBQS9DO0FBQ0gsS0FIaUI7QUFLbEJDLFNBTGtCLGlCQUtaQyxLQUxZLEVBS0w7QUFDVCxZQUFNQyxZQUFZRCxNQUFTLEtBQUtILFVBQUwsRUFBVCxnQkFBbEI7QUFDQSxZQUFNSyxZQUFZRixNQUFTLEtBQUtILFVBQUwsRUFBVCxnQkFBbEI7QUFDQSxZQUFNTSxXQUFXSCxN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UCxHQUFpQjFFLFNBQWpCIiwiZmlsZSI6IkRpbWVuc2lvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHBkID0gcmVxdWlyZShcInBhcnNlLWRpbWVuc2lvbnNcIik7XG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxuY29uc3QgRGltZW5zaW9uRmlsdGVyID0gUmVhY3QuY3JlYXRlRmFjdG9yeShcbiAgICByZXF1aXJlKFwiLi4vLi4vdmlld3MvdHlwZXMvZmlsdGVyL0RpbWVuc2lvbi5qc1wiKSk7XG5jb25zdCBEaW1lbnNpb25EaXNwbGF5ID0gUmVhY3QuY3JlYXRlRmFjdG9yeShcbiAgICByZXF1aXJlKFwiLi4vLi4vdmlld3MvdHlwZXMvdmlldy9EaW1lbnNpb24uanNcIikpO1xuXG5jb25zdCBudW1SYW5nZSA9IChidWNrZXQpID0+IGJ1Y2tldC50byA/XG4gICAgYCR7YnVja2V0LmZyb20gfHwgMH0tJHtidWNrZXQudG99JHtidWNrZXQudW5pdH1gIDpcbiAgICBgJHtidWNrZXQuZnJvbX0ke2J1Y2tldC51bml0fStgO1xuXG5jb25zdCBEaW1lbnNpb24gPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmRlZmF1bHRVbml0ID0gb3B0aW9ucy5kZWZhdWx0VW5pdCB8fCBcIm1tXCI7XG4gICAgdGhpcy5kZWZhdWx0U2VhcmNoVW5pdCA9IG9wdGlvbnMuZGVmYXVsdFNlYXJjaFVuaXQgfHwgXCJjbVwiO1xuXG4gICAgLypcbiAgICBuYW1lXG4gICAgdHlwZVxuICAgIHNlYXJjaE5hbWVcbiAgICBkZWZhdWx0VW5pdFxuICAgIGRlZmF1bHRTZWFyY2hVbml0XG4gICAgdGl0bGUoaTE4bilcbiAgICB3aWR0aFRpdGxlKGkxOG4pXG4gICAgaGVpZ2h0VGl0bGUoaTE4bilcbiAgICBwbGFjZWhvbGRlcihpMThuKVxuICAgICovXG59O1xuXG5EaW1lbnNpb24ucHJvdG90eXBlID0ge1xuICAgIHNlYXJjaE5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc2VhcmNoTmFtZSB8fCB0aGlzLm9wdGlvbnMubmFtZTtcbiAgICB9LFxuXG4gICAgdmFsdWUocXVlcnkpIHtcbiAgICAgICAgY29uc3QgaGVpZ2h0TWluID0gcXVlcnlbYCR7dGhpcy5zZWFyY2hOYW1lKCl9LmhlaWdodE1pbmBdO1xuICAgICAgICBjb25zdCBoZWlnaHRNYXggPSBxdWVyeVtgJHt0aGlzLnNlYXJjaE5hbWUoKX0uaGVpZ2h0TWF4YF07XG4gICAgICAgIGNvbnN0IHdpZHRoTWluID0gcXVlcnlbYCR7dGhpcy5zZWFyY2hOYW1lKCl9LndpZHRoTWluYF07XG4gICAgICAgIGNvbnN0IHdpZHRoTWF4ID0gcXVlcnlbYCR7dGhpcy5zZWFyY2hOYW1lKCl9LndpZHRoTWF4YF07XG4gICAgICAgIGNvbnN0IHVuaXQgPSBxdWVyeVtgJHt0aGlzLnNlYXJjaE5hbWUoKX0udW5pdGBdIHx8XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRTZWFyY2hVbml0IHx8IHRoaXMuZGVmYXVsdFVuaXQ7XG5cbiAgICAgICAgaWYgKGhlaWdodE1pbiB8fCBoZWlnaHRNYXggfHwgd2lkdGhNaW4gfHwgd2lkdGhNYXgpIHtcbiAgICAgICAgICAgIHJldHVybiB7aGVpZ2h0TWluLCBoZWlnaHRNYXgsIHdpZHRoTWluLCB3aWR0aE1heCwgdW5pdH07XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2VhcmNoVGl0bGUodmFsdWUsIGkxOG4pIHtcbiAgICAgICAgY29uc3QgZGVmYXVsdFVuaXQgPSB0aGlzLmRlZmF1bHRVbml0O1xuICAgICAgICBjb25zdCB1bml0ID0gdmFsdWUudW5pdCB8fCB0aGlzLmRlZmF1bHRTZWFyY2hVbml0IHx8XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRVbml0O1xuICAgICAgICBjb25zdCB0aXRsZSA9IFtdO1xuXG4gICAgICAgIGlmICh2YWx1ZS5oZWlnaHRNaW4gfHwgdmFsdWUuaGVpZ2h0TWF4KSB7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5vcHRpb25zLmhlaWdodFRpdGxlKGkxOG4pO1xuICAgICAgICAgICAgY29uc3QgcmFuZ2UgPSBudW1SYW5nZSh7XG4gICAgICAgICAgICAgICAgZnJvbTogcGQuY29udmVydE51bWJlcih2YWx1ZS5oZWlnaHRNaW4sIGRlZmF1bHRVbml0LCB1bml0KSxcbiAgICAgICAgICAgICAgICB0bzogcGQuY29udmVydE51bWJlcih2YWx1ZS5oZWlnaHRNYXgsIGRlZmF1bHRVbml0LCB1bml0KSxcbiAgICAgICAgICAgICAgICB1bml0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aXRsZS5wdXNoKGAke25hbWV9OiAke3JhbmdlfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlLndpZHRoTWluIHx8IHZhbHVlLndpZHRoTWF4KSB7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5vcHRpb25zLndpZHRoVGl0bGUoaTE4bik7XG4gICAgICAgICAgICBjb25zdCByYW5nZSA9IG51bVJhbmdlKHtcbiAgICAgICAgICAgICAgICBmcm9tOiBwZC5jb252ZXJ0TnVtYmVyKHZhbHVlLndpZHRoTWluLCBkZWZhdWx0VW5pdCwgdW5pdCksXG4gICAgICAgICAgICAgICAgdG86IHBkLmNvbnZlcnROdW1iZXIodmFsdWUud2lkdGhNYXgsIGRlZmF1bHRVbml0LCB1bml0KSxcbiAgICAgICAgICAgICAgICB1bml0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aXRsZS5wdXNoKGAke25hbWV9OiAke3JhbmdlfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRpdGxlLmpvaW4oXCIsIFwiKTtcbiAgICB9LFxuXG4gICAgZmllbGRzKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IHt9O1xuICAgICAgICBjb25zdCBkZWZhdWx0VW5pdCA9IHRoaXMuZGVmYXVsdFNlYXJjaFVuaXQgfHwgdGhpcy5kZWZhdWx0VW5pdDtcblxuICAgICAgICBpZiAodmFsdWUuaGVpZ2h0TWluKSB7XG4gICAgICAgICAgICByZXRbYCR7dGhpcy5zZWFyY2hOYW1lKCl9LmhlaWdodE1pbmBdID0gdmFsdWUuaGVpZ2h0TWluO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlLmhlaWdodE1heCkge1xuICAgICAgICAgICAgcmV0W2Ake3RoaXMuc2VhcmNoTmFtZSgpfS5oZWlnaHRNYXhgXSA9IHZhbHVlLmhlaWdodE1heDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YWx1ZS53aWR0aE1pbikge1xuICAgICAgICAgICAgcmV0W2Ake3RoaXMuc2VhcmNoTmFtZSgpfS53aWR0aE1pbmBdID0gdmFsdWUud2lkdGhNaW47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWUud2lkdGhNYXgpIHtcbiAgICAgICAgICAgIHJldFtgJHt0aGlzLnNlYXJjaE5hbWUoKX0ud2lkdGhNYXhgXSA9IHZhbHVlLndpZHRoTWF4O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlLnVuaXQgJiYgdmFsdWUudW5pdCAhPT0gZGVmYXVsdFVuaXQpIHtcbiAgICAgICAgICAgIHJldFtgJHt0aGlzLnNlYXJjaE5hbWUoKX0udW5pdGBdID0gdmFsdWUudW5pdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIGJyZWFkY3J1bWIodmFsdWUsIGkxOG4pIHtcbiAgICAgICAgY29uc3QgYnJlYWRjcnVtYnMgPSBbXTtcblxuICAgICAgICBpZiAodmFsdWUuaGVpZ2h0TWluIHx8IHZhbHVlLmhlaWdodE1heCkge1xuICAgICAgICAgICAgY29uc3QgdGl0bGUgPSB0aGlzLm9wdGlvbnMuaGVpZ2h0VGl0bGUoaTE4bik7XG4gICAgICAgICAgICBjb25zdCByYW5nZSA9IG51bVJhbmdlKHtcbiAgICAgICAgICAgICAgICBmcm9tOiB2YWx1ZS5oZWlnaHRNaW4sXG4gICAgICAgICAgICAgICAgdG86IHZhbHVlLmhlaWdodE1heCxcbiAgICAgICAgICAgICAgICB1bml0OiB2YWx1ZS51bml0LFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGJyZWFkY3J1bWJzLnB1c2goe1xuICAgICAgICAgICAgICAgIHRpdGxlOiBgJHt0aXRsZX06ICR7cmFuZ2V9YCxcbiAgICAgICAgICAgICAgICB1cmw6IHtcbiAgICAgICAgICAgICAgICAgICAgW3RoaXMub3B0aW9ucy5uYW1lXToge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0TWluOiB2YWx1ZS5oZWlnaHRNaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHRNYXg6IHZhbHVlLmhlaWdodE1heCxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWUud2lkdGhNaW4gfHwgdmFsdWUud2lkdGhNYXgpIHtcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gdGhpcy5vcHRpb25zLndpZHRoVGl0bGUoaTE4bik7XG4gICAgICAgICAgICBjb25zdCByYW5nZSA9IG51bVJhbmdlKHtcbiAgICAgICAgICAgICAgICBmcm9tOiB2YWx1ZS53aWR0aE1pbixcbiAgICAgICAgICAgICAgICB0bzogdmFsdWUud2lkdGhNYXgsXG4gICAgICAgICAgICAgICAgdW5pdDogdmFsdWUudW5pdCxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBicmVhZGNydW1icy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogYCR7dGl0bGV9OiAke3JhbmdlfWAsXG4gICAgICAgICAgICAgICAgdXJsOiB7XG4gICAgICAgICAgICAgICAgICAgIFt0aGlzLm9wdGlvbnMubmFtZV06IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoTWluOiB2YWx1ZS53aWR0aE1pbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoTWF4OiB2YWx1ZS53aWR0aE1heCxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYnJlYWRjcnVtYnM7XG4gICAgfSxcblxuICAgIGZpbHRlcih2YWx1ZSkge1xuICAgICAgICBjb25zdCBmaWx0ZXJzID0gW107XG5cbiAgICAgICAgaWYgKHZhbHVlLndpZHRoTWluKSB7XG4gICAgICAgICAgICBmaWx0ZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICAgICAgICAgIFtgJHt0aGlzLm9wdGlvbnMubmFtZX0ud2lkdGhgXToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3RlOiBwZC5jb252ZXJ0TnVtYmVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQodmFsdWUud2lkdGhNaW4pLCB2YWx1ZS51bml0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRVbml0KSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWUud2lkdGhNYXgpIHtcbiAgICAgICAgICAgIGZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgW2Ake3RoaXMub3B0aW9ucy5uYW1lfS53aWR0aGBdOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsdGU6IHBkLmNvbnZlcnROdW1iZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCh2YWx1ZS53aWR0aE1heCksIHZhbHVlLnVuaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdFVuaXQpLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YWx1ZS5oZWlnaHRNaW4pIHtcbiAgICAgICAgICAgIGZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgW2Ake3RoaXMub3B0aW9ucy5uYW1lfS5oZWlnaHRgXToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3RlOiBwZC5jb252ZXJ0TnVtYmVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQodmFsdWUuaGVpZ2h0TWluKSwgdmFsdWUudW5pdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0VW5pdCksXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlLmhlaWdodE1heCkge1xuICAgICAgICAgICAgZmlsdGVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICByYW5nZToge1xuICAgICAgICAgICAgICAgICAgICBbYCR7dGhpcy5vcHRpb25zLm5hbWV9LmhlaWdodGBdOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsdGU6IHBkLmNvbnZlcnROdW1iZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VGbG9hdCh2YWx1ZS5oZWlnaHRNYXgpLCB2YWx1ZS51bml0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRVbml0KSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsdGVycztcbiAgICB9LFxuXG4gICAgZmFjZXQoKSB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRVbml0ID0gdGhpcy5kZWZhdWx0VW5pdDtcbiAgICAgICAgY29uc3QgdW5pdCA9IHRoaXMuZGVmYXVsdFNlYXJjaFVuaXQgfHwgdGhpcy5kZWZhdWx0VW5pdDtcblxuICAgICAgICBjb25zdCBmb3JtYXRGYWNldEJ1Y2tldCA9IChidWNrZXQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSBudW1SYW5nZSh7XG4gICAgICAgICAgICAgICAgZnJvbTogcGQuY29udmVydE51bWJlcihidWNrZXQuZnJvbSwgZGVmYXVsdFVuaXQsIHVuaXQpLFxuICAgICAgICAgICAgICAgIHRvOiBwZC5jb252ZXJ0TnVtYmVyKGJ1Y2tldC50bywgZGVmYXVsdFVuaXQsIHVuaXQpLFxuICAgICAgICAgICAgICAgIHVuaXQsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0ZXh0LFxuICAgICAgICAgICAgICAgIGNvdW50OiBidWNrZXQuZG9jX2NvdW50LFxuICAgICAgICAgICAgICAgIHVybDoge1xuICAgICAgICAgICAgICAgICAgICBbdGhpcy5vcHRpb25zLm5hbWVdOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aE1pbjogYnVja2V0LmZyb20sXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aE1heDogYnVja2V0LnRvLFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdCxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCByYW5nZXMgPSBbXG4gICAgICAgICAgICB7IHRvOiA5OSB9LFxuICAgICAgICAgICAgeyBmcm9tOiAxMDAsIHRvOiAxOTkgfSxcbiAgICAgICAgICAgIHsgZnJvbTogMjAwLCB0bzogMjk5IH0sXG4gICAgICAgICAgICB7IGZyb206IDMwMCwgdG86IDM5OSB9LFxuICAgICAgICAgICAgeyBmcm9tOiA0MDAsIHRvOiA0OTkgfSxcbiAgICAgICAgICAgIHsgZnJvbTogNTAwLCB0bzogNTk5IH0sXG4gICAgICAgICAgICB7IGZyb206IDYwMCwgdG86IDY5OSB9LFxuICAgICAgICAgICAgeyBmcm9tOiA3MDAsIHRvOiA3OTkgfSxcbiAgICAgICAgICAgIHsgZnJvbTogODAwLCB0bzogODk5IH0sXG4gICAgICAgICAgICB7IGZyb206IDkwMCwgdG86IDk5OSB9LFxuICAgICAgICAgICAgeyBmcm9tOiAxMDAwLCB0bzogMTI0OSB9LFxuICAgICAgICAgICAgeyBmcm9tOiAxMjUwLCB0bzogMTU5OSB9LFxuICAgICAgICAgICAgeyBmcm9tOiAxNTAwLCB0bzogMTc0OSB9LFxuICAgICAgICAgICAgeyBmcm9tOiAxNzUwLCB0bzogMTk5OSB9LFxuICAgICAgICAgICAgeyBmcm9tOiAyMDAwIH0sXG4gICAgICAgIF07XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFtgJHt0aGlzLm9wdGlvbnMubmFtZX0ud2lkdGhgXToge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAoaTE4bikgPT4gdGhpcy5vcHRpb25zLndpZHRoVGl0bGUoaTE4biksXG5cbiAgICAgICAgICAgICAgICBmYWNldDogKCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkOiBgJHt0aGlzLm9wdGlvbnMubmFtZX0ud2lkdGhgLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2VzLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0pLFxuXG4gICAgICAgICAgICAgICAgZm9ybWF0QnVja2V0czogKGJ1Y2tldHMpID0+IGJ1Y2tldHMubWFwKGZvcm1hdEZhY2V0QnVja2V0KSxcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIFtgJHt0aGlzLm9wdGlvbnMubmFtZX0uaGVpZ2h0YF06IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogKGkxOG4pID0+IHRoaXMub3B0aW9ucy5oZWlnaHRUaXRsZShpMThuKSxcblxuICAgICAgICAgICAgICAgIGZhY2V0OiAoKSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICByYW5nZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQ6IGAke3RoaXMub3B0aW9ucy5uYW1lfS5oZWlnaHRgLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2VzLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0pLFxuXG4gICAgICAgICAgICAgICAgZm9ybWF0QnVja2V0czogKGJ1Y2tldHMpID0+IGJ1Y2tldHMubWFwKGZvcm1hdEZhY2V0QnVja2V0KSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIHJlbmRlckZpbHRlcih2YWx1ZSwgdmFsdWVzLCBpMThuKSB7XG4gICAgICAgIHJldHVybiBEaW1lbnNpb25GaWx0ZXIoe1xuICAgICAgICAgICAgbmFtZTogdGhpcy5vcHRpb25zLm5hbWUsXG4gICAgICAgICAgICBzZWFyY2hOYW1lOiB0aGlzLnNlYXJjaE5hbWUoKSxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiB0aGlzLm9wdGlvbnMucGxhY2Vob2xkZXIoaTE4biksXG4gICAgICAgICAgICBoZWlnaHRUaXRsZTogdGhpcy5vcHRpb25zLmhlaWdodFRpdGxlKGkxOG4pLFxuICAgICAgICAgICAgd2lkdGhUaXRsZTogdGhpcy5vcHRpb25zLndpZHRoVGl0bGUoaTE4biksXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJlbmRlclZpZXcodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIERpbWVuc2lvbkRpc3BsYXkoe1xuICAgICAgICAgICAgbmFtZTogdGhpcy5vcHRpb25zLm5hbWUsXG4gICAgICAgICAgICB0eXBlOiB0aGlzLm9wdGlvbnMudHlwZSxcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgZGVmYXVsdFVuaXQ6IHRoaXMuZGVmYXVsdFNlYXJjaFVuaXQsXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzY2hlbWEoU2NoZW1hKSB7XG4gICAgICAgIGNvbnN0IERpbWVuc2lvblNjaGVtYSA9IG5ldyBTY2hlbWEoe1xuICAgICAgICAgICAgLy8gQW4gSUQgZm9yIHRoZSBkaW1lbnNpb24sIGNvbXB1dGVkIGZyb20gdGhlIG9yaWdpbmFsICtcbiAgICAgICAgICAgIC8vIHdpZHRoL2hlaWdodCBwcm9wZXJ0aWVzIGJlZm9yZSB2YWxpZGF0aW9uLlxuICAgICAgICAgICAgX2lkOiBTdHJpbmcsXG5cbiAgICAgICAgICAgIC8vIFRoZSBzb3VyY2Ugc3RyaW5nIGZyb20gd2hpY2ggdGhlIGRpbWVuc2lvbnMgd2VyZSBnZW5lcmF0ZWRcbiAgICAgICAgICAgIG9yaWdpbmFsOiBTdHJpbmcsXG5cbiAgICAgICAgICAgIC8vIFRoZSB3aWR0aC9oZWlnaHQvZGVwdGggb2YgdGhlIG9iamVjdCAoc3RvcmVkIGluIG1pbGxpbWV0ZXJzKVxuICAgICAgICAgICAgd2lkdGg6IHt0eXBlOiBOdW1iZXIsIGVzX2luZGV4ZWQ6IHRydWV9LFxuICAgICAgICAgICAgaGVpZ2h0OiB7dHlwZTogTnVtYmVyLCBlc19pbmRleGVkOiB0cnVlfSxcbiAgICAgICAgICAgIGRlcHRoOiB7dHlwZTogTnVtYmVyLCBlc19pbmRleGVkOiB0cnVlfSxcblxuICAgICAgICAgICAgLy8gQSBsYWJlbCBmb3IgdGhlIGRpbWVuc2lvbnMgKGUuZy4gXCJ3aXRoIGZyYW1lXCIpXG4gICAgICAgICAgICBsYWJlbDogU3RyaW5nLFxuXG4gICAgICAgICAgICAvLyBUaGUgdW5pdCBmb3IgdGhlIGRpbWVuc2lvbnMgKGRlZmF1bHRzIHRvIG1pbGxpbWV0ZXJzKVxuICAgICAgICAgICAgdW5pdDoge3R5cGU6IFN0cmluZywgZXNfaW5kZXhlZDogdHJ1ZX0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIERpbWVuc2lvblNjaGVtYS5tZXRob2RzID0ge1xuICAgICAgICAgICAgdG9KU09OKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9iaiA9IHRoaXMudG9PYmplY3QoKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgb2JqLm9yaWdpbmFsO1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIER5bmFtaWNhbGx5IGdlbmVyYXRlIHRoZSBfaWQgYXR0cmlidXRlXG4gICAgICAgIERpbWVuc2lvblNjaGVtYS5wcmUoXCJ2YWxpZGF0ZVwiLCBmdW5jdGlvbihuZXh0KSB7XG4gICAgICAgICAgICB0aGlzLl9pZCA9IHRoaXMub3JpZ2luYWwgfHxcbiAgICAgICAgICAgICAgICBbdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQsIHRoaXMudW5pdF0uam9pbihcIixcIik7XG4gICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBbRGltZW5zaW9uU2NoZW1hXSxcbiAgICAgICAgICAgIGNvbnZlcnQ6IChvYmopID0+IHR5cGVvZiBvYmogPT09IFwic3RyaW5nXCIgP1xuICAgICAgICAgICAgICAgIHBkLnBhcnNlRGltZW5zaW9uKG9iaiwgdHJ1ZSwgdGhpcy5kZWZhdWx0VW5pdCkgOlxuICAgICAgICAgICAgICAgIHBkLmNvbnZlcnREaW1lbnNpb24ob2JqLCB0aGlzLmRlZmF1bHRVbml0KSxcbiAgICAgICAgICAgIHZhbGlkYXRlQXJyYXk6ICh2YWwpID0+ICh2YWwud2lkdGggfHwgdmFsLmhlaWdodCkgJiYgdmFsLnVuaXQsXG4gICAgICAgICAgICB2YWxpZGF0aW9uTXNnOiAocmVxKSA9PiByZXEuZ2V0dGV4dChcIkRpbWVuc2lvbnMgbXVzdCBoYXZlIGEgXCIgK1xuICAgICAgICAgICAgICAgIFwidW5pdCBzcGVjaWZpZWQgYW5kIGF0IGxlYXN0IGEgd2lkdGggb3IgaGVpZ2h0LlwiKSxcbiAgICAgICAgfTtcbiAgICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaW1lbnNpb247XG4iXX0=