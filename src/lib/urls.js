// @flow

import type {Options} from "../views/types.js";

module.exports = (options: Options) => {
    const genURL = (lang: ?string, urlBase: string, origPath: string) => {
        let suffix = "";
        let base = urlBase;
        let path = origPath;

        // See if we're on a non-default lang
        if (lang && lang !== options.defaultLocale) {
            // Use a sub-domain, if one is requested
            /* istanbul ignore if */
            if (options.usei18nSubdomain) {
                if (base.indexOf(`://${lang}.`) < 0) {
                    base = urlBase.replace("://", `://${lang}.`);
                }

                // Otherwise fall back to using a query string
            } else {
                if (path.indexOf(`lang=`) >= 0) {
                    path = path.replace(/lang=\w+/, `lang=${lang}`);
                } else {
                    const prefix = /\?/.test(path) ? "&" : "?";
                    suffix = `${prefix}lang=${lang}`;
                }
            }
        } else if (
            lang === options.defaultLocale &&
            !options.usei18nSubdomain
        ) {
            // Strip the lang= query param if you're generating a default
            // lang URL
            path = path.replace(/lang=\w+&?/, "").replace(/\?$/, "");
        }

        // Make sure we don't have an accidental // in the URL
        return base.replace(/\/$/, "") + path + suffix;
    };

    return {
        // Generate a URL given a path and a lang
        gen(lang: string, path: string) {
            return genURL(lang, options.baseURL, path);
        },

        // Generate a URL to a data file, given a path
        genData(filePath: string) {
            return genURL(null, options.baseDataURL, filePath);
        },

        genStatic(filePath: string) {
            return genURL(null, options.baseStaticURL, filePath);
        },
    };
};
