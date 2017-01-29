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