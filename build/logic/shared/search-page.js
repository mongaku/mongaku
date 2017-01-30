"use strict";

const record = require("../../lib/record");

const search = require("./search");

module.exports = (req, res, next, tmplParams) => {
    const fields = Object.assign({}, req.query, req.params);

    search(fields, req, (err, data, expectedURL) => {
        if (err) {
            return next(new Error(req.gettext("Error connecting to database.")));
        }

        if (expectedURL) {
            return res.redirect(expectedURL);
        }

        if (data.values.format === "json") {
            return res.status(200).send(data);
        }

        const type = req.params.type;
        const Record = record(type);
        Record.getFacets(req, (err, globalFacets) => {
            const tmplData = Object.assign(data, tmplParams, {
                globalFacets
            });
            res.render("Search", tmplData);
        });
    });
};