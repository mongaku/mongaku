const validUrl = require("valid-url");

const URL = function(options) {
    this.options = options;
    /*
    name
    type
    searchName
    title(i18n)
    placeholder(i18n)
    multiple: Bool
    recommended: Bool
    */
};

URL.prototype = {
    searchName() {
        return this.options.searchName || this.options.name;
    },

    value(query) {
        return query[this.searchName()];
    },

    fields(value) {
        return {[this.searchName()]: value};
    },

    searchTitle(value) {
        return Array.isArray(value) ?
            value.join(", ") :
            value;
    },

    schema() {
        const type = {
            type: String,
            es_indexed: false,
            recommended: !!this.options.recommended,
            required: !!this.options.required,
            validate: (v) => validUrl.isHttpsUri(v) || validUrl.isHttpUri(v),
            validationMsg: (i18n) => i18n.gettext("Field must be properly-" +
                "formatted URL."),
        };

        return this.options.multiple ? [type] : type;
    },
};

module.exports = URL;
