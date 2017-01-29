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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zY2hlbWFzL3R5cGVzL0ZpeGVkU3RyaW5nLmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwicmVxdWlyZSIsIkZpeGVkU3RyaW5nRmlsdGVyIiwiY3JlYXRlRmFjdG9yeSIsIkZpeGVkU3RyaW5nRGlzcGxheSIsIkZpeGVkU3RyaW5nRWRpdCIsIkZpeGVkU3RyaW5nIiwib3B0aW9ucyIsInVybCIsInByb3RvdHlwZSIsInNlYXJjaE5hbWUiLCJuYW1lIiwidmFsdWUiLCJxdWVyeSIsInVuZGVmaW5lZCIsImZpZWxkcyIsInNlYXJjaFRpdGxlIiwiaTE4biIsInZhbHVlcyIsIm5hbWVNYXAiLCJoYXNPd25Qcm9wZXJ0eSIsImZpbHRlciIsIm1hdGNoIiwib3BlcmF0b3IiLCJ6ZXJvX3Rlcm1zX3F1ZXJ5IiwiZmFjZXQiLCJ0aXRsZSIsInRlcm1zIiwiZmllbGQiLCJzaXplIiwiZm9ybWF0QnVja2V0cyIsImJ1Y2tldHMiLCJtYXAiLCJidWNrZXQiLCJ0ZXh0Iiwia2V5IiwiY291bnQiLCJkb2NfY291bnQiLCJnZXRWYWx1ZUFycmF5IiwiT2JqZWN0Iiwia2V5cyIsImlkIiwicmVuZGVyRmlsdGVyIiwiYWxsVmFsdWVzIiwibGVuZ3RoIiwicGxhY2Vob2xkZXIiLCJtdWx0aXBsZSIsInJlbmRlclZpZXciLCJ0eXBlIiwic2VhcmNoRmllbGQiLCJyZW5kZXJFZGl0Iiwic2NoZW1hIiwidmFsaWRhdGUiLCJBcnJheSIsImlzQXJyYXkiLCJhbGxvd1Vua25vd24iLCJ2YWwiLCJpbmRleE9mIiwidmFsaWRhdGlvbk1zZyIsInJlcSIsImZvcm1hdCIsImdldHRleHQiLCJ0eXBlcyIsImpvaW4iLCJyZWNvbW1lbmRlZCIsImFzc2lnbiIsIlN0cmluZyIsImVzX2luZGV4ZWQiLCJlc190eXBlIiwiZXNfZmllbGRzIiwiaW5kZXgiLCJyYXciLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBTUEsUUFBUUMsUUFBUSxPQUFS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QUF1QixDQUFoQztBQUFBLGlCQURIO0FBRVBFLCtCQUFlLHVCQUFDQyxHQUFEO0FBQUEsMkJBQVNBLElBQUlDLE1BQUosQ0FBV0QsSUFBSUUsT0FBSixDQUFZLGdCQUMzQyxnREFEK0IsQ0FBWCxFQUMrQjtBQUMvQ2xELDhCQUFNLE9BQUtKLE9BQUwsQ0FBYUksSUFENEI7QUFFL0NtRCwrQkFBTzVDLE9BQU82QyxJQUFQLENBQVksSUFBWjtBQUZ3QyxxQkFEL0IsQ0FBVDtBQUFBO0FBRlIsYUFBWDtBQVFIOztBQUVELFlBQUksS0FBS3hELE9BQUwsQ0FBYXlELFdBQWpCLEVBQThCO0FBQzFCWixxQkFBU1ksV0FBVCxHQUF1QixJQUF2QjtBQUNIOztBQUVELFlBQU1iLFNBQVNaLE9BQU8wQixNQUFQLENBQWM7QUFDekJqQixrQkFBTWtCLE1BRG1CO0FBRXpCQyx3QkFBWSxJQUZhO0FBR3pCQyxxQkFBUyxRQUhnQjtBQUl6QjtBQUNBQyx1QkFBVztBQUNQMUQsc0JBQU0sRUFBQ3FDLE1BQU0sUUFBUCxFQUFpQnNCLE9BQU8sVUFBeEIsRUFEQztBQUVQQyxxQkFBSyxFQUFDdkIsTUFBTSxRQUFQLEVBQWlCc0IsT0FBTyxjQUF4QjtBQUZFO0FBTGMsU0FBZCxFQVNabEIsUUFUWSxDQUFmOztBQVdBLGVBQU8sS0FBSzdDLE9BQUwsQ0FBYXVDLFFBQWIsR0FBd0IsQ0FBQ0ssTUFBRCxDQUF4QixHQUFtQ0EsTUFBMUM7QUFDSDtBQXRKbUIsQ0FBeEI7O0FBeUpBcUIsT0FBT0MsT0FBUCxHQUFpQm5FLFdBQWpCIiwiZmlsZSI6IkZpeGVkU3RyaW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cbmNvbnN0IEZpeGVkU3RyaW5nRmlsdGVyID0gUmVhY3QuY3JlYXRlRmFjdG9yeShcbiAgICByZXF1aXJlKFwiLi4vLi4vdmlld3MvdHlwZXMvZmlsdGVyL0ZpeGVkU3RyaW5nLmpzXCIpKTtcbmNvbnN0IEZpeGVkU3RyaW5nRGlzcGxheSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkoXG4gICAgcmVxdWlyZShcIi4uLy4uL3ZpZXdzL3R5cGVzL3ZpZXcvRml4ZWRTdHJpbmcuanNcIikpO1xuY29uc3QgRml4ZWRTdHJpbmdFZGl0ID0gUmVhY3QuY3JlYXRlRmFjdG9yeShcbiAgICByZXF1aXJlKFwiLi4vLi4vdmlld3MvdHlwZXMvZWRpdC9GaXhlZFN0cmluZy5qc1wiKSk7XG5cbmNvbnN0IEZpeGVkU3RyaW5nID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgLypcbiAgICBuYW1lXG4gICAgdHlwZVxuICAgIHNlYXJjaE5hbWVcbiAgICBhbGxvd1Vua25vd246IEJvb2xcbiAgICB2YWx1ZXM6IHtLZXk6IHRpdGxlKGkxOG4pfVxuICAgIHRpdGxlKGkxOG4pXG4gICAgcGxhY2Vob2xkZXIoaTE4bilcbiAgICB1cmwodmFsdWUpXG4gICAgcmVjb21tZW5kZWQ6IEJvb2xcbiAgICBtdWx0aXBsZTogQm9vbFxuICAgICovXG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnVybCkge1xuICAgICAgICB0aGlzLnVybCA9IHRoaXMub3B0aW9ucy51cmw7XG4gICAgfVxufTtcblxuRml4ZWRTdHJpbmcucHJvdG90eXBlID0ge1xuICAgIHNlYXJjaE5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc2VhcmNoTmFtZSB8fCB0aGlzLm9wdGlvbnMubmFtZTtcbiAgICB9LFxuXG4gICAgdmFsdWUocXVlcnkpIHtcbiAgICAgICAgcmV0dXJuIHF1ZXJ5W3RoaXMuc2VhcmNoTmFtZSgpXSB8fCB1bmRlZmluZWQ7XG4gICAgfSxcblxuICAgIGZpZWxkcyh2YWx1ZSkge1xuICAgICAgICByZXR1cm4ge1t0aGlzLnNlYXJjaE5hbWUoKV06IHZhbHVlfTtcbiAgICB9LFxuXG4gICAgc2VhcmNoVGl0bGUobmFtZSwgaTE4bikge1xuICAgICAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLm9wdGlvbnMudmFsdWVzIHx8IHt9O1xuICAgICAgICBjb25zdCBuYW1lTWFwID0gdmFsdWVzW25hbWVdO1xuICAgICAgICByZXR1cm4gdmFsdWVzLmhhc093blByb3BlcnR5KG5hbWUpICYmIG5hbWVNYXAgJiYgbmFtZU1hcC5uYW1lID9cbiAgICAgICAgICAgIG5hbWVNYXAubmFtZShpMThuKSA6XG4gICAgICAgICAgICBuYW1lO1xuICAgIH0sXG5cbiAgICBmaWx0ZXIodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG1hdGNoOiB7XG4gICAgICAgICAgICAgICAgW2Ake3RoaXMub3B0aW9ucy5uYW1lfS5yYXdgXToge1xuICAgICAgICAgICAgICAgICAgICBxdWVyeTogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yOiBcIm9yXCIsXG4gICAgICAgICAgICAgICAgICAgIHplcm9fdGVybXNfcXVlcnk6IFwiYWxsXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIGZhY2V0KCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgW3RoaXMub3B0aW9ucy5uYW1lXToge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAoaTE4bikgPT4gdGhpcy5vcHRpb25zLnRpdGxlKGkxOG4pLFxuXG4gICAgICAgICAgICAgICAgZmFjZXQ6ICgpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgIHRlcm1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZDogYCR7dGhpcy5vcHRpb25zLm5hbWV9LnJhd2AsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplOiAxMDAwLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0pLFxuXG4gICAgICAgICAgICAgICAgZm9ybWF0QnVja2V0czogKGJ1Y2tldHMsIGkxOG4pID0+IGJ1Y2tldHMubWFwKChidWNrZXQpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IHRoaXMuc2VhcmNoVGl0bGUoYnVja2V0LmtleSwgaTE4biksXG4gICAgICAgICAgICAgICAgICAgIGNvdW50OiBidWNrZXQuZG9jX2NvdW50LFxuICAgICAgICAgICAgICAgICAgICB1cmw6IHtbdGhpcy5vcHRpb25zLm5hbWVdOiBidWNrZXQua2V5fSxcbiAgICAgICAgICAgICAgICB9KSksXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBnZXRWYWx1ZUFycmF5KGkxOG4pIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy52YWx1ZXMpLm1hcCgoaWQpID0+ICh7XG4gICAgICAgICAgICBpZCxcbiAgICAgICAgICAgIG5hbWU6IHRoaXMub3B0aW9ucy52YWx1ZXNbaWRdLm5hbWUoaTE4biksXG4gICAgICAgIH0pKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyRmlsdGVyKHZhbHVlLCBhbGxWYWx1ZXMsIGkxOG4pIHtcbiAgICAgICAgbGV0IHZhbHVlcyA9IHRoaXMuZ2V0VmFsdWVBcnJheShpMThuKTtcblxuICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdmFsdWVzID0gYWxsVmFsdWVzLm1hcCgodGV4dCkgPT4gKHtcbiAgICAgICAgICAgICAgICBpZDogdGV4dCxcbiAgICAgICAgICAgICAgICBuYW1lOiB0ZXh0LFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIEZpeGVkU3RyaW5nRmlsdGVyKHtcbiAgICAgICAgICAgIG5hbWU6IHRoaXMub3B0aW9ucy5uYW1lLFxuICAgICAgICAgICAgc2VhcmNoTmFtZTogdGhpcy5zZWFyY2hOYW1lKCksXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIHZhbHVlcyxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiB0aGlzLm9wdGlvbnMucGxhY2Vob2xkZXIoaTE4biksXG4gICAgICAgICAgICB0aXRsZTogdGhpcy5vcHRpb25zLnRpdGxlKGkxOG4pLFxuICAgICAgICAgICAgbXVsdGlwbGU6IHRoaXMub3B0aW9ucy5tdWx0aXBsZSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJlbmRlclZpZXcodmFsdWUsIGkxOG4pIHtcbiAgICAgICAgcmV0dXJuIEZpeGVkU3RyaW5nRGlzcGxheSh7XG4gICAgICAgICAgICBuYW1lOiB0aGlzLm9wdGlvbnMubmFtZSxcbiAgICAgICAgICAgIHR5cGU6IHRoaXMub3B0aW9ucy50eXBlLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICB2YWx1ZXM6IHRoaXMuZ2V0VmFsdWVBcnJheShpMThuKSxcbiAgICAgICAgICAgIHNlYXJjaEZpZWxkOiB0aGlzLm9wdGlvbnMuc2VhcmNoRmllbGQsXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICByZW5kZXJFZGl0KHZhbHVlLCBhbGxWYWx1ZXMsIGkxOG4pIHtcbiAgICAgICAgbGV0IHZhbHVlcyA9IHRoaXMuZ2V0VmFsdWVBcnJheShpMThuKTtcblxuICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdmFsdWVzID0gYWxsVmFsdWVzLm1hcCgodGV4dCkgPT4gKHtcbiAgICAgICAgICAgICAgICBpZDogdGV4dCxcbiAgICAgICAgICAgICAgICBuYW1lOiB0ZXh0LFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIEZpeGVkU3RyaW5nRWRpdCh7XG4gICAgICAgICAgICBuYW1lOiB0aGlzLm9wdGlvbnMubmFtZSxcbiAgICAgICAgICAgIHR5cGU6IHRoaXMub3B0aW9ucy50eXBlLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICB2YWx1ZXMsXG4gICAgICAgICAgICBzZWFyY2hGaWVsZDogdGhpcy5vcHRpb25zLnNlYXJjaEZpZWxkLFxuICAgICAgICAgICAgbXVsdGlwbGU6IHRoaXMub3B0aW9ucy5tdWx0aXBsZSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNjaGVtYSgpIHtcbiAgICAgICAgbGV0IHZhbGlkYXRlID0ge307XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IEFycmF5LmlzQXJyYXkodGhpcy5vcHRpb25zLnZhbHVlcykgP1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnZhbHVlcyA6XG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLm9wdGlvbnMudmFsdWVzKTtcblxuICAgICAgICAvLyBPbmx5IHZhbGlkYXRlIHRoZSB2YWx1ZXMgaWYgdGhlcmUgYXJlIHZhbHVlcyB0byB2YWxpZGF0ZSBhZ2FpbnN0XG4gICAgICAgIC8vIGFuZCBpZiB1bmtub3duIHZhbHVlcyBhcmVuJ3QgYWxsb3dlZFxuICAgICAgICAvLyBOT1RFKGplcmVzaWcpOiBXZSBjb3VsZCByZXF1aXJlIHRoYXQgdGhlIHZhbHVlIGJlIG9mIG9uZSBvZlxuICAgICAgICAvLyB0aGUgcHJlLXNwZWNpZmllZCB2YWx1ZXMsIGJ1dCB0aGF0IGZlZWxzIG92ZXJseVxuICAgICAgICAvLyByZXN0cmljdGl2ZSwgYmV0dGVyIHRvIGp1c3Qgd2FybiB0aGVtIGluc3RlYWQuXG4gICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID4gMCAmJiAhdGhpcy5vcHRpb25zLmFsbG93VW5rbm93bikge1xuICAgICAgICAgICAgdmFsaWRhdGUgPSB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdGU6ICh2YWwpID0+IHZhbHVlcy5pbmRleE9mKHZhbCkgPj0gMCxcbiAgICAgICAgICAgICAgICB2YWxpZGF0aW9uTXNnOiAocmVxKSA9PiByZXEuZm9ybWF0KHJlcS5nZXR0ZXh0KFwiYCUobmFtZSlzYCBcIiArXG4gICAgICAgICAgICAgICAgICAgIFwibXVzdCBiZSBvbmUgb2YgdGhlIGZvbGxvd2luZyB0eXBlczogJSh0eXBlcylzLlwiKSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5vcHRpb25zLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlczogdmFsdWVzLmpvaW4oXCIsIFwiKSxcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5yZWNvbW1lbmRlZCkge1xuICAgICAgICAgICAgdmFsaWRhdGUucmVjb21tZW5kZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2NoZW1hID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBlc19pbmRleGVkOiB0cnVlLFxuICAgICAgICAgICAgZXNfdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICAgIC8vIEEgcmF3IHR5cGUgdG8gdXNlIGZvciBidWlsZGluZyBhZ2dyZWdhdGlvbnMgaW4gRWxhc3RpY3NlYXJjaFxuICAgICAgICAgICAgZXNfZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgbmFtZToge3R5cGU6IFwic3RyaW5nXCIsIGluZGV4OiBcImFuYWx5emVkXCJ9LFxuICAgICAgICAgICAgICAgIHJhdzoge3R5cGU6IFwic3RyaW5nXCIsIGluZGV4OiBcIm5vdF9hbmFseXplZFwifSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sIHZhbGlkYXRlKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm11bHRpcGxlID8gW3NjaGVtYV0gOiBzY2hlbWE7XG4gICAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRml4ZWRTdHJpbmc7XG4iXX0=