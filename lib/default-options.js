"use strict";

module.exports = {
    getShortTitle: () => "Mongaku",

    getTitle() {
        return this.getShortTitle();
    },

    getSearchPlaceholder: () => "",

    recordTitle(record) {
        return record.title;
    },

    converters: {},

    views: {},

    locales: {},

    filters: [],

    display: [],

    sorts: {},

    model: {},

    searchURLs: {},
};
