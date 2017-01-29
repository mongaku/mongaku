"use strict";

var tap = require("tap");
var request = require("request");

require("../init");

tap.test("Sitemap Index", function (t) {
    var url = "http://localhost:3000/sitemap.xml";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Sitemap Search Page", function (t) {
    var url = "http://localhost:3000/sitemap-artworks-0.xml";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});