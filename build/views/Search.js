"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react");

var metadata = require("../lib/metadata");
var options = require("../lib/options");

var Page = require("./Page.js");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

var _require = require("./Wrapper.js"),
    childContextTypes = _require.childContextTypes;

var Filters = function Filters(_ref, _ref2) {
    var type = _ref.type,
        globalFacets = _ref.globalFacets;
    var gettext = _ref2.gettext;

    var model = metadata.model(type);

    return React.createElement(
        "div",
        null,
        options.types[type].filters.map(function (type) {
            var typeSchema = model[type];

            if (!typeSchema.renderFilter) {
                return null;
            }

            var values = (globalFacets[type] || []).map(function (bucket) {
                return bucket.text;
            }).sort();

            return React.createElement(
                "div",
                { key: type },
                typeSchema.renderFilter(values[type], values, { gettext: gettext })
            );
        })
    );
};

Filters.propTypes = {
    title: require("react").PropTypes.string.isRequired,
    url: require("react").PropTypes.string,
    type: require("react").PropTypes.string.isRequired,
    total: require("react").PropTypes.number.isRequired,
    start: require("react").PropTypes.number,
    end: require("react").PropTypes.number,
    prev: require("react").PropTypes.string,
    next: require("react").PropTypes.string,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getShortName: require("react").PropTypes.func.isRequired
    })),
    sorts: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired
    })),
    breadcrumbs: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        name: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired
    })),
    facets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        field: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        buckets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
            count: require("react").PropTypes.number.isRequired,
            text: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired
        })).isRequired
    })),
    records: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired,
        getTitle: require("react").PropTypes.func.isRequired,
        getSource: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired,
    globalFacets: require("react").PropTypes.shape({}).isRequired,
    values: require("react").PropTypes.shape({}).isRequired,
    queries: require("react").PropTypes.shape({}).isRequired
};
Filters.contextTypes = childContextTypes;

var SourceFilter = function SourceFilter(_ref3, _ref4) {
    var values = _ref3.values,
        sources = _ref3.sources;
    var gettext = _ref4.gettext;
    return React.createElement(
        "div",
        { className: "form-group" },
        React.createElement(
            "label",
            { htmlFor: "source", className: "control-label" },
            gettext("Source")
        ),
        React.createElement(
            "select",
            { name: "source", style: { width: "100%" },
                className: "form-control select2-select",
                defaultValue: values.source,
                "data-placeholder": gettext("Filter by source...")
            },
            sources && sources.map(function (source) {
                return React.createElement(
                    "option",
                    { value: source._id, key: source._id },
                    source.name
                );
            })
        )
    );
};

SourceFilter.propTypes = {
    title: require("react").PropTypes.string.isRequired,
    url: require("react").PropTypes.string,
    type: require("react").PropTypes.string.isRequired,
    total: require("react").PropTypes.number.isRequired,
    start: require("react").PropTypes.number,
    end: require("react").PropTypes.number,
    prev: require("react").PropTypes.string,
    next: require("react").PropTypes.string,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getShortName: require("react").PropTypes.func.isRequired
    })),
    sorts: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired
    })),
    breadcrumbs: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        name: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired
    })),
    facets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        field: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        buckets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
            count: require("react").PropTypes.number.isRequired,
            text: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired
        })).isRequired
    })),
    records: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired,
        getTitle: require("react").PropTypes.func.isRequired,
        getSource: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired,
    globalFacets: require("react").PropTypes.shape({}).isRequired,
    values: require("react").PropTypes.shape({}).isRequired,
    queries: require("react").PropTypes.shape({}).isRequired
};
SourceFilter.contextTypes = childContextTypes;

var SimilarityFilter = function SimilarityFilter(_ref5, _ref6) {
    var queries = _ref5.queries,
        values = _ref5.values;
    var gettext = _ref6.gettext,
        getTitle = _ref6.getTitle;

    var similarity = queries.similar.filters;

    return React.createElement(
        "div",
        { className: "form-group" },
        React.createElement(
            "label",
            { htmlFor: "similar", className: "control-label" },
            gettext("Similarity")
        ),
        React.createElement(
            "select",
            { name: "similar", style: { width: "100%" },
                className: "form-control select2-select",
                defaultValue: values.similar
            },
            Object.keys(similarity).map(function (id) {
                return React.createElement(
                    "option",
                    { value: id, key: id },
                    getTitle(similarity[id])
                );
            })
        )
    );
};

SimilarityFilter.propTypes = {
    title: require("react").PropTypes.string.isRequired,
    url: require("react").PropTypes.string,
    type: require("react").PropTypes.string.isRequired,
    total: require("react").PropTypes.number.isRequired,
    start: require("react").PropTypes.number,
    end: require("react").PropTypes.number,
    prev: require("react").PropTypes.string,
    next: require("react").PropTypes.string,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getShortName: require("react").PropTypes.func.isRequired
    })),
    sorts: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired
    })),
    breadcrumbs: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        name: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired
    })),
    facets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        field: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        buckets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
            count: require("react").PropTypes.number.isRequired,
            text: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired
        })).isRequired
    })),
    records: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired,
        getTitle: require("react").PropTypes.func.isRequired,
        getSource: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired,
    globalFacets: require("react").PropTypes.shape({}).isRequired,
    values: require("react").PropTypes.shape({}).isRequired,
    queries: require("react").PropTypes.shape({}).isRequired
};
SimilarityFilter.contextTypes = childContextTypes;

var ImageFilter = function ImageFilter(_ref7, _ref8) {
    var queries = _ref7.queries,
        values = _ref7.values;
    var gettext = _ref8.gettext,
        getTitle = _ref8.getTitle;

    var images = queries.images.filters;

    return React.createElement(
        "div",
        { className: "form-group" },
        React.createElement(
            "label",
            { htmlFor: "imageFilter", className: "control-label" },
            gettext("Images")
        ),
        React.createElement(
            "select",
            { name: "imageFilter", style: { width: "100%" },
                className: "form-control select2-select",
                defaultValue: values.images,
                "data-placeholder": gettext("Filter by image...")
            },
            React.createElement(
                "option",
                { value: "" },
                gettext("Filter by image...")
            ),
            Object.keys(images).map(function (id) {
                return React.createElement(
                    "option",
                    { value: id, key: id },
                    getTitle(images[id])
                );
            })
        )
    );
};

ImageFilter.propTypes = {
    title: require("react").PropTypes.string.isRequired,
    url: require("react").PropTypes.string,
    type: require("react").PropTypes.string.isRequired,
    total: require("react").PropTypes.number.isRequired,
    start: require("react").PropTypes.number,
    end: require("react").PropTypes.number,
    prev: require("react").PropTypes.string,
    next: require("react").PropTypes.string,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getShortName: require("react").PropTypes.func.isRequired
    })),
    sorts: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired
    })),
    breadcrumbs: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        name: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired
    })),
    facets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        field: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        buckets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
            count: require("react").PropTypes.number.isRequired,
            text: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired
        })).isRequired
    })),
    records: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired,
        getTitle: require("react").PropTypes.func.isRequired,
        getSource: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired,
    globalFacets: require("react").PropTypes.shape({}).isRequired,
    values: require("react").PropTypes.shape({}).isRequired,
    queries: require("react").PropTypes.shape({}).isRequired
};
ImageFilter.contextTypes = childContextTypes;

var Sorts = function Sorts(_ref9, _ref10) {
    var values = _ref9.values,
        sorts = _ref9.sorts;
    var gettext = _ref10.gettext;
    return React.createElement(
        "div",
        { className: "form-group" },
        React.createElement(
            "label",
            { htmlFor: "source", className: "control-label" },
            gettext("Sort")
        ),
        React.createElement(
            "select",
            { name: "sort", style: { width: "100%" },
                className: "form-control select2-select",
                defaultValue: values.sort
            },
            sorts && sorts.map(function (sort) {
                return React.createElement(
                    "option",
                    { value: sort.id, key: sort.id },
                    sort.name
                );
            })
        )
    );
};

Sorts.propTypes = {
    title: require("react").PropTypes.string.isRequired,
    url: require("react").PropTypes.string,
    type: require("react").PropTypes.string.isRequired,
    total: require("react").PropTypes.number.isRequired,
    start: require("react").PropTypes.number,
    end: require("react").PropTypes.number,
    prev: require("react").PropTypes.string,
    next: require("react").PropTypes.string,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getShortName: require("react").PropTypes.func.isRequired
    })),
    sorts: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired
    })),
    breadcrumbs: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        name: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired
    })),
    facets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        field: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        buckets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
            count: require("react").PropTypes.number.isRequired,
            text: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired
        })).isRequired
    })),
    records: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired,
        getTitle: require("react").PropTypes.func.isRequired,
        getSource: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired,
    globalFacets: require("react").PropTypes.shape({}).isRequired,
    values: require("react").PropTypes.shape({}).isRequired,
    queries: require("react").PropTypes.shape({}).isRequired
};
Sorts.contextTypes = childContextTypes;

var SearchForm = function SearchForm(props, _ref11) {
    var URL = _ref11.URL,
        lang = _ref11.lang,
        gettext = _ref11.gettext;
    var type = props.type,
        values = props.values,
        sorts = props.sorts,
        sources = props.sources;

    var searchURL = URL("/" + type + "/search");
    var typeOptions = options.types[type];
    var placeholder = typeOptions.getSearchPlaceholder({ gettext: gettext });
    var showImageFilter = typeOptions.hasImages() || !typeOptions.requiresImages();

    return React.createElement(
        "form",
        { action: searchURL, method: "GET" },
        React.createElement("input", { type: "hidden", name: "lang", value: lang }),
        React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
                "label",
                { htmlFor: "filter", className: "control-label" },
                gettext("Query")
            ),
            React.createElement("input", { type: "search", name: "filter",
                placeholder: placeholder,
                defaultValue: values.filter,
                className: "form-control"
            })
        ),
        React.createElement(Filters, props),
        sources && sources.length > 1 && React.createElement(SourceFilter, props),
        typeOptions.hasImageSearch() && React.createElement(SimilarityFilter, props),
        showImageFilter && React.createElement(ImageFilter, props),
        sorts && sorts.length > 0 && React.createElement(Sorts, props),
        React.createElement(
            "div",
            { className: "form-group" },
            React.createElement("input", { type: "submit", value: gettext("Search"),
                className: "btn btn-primary"
            })
        )
    );
};

SearchForm.propTypes = {
    title: require("react").PropTypes.string.isRequired,
    url: require("react").PropTypes.string,
    type: require("react").PropTypes.string.isRequired,
    total: require("react").PropTypes.number.isRequired,
    start: require("react").PropTypes.number,
    end: require("react").PropTypes.number,
    prev: require("react").PropTypes.string,
    next: require("react").PropTypes.string,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getShortName: require("react").PropTypes.func.isRequired
    })),
    sorts: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired
    })),
    breadcrumbs: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        name: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired
    })),
    facets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        field: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        buckets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
            count: require("react").PropTypes.number.isRequired,
            text: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired
        })).isRequired
    })),
    records: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired,
        getTitle: require("react").PropTypes.func.isRequired,
        getSource: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired,
    globalFacets: require("react").PropTypes.shape({}).isRequired,
    values: require("react").PropTypes.shape({}).isRequired,
    queries: require("react").PropTypes.shape({}).isRequired
};
SearchForm.contextTypes = childContextTypes;

var FacetBucket = function FacetBucket(_ref12) {
    var bucket = _ref12.bucket;
    return React.createElement(
        "li",
        null,
        React.createElement(
            "a",
            { href: bucket.url },
            bucket.text
        ),
        " ",
        "(",
        bucket.count,
        ")"
    );
};

FacetBucket.propTypes = {
    bucket: require("react").PropTypes.shape({
        count: require("react").PropTypes.number.isRequired,
        text: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired
    }).isRequired
};
var Facet = function Facet(_ref13, _ref14) {
    var facet = _ref13.facet,
        type = _ref13.type;
    var format = _ref14.format,
        gettext = _ref14.gettext;

    var minFacetCount = options.types[type].minFacetCount || 1;
    var extra = null;
    var buckets = facet.buckets.filter(function (bucket) {
        return bucket.count >= minFacetCount;
    });

    if (buckets.length <= 1) {
        return null;
    }

    // Make sure that there aren't too many buckets displaying at
    // any one time, otherwise it gets too long. We mitigate this
    // by splitting the extra buckets into a separate container
    // and then allow the user to toggle its visibility.
    if (buckets.length > 10) {
        extra = buckets.slice(5);
        buckets = buckets.slice(0, 5);
    }

    return React.createElement(
        "div",
        { className: "panel panel-default facet" },
        React.createElement(
            "div",
            { className: "panel-heading" },
            facet.name
        ),
        React.createElement(
            "div",
            { className: "panel-body" },
            React.createElement(
                "ul",
                null,
                buckets.map(function (bucket) {
                    return React.createElement(FacetBucket, { bucket: bucket, key: bucket.url });
                })
            ),
            extra && React.createElement(
                "div",
                null,
                React.createElement(
                    "button",
                    { className: "btn btn-default btn-xs toggle-facets" },
                    format(gettext("Show %(count)s more..."), { count: extra.length })
                ),
                React.createElement(
                    "div",
                    { className: "extra-facets" },
                    React.createElement(
                        "ul",
                        null,
                        extra.map(function (bucket) {
                            return React.createElement(FacetBucket, { bucket: bucket, key: bucket.url });
                        })
                    )
                )
            )
        )
    );
};

Facet.propTypes = {
    type: require("react").PropTypes.string.isRequired,
    facet: require("react").PropTypes.shape({
        field: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        buckets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
            count: require("react").PropTypes.number.isRequired,
            text: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired
        })).isRequired
    }).isRequired
};
Facet.contextTypes = childContextTypes;

var Facets = function Facets(props) {
    var facets = props.facets;

    return React.createElement(
        "div",
        { className: "hidden-xs hidden-sm" },
        facets && facets.map(function (facet) {
            return React.createElement(Facet, _extends({}, props, {
                facet: facet,
                key: facet.name
            }));
        })
    );
};

Facets.propTypes = {
    title: require("react").PropTypes.string.isRequired,
    url: require("react").PropTypes.string,
    type: require("react").PropTypes.string.isRequired,
    total: require("react").PropTypes.number.isRequired,
    start: require("react").PropTypes.number,
    end: require("react").PropTypes.number,
    prev: require("react").PropTypes.string,
    next: require("react").PropTypes.string,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getShortName: require("react").PropTypes.func.isRequired
    })),
    sorts: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired
    })),
    breadcrumbs: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        name: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired
    })),
    facets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        field: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        buckets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
            count: require("react").PropTypes.number.isRequired,
            text: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired
        })).isRequired
    })),
    records: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired,
        getTitle: require("react").PropTypes.func.isRequired,
        getSource: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired,
    globalFacets: require("react").PropTypes.shape({}).isRequired,
    values: require("react").PropTypes.shape({}).isRequired,
    queries: require("react").PropTypes.shape({}).isRequired
};
var Sidebar = function Sidebar(props, _ref15) {
    var format = _ref15.format,
        gettext = _ref15.gettext,
        stringNum = _ref15.stringNum;
    var total = props.total,
        start = props.start,
        end = props.end;


    return React.createElement(
        "div",
        { className: "results-side col-sm-3 col-sm-push-9" },
        React.createElement(
            "div",
            { className: "panel panel-default facet" },
            React.createElement(
                "div",
                { className: "panel-heading" },
                React.createElement(
                    "strong",
                    null,
                    format(gettext("%(numRecords)s matches."), { numRecords: stringNum(total) })
                ),
                React.createElement("br", null),
                !!end && React.createElement(
                    "span",
                    null,
                    format(gettext("Viewing %(start)s to %(end)s."), {
                        start: stringNum(start || 1),
                        end: stringNum(end)
                    })
                )
            ),
            React.createElement(
                "div",
                { className: "panel-body search-form" },
                React.createElement(SearchForm, props)
            )
        ),
        React.createElement(Facets, props)
    );
};

Sidebar.propTypes = {
    title: require("react").PropTypes.string.isRequired,
    url: require("react").PropTypes.string,
    type: require("react").PropTypes.string.isRequired,
    total: require("react").PropTypes.number.isRequired,
    start: require("react").PropTypes.number,
    end: require("react").PropTypes.number,
    prev: require("react").PropTypes.string,
    next: require("react").PropTypes.string,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getShortName: require("react").PropTypes.func.isRequired
    })),
    sorts: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired
    })),
    breadcrumbs: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        name: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired
    })),
    facets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        field: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        buckets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
            count: require("react").PropTypes.number.isRequired,
            text: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired
        })).isRequired
    })),
    records: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired,
        getTitle: require("react").PropTypes.func.isRequired,
        getSource: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired,
    globalFacets: require("react").PropTypes.shape({}).isRequired,
    values: require("react").PropTypes.shape({}).isRequired,
    queries: require("react").PropTypes.shape({}).isRequired
};
Sidebar.contextTypes = childContextTypes;

var Breadcrumb = function Breadcrumb(_ref16, _ref17) {
    var crumb = _ref16.crumb;
    var format = _ref17.format,
        gettext = _ref17.gettext;
    return React.createElement(
        "a",
        { href: crumb.url,
            className: "btn btn-default btn-xs",
            title: format(gettext("Remove %(query)s"), { query: crumb.name })
        },
        React.createElement("span", { className: "glyphicon glyphicon-remove-sign",
            style: { verticalAlign: -1 }, "aria-hidden": "true"
        }),
        " ",
        React.createElement(
            "span",
            { "aria-hidden": "true" },
            crumb.name
        ),
        React.createElement(
            "span",
            { className: "sr-only" },
            format(gettext("Remove %(query)s"), { query: crumb.name })
        )
    );
};

Breadcrumb.propTypes = {
    crumb: require("react").PropTypes.shape({
        name: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired
    }).isRequired
};
Breadcrumb.contextTypes = childContextTypes;

var Breadcrumbs = function Breadcrumbs(props) {
    var breadcrumbs = props.breadcrumbs;


    if (!breadcrumbs) {
        return null;
    }

    return React.createElement(
        "div",
        { className: "row" },
        React.createElement(
            "div",
            { className: "col-xs-12" },
            React.createElement(
                "div",
                { className: "btn-group", role: "group" },
                breadcrumbs.map(function (crumb) {
                    return React.createElement(Breadcrumb, _extends({}, props, { crumb: crumb, key: crumb.url }));
                })
            )
        )
    );
};

Breadcrumbs.propTypes = {
    title: require("react").PropTypes.string.isRequired,
    url: require("react").PropTypes.string,
    type: require("react").PropTypes.string.isRequired,
    total: require("react").PropTypes.number.isRequired,
    start: require("react").PropTypes.number,
    end: require("react").PropTypes.number,
    prev: require("react").PropTypes.string,
    next: require("react").PropTypes.string,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getShortName: require("react").PropTypes.func.isRequired
    })),
    sorts: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired
    })),
    breadcrumbs: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        name: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired
    })),
    facets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        field: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        buckets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
            count: require("react").PropTypes.number.isRequired,
            text: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired
        })).isRequired
    })),
    records: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired,
        getTitle: require("react").PropTypes.func.isRequired,
        getSource: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired,
    globalFacets: require("react").PropTypes.shape({}).isRequired,
    values: require("react").PropTypes.shape({}).isRequired,
    queries: require("react").PropTypes.shape({}).isRequired
};
var NoResults = function NoResults(props, _ref18) {
    var gettext = _ref18.gettext;
    return React.createElement(
        "div",
        { className: "row" },
        React.createElement(
            "div",
            { className: "col-xs-12" },
            React.createElement(
                "div",
                { className: "alert alert-info", role: "alert" },
                gettext("No results found. Please refine your query.")
            )
        )
    );
};

NoResults.contextTypes = childContextTypes;

var Pagination = function Pagination(_ref19, _ref20) {
    var prev = _ref19.prev,
        next = _ref19.next;
    var gettext = _ref20.gettext;
    return React.createElement(
        "nav",
        null,
        React.createElement(
            "ul",
            { className: "pager" },
            prev && React.createElement(
                "li",
                { className: "previous" },
                React.createElement(
                    "a",
                    { href: prev },
                    React.createElement(
                        "span",
                        { "aria-hidden": "true" },
                        "\u2190"
                    ),
                    gettext("Previous")
                )
            ),
            next && React.createElement(
                "li",
                { className: "next" },
                React.createElement(
                    "a",
                    { href: next },
                    gettext("Next"),
                    React.createElement(
                        "span",
                        { "aria-hidden": "true" },
                        "\u2192"
                    )
                )
            )
        )
    );
};

Pagination.propTypes = {
    title: require("react").PropTypes.string.isRequired,
    url: require("react").PropTypes.string,
    type: require("react").PropTypes.string.isRequired,
    total: require("react").PropTypes.number.isRequired,
    start: require("react").PropTypes.number,
    end: require("react").PropTypes.number,
    prev: require("react").PropTypes.string,
    next: require("react").PropTypes.string,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getShortName: require("react").PropTypes.func.isRequired
    })),
    sorts: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired
    })),
    breadcrumbs: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        name: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired
    })),
    facets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        field: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        buckets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
            count: require("react").PropTypes.number.isRequired,
            text: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired
        })).isRequired
    })),
    records: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired,
        getTitle: require("react").PropTypes.func.isRequired,
        getSource: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired,
    globalFacets: require("react").PropTypes.shape({}).isRequired,
    values: require("react").PropTypes.shape({}).isRequired,
    queries: require("react").PropTypes.shape({}).isRequired
};
Pagination.contextTypes = childContextTypes;

var ImageResultFooter = function ImageResultFooter(props, _ref21) {
    var URL = _ref21.URL,
        lang = _ref21.lang;
    var record = props.record,
        sources = props.sources,
        type = props.type;

    var resultFooter = options.types[type].views.resultFooter;

    if (resultFooter) {
        return React.createElement(
            "div",
            { className: "details" },
            React.createElement(
                "div",
                { className: "wrap" },
                React.createElement("resultFooter", _extends({}, props, {
                    record: record
                }))
            )
        );
    }

    // Don't show the source selection if there isn't more than one source
    if (!sources || sources.length <= 1) {
        return null;
    }

    return React.createElement(
        "div",
        { className: "details" },
        React.createElement(
            "div",
            { className: "wrap" },
            React.createElement(
                "span",
                null,
                React.createElement(
                    "a",
                    { className: "pull-right",
                        href: URL(record.getSource()),
                        title: record.getSource().getFullName(lang)
                    },
                    record.getSource().getShortName(lang)
                )
            )
        )
    );
};

ImageResultFooter.contextTypes = childContextTypes;

var ImageResult = function ImageResult(props, _ref22) {
    var URL = _ref22.URL,
        getTitle = _ref22.getTitle;
    var record = props.record;


    return React.createElement(
        "div",
        { className: "img col-xs-6 col-sm-4 col-md-3" },
        React.createElement(
            "div",
            { className: "img-wrap" },
            React.createElement(
                "a",
                { href: URL(record),
                    title: getTitle(record)
                },
                React.createElement("img", { src: record.getThumbURL(),
                    alt: getTitle(record),
                    title: getTitle(record),
                    className: "img-responsive center-block"
                })
            )
        ),
        React.createElement(ImageResultFooter, _extends({}, props, { record: record }))
    );
};

ImageResult.contextTypes = childContextTypes;

var TextResult = function TextResult(_ref23, _ref24) {
    var record = _ref23.record;
    var URL = _ref24.URL,
        getTitle = _ref24.getTitle;
    return React.createElement(
        "div",
        { className: "col-xs-12" },
        React.createElement(
            "a",
            { href: URL(record),
                title: getTitle(record)
            },
            getTitle(record)
        )
    );
};

TextResult.propTypes = {
    record: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired,
        getTitle: require("react").PropTypes.func.isRequired,
        getSource: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    }).isRequired
};
TextResult.contextTypes = childContextTypes;

var Results = function Results(props) {
    var breadcrumbs = props.breadcrumbs,
        records = props.records,
        type = props.type;

    var imageResult = options.types[type].hasImages();

    return React.createElement(
        "div",
        { className: "results-main col-sm-9 col-sm-pull-3" },
        breadcrumbs && breadcrumbs.length > 0 && React.createElement(Breadcrumbs, props),
        records.length === 0 && React.createElement(NoResults, props),
        React.createElement(Pagination, props),
        React.createElement(
            "div",
            { className: "row" },
            records.map(function (record) {
                return imageResult ? React.createElement(ImageResult, _extends({}, props, { record: record, key: record._id })) : React.createElement(TextResult, _extends({}, props, { record: record, key: record._id }));
            })
        ),
        React.createElement(Pagination, props)
    );
};

Results.propTypes = {
    title: require("react").PropTypes.string.isRequired,
    url: require("react").PropTypes.string,
    type: require("react").PropTypes.string.isRequired,
    total: require("react").PropTypes.number.isRequired,
    start: require("react").PropTypes.number,
    end: require("react").PropTypes.number,
    prev: require("react").PropTypes.string,
    next: require("react").PropTypes.string,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getShortName: require("react").PropTypes.func.isRequired
    })),
    sorts: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired
    })),
    breadcrumbs: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        name: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired
    })),
    facets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        field: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        buckets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
            count: require("react").PropTypes.number.isRequired,
            text: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired
        })).isRequired
    })),
    records: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired,
        getTitle: require("react").PropTypes.func.isRequired,
        getSource: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired,
    globalFacets: require("react").PropTypes.shape({}).isRequired,
    values: require("react").PropTypes.shape({}).isRequired,
    queries: require("react").PropTypes.shape({}).isRequired
};
var Search = function Search(props) {
    var title = props.title,
        url = props.url;


    return React.createElement(
        Page,
        { title: title },
        React.createElement(
            "div",
            { className: "row" },
            React.createElement(
                "div",
                { className: "col-xs-12" },
                React.createElement(
                    "h1",
                    null,
                    title
                ),
                url && React.createElement(
                    "p",
                    null,
                    React.createElement(
                        "a",
                        { href: url },
                        url
                    )
                )
            )
        ),
        React.createElement(
            "div",
            { className: "row results-wrap" },
            React.createElement(Sidebar, props),
            React.createElement(Results, props)
        )
    );
};

Search.propTypes = {
    title: require("react").PropTypes.string.isRequired,
    url: require("react").PropTypes.string,
    type: require("react").PropTypes.string.isRequired,
    total: require("react").PropTypes.number.isRequired,
    start: require("react").PropTypes.number,
    end: require("react").PropTypes.number,
    prev: require("react").PropTypes.string,
    next: require("react").PropTypes.string,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getShortName: require("react").PropTypes.func.isRequired
    })),
    sorts: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired
    })),
    breadcrumbs: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        name: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired
    })),
    facets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        field: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        buckets: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
            count: require("react").PropTypes.number.isRequired,
            text: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired
        })).isRequired
    })),
    records: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired,
        getTitle: require("react").PropTypes.func.isRequired,
        getSource: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired,
    globalFacets: require("react").PropTypes.shape({}).isRequired,
    values: require("react").PropTypes.shape({}).isRequired,
    queries: require("react").PropTypes.shape({}).isRequired
};
module.exports = Search;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92aWV3cy9TZWFyY2guanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwibWV0YWRhdGEiLCJvcHRpb25zIiwiUGFnZSIsImNoaWxkQ29udGV4dFR5cGVzIiwiRmlsdGVycyIsInR5cGUiLCJnbG9iYWxGYWNldHMiLCJnZXR0ZXh0IiwibW9kZWwiLCJ0eXBlcyIsImZpbHRlcnMiLCJtYXAiLCJ0eXBlU2NoZW1hIiwicmVuZGVyRmlsdGVyIiwidmFsdWVzIiwiYnVja2V0IiwidGV4dCIsInNvcnQiLCJjb250ZXh0VHlwZXMiLCJTb3VyY2VGaWx0ZXIiLCJzb3VyY2VzIiwid2lkdGgiLCJzb3VyY2UiLCJfaWQiLCJuYW1lIiwiU2ltaWxhcml0eUZpbHRlciIsInF1ZXJpZXMiLCJnZXRUaXRsZSIsInNpbWlsYXJpdHkiLCJzaW1pbGFyIiwiT2JqZWN0Iiwia2V5cyIsImlkIiwiSW1hZ2VGaWx0ZXIiLCJpbWFnZXMiLCJTb3J0cyIsInNvcnRzIiwiU2VhcmNoRm9ybSIsInByb3BzIiwiVVJMIiwibGFuZyIsInNlYXJjaFVSTCIsInR5cGVPcHRpb25zIiwicGxhY2Vob2xkZXIiLCJnZXRTZWFyY2hQbGFjZWhvbGRlciIsInNob3dJbWFnZUZpbHRlciIsImhhc0ltYWdlcyIsInJlcXVpcmVzSW1hZ2VzIiwiZmlsdGVyIiwibGVuZ3RoIiwiaGFzSW1hZ2VTZWFyY2giLCJGYWNldEJ1Y2tldCIsInVybCIsImNvdW50IiwiRmFjZXQiLCJmYWNldCIsImZvcm1hdCIsIm1pbkZhY2V0Q291bnQiLCJleHRyYSIsImJ1Y2tldHMiLCJzbGljZSIsIkZhY2V0cyIsImZhY2V0cyIsIlNpZGViYXIiLCJzdHJpbmdOdW0iLCJ0b3RhbCIsInN0YXJ0IiwiZW5kIiwibnVtUmVjb3JkcyIsIkJyZWFkY3J1bWIiLCJjcnVtYiIsInF1ZXJ5IiwidmVydGljYWxBbGlnbiIsIkJyZWFkY3J1bWJzIiwiYnJlYWRjcnVtYnMiLCJOb1Jlc3VsdHMiLCJQYWdpbmF0aW9uIiwicHJldiIsIm5leHQiLCJJbWFnZVJlc3VsdEZvb3RlciIsInJlY29yZCIsInJlc3VsdEZvb3RlciIsInZpZXdzIiwiZ2V0U291cmNlIiwiZ2V0RnVsbE5hbWUiLCJnZXRTaG9ydE5hbWUiLCJJbWFnZVJlc3VsdCIsImdldFRodW1iVVJMIiwiVGV4dFJlc3VsdCIsIlJlc3VsdHMiLCJyZWNvcmRzIiwiaW1hZ2VSZXN1bHQiLCJTZWFyY2giLCJ0aXRsZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFFQSxJQUFNQSxRQUFRQyxRQUFRLE9BQVIsQ0FBZDs7QUFFQSxJQUFNQyxXQUFXRCxRQUFRLGlCQUFSLENBQWpCO0FBQ0EsSUFBTUUsVUFBVUYsUUFBUSxnQkFBUixDQUFoQjs7QUFFQSxJQUFNRyxPQUFPSCxRQUFRLFdBQVIsQ0FBYjs7OztlQUc0QkEsUUFBUSxjQUFSLEM7SUFBckJJLGlCLFlBQUFBLGlCOztBQTRFUCxJQUFNQyxVQUFVLFNBQVZBLE9BQVUsY0FBcUQ7QUFBQSxRQUFuREMsSUFBbUQsUUFBbkRBLElBQW1EO0FBQUEsUUFBN0NDLFlBQTZDLFFBQTdDQSxZQUE2QztBQUFBLFFBQXRCQyxPQUFzQixTQUF0QkEsT0FBc0I7O0FBQ2pFLFFBQU1DLFFBQVFSLFNBQVNRLEtBQVQsQ0FBZUgsSUFBZixDQUFkOztBQUVBLFdBQU87QUFBQTtBQUFBO0FBQ0ZKLGdCQUFRUSxLQUFSLENBQWNKLElBQWQsRUFBb0JLLE9BQXBCLENBQTRCQyxHQUE1QixDQUFnQyxVQUFDTixJQUFELEVBQVU7QUFDdkMsZ0JBQU1PLGFBQWFKLE1BQU1ILElBQU4sQ0FBbkI7O0FBRUEsZ0JBQUksQ0FBQ08sV0FBV0MsWUFBaEIsRUFBOEI7QUFDMUIsdUJBQU8sSUFBUDtBQUNIOztBQUVELGdCQUFNQyxTQUFTLENBQUNSLGFBQWFELElBQWIsS0FBc0IsRUFBdkIsRUFDVk0sR0FEVSxDQUNOLFVBQUNJLE1BQUQ7QUFBQSx1QkFBWUEsT0FBT0MsSUFBbkI7QUFBQSxhQURNLEVBQ21CQyxJQURuQixF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QUFiLENBREo7QUFFSSxnQ0FBQyxPQUFELEVBQWFBLEtBQWI7QUFGSjtBQVBHLEtBQVA7QUFZSCxDQWZEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBd0QsT0FBT0MsT0FBUCxHQUFpQkgsTUFBakIiLCJmaWxlIjoiU2VhcmNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuY29uc3QgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cbmNvbnN0IG1ldGFkYXRhID0gcmVxdWlyZShcIi4uL2xpYi9tZXRhZGF0YVwiKTtcbmNvbnN0IG9wdGlvbnMgPSByZXF1aXJlKFwiLi4vbGliL29wdGlvbnNcIik7XG5cbmNvbnN0IFBhZ2UgPSByZXF1aXJlKFwiLi9QYWdlLmpzXCIpO1xuXG5pbXBvcnQgdHlwZSB7Q29udGV4dH0gZnJvbSBcIi4vdHlwZXMuanNcIjtcbmNvbnN0IHtjaGlsZENvbnRleHRUeXBlc30gPSByZXF1aXJlKFwiLi9XcmFwcGVyLmpzXCIpO1xuXG50eXBlIEJ1Y2tldCA9IHtcbiAgICBjb3VudDogbnVtYmVyLFxuICAgIHRleHQ6IHN0cmluZyxcbiAgICB1cmw6IHN0cmluZyxcbn07XG5cbnR5cGUgRmFjZXRUeXBlID0ge1xuICAgIGZpZWxkOiBzdHJpbmcsXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGJ1Y2tldHM6IEFycmF5PEJ1Y2tldD4sXG59O1xuXG50eXBlIEJyZWFkY3J1bWJUeXBlID0ge1xuICAgIG5hbWU6IHN0cmluZyxcbiAgICB1cmw6IHN0cmluZyxcbn07XG5cbnR5cGUgU291cmNlID0ge1xuICAgIF9pZDogc3RyaW5nLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBnZXRVUkw6IChsYW5nOiBzdHJpbmcpID0+IHN0cmluZyxcbiAgICBnZXRGdWxsTmFtZTogKGxhbmc6IHN0cmluZykgPT4gc3RyaW5nLFxuICAgIGdldFNob3J0TmFtZTogKGxhbmc6IHN0cmluZykgPT4gc3RyaW5nLFxufTtcblxudHlwZSBTb3J0ID0ge1xuICAgIGlkOiBzdHJpbmcsXG4gICAgbmFtZTogc3RyaW5nLFxufTtcblxudHlwZSBSZWNvcmRUeXBlID0ge1xuICAgIF9pZDogc3RyaW5nLFxuICAgIHR5cGU6IHN0cmluZyxcbiAgICB1cmw/OiBzdHJpbmcsXG4gICAgZ2V0T3JpZ2luYWxVUkw6ICgpID0+IHN0cmluZyxcbiAgICBnZXRUaHVtYlVSTDogKCkgPT4gc3RyaW5nLFxuICAgIGdldFRpdGxlOiAoKSA9PiBzdHJpbmcsXG4gICAgZ2V0U291cmNlOiAoKSA9PiBTb3VyY2UsXG4gICAgZ2V0VVJMOiAobGFuZzogc3RyaW5nKSA9PiBzdHJpbmcsXG59O1xuXG50eXBlIFByb3BzID0ge1xuICAgIHRpdGxlOiBzdHJpbmcsXG4gICAgdXJsPzogc3RyaW5nLFxuICAgIHR5cGU6IHN0cmluZyxcbiAgICB0b3RhbDogbnVtYmVyLFxuICAgIHN0YXJ0PzogbnVtYmVyLFxuICAgIGVuZD86IG51bWJlcixcbiAgICBwcmV2Pzogc3RyaW5nLFxuICAgIG5leHQ/OiBzdHJpbmcsXG4gICAgc291cmNlcz86IEFycmF5PFNvdXJjZT4sXG4gICAgc29ydHM/OiBBcnJheTxTb3J0PixcbiAgICBicmVhZGNydW1icz86IEFycmF5PEJyZWFkY3J1bWJUeXBlPixcbiAgICBmYWNldHM/OiBBcnJheTxGYWNldFR5cGU+LFxuICAgIHJlY29yZHM6IEFycmF5PFJlY29yZFR5cGU+LFxuICAgIGdsb2JhbEZhY2V0czoge1xuICAgICAgICBba2V5OiBzdHJpbmddOiB7XG4gICAgICAgICAgICB0ZXh0OiBzdHJpbmcsXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICB2YWx1ZXM6IHtcbiAgICAgICAgW2tleTogc3RyaW5nXTogc3RyaW5nLFxuICAgIH0sXG4gICAgcXVlcmllczoge1xuICAgICAgICBba2V5OiBzdHJpbmddOiB7XG4gICAgICAgICAgICBmaWx0ZXJzOiB7XG4gICAgICAgICAgICAgICAgW2tleTogc3RyaW5nXToge1xuICAgICAgICAgICAgICAgICAgICBnZXRUaXRsZTogKCkgPT4gc3RyaW5nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgIH0sXG59O1xuXG5jb25zdCBGaWx0ZXJzID0gKHt0eXBlLCBnbG9iYWxGYWNldHN9OiBQcm9wcywge2dldHRleHR9OiBDb250ZXh0KSA9PiB7XG4gICAgY29uc3QgbW9kZWwgPSBtZXRhZGF0YS5tb2RlbCh0eXBlKTtcblxuICAgIHJldHVybiA8ZGl2PlxuICAgICAgICB7b3B0aW9ucy50eXBlc1t0eXBlXS5maWx0ZXJzLm1hcCgodHlwZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdHlwZVNjaGVtYSA9IG1vZGVsW3R5cGVdO1xuXG4gICAgICAgICAgICBpZiAoIXR5cGVTY2hlbWEucmVuZGVyRmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IChnbG9iYWxGYWNldHNbdHlwZV0gfHwgW10pXG4gICAgICAgICAgICAgICAgLm1hcCgoYnVja2V0KSA9PiBidWNrZXQudGV4dCkuc29ydCgpO1xuXG4gICAgICAgICAgICByZXR1cm4gPGRpdiBrZXk9e3R5cGV9PlxuICAgICAgICAgICAgICAgIHt0eXBlU2NoZW1hLnJlbmRlckZpbHRlcih2YWx1ZXNbdHlwZV0sIHZhbHVlcywge2dldHRleHR9KX1cbiAgICAgICAgICAgIDwvZGl2PjtcbiAgICAgICAgfSl9XG4gICAgPC9kaXY+O1xufTtcblxuRmlsdGVycy5jb250ZXh0VHlwZXMgPSBjaGlsZENvbnRleHRUeXBlcztcblxuY29uc3QgU291cmNlRmlsdGVyID0gKHtcbiAgICB2YWx1ZXMsXG4gICAgc291cmNlcyxcbn06IFByb3BzLCB7Z2V0dGV4dH06IENvbnRleHQpID0+IDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuICAgIDxsYWJlbCBodG1sRm9yPVwic291cmNlXCIgY2xhc3NOYW1lPVwiY29udHJvbC1sYWJlbFwiPlxuICAgICAgICB7Z2V0dGV4dChcIlNvdXJjZVwiKX1cbiAgICA8L2xhYmVsPlxuICAgIDxzZWxlY3QgbmFtZT1cInNvdXJjZVwiIHN0eWxlPXt7d2lkdGg6IFwiMTAwJVwifX1cbiAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sIHNlbGVjdDItc2VsZWN0XCJcbiAgICAgICAgZGVmYXVsdFZhbHVlPXt2YWx1ZXMuc291cmNlfVxuICAgICAgICBkYXRhLXBsYWNlaG9sZGVyPXtnZXR0ZXh0KFwiRmlsdGVyIGJ5IHNvdXJjZS4uLlwiKX1cbiAgICA+XG4gICAgICAgIHtzb3VyY2VzICYmIHNvdXJjZXMubWFwKChzb3VyY2UpID0+XG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtzb3VyY2UuX2lkfSBrZXk9e3NvdXJjZS5faWR9PlxuICAgICAgICAgICAgICAgIHtzb3VyY2UubmFtZX1cbiAgICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICApfVxuICAgIDwvc2VsZWN0PlxuPC9kaXY+O1xuXG5Tb3VyY2VGaWx0ZXIuY29udGV4dFR5cGVzID0gY2hpbGRDb250ZXh0VHlwZXM7XG5cbmNvbnN0IFNpbWlsYXJpdHlGaWx0ZXIgPSAoe1xuICAgIHF1ZXJpZXMsXG4gICAgdmFsdWVzLFxufTogUHJvcHMsIHtnZXR0ZXh0LCBnZXRUaXRsZX06IENvbnRleHQpID0+IHtcbiAgICBjb25zdCBzaW1pbGFyaXR5ID0gcXVlcmllcy5zaW1pbGFyLmZpbHRlcnM7XG5cbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwic2ltaWxhclwiIGNsYXNzTmFtZT1cImNvbnRyb2wtbGFiZWxcIj5cbiAgICAgICAgICAgIHtnZXR0ZXh0KFwiU2ltaWxhcml0eVwiKX1cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPHNlbGVjdCBuYW1lPVwic2ltaWxhclwiIHN0eWxlPXt7d2lkdGg6IFwiMTAwJVwifX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbCBzZWxlY3QyLXNlbGVjdFwiXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU9e3ZhbHVlcy5zaW1pbGFyfVxuICAgICAgICA+XG4gICAgICAgICAgICB7T2JqZWN0LmtleXMoc2ltaWxhcml0eSkubWFwKChpZCkgPT5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtpZH0ga2V5PXtpZH0+XG4gICAgICAgICAgICAgICAgICAgIHtnZXRUaXRsZShzaW1pbGFyaXR5W2lkXSl9XG4gICAgICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgICApfVxuICAgICAgICA8L3NlbGVjdD5cbiAgICA8L2Rpdj47XG59O1xuXG5TaW1pbGFyaXR5RmlsdGVyLmNvbnRleHRUeXBlcyA9IGNoaWxkQ29udGV4dFR5cGVzO1xuXG5jb25zdCBJbWFnZUZpbHRlciA9ICh7XG4gICAgcXVlcmllcyxcbiAgICB2YWx1ZXMsXG59OiBQcm9wcywge2dldHRleHQsIGdldFRpdGxlfTogQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IGltYWdlcyA9IHF1ZXJpZXMuaW1hZ2VzLmZpbHRlcnM7XG5cbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwiaW1hZ2VGaWx0ZXJcIiBjbGFzc05hbWU9XCJjb250cm9sLWxhYmVsXCI+XG4gICAgICAgICAgICB7Z2V0dGV4dChcIkltYWdlc1wiKX1cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPHNlbGVjdCBuYW1lPVwiaW1hZ2VGaWx0ZXJcIiBzdHlsZT17e3dpZHRoOiBcIjEwMCVcIn19XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2wgc2VsZWN0Mi1zZWxlY3RcIlxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXt2YWx1ZXMuaW1hZ2VzfVxuICAgICAgICAgICAgZGF0YS1wbGFjZWhvbGRlcj17Z2V0dGV4dChcIkZpbHRlciBieSBpbWFnZS4uLlwiKX1cbiAgICAgICAgPlxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlxuICAgICAgICAgICAgICAgIHtnZXR0ZXh0KFwiRmlsdGVyIGJ5IGltYWdlLi4uXCIpfVxuICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgICB7T2JqZWN0LmtleXMoaW1hZ2VzKS5tYXAoKGlkKSA9PlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e2lkfSBrZXk9e2lkfT5cbiAgICAgICAgICAgICAgICAgICAge2dldFRpdGxlKGltYWdlc1tpZF0pfVxuICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgPC9zZWxlY3Q+XG4gICAgPC9kaXY+O1xufTtcblxuSW1hZ2VGaWx0ZXIuY29udGV4dFR5cGVzID0gY2hpbGRDb250ZXh0VHlwZXM7XG5cbmNvbnN0IFNvcnRzID0gKHtcbiAgICB2YWx1ZXMsXG4gICAgc29ydHMsXG59OiBQcm9wcywge2dldHRleHR9OiBDb250ZXh0KSA9PiA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cbiAgICA8bGFiZWwgaHRtbEZvcj1cInNvdXJjZVwiIGNsYXNzTmFtZT1cImNvbnRyb2wtbGFiZWxcIj5cbiAgICAgICAge2dldHRleHQoXCJTb3J0XCIpfVxuICAgIDwvbGFiZWw+XG4gICAgPHNlbGVjdCBuYW1lPVwic29ydFwiIHN0eWxlPXt7d2lkdGg6IFwiMTAwJVwifX1cbiAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sIHNlbGVjdDItc2VsZWN0XCJcbiAgICAgICAgZGVmYXVsdFZhbHVlPXt2YWx1ZXMuc29ydH1cbiAgICA+XG4gICAgICAgIHtzb3J0cyAmJiBzb3J0cy5tYXAoKHNvcnQpID0+XG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtzb3J0LmlkfSBrZXk9e3NvcnQuaWR9PlxuICAgICAgICAgICAgICAgIHtzb3J0Lm5hbWV9XG4gICAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgKX1cbiAgICA8L3NlbGVjdD5cbjwvZGl2PjtcblxuU29ydHMuY29udGV4dFR5cGVzID0gY2hpbGRDb250ZXh0VHlwZXM7XG5cbmNvbnN0IFNlYXJjaEZvcm0gPSAocHJvcHM6IFByb3BzLCB7VVJMLCBsYW5nLCBnZXR0ZXh0fTogQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IHt0eXBlLCB2YWx1ZXMsIHNvcnRzLCBzb3VyY2VzfSA9IHByb3BzO1xuICAgIGNvbnN0IHNlYXJjaFVSTCA9IFVSTChgLyR7dHlwZX0vc2VhcmNoYCk7XG4gICAgY29uc3QgdHlwZU9wdGlvbnMgPSBvcHRpb25zLnR5cGVzW3R5cGVdO1xuICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gdHlwZU9wdGlvbnMuZ2V0U2VhcmNoUGxhY2Vob2xkZXIoe2dldHRleHR9KTtcbiAgICBjb25zdCBzaG93SW1hZ2VGaWx0ZXIgPSB0eXBlT3B0aW9ucy5oYXNJbWFnZXMoKSB8fFxuICAgICAgICAhdHlwZU9wdGlvbnMucmVxdWlyZXNJbWFnZXMoKTtcblxuICAgIHJldHVybiA8Zm9ybSBhY3Rpb249e3NlYXJjaFVSTH0gbWV0aG9kPVwiR0VUXCI+XG4gICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImxhbmdcIiB2YWx1ZT17bGFuZ30vPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiZmlsdGVyXCIgY2xhc3NOYW1lPVwiY29udHJvbC1sYWJlbFwiPlxuICAgICAgICAgICAgICAgIHtnZXR0ZXh0KFwiUXVlcnlcIil9XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJzZWFyY2hcIiBuYW1lPVwiZmlsdGVyXCJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17cGxhY2Vob2xkZXJ9XG4gICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXt2YWx1ZXMuZmlsdGVyfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPEZpbHRlcnMgey4uLnByb3BzfSAvPlxuICAgICAgICB7LyogRG9uJ3Qgc2hvdyB0aGUgc291cmNlIHNlbGVjdGlvbiBpZiB0aGVyZSBpc24ndCBtb3JlIHRoYW5cbiAgICAgICAgICAgIG9uZSBzb3VyY2UgKi99XG4gICAgICAgIHtzb3VyY2VzICYmIHNvdXJjZXMubGVuZ3RoID4gMSAmJiA8U291cmNlRmlsdGVyIHsuLi5wcm9wc30gLz59XG4gICAgICAgIHt0eXBlT3B0aW9ucy5oYXNJbWFnZVNlYXJjaCgpICYmXG4gICAgICAgICAgICA8U2ltaWxhcml0eUZpbHRlciB7Li4ucHJvcHN9IC8+fVxuICAgICAgICB7c2hvd0ltYWdlRmlsdGVyICYmIDxJbWFnZUZpbHRlciB7Li4ucHJvcHN9IC8+fVxuICAgICAgICB7c29ydHMgJiYgc29ydHMubGVuZ3RoID4gMCAmJiA8U29ydHMgey4uLnByb3BzfSAvPn1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPXtnZXR0ZXh0KFwiU2VhcmNoXCIpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Zvcm0+O1xufTtcblxuU2VhcmNoRm9ybS5jb250ZXh0VHlwZXMgPSBjaGlsZENvbnRleHRUeXBlcztcblxuY29uc3QgRmFjZXRCdWNrZXQgPSAoe2J1Y2tldH06IHtidWNrZXQ6IEJ1Y2tldH0pID0+IDxsaT5cbiAgICA8YSBocmVmPXtidWNrZXQudXJsfT57YnVja2V0LnRleHR9PC9hPlxuICAgIHtcIiBcIn0oe2J1Y2tldC5jb3VudH0pXG48L2xpPjtcblxuY29uc3QgRmFjZXQgPSAoe1xuICAgIGZhY2V0LFxuICAgIHR5cGUsXG59OiB7dHlwZTogc3RyaW5nLCBmYWNldDogRmFjZXRUeXBlfSwge2Zvcm1hdCwgZ2V0dGV4dH06IENvbnRleHQpID0+IHtcbiAgICBjb25zdCBtaW5GYWNldENvdW50ID0gb3B0aW9ucy50eXBlc1t0eXBlXS5taW5GYWNldENvdW50IHx8IDE7XG4gICAgbGV0IGV4dHJhID0gbnVsbDtcbiAgICBsZXQgYnVja2V0cyA9IGZhY2V0LmJ1Y2tldHNcbiAgICAgICAgLmZpbHRlcigoYnVja2V0KSA9PiBidWNrZXQuY291bnQgPj0gbWluRmFjZXRDb3VudCk7XG5cbiAgICBpZiAoYnVja2V0cy5sZW5ndGggPD0gMSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBNYWtlIHN1cmUgdGhhdCB0aGVyZSBhcmVuJ3QgdG9vIG1hbnkgYnVja2V0cyBkaXNwbGF5aW5nIGF0XG4gICAgLy8gYW55IG9uZSB0aW1lLCBvdGhlcndpc2UgaXQgZ2V0cyB0b28gbG9uZy4gV2UgbWl0aWdhdGUgdGhpc1xuICAgIC8vIGJ5IHNwbGl0dGluZyB0aGUgZXh0cmEgYnVja2V0cyBpbnRvIGEgc2VwYXJhdGUgY29udGFpbmVyXG4gICAgLy8gYW5kIHRoZW4gYWxsb3cgdGhlIHVzZXIgdG8gdG9nZ2xlIGl0cyB2aXNpYmlsaXR5LlxuICAgIGlmIChidWNrZXRzLmxlbmd0aCA+IDEwKSB7XG4gICAgICAgIGV4dHJhID0gYnVja2V0cy5zbGljZSg1KTtcbiAgICAgICAgYnVja2V0cyA9IGJ1Y2tldHMuc2xpY2UoMCwgNSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwgcGFuZWwtZGVmYXVsdCBmYWNldFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWhlYWRpbmdcIj57ZmFjZXQubmFtZX08L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1ib2R5XCI+XG4gICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgICAge2J1Y2tldHMubWFwKChidWNrZXQpID0+XG4gICAgICAgICAgICAgICAgICAgIDxGYWNldEJ1Y2tldCBidWNrZXQ9e2J1Y2tldH0ga2V5PXtidWNrZXQudXJsfSAvPil9XG4gICAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgICB7ZXh0cmEgJiYgPGRpdj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBidG4teHMgdG9nZ2xlLWZhY2V0c1wiPlxuICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0KFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0dGV4dChcIlNob3cgJShjb3VudClzIG1vcmUuLi5cIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2NvdW50OiBleHRyYS5sZW5ndGh9KX1cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZXh0cmEtZmFjZXRzXCI+XG4gICAgICAgICAgICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtleHRyYS5tYXAoKGJ1Y2tldCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RmFjZXRCdWNrZXQgYnVja2V0PXtidWNrZXR9IGtleT17YnVja2V0LnVybH0gLz4pfVxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+fVxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj47XG59O1xuXG5GYWNldC5jb250ZXh0VHlwZXMgPSBjaGlsZENvbnRleHRUeXBlcztcblxuY29uc3QgRmFjZXRzID0gKHByb3BzOiBQcm9wcykgPT4ge1xuICAgIGNvbnN0IHtmYWNldHN9ID0gcHJvcHM7XG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiaGlkZGVuLXhzIGhpZGRlbi1zbVwiPlxuICAgICAgICB7ZmFjZXRzICYmIGZhY2V0cy5tYXAoKGZhY2V0KSA9PlxuICAgICAgICAgICAgPEZhY2V0XG4gICAgICAgICAgICAgICAgey4uLnByb3BzfVxuICAgICAgICAgICAgICAgIGZhY2V0PXtmYWNldH1cbiAgICAgICAgICAgICAgICBrZXk9e2ZhY2V0Lm5hbWV9XG4gICAgICAgICAgICAvPil9XG4gICAgPC9kaXY+O1xufTtcblxuY29uc3QgU2lkZWJhciA9IChwcm9wczogUHJvcHMsIHtmb3JtYXQsIGdldHRleHQsIHN0cmluZ051bX06IENvbnRleHQpID0+IHtcbiAgICBjb25zdCB7dG90YWwsIHN0YXJ0LCBlbmR9ID0gcHJvcHM7XG5cbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJyZXN1bHRzLXNpZGUgY29sLXNtLTMgY29sLXNtLXB1c2gtOVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsIHBhbmVsLWRlZmF1bHQgZmFjZXRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtaGVhZGluZ1wiPlxuICAgICAgICAgICAgICAgIDxzdHJvbmc+e2Zvcm1hdChnZXR0ZXh0KFwiJShudW1SZWNvcmRzKXMgbWF0Y2hlcy5cIiksXG4gICAgICAgICAgICAgICAgICAgIHtudW1SZWNvcmRzOiBzdHJpbmdOdW0odG90YWwpfSl9XG4gICAgICAgICAgICAgICAgPC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgICAgICAgICAgICB7ISFlbmQgJiYgPHNwYW4+e2Zvcm1hdChcbiAgICAgICAgICAgICAgICAgICAgZ2V0dGV4dChcIlZpZXdpbmcgJShzdGFydClzIHRvICUoZW5kKXMuXCIpLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogc3RyaW5nTnVtKHN0YXJ0IHx8IDEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiBzdHJpbmdOdW0oZW5kKSxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICl9PC9zcGFuPn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1ib2R5IHNlYXJjaC1mb3JtXCI+XG4gICAgICAgICAgICAgICAgPFNlYXJjaEZvcm0gey4uLnByb3BzfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8RmFjZXRzIHsuLi5wcm9wc30gLz5cbiAgICA8L2Rpdj47XG59O1xuXG5TaWRlYmFyLmNvbnRleHRUeXBlcyA9IGNoaWxkQ29udGV4dFR5cGVzO1xuXG5jb25zdCBCcmVhZGNydW1iID0gKHtjcnVtYn06IHtjcnVtYjogQnJlYWRjcnVtYlR5cGV9LFxuICAgIHtmb3JtYXQsIGdldHRleHR9OiBDb250ZXh0KSA9PlxuPGEgaHJlZj17Y3J1bWIudXJsfVxuICAgIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBidG4teHNcIlxuICAgIHRpdGxlPXtmb3JtYXQoZ2V0dGV4dChcIlJlbW92ZSAlKHF1ZXJ5KXNcIiksXG4gICAgICAgIHtxdWVyeTogY3J1bWIubmFtZX0pfVxuPlxuICAgIDxzcGFuIGNsYXNzTmFtZT1cImdseXBoaWNvbiBnbHlwaGljb24tcmVtb3ZlLXNpZ25cIlxuICAgICAgICBzdHlsZT17e3ZlcnRpY2FsQWxpZ246IC0xfX0gYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAvPlxuICAgIHtcIiBcIn1cbiAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj57Y3J1bWIubmFtZX08L3NwYW4+XG4gICAgPHNwYW4gY2xhc3NOYW1lPVwic3Itb25seVwiPlxuICAgICAgICB7Zm9ybWF0KGdldHRleHQoXCJSZW1vdmUgJShxdWVyeSlzXCIpLFxuICAgICAgICAgICAge3F1ZXJ5OiBjcnVtYi5uYW1lfSl9XG4gICAgPC9zcGFuPlxuPC9hPjtcblxuQnJlYWRjcnVtYi5jb250ZXh0VHlwZXMgPSBjaGlsZENvbnRleHRUeXBlcztcblxuY29uc3QgQnJlYWRjcnVtYnMgPSAocHJvcHM6IFByb3BzKSA9PiB7XG4gICAgY29uc3Qge2JyZWFkY3J1bWJzfSA9IHByb3BzO1xuXG4gICAgaWYgKCFicmVhZGNydW1icykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwXCIgcm9sZT1cImdyb3VwXCI+XG4gICAgICAgICAgICAgICAge2JyZWFkY3J1bWJzLm1hcCgoY3J1bWIpID0+XG4gICAgICAgICAgICAgICAgICAgIDxCcmVhZGNydW1iIHsuLi5wcm9wc30gY3J1bWI9e2NydW1ifSBrZXk9e2NydW1iLnVybH0gLz4pfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2Pjtcbn07XG5cbmNvbnN0IE5vUmVzdWx0cyA9IChwcm9wcywge2dldHRleHR9OiBDb250ZXh0KSA9PiA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWxlcnQgYWxlcnQtaW5mb1wiIHJvbGU9XCJhbGVydFwiPlxuICAgICAgICAgICAge2dldHRleHQoXCJObyByZXN1bHRzIGZvdW5kLiBQbGVhc2UgcmVmaW5lIHlvdXIgcXVlcnkuXCIpfVxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PjtcblxuTm9SZXN1bHRzLmNvbnRleHRUeXBlcyA9IGNoaWxkQ29udGV4dFR5cGVzO1xuXG5jb25zdCBQYWdpbmF0aW9uID0gKHtwcmV2LCBuZXh0fTogUHJvcHMsIHtnZXR0ZXh0fTogQ29udGV4dCkgPT4gPG5hdj5cbiAgICA8dWwgY2xhc3NOYW1lPVwicGFnZXJcIj5cbiAgICAgICAge3ByZXYgJiYgPGxpIGNsYXNzTmFtZT1cInByZXZpb3VzXCI+XG4gICAgICAgICAgICA8YSBocmVmPXtwcmV2fT5cbiAgICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mbGFycjs8L3NwYW4+XG4gICAgICAgICAgICAgICAge2dldHRleHQoXCJQcmV2aW91c1wiKX1cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9saT59XG4gICAgICAgIHtuZXh0ICYmIDxsaSBjbGFzc05hbWU9XCJuZXh0XCI+XG4gICAgICAgICAgICA8YSBocmVmPXtuZXh0fT5cbiAgICAgICAgICAgICAgICB7Z2V0dGV4dChcIk5leHRcIil9XG4gICAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnJhcnI7PC9zcGFuPlxuICAgICAgICAgICAgPC9hPlxuICAgICAgICA8L2xpPn1cbiAgICA8L3VsPlxuPC9uYXY+O1xuXG5QYWdpbmF0aW9uLmNvbnRleHRUeXBlcyA9IGNoaWxkQ29udGV4dFR5cGVzO1xuXG5jb25zdCBJbWFnZVJlc3VsdEZvb3RlciA9IChwcm9wczogUHJvcHMgJiB7cmVjb3JkOiBSZWNvcmRUeXBlfSxcbiAgICAgICAge1VSTCwgbGFuZ306IENvbnRleHQpID0+IHtcbiAgICBjb25zdCB7cmVjb3JkLCBzb3VyY2VzLCB0eXBlfSA9IHByb3BzO1xuICAgIGNvbnN0IHJlc3VsdEZvb3RlciA9IG9wdGlvbnMudHlwZXNbdHlwZV1cbiAgICAgICAgLnZpZXdzLnJlc3VsdEZvb3RlcjtcblxuICAgIGlmIChyZXN1bHRGb290ZXIpIHtcbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiZGV0YWlsc1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3cmFwXCI+XG4gICAgICAgICAgICAgICAgPHJlc3VsdEZvb3RlclxuICAgICAgICAgICAgICAgICAgICB7Li4ucHJvcHN9XG4gICAgICAgICAgICAgICAgICAgIHJlY29yZD17cmVjb3JkfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+O1xuICAgIH1cblxuICAgIC8vIERvbid0IHNob3cgdGhlIHNvdXJjZSBzZWxlY3Rpb24gaWYgdGhlcmUgaXNuJ3QgbW9yZSB0aGFuIG9uZSBzb3VyY2VcbiAgICBpZiAoIXNvdXJjZXMgfHwgc291cmNlcy5sZW5ndGggPD0gMSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJkZXRhaWxzXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwid3JhcFwiPlxuICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwicHVsbC1yaWdodFwiXG4gICAgICAgICAgICAgICAgICAgIGhyZWY9e1VSTChyZWNvcmQuZ2V0U291cmNlKCkpfVxuICAgICAgICAgICAgICAgICAgICB0aXRsZT17cmVjb3JkLmdldFNvdXJjZSgpLmdldEZ1bGxOYW1lKGxhbmcpfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge3JlY29yZC5nZXRTb3VyY2UoKS5nZXRTaG9ydE5hbWUobGFuZyl9XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj47XG59O1xuXG5JbWFnZVJlc3VsdEZvb3Rlci5jb250ZXh0VHlwZXMgPSBjaGlsZENvbnRleHRUeXBlcztcblxuY29uc3QgSW1hZ2VSZXN1bHQgPSAocHJvcHM6IFByb3BzICYge3JlY29yZDogUmVjb3JkVHlwZX0sXG4gICAgICAgIHtVUkwsIGdldFRpdGxlfTogQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IHtyZWNvcmR9ID0gcHJvcHM7XG5cbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJpbWcgY29sLXhzLTYgY29sLXNtLTQgY29sLW1kLTNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbWctd3JhcFwiPlxuICAgICAgICAgICAgPGEgaHJlZj17VVJMKHJlY29yZCl9XG4gICAgICAgICAgICAgICAgdGl0bGU9e2dldFRpdGxlKHJlY29yZCl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGltZyBzcmM9e3JlY29yZC5nZXRUaHVtYlVSTCgpfVxuICAgICAgICAgICAgICAgICAgICBhbHQ9e2dldFRpdGxlKHJlY29yZCl9XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlPXtnZXRUaXRsZShyZWNvcmQpfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJpbWctcmVzcG9uc2l2ZSBjZW50ZXItYmxvY2tcIlxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8SW1hZ2VSZXN1bHRGb290ZXIgey4uLnByb3BzfSByZWNvcmQ9e3JlY29yZH0gLz5cbiAgICA8L2Rpdj47XG59O1xuXG5JbWFnZVJlc3VsdC5jb250ZXh0VHlwZXMgPSBjaGlsZENvbnRleHRUeXBlcztcblxuY29uc3QgVGV4dFJlc3VsdCA9ICh7cmVjb3JkfToge3JlY29yZDogUmVjb3JkVHlwZX0sXG4gICAgICAgIHtVUkwsIGdldFRpdGxlfTogQ29udGV4dCkgPT5cbjxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG4gICAgPGEgaHJlZj17VVJMKHJlY29yZCl9XG4gICAgICAgIHRpdGxlPXtnZXRUaXRsZShyZWNvcmQpfVxuICAgID5cbiAgICAgICAge2dldFRpdGxlKHJlY29yZCl9XG4gICAgPC9hPlxuPC9kaXY+O1xuXG5UZXh0UmVzdWx0LmNvbnRleHRUeXBlcyA9IGNoaWxkQ29udGV4dFR5cGVzO1xuXG5jb25zdCBSZXN1bHRzID0gKHByb3BzOiBQcm9wcykgPT4ge1xuICAgIGNvbnN0IHticmVhZGNydW1icywgcmVjb3JkcywgdHlwZX0gPSBwcm9wcztcbiAgICBjb25zdCBpbWFnZVJlc3VsdCA9IG9wdGlvbnMudHlwZXNbdHlwZV0uaGFzSW1hZ2VzKCk7XG5cbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJyZXN1bHRzLW1haW4gY29sLXNtLTkgY29sLXNtLXB1bGwtM1wiPlxuICAgICAgICB7YnJlYWRjcnVtYnMgJiYgYnJlYWRjcnVtYnMubGVuZ3RoID4gMCAmJiA8QnJlYWRjcnVtYnMgey4uLnByb3BzfSAvPn1cbiAgICAgICAge3JlY29yZHMubGVuZ3RoID09PSAwICYmIDxOb1Jlc3VsdHMgey4uLnByb3BzfSAvPn1cbiAgICAgICAgPFBhZ2luYXRpb24gey4uLnByb3BzfSAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAge3JlY29yZHMubWFwKChyZWNvcmQpID0+IGltYWdlUmVzdWx0ID9cbiAgICAgICAgICAgICAgICA8SW1hZ2VSZXN1bHQgey4uLnByb3BzfSByZWNvcmQ9e3JlY29yZH0ga2V5PXtyZWNvcmQuX2lkfSAvPiA6XG4gICAgICAgICAgICAgICAgPFRleHRSZXN1bHQgey4uLnByb3BzfSByZWNvcmQ9e3JlY29yZH0ga2V5PXtyZWNvcmQuX2lkfSAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxQYWdpbmF0aW9uIHsuLi5wcm9wc30gLz5cbiAgICA8L2Rpdj47XG59O1xuXG5jb25zdCBTZWFyY2ggPSAocHJvcHM6IFByb3BzKSA9PiB7XG4gICAgY29uc3Qge3RpdGxlLCB1cmx9ID0gcHJvcHM7XG5cbiAgICByZXR1cm4gPFBhZ2UgdGl0bGU9e3RpdGxlfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgICAgICAgPGgxPnt0aXRsZX08L2gxPlxuICAgICAgICAgICAgICAgIHt1cmwgJiYgPHA+PGEgaHJlZj17dXJsfT57dXJsfTwvYT48L3A+fVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyByZXN1bHRzLXdyYXBcIj5cbiAgICAgICAgICAgIDxTaWRlYmFyIHsuLi5wcm9wc30gLz5cbiAgICAgICAgICAgIDxSZXN1bHRzIHsuLi5wcm9wc30gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9QYWdlPjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2VhcmNoO1xuIl19