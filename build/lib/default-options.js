"use strict";

module.exports = {
    getShortTitle: function getShortTitle() {
        return "Mongaku";
    },

    getTitle: function getTitle() {
        return this.getShortTitle();
    },


    noIndex: false,

    usei18nSubdomain: false,

    maxUploadSize: 10485760,

    imageThumbSize: "220x220",
    imageScaledSize: "440x440",

    views: {},

    locales: {},

    types: {}
};