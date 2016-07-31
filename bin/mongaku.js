#! /usr/bin/env node

"use strict";

const path = require("path");

const minimist = require("minimist");
const shell = require("shelljs");

const pkg = require("../package.json");

const args = minimist(process.argv.slice(2));

const cmd = args._[0];

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

    const basePath = args.logs || "";
    const serverLog = path.resolve(basePath, "mongaku-server.log");
    const stdoutLog = path.resolve(basePath, "mongaku-stdout.log");
    const stderrLog = path.resolve(basePath, "mongaku-stderr.log");
    const serverjs = localFile("../server.js");

    const startCmd = [
        getBinary("naught"),
        "start",
        "--worker-count 2",
        `--log ${serverLog}`,
        `--stdout ${stdoutLog}`,
        `--stderr ${stderrLog}`,
        serverjs,
    ].join(" ");

    shell.exec(startCmd);

} else if (cmd === "stop") {
    shell.exec(`${getBinary("naught")} stop`);

} else if (cmd === "restart") {
    shell.exec(`${getBinary("naught")} deploy`);

} else {
    console.log(`${pkg.name}: ${pkg.description}

usage: mongaku <command>

Commands:
    install
    start
      --logs
    stop
    restart

-v: Show program version
-h: Show available commands
`);

}
