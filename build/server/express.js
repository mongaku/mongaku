"use strict";

var path = require("path");

var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var cookieParser = require("cookie-parser");
var serveFavicon = require("serve-favicon");
var serveStatic = require("serve-static");
var morgan = require("morgan");
var session = require("express-session");
var mongoStore = require("connect-mongo")(session);

var pkg = require("../../package.json");

var db = require("../lib/db");
var config = require("../lib/config");
var reactViews = require("./react-views.js");

var rootPath = path.resolve(__dirname, "..");

module.exports = function (app) {
    /* istanbul ignore if */
    if (config.NODE_ENV !== "test") {
        // A basic logger for tracking who is accessing the service
        app.use(morgan("dev"));
    }

    // Configure all the paths for serving the static content on the site
    app.use(serveFavicon(rootPath + "/public/images/favicon.png"));
    app.use(serveStatic(rootPath + "/public"));
    app.use("/data", serveStatic(config.BASE_DATA_DIR));

    // Configure how the views are handled (with React)
    app.engine("js", reactViews);
    app.set("views", rootPath + "/views");
    app.set("view engine", "js");

    // Enable caching of the view files by Express, but only in production
    app.set("view cache", config.NODE_ENV === "production");

    // Parses the contents of HTTP POST bodies, handling URL-encoded forms
    // and also JSON blobs
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // Adds in support for overriding HTTP verbs to help
    // clients support DELETE and PUT
    app.use(methodOverride());

    // Parse cookies, which are then used by the session
    app.use(cookieParser());

    // Track user sessions and store them in a Mongodb data store
    var store = void 0;

    /* istanbul ignore if */
    if (config.NODE_ENV !== "test") {
        store = new mongoStore({
            mongooseConnection: db.mongoose.connection,
            collection: "sessions"
        });
    }

    app.use(session({
        resave: false,
        saveUninitialized: false,
        secret: pkg.name,
        store: store
    }));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2ZXIvZXhwcmVzcy5qcyJdLCJuYW1lcyI6WyJwYXRoIiwicmVxdWlyZSIsImJvZHlQYXJzZXIiLCJtZXRob2RPdmVycmlkZSIsImNvb2tpZVBhcnNlciIsInNlcnZlRmF2aWNvbiIsInNlcnZlU3RhdGljIiwibW9yZ2FuIiwic2Vzc2lvbiIsIm1vbmdvU3RvcmUiLCJwa2ciLCJkYiIsImNvbmZpZyIsInJlYWN0Vmlld3MiLCJyb290UGF0aCIsInJlc29sdmUiLCJfX2Rpcm5hbWUiLCJtb2R1bGUiLCJleHBvcnRzIiwiYXBwIiwiTk9ERV9FTlYiLCJ1c2UiLCJCQVNFX0RBVEFfRElSIiwiZW5naW5lIiwic2V0IiwidXJsZW5jb2RlZCIsImV4dGVuZGVkIiwic3RvcmUiLCJtb25nb29zZUNvbm5lY3Rpb24iLCJtb25nb29zZSIsImNvbm5lY3Rpb24iLCJjb2xsZWN0aW9uIiwicmVzYXZlIiwic2F2ZVVuaW5pdGlhbGl6ZWQiLCJzZWNyZXQiLCJuYW1lIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLE9BQU9DLFFBQVEsTUFBUixDQUFiOztBQUVBLElBQU1DLGFBQWFELFFBQVEsYUFBUixDQUFuQjtBQUNBLElBQU1FLGlCQUFpQkYsUUFBUSxpQkFBUixDQUF2QjtBQUNBLElBQU1HLGVBQWVILFFBQVEsZUFBUixDQUFyQjtBQUNBLElBQU1JLGVBQWVKLFFBQVEsZUFBUixDQUFyQjtBQUNBLElBQU1LLGNBQWNMLFFBQVEsY0FBUixDQUFwQjtBQUNBLElBQU1NLFNBQVNOLFFBQVEsUUFBUixDQUFmO0FBQ0EsSUFBTU8sVUFBVVAsUUFBUSxpQkFBUixDQUFoQjtBQUNBLElBQU1RLGFBQWFSLFFBQVEsZUFBUixFQUF5Qk8sT0FBekIsQ0FBbkI7O0FBRUEsSUFBTUUsTUFBTVQsUUFBUSxvQkFBUixDQUFaOztBQUVBLElBQU1VLEtBQUtWLFFBQVEsV0FBUixDQUFYO0FBQ0EsSUFBTVcsU0FBU1gsUUFBUSxlQUFSLENBQWY7QUFDQSxJQUFNWSxhQUFhWixRQUFRLGtCQUFSLENBQW5COztBQUVBLElBQU1hLFdBQVdkLEtBQUtlLE9BQUwsQ0FBYUMsU0FBYixFQUF3QixJQUF4QixDQUFqQjs7QUFFQUMsT0FBT0MsT0FBUCxHQUFpQixVQUFDQyxHQUFELEVBQVM7QUFDdEI7QUFDQSxRQUFJUCxPQUFPUSxRQUFQLEtBQW9CLE1BQXhCLEVBQWdDO0FBQzVCO0FBQ0FELFlBQUlFLEdBQUosQ0FBUWQsT0FBTyxLQUFQLENBQVI7QUFDSDs7QUFFRDtBQUNBWSxRQUFJRSxHQUFKLENBQVFoQixhQUFnQlMsUUFBaEIsZ0NBQVI7QUFDQUssUUFBSUUsR0FBSixDQUFRZixZQUFlUSxRQUFmLGFBQVI7QUFDQUssUUFBSUUsR0FBSixDQUFRLE9BQVIsRUFBaUJmLFlBQVlNLE9BQU9VLGFBQW5CLENBQWpCOztBQUVBO0FBQ0FILFFBQUlJLE1BQUosQ0FBVyxJQUFYLEVBQWlCVixVQUFqQjtBQUNBTSxRQUFJSyxHQUFKLENBQVEsT0FBUixFQUFvQlYsUUFBcEI7QUFDQUssUUFBSUssR0FBSixDQUFRLGFBQVIsRUFBdUIsSUFBdkI7O0FBRUE7QUFDQUwsUUFBSUssR0FBSixDQUFRLFlBQVIsRUFBc0JaLE9BQU9RLFFBQVAsS0FBb0IsWUFBMUM7O0FBRUE7QUFDQTtBQUNBRCxRQUFJRSxHQUFKLENBQVFuQixXQUFXdUIsVUFBWCxDQUFzQjtBQUMxQkMsa0JBQVU7QUFEZ0IsS0FBdEIsQ0FBUjs7QUFJQTtBQUNBO0FBQ0FQLFFBQUlFLEdBQUosQ0FBUWxCLGdCQUFSOztBQUVBO0FBQ0FnQixRQUFJRSxHQUFKLENBQVFqQixjQUFSOztBQUVBO0FBQ0EsUUFBSXVCLGNBQUo7O0FBRUE7QUFDQSxRQUFJZixPQUFPUSxRQUFQLEtBQW9CLE1BQXhCLEVBQWdDO0FBQzVCTyxnQkFBUSxJQUFJbEIsVUFBSixDQUFlO0FBQ25CbUIsZ0NBQW9CakIsR0FBR2tCLFFBQUgsQ0FBWUMsVUFEYjtBQUVuQkMsd0JBQVk7QUFGTyxTQUFmLENBQVI7QUFJSDs7QUFFRFosUUFBSUUsR0FBSixDQUFRYixRQUFRO0FBQ1p3QixnQkFBUSxLQURJO0FBRVpDLDJCQUFtQixLQUZQO0FBR1pDLGdCQUFReEIsSUFBSXlCLElBSEE7QUFJWlI7QUFKWSxLQUFSLENBQVI7QUFNSCxDQWxERCIsImZpbGUiOiJleHByZXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuXG5jb25zdCBib2R5UGFyc2VyID0gcmVxdWlyZShcImJvZHktcGFyc2VyXCIpO1xuY29uc3QgbWV0aG9kT3ZlcnJpZGUgPSByZXF1aXJlKFwibWV0aG9kLW92ZXJyaWRlXCIpO1xuY29uc3QgY29va2llUGFyc2VyID0gcmVxdWlyZShcImNvb2tpZS1wYXJzZXJcIik7XG5jb25zdCBzZXJ2ZUZhdmljb24gPSByZXF1aXJlKFwic2VydmUtZmF2aWNvblwiKTtcbmNvbnN0IHNlcnZlU3RhdGljID0gcmVxdWlyZShcInNlcnZlLXN0YXRpY1wiKTtcbmNvbnN0IG1vcmdhbiA9IHJlcXVpcmUoXCJtb3JnYW5cIik7XG5jb25zdCBzZXNzaW9uID0gcmVxdWlyZShcImV4cHJlc3Mtc2Vzc2lvblwiKTtcbmNvbnN0IG1vbmdvU3RvcmUgPSByZXF1aXJlKFwiY29ubmVjdC1tb25nb1wiKShzZXNzaW9uKTtcblxuY29uc3QgcGtnID0gcmVxdWlyZShcIi4uLy4uL3BhY2thZ2UuanNvblwiKTtcblxuY29uc3QgZGIgPSByZXF1aXJlKFwiLi4vbGliL2RiXCIpO1xuY29uc3QgY29uZmlnID0gcmVxdWlyZShcIi4uL2xpYi9jb25maWdcIik7XG5jb25zdCByZWFjdFZpZXdzID0gcmVxdWlyZShcIi4vcmVhY3Qtdmlld3MuanNcIik7XG5cbmNvbnN0IHJvb3RQYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLlwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoYXBwKSA9PiB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKGNvbmZpZy5OT0RFX0VOViAhPT0gXCJ0ZXN0XCIpIHtcbiAgICAgICAgLy8gQSBiYXNpYyBsb2dnZXIgZm9yIHRyYWNraW5nIHdobyBpcyBhY2Nlc3NpbmcgdGhlIHNlcnZpY2VcbiAgICAgICAgYXBwLnVzZShtb3JnYW4oXCJkZXZcIikpO1xuICAgIH1cblxuICAgIC8vIENvbmZpZ3VyZSBhbGwgdGhlIHBhdGhzIGZvciBzZXJ2aW5nIHRoZSBzdGF0aWMgY29udGVudCBvbiB0aGUgc2l0ZVxuICAgIGFwcC51c2Uoc2VydmVGYXZpY29uKGAke3Jvb3RQYXRofS9wdWJsaWMvaW1hZ2VzL2Zhdmljb24ucG5nYCkpO1xuICAgIGFwcC51c2Uoc2VydmVTdGF0aWMoYCR7cm9vdFBhdGh9L3B1YmxpY2ApKTtcbiAgICBhcHAudXNlKFwiL2RhdGFcIiwgc2VydmVTdGF0aWMoY29uZmlnLkJBU0VfREFUQV9ESVIpKTtcblxuICAgIC8vIENvbmZpZ3VyZSBob3cgdGhlIHZpZXdzIGFyZSBoYW5kbGVkICh3aXRoIFJlYWN0KVxuICAgIGFwcC5lbmdpbmUoXCJqc1wiLCByZWFjdFZpZXdzKTtcbiAgICBhcHAuc2V0KFwidmlld3NcIiwgYCR7cm9vdFBhdGh9L3ZpZXdzYCk7XG4gICAgYXBwLnNldChcInZpZXcgZW5naW5lXCIsIFwianNcIik7XG5cbiAgICAvLyBFbmFibGUgY2FjaGluZyBvZiB0aGUgdmlldyBmaWxlcyBieSBFeHByZXNzLCBidXQgb25seSBpbiBwcm9kdWN0aW9uXG4gICAgYXBwLnNldChcInZpZXcgY2FjaGVcIiwgY29uZmlnLk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIik7XG5cbiAgICAvLyBQYXJzZXMgdGhlIGNvbnRlbnRzIG9mIEhUVFAgUE9TVCBib2RpZXMsIGhhbmRsaW5nIFVSTC1lbmNvZGVkIGZvcm1zXG4gICAgLy8gYW5kIGFsc28gSlNPTiBibG9ic1xuICAgIGFwcC51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHtcbiAgICAgICAgZXh0ZW5kZWQ6IHRydWUsXG4gICAgfSkpO1xuXG4gICAgLy8gQWRkcyBpbiBzdXBwb3J0IGZvciBvdmVycmlkaW5nIEhUVFAgdmVyYnMgdG8gaGVscFxuICAgIC8vIGNsaWVudHMgc3VwcG9ydCBERUxFVEUgYW5kIFBVVFxuICAgIGFwcC51c2UobWV0aG9kT3ZlcnJpZGUoKSk7XG5cbiAgICAvLyBQYXJzZSBjb29raWVzLCB3aGljaCBhcmUgdGhlbiB1c2VkIGJ5IHRoZSBzZXNzaW9uXG4gICAgYXBwLnVzZShjb29raWVQYXJzZXIoKSk7XG5cbiAgICAvLyBUcmFjayB1c2VyIHNlc3Npb25zIGFuZCBzdG9yZSB0aGVtIGluIGEgTW9uZ29kYiBkYXRhIHN0b3JlXG4gICAgbGV0IHN0b3JlO1xuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKGNvbmZpZy5OT0RFX0VOViAhPT0gXCJ0ZXN0XCIpIHtcbiAgICAgICAgc3RvcmUgPSBuZXcgbW9uZ29TdG9yZSh7XG4gICAgICAgICAgICBtb25nb29zZUNvbm5lY3Rpb246IGRiLm1vbmdvb3NlLmNvbm5lY3Rpb24sXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiBcInNlc3Npb25zXCIsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFwcC51c2Uoc2Vzc2lvbih7XG4gICAgICAgIHJlc2F2ZTogZmFsc2UsXG4gICAgICAgIHNhdmVVbmluaXRpYWxpemVkOiBmYWxzZSxcbiAgICAgICAgc2VjcmV0OiBwa2cubmFtZSxcbiAgICAgICAgc3RvcmUsXG4gICAgfSkpO1xufTtcbiJdfQ==