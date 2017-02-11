// @flow

/**
 * A utility for deep-cloning and serializing objects with i18n-centric
 * methods pre-populate.
 */

const cloneDeepWith = require("lodash.clonedeepwith");

type i18nObject = {
    lang: string,
    gettext: (text: string) => string,
    format: (text: string, options: {}) => string,
};

module.exports = (
    object: {},
    i18n: i18nObject,
    blacklist: Array<string> = [],
) => {
    return cloneDeepWith(object, (value, key, object) => {
        if (blacklist.includes(key)) {
            return null;
        }

        if (typeof value === "function" && value.length === 1) {
            if (value[0] === "i18n") {
                return value.call(object, i18n) || "";
            } else if (value[0] === "lang") {
                return value.call(object, i18n.lang) || "";
            }
        }

        return undefined;
    });
};
