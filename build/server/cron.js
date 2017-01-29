"use strict";

// How often queries should be performed
var QUERY_RATE = 5000;

var record = require("../lib/record");
var models = require("../lib/models");
var options = require("../lib/options");

module.exports = {
    updateRecordImport: function updateRecordImport() {
        var advance = function advance() {
            return models("RecordImport").advance(function () {
                return setTimeout(advance, QUERY_RATE);
            });
        };

        advance();
    },
    updateRecordSimilarity: function updateRecordSimilarity() {
        var _loop = function _loop(typeName) {
            var Record = record(typeName);
            var next = function next() {
                return setTimeout(update, QUERY_RATE);
            };
            var update = function update() {
                return Record.updateSimilarity(function (err, success) {
                    // If nothing happened then we wait to try again
                    if (err || !success) {
                        return next();
                    }

                    // If it worked immediately attempt to index or update
                    // another image.
                    process.nextTick(update);
                });
            };

            update();
        };

        for (var typeName in options.types) {
            _loop(typeName);
        }
    },
    updateImageImport: function updateImageImport() {
        var advance = function advance() {
            return models("ImageImport").advance(function () {
                return setTimeout(advance, QUERY_RATE);
            });
        };

        advance();
    },
    updateImageSimilarity: function updateImageSimilarity() {
        var Image = models("Image");
        var next = function next() {
            return setTimeout(update, QUERY_RATE);
        };
        var update = function update() {
            return Image.indexSimilarity(function (err, success) {
                // If we hit an error attempt again after a small delay
                /* istanbul ignore if */
                if (err) {
                    return next();
                }

                // If it worked immediately attempt to index or update
                // another image.
                if (success) {
                    return process.nextTick(update);
                }

                // If nothing happened attempt to update the similarity
                // of an image instead.
                Image.updateSimilarity(function (err, success) {
                    // If nothing happened then we wait to try again
                    if (err || !success) {
                        return next();
                    }

                    // If it worked immediately attempt to index or update
                    // another image.
                    process.nextTick(update);
                });
            });
        };

        update();
    },
    start: function start() {
        this.updateRecordImport();
        this.updateRecordSimilarity();
        this.updateImageImport();
        this.updateImageSimilarity();
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2ZXIvY3Jvbi5qcyJdLCJuYW1lcyI6WyJRVUVSWV9SQVRFIiwicmVjb3JkIiwicmVxdWlyZSIsIm1vZGVscyIsIm9wdGlvbnMiLCJtb2R1bGUiLCJleHBvcnRzIiwidXBkYXRlUmVjb3JkSW1wb3J0IiwiYWR2YW5jZSIsInNldFRpbWVvdXQiLCJ1cGRhdGVSZWNvcmRTaW1pbGFyaXR5IiwidHlwZU5hbWUiLCJSZWNvcmQiLCJuZXh0IiwidXBkYXRlIiwidXBkYXRlU2ltaWxhcml0eSIsImVyciIsInN1Y2Nlc3MiLCJwcm9jZXNzIiwibmV4dFRpY2siLCJ0eXBlcyIsInVwZGF0ZUltYWdlSW1wb3J0IiwidXBkYXRlSW1hZ2VTaW1pbGFyaXR5IiwiSW1hZ2UiLCJpbmRleFNpbWlsYXJpdHkiLCJzdGFydCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBLElBQU1BLGFBQWEsSUFBbkI7O0FBRUEsSUFBTUMsU0FBU0MsUUFBUSxlQUFSLENBQWY7QUFDQSxJQUFNQyxTQUFTRCxRQUFRLGVBQVIsQ0FBZjtBQUNBLElBQU1FLFVBQVVGLFFBQVEsZ0JBQVIsQ0FBaEI7O0FBRUFHLE9BQU9DLE9BQVAsR0FBaUI7QUFDYkMsc0JBRGEsZ0NBQ1E7QUFDakIsWUFBTUMsVUFBVSxTQUFWQSxPQUFVO0FBQUEsbUJBQU1MLE9BQU8sY0FBUCxFQUF1QkssT0FBdkIsQ0FBK0I7QUFBQSx1QkFDakRDLFdBQVdELE9BQVgsRUFBb0JSLFVBQXBCLENBRGlEO0FBQUEsYUFBL0IsQ0FBTjtBQUFBLFNBQWhCOztBQUdBUTtBQUNILEtBTlk7QUFRYkUsMEJBUmEsb0NBUVk7QUFBQSxtQ0FDVkMsUUFEVTtBQUVqQixnQkFBTUMsU0FBU1gsT0FBT1UsUUFBUCxDQUFmO0FBQ0EsZ0JBQU1FLE9BQU8sU0FBUEEsSUFBTztBQUFBLHVCQUFNSixXQUFXSyxNQUFYLEVBQW1CZCxVQUFuQixDQUFOO0FBQUEsYUFBYjtBQUNBLGdCQUFNYyxTQUFTLFNBQVRBLE1BQVM7QUFBQSx1QkFBTUYsT0FBT0csZ0JBQVAsQ0FBd0IsVUFBQ0MsR0FBRCxFQUFNQyxPQUFOLEVBQWtCO0FBQzNEO0FBQ0Esd0JBQUlELE9BQU8sQ0FBQ0MsT0FBWixFQUFxQjtBQUNqQiwrQkFBT0osTUFBUDtBQUNIOztBQUVEO0FBQ0E7QUFDQUssNEJBQVFDLFFBQVIsQ0FBaUJMLE1BQWpCO0FBQ0gsaUJBVG9CLENBQU47QUFBQSxhQUFmOztBQVdBQTtBQWZpQjs7QUFDckIsYUFBSyxJQUFNSCxRQUFYLElBQXVCUCxRQUFRZ0IsS0FBL0IsRUFBc0M7QUFBQSxrQkFBM0JULFFBQTJCO0FBZXJDO0FBQ0osS0F6Qlk7QUEyQmJVLHFCQTNCYSwrQkEyQk87QUFDaEIsWUFBTWIsVUFBVSxTQUFWQSxPQUFVO0FBQUEsbUJBQU1MLE9BQU8sYUFBUCxFQUFzQkssT0FBdEIsQ0FBOEI7QUFBQSx1QkFDaERDLFdBQVdELE9BQVgsRUFBb0JSLFVBQXBCLENBRGdEO0FBQUEsYUFBOUIsQ0FBTjtBQUFBLFNBQWhCOztBQUdBUTtBQUNILEtBaENZO0FBa0NiYyx5QkFsQ2EsbUNBa0NXO0FBQ3BCLFlBQU1DLFFBQVFwQixPQUFPLE9BQVAsQ0FBZDtBQUNBLFlBQU1VLE9BQU8sU0FBUEEsSUFBTztBQUFBLG1CQUFNSixXQUFXSyxNQUFYLEVBQW1CZCxVQUFuQixDQUFOO0FBQUEsU0FBYjtBQUNBLFlBQU1jLFNBQVMsU0FBVEEsTUFBUztBQUFBLG1CQUFNUyxNQUFNQyxlQUFOLENBQXNCLFVBQUNSLEdBQUQsRUFBTUMsT0FBTixFQUFrQjtBQUN6RDtBQUNBO0FBQ0Esb0JBQUlELEdBQUosRUFBUztBQUNMLDJCQUFPSCxNQUFQO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBLG9CQUFJSSxPQUFKLEVBQWE7QUFDVCwyQkFBT0MsUUFBUUMsUUFBUixDQUFpQkwsTUFBakIsQ0FBUDtBQUNIOztBQUVEO0FBQ0E7QUFDQVMsc0JBQU1SLGdCQUFOLENBQXVCLFVBQUNDLEdBQUQsRUFBTUMsT0FBTixFQUFrQjtBQUNyQztBQUNBLHdCQUFJRCxPQUFPLENBQUNDLE9BQVosRUFBcUI7QUFDakIsK0JBQU9KLE1BQVA7QUFDSDs7QUFFRDtBQUNBO0FBQ0FLLDRCQUFRQyxRQUFSLENBQWlCTCxNQUFqQjtBQUNILGlCQVREO0FBVUgsYUF6Qm9CLENBQU47QUFBQSxTQUFmOztBQTJCQUE7QUFDSCxLQWpFWTtBQW1FYlcsU0FuRWEsbUJBbUVMO0FBQ0osYUFBS2xCLGtCQUFMO0FBQ0EsYUFBS0csc0JBQUw7QUFDQSxhQUFLVyxpQkFBTDtBQUNBLGFBQUtDLHFCQUFMO0FBQ0g7QUF4RVksQ0FBakIiLCJmaWxlIjoiY3Jvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEhvdyBvZnRlbiBxdWVyaWVzIHNob3VsZCBiZSBwZXJmb3JtZWRcbmNvbnN0IFFVRVJZX1JBVEUgPSA1MDAwO1xuXG5jb25zdCByZWNvcmQgPSByZXF1aXJlKFwiLi4vbGliL3JlY29yZFwiKTtcbmNvbnN0IG1vZGVscyA9IHJlcXVpcmUoXCIuLi9saWIvbW9kZWxzXCIpO1xuY29uc3Qgb3B0aW9ucyA9IHJlcXVpcmUoXCIuLi9saWIvb3B0aW9uc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgdXBkYXRlUmVjb3JkSW1wb3J0KCkge1xuICAgICAgICBjb25zdCBhZHZhbmNlID0gKCkgPT4gbW9kZWxzKFwiUmVjb3JkSW1wb3J0XCIpLmFkdmFuY2UoKCkgPT5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoYWR2YW5jZSwgUVVFUllfUkFURSkpO1xuXG4gICAgICAgIGFkdmFuY2UoKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlUmVjb3JkU2ltaWxhcml0eSgpIHtcbiAgICAgICAgZm9yIChjb25zdCB0eXBlTmFtZSBpbiBvcHRpb25zLnR5cGVzKSB7XG4gICAgICAgICAgICBjb25zdCBSZWNvcmQgPSByZWNvcmQodHlwZU5hbWUpO1xuICAgICAgICAgICAgY29uc3QgbmV4dCA9ICgpID0+IHNldFRpbWVvdXQodXBkYXRlLCBRVUVSWV9SQVRFKTtcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZSA9ICgpID0+IFJlY29yZC51cGRhdGVTaW1pbGFyaXR5KChlcnIsIHN1Y2Nlc3MpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBJZiBub3RoaW5nIGhhcHBlbmVkIHRoZW4gd2Ugd2FpdCB0byB0cnkgYWdhaW5cbiAgICAgICAgICAgICAgICBpZiAoZXJyIHx8ICFzdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSWYgaXQgd29ya2VkIGltbWVkaWF0ZWx5IGF0dGVtcHQgdG8gaW5kZXggb3IgdXBkYXRlXG4gICAgICAgICAgICAgICAgLy8gYW5vdGhlciBpbWFnZS5cbiAgICAgICAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKHVwZGF0ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlSW1hZ2VJbXBvcnQoKSB7XG4gICAgICAgIGNvbnN0IGFkdmFuY2UgPSAoKSA9PiBtb2RlbHMoXCJJbWFnZUltcG9ydFwiKS5hZHZhbmNlKCgpID0+XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGFkdmFuY2UsIFFVRVJZX1JBVEUpKTtcblxuICAgICAgICBhZHZhbmNlKCk7XG4gICAgfSxcblxuICAgIHVwZGF0ZUltYWdlU2ltaWxhcml0eSgpIHtcbiAgICAgICAgY29uc3QgSW1hZ2UgPSBtb2RlbHMoXCJJbWFnZVwiKTtcbiAgICAgICAgY29uc3QgbmV4dCA9ICgpID0+IHNldFRpbWVvdXQodXBkYXRlLCBRVUVSWV9SQVRFKTtcbiAgICAgICAgY29uc3QgdXBkYXRlID0gKCkgPT4gSW1hZ2UuaW5kZXhTaW1pbGFyaXR5KChlcnIsIHN1Y2Nlc3MpID0+IHtcbiAgICAgICAgICAgIC8vIElmIHdlIGhpdCBhbiBlcnJvciBhdHRlbXB0IGFnYWluIGFmdGVyIGEgc21hbGwgZGVsYXlcbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIGl0IHdvcmtlZCBpbW1lZGlhdGVseSBhdHRlbXB0IHRvIGluZGV4IG9yIHVwZGF0ZVxuICAgICAgICAgICAgLy8gYW5vdGhlciBpbWFnZS5cbiAgICAgICAgICAgIGlmIChzdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2sodXBkYXRlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgbm90aGluZyBoYXBwZW5lZCBhdHRlbXB0IHRvIHVwZGF0ZSB0aGUgc2ltaWxhcml0eVxuICAgICAgICAgICAgLy8gb2YgYW4gaW1hZ2UgaW5zdGVhZC5cbiAgICAgICAgICAgIEltYWdlLnVwZGF0ZVNpbWlsYXJpdHkoKGVyciwgc3VjY2VzcykgPT4ge1xuICAgICAgICAgICAgICAgIC8vIElmIG5vdGhpbmcgaGFwcGVuZWQgdGhlbiB3ZSB3YWl0IHRvIHRyeSBhZ2FpblxuICAgICAgICAgICAgICAgIGlmIChlcnIgfHwgIXN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5leHQoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBJZiBpdCB3b3JrZWQgaW1tZWRpYXRlbHkgYXR0ZW1wdCB0byBpbmRleCBvciB1cGRhdGVcbiAgICAgICAgICAgICAgICAvLyBhbm90aGVyIGltYWdlLlxuICAgICAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2sodXBkYXRlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB1cGRhdGUoKTtcbiAgICB9LFxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlUmVjb3JkSW1wb3J0KCk7XG4gICAgICAgIHRoaXMudXBkYXRlUmVjb3JkU2ltaWxhcml0eSgpO1xuICAgICAgICB0aGlzLnVwZGF0ZUltYWdlSW1wb3J0KCk7XG4gICAgICAgIHRoaXMudXBkYXRlSW1hZ2VTaW1pbGFyaXR5KCk7XG4gICAgfSxcbn07XG4iXX0=