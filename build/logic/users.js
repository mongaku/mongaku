"use strict";

var passport = require("passport");

var urls = require("../lib/urls");

module.exports = function (app) {
    return {
        login: function login(req, res) {
            res.render("Login", {});
        },
        loginRedirect: function loginRedirect(req, res, next) {
            passport.authenticate("local", function (err, user) {
                if (!user) {
                    return res.redirect(urls.gen(req.lang, "/login"));
                }

                req.login(user, function () {
                    var redirectTo = req.session.redirectTo || urls.gen(req.lang, "/");
                    delete req.session.redirectTo;
                    res.redirect(redirectTo);
                });
            })(req, res, next);
        },
        logout: function logout(req, res) {
            req.logout();
            res.redirect(urls.gen(req.lang, "/"));
        },
        routes: function routes() {
            app.get("/login", this.login);
            app.post("/login", this.loginRedirect);
            app.get("/logout", this.logout);
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sb2dpYy91c2Vycy5qcyJdLCJuYW1lcyI6WyJwYXNzcG9ydCIsInJlcXVpcmUiLCJ1cmxzIiwibW9kdWxlIiwiZXhwb3J0cyIsImFwcCIsImxvZ2luIiwicmVxIiwicmVzIiwicmVuZGVyIiwibG9naW5SZWRpcmVjdCIsIm5leHQiLCJhdXRoZW50aWNhdGUiLCJlcnIiLCJ1c2VyIiwicmVkaXJlY3QiLCJnZW4iLCJsYW5nIiwicmVkaXJlY3RUbyIsInNlc3Npb24iLCJsb2dvdXQiLCJyb3V0ZXMiLCJnZXQiLCJwb3N0Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFdBQVdDLFFBQVEsVUFBUixDQUFqQjs7QUFFQSxJQUFNQyxPQUFPRCxRQUFRLGFBQVIsQ0FBYjs7QUFFQUUsT0FBT0MsT0FBUCxHQUFpQixVQUFDQyxHQUFELEVBQVM7QUFDdEIsV0FBTztBQUNIQyxhQURHLGlCQUNHQyxHQURILEVBQ1FDLEdBRFIsRUFDYTtBQUNaQSxnQkFBSUMsTUFBSixDQUFXLE9BQVgsRUFBb0IsRUFBcEI7QUFDSCxTQUhFO0FBS0hDLHFCQUxHLHlCQUtXSCxHQUxYLEVBS2dCQyxHQUxoQixFQUtxQkcsSUFMckIsRUFLMkI7QUFDMUJYLHFCQUFTWSxZQUFULENBQXNCLE9BQXRCLEVBQStCLFVBQUNDLEdBQUQsRUFBTUMsSUFBTixFQUFlO0FBQzFDLG9CQUFJLENBQUNBLElBQUwsRUFBVztBQUNQLDJCQUFPTixJQUFJTyxRQUFKLENBQWFiLEtBQUtjLEdBQUwsQ0FBU1QsSUFBSVUsSUFBYixFQUFtQixRQUFuQixDQUFiLENBQVA7QUFDSDs7QUFFRFYsb0JBQUlELEtBQUosQ0FBVVEsSUFBVixFQUFnQixZQUFNO0FBQ2xCLHdCQUFNSSxhQUFhWCxJQUFJWSxPQUFKLENBQVlELFVBQVosSUFDZmhCLEtBQUtjLEdBQUwsQ0FBU1QsSUFBSVUsSUFBYixFQUFtQixHQUFuQixDQURKO0FBRUEsMkJBQU9WLElBQUlZLE9BQUosQ0FBWUQsVUFBbkI7QUFDQVYsd0JBQUlPLFFBQUosQ0FBYUcsVUFBYjtBQUNILGlCQUxEO0FBTUgsYUFYRCxFQVdHWCxHQVhILEVBV1FDLEdBWFIsRUFXYUcsSUFYYjtBQVlILFNBbEJFO0FBb0JIUyxjQXBCRyxrQkFvQkliLEdBcEJKLEVBb0JTQyxHQXBCVCxFQW9CYztBQUNiRCxnQkFBSWEsTUFBSjtBQUNBWixnQkFBSU8sUUFBSixDQUFhYixLQUFLYyxHQUFMLENBQVNULElBQUlVLElBQWIsRUFBbUIsR0FBbkIsQ0FBYjtBQUNILFNBdkJFO0FBeUJISSxjQXpCRyxvQkF5Qk07QUFDTGhCLGdCQUFJaUIsR0FBSixDQUFRLFFBQVIsRUFBa0IsS0FBS2hCLEtBQXZCO0FBQ0FELGdCQUFJa0IsSUFBSixDQUFTLFFBQVQsRUFBbUIsS0FBS2IsYUFBeEI7QUFDQUwsZ0JBQUlpQixHQUFKLENBQVEsU0FBUixFQUFtQixLQUFLRixNQUF4QjtBQUNIO0FBN0JFLEtBQVA7QUErQkgsQ0FoQ0QiLCJmaWxlIjoidXNlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBwYXNzcG9ydCA9IHJlcXVpcmUoXCJwYXNzcG9ydFwiKTtcblxuY29uc3QgdXJscyA9IHJlcXVpcmUoXCIuLi9saWIvdXJsc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoYXBwKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbG9naW4ocmVxLCByZXMpIHtcbiAgICAgICAgICAgIHJlcy5yZW5kZXIoXCJMb2dpblwiLCB7fSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9naW5SZWRpcmVjdChyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICAgICAgcGFzc3BvcnQuYXV0aGVudGljYXRlKFwibG9jYWxcIiwgKGVyciwgdXNlcikgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdXNlcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnJlZGlyZWN0KHVybHMuZ2VuKHJlcS5sYW5nLCBcIi9sb2dpblwiKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVxLmxvZ2luKHVzZXIsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVkaXJlY3RUbyA9IHJlcS5zZXNzaW9uLnJlZGlyZWN0VG8gfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybHMuZ2VuKHJlcS5sYW5nLCBcIi9cIik7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSByZXEuc2Vzc2lvbi5yZWRpcmVjdFRvO1xuICAgICAgICAgICAgICAgICAgICByZXMucmVkaXJlY3QocmVkaXJlY3RUbyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KShyZXEsIHJlcywgbmV4dCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9nb3V0KHJlcSwgcmVzKSB7XG4gICAgICAgICAgICByZXEubG9nb3V0KCk7XG4gICAgICAgICAgICByZXMucmVkaXJlY3QodXJscy5nZW4ocmVxLmxhbmcsIFwiL1wiKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcm91dGVzKCkge1xuICAgICAgICAgICAgYXBwLmdldChcIi9sb2dpblwiLCB0aGlzLmxvZ2luKTtcbiAgICAgICAgICAgIGFwcC5wb3N0KFwiL2xvZ2luXCIsIHRoaXMubG9naW5SZWRpcmVjdCk7XG4gICAgICAgICAgICBhcHAuZ2V0KFwiL2xvZ291dFwiLCB0aGlzLmxvZ291dCk7XG4gICAgICAgIH0sXG4gICAgfTtcbn07XG4iXX0=