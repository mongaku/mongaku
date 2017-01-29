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