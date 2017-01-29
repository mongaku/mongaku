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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zY2hlbWFzL3R5cGVzL1llYXJSYW5nZS5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsInJlcXVpcmUiLCJ5ZWFyUmFuZ2UiLCJZZWFyUmFuZ2VGaWx0ZXIiLCJjcmVhdGVGYWN0b3J5IiwiWWVhclJhbmdlRGlzcGxheSIsIlllYXJSYW5nZUVkaXQiLCJudW1SYW5nZSIsImJ1Y2tldCIsInRvIiwiZnJvbSIsImRlZmF1bHRSYW5nZXMiLCJZZWFyUmFuZ2UiLCJvcHRpb25zIiwicHJvdG90eXBlIiwic2VhcmNoTmFtZSIsIm5hbWUiLCJ2YWx1ZSIsInF1ZXJ5Iiwic3RhcnQiLCJlbmQiLCJmaWVsZHMiLCJzZWFyY2hUaXRsZSIsImkxOG4iLCJ0aXRsZSIsInJhbmdlIiwiZmlsdGVyIiwiRGF0ZSIsImdldFllYXIiLCJzdGFydEluc2lkZSIsImJvb2wiLCJtdXN0IiwibHRlIiwicGFyc2VGbG9hdCIsImd0ZSIsImVuZEluc2lkZSIsImNvbnRhaW5zIiwic2hvdWxkIiwiZmFjZXQiLCJyYW5nZXMiLCJ5ZWFyIiwicHVzaCIsImZpZWxkIiwiZm9ybWF0QnVja2V0cyIsImJ1Y2tldHMiLCJtYXAiLCJ0ZXh0IiwiY291bnQiLCJkb2NfY291bnQiLCJ1cmwiLCJzb3J0IiwiYXNjIiwib3JkZXIiLCJkZXNjIiwicmVuZGVyRmlsdGVyIiwidmFsdWVzIiwicGxhY2Vob2xkZXIiLCJyZW5kZXJWaWV3IiwidHlwZSIsInJlbmRlckVkaXQiLCJzY2hlbWEiLCJTY2hlbWEiLCJZZWFyUmFuZ2VTY2hlbWEiLCJfaWQiLCJTdHJpbmciLCJvcmlnaW5hbCIsImxhYmVsIiwiY2lyY2EiLCJCb29sZWFuIiwiTnVtYmVyIiwiZXNfaW5kZXhlZCIsInN0YXJ0X2NhIiwiZW5kX2NhIiwiY3VycmVudCIsInllYXJzIiwibWV0aG9kcyIsInRvSlNPTiIsIm9iaiIsInRvT2JqZWN0IiwicHJlIiwibmV4dCIsImpvaW4iLCJjb252ZXJ0IiwicGFyc2UiLCJ2YWxpZGF0ZUFy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SUFBNEIsS0FBS0QsS0FBTCxHQUFhLEtBQUtDLEdBQWxELEVBQXVEO0FBQ25ELHVCQUFPNEQsTUFBUDtBQUNIOztBQUVELGdCQUFNTixRQUFRLEVBQWQ7O0FBRUEsaUJBQUssSUFBSWxDLE9BQU8sS0FBS3JCLEtBQXJCLEVBQTRCcUIsUUFBUSxLQUFLcEIsR0FBekMsRUFBOENvQixRQUFRLENBQXRELEVBQXlEO0FBQ3JEa0Msc0JBQU1qQyxJQUFOLENBQVdELElBQVg7QUFDSDs7QUFFRCxpQkFBS2tDLEtBQUwsR0FBYUEsS0FBYjs7QUFFQU07QUFDSCxTQWREOztBQWdCQTtBQUNBbEIsd0JBQWdCaUIsR0FBaEIsQ0FBb0IsVUFBcEIsRUFBZ0MsVUFBU0MsSUFBVCxFQUFlO0FBQzNDLGlCQUFLakIsR0FBTCxHQUFXLEtBQUtFLFFBQUwsSUFBaUIsQ0FBQyxLQUFLOUMsS0FBTixFQUFhLEtBQUtDLEdBQWxCLEVBQXVCNkQsSUFBdkIsQ0FBNEIsR0FBNUIsQ0FBNUI7QUFDQUQ7QUFDSCxTQUhEOztBQUtBLGVBQU87QUFDSHRCLGtCQUFNLENBQUNJLGVBQUQsQ0FESDtBQUVIb0IscUJBQVMsaUJBQUNMLEdBQUQ7QUFBQSx1QkFBUyxPQUFPQSxHQUFQLEtBQWUsUUFBZixHQUNkM0UsVUFBVWlGLEtBQVYsQ0FBZ0JOLEdBQWhCLENBRGMsR0FDU0EsR0FEbEI7QUFBQSxhQUZOO0FBSUhPLDJCQUFlLHVCQUFDQyxHQUFEO0FBQUEsdUJBQVNBLElBQUlsRSxLQUFKLElBQWFrRSxJQUFJakUsR0FBMUI7QUFBQSxhQUpaO0FBS0hrRSwyQkFBZSx1QkFBQy9ELElBQUQ7QUFBQSx1QkFDWEEsS0FBS2dFLE9BQUwsQ0FBYSwyQ0FBYixDQURXO0FBQUE7QUFMWixTQUFQO0FBUUg7QUE3UmlCLENBQXRCOztBQWdTQUMsT0FBT0MsT0FBUCxHQUFpQjdFLFNBQWpCIiwiZmlsZSI6IlllYXJSYW5nZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuY29uc3QgeWVhclJhbmdlID0gcmVxdWlyZShcInllYXJyYW5nZVwiKTtcblxuY29uc3QgWWVhclJhbmdlRmlsdGVyID0gUmVhY3QuY3JlYXRlRmFjdG9yeShcbiAgICByZXF1aXJlKFwiLi4vLi4vdmlld3MvdHlwZXMvZmlsdGVyL1llYXJSYW5nZS5qc1wiKSk7XG5jb25zdCBZZWFyUmFuZ2VEaXNwbGF5ID0gUmVhY3QuY3JlYXRlRmFjdG9yeShcbiAgICByZXF1aXJlKFwiLi4vLi4vdmlld3MvdHlwZXMvdmlldy9ZZWFyUmFuZ2UuanNcIikpO1xuY29uc3QgWWVhclJhbmdlRWRpdCA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkoXG4gICAgcmVxdWlyZShcIi4uLy4uL3ZpZXdzL3R5cGVzL2VkaXQvWWVhclJhbmdlLmpzXCIpKTtcblxuY29uc3QgbnVtUmFuZ2UgPSAoYnVja2V0KSA9PiBidWNrZXQudG8gP1xuICAgIGAke2J1Y2tldC5mcm9tIHx8IDB9LSR7YnVja2V0LnRvfWAgOlxuICAgIGAke2J1Y2tldC5mcm9tfStgO1xuXG5jb25zdCBkZWZhdWx0UmFuZ2VzID0gW1xuICAgIHsgdG86IDk5OSB9LFxuICAgIHsgZnJvbTogMTAwMCwgdG86IDEwOTkgfSxcbiAgICB7IGZyb206IDExMDAsIHRvOiAxMTk5IH0sXG4gICAgeyBmcm9tOiAxMjAwLCB0bzogMTI5OSB9LFxuICAgIHsgZnJvbTogMTMwMCwgdG86IDEzOTkgfSxcbiAgICB7IGZyb206IDE0MDAsIHRvOiAxNDk5IH0sXG4gICAgeyBmcm9tOiAxNTAwLCB0bzogMTU5OSB9LFxuICAgIHsgZnJvbTogMTYwMCwgdG86IDE2OTkgfSxcbiAgICB7IGZyb206IDE3MDAsIHRvOiAxNzk5IH0sXG4gICAgeyBmcm9tOiAxODAwIH0sXG5dO1xuXG5jb25zdCBZZWFyUmFuZ2UgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAvKlxuICAgIG5hbWVcbiAgICB0eXBlXG4gICAgc2VhcmNoTmFtZVxuICAgIHJhbmdlc1xuICAgIHRpdGxlKGkxOG4pXG4gICAgcGxhY2Vob2xkZXIoaTE4bilcbiAgICAqL1xufTtcblxuWWVhclJhbmdlLnByb3RvdHlwZSA9IHtcbiAgICBzZWFyY2hOYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnNlYXJjaE5hbWUgfHwgdGhpcy5vcHRpb25zLm5hbWU7XG4gICAgfSxcblxuICAgIHZhbHVlKHF1ZXJ5KSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gcXVlcnlbYCR7dGhpcy5zZWFyY2hOYW1lKCl9LnN0YXJ0YF07XG4gICAgICAgIGNvbnN0IGVuZCA9IHF1ZXJ5W2Ake3RoaXMuc2VhcmNoTmFtZSgpfS5lbmRgXTtcblxuICAgICAgICBpZiAoc3RhcnQgfHwgZW5kKSB7XG4gICAgICAgICAgICByZXR1cm4ge3N0YXJ0LCBlbmR9O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGZpZWxkcyh2YWx1ZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgW2Ake3RoaXMuc2VhcmNoTmFtZSgpfS5zdGFydGBdOiB2YWx1ZS5zdGFydCxcbiAgICAgICAgICAgIFtgJHt0aGlzLnNlYXJjaE5hbWUoKX0uZW5kYF06IHZhbHVlLmVuZCxcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgc2VhcmNoVGl0bGUodmFsdWUsIGkxOG4pIHtcbiAgICAgICAgY29uc3QgdGl0bGUgPSB0aGlzLm9wdGlvbnMudGl0bGUoaTE4bik7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gbnVtUmFuZ2Uoe1xuICAgICAgICAgICAgZnJvbTogdmFsdWUuc3RhcnQsXG4gICAgICAgICAgICB0bzogdmFsdWUuZW5kLFxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gYCR7dGl0bGV9OiAke3JhbmdlfWA7XG4gICAgfSxcblxuICAgIGZpbHRlcih2YWx1ZSkge1xuICAgICAgICAvLyBOT1RFKGplcmVzaWcpOiBUaGVyZSBoYXMgZ290IHRvIGJlIGEgYmV0dGVyIHdheSB0byBoYW5kbGUgdGhpcy5cbiAgICAgICAgY29uc3Qgc3RhcnQgPSB2YWx1ZS5zdGFydCB8fCAtMTAwMDA7XG4gICAgICAgIGNvbnN0IGVuZCA9IHZhbHVlLmVuZCB8fCAobmV3IERhdGUpLmdldFllYXIoKSArIDE5MDA7XG5cbiAgICAgICAgY29uc3Qgc3RhcnRJbnNpZGUgPSB7XG4gICAgICAgICAgICBib29sOiB7XG4gICAgICAgICAgICAgICAgbXVzdDogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICByYW5nZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtgJHt0aGlzLm9wdGlvbnMubmFtZX0uc3RhcnRgXToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsdGU6IHBhcnNlRmxvYXQoc3RhcnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2Ake3RoaXMub3B0aW9ucy5uYW1lfS5lbmRgXToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBndGU6IHBhcnNlRmxvYXQoc3RhcnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGVuZEluc2lkZSA9IHtcbiAgICAgICAgICAgIGJvb2w6IHtcbiAgICAgICAgICAgICAgICBtdXN0OiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2Ake3RoaXMub3B0aW9ucy5uYW1lfS5zdGFydGBdOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGx0ZTogcGFyc2VGbG9hdChlbmQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2Ake3RoaXMub3B0aW9ucy5uYW1lfS5lbmRgXToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBndGU6IHBhcnNlRmxvYXQoZW5kKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBjb250YWlucyA9IHtcbiAgICAgICAgICAgIGJvb2w6IHtcbiAgICAgICAgICAgICAgICBtdXN0OiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2Ake3RoaXMub3B0aW9ucy5uYW1lfS5zdGFydGBdOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGd0ZTogcGFyc2VGbG9hdChzdGFydCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbYCR7dGhpcy5vcHRpb25zLm5hbWV9LmVuZGBdOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGx0ZTogcGFyc2VGbG9hdChlbmQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBib29sOiB7XG4gICAgICAgICAgICAgICAgc2hvdWxkOiBbXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0SW5zaWRlLFxuICAgICAgICAgICAgICAgICAgICBlbmRJbnNpZGUsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5zLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBmYWNldCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFt0aGlzLm9wdGlvbnMubmFtZV06IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogKGkxOG4pID0+IHRoaXMub3B0aW9ucy50aXRsZShpMThuKSxcblxuICAgICAgICAgICAgICAgIGZhY2V0OiAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJhbmdlcyA9IHRoaXMub3B0aW9ucy5yYW5nZXMgfHwgZGVmYXVsdFJhbmdlcztcblxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gcGFyc2VGbG9hdCh2YWx1ZS5zdGFydCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmQgPSBwYXJzZUZsb2F0KHZhbHVlLmVuZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFydCAmJiBlbmQgJiYgZW5kIC0gc3RhcnQgPCAzMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYW5nZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB5ZWFyID0gc3RhcnQ7IHllYXIgPCBlbmQ7IHllYXIgKz0gMTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbTogeWVhcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvOiB5ZWFyICsgOSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQ6IGAke3RoaXMub3B0aW9ucy5uYW1lfS55ZWFyc2AsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2VzLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgZm9ybWF0QnVja2V0czogKGJ1Y2tldHMpID0+IGJ1Y2tldHMubWFwKChidWNrZXQpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IG51bVJhbmdlKGJ1Y2tldCksXG4gICAgICAgICAgICAgICAgICAgIGNvdW50OiBidWNrZXQuZG9jX2NvdW50LFxuICAgICAgICAgICAgICAgICAgICB1cmw6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFt0aGlzLm9wdGlvbnMubmFtZV06IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogYnVja2V0LmZyb20sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiBidWNrZXQudG8sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIHNvcnQoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhc2M6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFtgJHt0aGlzLm9wdGlvbnMubmFtZX0uc3RhcnRgXToge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXI6IFwiYXNjXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFtgJHt0aGlzLm9wdGlvbnMubmFtZX0uZW5kYF06IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyOiBcImFzY1wiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuXG4gICAgICAgICAgICBkZXNjOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBbYCR7dGhpcy5vcHRpb25zLm5hbWV9LmVuZGBdOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcmRlcjogXCJkZXNjXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFtgJHt0aGlzLm9wdGlvbnMubmFtZX0uc3RhcnRgXToge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXI6IFwiZGVzY1wiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICByZW5kZXJGaWx0ZXIodmFsdWUsIHZhbHVlcywgaTE4bikge1xuICAgICAgICByZXR1cm4gWWVhclJhbmdlRmlsdGVyKHtcbiAgICAgICAgICAgIG5hbWU6IHRoaXMub3B0aW9ucy5uYW1lLFxuICAgICAgICAgICAgc2VhcmNoTmFtZTogdGhpcy5zZWFyY2hOYW1lKCksXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiB0aGlzLm9wdGlvbnMucGxhY2Vob2xkZXIoaTE4biksXG4gICAgICAgICAgICB0aXRsZTogdGhpcy5vcHRpb25zLnRpdGxlKGkxOG4pLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgcmVuZGVyVmlldyh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gWWVhclJhbmdlRGlzcGxheSh7XG4gICAgICAgICAgICBuYW1lOiB0aGlzLm9wdGlvbnMubmFtZSxcbiAgICAgICAgICAgIHR5cGU6IHRoaXMub3B0aW9ucy50eXBlLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICByZW5kZXJFZGl0KHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBZZWFyUmFuZ2VFZGl0KHtcbiAgICAgICAgICAgIG5hbWU6IHRoaXMub3B0aW9ucy5uYW1lLFxuICAgICAgICAgICAgdHlwZTogdGhpcy5vcHRpb25zLnR5cGUsXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNjaGVtYShTY2hlbWEpIHtcbiAgICAgICAgY29uc3QgWWVhclJhbmdlU2NoZW1hID0gbmV3IFNjaGVtYSh7XG4gICAgICAgICAgICAvLyBBbiBJRCBmb3IgdGhlIHllYXIgcmFuZ2UsIGNvbXB1dGVkIGZyb20gdGhlIG9yaWdpbmFsICsgc3RhcnQvZW5kXG4gICAgICAgICAgICAvLyBwcm9wZXJ0aWVzIGJlZm9yZSB2YWxpZGF0aW9uLlxuICAgICAgICAgICAgX2lkOiBTdHJpbmcsXG5cbiAgICAgICAgICAgIC8vIFRoZSBzb3VyY2Ugc3RyaW5nIGZyb20gd2hpY2ggdGhlIHllYXIgcmFuZ2Ugd2FzIGdlbmVyYXRlZFxuICAgICAgICAgICAgb3JpZ2luYWw6IFN0cmluZyxcblxuICAgICAgICAgICAgLy8gQSBsYWJlbCBhc3NvY2lhdGVkIHdpdGggdGhlIHllYXIgcmFuZ2UgKGUuZy4gXCJtb2RpZmllZFwiKVxuICAgICAgICAgICAgbGFiZWw6IFN0cmluZyxcblxuICAgICAgICAgICAgLy8gSWYgdGhlIHllYXIgcmFuZ2Ugc2hvdWxkIGJlIHRyZWF0ZWQgYXMgXCJjaXJjYVwiXG4gICAgICAgICAgICBjaXJjYTogQm9vbGVhbixcblxuICAgICAgICAgICAgLy8gVGhlIHllYXIgcmFuZ2UgcmFuZ2Ugc3RhcnQgYW5kIGVuZFxuICAgICAgICAgICAgc3RhcnQ6IHt0eXBlOiBOdW1iZXIsIGVzX2luZGV4ZWQ6IHRydWV9LFxuICAgICAgICAgICAgc3RhcnRfY2E6IEJvb2xlYW4sXG4gICAgICAgICAgICBlbmQ6IHt0eXBlOiBOdW1iZXIsIGVzX2luZGV4ZWQ6IHRydWV9LFxuICAgICAgICAgICAgZW5kX2NhOiBCb29sZWFuLFxuXG4gICAgICAgICAgICAvLyBJZiB0aGUgZW5kIHllYXIgaXMgdGhlIGN1cnJlbnQgeWVhclxuICAgICAgICAgICAgY3VycmVudDoge3R5cGU6IEJvb2xlYW4sIGVzX2luZGV4ZWQ6IHRydWV9LFxuXG4gICAgICAgICAgICAvLyBBIGdlbmVyYXRlZCBsaXN0IG9mIHllYXJzIHdoaWNoIHRoaXMgeWVhciByYW5nZSBtYXBzIHRvLiBUaGlzIGlzXG4gICAgICAgICAgICAvLyBpbmRleGVkIGluIEVsYXN0aWNzZWFyY2ggZm9yIHRoaW5ncyBsaWtlIGhpc3RvZ3JhbXMgYW5kXG4gICAgICAgICAgICAvLyBhZ2dyZWdhdGlvbnMuXG4gICAgICAgICAgICB5ZWFyczogW3t0eXBlOiBOdW1iZXIsIGVzX2luZGV4ZWQ6IHRydWV9XSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgWWVhclJhbmdlU2NoZW1hLm1ldGhvZHMgPSB7XG4gICAgICAgICAgICB0b0pTT04oKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb2JqID0gdGhpcy50b09iamVjdCgpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmoub3JpZ2luYWw7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG9iai55ZWFycztcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBXZSBnZW5lcmF0ZSBhIGxpc3Qgb2YgeWVhcnMgaW4gd2hpY2ggdGhlIHJlY29yZCBleGlzdHMsIGluIG9yZGVyXG4gICAgICAgIC8vIHRvIGltcHJvdmUgcXVlcnlpbmcgaW5zaWRlIEVsYXN0aWNzZWFyY2hcbiAgICAgICAgWWVhclJhbmdlU2NoZW1hLnByZShcInZhbGlkYXRlXCIsIGZ1bmN0aW9uKG5leHQpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5zdGFydCB8fCAhdGhpcy5lbmQgfHwgdGhpcy5zdGFydCA+IHRoaXMuZW5kKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgeWVhcnMgPSBbXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgeWVhciA9IHRoaXMuc3RhcnQ7IHllYXIgPD0gdGhpcy5lbmQ7IHllYXIgKz0gMSkge1xuICAgICAgICAgICAgICAgIHllYXJzLnB1c2goeWVhcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMueWVhcnMgPSB5ZWFycztcblxuICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBEeW5hbWljYWxseSBnZW5lcmF0ZSB0aGUgX2lkIGF0dHJpYnV0ZVxuICAgICAgICBZZWFyUmFuZ2VTY2hlbWEucHJlKFwidmFsaWRhdGVcIiwgZnVuY3Rpb24obmV4dCkge1xuICAgICAgICAgICAgdGhpcy5faWQgPSB0aGlzLm9yaWdpbmFsIHx8IFt0aGlzLnN0YXJ0LCB0aGlzLmVuZF0uam9pbihcIixcIik7XG4gICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBbWWVhclJhbmdlU2NoZW1hXSxcbiAgICAgICAgICAgIGNvbnZlcnQ6IChvYmopID0+IHR5cGVvZiBvYmogPT09IFwic3RyaW5nXCIgP1xuICAgICAgICAgICAgICAgIHllYXJSYW5nZS5wYXJzZShvYmopIDogb2JqLFxuICAgICAgICAgICAgdmFsaWRhdGVBcnJheTogKHZhbCkgPT4gdmFsLnN0YXJ0IHx8IHZhbC5lbmQsXG4gICAgICAgICAgICB2YWxpZGF0aW9uTXNnOiAoaTE4bikgPT5cbiAgICAgICAgICAgICAgICBpMThuLmdldHRleHQoXCJEYXRlcyBtdXN0IGhhdmUgYSBzdGFydCBvciBlbmQgc3BlY2lmaWVkLlwiKSxcbiAgICAgICAgfTtcbiAgICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBZZWFyUmFuZ2U7XG4iXX0=