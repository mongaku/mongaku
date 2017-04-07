const SimpleString = function(options) {
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

SimpleString.prototype = {
    searchName() {
        return this.options.searchName || this.options.name;
    },

    value(query) {
        return query[this.searchName()];
    },

    fields(value) {
        return {[this.searchName()]: value};
    },

    searchTitle(value, i18n) {
        const displayValue = Array.isArray(value) ? value.join(", ") : value;

        return `${this.options.title(i18n)}: ${displayValue}`;
    },

    sort() {
        return {
            asc: [
                {
                    [`${this.options.name}.keyword`]: {
                        order: "asc",
                    },
                },
            ],

            desc: [
                {
                    [`${this.options.name}.keyword`]: {
                        order: "desc",
                    },
                },
            ],
        };
    },

    schema() {
        const type = {
            type: String,
            es_indexed: true,
            recommended: !!this.options.recommended,
            // A keyword type to use for sorting/aggregations in Elasticsearch
            es_fields: {
                keyword: {type: "keyword"},
            },
        };

        return this.options.multiple ? [type] : type;
    },
};

module.exports = SimpleString;
