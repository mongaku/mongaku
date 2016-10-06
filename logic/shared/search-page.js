"use strict";

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

        const tmplData = Object.assign(data, tmplParams);
        res.render("Search", tmplData);
    });
};
