const tap = require("tap");
const request = require("request").defaults({jar: true});

const {adminLogin, normalLogin} = require("../init");

tap.test("Clone Record", (t) => {
    const url = "http://localhost:3000/artworks/test/1235/clone";
    adminLogin(request, () => {
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Clone Record (Missing)", (t) => {
    const url = "http://localhost:3000/artworks/test/abcd/clone";
    adminLogin(request, () => {
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 404);
            t.end();
        });
    });
});

tap.test("Clone Record (Wrong Type)", (t) => {
    const url = "http://localhost:3000/abcd/test/1235/clone";
    adminLogin(request, () => {
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 404);
            t.end();
        });
    });
});

tap.test("Clone Record (Logged Out)", (t) => {
    const url = "http://localhost:3000/artworks/test/1235/clone";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.match(res.request.uri.href,
            "http://localhost:3000/login");
        t.end();
    });
});

tap.test("Clone Record (Unauthorized User)", (t) => {
    const url = "http://localhost:3000/artworks/test/1235/clone";
    normalLogin(request, () => {
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 403);
            t.end();
        });
    });
});

tap.test("Create Record", (t) => {
    const url = "http://localhost:3000/artworks/create";
    adminLogin(request, () => {
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Create Record (Wrong Type)", (t) => {
    const url = "http://localhost:3000/abcd/create";
    adminLogin(request, () => {
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 404);
            t.end();
        });
    });
});

tap.test("Create Record (Logged Out)", (t) => {
    const url = "http://localhost:3000/artworks/create";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.match(res.request.uri.href,
            "http://localhost:3000/login");
        t.end();
    });
});

tap.test("Create Record (Unauthorized User)", (t) => {
    const url = "http://localhost:3000/artworks/create";
    normalLogin(request, () => {
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 403);
            t.end();
        });
    });
});
