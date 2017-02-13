"use strict";

const qs = require("querystring");

const moment = require("moment");

const urls = require("../lib/urls");
const searchURL = require("../logic/shared/search-url");

module.exports = {
    getOtherURL(originalUrl, locale) {
        return urls.gen(locale, originalUrl);
    },

    URL(lang, path, query) {
        let url = urls.gen(lang, path);

        if (query) {
            url = url + (url.indexOf("?") >= 0 ? "&" : "?") + qs.stringify(query);
        }

        return url;
    },

    // Format a number using commas
    stringNum(lang, num) {
        // TODO(jeresig): Have a better way to handle this.
        const separator = lang === "en" ? "," : ".";
        const result = typeof num === "number" ? num : "";
        return result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    },

    relativeDate(lang, date) {
        return moment(date).locale(lang).fromNow();
    },

    fixedDate(lang, date) {
        return moment(date).locale(lang).format("LLL");
    },

    searchURL(lang, params) {
        return searchURL(lang, params);
    },

    format(fmt = "", props) {
        return fmt.replace(/%\(\s*([^)]+)\s*\)s/g, (m, v) => String(props[v.trim()]));
    }
};