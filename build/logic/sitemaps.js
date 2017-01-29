"use strict";

var async = require("async");

var options = require("../lib/options");
var record = require("../lib/record");
var urls = require("../lib/urls");

var NUM_PER_SITEMAP = 1000;

module.exports = function (app) {
    return {
        index: function index(req, res) {
            var sitemaps = [];

            async.each(Object.keys(options.types), function (type, callback) {
                var Record = record(type);
                Record.count({}, function (err, total) {
                    if (err) {
                        return callback(err);
                    }

                    for (var i = 0; i < total; i += NUM_PER_SITEMAP) {
                        var url = urls.gen(req.lang, "/sitemap-" + type + "-" + i + ".xml");
                        sitemaps.push("<sitemap><loc>" + url + "</loc></sitemap>");
                    }

                    callback();
                });
            }, function (err) {
                if (err) {
                    return res.status(500).render("Error", {
                        title: err.message
                    });
                }

                var sitemap = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n    <sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n    " + sitemaps.join("\n") + "\n    </sitemapindex>\n    ";

                res.header("Content-Type", "application/xml");
                res.status(200).send(sitemap);
            });
        },
        search: function search(req, res) {
            // Query for the records in Elasticsearch
            var Record = record(req.params.type);
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
                from: req.params.start
            }, function (err, results) {
                /* istanbul ignore if */
                if (err) {
                    return res.status(500).render("Error", {
                        title: err.message
                    });
                }

                var sitemaps = results.hits.hits.map(function (item) {
                    return Record.getURLFromID(req.lang, item._id);
                }).map(function (url) {
                    return "<url><loc>" + url + "</loc></url>";
                });

                var sitemap = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"\n        xmlns:image=\"http://www.google.com/schemas/sitemap-image/1.1\">\n" + sitemaps.join("\n") + "\n</urlset>";

                res.header("Content-Type", "application/xml");
                res.status(200).send(sitemap);
            });
        },
        routes: function routes() {
            app.get("/sitemap.xml", this.index);
            app.get("/sitemap-:type-:start.xml", this.search);
        }
    };
};