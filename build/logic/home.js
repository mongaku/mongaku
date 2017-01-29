"use strict";

var cache = require("../server/middlewares/cache");

var models = require("../lib/models");

module.exports = function (app) {
    var Source = models("Source");

    return {
        index: function index(req, res) {
            var sources = Source.getSources().filter(function (source) {
                return source.numRecords > 0;
            });
            var recordTotal = 0;
            var imageTotal = 0;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = sources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var source = _step.value;

                    recordTotal += source.numRecords;
                    imageTotal += source.numImages;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            res.render("Home", {
                sources: sources,
                recordTotal: recordTotal,
                imageTotal: imageTotal
            });
        },
        routes: function routes() {
            app.get("/", cache(1), this.index);
        }
    };
};