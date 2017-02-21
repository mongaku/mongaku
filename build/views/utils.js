"use strict";

const qs = require("querystring");

const moment = require("moment");

var babelPluginFlowReactPropTypes_proptype_Options = require("./types.js").babelPluginFlowReactPropTypes_proptype_Options || require("react").PropTypes.any;

var babelPluginFlowReactPropTypes_proptype_Source = require("./types.js").babelPluginFlowReactPropTypes_proptype_Source || require("react").PropTypes.any;

module.exports = (lang, options) => {
    const urls = require("../lib/urls")(options);

    return {
        getOtherURL(originalUrl, locale) {
            return urls.gen(locale, originalUrl);
        },

        URL(path, query) {
            let url = urls.gen(lang, path);

            if (query) {
                url = url + (url.indexOf("?") >= 0 ? "&" : "?") + qs.stringify(query);
            }

            return url;
        },

        // Format a number using commas
        stringNum(num) {
            // TODO(jeresig): Have a better way to handle this.
            const separator = lang === "en" ? "," : ".";
            const result = typeof num === "number" ? num : "";
            return result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
        },

        relativeDate(date) {
            return moment(date).locale(lang).fromNow();
        },

        fixedDate(date) {
            return moment(date).locale(lang).format("LLL");
        },

        format(fmt = "", props) {
            return fmt.replace(/%\(\s*([^)]+)\s*\)s/g, (m, v) => String(props[v.trim()]));
        },

        getSource(sourceId, sources) {
            for (const source of sources) {
                if (source._id === sourceId) {
                    return source;
                }
            }
        }
    };
};