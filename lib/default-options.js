"use strict";

module.exports = {
    getShortTitle: () => "Mongaku",

    getTitle() {
        return this.getShortTitle();
    },

    getSearchPlaceholder: () => "",

    searchNumRecords: 100,

    noIndex: false,

    usei18nSubdomain: false,

    maxUploadSize: 10485760,

    imageThumbSize: "220x220",
    imageScaledSize: "440x440",

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
