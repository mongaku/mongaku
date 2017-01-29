"use strict";

var rl = require("readline-sync");
var genPassword = require("password-generator");

var models = require("../lib/models");

module.exports = function (args, callback) {
    var email = rl.questionEMail("Email: ");
    var password = rl.question("Password [auto-gen]: ", {
        defaultInput: genPassword(),
        hideEchoBack: true
    });
    var source = rl.question("Source Admin [Optional, Source ID]: ");

    var User = models("User");
    var user = new User({
        email: email,
        password: password,
        sourceAdmin: source ? source.split(/,\s*/) : []
    });

    user.save(function (err) {
        if (err) {
            return callback(err);
        }

        console.log("User Created:");
        console.log("Email: " + email);
        console.log("Password: " + password);

        callback();
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jcmVhdGUtdXNlci5qcyJdLCJuYW1lcyI6WyJybCIsInJlcXVpcmUiLCJnZW5QYXNzd29yZCIsIm1vZGVscyIsIm1vZHVsZSIsImV4cG9ydHMiLCJhcmdzIiwiY2FsbGJhY2siLCJlbWFpbCIsInF1ZXN0aW9uRU1haWwiLCJwYXNzd29yZCIsInF1ZXN0aW9uIiwiZGVmYXVsdElucHV0IiwiaGlkZUVjaG9CYWNrIiwic291cmNlIiwiVXNlciIsInVzZXIiLCJzb3VyY2VBZG1pbiIsInNwbGl0Iiwic2F2ZSIsImVyciIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsS0FBS0MsUUFBUSxlQUFSLENBQVg7QUFDQSxJQUFNQyxjQUFjRCxRQUFRLG9CQUFSLENBQXBCOztBQUVBLElBQU1FLFNBQVNGLFFBQVEsZUFBUixDQUFmOztBQUVBRyxPQUFPQyxPQUFQLEdBQWlCLFVBQUNDLElBQUQsRUFBT0MsUUFBUCxFQUFvQjtBQUNqQyxRQUFNQyxRQUFRUixHQUFHUyxhQUFILENBQWlCLFNBQWpCLENBQWQ7QUFDQSxRQUFNQyxXQUFXVixHQUFHVyxRQUFILENBQVksdUJBQVosRUFBcUM7QUFDbERDLHNCQUFjVixhQURvQztBQUVsRFcsc0JBQWM7QUFGb0MsS0FBckMsQ0FBakI7QUFJQSxRQUFNQyxTQUFTZCxHQUFHVyxRQUFILENBQVksc0NBQVosQ0FBZjs7QUFFQSxRQUFNSSxPQUFPWixPQUFPLE1BQVAsQ0FBYjtBQUNBLFFBQU1hLE9BQU8sSUFBSUQsSUFBSixDQUFTO0FBQ2xCUCxvQkFEa0I7QUFFbEJFLDBCQUZrQjtBQUdsQk8scUJBQWFILFNBQVNBLE9BQU9JLEtBQVAsQ0FBYSxNQUFiLENBQVQsR0FBZ0M7QUFIM0IsS0FBVCxDQUFiOztBQU1BRixTQUFLRyxJQUFMLENBQVUsVUFBQ0MsR0FBRCxFQUFTO0FBQ2YsWUFBSUEsR0FBSixFQUFTO0FBQ0wsbUJBQU9iLFNBQVNhLEdBQVQsQ0FBUDtBQUNIOztBQUVEQyxnQkFBUUMsR0FBUixDQUFZLGVBQVo7QUFDQUQsZ0JBQVFDLEdBQVIsYUFBc0JkLEtBQXRCO0FBQ0FhLGdCQUFRQyxHQUFSLGdCQUF5QlosUUFBekI7O0FBRUFIO0FBQ0gsS0FWRDtBQVdILENBMUJEIiwiZmlsZSI6ImNyZWF0ZS11c2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcmwgPSByZXF1aXJlKFwicmVhZGxpbmUtc3luY1wiKTtcbmNvbnN0IGdlblBhc3N3b3JkID0gcmVxdWlyZShcInBhc3N3b3JkLWdlbmVyYXRvclwiKTtcblxuY29uc3QgbW9kZWxzID0gcmVxdWlyZShcIi4uL2xpYi9tb2RlbHNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gKGFyZ3MsIGNhbGxiYWNrKSA9PiB7XG4gICAgY29uc3QgZW1haWwgPSBybC5xdWVzdGlvbkVNYWlsKFwiRW1haWw6IFwiKTtcbiAgICBjb25zdCBwYXNzd29yZCA9IHJsLnF1ZXN0aW9uKFwiUGFzc3dvcmQgW2F1dG8tZ2VuXTogXCIsIHtcbiAgICAgICAgZGVmYXVsdElucHV0OiBnZW5QYXNzd29yZCgpLFxuICAgICAgICBoaWRlRWNob0JhY2s6IHRydWUsXG4gICAgfSk7XG4gICAgY29uc3Qgc291cmNlID0gcmwucXVlc3Rpb24oXCJTb3VyY2UgQWRtaW4gW09wdGlvbmFsLCBTb3VyY2UgSURdOiBcIik7XG5cbiAgICBjb25zdCBVc2VyID0gbW9kZWxzKFwiVXNlclwiKTtcbiAgICBjb25zdCB1c2VyID0gbmV3IFVzZXIoe1xuICAgICAgICBlbWFpbCxcbiAgICAgICAgcGFzc3dvcmQsXG4gICAgICAgIHNvdXJjZUFkbWluOiBzb3VyY2UgPyBzb3VyY2Uuc3BsaXQoLyxcXHMqLykgOiBbXSxcbiAgICB9KTtcblxuICAgIHVzZXIuc2F2ZSgoZXJyKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJVc2VyIENyZWF0ZWQ6XCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhgRW1haWw6ICR7ZW1haWx9YCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGBQYXNzd29yZDogJHtwYXNzd29yZH1gKTtcblxuICAgICAgICBjYWxsYmFjaygpO1xuICAgIH0pO1xufTtcbiJdfQ==