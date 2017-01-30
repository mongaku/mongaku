"use strict";

require("./server/server")(err => {
    if (err) {
        console.error(err);
    } else {
        console.log("STARTED");
    }
});