"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const React = require("react");

const Page = require("./Page.js");
const SearchForm = require("./SearchForm.js");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

const { childContextTypes } = require("./Wrapper.js");

const FacetBucket = ({ bucket }) => React.createElement(
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

FacetBucket.propTypes = {
    bucket: require("react").PropTypes.shape({
        count: require("react").PropTypes.number.isRequired,
        text: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired
    }).isRequired
};
const Facet = ({
    facet,
    type
}, {
    gettext,
    options,
    utils: { format }
}) => {
    const minFacetCount = options.types[type].minFacetCount || 1;
    let extra = null;
    let buckets = facet.buckets.filter(bucket => bucket.count >= minFacetCount);

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
                buckets.map(bucket => React.createElement(FacetBucket, { bucket: bucket, key: bucket.url }))
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
                        extra.map(bucket => React.createElement(FacetBucket, { bucket: bucket, key: bucket.url }))
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

const Facets = props => {
    const { facets } = props;
    return React.createElement(
        "div",
        { className: "hidden-xs hidden-sm" },
        facets && facets.map(facet => React.createElement(Facet, _extends({}, props, {
            facet: facet,
            key: facet.name
        })))
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
        getURL: require("react").PropTypes.string.isRequired,
        getFullName: require("react").PropTypes.string.isRequired,
        getShortName: require("react").PropTypes.string.isRequired
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
        source: require("react").PropTypes.string.isRequired,
        getOriginalURL: require("react").PropTypes.string.isRequired,
        getThumbURL: require("react").PropTypes.string.isRequired,
        getTitle: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.string.isRequired
    })).isRequired,
    globalFacets: require("react").PropTypes.any.isRequired,
    queries: require("react").PropTypes.any.isRequired,
    values: require("react").PropTypes.any.isRequired
};
const Sidebar = (props, {
    gettext,
    utils: { format, stringNum }
}) => {
    const { total, start, end } = props;

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
        getURL: require("react").PropTypes.string.isRequired,
        getFullName: require("react").PropTypes.string.isRequired,
        getShortName: require("react").PropTypes.string.isRequired
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
        source: require("react").PropTypes.string.isRequired,
        getOriginalURL: require("react").PropTypes.string.isRequired,
        getThumbURL: require("react").PropTypes.string.isRequired,
        getTitle: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.string.isRequired
    })).isRequired,
    globalFacets: require("react").PropTypes.any.isRequired,
    queries: require("react").PropTypes.any.isRequired,
    values: require("react").PropTypes.any.isRequired
};
Sidebar.contextTypes = childContextTypes;

const Breadcrumb = ({ crumb }, { gettext, utils: { format } }) => React.createElement(
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

Breadcrumb.propTypes = {
    crumb: require("react").PropTypes.shape({
        name: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired
    }).isRequired
};
Breadcrumb.contextTypes = childContextTypes;

const Breadcrumbs = props => {
    const { breadcrumbs } = props;

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
                breadcrumbs.map(crumb => React.createElement(Breadcrumb, _extends({}, props, { crumb: crumb, key: crumb.url })))
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
        getURL: require("react").PropTypes.string.isRequired,
        getFullName: require("react").PropTypes.string.isRequired,
        getShortName: require("react").PropTypes.string.isRequired
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
        source: require("react").PropTypes.string.isRequired,
        getOriginalURL: require("react").PropTypes.string.isRequired,
        getThumbURL: require("react").PropTypes.string.isRequired,
        getTitle: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.string.isRequired
    })).isRequired,
    globalFacets: require("react").PropTypes.any.isRequired,
    queries: require("react").PropTypes.any.isRequired,
    values: require("react").PropTypes.any.isRequired
};
const NoResults = (props, { gettext }) => React.createElement(
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

NoResults.contextTypes = childContextTypes;

const Pagination = ({ prev, next }, { gettext }) => React.createElement(
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
        getURL: require("react").PropTypes.string.isRequired,
        getFullName: require("react").PropTypes.string.isRequired,
        getShortName: require("react").PropTypes.string.isRequired
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
        source: require("react").PropTypes.string.isRequired,
        getOriginalURL: require("react").PropTypes.string.isRequired,
        getThumbURL: require("react").PropTypes.string.isRequired,
        getTitle: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.string.isRequired
    })).isRequired,
    globalFacets: require("react").PropTypes.any.isRequired,
    queries: require("react").PropTypes.any.isRequired,
    values: require("react").PropTypes.any.isRequired
};
Pagination.contextTypes = childContextTypes;

const ImageResultFooter = ({
    record,
    sources
}, { utils: { getSource } }) => {
    // Don't show the source selection if there isn't more than one source
    if (!sources || sources.length <= 1) {
        return null;
    }

    const source = getSource(record.source, sources);

    return React.createElement(
        "div",
        { className: "details" },
        React.createElement(
            "div",
            { className: "wrap" },
            source && React.createElement(
                "span",
                null,
                React.createElement(
                    "a",
                    { className: "pull-right",
                        href: source.getURL,
                        title: source.getFullName
                    },
                    source.getShortName
                )
            )
        )
    );
};

ImageResultFooter.contextTypes = childContextTypes;

const ImageResult = props => {
    const { record } = props;

    return React.createElement(
        "div",
        { className: "img col-xs-6 col-sm-4 col-md-3" },
        React.createElement(
            "div",
            { className: "img-wrap" },
            React.createElement(
                "a",
                { href: record.getURL,
                    title: record.getTitle
                },
                React.createElement("img", { src: record.getThumbURL,
                    alt: record.getTitle,
                    title: record.getTitle,
                    className: "img-responsive center-block"
                })
            )
        ),
        React.createElement(ImageResultFooter, _extends({}, props, { record: record }))
    );
};

const TextResult = ({ record }) => React.createElement(
    "div",
    { className: "col-xs-12" },
    React.createElement(
        "a",
        { href: record.getURL,
            title: record.getTitle
        },
        record.getTitle
    )
);

TextResult.propTypes = {
    record: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string,
        source: require("react").PropTypes.string.isRequired,
        getOriginalURL: require("react").PropTypes.string.isRequired,
        getThumbURL: require("react").PropTypes.string.isRequired,
        getTitle: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.string.isRequired
    }).isRequired
};
const Results = (props, { options }) => {
    const { breadcrumbs, records, type } = props;
    const imageResult = options.types[type].hasImages;

    return React.createElement(
        "div",
        { className: "results-main col-sm-9 col-sm-pull-3" },
        breadcrumbs && breadcrumbs.length > 0 && React.createElement(Breadcrumbs, props),
        records.length === 0 && React.createElement(NoResults, props),
        React.createElement(Pagination, props),
        React.createElement(
            "div",
            { className: "row" },
            records.map(record => imageResult ? React.createElement(ImageResult, _extends({}, props, { record: record, key: record._id })) : React.createElement(TextResult, _extends({}, props, { record: record, key: record._id })))
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
        getURL: require("react").PropTypes.string.isRequired,
        getFullName: require("react").PropTypes.string.isRequired,
        getShortName: require("react").PropTypes.string.isRequired
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
        source: require("react").PropTypes.string.isRequired,
        getOriginalURL: require("react").PropTypes.string.isRequired,
        getThumbURL: require("react").PropTypes.string.isRequired,
        getTitle: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.string.isRequired
    })).isRequired,
    globalFacets: require("react").PropTypes.any.isRequired,
    queries: require("react").PropTypes.any.isRequired,
    values: require("react").PropTypes.any.isRequired
};
Results.contextTypes = childContextTypes;

const Search = props => {
    const { title, url } = props;

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
        getURL: require("react").PropTypes.string.isRequired,
        getFullName: require("react").PropTypes.string.isRequired,
        getShortName: require("react").PropTypes.string.isRequired
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
        source: require("react").PropTypes.string.isRequired,
        getOriginalURL: require("react").PropTypes.string.isRequired,
        getThumbURL: require("react").PropTypes.string.isRequired,
        getTitle: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.string.isRequired
    })).isRequired,
    globalFacets: require("react").PropTypes.any.isRequired,
    queries: require("react").PropTypes.any.isRequired,
    values: require("react").PropTypes.any.isRequired
};
module.exports = Search;