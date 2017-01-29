"use strict";

var tap = require("tap");
var request = require("request");

require("../init");

tap.test("Search", function (t) {
    var url = "http://localhost:3000/artworks/search";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("By Type", function (t) {
    var url = "http://localhost:3000/artworks/type/painting";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("By Type Missing", function (t) {
    var url = "http://localhost:3000/artworks/type/foo";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 404);
        t.end();
    });
});

tap.test("By Source", function (t) {
    var url = "http://localhost:3000/artworks/source/test";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("By Source Missing", function (t) {
    var url = "http://localhost:3000/artworks/source/foo";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 404);
        t.end();
    });
});

tap.test("Record", function (t) {
    var url = "http://localhost:3000/artworks/test/1234";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Record (Similar Images)", function (t) {
    var url = "http://localhost:3000/artworks/test/1235";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Record Compare", function (t) {
    var url = "http://localhost:3000/artworks/test/1235?compare";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Record Missing", function (t) {
    var url = "http://localhost:3000/artworks/test/foo";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 404);
        t.end();
    });
});

tap.test("Search: Filter", function (t) {
    var url = "http://localhost:3000/artworks/search?filter=test";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Location", function (t) {
    var url = "http://localhost:3000/artworks/search?location=test";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Artist", function (t) {
    var url = "http://localhost:3000/artworks/search?artist=test";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Date", function (t) {
    var url = "http://localhost:3000/artworks/search?dateStart=1500&dateEnd=1599";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Date (Start Only)", function (t) {
    var url = "http://localhost:3000/artworks/search?dateStart=1500";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Date (End Only)", function (t) {
    var url = "http://localhost:3000/artworks/search?dateEnd=1599";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Width", function (t) {
    var url = "http://localhost:3000/artworks/search?widthMin=0&widthMax=99";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Height", function (t) {
    var url = "http://localhost:3000/artworks/search?heightMin=0&heightMax=99";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Similar (Any)", function (t) {
    var url = "http://localhost:3000/artworks/search?similar=any";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Similar (Internal)", function (t) {
    var url = "http://localhost:3000/artworks/search?similar=internal";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Similar (External)", function (t) {
    var url = "http://localhost:3000/artworks/search?similar=external";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Multiple", function (t) {
    var url = "http://localhost:3000/artworks/search?filter=test&location=test";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Defaults", function (t) {
    var url = "http://localhost:3000/artworks/search?filter=test&location=";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.equal(res.request.uri.href, "http://localhost:3000/artworks/search?filter=test");
        t.end();
    });
});