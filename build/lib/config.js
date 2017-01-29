"use strict";

var fs = require("fs");
var path = require("path");

var dotenv = require("dotenv");

var required = ["MONGODB_URL", "ELASTICSEARCH_URL", "PASTEC_URL"];

var config = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: "3000",

    MONGODB_URL: "mongodb://localhost/mongaku",
    ELASTICSEARCH_URL: "http://127.0.0.1:9200",
    PASTEC_URL: "localhost:4212",

    BASE_URL: "",
    BASE_DATA_URL: "/data",
    BASE_DATA_DIR: "data",

    GM_PATH: ""
};

/* istanbul ignore if */
if (config.NODE_ENV !== "test") {
    // Load in configuration options
    dotenv.config({
        path: path.resolve(process.cwd(), ".mongaku"),
        silent: true
    });
}

for (var envName in config) {
    if (envName in process.env) {
        config[envName] = process.env[envName];
    }
}

// Resolve the base data directory relative to the current working directory
// This allows for the configuration to use a relative path
config.BASE_DATA_DIR = path.resolve(process.cwd(), config.BASE_DATA_DIR);

if (config.NODE_ENV !== "test") {
    try {
        fs.statSync(config.BASE_DATA_DIR).isDirectory();
    } catch (e) {
        console.error(config.BASE_DATA_DIR + " does not exist.");
        process.exit(1);
    }
}

/* istanbul ignore if */
if (config.NODE_ENV !== "test") {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = required[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _envName = _step.value;

            if (!config[_envName]) {
                console.error("ENV " + _envName + " not specified.");
                process.exit(1);
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
}

module.exports = config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvY29uZmlnLmpzIl0sIm5hbWVzIjpbImZzIiwicmVxdWlyZSIsInBhdGgiLCJkb3RlbnYiLCJyZXF1aXJlZCIsImNvbmZpZyIsIk5PREVfRU5WIiwicHJvY2VzcyIsImVudiIsIlBPUlQiLCJNT05HT0RCX1VSTCIsIkVMQVNUSUNTRUFSQ0hfVVJMIiwiUEFTVEVDX1VSTCIsIkJBU0VfVVJMIiwiQkFTRV9EQVRBX1VSTCIsIkJBU0VfREFUQV9ESVIiLCJHTV9QQVRIIiwicmVzb2x2ZSIsImN3ZCIsInNpbGVudCIsImVudk5hbWUiLCJzdGF0U3luYyIsImlzRGlyZWN0b3J5IiwiZSIsImNvbnNvbGUiLCJlcnJvciIsImV4aXQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLEtBQUtDLFFBQVEsSUFBUixDQUFYO0FBQ0EsSUFBTUMsT0FBT0QsUUFBUSxNQUFSLENBQWI7O0FBRUEsSUFBTUUsU0FBU0YsUUFBUSxRQUFSLENBQWY7O0FBRUEsSUFBTUcsV0FBVyxDQUNiLGFBRGEsRUFFYixtQkFGYSxFQUdiLFlBSGEsQ0FBakI7O0FBTUEsSUFBTUMsU0FBUztBQUNYQyxjQUFVQyxRQUFRQyxHQUFSLENBQVlGLFFBRFg7QUFFWEcsVUFBTSxNQUZLOztBQUlYQyxpQkFBYSw2QkFKRjtBQUtYQyx1QkFBbUIsdUJBTFI7QUFNWEMsZ0JBQVksZ0JBTkQ7O0FBUVhDLGNBQVUsRUFSQztBQVNYQyxtQkFBZSxPQVRKO0FBVVhDLG1CQUFlLE1BVko7O0FBWVhDLGFBQVM7QUFaRSxDQUFmOztBQWVBO0FBQ0EsSUFBSVgsT0FBT0MsUUFBUCxLQUFvQixNQUF4QixFQUFnQztBQUM1QjtBQUNBSCxXQUFPRSxNQUFQLENBQWM7QUFDVkgsY0FBTUEsS0FBS2UsT0FBTCxDQUFhVixRQUFRVyxHQUFSLEVBQWIsRUFBNEIsVUFBNUIsQ0FESTtBQUVWQyxnQkFBUTtBQUZFLEtBQWQ7QUFJSDs7QUFFRCxLQUFLLElBQU1DLE9BQVgsSUFBc0JmLE1BQXRCLEVBQThCO0FBQzFCLFFBQUllLFdBQVdiLFFBQVFDLEdBQXZCLEVBQTRCO0FBQ3hCSCxlQUFPZSxPQUFQLElBQWtCYixRQUFRQyxHQUFSLENBQVlZLE9BQVosQ0FBbEI7QUFDSDtBQUNKOztBQUVEO0FBQ0E7QUFDQWYsT0FBT1UsYUFBUCxHQUF1QmIsS0FBS2UsT0FBTCxDQUFhVixRQUFRVyxHQUFSLEVBQWIsRUFBNEJiLE9BQU9VLGFBQW5DLENBQXZCOztBQUVBLElBQUlWLE9BQU9DLFFBQVAsS0FBb0IsTUFBeEIsRUFBZ0M7QUFDNUIsUUFBSTtBQUNBTixXQUFHcUIsUUFBSCxDQUFZaEIsT0FBT1UsYUFBbkIsRUFBa0NPLFdBQWxDO0FBRUgsS0FIRCxDQUdFLE9BQU9DLENBQVAsRUFBVTtBQUNSQyxnQkFBUUMsS0FBUixDQUFpQnBCLE9BQU9VLGFBQXhCO0FBQ0FSLGdCQUFRbUIsSUFBUixDQUFhLENBQWI7QUFDSDtBQUNKOztBQUVEO0FBQ0EsSUFBSXJCLE9BQU9DLFFBQVAsS0FBb0IsTUFBeEIsRUFBZ0M7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDNUIsNkJBQXNCRixRQUF0Qiw4SEFBZ0M7QUFBQSxnQkFBckJnQixRQUFxQjs7QUFDNUIsZ0JBQUksQ0FBQ2YsT0FBT2UsUUFBUCxDQUFMLEVBQXNCO0FBQ2xCSSx3QkFBUUMsS0FBUixVQUFxQkwsUUFBckI7QUFDQWIsd0JBQVFtQixJQUFSLENBQWEsQ0FBYjtBQUNIO0FBQ0o7QUFOMkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU8vQjs7QUFFREMsT0FBT0MsT0FBUCxHQUFpQnZCLE1BQWpCIiwiZmlsZSI6ImNvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGZzID0gcmVxdWlyZShcImZzXCIpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuXG5jb25zdCBkb3RlbnYgPSByZXF1aXJlKFwiZG90ZW52XCIpO1xuXG5jb25zdCByZXF1aXJlZCA9IFtcbiAgICBcIk1PTkdPREJfVVJMXCIsXG4gICAgXCJFTEFTVElDU0VBUkNIX1VSTFwiLFxuICAgIFwiUEFTVEVDX1VSTFwiLFxuXTtcblxuY29uc3QgY29uZmlnID0ge1xuICAgIE5PREVfRU5WOiBwcm9jZXNzLmVudi5OT0RFX0VOVixcbiAgICBQT1JUOiBcIjMwMDBcIixcblxuICAgIE1PTkdPREJfVVJMOiBcIm1vbmdvZGI6Ly9sb2NhbGhvc3QvbW9uZ2FrdVwiLFxuICAgIEVMQVNUSUNTRUFSQ0hfVVJMOiBcImh0dHA6Ly8xMjcuMC4wLjE6OTIwMFwiLFxuICAgIFBBU1RFQ19VUkw6IFwibG9jYWxob3N0OjQyMTJcIixcblxuICAgIEJBU0VfVVJMOiBcIlwiLFxuICAgIEJBU0VfREFUQV9VUkw6IFwiL2RhdGFcIixcbiAgICBCQVNFX0RBVEFfRElSOiBcImRhdGFcIixcblxuICAgIEdNX1BBVEg6IFwiXCIsXG59O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbmlmIChjb25maWcuTk9ERV9FTlYgIT09IFwidGVzdFwiKSB7XG4gICAgLy8gTG9hZCBpbiBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgICBkb3RlbnYuY29uZmlnKHtcbiAgICAgICAgcGF0aDogcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIFwiLm1vbmdha3VcIiksXG4gICAgICAgIHNpbGVudDogdHJ1ZSxcbiAgICB9KTtcbn1cblxuZm9yIChjb25zdCBlbnZOYW1lIGluIGNvbmZpZykge1xuICAgIGlmIChlbnZOYW1lIGluIHByb2Nlc3MuZW52KSB7XG4gICAgICAgIGNvbmZpZ1tlbnZOYW1lXSA9IHByb2Nlc3MuZW52W2Vudk5hbWVdO1xuICAgIH1cbn1cblxuLy8gUmVzb2x2ZSB0aGUgYmFzZSBkYXRhIGRpcmVjdG9yeSByZWxhdGl2ZSB0byB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeVxuLy8gVGhpcyBhbGxvd3MgZm9yIHRoZSBjb25maWd1cmF0aW9uIHRvIHVzZSBhIHJlbGF0aXZlIHBhdGhcbmNvbmZpZy5CQVNFX0RBVEFfRElSID0gcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIGNvbmZpZy5CQVNFX0RBVEFfRElSKTtcblxuaWYgKGNvbmZpZy5OT0RFX0VOViAhPT0gXCJ0ZXN0XCIpIHtcbiAgICB0cnkge1xuICAgICAgICBmcy5zdGF0U3luYyhjb25maWcuQkFTRV9EQVRBX0RJUikuaXNEaXJlY3RvcnkoKTtcblxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgJHtjb25maWcuQkFTRV9EQVRBX0RJUn0gZG9lcyBub3QgZXhpc3QuYCk7XG4gICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICB9XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuaWYgKGNvbmZpZy5OT0RFX0VOViAhPT0gXCJ0ZXN0XCIpIHtcbiAgICBmb3IgKGNvbnN0IGVudk5hbWUgb2YgcmVxdWlyZWQpIHtcbiAgICAgICAgaWYgKCFjb25maWdbZW52TmFtZV0pIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEVOViAke2Vudk5hbWV9IG5vdCBzcGVjaWZpZWQuYCk7XG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29uZmlnO1xuIl19