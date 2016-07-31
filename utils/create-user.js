"use strict";

const rl = require("readline-sync");
const genPassword = require("password-generator");

const init = require("../lib/init");
const models = require("../lib/models");

init(() => {
    const email = rl.question("Email: ");
    const password = rl.question("Password [auto-gen]: ", {
        defaultInput: genPassword(),
        hideEchoBack: true,
    });
    const source = rl.question("Source Admin: ");

    const User = models("User");
    const user = new User({
        email,
        password,
        sourceAdmin: source ? [source] : [],
    });

    user.save((err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Created User!");
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
        }

        process.exit();
    });
});
