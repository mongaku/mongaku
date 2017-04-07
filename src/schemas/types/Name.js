const YearRange = require("./YearRange.js");

const Name = function(options) {
    this.options = options;
    /*
    name
    type
    searchName
    title(i18n)
    placeholder(i18n)
    multiple: Boolean
    */
};

Name.prototype = {
    searchName() {
        return this.options.searchName || this.options.name;
    },

    value(query) {
        return query[this.searchName()];
    },

    defaultValue() {
        return "";
    },

    fields(value) {
        return {[this.searchName()]: value.name || value.original || value};
    },

    title(i18n) {
        return this.options.title(i18n);
    },

    searchTitle(value, i18n) {
        const title = this.options.title(i18n);
        let name = value;
        if (Array.isArray(value)) {
            name = value.join(", ");
        }
        return `${title}: ${name}`;
    },

    filter(value, sanitize) {
        const query = Array.isArray(value) ? value : [value];

        return {
            bool: {
                must: query.map(value => ({
                    multi_match: {
                        fields: [`${this.options.name}.name`],
                        query: sanitize(value),
                        operator: "and",
                        zero_terms_query: "all",
                    },
                })),
            },
        };
    },

    facet() {
        return {
            [this.options.name]: {
                title: i18n => this.options.title(i18n),

                // TODO: Make the number of facets configurable
                facet: () => ({
                    terms: {
                        field: `${this.options.name}.name.raw`,
                        size: 50,
                    },
                }),

                formatBuckets: buckets =>
                    buckets.map(bucket => ({
                        text: bucket.key,
                        count: bucket.doc_count,
                        url: {
                            [this.options.name]: {
                                name: bucket.key,
                            },
                        },
                    })),
            },
        };
    },

    schema(Schema) {
        const NameSchema = new Schema({
            // An ID for the name, computed from the original + name properties
            // before validation.
            _id: String,

            // The original string from which the rest of the values were
            // derived
            original: String,

            // The locale for the string (e.g. 'en', 'ja')
            locale: String,

            // Any sort of name parsing options
            settings: Schema.Types.Mixed,

            // The English form of the full artist's name
            name: {
                type: String,
                es_indexed: true,
                es_type: "string",
                // A raw name to use for building aggregations in Elasticsearch
                es_fields: {
                    name: {type: "string", index: "analyzed"},
                    raw: {type: "string", index: "not_analyzed"},
                },
                recommended: true,
            },

            // Same but in ascii (for example: Hokushō becomes Hokushoo)
            ascii: String,
            // Same but with diacritics stripped (Hokushō becomes Hokusho)
            plain: {
                type: String,
                es_indexed: true,
            },
            // The English form of the given name
            given: String,
            // The English form of the middle name
            middle: String,
            // The English form of the surname
            surname: String,
            // A number representing the generation of the artist
            generation: Number,
            // A pseudonym for the person
            pseudonym: {
                type: String,
                es_indexed: true,
            },
            // Is the artist unknown/unattributed
            unknown: Boolean,
            // Is this artist part of a school
            school: Boolean,
            // Was this work done in the style of, or after, an artist
            after: Boolean,
            // Is this work attributed to an artist
            attributed: Boolean,
            // Date when the name was used
            dates: YearRange.prototype.schema(Schema),
        });
        // Dynamically generate the _id attribute
        NameSchema.pre("validate", function(next) {
            this._id = this.original || this.name;
            next();
        });
        return {
            type: [NameSchema],
            convert: obj => (typeof obj === "string" ? {name: obj} : obj),
        };
    },
};
module.exports = Name;
