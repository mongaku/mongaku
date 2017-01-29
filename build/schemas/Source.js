"use strict";

var async = require("async");

var record = require("../lib/record");
var models = require("../lib/models");
var db = require("../lib/db");
var urls = require("../lib/urls");
var options = require("../lib/options");
var defaultConverter = require("../lib/default-converter");

var sourceCache = [];

var Source = new db.schema({
    // A short ID (e.g. "frick")
    _id: String,

    // The type of the record
    type: {
        type: String,
        required: true
    },

    // The URL to associate with the source
    url: String,

    // The full name of the source (e.g. "Frick Art Reference Library")
    name: {
        type: String,
        required: true
    },

    // A short name (e.g. "Frick")
    shortName: {
        type: String,
        required: true
    },

    // The name of the converter to use on the data when importing
    converter: {
        type: String,
        default: "default"
    }
});

Source.methods = {
    getURL: function getURL(locale) {
        return urls.gen(locale, "/" + this.type + "/source/" + this._id);
    },
    getAdminURL: function getAdminURL(locale) {
        return this.getURL(locale) + "/admin";
    },
    getDirBase: function getDirBase() {
        return urls.genLocalFile(this._id);
    },
    getFullName: function getFullName() {
        return this.name;
    },
    getShortName: function getShortName() {
        return this.shortName;
    },
    getConverter: function getConverter() {
        var converter = this.converter || "default";
        var converters = Object.assign({
            default: defaultConverter
        }, options.converters);

        /* istanbul ignore if */
        if (!converters[converter]) {
            throw new Error("Error: Converter not found: " + converter);
        }

        // Return the converter module
        return converters[converter];
    },
    getExpectedFiles: function getExpectedFiles() {
        return this.getConverter().files;
    },
    processFiles: function processFiles(files, callback) {
        this.getConverter().processFiles(files, callback);
    },
    cacheTotals: function cacheTotals(callback) {
        var _this = this;

        record(this.type).aggregate([{
            $match: {
                source: this._id
            }
        }, {
            $group: {
                _id: null,
                total: { $sum: 1 },
                totalImages: { $sum: { $size: "$images" } }
            }
        }], function (err, results) {
            if (results && results[0]) {
                _this.numRecords = results[0].total;
                _this.numImages = results[0].totalImages;
            } else {
                _this.numRecords = 0;
                _this.numImages = 0;
            }
            callback();
        });
    }
};

Source.statics = {
    cacheSources: function cacheSources(callback) {
        models("Source").find({}, function (err, sources) {
            sourceCache = sources;

            async.eachLimit(sources, 2, function (source, callback) {
                source.cacheTotals(callback);
            }, function () {
                callback(err, sources);
            });
        });
    },
    getSources: function getSources() {
        return sourceCache;
    },
    getSourcesByType: function getSourcesByType(type) {
        return this.getSources().filter(function (source) {
            return source.type === type;
        });
    },
    getSource: function getSource(sourceName) {
        var sources = this.getSources();

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = sources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var source = _step.value;

                if (source._id === sourceName) {
                    return source;
                }
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

        throw new Error("Source not found: " + sourceName);
    }
};

module.exports = Source;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL1NvdXJjZS5qcyJdLCJuYW1lcyI6WyJhc3luYyIsInJlcXVpcmUiLCJyZWNvcmQiLCJtb2RlbHMiLCJkYiIsInVybHMiLCJvcHRpb25zIiwiZGVmYXVsdENvbnZlcnRlciIsInNvdXJjZUNhY2hlIiwiU291cmNlIiwic2NoZW1hIiwiX2lkIiwiU3RyaW5nIiwidHlwZSIsInJlcXVpcmVkIiwidXJsIiwibmFtZSIsInNob3J0TmFtZSIsImNvbnZlcnRlciIsImRlZmF1bHQiLCJtZXRob2RzIiwiZ2V0VVJMIiwibG9jYWxlIiwiZ2VuIiwiZ2V0QWRtaW5VUkwiLCJnZXREaXJCYXNlIiwiZ2VuTG9jYWxGaWxlIiwiZ2V0RnVsbE5hbWUiLCJnZXRTaG9ydE5hbWUiLCJnZXRDb252ZXJ0ZXIiLCJjb252ZXJ0ZXJzIiwiT2JqZWN0IiwiYXNzaWduIiwiRXJyb3IiLCJnZXRFeHBlY3RlZEZpbGVzIiwiZmlsZXMiLCJwcm9jZXNzRmlsZXMiLCJjYWxsYmFjayIsImNhY2hlVG90YWxzIiwiYWdncmVnYXRlIiwiJG1hdGNoIiwic291cmNlIiwiJGdyb3VwIiwidG90YWwiLCIkc3VtIiwidG90YWxJbWFnZXMiLCIkc2l6ZSIsImVyciIsInJlc3VsdHMiLCJudW1SZWNvcmRzIiwibnVtSW1hZ2VzIiwic3RhdGljcyIsImNhY2hlU291cmNlcyIsImZpbmQiLCJzb3VyY2VzIiwiZWFjaExpbWl0IiwiZ2V0U291cmNlcyIsImdldFNvdXJjZXNCeVR5cGUiLCJmaWx0ZXIiLCJnZXRTb3VyY2UiLCJzb3VyY2VOYW1lIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxRQUFRQyxRQUFRLE9BQVIsQ0FBZDs7QUFFQSxJQUFNQyxTQUFTRCxRQUFRLGVBQVIsQ0FBZjtBQUNBLElBQU1FLFNBQVNGLFFBQVEsZUFBUixDQUFmO0FBQ0EsSUFBTUcsS0FBS0gsUUFBUSxXQUFSLENBQVg7QUFDQSxJQUFNSSxPQUFPSixRQUFR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QS9CLENBQU47QUFDSDtBQS9CWSxDQUFqQjs7QUFrQ0FDLE9BQU9DLE9BQVAsR0FBaUJyRCxNQUFqQiIsImZpbGUiOiJTb3VyY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBhc3luYyA9IHJlcXVpcmUoXCJhc3luY1wiKTtcblxuY29uc3QgcmVjb3JkID0gcmVxdWlyZShcIi4uL2xpYi9yZWNvcmRcIik7XG5jb25zdCBtb2RlbHMgPSByZXF1aXJlKFwiLi4vbGliL21vZGVsc1wiKTtcbmNvbnN0IGRiID0gcmVxdWlyZShcIi4uL2xpYi9kYlwiKTtcbmNvbnN0IHVybHMgPSByZXF1aXJlKFwiLi4vbGliL3VybHNcIik7XG5jb25zdCBvcHRpb25zID0gcmVxdWlyZShcIi4uL2xpYi9vcHRpb25zXCIpO1xuY29uc3QgZGVmYXVsdENvbnZlcnRlciA9IHJlcXVpcmUoXCIuLi9saWIvZGVmYXVsdC1jb252ZXJ0ZXJcIik7XG5cbmxldCBzb3VyY2VDYWNoZSA9IFtdO1xuXG5jb25zdCBTb3VyY2UgPSBuZXcgZGIuc2NoZW1hKHtcbiAgICAvLyBBIHNob3J0IElEIChlLmcuIFwiZnJpY2tcIilcbiAgICBfaWQ6IFN0cmluZyxcblxuICAgIC8vIFRoZSB0eXBlIG9mIHRoZSByZWNvcmRcbiAgICB0eXBlOiAge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIH0sXG5cbiAgICAvLyBUaGUgVVJMIHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBzb3VyY2VcbiAgICB1cmw6IFN0cmluZyxcblxuICAgIC8vIFRoZSBmdWxsIG5hbWUgb2YgdGhlIHNvdXJjZSAoZS5nLiBcIkZyaWNrIEFydCBSZWZlcmVuY2UgTGlicmFyeVwiKVxuICAgIG5hbWU6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICB9LFxuXG4gICAgLy8gQSBzaG9ydCBuYW1lIChlLmcuIFwiRnJpY2tcIilcbiAgICBzaG9ydE5hbWU6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICB9LFxuXG4gICAgLy8gVGhlIG5hbWUgb2YgdGhlIGNvbnZlcnRlciB0byB1c2Ugb24gdGhlIGRhdGEgd2hlbiBpbXBvcnRpbmdcbiAgICBjb252ZXJ0ZXI6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICBkZWZhdWx0OiBcImRlZmF1bHRcIixcbiAgICB9LFxufSk7XG5cblNvdXJjZS5tZXRob2RzID0ge1xuICAgIGdldFVSTChsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIHVybHMuZ2VuKGxvY2FsZSwgYC8ke3RoaXMudHlwZX0vc291cmNlLyR7dGhpcy5faWR9YCk7XG4gICAgfSxcblxuICAgIGdldEFkbWluVVJMKGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5nZXRVUkwobG9jYWxlKX0vYWRtaW5gO1xuICAgIH0sXG5cbiAgICBnZXREaXJCYXNlKCkge1xuICAgICAgICByZXR1cm4gdXJscy5nZW5Mb2NhbEZpbGUodGhpcy5faWQpO1xuICAgIH0sXG5cbiAgICBnZXRGdWxsTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgICB9LFxuXG4gICAgZ2V0U2hvcnROYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zaG9ydE5hbWU7XG4gICAgfSxcblxuICAgIGdldENvbnZlcnRlcigpIHtcbiAgICAgICAgY29uc3QgY29udmVydGVyID0gdGhpcy5jb252ZXJ0ZXIgfHwgXCJkZWZhdWx0XCI7XG4gICAgICAgIGNvbnN0IGNvbnZlcnRlcnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGRlZmF1bHRDb252ZXJ0ZXIsXG4gICAgICAgIH0sIG9wdGlvbnMuY29udmVydGVycyk7XG5cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmICghY29udmVydGVyc1tjb252ZXJ0ZXJdKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yOiBDb252ZXJ0ZXIgbm90IGZvdW5kOiAke2NvbnZlcnRlcn1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJldHVybiB0aGUgY29udmVydGVyIG1vZHVsZVxuICAgICAgICByZXR1cm4gY29udmVydGVyc1tjb252ZXJ0ZXJdO1xuICAgIH0sXG5cbiAgICBnZXRFeHBlY3RlZEZpbGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRDb252ZXJ0ZXIoKS5maWxlcztcbiAgICB9LFxuXG4gICAgcHJvY2Vzc0ZpbGVzKGZpbGVzLCBjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmdldENvbnZlcnRlcigpLnByb2Nlc3NGaWxlcyhmaWxlcywgY2FsbGJhY2spO1xuICAgIH0sXG5cbiAgICBjYWNoZVRvdGFscyhjYWxsYmFjaykge1xuICAgICAgICByZWNvcmQodGhpcy50eXBlKS5hZ2dyZWdhdGUoW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICRtYXRjaDoge1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuX2lkLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICRncm91cDoge1xuICAgICAgICAgICAgICAgICAgICBfaWQ6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOiB7JHN1bTogMX0sXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsSW1hZ2VzOiB7JHN1bTogeyRzaXplOiBcIiRpbWFnZXNcIn19LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICBdLCAoZXJyLCByZXN1bHRzKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzdWx0cyAmJiByZXN1bHRzWzBdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5udW1SZWNvcmRzID0gcmVzdWx0c1swXS50b3RhbDtcbiAgICAgICAgICAgICAgICB0aGlzLm51bUltYWdlcyA9IHJlc3VsdHNbMF0udG90YWxJbWFnZXM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubnVtUmVjb3JkcyA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5udW1JbWFnZXMgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbn07XG5cblNvdXJjZS5zdGF0aWNzID0ge1xuICAgIGNhY2hlU291cmNlcyhjYWxsYmFjaykge1xuICAgICAgICBtb2RlbHMoXCJTb3VyY2VcIikuZmluZCh7fSwgKGVyciwgc291cmNlcykgPT4ge1xuICAgICAgICAgICAgc291cmNlQ2FjaGUgPSBzb3VyY2VzO1xuXG4gICAgICAgICAgICBhc3luYy5lYWNoTGltaXQoc291cmNlcywgMiwgKHNvdXJjZSwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgICAgICBzb3VyY2UuY2FjaGVUb3RhbHMoY2FsbGJhY2spO1xuICAgICAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgc291cmNlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGdldFNvdXJjZXMoKSB7XG4gICAgICAgIHJldHVybiBzb3VyY2VDYWNoZTtcbiAgICB9LFxuXG4gICAgZ2V0U291cmNlc0J5VHlwZSh0eXBlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFNvdXJjZXMoKS5maWx0ZXIoKHNvdXJjZSkgPT4gc291cmNlLnR5cGUgPT09IHR5cGUpO1xuICAgIH0sXG5cbiAgICBnZXRTb3VyY2Uoc291cmNlTmFtZSkge1xuICAgICAgICBjb25zdCBzb3VyY2VzID0gdGhpcy5nZXRTb3VyY2VzKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xuICAgICAgICAgICAgaWYgKHNvdXJjZS5faWQgPT09IHNvdXJjZU5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc291cmNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBTb3VyY2Ugbm90IGZvdW5kOiAke3NvdXJjZU5hbWV9YCk7XG4gICAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU291cmNlO1xuIl19