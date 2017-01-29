"use strict";

module.exports = {
    getSearchPlaceholder: function getSearchPlaceholder() {
        return "";
    },

    searchNumRecords: 100,

    imagesRequired: true,
    noImages: false,
    noImageSearch: false,

    urlRequired: false,
    noURLs: false,

    name: function name(i18n) {
        return i18n.gettext("Records");
    },

    recordTitle: function recordTitle(record) {
        return record.title;
    },


    defaultImage: "/images/broken-image.svg",

    converters: {},

    views: {},

    filters: [],

    display: [],

    cloneFields: [],

    sorts: {},

    model: {},

    searchURLs: {},

    hasImages: function hasImages() {
        return !this.noImages;
    },
    requiresImages: function requiresImages() {
        return this.hasImages() && this.imagesRequired;
    },
    hasImageSearch: function hasImageSearch() {
        return this.hasImages() && !this.noImageSearch;
    }
};