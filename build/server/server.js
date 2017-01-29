"use strict";

var express = require("express");

var init = require("../lib/init");
var config = require("../lib/config");

var expressInit = require("./express");
var passport = require("./passport");
var i18n = require("./i18n");
var routes = require("./routes");
var tmplVars = require("./tmpl-vars");
var cron = require("./cron");

module.exports = function (callback) {
    var port = config.PORT;
    var app = express();

    init(function (err) {
        /* istanbul ignore if */
        if (err) {
            return callback(err);
        }

        // Load in the main server logic
        expressInit(app);
        passport(app);
        i18n(app);
        tmplVars(app);
        routes(app);

        var server = app.listen(port, function () {
            callback(null, server);

            /* istanbul ignore if */
            if (process.send) {
                process.send("online");
            }
        });

        /* istanbul ignore if */
        if (config.NODE_ENV !== "test") {
            // Start the app by listening on <port>
            console.log("PORT: " + port);

            process.on("message", function (message) {
                if (message === "shutdown") {
                    process.exit(0);
                }
            });

            process.on("uncaughtException", function (err) {
                console.error("Exception:", err.stack);

                if (process.send) {
                    process.send("offline");
                }
            });

            cron.start();
        }
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2ZXIvc2VydmVyLmpzIl0sIm5hbWVzIjpbImV4cHJlc3MiLCJyZXF1aXJlIiwiaW5pdCIsImNvbmZpZyIsImV4cHJlc3NJbml0IiwicGFzc3BvcnQiLCJpMThuIiwicm91dGVzIiwidG1wbFZhcnMiLCJjcm9uIiwibW9kdWxlIiwiZXhwb3J0cyIsImNhbGxiYWNrIiwicG9ydCIsIlBPUlQiLCJhcHAiLCJlcnIiLCJzZXJ2ZXIiLCJsaXN0ZW4iLCJwcm9jZXNzIiwic2VuZCIsIk5PREVfRU5WIiwiY29uc29sZSIsImxvZyIsIm9uIiwibWVzc2FnZSIsImV4aXQiLCJlcnJvciIsInN0YWNrIiwic3RhcnQiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsVUFBVUMsUUFBUSxTQUFSLENBQWhCOztBQUVBLElBQU1DLE9BQU9ELFFBQVEsYUFBUixDQUFiO0FBQ0EsSUFBTUUsU0FBU0YsUUFBUSxlQUFSLENBQWY7O0FBRUEsSUFBTUcsY0FBY0gsUUFBUSxXQUFSLENBQXBCO0FBQ0EsSUFBTUksV0FBV0osUUFBUSxZQUFSLENBQWpCO0FBQ0EsSUFBTUssT0FBT0wsUUFBUSxRQUFSLENBQWI7QUFDQSxJQUFNTSxTQUFTTixRQUFRLFVBQVIsQ0FBZjtBQUNBLElBQU1PLFdBQVdQLFFBQVEsYUFBUixDQUFqQjtBQUNBLElBQU1RLE9BQU9SLFFBQVEsUUFBUixDQUFiOztBQUVBUyxPQUFPQyxPQUFQLEdBQWlCLFVBQUNDLFFBQUQsRUFBYztBQUMzQixRQUFNQyxPQUFPVixPQUFPVyxJQUFwQjtBQUNBLFFBQU1DLE1BQU1mLFNBQVo7O0FBRUFFLFNBQUssVUFBQ2MsR0FBRCxFQUFTO0FBQ1Y7QUFDQSxZQUFJQSxHQUFKLEVBQVM7QUFDTCxtQkFBT0osU0FBU0ksR0FBVCxDQUFQO0FBQ0g7O0FBRUQ7QUFDQVosb0JBQVlXLEdBQVo7QUFDQVYsaUJBQVNVLEdBQVQ7QUFDQVQsYUFBS1MsR0FBTDtBQUNBUCxpQkFBU08sR0FBVDtBQUNBUixlQUFPUSxHQUFQOztBQUVBLFlBQU1FLFNBQVNGLElBQUlHLE1BQUosQ0FBV0wsSUFBWCxFQUFpQixZQUFNO0FBQ2xDRCxxQkFBUyxJQUFULEVBQWVLLE1BQWY7O0FBRUE7QUFDQSxnQkFBSUUsUUFBUUMsSUFBWixFQUFrQjtBQUNkRCx3QkFBUUMsSUFBUixDQUFhLFFBQWI7QUFDSDtBQUNKLFNBUGMsQ0FBZjs7QUFTQTtBQUNBLFlBQUlqQixPQUFPa0IsUUFBUCxLQUFvQixNQUF4QixFQUFnQztBQUM1QjtBQUNBQyxvQkFBUUMsR0FBUixZQUFxQlYsSUFBckI7O0FBRUFNLG9CQUFRSyxFQUFSLENBQVcsU0FBWCxFQUFzQixVQUFDQyxPQUFELEVBQWE7QUFDL0Isb0JBQUlBLFlBQVksVUFBaEIsRUFBNEI7QUFDeEJOLDRCQUFRTyxJQUFSLENBQWEsQ0FBYjtBQUNIO0FBQ0osYUFKRDs7QUFNQVAsb0JBQVFLLEVBQVIsQ0FBVyxtQkFBWCxFQUFnQyxVQUFDUixHQUFELEVBQVM7QUFDckNNLHdCQUFRSyxLQUFSLENBQWMsWUFBZCxFQUE0QlgsSUFBSVksS0FBaEM7O0FBRUEsb0JBQUlULFFBQVFDLElBQVosRUFBa0I7QUFDZEQsNEJBQVFDLElBQVIsQ0FBYSxTQUFiO0FBQ0g7QUFDSixhQU5EOztBQVFBWCxpQkFBS29CLEtBQUw7QUFDSDtBQUNKLEtBM0NEO0FBNENILENBaEREIiwiZmlsZSI6InNlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGV4cHJlc3MgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTtcblxuY29uc3QgaW5pdCA9IHJlcXVpcmUoXCIuLi9saWIvaW5pdFwiKTtcbmNvbnN0IGNvbmZpZyA9IHJlcXVpcmUoXCIuLi9saWIvY29uZmlnXCIpO1xuXG5jb25zdCBleHByZXNzSW5pdCA9IHJlcXVpcmUoXCIuL2V4cHJlc3NcIik7XG5jb25zdCBwYXNzcG9ydCA9IHJlcXVpcmUoXCIuL3Bhc3Nwb3J0XCIpO1xuY29uc3QgaTE4biA9IHJlcXVpcmUoXCIuL2kxOG5cIik7XG5jb25zdCByb3V0ZXMgPSByZXF1aXJlKFwiLi9yb3V0ZXNcIik7XG5jb25zdCB0bXBsVmFycyA9IHJlcXVpcmUoXCIuL3RtcGwtdmFyc1wiKTtcbmNvbnN0IGNyb24gPSByZXF1aXJlKFwiLi9jcm9uXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChjYWxsYmFjaykgPT4ge1xuICAgIGNvbnN0IHBvcnQgPSBjb25maWcuUE9SVDtcbiAgICBjb25zdCBhcHAgPSBleHByZXNzKCk7XG5cbiAgICBpbml0KChlcnIpID0+IHtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTG9hZCBpbiB0aGUgbWFpbiBzZXJ2ZXIgbG9naWNcbiAgICAgICAgZXhwcmVzc0luaXQoYXBwKTtcbiAgICAgICAgcGFzc3BvcnQoYXBwKTtcbiAgICAgICAgaTE4bihhcHApO1xuICAgICAgICB0bXBsVmFycyhhcHApO1xuICAgICAgICByb3V0ZXMoYXBwKTtcblxuICAgICAgICBjb25zdCBzZXJ2ZXIgPSBhcHAubGlzdGVuKHBvcnQsICgpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHNlcnZlcik7XG5cbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgICAgaWYgKHByb2Nlc3Muc2VuZCkge1xuICAgICAgICAgICAgICAgIHByb2Nlc3Muc2VuZChcIm9ubGluZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmIChjb25maWcuTk9ERV9FTlYgIT09IFwidGVzdFwiKSB7XG4gICAgICAgICAgICAvLyBTdGFydCB0aGUgYXBwIGJ5IGxpc3RlbmluZyBvbiA8cG9ydD5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBQT1JUOiAke3BvcnR9YCk7XG5cbiAgICAgICAgICAgIHByb2Nlc3Mub24oXCJtZXNzYWdlXCIsIChtZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UgPT09IFwic2h1dGRvd25cIikge1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHByb2Nlc3Mub24oXCJ1bmNhdWdodEV4Y2VwdGlvblwiLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkV4Y2VwdGlvbjpcIiwgZXJyLnN0YWNrKTtcblxuICAgICAgICAgICAgICAgIGlmIChwcm9jZXNzLnNlbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5zZW5kKFwib2ZmbGluZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY3Jvbi5zdGFydCgpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuIl19