"use strict";

module.exports = {
    getSearchPlaceholder: () => "",

    searchNumRecords: 100,

    name: (i18n) => i18n.gettext("Records"),

    recordTitle(record) {
        return record.title;
    },

    converters: {},

    views: {},

    filters: [],

    display: [],

    sorts: {},

    model: {},

    searchURLs: {},
};
