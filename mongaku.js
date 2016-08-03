"use strict";

// If an options file is specified then we load that
if (process.argv.length > 2) {
    process.env.MONGAKU_OPTIONS = process.argv[2];
}

require("./server/server")((err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("STARTED");
    }
});
