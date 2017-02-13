const record = require("../../lib/record");

const search = require("./search");

module.exports = (req, res, next, tmplParams) => {
    const {i18n, query, params} = req;
    const fields = Object.assign({}, query, params);

    search(fields, req, (err, data, expectedURL) => {
        if (err) {
            return next(new Error(
                i18n.gettext("Error connecting to database.")));
        }

        if (expectedURL) {
            return res.redirect(expectedURL);
        }

        if (data.values.format === "json") {
            return res.status(200).send(data);
        }

        const type = params.type;
        const Record = record(type);
        Record.getFacets(i18n, (err, globalFacets) => {
            const tmplData = Object.assign(data, tmplParams, {
                globalFacets,
            });
            res.render("Search", tmplData);
        });
    });
};
