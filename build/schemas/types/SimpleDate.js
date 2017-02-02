"use strict";

const SimpleDate = function (options) {
    this.options = options;

    this.options.interval = options.interval || "year";
    this.options.format = options.format || "yyyy";

    /*
    name
    type
    searchName
    title(i18n)
    placeholder(i18n)
    multiple: Bool
    recommended: Bool
    interval: String
    format: String
    */
};

SimpleDate.prototype = {
    searchName() {
        return this.options.searchName || this.options.name;
    },

    value(query) {
        return query[this.searchName()];
    },

    fields(value) {
        return { [this.searchName()]: value };
    },

    formatDate(value) {
        return value;
    },

    searchTitle(value, i18n) {
        const title = this.options.title(i18n);
        const date = this.formatDate(value, i18n);
        return `${title}: ${date}`;
    },

    filter(value) {
        return {
            range: {
                [this.options.name]: {
                    gte: value,
                    lte: value,
                    format: this.options.format
                }
            }
        };
    },

    facet() {
        return {
            [this.options.name]: {
                title: i18n => this.options.title(i18n),

                facet: () => ({
                    date_histogram: {
                        field: this.options.name,
                        interval: this.options.interval,
                        format: this.options.format
                    }
                }),

                formatBuckets: (buckets, i18n) => buckets.map(bucket => ({
                    text: bucket.key_as_string,
                    count: bucket.doc_count,
                    url: {
                        [this.options.name]: this.formatDate(bucket.key_as_string, i18n)
                    }
                })).reverse()
            }
        };
    },

    schema() {
        const type = {
            type: Date,
            es_indexed: true,
            recommended: !!this.options.recommended
        };

        return this.options.multiple ? [type] : type;
    }
};

module.exports = SimpleDate;