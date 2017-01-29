"use strict";

var tap = require("tap");
var request = require("request").defaults({ jar: true });

require("../init");

var login = function login(callback) {
    request.post({
        url: "http://localhost:3000/login",
        form: {
            email: "test@test.com",
            password: "test"
        }
    }, callback);
};

tap.test("Login Page", function (t) {
    var url = "http://localhost:3000/login";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Logout Page", function (t) {
    var url = "http://localhost:3000/logout";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("Login then Logout", function (t) {
    login(function () {
        var url = "http://localhost:3000/logout";
        request.get(url, function (err, res) {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Incorrect Login", function (t) {
    request.post({
        url: "http://localhost:3000/login",
        form: {
            email: "foo",
            password: "bar"
        }
    }, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 302);
        t.end();
    });
});