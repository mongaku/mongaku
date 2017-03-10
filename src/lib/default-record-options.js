module.exports = {
    getSearchPlaceholder: () => "",

    searchNumRecords: 100,

    imagesRequired: true,
    noImages: false,
    noImageSearch: false,

    name: (i18n) => i18n.gettext("Records"),

    recordTitle(record) {
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

    hasImages() {
        return !this.noImages;
    },

    requiresImages() {
        return this.hasImages() && this.imagesRequired;
    },

    hasImageSearch() {
        return this.hasImages() && !this.noImageSearch;
    },
};
