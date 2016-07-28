"use strict";

const pd = require("parse-dimensions");
const React = require("react");

const DimensionFilter = React.createFactory(
    require("../../views/types/filter/Dimension.jsx"));
const DimensionDisplay = React.createFactory(
    require("../../views/types/view/Dimension.jsx"));

const numRange = (bucket) => bucket.to ?
    `${bucket.from || 0}-${bucket.to}${bucket.unit}` :
    `${bucket.from}${bucket.unit}+`;

const Dimension = function(options) {
    this.options = options;
    /*
    name
    searchName
    title(i18n)
    widthTitle(i18n)
    heightTitle(i18n)
    placeholder(i18n)
    */
};

Dimension.prototype = {
    searchName() {
        return this.options.searchName || this.options.name;
    },

    value(query) {
        const config = require("../../lib/config");

        const heightMin = query[`${this.searchName()}.heightMin`];
        const heightMax = query[`${this.searchName()}.heightMax`];
        const widthMin = query[`${this.searchName()}.widthMin`];
        const widthMax = query[`${this.searchName()}.widthMax`];
        const unit = query[`${this.searchName()}.unit`] ||
            config.DEFAULT_SEARCH_UNIT || config.DEFAULT_UNIT;

        if (heightMin || heightMax || widthMin || widthMax) {
            return {heightMin, heightMax, widthMin, widthMax, unit};
        }
    },

    searchTitle(value, i18n) {
        const config = require("../../lib/config");

        const defaultUnit = config.DEFAULT_UNIT;
        const unit = value.unit || config.DEFAULT_SEARCH_UNIT ||
            config.DEFAULT_UNIT;
        const title = [];

        if (value.heightMin || value.heightMax) {
            const name = this.options.heightTitle(i18n);
            const range = numRange({
                from: pd.convertNumber(value.heightMin, defaultUnit, unit),
                to: pd.convertNumber(value.heightMax, defaultUnit, unit),
                unit,
            });
            title.push(`${name}: ${range}`);
        }

        if (value.widthMin || value.widthMax) {
            const name = this.options.widthTitle(i18n);
            const range = numRange({
                from: pd.convertNumber(value.widthMin, defaultUnit, unit),
                to: pd.convertNumber(value.widthMax, defaultUnit, unit),
                unit,
            });
            title.push(`${name}: ${range}`);
        }

        return title.join(", ");
    },

    fields(value) {
        const config = require("../../lib/config");

        const ret = {};
        const defaultUnit = config.DEFAULT_SEARCH_UNIT || config.DEFAULT_UNIT;

        if (value.heightMin) {
            ret[`${this.searchName()}.heightMin`] = value.heightMin;
        }

        if (value.heightMax) {
            ret[`${this.searchName()}.heightMax`] = value.heightMax;
        }

        if (value.widthMin) {
            ret[`${this.searchName()}.widthMin`] = value.widthMin;
        }

        if (value.widthMax) {
            ret[`${this.searchName()}.widthMax`] = value.widthMax;
        }

        if (value.unit && value.unit !== defaultUnit) {
            ret[`${this.searchName()}.unit`] = value.unit;
        }

        return ret;
    },

    breadcrumb(value, i18n) {
        const breadcrumbs = [];

        if (value.heightMin || value.heightMax) {
            const title = this.options.heightTitle(i18n);
            const range = numRange({
                from: value.heightMin,
                to: value.heightMax,
                unit: value.unit,
            });

            breadcrumbs.push({
                title: `${title}: ${range}`,
                url: {
                    [this.options.name]: {
                        heightMin: value.heightMin,
                        heightMax: value.heightMax,
                    },
                },
            });
        }

        if (value.widthMin || value.widthMax) {
            const title = this.options.widthTitle(i18n);
            const range = numRange({
                from: value.widthMin,
                to: value.widthMax,
                unit: value.unit,
            });

            breadcrumbs.push({
                title: `${title}: ${range}`,
                url: {
                    [this.options.name]: {
                        widthMin: value.widthMin,
                        widthMax: value.widthMax,
                    },
                },
            });
        }

        return breadcrumbs;
    },

    filter(value) {
        const config = require("../../lib/config");

        const filters = [];

        if (value.widthMin) {
            filters.push({
                range: {
                    [`${this.options.name}.width`]: {
                        gte: pd.convertNumber(
                            parseFloat(value.widthMin), value.unit,
                                config.DEFAULT_UNIT),
                    },
                },
            });
        }

        if (value.widthMax) {
            filters.push({
                range: {
                    [`${this.options.name}.width`]: {
                        lte: pd.convertNumber(
                            parseFloat(value.widthMax), value.unit,
                                config.DEFAULT_UNIT),
                    },
                },
            });
        }

        if (value.heightMin) {
            filters.push({
                range: {
                    [`${this.options.name}.height`]: {
                        gte: pd.convertNumber(
                            parseFloat(value.heightMin), value.unit,
                                config.DEFAULT_UNIT),
                    },
                },
            });
        }

        if (value.heightMax) {
            filters.push({
                range: {
                    [`${this.options.name}.height`]: {
                        lte: pd.convertNumber(
                            parseFloat(value.heightMax), value.unit,
                                config.DEFAULT_UNIT),
                    },
                },
            });
        }

        return filters;
    },

    facet() {
        const config = require("../../lib/config");

        const defaultUnit = config.DEFAULT_UNIT;
        const unit = config.DEFAULT_SEARCH_UNIT || config.DEFAULT_UNIT;

        const formatFacetBucket = (bucket) => {
            const text = numRange({
                from: pd.convertNumber(bucket.from, defaultUnit, unit),
                to: pd.convertNumber(bucket.to, defaultUnit, unit),
                unit,
            });

            return {
                text,
                count: bucket.doc_count,
                url: {
                    [this.options.name]: {
                        widthMin: bucket.from,
                        widthMax: bucket.to,
                        unit,
                    },
                },
            };
        };

        const ranges = [
            { to: 99 },
            { from: 100, to: 199 },
            { from: 200, to: 299 },
            { from: 300, to: 399 },
            { from: 400, to: 499 },
            { from: 500, to: 599 },
            { from: 600, to: 699 },
            { from: 700, to: 799 },
            { from: 800, to: 899 },
            { from: 900, to: 999 },
            { from: 1000, to: 1249 },
            { from: 1250, to: 1599 },
            { from: 1500, to: 1749 },
            { from: 1750, to: 1999 },
            { from: 2000 },
        ];

        return {
            [`${this.options.name}.width`]: {
                title: (i18n) => this.options.widthTitle(i18n),

                facet: () => ({
                    range: {
                        field: `${this.options.name}.width`,
                        ranges,
                    },
                }),

                formatBuckets: (buckets) => buckets.map(formatFacetBucket),
            },

            [`${this.options.name}.height`]: {
                title: (i18n) => this.options.heightTitle(i18n),

                facet: () => ({
                    range: {
                        field: `${this.options.name}.height`,
                        ranges,
                    },
                }),

                formatBuckets: (buckets) => buckets.map(formatFacetBucket),
            },
        };
    },

    renderFilter(value, i18n) {
        return DimensionFilter({
            name: this.options.name,
            searchName: this.options.searchName,
            placeholder: this.options.placeholder(i18n),
            heightTitle: this.options.heightTitle(i18n),
            widthTitle: this.options.widthTitle(i18n),
            value,
        });
    },

    renderView(value) {
        const config = require("../../lib/config");

        return DimensionDisplay({
            name: this.options.name,
            value,
            defaultUnit: config.DEFAULT_SEARCH_UNIT,
        });
    },

    schema(Schema) {
        const config = require("../../lib/config");

        const DimensionSchema = new Schema({
            // An ID for the dimension, computed from the original +
            // width/height properties before validation.
            _id: String,

            // The source string from which the dimensions were generated
            original: String,

            // The width/height/depth of the object (stored in millimeters)
            width: {type: Number, es_indexed: true},
            height: {type: Number, es_indexed: true},
            depth: {type: Number, es_indexed: true},

            // A label for the dimensions (e.g. "with frame")
            label: String,

            // The unit for the dimensions (defaults to millimeters)
            unit: {type: String, es_indexed: true},
        });

        DimensionSchema.methods = {
            toJSON() {
                const obj = this.toObject();
                delete obj.original;
                return obj;
            },
        };

        // Dynamically generate the _id attribute
        DimensionSchema.pre("validate", function(next) {
            this._id = this.original ||
                [this.width, this.height, this.unit].join(",");
            next();
        });

        return {
            type: [DimensionSchema],
            convert: (obj) => typeof obj === "string" ?
                pd.parseDimension(obj, true, config.DEFAULT_UNIT) :
                pd.convertDimension(obj, config.DEFAULT_UNIT),
            validateArray: (val) => (val.width || val.height) && val.unit,
            validationMsg: (req) => req.gettext("Dimensions must have a " +
                "unit specified and at least a width or height."),
        };
    },
};

module.exports = Dimension;
