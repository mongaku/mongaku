// @flow

const qs = require("querystring");

const moment = require("moment");

import type {Source, Options} from "./types.js";

module.exports = (lang: string, options: Options, translations: {
    [message: string]: ?Array<string>,
}) => {
    const urls = require("../lib/urls")(options);

    return {
        getOtherURL(originalUrl: string, locale: string): string {
            return urls.gen(locale, originalUrl);
        },

        URL(path: string, query?: Object): string {
            let url = urls.gen(lang, path);

            if (query) {
                url = url + (url.indexOf("?") >= 0 ? "&" : "?") +
                    qs.stringify(query);
            }

            return url;
        },

        // Format a number using commas
        stringNum(num: number): string {
            // TODO(jeresig): Have a better way to handle this.
            const separator = lang === "en" ? "," : ".";
            const result = (typeof num === "number" ? num : "");
            return result.toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                separator);
        },

        relativeDate(date: Date): string {
            return moment(date).locale(lang).fromNow();
        },

        fixedDate(date: Date): string {
            return moment(date).locale(lang).format("LLL");
        },

        format(fmt: string = "", props: {[key: string]: any}): string {
            return fmt.replace(/%\(\s*([^)]+)\s*\)s/g,
                (m, v) => String(props[v.trim()]));
        },

        gettext(message: string): string {
            const translation = translations[message];

            return translation && translation[1] ?
                translation[1] :
                message;
        },

        getSource(sourceId: string, sources: Array<Source>): ?Source {
            for (const source of sources) {
                if (source._id === sourceId) {
                    return source;
                }
            }
        },
    };
};
