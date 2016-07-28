"use strict";

const tap = require("tap");
const request = require("request");

require("../init");

tap.test("Home Page", (t) => {
    const url = "http://localhost:3000/";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});
