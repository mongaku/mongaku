"use strict";

var fs = require("fs");
var path = require("path");

var options = require("../lib/options");

var basePath = path.resolve(__dirname, "../logic/");

module.exports = function (app) {
    if (options.authRequired) {
        (function () {
            var auth = require(path.join(basePath, "shared", "auth.js"));

            app.use(function (req, res, next) {
                var url = req.path;

                if (url === "/login" || url === "/logout") {
                    return next();
                }

                auth(req, res, next);
            });
        })();
    }

    // Import all the logic routes
    fs.readdirSync(basePath).forEach(function (file) {
        if (file.endsWith(".js")) {
            var logic = require(path.resolve(basePath, file))(app);
            logic.routes();
        }
    });

    // Enable error handling and displaying of a 500 error page
    // when an exception is thrown
    app.use(function (err, req, res, next) {
        /* istanbul ignore else */
        if (err) {
            res.status(500).render("Error", {
                title: err.message,
                body: err.stack
            });
        } else {
            next();
        }
    });

    // Handle missing pages
    app.use(function (req, res) {
        res.status(404).render("Error", {
            title: req.gettext("Page Not Found")
        });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2ZXIvcm91dGVzLmpzIl0sIm5hbWVzIjpbImZzIiwicmVxdWlyZSIsInBhdGgiLCJvcHRpb25zIiwiYmFzZVBhdGgiLCJyZXNvbHZlIiwiX19kaXJuYW1lIiwibW9kdWxlIiwiZXhwb3J0cyIsImFwcCIsImF1dGhSZXF1aXJlZCIsImF1dGgiLCJqb2luIiwidXNlIiwicmVxIiwicmVzIiwibmV4dCIsInVybCIsInJlYWRkaXJTeW5jIiwiZm9yRWFjaCIsImZpbGUiLCJlbmRzV2l0aCIsImxvZ2ljIiwicm91dGVzIiwiZXJyIiwic3RhdHVzIiwicmVuZGVyIiwidGl0bGUiLCJtZXNzYWdlIiwiYm9keSIsInN0YWNrIiwiZ2V0dGV4dCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxLQUFLQyxRQUFRLElBQVIsQ0FBWDtBQUNBLElBQU1DLE9BQU9ELFFBQVEsTUFBUixDQUFiOztBQUVBLElBQU1FLFVBQVVGLFFBQVEsZ0JBQVIsQ0FBaEI7O0FBRUEsSUFBTUcsV0FBV0YsS0FBS0csT0FBTCxDQUFhQyxTQUFiLEVBQXdCLFdBQXhCLENBQWpCOztBQUVBQyxPQUFPQyxPQUFQLEdBQWlCLFVBQVNDLEdBQVQsRUFBYztBQUMzQixRQUFJTixRQUFRTyxZQUFaLEVBQTBCO0FBQUE7QUFDdEIsZ0JBQU1DLE9BQU9WLFFBQVFDLEtBQUtVLElBQUwsQ0FBVVIsUUFBVixFQUFvQixRQUFwQixFQUE4QixTQUE5QixDQUFSLENBQWI7O0FBRUFLLGdCQUFJSSxHQUFKLENBQVEsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVdDLElBQVgsRUFBb0I7QUFDeEIsb0JBQU1DLE1BQU1ILElBQUlaLElBQWhCOztBQUVBLG9CQUFJZSxRQUFRLFFBQVIsSUFBb0JBLFFBQVEsU0FBaEMsRUFBMkM7QUFDdkMsMkJBQU9ELE1BQVA7QUFDSDs7QUFFREwscUJBQUtHLEdBQUwsRUFBVUMsR0FBVixFQUFlQyxJQUFmO0FBQ0gsYUFSRDtBQUhzQjtBQVl6Qjs7QUFFRDtBQUNBaEIsT0FBR2tCLFdBQUgsQ0FBZWQsUUFBZixFQUF5QmUsT0FBekIsQ0FBaUMsVUFBQ0MsSUFBRCxFQUFVO0FBQ3ZDLFlBQUlBLEtBQUtDLFFBQUwsQ0FBYyxLQUFkLENBQUosRUFBMEI7QUFDdEIsZ0JBQU1DLFFBQVFyQixRQUFRQyxLQUFLRyxPQUFMLENBQWFELFFBQWIsRUFBdUJnQixJQUF2QixDQUFSLEVBQXNDWCxHQUF0QyxDQUFkO0FBQ0FhLGtCQUFNQyxNQUFOO0FBQ0g7QUFDSixLQUxEOztBQU9BO0FBQ0E7QUFDQWQsUUFBSUksR0FBSixDQUFRLFVBQUNXLEdBQUQsRUFBTVYsR0FBTixFQUFXQyxHQUFYLEVBQWdCQyxJQUFoQixFQUF5QjtBQUM3QjtBQUNBLFlBQUlRLEdBQUosRUFBUztBQUNMVCxnQkFBSVUsTUFBSixDQUFXLEdBQVgsRUFBZ0JDLE1BQWhCLENBQXVCLE9BQXZCLEVBQWdDO0FBQzVCQyx1QkFBT0gsSUFBSUksT0FEaUI7QUFFNUJDLHNCQUFNTCxJQUFJTTtBQUZrQixhQUFoQztBQUlILFNBTEQsTUFLTztBQUNIZDtBQUNIO0FBQ0osS0FWRDs7QUFZQTtBQUNBUCxRQUFJSSxHQUFKLENBQVEsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQWM7QUFDbEJBLFlBQUlVLE1BQUosQ0FBVyxHQUFYLEVBQWdCQyxNQUFoQixDQUF1QixPQUF2QixFQUFnQztBQUM1QkMsbUJBQU9iLElBQUlpQixPQUFKLENBQVksZ0JBQVo7QUFEcUIsU0FBaEM7QUFHSCxLQUpEO0FBS0gsQ0EzQ0QiLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZnMgPSByZXF1aXJlKFwiZnNcIik7XG5jb25zdCBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XG5cbmNvbnN0IG9wdGlvbnMgPSByZXF1aXJlKFwiLi4vbGliL29wdGlvbnNcIik7XG5cbmNvbnN0IGJhc2VQYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLi9sb2dpYy9cIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXBwKSB7XG4gICAgaWYgKG9wdGlvbnMuYXV0aFJlcXVpcmVkKSB7XG4gICAgICAgIGNvbnN0IGF1dGggPSByZXF1aXJlKHBhdGguam9pbihiYXNlUGF0aCwgXCJzaGFyZWRcIiwgXCJhdXRoLmpzXCIpKTtcblxuICAgICAgICBhcHAudXNlKChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdXJsID0gcmVxLnBhdGg7XG5cbiAgICAgICAgICAgIGlmICh1cmwgPT09IFwiL2xvZ2luXCIgfHwgdXJsID09PSBcIi9sb2dvdXRcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF1dGgocmVxLCByZXMsIG5leHQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBJbXBvcnQgYWxsIHRoZSBsb2dpYyByb3V0ZXNcbiAgICBmcy5yZWFkZGlyU3luYyhiYXNlUGF0aCkuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgICBpZiAoZmlsZS5lbmRzV2l0aChcIi5qc1wiKSkge1xuICAgICAgICAgICAgY29uc3QgbG9naWMgPSByZXF1aXJlKHBhdGgucmVzb2x2ZShiYXNlUGF0aCwgZmlsZSkpKGFwcCk7XG4gICAgICAgICAgICBsb2dpYy5yb3V0ZXMoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gRW5hYmxlIGVycm9yIGhhbmRsaW5nIGFuZCBkaXNwbGF5aW5nIG9mIGEgNTAwIGVycm9yIHBhZ2VcbiAgICAvLyB3aGVuIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd25cbiAgICBhcHAudXNlKChlcnIsIHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5yZW5kZXIoXCJFcnJvclwiLCB7XG4gICAgICAgICAgICAgICAgdGl0bGU6IGVyci5tZXNzYWdlLFxuICAgICAgICAgICAgICAgIGJvZHk6IGVyci5zdGFjayxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBIYW5kbGUgbWlzc2luZyBwYWdlc1xuICAgIGFwcC51c2UoKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIHJlcy5zdGF0dXMoNDA0KS5yZW5kZXIoXCJFcnJvclwiLCB7XG4gICAgICAgICAgICB0aXRsZTogcmVxLmdldHRleHQoXCJQYWdlIE5vdCBGb3VuZFwiKSxcbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuIl19