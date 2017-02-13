"use strict";

const async = require("async");

const options = require("../lib/options");
const record = require("../lib/record");
const urls = require("../lib/urls");

const NUM_PER_SITEMAP = 1000;

module.exports = function (app) {
    return {
        index({ lang }, res) {
            const sitemaps = [];

            async.each(Object.keys(options.types), (type, callback) => {
                const Record = record(type);
                Record.count({}, (err, total) => {
                    if (err) {
                        return callback(err);
                    }

                    for (let i = 0; i < total; i += NUM_PER_SITEMAP) {
                        const url = urls.gen(lang, `/sitemap-${type}-${i}.xml`);
                        sitemaps.push(`<sitemap><loc>${url}</loc></sitemap>`);
                    }

                    callback();
                });
            }, err => {
                if (err) {
                    return res.status(500).render("Error", {
                        title: err.message
                    });
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

        search({ params, lang }, res) {
            // Query for the records in Elasticsearch
            const Record = record(params.type);
            Record.search({
                bool: {
                    must: [{
                        query_string: {
                            query: "*"
                        }
                    }]
                }
            }, {
                size: NUM_PER_SITEMAP,
                from: params.start
            }, (err, results) => {
                /* istanbul ignore if */
                if (err) {
                    return res.status(500).render("Error", {
                        title: err.message
                    });
                }

                const sitemaps = results.hits.hits.map(item => Record.getURLFromID(lang, item._id)).map(url => `<url><loc>${url}</loc></url>`);

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
            app.get("/sitemap-:type-:start.xml", this.search);
        }
    };
};