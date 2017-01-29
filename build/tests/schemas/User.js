"use strict";

var tap = require("tap");

var init = require("../init");
var User = init.User;

tap.test("password", { autoend: true }, function (t) {
    var user = init.getUser();

    user.password = "test";
    t.equal(user.password, "test");

    user.password = "";
    t.equal(user.password, "");
});

tap.test("authenticate", { autoend: true }, function (t) {
    var user = init.getUser();

    user.password = "test";

    t.equal(user.authenticate("test"), true);
    t.equal(user.authenticate("nottest"), false);
});

tap.test("validate", function (t) {
    var user = new User({
        email: "new@test.com",
        password: "test"
    });

    user.validate(function (err) {
        t.error(err);
        t.end();
    });
});

tap.test("validate (not new)", function (t) {
    var user = new User({
        email: "new@test.com",
        password: "test"
    });
    user.isNew = false;

    user.validate(function (err) {
        t.error(err);
        t.end();
    });
});

tap.test("validate (modified)", function (t) {
    var user = new User({
        email: "new@test.com",
        password: "test"
    });
    user.isNew = false;

    user.validate(function (err) {
        t.error(err);
        t.end();
    });
});

tap.test("validate (existing email)", function (t) {
    var user = new User({
        email: "test@test.com",
        password: "test"
    });

    user.validate(function (err) {
        t.equal(err.message, "User validation failed");
        t.end();
    });
});