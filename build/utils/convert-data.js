"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * Parse a data file, given the specified converter, and return a JSON
 * representation to load into the database.
 */

var fs = require("fs");

var options = require("../lib/options");

module.exports = function (_ref, callback) {
    var _ref2 = _slicedToArray(_ref, 2),
        converterName = _ref2[0],
        fileName = _ref2[1];

    // Import the converter module
    var converter = options.converters[converterName];

    converter.processFiles([fs.createReadStream(fileName)], function (err, results) {
        if (err) {
            callback(err);
        } else {
            console.log(JSON.stringify(results));
            callback();
        }
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jb252ZXJ0LWRhdGEuanMiXSwibmFtZXMiOlsiZnMiLCJyZXF1aXJlIiwib3B0aW9ucyIsIm1vZHVsZSIsImV4cG9ydHMiLCJjYWxsYmFjayIsImNvbnZlcnRlck5hbWUiLCJmaWxlTmFtZSIsImNvbnZlcnRlciIsImNvbnZlcnRlcnMiLCJwcm9jZXNzRmlsZXMiLCJjcmVhdGVSZWFkU3RyZWFtIiwiZXJyIiwicmVzdWx0cyIsImNvbnNvbGUiLCJsb2ciLCJKU09OIiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7O0FBS0EsSUFBTUEsS0FBS0MsUUFBUSxJQUFSLENBQVg7O0FBRUEsSUFBTUMsVUFBVUQsUUFBUSxnQkFBUixDQUFoQjs7QUFFQUUsT0FBT0MsT0FBUCxHQUFpQixnQkFBNEJDLFFBQTVCLEVBQXlDO0FBQUE7QUFBQSxRQUF2Q0MsYUFBdUM7QUFBQSxRQUF4QkMsUUFBd0I7O0FBQ3REO0FBQ0EsUUFBTUMsWUFBWU4sUUFBUU8sVUFBUixDQUFtQkgsYUFBbkIsQ0FBbEI7O0FBRUFFLGNBQVVFLFlBQVYsQ0FBdUIsQ0FBQ1YsR0FBR1csZ0JBQUgsQ0FBb0JKLFFBQXBCLENBQUQsQ0FBdkIsRUFBd0QsVUFBQ0ssR0FBRCxFQUFNQyxPQUFOLEVBQWtCO0FBQ3RFLFlBQUlELEdBQUosRUFBUztBQUNMUCxxQkFBU08sR0FBVDtBQUNILFNBRkQsTUFFTztBQUNIRSxvQkFBUUMsR0FBUixDQUFZQyxLQUFLQyxTQUFMLENBQWVKLE9BQWYsQ0FBWjtBQUNBUjtBQUNIO0FBQ0osS0FQRDtBQVFILENBWkQiLCJmaWxlIjoiY29udmVydC1kYXRhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQYXJzZSBhIGRhdGEgZmlsZSwgZ2l2ZW4gdGhlIHNwZWNpZmllZCBjb252ZXJ0ZXIsIGFuZCByZXR1cm4gYSBKU09OXG4gKiByZXByZXNlbnRhdGlvbiB0byBsb2FkIGludG8gdGhlIGRhdGFiYXNlLlxuICovXG5cbmNvbnN0IGZzID0gcmVxdWlyZShcImZzXCIpO1xuXG5jb25zdCBvcHRpb25zID0gcmVxdWlyZShcIi4uL2xpYi9vcHRpb25zXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChbY29udmVydGVyTmFtZSwgZmlsZU5hbWVdLCBjYWxsYmFjaykgPT4ge1xuICAgIC8vIEltcG9ydCB0aGUgY29udmVydGVyIG1vZHVsZVxuICAgIGNvbnN0IGNvbnZlcnRlciA9IG9wdGlvbnMuY29udmVydGVyc1tjb252ZXJ0ZXJOYW1lXTtcblxuICAgIGNvbnZlcnRlci5wcm9jZXNzRmlsZXMoW2ZzLmNyZWF0ZVJlYWRTdHJlYW0oZmlsZU5hbWUpXSwgKGVyciwgcmVzdWx0cykgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzdWx0cykpO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcbiJdfQ==