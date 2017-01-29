"use strict";

var record = require("../../lib/record");

var search = require("./search");

module.exports = function (req, res, next, tmplParams) {
    var fields = Object.assign({}, req.query, req.params);

    search(fields, req, function (err, data, expectedURL) {
        if (err) {
            return next(new Error(req.gettext("Error connecting to database.")));
        }

        if (expectedURL) {
            return res.redirect(expectedURL);
        }

        if (data.values.format === "json") {
            return res.status(200).send(data);
        }

        var type = req.params.type;
        var Record = record(type);
        Record.getFacets(req, function (err, globalFacets) {
            var tmplData = Object.assign(data, tmplParams, {
                globalFacets: globalFacets
            });
            res.render("Search", tmplData);
        });
    });
};