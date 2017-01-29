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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zY2hlbWFzL3R5cGVzL1NpbXBsZURhdGUuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiRml4ZWRTdHJpbmdEaXNwbGF5IiwiY3JlYXRlRmFjdG9yeSIsIlNpbXBsZURhdGVFZGl0IiwiU2ltcGxlRGF0ZSIsIm9wdGlvbnMiLCJpbnRlcnZhbCIsImZvcm1hdCIsInByb3RvdHlwZSIsInNlYXJjaE5hbWUiLCJuYW1lIiwidmFsdWUiLCJxdWVyeSIsImZpZWxkcyIsImZvcm1hdERhdGUiLCJzZWFyY2hUaXRsZSIsImkxOG4iLCJ0aXRsZSIsImRhdGUiLCJyZW5kZXJWaWV3IiwidHlwZSIsIm11bHRpbGluZSIsInJlbmRlckVkaXQiLCJmaWx0ZXIiLCJyYW5nZSIsImd0ZSIsImx0ZSIsImZhY2V0IiwiZGF0ZV9oaXN0b2dyYW0iLCJmaWVsZCIsImZvcm1hdEJ1Y2tldHMiLCJidWNrZXRzIiwibWFwIiwiYnVja2V0IiwidGV4dCIsImtleV9hc19zdHJpbmciLCJjb3VudCIsImRvY19jb3VudCIsInVybCIsInJldmVyc2UiLCJzY2hlbWEiLCJEYXRlIiwiZXNfaW5kZXhlZCIsInJlY29tbWVuZGVkIiwibXVsdGlwbGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBTUEsUUFBUUMsUUFBUSxPQUFSLENBQWQ7O0FBRUEsSUFBTUMscUJBQXFCRixNQUFNRyxhQUFOLENBQ3ZCRixRQUFRLHVDQUFSLENBRHVCLENBQTNCO0FBRUEsSUFBTUcsaUJBQWlCSixNQUFNRyxhQUFOLENBQ25CRixRQUFRLHNDQUFSLENBRG1CLENBQXZCOztBQUdBLElBQU1JLGFBQWEsU0FBYkEsVUFBYSxDQUFTQyxPQUFULEVBQWtCO0FBQ2pDLFNBQUtBLE9BQUwsR0FBZUEsT0FBZjs7QUFFQSxTQUFLQSxPQUFMLENBQWFDLFFBQWIsR0FBd0JELFFBQVFDLFFBQVIsSUFBb0IsTUFBNUM7QUFDQSxTQUFLRCxPQUFMLENBQWFF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QUE4RW5CQyxVQTlFbUIsb0JBOEVWO0FBQ0wsWUFBTXBCLE9BQU87QUFDVEEsa0JBQU1xQixJQURHO0FBRVRDLHdCQUFZLElBRkg7QUFHVEMseUJBQWEsQ0FBQyxDQUFDLEtBQUt0QyxPQUFMLENBQWFzQztBQUhuQixTQUFiOztBQU1BLGVBQU8sS0FBS3RDLE9BQUwsQ0FBYXVDLFFBQWIsR0FBd0IsQ0FBQ3hCLElBQUQsQ0FBeEIsR0FBaUNBLElBQXhDO0FBQ0g7QUF0RmtCLENBQXZCOztBQXlGQXlCLE9BQU9DLE9BQVAsR0FBaUIxQyxVQUFqQiIsImZpbGUiOiJTaW1wbGVEYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cbmNvbnN0IEZpeGVkU3RyaW5nRGlzcGxheSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkoXG4gICAgcmVxdWlyZShcIi4uLy4uL3ZpZXdzL3R5cGVzL3ZpZXcvRml4ZWRTdHJpbmcuanNcIikpO1xuY29uc3QgU2ltcGxlRGF0ZUVkaXQgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KFxuICAgIHJlcXVpcmUoXCIuLi8uLi92aWV3cy90eXBlcy9lZGl0L1NpbXBsZURhdGUuanNcIikpO1xuXG5jb25zdCBTaW1wbGVEYXRlID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLm9wdGlvbnMuaW50ZXJ2YWwgPSBvcHRpb25zLmludGVydmFsIHx8IFwieWVhclwiO1xuICAgIHRoaXMub3B0aW9ucy5mb3JtYXQgPSBvcHRpb25zLmZvcm1hdCB8fCBcInl5eXlcIjtcblxuICAgIC8qXG4gICAgbmFtZVxuICAgIHR5cGVcbiAgICBzZWFyY2hOYW1lXG4gICAgdGl0bGUoaTE4bilcbiAgICBwbGFjZWhvbGRlcihpMThuKVxuICAgIG11bHRpcGxlOiBCb29sXG4gICAgcmVjb21tZW5kZWQ6IEJvb2xcbiAgICBpbnRlcnZhbDogU3RyaW5nXG4gICAgZm9ybWF0OiBTdHJpbmdcbiAgICAqL1xufTtcblxuU2ltcGxlRGF0ZS5wcm90b3R5cGUgPSB7XG4gICAgc2VhcmNoTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zZWFyY2hOYW1lIHx8IHRoaXMub3B0aW9ucy5uYW1lO1xuICAgIH0sXG5cbiAgICB2YWx1ZShxdWVyeSkge1xuICAgICAgICByZXR1cm4gcXVlcnlbdGhpcy5zZWFyY2hOYW1lKCldO1xuICAgIH0sXG5cbiAgICBmaWVsZHModmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHtbdGhpcy5zZWFyY2hOYW1lKCldOiB2YWx1ZX07XG4gICAgfSxcblxuICAgIGZvcm1hdERhdGUodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG5cbiAgICBzZWFyY2hUaXRsZSh2YWx1ZSwgaTE4bikge1xuICAgICAgICBjb25zdCB0aXRsZSA9IHRoaXMub3B0aW9ucy50aXRsZShpMThuKTtcbiAgICAgICAgY29uc3QgZGF0ZSA9IHRoaXMuZm9ybWF0RGF0ZSh2YWx1ZSwgaTE4bik7XG4gICAgICAgIHJldHVybiBgJHt0aXRsZX06ICR7ZGF0ZX1gO1xuICAgIH0sXG5cbiAgICByZW5kZXJWaWV3KHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBGaXhlZFN0cmluZ0Rpc3BsYXkoe1xuICAgICAgICAgICAgbmFtZTogdGhpcy5vcHRpb25zLm5hbWUsXG4gICAgICAgICAgICB0eXBlOiB0aGlzLm9wdGlvbnMudHlwZSxcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgbXVsdGlsaW5lOiB0aGlzLm9wdGlvbnMubXVsdGlsaW5lLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgcmVuZGVyRWRpdCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gU2ltcGxlRGF0ZUVkaXQoe1xuICAgICAgICAgICAgbmFtZTogdGhpcy5vcHRpb25zLm5hbWUsXG4gICAgICAgICAgICB0eXBlOiB0aGlzLm9wdGlvbnMudHlwZSxcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgbXVsdGlsaW5lOiB0aGlzLm9wdGlvbnMubXVsdGlsaW5lLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgZmlsdGVyKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByYW5nZToge1xuICAgICAgICAgICAgICAgIFt0aGlzLm9wdGlvbnMubmFtZV06IHtcbiAgICAgICAgICAgICAgICAgICAgZ3RlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgbHRlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiB0aGlzLm9wdGlvbnMuZm9ybWF0LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBmYWNldCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFt0aGlzLm9wdGlvbnMubmFtZV06IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogKGkxOG4pID0+IHRoaXMub3B0aW9ucy50aXRsZShpMThuKSxcblxuICAgICAgICAgICAgICAgIGZhY2V0OiAoKSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICBkYXRlX2hpc3RvZ3JhbToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQ6IHRoaXMub3B0aW9ucy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJ2YWw6IHRoaXMub3B0aW9ucy5pbnRlcnZhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogdGhpcy5vcHRpb25zLmZvcm1hdCxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KSxcblxuICAgICAgICAgICAgICAgIGZvcm1hdEJ1Y2tldHM6IChidWNrZXRzLCBpMThuKSA9PiBidWNrZXRzLm1hcCgoYnVja2V0KSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBidWNrZXQua2V5X2FzX3N0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgY291bnQ6IGJ1Y2tldC5kb2NfY291bnQsXG4gICAgICAgICAgICAgICAgICAgIHVybDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgW3RoaXMub3B0aW9ucy5uYW1lXTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZvcm1hdERhdGUoYnVja2V0LmtleV9hc19zdHJpbmcsIGkxOG4pLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0pKS5yZXZlcnNlKCksXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBzY2hlbWEoKSB7XG4gICAgICAgIGNvbnN0IHR5cGUgPSB7XG4gICAgICAgICAgICB0eXBlOiBEYXRlLFxuICAgICAgICAgICAgZXNfaW5kZXhlZDogdHJ1ZSxcbiAgICAgICAgICAgIHJlY29tbWVuZGVkOiAhIXRoaXMub3B0aW9ucy5yZWNvbW1lbmRlZCxcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm11bHRpcGxlID8gW3R5cGVdIDogdHlwZTtcbiAgICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTaW1wbGVEYXRlO1xuIl19