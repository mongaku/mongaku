const metadata = require("../../lib/metadata");
const record = require("../../lib/record");

const search = require("./search");

module.exports = (req, res, next, tmplParams) => {
    const {i18n, query, params} = req;
    const fields = Object.assign({}, query, params);
    const {type} = params;

    search(fields, req, (err, data, expectedURL) => {
        if (err) {
            console.error(`Database error: ${err}`);
            return next(
                new Error(i18n.gettext("Error connecting to database.")),
            );
        }

        if (expectedURL) {
            return res.redirect(expectedURL);
        }

        if (data.values.format === "json") {
            res.set("Content-Type", "application/json");
            return res.status(200).send(data.records);
        }

        if (data.values.format === "csv") {
            const model = metadata.model(type);

            const header = Object.keys(model)
                .map(prop => model[prop].options.title(i18n))
                .join("\t");

            const records = data.records
                .map(row =>
                    Object.keys(model)
                        .map(prop => row[prop])
                        .join("\t"),
                )
                .join("\n");

            res.set("Content-Type", "text/csv");
            return res.status(200).send(`${header}\n${records}`);
        }

        // NOTE(jeresig): We use this instead of cloneModel to avoid sending
        // down too much data that we don't need (plus cloning all of those
        // models can be expensive).
        const simplifyRecord = record => ({
            _id: record._id,
            type: record.type,
            source: record.source,
            getThumbURL: record.getThumbURL(),
            getTitle: record.getTitle(i18n),
            getURL: record.getURL(i18n.lang),
        });

        data.records = data.records.map(simplifyRecord);

        const Record = record(type);
        Record.getFacets(i18n, (err, globalFacets) => {
            const tmplData = Object.assign(data, tmplParams, {
                globalFacets,
            });
            res.render("Search", tmplData);
        });
    });
};
