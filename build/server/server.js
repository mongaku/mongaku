"use strict";

var express = require("express");

var init = require("../lib/init");
var config = require("../lib/config");

var expressInit = require("./express");
var passport = require("./passport");
var i18n = require("./i18n");
var routes = require("./routes");
var tmplVars = require("./tmpl-vars");
var cron = require("./cron");

module.exports = function (callback) {
    var port = config.PORT;
    var app = express();

    init(function (err) {
        /* istanbul ignore if */
        if (err) {
            return callback(err);
        }

        // Load in the main server logic
        expressInit(app);
        passport(app);
        i18n(app);
        tmplVars(app);
        routes(app);

        var server = app.listen(port, function () {
            callback(null, server);

            /* istanbul ignore if */
            if (process.send) {
                process.send("online");
            }
        });

        /* istanbul ignore if */
        if (config.NODE_ENV !== "test") {
            // Start the app by listening on <port>
            console.log("PORT: " + port);

            process.on("message", function (message) {
                if (message === "shutdown") {
                    process.exit(0);
                }
            });

            process.on("uncaughtException", function (err) {
                console.error("Exception:", err.stack);

                if (process.send) {
                    process.send("offline");
                }
            });

            cron.start();
        }
    });
};