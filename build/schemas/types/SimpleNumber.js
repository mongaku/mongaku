"use strict";

const SimpleNumber = function (options) {
    this.options = options;
    /*
    name
    type
    searchName
    title(i18n)
    placeholder(i18n)
    recommended: Bool
    hidden: Bool
    */
};

SimpleNumber.prototype = {
    searchName() {
        return this.options.searchName || this.options.name;
    },

    value(query) {
        return query[this.searchName()];
    },

    fields(value) {
        return { [this.searchName()]: value };
    },

    schema() {
        const type = {
            type: Number,
            es_indexed: true,
            recommended: !!this.options.recommended
        };

        return this.options.multiple ? [type] : type;
    }
};

module.exports = SimpleNumber;