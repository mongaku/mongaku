const tap = require("tap");
const request = require("request");
const phantom = require("phantom");

require("../init");

tap.test("Record", (t) => {
    const url = "http://localhost:3000/artworks/test/1234";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Record (Similar Images)", (t) => {
    const url = "http://localhost:3000/artworks/test/1235";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Record Compare", (t) => {
    const url = "http://localhost:3000/artworks/test/1235?compare";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Record Missing", (t) => {
    const url = "http://localhost:3000/artworks/test/foo";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 404);
        t.end();
    });
});

tap.test("Record (in Browser", async (t) => {
    const url = "http://localhost:3000/artworks/test/1234";
    const instance = await phantom.create([], {
        logger: {
            error: (err) => {
                t.error(err, "JS Error.");
            },
        },
    });
    const page = await instance.createPage();
    const status = await page.open(url);
    const content = await page.property("content");
    t.match(content, "<title>Test: Mongaku</title>");
    t.equal(status, "success");
    instance.exit();
    t.end();
});
