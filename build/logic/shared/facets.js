"use strict";

var models = require("../../lib/models");
var metadata = require("../../lib/metadata");

var defaultFacets = {
    source: {
        title: function title(i18n) {
            return i18n.gettext("Source");
        },

        facet: function facet() {
            return {
                terms: {
                    field: "source.raw"
                }
            };
        },

        formatBuckets: function formatBuckets(buckets) {
            return buckets.map(function (bucket) {
                return {
                    text: models("Source").getSource(bucket.key).name,
                    count: bucket.doc_count,
                    url: { source: bucket.key }
                };
            });
        }
    }
};

module.exports = function (type) {
    var facets = Object.assign({}, defaultFacets);
    var model = metadata.model(type);

    for (var name in model) {
        var typeModel = model[name];

        if (typeModel.facet) {
            Object.assign(facets, typeModel.facet());
        }
    }

    return facets;
};