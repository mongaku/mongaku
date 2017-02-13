const options = require("../lib/options");
const i18n = require("../lib/i18n");

const defaultLocale = Object.keys(options.locales)[0] || "en";

module.exports = (app) => {
    app.use((req, res, next) => {
        const {headers, query} = req;

        /* istanbul ignore next */
        const host = headers["x-forwarded-host"] || req.get("host");
        let locale = options.usei18nSubdomain ?
            // Set the locale based upon the subdomain
            /^\w*/.exec(host)[0] :

            // Set the locale based upon the ?lang= query string
            query.lang;

        // Fall back to the default locale if one isn't given, or it's invalid
        if (!options.locales[locale]) {
            locale = defaultLocale;
        }

        req.i18n = i18n(locale);
        req.lang = locale;

        next();
    });
};
