"use strict";

var async = require("async");

var db = require("./db");
var models = require("./models");

module.exports = function (callback) {
    return new Promise(function (resolve, reject) {
        async.series([function (callback) {
            return db.connect(callback);
        }, function (callback) {
            return models("Source").cacheSources(callback);
        }], function (err) {
            /* istanbul ignore if */
            if (callback) {
                callback(err);
            }

            /* istanbul ignore if */
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvaW5pdC5qcyJdLCJuYW1lcyI6WyJhc3luYyIsInJlcXVpcmUiLCJkYiIsIm1vZGVscyIsIm1vZHVsZSIsImV4cG9ydHMiLCJjYWxsYmFjayIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic2VyaWVzIiwiY29ubmVjdCIsImNhY2hlU291cmNlcyIsImVyciJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxRQUFRQyxRQUFRLE9BQVIsQ0FBZDs7QUFFQSxJQUFNQyxLQUFLRCxRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQU1FLFNBQVNGLFFBQVEsVUFBUixDQUFmOztBQUVBRyxPQUFPQyxPQUFQLEdBQWlCLFVBQUNDLFFBQUQsRUFBYztBQUMzQixXQUFPLElBQUlDLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDcENULGNBQU1VLE1BQU4sQ0FBYSxDQUNULFVBQUNKLFFBQUQ7QUFBQSxtQkFBY0osR0FBR1MsT0FBSCxDQUFXTCxRQUFYLENBQWQ7QUFBQSxTQURTLEVBRVQsVUFBQ0EsUUFBRDtBQUFBLG1CQUFjSCxPQUFPLFFBQVAsRUFBaUJTLFlBQWpCLENBQThCTixRQUE5QixDQUFkO0FBQUEsU0FGUyxDQUFiLEVBR0csVUFBQ08sR0FBRCxFQUFTO0FBQ1I7QUFDQSxnQkFBSVAsUUFBSixFQUFjO0FBQ1ZBLHlCQUFTTyxHQUFUO0FBQ0g7O0FBRUQ7QUFDQSxnQkFBSUEsR0FBSixFQUFTO0FBQ0xKLHVCQUFPSSxHQUFQO0FBQ0gsYUFGRCxNQUVPO0FBQ0hMO0FBQ0g7QUFDSixTQWZEO0FBZ0JILEtBakJNLENBQVA7QUFrQkgsQ0FuQkQiLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGFzeW5jID0gcmVxdWlyZShcImFzeW5jXCIpO1xuXG5jb25zdCBkYiA9IHJlcXVpcmUoXCIuL2RiXCIpO1xuY29uc3QgbW9kZWxzID0gcmVxdWlyZShcIi4vbW9kZWxzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChjYWxsYmFjaykgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGFzeW5jLnNlcmllcyhbXG4gICAgICAgICAgICAoY2FsbGJhY2spID0+IGRiLmNvbm5lY3QoY2FsbGJhY2spLFxuICAgICAgICAgICAgKGNhbGxiYWNrKSA9PiBtb2RlbHMoXCJTb3VyY2VcIikuY2FjaGVTb3VyY2VzKGNhbGxiYWNrKSxcbiAgICAgICAgXSwgKGVycikgPT4ge1xuICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG4iXX0=