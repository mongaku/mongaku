const tap = require("tap");

const init = require("../init");
const User = init.User;

tap.test("password", {autoend: true}, t => {
    const user = init.getUser();

    user.password = "test";
    t.equal(user.password, "test");

    user.password = "";
    t.equal(user.password, "");
});

tap.test("authenticate", {autoend: true}, t => {
    const user = init.getUser();

    user.password = "test";

    t.equal(user.authenticate("test"), true);
    t.equal(user.authenticate("nottest"), false);
});

tap.test("validate", t => {
    const user = new User({
        email: "new@test.com",
        password: "test",
    });

    user.validate(err => {
        t.error(err);
        t.end();
    });
});

tap.test("validate (not new)", t => {
    const user = new User({
        email: "new@test.com",
        password: "test",
    });
    user.isNew = false;

    user.validate(err => {
        t.error(err);
        t.end();
    });
});

tap.test("validate (modified)", t => {
    const user = new User({
        email: "new@test.com",
        password: "test",
    });
    user.isNew = false;

    user.validate(err => {
        t.error(err);
        t.end();
    });
});

tap.test("validate (existing email)", t => {
    const user = new User({
        email: "test@test.com",
        password: "test",
    });

    user.validate(err => {
        t.equal(err.message, "User validation failed");
        t.end();
    });
});
