"use strict";

const sanitize = require("elasticsearch-sanitize");

const record = require("../../lib/record");
const models = require("../../lib/models");
const urls = require("../../lib/urls");
const options = require("../../lib/options");

const facets = require("./facets");
const queries = require("./queries");
const searchURL = require("./search-url");
const paramFilter = require("./param-filter");

module.exports = (req, res, tmplParams) => {
    // Collect all the values from the request to construct
    // the search URL and matches later
    // Generate the filters and facets which will be fed in to Elasticsearch
    // to build the query filter and aggregations
    const values = {};
    const filters = [];
    const aggregations = {};
    const fields = Object.assign({}, req.query, req.params);
    const type = fields.type || Object.keys(options.types)[0];

    if (type && !options.types[type]) {
        return res.status(404).render("Error", {
            title: req.gettext("Page Not Found"),
        });
    }

    const typeFacets = facets(type);
    const typeQueries = queries(type);

    for (const name in typeQueries) {
        const query = typeQueries[name];
        let value = query.value(fields);

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

    for (const name in typeFacets) {
        aggregations[name] = typeFacets[name].facet();
    }

    const curURL = urls.gen(req.lang, req.originalUrl);
    const expectedURL = searchURL(req, values, true);

    if (expectedURL !== curURL) {
        return res.redirect(expectedURL);
    }

    let sort = null;

    if (values.sort) {
        const sortParts = values.sort.split(".");
        sort = typeQueries[sortParts[0]].sort()[sortParts[1]];
    }

    // Query for the records in Elasticsearch
    record(values.type).search({
        bool: {
            must: filters,
        },
    }, {
        size: values.rows,
        from: values.start,
        aggs: aggregations,
        sort,
        hydrate: true,
    }, (err, results) => {
        /* istanbul ignore if */
        if (err) {
            return res.status(500).render("Error", {
                title: err.message,
            });
        }

        // The number of the last item in this result set
        const end = values.start + results.hits.hits.length;

        // The link to the previous page of search results
        const prevStart = values.start - values.rows;
        const prevLink = (values.start > 0 ? searchURL(req, {
            start: (prevStart > 0 ? prevStart : ""),
        }, true) : "");

        // The link to the next page of the search results
        const nextStart = values.start + values.rows;
        const nextLink = (end < results.hits.total ? searchURL(req, {
            start: nextStart,
        }, true) : "");

        // Construct a nicer form of the facet data to feed in to
        // the templates
        const facetData = [];

        for (const name in aggregations) {
            const aggregation = results.aggregations[name];
            const facet = typeFacets[name];
            const buckets = facet.formatBuckets(aggregation.buckets, req)
                .filter((bucket) => {
                    bucket.url = searchURL(req,
                        Object.assign({}, values, bucket.url));
                    return bucket.count > 0;
                });

            // Skip facets that won't filter anything
            if (buckets.length <= 1) {
                continue;
            }

            const result = {
                name: facet.title(req),
                buckets,
            };

            // Make sure that there aren't too many buckets displaying at
            // any one time, otherwise it gets too long. We mitigate this
            // by splitting the extra buckets into a separate container
            // and then allow the user to toggle its visibility.
            if (result.buckets.length > 10) {
                result.extra = result.buckets.slice(5);
                result.buckets = result.buckets.slice(0, 5);
            }

            facetData.push(result);
        }

        // Construct a list of the possible sorts, their translated
        // names and their selected state, for the template.
        const sorts = options.types[values.type].sorts;
        const sortData = Object.keys(sorts).map((id) => ({
            id: id,
            name: sorts[id](req),
            selected: values.sort === id,
        }));

        // Figure out the title and breadcrumbs of the results
        let title = req.gettext("Search Results");
        const primary = paramFilter(values).primary;
        let breadcrumbs = [];

        if (primary.length > 1) {
            breadcrumbs = primary.map((param) => {
                const rmValues = Object.assign({}, values);
                delete rmValues[param];

                return {
                    name: typeQueries[param].searchTitle(values[param], req),
                    url: searchURL(req, rmValues),
                };
            }).filter((crumb) => crumb.name);

        } else if (primary.length === 1) {
            const name = primary[0];
            const query = typeQueries[name];
            title = query.searchTitle(values[name], req);

        } else {
            // TODO(jeresig): Make this configurable
            title = req.gettext("All Artworks");
        }

        res.render("Search", Object.assign({
            title,
            breadcrumbs,
            sources: models("Source").getSources()
                .filter((source) => source.numRecords > 0),
            values,
            queries: typeQueries,
            type: values.type,
            sorts: sortData,
            facets: facetData,
            records: results.hits.hits,
            total: results.hits.total,
            start: (results.hits.total > 0 ? values.start + 1 : 0),
            end,
            prev: prevLink,
            next: nextLink,
            // Don't index the search results
            noIndex: true,
        }, tmplParams));
    });
};
