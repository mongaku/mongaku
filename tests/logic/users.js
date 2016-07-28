"use strict";

const tap = require("tap");
const request = require("request").defaults({jar: true});

require("../init");

const login = (callback) => {
    request.post({
        url: "http://localhost:3000/login",
        form: {
            email: "test@test.com",
            password: "test",
        },
    }, callback);
};

tap.test("Login Page", (t) => {
    const url = "http://localhost:3000/login";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Logout Page", (t) => {
    const url = "http://localhost:3000/logout";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Login then Logout", (t) => {
    login(() => {
        const url = "http://localhost:3000/logout";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Incorrect Login", (t) => {
    request.post({
        url: "http://localhost:3000/login",
        form: {
            email: "foo",
            password: "bar",
        },
    }, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 302);
        t.end();
    });
});
