const tap = require("tap");
const webdriverio = require("webdriverio");
const sauce = require("sauce-connect-launcher");

require("../init");

const travis = process.env.TRAVIS_BUILD_NUMBER;
const user = process.env.SAUCE_USERNAME;
const key = process.env.SAUCE_ACCESS_KEY;

const options = {
    desiredCapabilities: {
        browserName: "chrome",
    },
    //logLevel: "verbose",
};

if (travis) {
    if (!user || !key) {
        console.error("Sauce username/key missing.");
        process.exit(1);
    }

    Object.assign(options, {
        commandExecutor: `http://${user}:${key}@localhost:4445/wd/hub`,
        host: "ondemand.saucelabs.com",
        port: 80,
        user,
        key,
    });

    Object.assign(options.desiredCapabilities, {
        name: `travis-${travis}`,
        build: travis,
        public: true,
    });
}

let sauceProcess;
let client;

const loadConnect = new Promise(resolve => {
    if (!travis) {
        return resolve();
    }

    sauce(
        {
            username: user,
            accessKey: key,
        },
        (err, sauceProcess) => {
            resolve(sauceProcess);
        }
    );
});

tap.tearDown(() => {
    return client.end().then(() => {
        if (sauceProcess) {
            sauceProcess.close(() => {
                // console.log("DONE");
            });
        }
    });
});

tap.test("Load Client", t => {
    loadConnect.then(_sauceProcess => {
        sauceProcess = _sauceProcess;

        client = webdriverio.remote(options).init().then(() => {
            t.end();
        });
    });
});

tap.test("Home Page", t => {
    return client.url("http://localhost:3000").getTitle().then(title => {
        t.equal(title, "Mongaku");
    });
});

tap.test("Login as Admin", t => {
    return client
        .url("http://localhost:3000/login")
        .getTitle()
        .then(title => {
            t.equal(title, "Login: Mongaku");
        })
        .setValue("input[name=email]", "test@test.com")
        .setValue("input[name=password]", "test")
        .submitForm("form[action='/login']")
        .getText("a[href='/logout']")
        .then(text => {
            t.equal(text, "Logout");
        })
        .getSource()
        .then(source => {
            t.match(source, '"email":"test@test.com"');
        });
});
