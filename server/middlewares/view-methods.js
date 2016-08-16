"use strict";

const qs = require("querystring");

const moment = require("moment");

const urls = require("../../lib/urls");

module.exports = (req, res, next) => {
    const methods = {
        getOtherURL(locale) {
            return urls.gen(locale, req.originalUrl);
        },

        URL(path, query) {
            let url = path.getURL ?
                path.getURL(req.lang) :
                urls.gen(req.lang, path);

            if (query) {
                url = url + (url.indexOf("?") >= 0 ? "&" : "?") +
                    qs.stringify(query);
            }

            return url;
        },

        fullName(item) {
            const locale = req.lang;
            return item.getFullName ?
                item.getFullName(locale) :
                locale === "ja" && item.kanji || item.name || item;
        },

        shortName(item) {
            if (item && item.getShortName) {
                return item.getShortName(req.lang);
            }
        },

        getTitle(item) {
            return item.getTitle(req);
        },

        getShortTitle(item) {
            return item.getShortTitle(req);
        },

        // Format a number using commas
        stringNum(num) {
            // TODO(jeresig): Have a better way to handle this.
            const separator = req.lang === "en" ? "," : ".";
            const result = (typeof num === "number" ? num : "");
            return result.toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                separator);
        },

        relativeDate(date) {
            return moment(date).locale(req.lang).fromNow();
        },

        fixedDate(date) {
            return moment(date).locale(req.lang).format("LLL");
        },
    };

    Object.assign(res.locals, methods);

    next();
};
