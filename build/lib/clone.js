"use strict";

/**
 * A utility for deep-cloning and serializing objects with i18n-centric
 * methods pre-populate.
 */

const cloneDeepWith = require("lodash.clonedeepwith");

module.exports = (object, i18n, blacklist = []) => {
    return cloneDeepWith(object, (value, key, object) => {
        if (blacklist.includes(key)) {
            return null;
        }

        if (typeof value === "function" && value.length === 1 && value[0] === "i18n") {
            return value.call(object, i18n) || "";
        }

        return undefined;
    });
};