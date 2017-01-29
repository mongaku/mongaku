"use strict";

var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var models = require("../lib/models");

module.exports = function (app) {
    var User = models("User");

    // serialize sessions
    passport.serializeUser(function (user, callback) {
        return callback(null, user._id);
    });

    passport.deserializeUser(function (id, callback) {
        return User.findOne({ _id: id }, callback);
    });

    // use local strategy
    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, function (email, password, callback) {
        User.findOne({ email: email }, function (err, user) {
            /* istanbul ignore if */
            if (err) {
                return callback(err);
            }

            if (!user) {
                return callback(null, false, {
                    message: "Unknown user"
                });
            }

            if (!user.authenticate(password)) {
                return callback(null, false, {
                    message: "Invalid password"
                });
            }

            return callback(null, user);
        });
    }));

    // Initialize Passport and the Passport session, which allows users to
    // login to the site.
    app.use(passport.initialize());
    app.use(passport.session());
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2ZXIvcGFzc3BvcnQuanMiXSwibmFtZXMiOlsicGFzc3BvcnQiLCJyZXF1aXJlIiwiTG9jYWxTdHJhdGVneSIsIlN0cmF0ZWd5IiwibW9kZWxzIiwibW9kdWxlIiwiZXhwb3J0cyIsImFwcCIsIlVzZXIiLCJzZXJpYWxpemVVc2VyIiwidXNlciIsImNhbGxiYWNrIiwiX2lkIiwiZGVzZXJpYWxpemVVc2VyIiwiaWQiLCJmaW5kT25lIiwidXNlIiwidXNlcm5hbWVGaWVsZCIsInBhc3N3b3JkRmllbGQiLCJlbWFpbCIsInBhc3N3b3JkIiwiZXJyIiwibWVzc2FnZSIsImF1dGhlbnRpY2F0ZSIsImluaXRpYWxpemUiLCJzZXNzaW9uIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFdBQVdDLFFBQVEsVUFBUixDQUFqQjtBQUNBLElBQU1DLGdCQUFnQkQsUUFBUSxnQkFBUixFQUEwQkUsUUFBaEQ7O0FBRUEsSUFBTUMsU0FBU0gsUUFBUSxlQUFSLENBQWY7O0FBRUFJLE9BQU9DLE9BQVAsR0FBaUIsVUFBQ0MsR0FBRCxFQUFTO0FBQ3RCLFFBQU1DLE9BQU9KLE9BQU8sTUFBUCxDQUFiOztBQUVBO0FBQ0FKLGFBQVNTLGFBQVQsQ0FBdUIsVUFBQ0MsSUFBRCxFQUFPQyxRQUFQO0FBQUEsZUFBb0JBLFNBQVMsSUFBVCxFQUFlRCxLQUFLRSxHQUFwQixDQUFwQjtBQUFBLEtBQXZCOztBQUVBWixhQUFTYSxlQUFULENBQXlCLFVBQUNDLEVBQUQsRUFBS0gsUUFBTDtBQUFBLGVBQ3JCSCxLQUFLTyxPQUFMLENBQWEsRUFBQ0gsS0FBS0UsRUFBTixFQUFiLEVBQXdCSCxRQUF4QixDQURxQjtBQUFBLEtBQXpCOztBQUdBO0FBQ0FYLGFBQVNnQixHQUFULENBQWEsSUFBSWQsYUFBSixDQUNUO0FBQ0llLHVCQUFlLE9BRG5CO0FBRUlDLHVCQUFlO0FBRm5CLEtBRFMsRUFLVCxVQUFDQyxLQUFELEVBQVFDLFFBQVIsRUFBa0JULFFBQWxCLEVBQStCO0FBQzNCSCxhQUFLTyxPQUFMLENBQWEsRUFBQ0ksT0FBT0EsS0FBUixFQUFiLEVBQTZCLFVBQUNFLEdBQUQsRUFBTVgsSUFBTixFQUFlO0FBQ3hDO0FBQ0EsZ0JBQUlXLEdBQUosRUFBUztBQUNMLHVCQUFPVixTQUFTVSxHQUFULENBQVA7QUFDSDs7QUFFRCxnQkFBSSxDQUFDWCxJQUFMLEVBQVc7QUFDUCx1QkFBT0MsU0FBUyxJQUFULEVBQWUsS0FBZixFQUFzQjtBQUN6QlcsNkJBQVM7QUFEZ0IsaUJBQXRCLENBQVA7QUFHSDs7QUFFRCxnQkFBSSxDQUFDWixLQUFLYSxZQUFMLENBQWtCSCxRQUFsQixDQUFMLEVBQWtDO0FBQzlCLHVCQUFPVCxTQUFTLElBQVQsRUFBZSxLQUFmLEVBQXNCO0FBQ3pCVyw2QkFBUztBQURnQixpQkFBdEIsQ0FBUDtBQUdIOztBQUVELG1CQUFPWCxTQUFTLElBQVQsRUFBZUQsSUFBZixDQUFQO0FBQ0gsU0FuQkQ7QUFvQkgsS0ExQlEsQ0FBYjs7QUE2QkE7QUFDQTtBQUNBSCxRQUFJUyxHQUFKLENBQVFoQixTQUFTd0IsVUFBVCxFQUFSO0FBQ0FqQixRQUFJUyxHQUFKLENBQVFoQixTQUFTeUIsT0FBVCxFQUFSO0FBQ0gsQ0EzQ0QiLCJmaWxlIjoicGFzc3BvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBwYXNzcG9ydCA9IHJlcXVpcmUoXCJwYXNzcG9ydFwiKTtcbmNvbnN0IExvY2FsU3RyYXRlZ3kgPSByZXF1aXJlKFwicGFzc3BvcnQtbG9jYWxcIikuU3RyYXRlZ3k7XG5cbmNvbnN0IG1vZGVscyA9IHJlcXVpcmUoXCIuLi9saWIvbW9kZWxzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChhcHApID0+IHtcbiAgICBjb25zdCBVc2VyID0gbW9kZWxzKFwiVXNlclwiKTtcblxuICAgIC8vIHNlcmlhbGl6ZSBzZXNzaW9uc1xuICAgIHBhc3Nwb3J0LnNlcmlhbGl6ZVVzZXIoKHVzZXIsIGNhbGxiYWNrKSA9PiBjYWxsYmFjayhudWxsLCB1c2VyLl9pZCkpO1xuXG4gICAgcGFzc3BvcnQuZGVzZXJpYWxpemVVc2VyKChpZCwgY2FsbGJhY2spID0+XG4gICAgICAgIFVzZXIuZmluZE9uZSh7X2lkOiBpZH0sIGNhbGxiYWNrKSk7XG5cbiAgICAvLyB1c2UgbG9jYWwgc3RyYXRlZ3lcbiAgICBwYXNzcG9ydC51c2UobmV3IExvY2FsU3RyYXRlZ3koXG4gICAgICAgIHtcbiAgICAgICAgICAgIHVzZXJuYW1lRmllbGQ6IFwiZW1haWxcIixcbiAgICAgICAgICAgIHBhc3N3b3JkRmllbGQ6IFwicGFzc3dvcmRcIixcbiAgICAgICAgfSxcbiAgICAgICAgKGVtYWlsLCBwYXNzd29yZCwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgIFVzZXIuZmluZE9uZSh7ZW1haWw6IGVtYWlsfSwgKGVyciwgdXNlcikgPT4ge1xuICAgICAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBmYWxzZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJVbmtub3duIHVzZXJcIixcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCF1c2VyLmF1dGhlbnRpY2F0ZShwYXNzd29yZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIGZhbHNlLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkludmFsaWQgcGFzc3dvcmRcIixcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHVzZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICApKTtcblxuICAgIC8vIEluaXRpYWxpemUgUGFzc3BvcnQgYW5kIHRoZSBQYXNzcG9ydCBzZXNzaW9uLCB3aGljaCBhbGxvd3MgdXNlcnMgdG9cbiAgICAvLyBsb2dpbiB0byB0aGUgc2l0ZS5cbiAgICBhcHAudXNlKHBhc3Nwb3J0LmluaXRpYWxpemUoKSk7XG4gICAgYXBwLnVzZShwYXNzcG9ydC5zZXNzaW9uKCkpO1xufTtcbiJdfQ==