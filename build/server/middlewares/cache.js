"use strict";

var config = require("../../lib/config");

// Utility method of setting the cache header on a request
// Used as a piece of Express middleware
module.exports = function (hours) {
    return function (req, res, next) {
        /* istanbul ignore if */
        if (config.NODE_ENV === "production") {
            res.setHeader("Cache-Control", "public, max-age=" + hours * 3600);
        }
        next();
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2ZXIvbWlkZGxld2FyZXMvY2FjaGUuanMiXSwibmFtZXMiOlsiY29uZmlnIiwicmVxdWlyZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJob3VycyIsInJlcSIsInJlcyIsIm5leHQiLCJOT0RFX0VOViIsInNldEhlYWRlciJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxTQUFTQyxRQUFRLGtCQUFSLENBQWY7O0FBRUE7QUFDQTtBQUNBQyxPQUFPQyxPQUFQLEdBQWlCLFVBQUNDLEtBQUQ7QUFBQSxXQUFXLFVBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFXQyxJQUFYLEVBQW9CO0FBQzVDO0FBQ0EsWUFBSVAsT0FBT1EsUUFBUCxLQUFvQixZQUF4QixFQUFzQztBQUNsQ0YsZ0JBQUlHLFNBQUosQ0FBYyxlQUFkLHVCQUFrREwsUUFBUSxJQUExRDtBQUNIO0FBQ0RHO0FBQ0gsS0FOZ0I7QUFBQSxDQUFqQiIsImZpbGUiOiJjYWNoZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGNvbmZpZyA9IHJlcXVpcmUoXCIuLi8uLi9saWIvY29uZmlnXCIpO1xuXG4vLyBVdGlsaXR5IG1ldGhvZCBvZiBzZXR0aW5nIHRoZSBjYWNoZSBoZWFkZXIgb24gYSByZXF1ZXN0XG4vLyBVc2VkIGFzIGEgcGllY2Ugb2YgRXhwcmVzcyBtaWRkbGV3YXJlXG5tb2R1bGUuZXhwb3J0cyA9IChob3VycykgPT4gKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKGNvbmZpZy5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgICAgcmVzLnNldEhlYWRlcihcIkNhY2hlLUNvbnRyb2xcIiwgYHB1YmxpYywgbWF4LWFnZT0ke2hvdXJzICogMzYwMH1gKTtcbiAgICB9XG4gICAgbmV4dCgpO1xufTtcbiJdfQ==