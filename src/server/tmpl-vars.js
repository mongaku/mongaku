/**
 * Some vars to pass in to the templates.
 */

const clone = require("../lib/clone");
const options = require("../lib/options");

module.exports = (app) => {
    const optionsCache = {};
    const blacklist = ["convertors", "searchURLs", "views"];

    app.use((req, res, next) => {
        const {i18n, lang, user, originalUrl} = req;
        let langOptions = optionsCache[lang];

        if (!langOptions) {
            langOptions = clone(options, i18n, blacklist);
            optionsCache[lang] = langOptions;
        }

        Object.assign(res.locals, {
            i18n,
            options: langOptions,
            user,
            originalUrl,
        });

        next();
    });
};
