"use strict";

var rl = require("readline-sync");
var genPassword = require("password-generator");

var models = require("../lib/models");

module.exports = function (args, callback) {
    var email = rl.questionEMail("Email: ");
    var password = rl.question("Password [auto-gen]: ", {
        defaultInput: genPassword(),
        hideEchoBack: true
    });
    var source = rl.question("Source Admin [Optional, Source ID]: ");

    var User = models("User");
    var user = new User({
        email: email,
        password: password,
        sourceAdmin: source ? source.split(/,\s*/) : []
    });

    user.save(function (err) {
        if (err) {
            return callback(err);
        }

        console.log("User Created:");
        console.log("Email: " + email);
        console.log("Password: " + password);

        callback();
    });
};