"use strict";

var fs = require("fs");
var path = require("path");

var rl = require("readline-sync");

var models = require("../lib/models");
var options = require("../lib/options");

module.exports = function (args, callback) {
    var types = Object.keys(options.types);

    var _id = rl.question("Source ID (e.g. frick): ");
    var name = rl.question("Full Name (e.g. Frick Library): ");
    var shortName = rl.question("Short Name (e.g. Frick): ");
    var url = rl.question("URL (http://...): ");
    var type = rl.question("Data Type (" + types.join(", ") + "): ");
    var converter = rl.question("Data Convertor [default]: ", {
        defaultInput: "default"
    });

    var Source = models("Source");
    var source = new Source({
        _id: _id,
        name: name,
        shortName: shortName,
        url: url,
        type: type,
        converter: converter
    });

    source.save(function (err) {
        if (err) {
            return callback(err);
        }

        // Create directories to hold images
        var dir = source.getDirBase();
        fs.mkdirSync(dir);
        fs.mkdirSync(path.join(dir, "images"));
        fs.mkdirSync(path.join(dir, "scaled"));
        fs.mkdirSync(path.join(dir, "thumbs"));

        console.log("Source Created: " + _id);

        callback();
    });
};