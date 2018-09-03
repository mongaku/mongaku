const tap = require("tap");
const request = require("request");

require("../init");

tap.test("Search", t => {
    const url = "http://localhost:3000/artworks/search";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("By Type", t => {
    const url = "http://localhost:3000/artworks/type/painting";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("By Type Missing", t => {
    const url = "http://localhost:3000/artworks/type/foo";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 404);
        t.end();
    });
});

tap.test("By Source", t => {
    const url = "http://localhost:3000/artworks/source/test";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("By Source Missing", t => {
    const url = "http://localhost:3000/artworks/source/foo";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 404);
        t.end();
    });
});

tap.test("Search: Filter", t => {
    const url = "http://localhost:3000/artworks/search?filter=test";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Location", t => {
    const url = "http://localhost:3000/artworks/search?location=test";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Artist", t => {
    const url = "http://localhost:3000/artworks/search?artist=test";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Date", t => {
    const url =
        "http://localhost:3000/artworks/search?date.start=1500&date.end=1599";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Date (Start Only)", t => {
    const url = "http://localhost:3000/artworks/search?date.start=1500";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Date (End Only)", t => {
    const url = "http://localhost:3000/artworks/search?date.end=1599";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Medium", t => {
    const url = "http://localhost:3000/artworks/search?medium=oil";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Width", t => {
    const url =
        "http://localhost:3000/artworks/search?" +
        "dimensions.widthMin=0&dimensions.widthMax=99";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Height", t => {
    const url =
        "http://localhost:3000/artworks/search?" +
        "dimensions.heightMin=0&dimensions.heightMax=99";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Similar (Any)", t => {
    const url = "http://localhost:3000/artworks/search?similar=any";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Similar (Internal)", t => {
    const url = "http://localhost:3000/artworks/search?similar=internal";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Similar (External)", t => {
    const url = "http://localhost:3000/artworks/search?similar=external";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Multiple", t => {
    const url =
        "http://localhost:3000/artworks/search?filter=test&location=test";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Search: Defaults", t => {
    const url = "http://localhost:3000/artworks/search?filter=test&location=";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.equal(
            res.request.uri.href,
            "http://localhost:3000/artworks/search?filter=test",
        );
        t.end();
    });
});
