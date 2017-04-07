const tap = require("tap");
const request = require("request");

require("../init");

tap.test("Sitemap Index", t => {
    const url = "http://localhost:3000/sitemap.xml";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Sitemap Search Page", t => {
    const url = "http://localhost:3000/sitemap-artworks-0.xml";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});
