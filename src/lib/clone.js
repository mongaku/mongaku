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

// Adapted from:
// https://davidwalsh.name/javascript-arguments
const getArgs = (func: Function): Array<string> => {
    const strFunc = func.toString();
    // First match everything inside the function argument parens.
    const args = strFunc.match(/function\s.*?\(([^)]*)\)/) ||
        strFunc.match(/^\(?([^)]*)\)?\s*=>/);

    // Split the arguments string into an array comma delimited.
    return (args ? args[1] : "").split(",")
        // Ensure no inline comments are parsed and trim the whitespace.
        .map((arg) => arg.replace(/\/\*.*\*\//, '').trim())
        // Ensure no undefined values are added.
        .filter((arg) => arg);
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

        if (typeof value === "function") {
            if (value.length === 1) {
                const args = getArgs(value);

                if (args[0] === "i18n") {
                    return value.call(object, i18n) || "";
                } else if (args[0] === "lang") {
                    return value.call(object, i18n.lang) || "";
                }
            } else if (value.length === 0) {
                return value.call(object) || "";
            }
        }

        return undefined;
    });
};
