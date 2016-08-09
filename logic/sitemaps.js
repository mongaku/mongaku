"use strict";

const NUM_PER_SITEMAP = 1000;

const models = require("../lib/models");
const urls = require("../lib/urls");

module.exports = function(app) {
    const Record = models("Record");

    return {
        index(req, res) {
            Record.count({}, (err, total) => {
                const sitemaps = [];

                for (let i = 0; i < total; i += NUM_PER_SITEMAP) {
                    const url = urls.gen(req.lang, `/sitemap-search-${i}.xml`);
                    sitemaps.push(`<sitemap><loc>${url}</loc></sitemap>`);
                }

                const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.join("\n")}
</sitemapindex>
`;

                res.header("Content-Type", "application/xml");
                res.status(200).send(sitemap);
            });
        },

        search(req, res) {
            // Query for the records in Elasticsearch
            Record.search({
                bool: {
                    must: [
                        {
                            query_string: {
                                query: "*",
                            },
                        },
                    ],
                },
            }, {
                size: NUM_PER_SITEMAP,
                from: req.params.start,
            }, (err, results) => {
                /* istanbul ignore if */
                if (err) {
                    return res.status(500).render("Error", {
                        title: err.message,
                    });
                }

                const sitemaps = results.hits.hits.map((item) =>
                    Record.getURLFromID(req.lang, item._id))
                    .map((url) => `<url><loc>${url}</loc></url>`);

                const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sitemaps.join("\n")}
</urlset>`;

                res.header("Content-Type", "application/xml");
                res.status(200).send(sitemap);
            });
        },

        routes() {
            app.get("/sitemap.xml", this.index);
            app.get("/sitemap-search-:start.xml", this.search);
        },
    };
};
