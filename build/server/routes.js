"use strict";

const fs = require("fs");
const path = require("path");

const options = require("../lib/options");

const basePath = path.resolve(__dirname, "../logic/");

module.exports = function (app) {
    if (options.authRequired) {
        const auth = require(path.join(basePath, "shared", "auth.js"));

        app.use((req, res, next) => {
            const { path } = req;

            if (path === "/login" || path === "/logout") {
                return next();
            }

            auth(req, res, next);
        });
    }

    // Import all the logic routes
    fs.readdirSync(basePath).forEach(file => {
        if (file.endsWith(".js")) {
            const logic = require(path.resolve(basePath, file))(app);
            logic.routes();
        }
    });

    // Enable error handling and displaying of a 500 error page
    // when an exception is thrown
    app.use((err, req, res, next) => {
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
    app.use(({ i18n }, res) => {
        res.status(404).render("Error", {
            title: i18n.gettext("Page Not Found")
        });
    });
};