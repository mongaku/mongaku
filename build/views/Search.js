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