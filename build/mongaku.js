"use strict";

require("./server/server")(function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log("STARTED");
    }
});