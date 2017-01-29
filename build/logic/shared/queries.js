"use strict";

var models = require("../../lib/models");
var metadata = require("../../lib/metadata");
var options = require("../../lib/options");

var getCurType = function getCurType(fields) {
    return fields.type || Object.keys(options.types)[0];
};

var defaultQueries = {
    format: {
        value: function value(fields) {
            return fields.format;
        },
        defaultValue: function defaultValue() {
            return "html";
        },
        secondary: true
    },

    type: {
        value: function value(fields) {
            return fields.type;
        },
        defaultValue: getCurType,
        secondary: true
    },

    start: {
        value: function value(fields) {
            return parseFloat(fields.start);
        },
        defaultValue: function defaultValue() {
            return 0;
        },
        secondary: true
    },

    rows: {
        value: function value(fields) {
            return parseFloat(fields.rows);
        },
        defaultValue: function defaultValue(fields) {
            return options.types[getCurType(fields)].searchNumRecords;
        },
        secondary: true
    },

    sort: {
        value: function value(fields) {
            return fields.sort;
        },
        defaultValue: function defaultValue(fields) {
            return Object.keys(options.types[getCurType(fields)].sorts)[0];
        },
        secondary: true
    },

    filter: {
        value: function value(fields) {
            return fields.filter;
        },
        defaultValue: function defaultValue() {
            return "";
        },
        searchTitle: function searchTitle(value, i18n) {
            return i18n.format(i18n.gettext("Query: '%(query)s'"), { query: value });
        },
        filter: function filter(value) {
            return {
                query_string: {
                    query: value || "*",
                    default_operator: "and"
                }
            };
        }
    },

    source: {
        value: function value(fields) {
            return fields.source;
        },
        defaultValue: function defaultValue() {
            return undefined;
        },
        searchTitle: function searchTitle(value, i18n) {
            return models("Source").getSource(value).getFullName(i18n.lang);
        },
        url: function url(value) {
            return models("Source").getSource(value);
        },
        filter: function filter(value) {
            return {
                match: {
                    "source.name": {
                        query: escape(value),
                        operator: "or",
                        zero_terms_query: "all"
                    }
                }
            };
        }
    },

    similar: {
        filters: {
            any: {
                getTitle: function getTitle(i18n) {
                    return i18n.gettext("Similar to Any Record");
                },
                match: function match() {
                    return {
                        range: {
                            "similarRecords.score": {
                                gte: 1
                            }
                        }
                    };
                }
            },

            external: {
                getTitle: function getTitle(i18n) {
                    return i18n.gettext("Similar to an External Record");
                },
                match: function match() {
                    var sourceIDs = models("Source").getSources().map(function (source) {
                        return source._id;
                    });
                    var should = sourceIDs.map(function (sourceID) {
                        return {
                            bool: {
                                must: [{
                                    match: {
                                        source: sourceID
                                    }
                                }, {
                                    match: {
                                        "similarRecords.source": {
                                            query: sourceIDs.filter(function (id) {
                                                return id !== sourceID;
                                            }).join(" "),
                                            operator: "or"
                                        }
                                    }
                                }]
                            }
                        };
                    });

                    return { bool: { should: should } };
                }
            },

            internal: {
                getTitle: function getTitle(i18n) {
                    return i18n.gettext("Similar to an Internal Record");
                },
                match: function match() {
                    var sourceIDs = models("Source").getSources().map(function (source) {
                        return source._id;
                    });
                    var should = sourceIDs.map(function (sourceID) {
                        return {
                            bool: {
                                must: [{
                                    match: {
                                        source: sourceID
                                    }
                                }, {
                                    match: {
                                        "similarRecords.source": {
                                            query: sourceID,
                                            operator: "or"
                                        }
                                    }
                                }]
                            }
                        };
                    });

                    return { bool: { should: should } };
                }
            }
        },
        value: function value(fields) {
            return fields.similar;
        },
        defaultValue: function defaultValue() {
            return undefined;
        },
        searchTitle: function searchTitle(value, i18n) {
            return this.filters[value].getTitle(i18n);
        },
        filter: function filter(value) {
            return this.filters[value].match();
        }
    },

    images: {
        filters: {
            hasImage: {
                getTitle: function getTitle(i18n) {
                    return i18n.gettext("Has An Image");
                },
                match: function match() {
                    return {
                        exists: {
                            field: "images"
                        }
                    };
                }
            },

            hasNoImage: {
                getTitle: function getTitle(i18n) {
                    return i18n.gettext("Has No Image");
                },
                match: function match() {
                    return {
                        bool: {
                            must_not: [{
                                exists: {
                                    field: "images"
                                }
                            }]
                        }
                    };
                }
            }
        },
        value: function value(fields) {
            return fields.images;
        },
        defaultValue: function defaultValue() {
            return undefined;
        },
        searchTitle: function searchTitle(value, i18n) {
            return this.filters[value].getTitle(i18n);
        },
        filter: function filter(value) {
            return this.filters[value].match();
        }
    },

    created: {
        value: function value() {
            return 0;
        },
        defaultValue: function defaultValue() {
            return 0;
        },
        secondary: true,
        sort: function sort() {
            return {
                asc: [{
                    "created": {
                        order: "asc"
                    }
                }],

                desc: [{
                    "created": {
                        order: "desc"
                    }
                }]
            };
        }
    }
};

module.exports = function (type) {
    return Object.assign({}, defaultQueries, metadata.model(type));
};