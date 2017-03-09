const path = require("path");
const net = require("net");

const dotenv = require("dotenv");
const tap = require("tap");
const webdriverio = require("webdriverio");
const sauce = require("sauce-connect-launcher");

require("../init");

// Load in configuration options
dotenv.config({
    path: path.resolve(process.cwd(), ".mongaku"),
    silent: true,
});

const user = process.env.SAUCE_USERNAME;
const key = process.env.SAUCE_ACCESS_KEY;
const travis = process.env.TRAVIS_BUILD_NUMBER;
const build = travis || `local-${(new Date).toISOString()}`;
const name = travis ? `travis-${travis}` : build;

if (!user || !key) {
    console.error("Sauce username/key missing.");
    process.exit(1);
}

let sauceProcess;
let client;

// Source: https://gist.github.com/timoxley/1689041
const isPortTaken = function(port, fn) {
    const server = net.createServer()
        .once("error", (err) => {
            if (err.code !== "EADDRINUSE") {
                return fn(err);
            }
            fn(null, true);
        })
        .once("listening", () => {
            server
                .once("close", () => fn(null, false))
                .close();
        })
        .listen(port);
};

const loadConnect = new Promise((resolve) => {
    isPortTaken(4445, (err, taken) => {
        if (taken) {
            return resolve();
        }

        sauce({
            username: user,
            accessKey: key,
        }, (err, sauceProcess) => {
            resolve(sauceProcess);
        });
    });
});

tap.tearDown(() => {
    client.end().then(() => {
        if (sauceProcess) {
            sauceProcess.close(() => {
                // console.log("DONE");
            });
        }
    });
});

tap.test("Load Client", (t) => {
    loadConnect.then((_sauceProcess) => {
        sauceProcess = _sauceProcess;

        client = webdriverio.remote({
            desiredCapabilities: {
                browserName: "chrome",
                name,
                build,
                public: true,
            },
            commandExecutor: `http://${user}:${key}@localhost:4445/wd/hub`,
            host: "ondemand.saucelabs.com",
            port: 80,
            user,
            key,
            //logLevel: "verbose",
        }).init().then(() => {
            t.end();
        });
    });
});

tap.test("Load Page", (t) => {
    return client
        .url("http://localhost:3000")
        .getTitle()
        .then((title) => {
            t.equal(title, "Mongaku");
        });
});

tap.test("Search Page", (t) => {
    return client
        .url("http://localhost:3000/artworks/search")
        .getTitle()
        .then((title) => {
            t.equal(title, "Records: Mongaku");
        });
});
