"use strict";

var init = require("./init");

init.init(function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log("STARTED");
        var cron = require("../server/cron");
        cron.start();
    }
});