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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iaW4vbW9uZ2FrdS5qcyJdLCJuYW1lcyI6WyJwYXRoIiwicmVxdWlyZSIsIm1pbmltaXN0Iiwic2hlbGwiLCJwa2ciLCJhcmdzIiwicHJvY2VzcyIsImFyZ3YiLCJzbGljZSIsImNtZCIsIl8iLCJleHRyYUFyZ3MiLCJsb2NhbEZpbGUiLCJmaWxlIiwicmVzb2x2ZSIsIl9fZGlybmFtZSIsImdldEJpbmFyeSIsImJpbiIsImJpblBhdGgiLCJ3aGljaCIsImNvbnNvbGUiLCJlcnJvciIsImV4aXQiLCJ2IiwidmVyc2lvbiIsImxvZyIsImVudiIsIk5PREVfRU5WIiwid29ya2VycyIsImJhc2VQYXRoIiwibG9ncyIsInN0ZG91dExvZyIsInN0ZGVyckxvZyIsInNlcnZlcmpzIiwic3RhcnRDbWQiLCJjb25jYXQiLCJqb2luIiwiZXhlYyIsImN3ZCIsImxvY2FsRGlyIiwiaWdub3JlZCIsImRldkNtZCIsIm5hbWUiLCJpbml0IiwibG9naWMiLCJlcnIiLCJkZXNjcmlwdGlvbiJdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLElBQU1BLE9BQU9DLFFBQVEsTUFBUixDQUFiOztBQUVBLElBQU1DLFdBQVdELFFBQVEsVUFBUixDQUFqQjtBQUNBLElBQU1FLFFBQVFGLFFBQVEsU0FBUixDQUFkOztBQUVBLElBQU1HLE1BQU1ILFFBQVEsb0JBQVIsQ0FBWjs7QUFFQSxJQUFNSSxPQUFPSCxTQUFTSSxRQUFRQyxJQUFSLENBQWFDLEtBQWIsQ0FBbUIsQ0FBbkIsQ0FBVCxDQUFiOztBQUVBLElBQU1DLE1BQU1KLEtBQUtLLENBQUwsQ0FBTyxDQUFQLENBQVo7QUFDQSxJQUFNQyxZQUFZTixLQUFLSyxDQUFMLENBQU9GLEtBQVAsQ0FBYSxDQUFiLENBQWxCOztBQUVBLElBQU1JLFlBQVksU0FBWkEsU0FBWSxDQUFDQyxJQUFEO0FBQUEsV0FBVWIsS0FBS2MsT0FBTCxDQUFhQyxTQUFiLEVBQXdCRixJQUF4QixDQUFWO0FBQUEsQ0FBbEI7QUFDQSxJQUFNRyxZ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LDRCQUFRZ0IsSUFBUixDQUFhLENBQWI7QUFDSDtBQUNKLGFBUEQ7QUFRSCxTQVREO0FBTjhDO0FBaUJqRCxDQWpCTSxNQWlCQTtBQUNIRixZQUFRSyxHQUFSLENBQWVyQixJQUFJc0MsSUFBbkIsVUFBNEJ0QyxJQUFJMEMsV0FBaEM7QUFzQkgiLCJmaWxlIjoibW9uZ2FrdS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXG5jb25zdCBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XG5cbmNvbnN0IG1pbmltaXN0ID0gcmVxdWlyZShcIm1pbmltaXN0XCIpO1xuY29uc3Qgc2hlbGwgPSByZXF1aXJlKFwic2hlbGxqc1wiKTtcblxuY29uc3QgcGtnID0gcmVxdWlyZShcIi4uLy4uL3BhY2thZ2UuanNvblwiKTtcblxuY29uc3QgYXJncyA9IG1pbmltaXN0KHByb2Nlc3MuYXJndi5zbGljZSgyKSk7XG5cbmNvbnN0IGNtZCA9IGFyZ3MuX1swXTtcbmNvbnN0IGV4dHJhQXJncyA9IGFyZ3MuXy5zbGljZSgxKTtcblxuY29uc3QgbG9jYWxGaWxlID0gKGZpbGUpID0+IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIGZpbGUpO1xuY29uc3QgZ2V0QmluYXJ5ID0gKGJpbikgPT4ge1xuICAgIGNvbnN0IGJpblBhdGggPSBsb2NhbEZpbGUoYC4uLy4uL25vZGVfbW9kdWxlcy8uYmluLyR7YmlufWApO1xuXG4gICAgaWYgKCFzaGVsbC53aGljaChiaW5QYXRoKSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGAke2Jpbn0gbm90IGZvdW5kLiBQbGVhc2UgcnVuICducG0gaW5zdGFsbCcuYCk7XG4gICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYmluUGF0aDtcbn07XG5cbmlmIChhcmdzLnYgfHwgYXJncy52ZXJzaW9uKSB7XG4gICAgY29uc29sZS5sb2cocGtnLnZlcnNpb24pO1xuXG59IGVsc2UgaWYgKGNtZCA9PT0gXCJzdGFydFwiKSB7XG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPSBcInByb2R1Y3Rpb25cIjtcblxuICAgIGNvbnN0IHdvcmtlcnMgPSBhcmdzLndvcmtlcnMgfHwgMjtcbiAgICBjb25zdCBiYXNlUGF0aCA9IGFyZ3MubG9ncyB8fCBcIlwiO1xuICAgIGNvbnN0IHN0ZG91dExvZyA9IHBhdGgucmVzb2x2ZShiYXNlUGF0aCwgXCJtb25nYWt1LXN0ZG91dC5sb2dcIik7XG4gICAgY29uc3Qgc3RkZXJyTG9nID0gcGF0aC5yZXNvbHZlKGJhc2VQYXRoLCBcIm1vbmdha3Utc3RkZXJyLmxvZ1wiKTtcbiAgICBjb25zdCBzZXJ2ZXJqcyA9IGxvY2FsRmlsZShcIi4uL21vbmdha3UuanNcIik7XG5cbiAgICBjb25zdCBzdGFydENtZCA9IFtcbiAgICAgICAgZ2V0QmluYXJ5KFwibmF1Z2h0XCIpLFxuICAgICAgICBcInN0YXJ0XCIsXG4gICAgICAgIGAtLXdvcmtlci1jb3VudCAke3dvcmtlcnN9YCxcbiAgICAgICAgYC0taXBjLWZpbGUgbW9uZ2FrdS5pcGNgLFxuICAgICAgICBgLS1waWQtZmlsZSBtb25nYWt1LnBpZGAsXG4gICAgICAgIGAtLWxvZyAvZGV2L251bGxgLFxuICAgICAgICBgLS1zdGRvdXQgJHtzdGRvdXRMb2d9YCxcbiAgICAgICAgYC0tc3RkZXJyICR7c3RkZXJyTG9nfWAsXG4gICAgICAgIHNlcnZlcmpzLFxuICAgIF0uY29uY2F0KGV4dHJhQXJncykuam9pbihcIiBcIik7XG5cbiAgICBzaGVsbC5leGVjKHN0YXJ0Q21kKTtcblxufSBlbHNlIGlmIChjbWQgPT09IFwic3RvcFwiKSB7XG4gICAgc2hlbGwuZXhlYyhgJHtnZXRCaW5hcnkoXCJuYXVnaHRcIil9IHN0b3AgYCArXG4gICAgICAgIGAtLXBpZC1maWxlIG1vbmdha3UucGlkIG1vbmdha3UuaXBjYCk7XG5cbn0gZWxzZSBpZiAoY21kID09PSBcInJlc3RhcnRcIikge1xuICAgIHNoZWxsLmV4ZWMoYCR7Z2V0QmluYXJ5KFwibmF1Z2h0XCIpfSBkZXBsb3kgbW9uZ2FrdS5pcGNgKTtcblxufSBlbHNlIGlmIChjbWQgPT09IFwiZGV2XCIpIHtcbiAgICBjb25zdCBjd2QgPSBwcm9jZXNzLmN3ZCgpO1xuICAgIGNvbnN0IGxvY2FsRGlyID0gbG9jYWxGaWxlKFwiLi5cIik7XG4gICAgY29uc3Qgc2VydmVyanMgPSBsb2NhbEZpbGUoXCIuLi9tb25nYWt1LmpzXCIpO1xuICAgIGNvbnN0IGlnbm9yZWQgPSBbXG4gICAgICAgIHBhdGguam9pbihsb2NhbERpciwgXCJub2RlX21vZHVsZXNcIiksXG4gICAgICAgIHBhdGguam9pbihjd2QsIFwibm9kZV9tb2R1bGVzXCIpLFxuICAgIF0uam9pbihcIixcIik7XG5cbiAgICBjb25zdCBkZXZDbWQgPSBbXG4gICAgICAgIGdldEJpbmFyeShcInN1cGVydmlzb3JcIiksXG4gICAgICAgIGAtdyAke2xvY2FsRGlyfSwke2N3ZH1gLFxuICAgICAgICBcIi1lIGpzXCIsXG4gICAgICAgIGAtaSAke2lnbm9yZWR9YCxcbiAgICAgICAgXCItLVwiLFxuICAgICAgICBzZXJ2ZXJqcyxcbiAgICBdLmNvbmNhdChleHRyYUFyZ3MpLmpvaW4oXCIgXCIpO1xuXG4gICAgc2hlbGwuZXhlYyhkZXZDbWQpO1xuXG59IGVsc2UgaWYgKGNtZCA9PT0gXCJjcmVhdGVcIiB8fCBjbWQgPT09IFwiY29udmVydFwiKSB7XG4gICAgY29uc3QgW25hbWVdID0gZXh0cmFBcmdzO1xuXG4gICAgY29uc3QgaW5pdCA9IHJlcXVpcmUoXCIuLi9saWIvaW5pdFwiKTtcbiAgICBjb25zdCBsb2dpYyA9IHJlcXVpcmUoYC4uL3V0aWxzLyR7Y21kfS0ke25hbWV9LmpzYCk7XG5cbiAgICBpbml0KCgpID0+IHtcbiAgICAgICAgbG9naWMoZXh0cmFBcmdzLnNsaWNlKDIpLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxufSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZyhgJHtwa2cubmFtZX06ICR7cGtnLmRlc2NyaXB0aW9ufVxuXG51c2FnZTogbW9uZ2FrdSA8Y29tbWFuZD5cblxuQ29tbWFuZHM6XG4gICAgaW5zdGFsbFxuICAgIGNyZWF0ZSBhZG1pblxuICAgIGNyZWF0ZSB1c2VyXG4gICAgY3JlYXRlIHNvdXJjZVxuICAgIGNyZWF0ZSBpbmRleFxuICAgIGNvbnZlcnQgZGF0YVxuICAgIHN0YXJ0XG4gICAgICAtLWxvZ3NcbiAgICAgIC0td29ya2Vyc1xuICAgIHN0b3BcbiAgICByZXN0YXJ0XG4gICAgZGV2XG5cbi12OiBTaG93IHByb2dyYW0gdmVyc2lvblxuLWg6IFNob3cgYXZhaWxhYmxlIGNvbW1hbmRzXG5gKTtcblxufVxuIl19