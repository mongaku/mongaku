"use strict";

module.exports = {
    getShortTitle: () => "Mongaku",

    getTitle() {
        return this.getShortTitle();
    },

    noIndex: false,

    usei18nSubdomain: false,

    maxUploadSize: 10485760,

    imageThumbSize: "220x220",
    imageScaledSize: "440x440",

    views: {},

    locales: {},

    types: {},
};
