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