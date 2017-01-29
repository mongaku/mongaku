#! /usr/bin/env node
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var path = require("path");

var minimist = require("minimist");
var shell = require("shelljs");

var pkg = require("../../package.json");

var args = minimist(process.argv.slice(2));

var cmd = args._[0];
var extraArgs = args._.slice(1);

var localFile = function localFile(file) {
    return path.resolve(__dirname, file);
};
var getBinary = function getBinary(bin) {
    var binPath = localFile("../../node_modules/.bin/" + bin);

    if (!shell.which(binPath)) {
        console.error(bin + " not found. Please run 'npm install'.");
        process.exit(1);
    }

    return binPath;
};

if (args.v || args.version) {
    console.log(pkg.version);
} else if (cmd === "start") {
    process.env.NODE_ENV = "production";

    var workers = args.workers || 2;
    var basePath = args.logs || "";
    var stdoutLog = path.resolve(basePath, "mongaku-stdout.log");
    var stderrLog = path.resolve(basePath, "mongaku-stderr.log");
    var serverjs = localFile("../mongaku.js");

    var startCmd = [getBinary("naught"), "start", "--worker-count " + workers, "--ipc-file mongaku.ipc", "--pid-file mongaku.pid", "--log /dev/null", "--stdout " + stdoutLog, "--stderr " + stderrLog, serverjs].concat(extraArgs).join(" ");

    shell.exec(startCmd);
} else if (cmd === "stop") {
    shell.exec(getBinary("naught") + " stop " + "--pid-file mongaku.pid mongaku.ipc");
} else if (cmd === "restart") {
    shell.exec(getBinary("naught") + " deploy mongaku.ipc");
} else if (cmd === "dev") {
    var cwd = process.cwd();
    var localDir = localFile("..");
    var _serverjs = localFile("../mongaku.js");
    var ignored = [path.join(localDir, "node_modules"), path.join(cwd, "node_modules")].join(",");

    var devCmd = [getBinary("supervisor"), "-w " + localDir + "," + cwd, "-e js", "-i " + ignored, "--", _serverjs].concat(extraArgs).join(" ");

    shell.exec(devCmd);
} else if (cmd === "create" || cmd === "convert") {
    (function () {
        var _extraArgs = _slicedToArray(extraArgs, 1),
            name = _extraArgs[0];

        var init = require("../lib/init");
        var logic = require("../utils/" + cmd + "-" + name + ".js");

        init(function () {
            logic(extraArgs.slice(2), function (err) {
                if (err) {
                    console.error(err);
                    process.exit(1);
                } else {
                    process.exit(0);
                }
            });
        });
    })();
} else {
    console.log(pkg.name + ": " + pkg.description + "\n\nusage: mongaku <command>\n\nCommands:\n    install\n    create admin\n    create user\n    create source\n    create index\n    convert data\n    start\n      --logs\n      --workers\n    stop\n    restart\n    dev\n\n-v: Show program version\n-h: Show available commands\n");
}