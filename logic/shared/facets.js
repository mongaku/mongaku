"use strict";

const models = require("../../lib/models");
const metadata = require("../../lib/metadata");

const defaultFacets = {
    source: {
        title: (i18n) => i18n.gettext("Source"),

        facet: () => ({
            terms: {
                field: "source",
            },
        }),

        formatBuckets: (buckets) => buckets.map((bucket) => ({
            text: models("Source").getSource(bucket.key).name,
            count: bucket.doc_count,
            url: {source: bucket.key},
        })),
    },
};

module.exports = (type) => {
    const facets = Object.assign({}, defaultFacets);
    const model = metadata.model(type);

    for (const name in model) {
        const typeModel = model[name];

        if (typeModel.facet) {
            Object.assign(facets, typeModel.facet());
        }
    }

    return facets;
};
