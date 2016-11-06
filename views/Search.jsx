"use strict";

const React = require("react");

const metadata = require("../lib/metadata");
const options = require("../lib/options");

const Page = require("./Page.jsx");

const buckets = React.PropTypes.arrayOf(
    React.PropTypes.shape({
        count: React.PropTypes.number.isRequired,
        text: React.PropTypes.string.isRequired,
        url: React.PropTypes.string.isRequired,
    })
);

const Search = React.createClass({
    propTypes: {
        URL: React.PropTypes.func.isRequired,
        breadcrumbs: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                name: React.PropTypes.string.isRequired,
                url: React.PropTypes.string.isRequired,
            })
        ),
        end: React.PropTypes.number,
        facets: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                field: React.PropTypes.string.isRequired,
                name: React.PropTypes.string.isRequired,
                buckets,
            })
        ),
        format: React.PropTypes.func.isRequired,
        getTitle: React.PropTypes.func.isRequired,
        gettext: React.PropTypes.func.isRequired,
        globalFacets: React.PropTypes.any,
        lang: React.PropTypes.string.isRequired,
        next: React.PropTypes.string,
        prev: React.PropTypes.string,
        queries: React.PropTypes.any.isRequired,
        records: React.PropTypes.arrayOf(
            React.PropTypes.any
        ),
        sorts: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                id: React.PropTypes.string.isRequired,
                name: React.PropTypes.string.isRequired,
            })
        ),
        sources: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                _id: React.PropTypes.string.isRequired,
                name: React.PropTypes.string.isRequired,
            })
        ),
        start: React.PropTypes.number,
        stringNum: React.PropTypes.func.isRequired,
        title: React.PropTypes.string.isRequired,
        total: React.PropTypes.number.isRequired,
        type: React.PropTypes.string.isRequired,
        url: React.PropTypes.string,
        values: React.PropTypes.any.isRequired,
    },

    renderSidebar() {
        return <div className="results-side col-sm-3 col-sm-push-9">
            <div className="panel panel-default facet">
                <div className="panel-heading">
                    <strong>{this.props.format(
                        this.props.gettext("%(numRecords)s matches."),
                        {numRecords: this.props.stringNum(
                            this.props.total)})}
                    </strong>
                    <br/>
                    {!!this.props.end && <span>{this.props.format(
                        this.props.gettext("Viewing %(start)s to %(end)s."),
                        {
                            start: this.props.stringNum(this.props.start),
                            end: this.props.stringNum(this.props.end),
                        }
                    )}</span>}
                </div>
                <div className="panel-body search-form">
                    {this.renderSearchForm()}
                </div>
            </div>
            {this.renderFacets()}
        </div>;
    },

    renderSimilarityFilter() {
        if (!options.types[this.props.type].hasImageSearch()) {
            return null;
        }

        const similarity = this.props.queries.similar.filters;

        return <div className="form-group">
            <label htmlFor="similar" className="control-label">
                {this.props.gettext("Similarity")}
            </label>
            <select name="similar" style={{width: "100%"}}
                className="form-control select2-select"
                defaultValue={this.props.values.similar}
            >
                {Object.keys(similarity).map((id) =>
                    <option value={id} key={id}>
                        {this.props.getTitle(similarity[id])}
                    </option>
                )}
            </select>
        </div>;
    },

    renderImageFilter() {
        if (!options.types[this.props.type].hasImages() ||
                options.types[this.props.type].requiresImages()) {
            return null;
        }

        const images = this.props.queries.images.filters;

        return <div className="form-group">
            <label htmlFor="imageFilter" className="control-label">
                {this.props.gettext("Images")}
            </label>
            <select name="imageFilter" style={{width: "100%"}}
                className="form-control select2-select"
                defaultValue={this.props.values.images}
                data-placeholder={this.props.gettext("Filter by image...")}
            >
                {Object.keys(images).map((id) =>
                    <option value={id} key={id}>
                        {this.props.getTitle(images[id])}
                    </option>
                )}
            </select>
        </div>;
    },

    renderSorts() {
        if (this.props.sorts.length === 0) {
            return null;
        }

        return <div className="form-group">
            <label htmlFor="source" className="control-label">
                {this.props.gettext("Sort")}
            </label>
            <select name="sort" style={{width: "100%"}}
                className="form-control select2-select"
                defaultValue={this.props.values.sort}
            >
                {this.props.sorts.map((sort) =>
                    <option value={sort.id} key={sort.id}>
                        {sort.name}
                    </option>
                )}
            </select>
        </div>;
    },

    renderSearchForm() {
        const searchURL = this.props.URL(`/${this.props.type}/search`);
        const placeholder = options.types[this.props.type]
            .getSearchPlaceholder(this.props);

        return <form action={searchURL} method="GET">
            <input type="hidden" name="lang" value={this.props.lang}/>
            <div className="form-group">
                <label htmlFor="filter" className="control-label">
                    {this.props.gettext("Query")}
                </label>
                <input type="search" name="filter"
                    placeholder={placeholder}
                    defaultValue={this.props.values.filter}
                    className="form-control"
                />
            </div>
            {this.renderFilters()}
            {this.renderSourceFilter()}
            {this.renderSimilarityFilter()}
            {this.renderImageFilter()}
            {this.renderSorts()}
            <div className="form-group">
                <input type="submit" value={this.props.gettext("Search")}
                    className="btn btn-primary"
                />
            </div>
        </form>;
    },

    renderFilters() {
        const type = this.props.type;
        const model = metadata.model(type);
        const globalFacets = this.props.globalFacets;

        return options.types[type].filters.map((type) => {
            const typeSchema = model[type];

            if (!typeSchema.renderFilter) {
                return null;
            }

            const values = (globalFacets[type] || [])
                .map((bucket) => bucket.text).sort();

            return <div key={type}>
                {typeSchema.renderFilter(this.props.values[type], values,
                    this.props)}
            </div>;
        });
    },

    renderSourceFilter() {
        // Don't show the source selection if there isn't more than one source
        if (this.props.sources.length <= 1) {
            return null;
        }

        return <div className="form-group">
            <label htmlFor="source" className="control-label">
                {this.props.gettext("Source")}
            </label>
            <select name="source" style={{width: "100%"}}
                className="form-control select2-select"
                defaultValue={this.props.values.source}
                data-placeholder={this.props.gettext("Filter by source...")}
            >
                {this.props.sources.map((source) =>
                    <option value={source._id} key={source._id}>
                        {source.name}
                    </option>
                )}
            </select>
        </div>;
    },

    renderFacets() {
        return <div className="hidden-xs hidden-sm">
            {this.props.facets.map((facet) => this.renderFacet(facet))}
        </div>;
    },

    renderFacet(facet) {
        const type = this.props.type;
        const minFacetCount = options.types[type].minFacetCount || 1;
        let extra = null;
        let buckets = facet.buckets
            .filter((bucket) => bucket.count >= minFacetCount);

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

        return <div className="panel panel-default facet" key={facet.name}>
            <div className="panel-heading">{facet.name}</div>
            <div className="panel-body">
                <ul>
                    {buckets.map((bucket) => this.renderBucket(bucket))}
                </ul>

                {extra && <div>
                    <button className="btn btn-default btn-xs toggle-facets">
                        {this.props.format(
                            this.props.gettext("Show %(count)s more..."),
                                {count: extra.length})}
                    </button>

                    <div className="extra-facets">
                        <ul>
                            {extra.map((bucket) =>
                                this.renderBucket(bucket))}
                        </ul>
                    </div>
                </div>}
            </div>
        </div>;
    },

    renderBucket(bucket) {
        return <li key={bucket.url}>
            <a href={bucket.url}>{bucket.text}</a>
            {" "}({bucket.count})
        </li>;
    },

    renderResults() {
        return <div className="results-main col-sm-9 col-sm-pull-3">
            {this.props.breadcrumbs.length > 0 && this.renderBreadcrumbs()}
            {this.props.records.length === 0 && this.renderNoResults()}
            {this.renderPagination()}
            <div className="row">
                {this.props.records.map((record) =>
                    this.renderResult(record))}
            </div>
            {this.renderPagination()}
        </div>;
    },

    renderBreadcrumbs() {
        return <div className="row">
            <div className="col-xs-12">
                <div className="btn-group" role="group">
                    {this.props.breadcrumbs.map((crumb) =>
                        this.renderBreadcrumb(crumb))}
                </div>
            </div>
        </div>;
    },

    renderBreadcrumb(crumb) {
        return <a href={crumb.url}
            className="btn btn-default btn-xs"
            key={crumb.url}
            title={this.props.format(this.props.gettext("Remove %(query)s"),
                {query: crumb.name})}
        >
            <span className="glyphicon glyphicon-remove-sign"
                style={{verticalAlign: -1}} aria-hidden="true"
            />
            {" "}
            <span aria-hidden="true">{crumb.name}</span>
            <span className="sr-only">
                {this.props.format(this.props.gettext("Remove %(query)s"),
                    {query: crumb.name})}
            </span>
        </a>;
    },

    renderNoResults() {
        return <div className="row">
            <div className="col-xs-12">
                <div className="alert alert-info" role="alert">
                    {this.props.gettext(
                        "No results found. Please refine your query.")}
                </div>
            </div>
        </div>;
    },

    renderPagination() {
        return <nav>
            <ul className="pager">
                {this.props.prev && <li className="previous">
                    <a href={this.props.prev}>
                        <span aria-hidden="true">&larr;</span>
                        {this.props.gettext("Previous")}
                    </a>
                </li>}
                {this.props.next && <li className="next">
                    <a href={this.props.next}>
                        {this.props.gettext("Next")}
                        <span aria-hidden="true">&rarr;</span>
                    </a>
                </li>}
            </ul>
        </nav>;
    },

    renderResultFooter(record) {
        const resultFooter = options.types[this.props.type]
            .views.resultFooter;

        if (resultFooter) {
            return <div className="details">
                <div className="wrap">
                    <resultFooter
                        {...this.props}
                        record={record}
                    />
                </div>
            </div>;
        }

        // Don't show the source selection if there isn't more than one source
        if (this.props.sources.length <= 1) {
            return null;
        }

        return <div className="details">
            <div className="wrap">
                <span>
                    <a className="pull-right"
                        href={this.props.URL(record.getSource())}
                        title={record.getSource().getFullName(this.props.lang)}
                    >
                        {record.getSource().getShortName(this.props.lang)}
                    </a>
                </span>
            </div>
        </div>;
    },

    renderImageResult(record) {
        return <div className="img col-xs-6 col-sm-4 col-md-3"
            key={record._id}
        >
            <div className="img-wrap">
                <a href={this.props.URL(record)}
                    title={this.props.getTitle(record)}
                >
                    <img src={record.getThumbURL()}
                        alt={this.props.getTitle(record)}
                        title={this.props.getTitle(record)}
                        className="img-responsive center-block"
                    />
                </a>
            </div>
            {this.renderResultFooter(record)}
        </div>;
    },

    renderTextResult(record) {
        return <div className="col-xs-12"
            key={record._id}
        >
            <a href={this.props.URL(record)}
                title={this.props.getTitle(record)}
            >
                {this.props.getTitle(record)}
            </a>
        </div>;
    },

    renderResult(record) {
        if (options.types[this.props.type].hasImages()) {
            return this.renderImageResult(record);
        }

        return this.renderTextResult(record);
    },

    render() {
        return <Page
            {...this.props}
        >
            <div className="row">
                <div className="col-xs-12">
                    <h1>{this.props.title}</h1>
                    {this.props.url &&
                        <p><a href={this.props.url}>{this.props.url}</a></p>}
                </div>
            </div>
            <div className="row results-wrap">
                {this.renderSidebar()}
                {this.renderResults()}
            </div>
        </Page>;
    },
});

module.exports = Search;
