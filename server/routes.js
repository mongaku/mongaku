"use strict";

const fs = require("fs");
const path = require("path");

const basePath = path.resolve(__dirname, "../logic/");

module.exports = function(app) {
    // Import all the logic routes
    fs.readdirSync(basePath).forEach((file) => {
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
                body: err.stack,
            });
        } else {
            next();
        }
    });

    // Handle missing pages
    app.use((req, res) => {
        res.status(404).render("Error", {
            title: req.gettext("Page Not Found"),
        });
    });
};
