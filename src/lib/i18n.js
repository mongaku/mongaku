// @flow

const fs = require("fs");
const path = require("path");

const options = require("./options");
const config = require("./config");

const translationsMap = {};

for (const locale in options.locales) {
    if (locale === options.defaultLocale) {
        continue;
    }

    const file = path.resolve(config.TRANSLATIONS_DIR, locale, "messages.json");
    try {
        const {messages} = JSON.parse(fs.readFileSync(file, "utf8"));
        translationsMap[locale] = messages;
    } catch (e) {
        console.error(`Error loading translation locale: ${locale}.`);
    }
}

module.exports = (lang: string) => {
    const translations = translationsMap[lang] || {};

    return {
        lang,
        defaultLocale: options.defaultLocale,
        translations,

        gettext(message: string) {
            const translation = translations[message];

            return translation && translation[1] ? translation[1] : message;
        },

        format(msg: string, fields: {}) {
            return msg.replace(/%\((.*?)\)s/g, (all, name) => fields[name]);
        },
    };
};
