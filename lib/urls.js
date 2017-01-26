const path = require("path");

const config = require("./config");
const options = require("./options");

const defaultLocale = Object.keys(options.locales)[0] || "en";

const genURL = (locale, urlBase, origPath) => {
    let suffix = "";
    let base = urlBase;
    let path = origPath;

    // See if we're on a non-default locale
    if (locale && locale !== defaultLocale) {
        // Use a sub-domain, if one is requested
        /* istanbul ignore if */
        if (options.usei18nSubdomain) {
            if (base.indexOf(`://${locale}.`) < 0) {
                base = urlBase.replace("://", `://${locale}.`);
            }

        // Otherwise fall back to using a query string
        } else {
            if (path.indexOf(`lang=`) >= 0) {
                path = path.replace(/lang=\w+/, `lang=${locale}`);

            } else {
                const prefix = /\?/.test(path) ? "&" : "?";
                suffix = `${prefix}lang=${locale}`;
            }
        }

    // Strip the lang= query param if you're generating a default locale URL
    } else if (locale === defaultLocale && !options.usei18nSubdomain) {
        path = path.replace(/lang=\w+&?/, "").replace(/\?$/, "");
    }

    // Make sure we don't have an accidental // in the URL
    return base.replace(/\/$/, "") + path + suffix;
};

module.exports = {
    // Generate a URL given a path and a locale
    gen(locale, path) {
        return genURL(locale, config.BASE_URL, path);
    },

    // Generate a URL to a data file, given a path
    genData(filePath) {
        return genURL(null, config.BASE_DATA_URL, filePath);
    },

    // Generate a path to a data file, given a path
    genLocalFile(filePath) {
        return path.resolve(config.BASE_DATA_DIR, filePath);
    },
};
