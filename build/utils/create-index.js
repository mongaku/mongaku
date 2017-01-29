"use strict";

var async = require("async");
var request = require("request");

var config = require("../lib/config");
var record = require("../lib/record");
var options = require("../lib/options");

module.exports = function (args, callback) {
    async.eachLimit(Object.keys(options.types), 1, function (type, callback) {
        var Record = record(type);

        console.log("Deleting existing " + type + " index...");

        // TODO(jeresig): Make this configurable
        var esIndexURL = config.ELASTICSEARCH_URL + "/" + type;

        request.delete(esIndexURL, function () {
            console.log("Re-building " + type + " index...");

            request.put(esIndexURL, function () {
                Record.createMapping(function (err) {
                    if (err) {
                        return callback(err);
                    }

                    var count = 0;

                    Record.synchronize().on("data", function () {
                        count += 1;
                        console.log("Indexed " + type + " record #" + count);
                    }).on("close", callback).on("error", callback);
                });
            });
        });
    }, callback);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jcmVhdGUtaW5kZXguanMiXSwibmFtZXMiOlsiYXN5bmMiLCJyZXF1aXJlIiwicmVxdWVzdCIsImNvbmZpZyIsInJlY29yZCIsIm9wdGlvbnMiLCJtb2R1bGUiLCJleHBvcnRzIiwiYXJncyIsImNhbGxiYWNrIiwiZWFjaExpbWl0IiwiT2JqZWN0Iiwia2V5cyIsInR5cGVzIiwidHlwZSIsIlJlY29yZCIsImNvbnNvbGUiLCJsb2ciLCJlc0luZGV4VVJMIiwiRUxBU1RJQ1NFQVJDSF9VUkwiLCJkZWxldGUiLCJwdXQiLCJjcmVhdGVNYXBwaW5nIiwiZXJyIiwiY291bnQiLCJzeW5jaHJvbml6ZSIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFFBQVFDLFFBQVEsT0FBUixDQUFkO0FBQ0EsSUFBTUMsVUFBVUQsUUFBUSxTQUFSLENBQWhCOztBQUVBLElBQU1FLFNBQVNGLFFBQVEsZUFBUixDQUFmO0FBQ0EsSUFBTUcsU0FBU0gsUUFBUSxlQUFSLENBQWY7QUFDQSxJQUFNSSxVQUFVSixRQUFRLGdCQUFSLENBQWhCOztBQUVBSyxPQUFPQyxPQUFQLEdBQWlCLFVBQUNDLElBQUQsRUFBT0MsUUFBUCxFQUFvQjtBQUNqQ1QsVUFBTVUsU0FBTixDQUFnQkMsT0FBT0MsSUFBUCxDQUFZUCxRQUFRUSxLQUFwQixDQUFoQixFQUE0QyxDQUE1QyxFQUErQyxVQUFDQyxJQUFELEVBQU9MLFFBQVAsRUFBb0I7QUFDL0QsWUFBTU0sU0FBU1gsT0FBT1UsSUFBUCxDQUFmOztBQUVBRSxnQkFBUUMsR0FBUix3QkFBaUNILElBQWpDOztBQUVBO0FBQ0EsWUFBTUksYUFBZ0JmLE9BQU9nQixpQkFBdkIsU0FBNENMLElBQWxEOztBQUVBWixnQkFBUWtCLE1BQVIsQ0FBZUYsVUFBZixFQUEyQixZQUFNO0FBQzdCRixvQkFBUUMsR0FBUixrQkFBMkJILElBQTNCOztBQUVBWixvQkFBUW1CLEdBQVIsQ0FBWUgsVUFBWixFQUF3QixZQUFNO0FBQzFCSCx1QkFBT08sYUFBUCxDQUFxQixVQUFDQyxHQUFELEVBQVM7QUFDMUIsd0JBQUlBLEdBQUosRUFBUztBQUNMLCtCQUFPZCxTQUFTYyxHQUFULENBQVA7QUFDSDs7QUFFRCx3QkFBSUMsUUFBUSxDQUFaOztBQUVBVCwyQkFBT1UsV0FBUCxHQUNLQyxFQURMLENBQ1EsTUFEUixFQUNnQixZQUFNO0FBQ2RGLGlDQUFTLENBQVQ7QUFDQVIsZ0NBQVFDLEdBQVIsY0FBdUJILElBQXZCLGlCQUF1Q1UsS0FBdkM7QUFDSCxxQkFKTCxFQUtLRSxFQUxMLENBS1EsT0FMUixFQUtpQmpCLFFBTGpCLEVBTUtpQixFQU5MLENBTVEsT0FOUixFQU1pQmpCLFFBTmpCO0FBT0gsaUJBZEQ7QUFlSCxhQWhCRDtBQWlCSCxTQXBCRDtBQXFCSCxLQTdCRCxFQTZCR0EsUUE3Qkg7QUE4QkgsQ0EvQkQiLCJmaWxlIjoiY3JlYXRlLWluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgYXN5bmMgPSByZXF1aXJlKFwiYXN5bmNcIik7XG5jb25zdCByZXF1ZXN0ID0gcmVxdWlyZShcInJlcXVlc3RcIik7XG5cbmNvbnN0IGNvbmZpZyA9IHJlcXVpcmUoXCIuLi9saWIvY29uZmlnXCIpO1xuY29uc3QgcmVjb3JkID0gcmVxdWlyZShcIi4uL2xpYi9yZWNvcmRcIik7XG5jb25zdCBvcHRpb25zID0gcmVxdWlyZShcIi4uL2xpYi9vcHRpb25zXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChhcmdzLCBjYWxsYmFjaykgPT4ge1xuICAgIGFzeW5jLmVhY2hMaW1pdChPYmplY3Qua2V5cyhvcHRpb25zLnR5cGVzKSwgMSwgKHR5cGUsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIGNvbnN0IFJlY29yZCA9IHJlY29yZCh0eXBlKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhgRGVsZXRpbmcgZXhpc3RpbmcgJHt0eXBlfSBpbmRleC4uLmApO1xuXG4gICAgICAgIC8vIFRPRE8oamVyZXNpZyk6IE1ha2UgdGhpcyBjb25maWd1cmFibGVcbiAgICAgICAgY29uc3QgZXNJbmRleFVSTCA9IGAke2NvbmZpZy5FTEFTVElDU0VBUkNIX1VSTH0vJHt0eXBlfWA7XG5cbiAgICAgICAgcmVxdWVzdC5kZWxldGUoZXNJbmRleFVSTCwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFJlLWJ1aWxkaW5nICR7dHlwZX0gaW5kZXguLi5gKTtcblxuICAgICAgICAgICAgcmVxdWVzdC5wdXQoZXNJbmRleFVSTCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIFJlY29yZC5jcmVhdGVNYXBwaW5nKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsZXQgY291bnQgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgIFJlY29yZC5zeW5jaHJvbml6ZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAub24oXCJkYXRhXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudCArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBJbmRleGVkICR7dHlwZX0gcmVjb3JkICMke2NvdW50fWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcImNsb3NlXCIsIGNhbGxiYWNrKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKFwiZXJyb3JcIiwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sIGNhbGxiYWNrKTtcbn07XG4iXX0=