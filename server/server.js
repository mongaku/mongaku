"use strict";

const express = require("express");

require("babel-register");

const init = require("../lib/init");
const config = require("../lib/config");

const expressInit = require("./express");
const passport = require("./passport");
const i18n = require("./i18n");
const routes = require("./routes");
const cron = require("./cron");

module.exports = (callback) => {
    const port = config.PORT;
    const app = express();

    init((err) => {
        /* istanbul ignore if */
        if (err) {
            return callback(err);
        }

        // Load in the main server logic
        expressInit(app);
        passport(app);
        i18n(app);
        routes(app);

        const server = app.listen(port, () => {
            callback(null, server);

            /* istanbul ignore if */
            if (process.send) {
                process.send("online");
            }
        });

        /* istanbul ignore if */
        if (config.NODE_ENV !== "test") {
            // Start the app by listening on <port>
            console.log(`PORT: ${port}`);

            process.on("message", (message) => {
                if (message === "shutdown") {
                    process.exit(0);
                }
            });

            process.on("uncaughtException", (err) => {
                console.error("Exception:", err.stack);

                if (process.send) {
                    process.send("offline");
                }
            });

            cron.start();
        }
    });
};
