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

    var User = models("User");
    var user = new User({
        email: email,
        password: password,
        siteAdmin: true
    });

    user.save(function (err) {
        if (err) {
            return callback(err);
        }

        console.log("Admin User Created:");
        console.log("Email: " + email);
        console.log("Password: " + password);

        callback();
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jcmVhdGUtYWRtaW4uanMiXSwibmFtZXMiOlsicmwiLCJyZXF1aXJlIiwiZ2VuUGFzc3dvcmQiLCJtb2RlbHMiLCJtb2R1bGUiLCJleHBvcnRzIiwiYXJncyIsImNhbGxiYWNrIiwiZW1haWwiLCJxdWVzdGlvbkVNYWlsIiwicGFzc3dvcmQiLCJxdWVzdGlvbiIsImRlZmF1bHRJbnB1dCIsImhpZGVFY2hvQmFjayIsIlVzZXIiLCJ1c2VyIiwic2l0ZUFkbWluIiwic2F2ZSIsImVyciIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsS0FBS0MsUUFBUSxlQUFSLENBQVg7QUFDQSxJQUFNQyxjQUFjRCxRQUFRLG9CQUFSLENBQXBCOztBQUVBLElBQU1FLFNBQVNGLFFBQVEsZUFBUixDQUFmOztBQUVBRyxPQUFPQyxPQUFQLEdBQWlCLFVBQUNDLElBQUQsRUFBT0MsUUFBUCxFQUFvQjtBQUNqQyxRQUFNQyxRQUFRUixHQUFHUyxhQUFILENBQWlCLFNBQWpCLENBQWQ7QUFDQSxRQUFNQyxXQUFXVixHQUFHVyxRQUFILENBQVksdUJBQVosRUFBcUM7QUFDbERDLHNCQUFjVixhQURvQztBQUVsRFcsc0JBQWM7QUFGb0MsS0FBckMsQ0FBakI7O0FBS0EsUUFBTUMsT0FBT1gsT0FBTyxNQUFQLENBQWI7QUFDQSxRQUFNWSxPQUFPLElBQUlELElBQUosQ0FBUztBQUNsQk4sb0JBRGtCO0FBRWxCRSwwQkFGa0I7QUFHbEJNLG1CQUFXO0FBSE8sS0FBVCxDQUFiOztBQU1BRCxTQUFLRSxJQUFMLENBQVUsVUFBQ0MsR0FBRCxFQUFTO0FBQ2YsWUFBSUEsR0FBSixFQUFTO0FBQ0wsbUJBQU9YLFNBQVNXLEdBQVQsQ0FBUDtBQUNIOztBQUVEQyxnQkFBUUMsR0FBUixDQUFZLHFCQUFaO0FBQ0FELGdCQUFRQyxHQUFSLGFBQXNCWixLQUF0QjtBQUNBVyxnQkFBUUMsR0FBUixnQkFBeUJWLFFBQXpCOztBQUVBSDtBQUNILEtBVkQ7QUFXSCxDQXpCRCIsImZpbGUiOiJjcmVhdGUtYWRtaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBybCA9IHJlcXVpcmUoXCJyZWFkbGluZS1zeW5jXCIpO1xuY29uc3QgZ2VuUGFzc3dvcmQgPSByZXF1aXJlKFwicGFzc3dvcmQtZ2VuZXJhdG9yXCIpO1xuXG5jb25zdCBtb2RlbHMgPSByZXF1aXJlKFwiLi4vbGliL21vZGVsc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoYXJncywgY2FsbGJhY2spID0+IHtcbiAgICBjb25zdCBlbWFpbCA9IHJsLnF1ZXN0aW9uRU1haWwoXCJFbWFpbDogXCIpO1xuICAgIGNvbnN0IHBhc3N3b3JkID0gcmwucXVlc3Rpb24oXCJQYXNzd29yZCBbYXV0by1nZW5dOiBcIiwge1xuICAgICAgICBkZWZhdWx0SW5wdXQ6IGdlblBhc3N3b3JkKCksXG4gICAgICAgIGhpZGVFY2hvQmFjazogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IFVzZXIgPSBtb2RlbHMoXCJVc2VyXCIpO1xuICAgIGNvbnN0IHVzZXIgPSBuZXcgVXNlcih7XG4gICAgICAgIGVtYWlsLFxuICAgICAgICBwYXNzd29yZCxcbiAgICAgICAgc2l0ZUFkbWluOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgdXNlci5zYXZlKChlcnIpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhcIkFkbWluIFVzZXIgQ3JlYXRlZDpcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKGBFbWFpbDogJHtlbWFpbH1gKTtcbiAgICAgICAgY29uc29sZS5sb2coYFBhc3N3b3JkOiAke3Bhc3N3b3JkfWApO1xuXG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgfSk7XG59O1xuIl19