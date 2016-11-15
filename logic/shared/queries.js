"use strict";

const models = require("../../lib/models");
const metadata = require("../../lib/metadata");
const options = require("../../lib/options");

const getCurType = (fields) => fields.type ||
    Object.keys(options.types)[0];

const defaultQueries = {
    type: {
        value: (fields) => fields.type,
        defaultValue: getCurType,
        secondary: true,
    },

    start: {
        value: (fields) => parseFloat(fields.start),
        defaultValue: () => 0,
        secondary: true,
    },

    rows: {
        value: (fields) => parseFloat(fields.rows),
        defaultValue: (fields) =>
            options.types[getCurType(fields)].searchNumRecords,
        secondary: true,
    },

    sort: {
        value: (fields) => fields.sort,
        defaultValue: (fields) =>
            Object.keys(options.types[getCurType(fields)].sorts)[0],
        secondary: true,
    },

    filter: {
        value: (fields) => fields.filter,
        defaultValue: () => "",
        searchTitle: (value, i18n) => i18n.format(
            i18n.gettext("Query: '%(query)s'"), {query: value}),
        filter: (value) => ({
            query_string: {
                query: value || "*",
                default_operator: "and",
            },
        }),
    },

    source: {
        value: (fields) => fields.source,
        defaultValue: () => undefined,
        searchTitle: (value, i18n) => models("Source").getSource(value)
            .getFullName(i18n.lang),
        url: (value) => models("Source").getSource(value),
        filter: (value) => ({
            match: {
                "source.name": {
                    query: escape(value),
                    operator: "or",
                    zero_terms_query: "all",
                },
            },
        }),
    },

    similar: {
        filters: {
            any: {
                getTitle: (i18n) => i18n.gettext("Similar to Any Record"),
                match: () => ({
                    range: {
                        "similarRecords.score": {
                            gte: 1,
                        },
                    },
                }),
            },

            external: {
                getTitle: (i18n) =>
                    i18n.gettext("Similar to an External Record"),
                match: () => {
                    const sourceIDs = models("Source").getSources()
                        .map((source) => source._id);
                    const should = sourceIDs.map((sourceID) => ({
                        bool: {
                            must: [
                                {
                                    match: {
                                        source: sourceID,
                                    },
                                },
                                {
                                    match: {
                                        "similarRecords.source": {
                                            query: sourceIDs
                                                .filter((id) => id !== sourceID)
                                                .join(" "),
                                            operator: "or",
                                        },
                                    },
                                },
                            ],
                        },
                    }));

                    return {bool: {should}};
                },
            },

            internal: {
                getTitle: (i18n) =>
                    i18n.gettext("Similar to an Internal Record"),
                match: () => {
                    const sourceIDs = models("Source").getSources()
                        .map((source) => source._id);
                    const should = sourceIDs.map((sourceID) => ({
                        bool: {
                            must: [
                                {
                                    match: {
                                        source: sourceID,
                                    },
                                },
                                {
                                    match: {
                                        "similarRecords.source": {
                                            query: sourceID,
                                            operator: "or",
                                        },
                                    },
                                },
                            ],
                        },
                    }));

                    return {bool: {should}};
                },
            },
        },
        value: (fields) => fields.similar,
        defaultValue: () => undefined,
        searchTitle(value, i18n) {
            return this.filters[value].getTitle(i18n);
        },
        filter(value) {
            return this.filters[value].match();
        },
    },

    images: {
        filters: {
            hasImage: {
                getTitle: (i18n) => i18n.gettext("Has An Image"),
                match: () => ({
                    exists: {
                        field: "images",
                    },
                }),
            },

            hasNoImage: {
                getTitle: (i18n) => i18n.gettext("Has No Image"),
                match: () => ({
                    bool: {
                        must_not: [
                            {
                                exists: {
                                    field: "images",
                                },
                            },
                        ],
                    },
                }),
            },
        },
        value: (fields) => fields.images,
        defaultValue: () => undefined,
        searchTitle(value, i18n) {
            return this.filters[value].getTitle(i18n);
        },
        filter(value) {
            return this.filters[value].match();
        },
    },

    created: {
        value: () => 0,
        defaultValue: () => 0,
        secondary: true,
        sort() {
            return {
                asc: [
                    {
                        "created": {
                            order: "asc",
                        },
                    },
                ],

                desc: [
                    {
                        "created": {
                            order: "desc",
                        },
                    },
                ],
            };
        },
    },
};

module.exports = (type) => {
    return Object.assign({}, defaultQueries,
        metadata.model(type));
};
