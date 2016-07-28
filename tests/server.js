"use strict";

const init = require("./init");

init.init((err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("STARTED");
        const cron = require("../server/cron");
        cron.start();
    }
});
