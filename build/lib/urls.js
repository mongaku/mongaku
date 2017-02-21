"use strict";

var babelPluginFlowReactPropTypes_proptype_Options = require("../views/types.js").babelPluginFlowReactPropTypes_proptype_Options || require("react").PropTypes.any;

module.exports = options => {
    const defaultLocale = Object.keys(options.locales)[0] || "en";

    const genURL = (lang, urlBase, origPath) => {
        let suffix = "";
        let base = urlBase;
        let path = origPath;

        // See if we're on a non-default lang
        if (lang && lang !== defaultLocale) {
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

            // Strip the lang= query param if you're generating a default lang URL
        } else if (lang === defaultLocale && !options.usei18nSubdomain) {
            path = path.replace(/lang=\w+&?/, "").replace(/\?$/, "");
        }

        // Make sure we don't have an accidental // in the URL
        return base.replace(/\/$/, "") + path + suffix;
    };

    return {
        // Generate a URL given a path and a lang
        gen(lang, path) {
            return genURL(lang, options.baseURL, path);
        },

        // Generate a URL to a data file, given a path
        genData(filePath) {
            return genURL(null, options.baseDataURL, filePath);
        }
    };
};