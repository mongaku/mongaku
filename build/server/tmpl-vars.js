"use strict";

/**
 * Some vars to pass in to the templates.
 */

const cloneDeepWith = require('lodash.clonedeepwith');

const options = require("../lib/options");

module.exports = app => {
    const optionsCache = {};
    const blacklist = ["convertors", "searchURLs", "views"];

    app.use((req, res, next) => {
        const { lang, user, originalUrl } = req;
        let langOptions = optionsCache[lang];

        if (!langOptions) {
            langOptions = cloneDeepWith(options, (value, key, object) => {
                if (blacklist.includes(key)) {
                    return null;
                }

                if (typeof value === "function") {
                    return value.call(object, req) || "";
                }

                return undefined;
            });

            optionsCache[lang] = langOptions;
        }

        Object.assign(res.locals, {
            options: optionsCache,
            user,
            originalUrl
        });

        next();
    });
};