"use strict";

var tap = require("tap");
var request = require("request");

require("../init");

tap.test("Home Page", function (t) {
    var url = "http://localhost:3000/";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});