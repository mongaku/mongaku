"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const React = require("react");

const metadata = require("../lib/metadata");
const options = require("../lib/options");

const Page = require("./Page.js");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

const { childContextTypes } = require("./Wrapper.js");

const Filters = ({ type, globalFacets }, { gettext }) => {
    const model = metadata.model(type);

    return React.createElement(
        "div",
        null,
        options.types[type].filters.map(type => {
            const typeSchema = model[type];

            if (!typeSchema.renderFilter) {
                return null;
            }

            const values = (globalFacets[type] || []).map(bucket => bucket.text).sort();

            return React.createElement(
                "div",
                { key: type },
                typeSchema.renderFilter(values[type], values, { gettext })
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

const SourceFilter = ({
    values,
    sources
}, { gettext }) => React.createElement(
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
        sources && sources.map(source => React.createElement(
            "option",
            { value: source._id, key: source._id },
            source.name
        ))
    )
);

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

const SimilarityFilter = ({
    queries,
    values
}, { gettext, getTitle }) => {
    const similarity = queries.similar.filters;

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
            Object.keys(similarity).map(id => React.createElement(
                "option",
                { value: id, key: id },
                getTitle(similarity[id])
            ))
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

const ImageFilter = ({
    queries,
    values
}, { gettext, getTitle }) => {
    const images = queries.images.filters;

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
            Object.keys(images).map(id => React.createElement(
                "option",
                { value: id, key: id },
                getTitle(images[id])
            ))
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

const Sorts = ({
    values,
    sorts
}, { gettext }) => React.createElement(
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
        sorts && sorts.map(sort => React.createElement(
            "option",
            { value: sort.id, key: sort.id },
            sort.name
        ))
    )
);

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

const SearchForm = (props, { URL, lang, gettext }) => {
    const { type, values, sorts, sources } = props;
    const searchURL = URL(`/${type}/search`);
    const typeOptions = options.types[type];
    const placeholder = typeOptions.getSearchPlaceholder({ gettext });
    const showImageFilter = typeOptions.hasImages() || !typeOptions.requiresImages();

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
}, { format, gettext }) => {
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
const Sidebar = (props, { format, gettext, stringNum }) => {
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

const Breadcrumb = ({ crumb }, { format, gettext }) => React.createElement(
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

const ImageResultFooter = (props, { URL, lang }) => {
    const { record, sources, type } = props;
    const resultFooter = options.types[type].views.resultFooter;

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

const ImageResult = (props, { URL, getTitle }) => {
    const { record } = props;

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

const TextResult = ({ record }, { URL, getTitle }) => React.createElement(
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

const Results = props => {
    const { breadcrumbs, records, type } = props;
    const imageResult = options.types[type].hasImages();

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