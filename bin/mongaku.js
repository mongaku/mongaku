#! /usr/bin/env node

"use strict";

const path = require("path");

const minimist = require("minimist");
const shell = require("shelljs");

const pkg = require("../package.json");

const args = minimist(process.argv.slice(2));

const cmd = args._[0];
const extraArgs = args._.slice(1);

const localFile = (file) => path.resolve(__dirname, file);
const getBinary = (bin) => {
    const binPath = localFile(`../node_modules/.bin/${bin}`);

    if (!shell.which(binPath)) {
        console.error(`${bin} not found. Please run 'npm install'.`);
        process.exit(1);
    }

    return binPath;
};

if (args.v || args.version) {
    console.log(pkg.version);

} else if (cmd === "start") {
    process.env.NODE_ENV = "production";

    const workers = args.workers || 2;
    const basePath = args.logs || "";
    const stdoutLog = path.resolve(basePath, "mongaku-stdout.log");
    const stderrLog = path.resolve(basePath, "mongaku-stderr.log");
    const serverjs = localFile("../mongaku.js");

    const startCmd = [
        getBinary("naught"),
        "start",
        `--worker-count ${workers}`,
        `--ipc-file mongaku.ipc`,
        `--pid-file mongaku.pid`,
        `--log /dev/null`,
        `--stdout ${stdoutLog}`,
        `--stderr ${stderrLog}`,
        serverjs,
    ].concat(extraArgs).join(" ");

    shell.exec(startCmd);

} else if (cmd === "stop") {
    shell.exec(`${getBinary("naught")} stop ` +
        `--pid-file mongaku.pid mongaku.ipc`);

} else if (cmd === "restart") {
    shell.exec(`${getBinary("naught")} deploy mongaku.ipc`);

} else if (cmd === "create") {
    const name = extraArgs[0];
    const logic = require(`../utils/create-${name}.js`);
    const init = require("../lib/init");

    init(() => {
        logic((err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            } else {
                process.exit(0);
            }
        });
    });

} else {
    console.log(`${pkg.name}: ${pkg.description}

usage: mongaku <command>

Commands:
    install
    create admin
    create user
    create source
    create index
    start
      --logs
      --workers
    stop
    restart

-v: Show program version
-h: Show available commands
`);

}
