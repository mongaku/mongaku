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