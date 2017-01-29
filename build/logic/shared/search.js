"use strict";

var sanitize = require("elasticsearch-sanitize");

var record = require("../../lib/record");
var models = require("../../lib/models");
var urls = require("../../lib/urls");
var options = require("../../lib/options");

var facets = require("./facets");
var queries = require("./queries");
var searchURL = require("./search-url");
var paramFilter = require("./param-filter");

module.exports = function (fields, req, callback) {
    // Collect all the values from the request to construct
    // the search URL and matches later
    // Generate the filters and facets which will be fed in to Elasticsearch
    // to build the query filter and aggregations
    var values = {};
    var filters = [];
    var aggregations = {};
    var type = fields.type || Object.keys(options.types)[0];

    if (type && !options.types[type]) {
        return callback(new Error(req.gettext("Page Not Found")));
    }

    var typeFacets = facets(type);
    var typeQueries = queries(type);

    for (var name in typeQueries) {
        var query = typeQueries[name];
        var value = query.value(fields);

        if (!value && typeQueries[name].defaultValue) {
            value = typeQueries[name].defaultValue(fields);
        }

        if (value !== undefined) {
            values[name] = value;

            if (query.filter) {
                filters.push(query.filter(value, sanitize));
            }
        }
    }

    for (var _name in typeFacets) {
        aggregations[_name] = typeFacets[_name].facet();
    }

    if (!fields.noRedirect) {
        var curURL = urls.gen(req.lang, req.originalUrl);
        var expectedURL = searchURL(req, values, true);

        if (expectedURL !== curURL) {
            return callback(null, null, expectedURL);
        }
    }

    var sort = null;

    if (values.sort) {
        var sortParts = values.sort.split(".");
        sort = typeQueries[sortParts[0]].sort()[sortParts[1]];
    }

    // Query for the records in Elasticsearch
    record(values.type).search({
        bool: {
            must: filters
        }
    }, {
        size: values.rows,
        from: values.start,
        aggs: aggregations,
        sort: sort,
        hydrate: true
    }, function (err, results) {
        /* istanbul ignore if */
        if (err) {
            return callback(new Error(err.message));
        }

        // The number of the last item in this result set
        var end = values.start + results.hits.hits.length;

        // The link to the previous page of search results
        var prevStart = values.start - values.rows;
        var prevLink = values.start > 0 ? searchURL(req, Object.assign({}, values, {
            start: prevStart > 0 ? prevStart : ""
        }), true) : "";

        // The link to the next page of the search results
        var nextStart = values.start + values.rows;
        var nextLink = end < results.hits.total ? searchURL(req, Object.assign({}, values, {
            start: nextStart
        }), true) : "";

        // Construct a nicer form of the facet data to feed in to
        // the templates
        var facetData = [];

        if (results.aggregations) {
            for (var _name2 in aggregations) {
                var aggregation = results.aggregations[_name2];
                var facet = typeFacets[_name2];
                var buckets = facet.formatBuckets(aggregation.buckets, req).filter(function (bucket) {
                    bucket.url = searchURL(req, Object.assign({}, values, bucket.url));
                    return bucket.count > 0;
                });

                // Skip facets that won't filter anything
                if (buckets.length <= 1) {
                    continue;
                }

                facetData.push({
                    field: _name2,
                    name: facet.title(req),
                    buckets: buckets
                });
            }
        }

        // Construct a list of the possible sorts, their translated
        // names and their selected state, for the template.
        var sorts = options.types[values.type].sorts;
        var sortData = Object.keys(sorts).map(function (id) {
            return {
                id: id,
                name: sorts[id](req),
                selected: values.sort === id
            };
        });

        // Figure out the title and breadcrumbs of the results
        var title = req.gettext("Search Results");
        var primary = paramFilter(values).primary;
        var breadcrumbs = [];

        if (primary.length > 1) {
            breadcrumbs = primary.map(function (param) {
                var rmValues = Object.assign({}, values);
                delete rmValues[param];

                return {
                    name: typeQueries[param].searchTitle(values[param], req),
                    url: searchURL(req, rmValues)
                };
            }).filter(function (crumb) {
                return crumb.name;
            });
        } else if (primary.length === 1) {
            var _name3 = primary[0];
            var _query = typeQueries[_name3];
            title = _query.searchTitle(values[_name3], req);
        } else {
            title = options.types[values.type].name(req);
        }

        callback(null, {
            title: title,
            breadcrumbs: breadcrumbs,
            sources: models("Source").getSourcesByType(values.type).filter(function (source) {
                return source.numRecords > 0;
            }),
            values: values,
            queries: typeQueries,
            type: values.type,
            sorts: sortData,
            facets: facetData,
            records: results.hits.hits,
            total: results.hits.total,
            start: results.hits.total > 0 ? values.start + 1 : 0,
            end: end,
            prev: prevLink,
            next: nextLink,
            // Don't index the search results
            noIndex: true
        });
    });
};