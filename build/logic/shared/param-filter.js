"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var options = require("../../lib/options");

var queries = require("./queries");

var paramFilter = function paramFilter(values, keepSecondary) {
    var all = {};
    var primary = [];
    var secondary = {};
    var type = values.type || Object.keys(options.types)[0];
    var typeQueries = queries(type);

    for (var name in values) {
        var query = typeQueries[name];
        var value = values[name];

        if (!query) {
            console.error("ERROR: Unknown field: " + name + ".");
            continue;
        }

        // Ignore queries that don't have a value
        if (value === undefined) {
            continue;
        }

        // Ignore params which are the same as the default value
        if (query.defaultValue && query.defaultValue(values) === value) {
            continue;
        }

        var fields = query.fields ? query.fields(value) : _defineProperty({}, name, value);

        if (query.secondary) {
            Object.assign(secondary, fields);
        } else {
            primary.push(name);
        }

        if (keepSecondary || !query.secondary) {
            Object.assign(all, fields);
        }
    }

    return {
        all: all,
        primary: primary,
        secondary: secondary
    };
};

module.exports = paramFilter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sb2dpYy9zaGFyZWQvcGFyYW0tZmlsdGVyLmpzIl0sIm5hbWVzIjpbIm9wdGlvbnMiLCJyZXF1aXJlIiwicXVlcmllcyIsInBhcmFtRmlsdGVyIiwidmFsdWVzIiwia2VlcFNlY29uZGFyeSIsImFsbCIsInByaW1hcnkiLCJzZWNvbmRhcnkiLCJ0eXBlIiwiT2JqZWN0Iiwia2V5cyIsInR5cGVzIiwidHlwZVF1ZXJpZXMiLCJuYW1lIiwicXVlcnkiLCJ2YWx1ZSIsImNvbnNvbGUiLCJlcnJvciIsInVuZGVmaW5lZCIsImRlZmF1bHRWYWx1ZSIsImZpZWxkcyIsImFzc2lnbiIsInB1c2giLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBTUEsVUFBVUMsUUFBUSxtQkFBUixDQUFoQjs7QUFFQSxJQUFNQyxVQUFVRCxRQUFRLFdBQVIsQ0FBaEI7O0FBRUEsSUFBTUUsY0FBYyxTQUFkQSxXQUFjLENBQUNDLE1BQUQsRUFBU0MsYUFBVCxFQUEyQjtBQUMzQyxRQUFNQyxNQUFNLEVBQVo7QUFDQSxRQUFNQyxVQUFVLEVBQWhCO0FBQ0EsUUFBTUMsWUFBWSxFQUFsQjtBQUNBLFFBQU1DLE9BQU9MLE9BQU9LLElBQVAsSUFBZUMsT0FBT0MsSUFBUCxDQUFZWCxRQUFRWSxLQUFwQixFQUEyQixDQUEzQixDQUE1QjtBQUNBLFFBQU1DLGNBQWNYLFFBQVFPLElBQVIsQ0FBcEI7O0FBRUEsU0FBSyxJQUFNSyxJQUFYLElBQW1CVixNQUFuQixFQUEyQjtBQUN2QixZQUFNVyxRQUFRRixZQUFZQyxJQUFaLENBQWQ7QUFDQSxZQUFNRSxRQUFRWixPQUFPVSxJQUFQLENBQWQ7O0FBRUEsWUFBSSxDQUFDQyxLQUFMLEVBQVk7QUFDUkUsb0JBQVFDLEtBQVIsNEJBQXVDSixJQUF2QztBQUNBO0FBQ0g7O0FBRUQ7QUFDQSxZQUFJRSxVQUFVRyxTQUFkLEVBQXlCO0FBQ3JCO0FBQ0g7O0FBRUQ7QUFDQSxZQUFJSixNQUFNSyxZQUFOLElBQXNCTCxNQUFNSyxZQUFOLENBQW1CaEIsTUFBbkIsTUFBK0JZLEtBQXpELEVBQWdFO0FBQzVEO0FBQ0g7O0FBRUQsWUFBTUssU0FBU04sTUFBTU0sTUFBTixHQUNYTixNQUFNTSxNQUFOLENBQWFMLEtBQWIsQ0FEVyx1QkFFVEYsSUFGUyxFQUVGRSxLQUZFLENBQWY7O0FBSUEsWUFBSUQsTUFBTVAsU0FBVixFQUFxQjtBQUNqQkUsbUJBQU9ZLE1BQVAsQ0FBY2QsU0FBZCxFQUF5QmEsTUFBekI7QUFDSCxTQUZELE1BRU87QUFDSGQsb0JBQVFnQixJQUFSLENBQWFULElBQWI7QUFDSDs7QUFFRCxZQUFJVCxpQkFBaUIsQ0FBQ1UsTUFBTVAsU0FBNUIsRUFBdUM7QUFDbkNFLG1CQUFPWSxNQUFQLENBQWNoQixHQUFkLEVBQW1CZSxNQUFuQjtBQUNIO0FBQ0o7O0FBRUQsV0FBTztBQUNIZixnQkFERztBQUVIQyx3QkFGRztBQUdIQztBQUhHLEtBQVA7QUFLSCxDQTlDRDs7QUFnREFnQixPQUFPQyxPQUFQLEdBQWlCdEIsV0FBakIiLCJmaWxlIjoicGFyYW0tZmlsdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgb3B0aW9ucyA9IHJlcXVpcmUoXCIuLi8uLi9saWIvb3B0aW9uc1wiKTtcblxuY29uc3QgcXVlcmllcyA9IHJlcXVpcmUoXCIuL3F1ZXJpZXNcIik7XG5cbmNvbnN0IHBhcmFtRmlsdGVyID0gKHZhbHVlcywga2VlcFNlY29uZGFyeSkgPT4ge1xuICAgIGNvbnN0IGFsbCA9IHt9O1xuICAgIGNvbnN0IHByaW1hcnkgPSBbXTtcbiAgICBjb25zdCBzZWNvbmRhcnkgPSB7fTtcbiAgICBjb25zdCB0eXBlID0gdmFsdWVzLnR5cGUgfHwgT2JqZWN0LmtleXMob3B0aW9ucy50eXBlcylbMF07XG4gICAgY29uc3QgdHlwZVF1ZXJpZXMgPSBxdWVyaWVzKHR5cGUpO1xuXG4gICAgZm9yIChjb25zdCBuYW1lIGluIHZhbHVlcykge1xuICAgICAgICBjb25zdCBxdWVyeSA9IHR5cGVRdWVyaWVzW25hbWVdO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHZhbHVlc1tuYW1lXTtcblxuICAgICAgICBpZiAoIXF1ZXJ5KSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBFUlJPUjogVW5rbm93biBmaWVsZDogJHtuYW1lfS5gKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWdub3JlIHF1ZXJpZXMgdGhhdCBkb24ndCBoYXZlIGEgdmFsdWVcbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWdub3JlIHBhcmFtcyB3aGljaCBhcmUgdGhlIHNhbWUgYXMgdGhlIGRlZmF1bHQgdmFsdWVcbiAgICAgICAgaWYgKHF1ZXJ5LmRlZmF1bHRWYWx1ZSAmJiBxdWVyeS5kZWZhdWx0VmFsdWUodmFsdWVzKSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmllbGRzID0gcXVlcnkuZmllbGRzID9cbiAgICAgICAgICAgIHF1ZXJ5LmZpZWxkcyh2YWx1ZSkgOlxuICAgICAgICAgICAge1tuYW1lXTogdmFsdWV9O1xuXG4gICAgICAgIGlmIChxdWVyeS5zZWNvbmRhcnkpIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oc2Vjb25kYXJ5LCBmaWVsZHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJpbWFyeS5wdXNoKG5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGtlZXBTZWNvbmRhcnkgfHwgIXF1ZXJ5LnNlY29uZGFyeSkge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihhbGwsIGZpZWxkcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBhbGwsXG4gICAgICAgIHByaW1hcnksXG4gICAgICAgIHNlY29uZGFyeSxcbiAgICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBwYXJhbUZpbHRlcjtcbiJdfQ==