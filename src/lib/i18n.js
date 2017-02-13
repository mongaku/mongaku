// @flow

const fs = require("fs");
const path = require("path");

const options = require("./options");

const translations = {};
const translationsDir = path.resolve(process.cwd(),
    options.transltionsDir || "translations");
const defaultLocale = Object.keys(options.locales)[0];

for (const locale in options.locales) {
    if (locale === defaultLocale) {
        continue;
    }

    const file = path.resolve(translationsDir, locale, "messages.json");
    try {
        const {messages} = JSON.parse(fs.readFileSync(file, "utf8"));
        translations[locale] = messages;
    } catch (e) {
        console.error(`Error loading translation locale: ${locale}.`);
    }
}

module.exports = (lang: string) => {
    return {
        lang,
        defaultLocale,

        gettext(message: string) {
            if (!translations[lang]) {
                if (lang !== defaultLocale) {
                    console.error(`Unknown locale: ${lang}.`);
                }

                return message;
            }

            const translation = translations[lang][message];

            return translation && translation[1].length ?
                translation[1] :
                message;
        },
    };
};
