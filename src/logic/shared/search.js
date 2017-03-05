const sanitize = require("elasticsearch-sanitize");

const record = require("../../lib/record");
const models = require("../../lib/models");
const options = require("../../lib/options");
const urls = require("../../lib/urls")(options);
const {cloneObject, cloneModel} = require("../../lib/clone");

const facets = require("./facets");
const queries = require("./queries");
const searchURL = require("./search-url");
const paramFilter = require("./param-filter");

module.exports = (fields, {originalUrl, i18n}, callback) => {
    // Collect all the values from the request to construct
    // the search URL and matches later
    // Generate the filters and facets which will be fed in to Elasticsearch
    // to build the query filter and aggregations
    const values = {};
    const filters = [];
    const aggregations = {};
    const type = fields.type || Object.keys(options.types)[0];

    if (type && !options.types[type]) {
        return callback(new Error(i18n.gettext("Page Not Found")));
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

    if (!fields.noRedirect && originalUrl) {
        const curURL = urls.gen(i18n.lang, originalUrl);
        const expectedURL = searchURL(i18n.lang, values, true);

        if (expectedURL !== curURL) {
            return callback(null, null, expectedURL);
        }
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
            return callback(new Error(err.message));
        }

        // The number of the last item in this result set
        const end = values.start + results.hits.hits.length;

        // The link to the previous page of search results
        const prevStart = values.start - values.rows;
        const prevLink = (values.start > 0 ? searchURL(i18n.lang,
            Object.assign({}, values, {
                start: (prevStart > 0 ? prevStart : ""),
            }), true) : "");

        // The link to the next page of the search results
        const nextStart = values.start + values.rows;
        const nextLink = (end < results.hits.total ? searchURL(i18n.lang,
            Object.assign({}, values, {
                start: nextStart,
            }), true) : "");

        // Construct a nicer form of the facet data to feed in to
        // the templates
        const facetData = [];

        if (results.aggregations) {
            const typeOptions = options.types[type];
            const minFacetCount = typeOptions.minFacetCount || 1;

            for (const name in aggregations) {
                const aggregation = results.aggregations[name];
                const facet = typeFacets[name];
                const buckets = facet.formatBuckets(aggregation.buckets, i18n)
                    .filter((bucket) => {
                        const url = Object.assign({}, values);
                        for (const param in bucket.url) {
                            const curValue = url[param];
                            const value = bucket.url[param];

                            if (curValue &&
                                    !typeQueries[param].filterMultiple) {
                                return false;
                            }

                            if (Array.isArray(curValue)) {
                                if (curValue.includes(value)) {
                                    return false;
                                }
                                url[param] = curValue.slice(0);
                                url[param].push(value);
                            } else if (curValue) {
                                if (curValue === value) {
                                    return false;
                                }
                                url[param] = [curValue, value];
                            } else {
                                url[param] = value;
                            }
                        }
                        bucket.url = searchURL(i18n.lang, url);
                        return bucket.count >= minFacetCount;
                    });

                // Skip facets that won't filter anything
                if (buckets.length <= 1) {
                    continue;
                }

                facetData.push({
                    field: name,
                    name: facet.title(i18n),
                    buckets,
                });
            }
        }

        // Construct a list of the possible sorts, their translated
        // names and their selected state, for the template.
        const sorts = options.types[values.type].sorts;
        const sortData = Object.keys(sorts).map((id) => ({
            id: id,
            name: sorts[id](i18n),
            selected: values.sort === id,
        }));

        // Figure out the title and breadcrumbs of the results
        let title = i18n.gettext("Search Results");
        const primary = paramFilter(values).primary;
        const breadcrumbs = [];

        for (const param of primary) {
            // Handle custom-generated breadcrumb lists
            if (typeQueries[param].breadcrumb) {
                const crumbs = typeQueries[param]
                    .breadcrumb(values[param], i18n);
                for (const crumb of crumbs) {
                    const rmValues = Object.assign({}, values);

                    for (const param of crumb.params) {
                        delete rmValues[param];
                    }

                    breadcrumbs.push({
                        name: crumb.name,
                        url: searchURL(i18n.lang, rmValues),
                    });
                }

            // Handle when multiple values are specified, we add a crumb
            // for removing every item in the list.
            } else if (Array.isArray(values[param])) {
                for (const value of values[param]) {
                    const rmValues = Object.assign({}, values);
                    rmValues[param] = values[param]
                        .filter((otherValue) => otherValue !== value);

                    breadcrumbs.push({
                        name: typeQueries[param]
                            .searchTitle(value, i18n),
                        url: searchURL(i18n.lang, rmValues),
                    });
                }

            // Handle all other cases (just removing the parameter)
            } else {
                const rmValues = Object.assign({}, values);
                delete rmValues[param];

                breadcrumbs.push({
                    name: typeQueries[param]
                        .searchTitle(values[param], i18n),
                    url: searchURL(i18n.lang, rmValues),
                });
            }
        }

        if (primary.length === 1) {
            const name = primary[0];
            const query = typeQueries[name];
            title = query.searchTitle(values[name], i18n);

        } else {
            title = options.types[values.type].name(i18n);
        }

        // NOTE(jeresig): We use this instead of cloneModel to avoid sending
        // down too much data that we don't need (plus cloning all of those
        // models can be expensive).
        const simplifyRecord = (record) => ({
            _id: record._id,
            type: record.type,
            source: record.source,
            getThumbURL: record.getThumbURL(),
            getTitle: record.getTitle(i18n),
            getURL: record.getURL(i18n.lang),
        });

        callback(null, {
            title,
            breadcrumbs: breadcrumbs.length === 1 ? [] : breadcrumbs,
            sources: models("Source").getSourcesByType(values.type)
                .filter((source) => source.numRecords > 0)
                .map((source) => cloneModel(source, i18n)),
            values,
            queries: cloneObject(typeQueries, i18n),
            type: values.type,
            sorts: sortData,
            facets: facetData,
            records: results.hits.hits.map(simplifyRecord),
            total: results.hits.total,
            start: (results.hits.total > 0 ? values.start + 1 : 0),
            end,
            prev: prevLink,
            next: nextLink,
            // Don't index the search results
            noIndex: true,
        });
    });
};
