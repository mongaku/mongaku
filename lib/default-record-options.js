"use strict";

module.exports = {
    getSearchPlaceholder: () => "",

    searchNumRecords: 100,

    imagesRequired: true,
    noImages: false,
    noImageSearch: false,

    urlRequired: false,
    noURLs: false,

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

    hasImages() {
        return !this.noImages;
    },

    hasImageSearch() {
        return this.hasImages() && !this.noImageSearch;
    },
};
