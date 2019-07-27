// @flow

const options = require("../lib/options");
const i18n = require("../lib/i18n");

module.exports = (app: express$Application) => {
    app.use((req: express$Request, res, next) => {
        const {headers, query} = req;

        /* istanbul ignore next */
        const host = headers["x-forwarded-host"] || req.get("host") || "";
        let locale = options.usei18nSubdomain
            ? // Set the locale based upon the subdomain
              (/^\w*/.exec(host) || [""])[0]
            : // Set the locale based upon the ?lang= query string
              typeof query.lang === "string"
                ? query.lang
                : query.lang
                    ? query.lang[0]
                    : options.defaultLocale;

        // Fall back to the default locale if one isn't given, or it's invalid
        if (!options.locales[locale]) {
            locale = options.defaultLocale;
        }

        req.i18n = i18n(locale);
        req.lang = locale;

        next();
    });
};
