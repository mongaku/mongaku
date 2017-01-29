"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = require("react");

var LocationFilter = React.createFactory(require("../../views/types/filter/Location.js"));
var LocationDisplay = React.createFactory(require("../../views/types/view/Location.js"));

var Location = function Location(options) {
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
    searchName: function searchName() {
        return this.options.searchName || this.options.name;
    },
    value: function value(query) {
        return query[this.searchName()];
    },
    defaultValue: function defaultValue() {
        return "";
    },
    fields: function fields(value) {
        return _defineProperty({}, this.searchName(), value);
    },
    searchTitle: function searchTitle(value, i18n) {
        var title = this.options.title(i18n);
        return title + ": " + value;
    },
    filter: function filter(value, sanitize) {
        return {
            match: _defineProperty({}, this.options.name + ".name", {
                query: sanitize(value),
                operator: "and",
                zero_terms_query: "all"
            })
        };
    },
    renderFilter: function renderFilter(value, values, i18n) {
        return LocationFilter({
            name: this.options.name,
            searchName: this.searchName(),
            value: value,
            placeholder: this.options.placeholder(i18n),
            title: this.options.title(i18n)
        });
    },
    renderView: function renderView(value) {
        return LocationDisplay({
            name: this.options.name,
            type: this.options.type,
            value: value
        });
    },
    schema: function schema(Schema) {
        var LocationSchema = new Schema({
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
            validateArray: function validateArray(location) {
                return location.name || location.city;
            },
            validationMsg: function validationMsg(i18n) {
                return i18n.gettext("Locations must have a " + "name or city specified.");
            }
        };
    }
};

module.exports = Location;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zY2hlbWFzL3R5cGVzL0xvY2F0aW9uLmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwicmVxdWlyZSIsIkxvY2F0aW9uRmlsdGVyIiwiY3JlYXRlRmFjdG9yeSIsIkxvY2F0aW9uRGlzcGxheSIsIkxvY2F0aW9uIiwib3B0aW9ucyIsInByb3RvdHlwZSIsInNlYXJjaE5hbWUiLCJuYW1lIiwidmFsdWUiLCJxdWVyeSIsImRlZmF1bHRWYWx1ZSIsImZpZWxkcyIsInNlYXJjaFRpdGxlIiwiaTE4biIsInRpdGxlIiwiZmlsdGVyIiwic2FuaXRpemUiLCJtYXRjaCIsIm9wZXJhdG9yIiwiemVyb190ZXJtc19xdWVyeSIsInJlbmRlckZpbHRlciIsInZhbHVlcyIsInBsYWNlaG9sZGVyIiwicmVuZGVyVmlldyIsInR5cGUiLCJzY2hlbWEiLCJTY2hlbWEiLCJMb2NhdGlvblNjaGVtYSIsIl9pZCIsIlN0cmluZyIsImNvdW50cnkiLCJlc19pbmRleGVkIiwiY2l0eSIsInByZSIsIm5leHQiLCJqb2luIiwidmFsaWRhdGVBcnJheSIsImxvY2F0aW9uIiwidmFsaWRhdGlvbk1zZyIsImdldHRleHQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBTUEsUUFBUUMsUUFBUSxPQUFSLENBQWQ7O0FBRUEsSUFBTUMsaUJBQWlCRixNQUFNRyxhQUFOLENBQ25CRixRQUFRLHNDQUFSLENBRG1CLENBQXZCO0FBRUEsSUFBTUcsa0JBQWtCSixNQUFNRyxhQUFOLENBQ3BCRixRQUFRLG9DQUFSLENBRG9CLENBQXhCOztBQUdBLElBQU1JLFdBQVcsU0FBWEEsUUFBVyxDQUFTQyxPQUFULEVBQWtCO0FBQy9CLFNBQUtBLE9BQUwsR0FBZUEsT0FBZjtBQUNBOzs7Ozs7O0FBT0gsQ0FURDs7QUFXQUQsU0FBU0UsU0FBVCxHQUFxQjtBQUNqQkMsY0FEaUIsd0JBQ0o7QUFDVCxlQUFPLEtBQUtGLE9BQUwsQ0FBYUUsVUFBYixJQUEyQixL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ZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxuY29uc3QgTG9jYXRpb25GaWx0ZXIgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KFxuICAgIHJlcXVpcmUoXCIuLi8uLi92aWV3cy90eXBlcy9maWx0ZXIvTG9jYXRpb24uanNcIikpO1xuY29uc3QgTG9jYXRpb25EaXNwbGF5ID0gUmVhY3QuY3JlYXRlRmFjdG9yeShcbiAgICByZXF1aXJlKFwiLi4vLi4vdmlld3MvdHlwZXMvdmlldy9Mb2NhdGlvbi5qc1wiKSk7XG5cbmNvbnN0IExvY2F0aW9uID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgLypcbiAgICBuYW1lXG4gICAgdHlwZVxuICAgIHNlYXJjaE5hbWVcbiAgICB0aXRsZShpMThuKVxuICAgIHBsYWNlaG9sZGVyKGkxOG4pXG4gICAgKi9cbn07XG5cbkxvY2F0aW9uLnByb3RvdHlwZSA9IHtcbiAgICBzZWFyY2hOYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnNlYXJjaE5hbWUgfHwgdGhpcy5vcHRpb25zLm5hbWU7XG4gICAgfSxcblxuICAgIHZhbHVlKHF1ZXJ5KSB7XG4gICAgICAgIHJldHVybiBxdWVyeVt0aGlzLnNlYXJjaE5hbWUoKV07XG4gICAgfSxcblxuICAgIGRlZmF1bHRWYWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfSxcblxuICAgIGZpZWxkcyh2YWx1ZSkge1xuICAgICAgICByZXR1cm4ge1t0aGlzLnNlYXJjaE5hbWUoKV06IHZhbHVlfTtcbiAgICB9LFxuXG4gICAgc2VhcmNoVGl0bGUodmFsdWUsIGkxOG4pIHtcbiAgICAgICAgY29uc3QgdGl0bGUgPSB0aGlzLm9wdGlvbnMudGl0bGUoaTE4bik7XG4gICAgICAgIHJldHVybiBgJHt0aXRsZX06ICR7dmFsdWV9YDtcbiAgICB9LFxuXG4gICAgZmlsdGVyKHZhbHVlLCBzYW5pdGl6ZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbWF0Y2g6IHtcbiAgICAgICAgICAgICAgICBbYCR7dGhpcy5vcHRpb25zLm5hbWV9Lm5hbWVgXToge1xuICAgICAgICAgICAgICAgICAgICBxdWVyeTogc2FuaXRpemUodmFsdWUpLFxuICAgICAgICAgICAgICAgICAgICBvcGVyYXRvcjogXCJhbmRcIixcbiAgICAgICAgICAgICAgICAgICAgemVyb190ZXJtc19xdWVyeTogXCJhbGxcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgcmVuZGVyRmlsdGVyKHZhbHVlLCB2YWx1ZXMsIGkxOG4pIHtcbiAgICAgICAgcmV0dXJuIExvY2F0aW9uRmlsdGVyKHtcbiAgICAgICAgICAgIG5hbWU6IHRoaXMub3B0aW9ucy5uYW1lLFxuICAgICAgICAgICAgc2VhcmNoTmFtZTogdGhpcy5zZWFyY2hOYW1lKCksXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiB0aGlzLm9wdGlvbnMucGxhY2Vob2xkZXIoaTE4biksXG4gICAgICAgICAgICB0aXRsZTogdGhpcy5vcHRpb25zLnRpdGxlKGkxOG4pLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgcmVuZGVyVmlldyh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gTG9jYXRpb25EaXNwbGF5KHtcbiAgICAgICAgICAgIG5hbWU6IHRoaXMub3B0aW9ucy5uYW1lLFxuICAgICAgICAgICAgdHlwZTogdGhpcy5vcHRpb25zLnR5cGUsXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNjaGVtYShTY2hlbWEpIHtcbiAgICAgICAgY29uc3QgTG9jYXRpb25TY2hlbWEgPSBuZXcgU2NoZW1hKHtcbiAgICAgICAgICAgIC8vIEFuIElEIGZvciB0aGUgbmFtZSwgY29tcHV0ZWQgZnJvbSBhbGwgdGhlIHByb3BlcnRpZXNcbiAgICAgICAgICAgIC8vIGJlZm9yZSB2YWxpZGF0aW9uLlxuICAgICAgICAgICAgX2lkOiBTdHJpbmcsXG5cbiAgICAgICAgICAgIC8vIFRoZSBjb3VudHJ5IGFuZCBjaXR5IHJlcHJlc2VudGluZyB0aGUgbG9jYXRpb25cbiAgICAgICAgICAgIGNvdW50cnk6IHt0eXBlOiBTdHJpbmcsIGVzX2luZGV4ZWQ6IHRydWV9LFxuICAgICAgICAgICAgY2l0eToge3R5cGU6IFN0cmluZywgZXNfaW5kZXhlZDogdHJ1ZX0sXG5cbiAgICAgICAgICAgIC8vIFRoZSBuYW1lIG9mIHRoZSBsb2NhdGlvblxuICAgICAgICAgICAgbmFtZToge3R5cGU6IFN0cmluZywgZXNfaW5kZXhlZDogdHJ1ZX0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIER5bmFtaWNhbGx5IGdlbmVyYXRlIHRoZSBfaWQgYXR0cmlidXRlXG4gICAgICAgIExvY2F0aW9uU2NoZW1hLnByZShcInZhbGlkYXRlXCIsIGZ1bmN0aW9uKG5leHQpIHtcbiAgICAgICAgICAgIHRoaXMuX2lkID0gW3RoaXMuY291bnRyeSwgdGhpcy5jaXR5LCB0aGlzLm5hbWVdLmpvaW4oXCIsXCIpO1xuICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogW0xvY2F0aW9uU2NoZW1hXSxcbiAgICAgICAgICAgIHZhbGlkYXRlQXJyYXk6IChsb2NhdGlvbikgPT4gbG9jYXRpb24ubmFtZSB8fCBsb2NhdGlvbi5jaXR5LFxuICAgICAgICAgICAgdmFsaWRhdGlvbk1zZzogKGkxOG4pID0+IGkxOG4uZ2V0dGV4dChcIkxvY2F0aW9ucyBtdXN0IGhhdmUgYSBcIiArXG4gICAgICAgICAgICAgICAgXCJuYW1lIG9yIGNpdHkgc3BlY2lmaWVkLlwiKSxcbiAgICAgICAgfTtcbiAgICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2NhdGlvbjtcbiJdfQ==