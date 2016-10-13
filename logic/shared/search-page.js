"use strict";

const record = require("../../lib/record");

const search = require("./search");

module.exports = (req, res, tmplParams) => {
    const fields = Object.assign({}, req.query, req.params);

    search(fields, req, (err, data, expectedURL) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (expectedURL) {
            return res.redirect(expectedURL);
        }

        const type = req.params.type;
        const Record = record(type);
        Record.getFacets(req, (err, globalFacets) => {
            const tmplData = Object.assign(data, tmplParams, {
                globalFacets,
            });
            res.render("Search", tmplData);
        });
    });
};
