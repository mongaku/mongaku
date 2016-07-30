#! /usr/bin/env node

"use strict";

const minimist = require("minimist");
//const shell = require("shelljs");

const pkg = require("../package.json");

const args = minimist(process.argv.slice(2));

//const cmd = args._[0];

if (args.h) {
    console.log(`${pkg.name}: ${pkg.description}

usage: mongaku <command>

Commands:
    install
    start
    stop
    restart

-v: Show program version
-h: Show available commands
`);

} else if (args.v || args.version) {
    console.log(pkg.version);
}
