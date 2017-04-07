const tap = require("tap");
const request = require("request").defaults({jar: true});

const {adminLogin, normalLogin} = require("../init");

tap.test("Edit Record", t => {
    const url = "http://localhost:3000/artworks/test/1235/edit";
    adminLogin(request, () => {
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Edit Record (Missing)", t => {
    const url = "http://localhost:3000/artworks/test/abcd/edit";
    adminLogin(request, () => {
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 404);
            t.end();
        });
    });
});

tap.test("Edit Record (Wrong Type)", t => {
    const url = "http://localhost:3000/abcd/test/1235/edit";
    adminLogin(request, () => {
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 404);
            t.end();
        });
    });
});

tap.test("Edit Record (Logged Out)", t => {
    const url = "http://localhost:3000/artworks/test/1235/edit";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.match(res.request.uri.href, "http://localhost:3000/login");
        t.end();
    });
});

tap.test("Edit Record (Unauthorized User)", t => {
    const url = "http://localhost:3000/artworks/test/1235/edit";
    normalLogin(request, () => {
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 403);
            t.end();
        });
    });
});
