const rl = require("readline-sync");
const genPassword = require("password-generator");

const models = require("../lib/models");

module.exports = (args, callback) => {
    const email = rl.questionEMail("Email: ");
    const password = rl.question("Password [auto-gen]: ", {
        defaultInput: genPassword(),
        hideEchoBack: true,
    });
    const source = rl.question("Source Admin [Optional, Source ID]: ");

    const User = models("User");
    const user = new User({
        email,
        password,
        sourceAdmin: source ? source.split(/,\s*/) : [],
    });

    user.save(err => {
        if (err) {
            return callback(err);
        }

        console.log("User Created:");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

        callback();
    });
};
