// @flow

const React = require("react");

const SearchForm = require("./SearchForm.js");

import type {Context} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

type Bucket = {
    count: number,
    text: string,
    url: string,
};

type FacetType = {
    field: string,
    name: string,
    buckets: Array<Bucket>,
};

type BreadcrumbType = {
    name: string,
    url: string,
};

type Source = {
    _id: string,
    name: string,
    getURL: string,
    getFullName: string,
    getShortName: string,
};

type RecordType = {
    _id: string,
    type: string,
    url?: string,
    source: string,
    getOriginalURL: string,
    getThumbURL: string,
    getTitle: string,
    getURL: string,
};

type Props = {
    title: string,
    url?: string,
    type: string,
    total: number,
    start?: number,
    end?: number,
    prev?: string,
    next?: string,
    sources?: Array<Source>,
    breadcrumbs?: Array<BreadcrumbType>,
    facets?: Array<FacetType>,
    records: Array<RecordType>,

    // Pass-through to the SearchForm
    globalFacets: any,
    queries: any,
    values: any,
};

const FacetBucket = ({bucket}: {bucket: Bucket}) => <li>
    <a href={bucket.url}>{bucket.text}</a>
    {" "}({bucket.count})
</li>;

class Facet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showMore: false,
        };
    }

    state: {
        showMore: boolean,
    }
    props: Props & {
        type: string,
        facet: FacetType,
    }
    context: Context

    render() {
        const {facet, type} = this.props;
        const {gettext, options, format} = this.context;
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

        let extraFacets = null;

        if (extra) {
            if (this.state.showMore) {
                extraFacets = <div className="extra-facets">
                    <ul>
                        {extra.map((bucket) => <FacetBucket
                            bucket={bucket}
                            key={bucket.url}
                        />)}
                    </ul>
                </div>;
            } else {
                extraFacets = <button
                    className="btn btn-default btn-xs toggle-facets"
                    onClick={() => this.setState({showMore: true})}
                >
                    {format(
                        gettext("Show %(count)s more..."),
                            {count: extra.length})}
                </button>;
            }
        }

        return <div className="panel panel-default facet">
            <div className="panel-heading">{facet.name}</div>
            <div className="panel-body">
                <ul>
                    {buckets.map((bucket) =>
                        <FacetBucket bucket={bucket} key={bucket.url} />)}
                </ul>

                {extraFacets}
            </div>
        </div>;
    }
}

Facet.contextTypes = childContextTypes;

const Facets = (props: Props) => {
    const {facets} = props;
    return <div className="hidden-xs hidden-sm">
        {facets && facets.map((facet) =>
            <Facet
                {...props}
                facet={facet}
                key={facet.name}
            />)}
    </div>;
};

const Sidebar = (props: Props, {
    gettext,
    format,
    stringNum,
}: Context) => {
    const {total, start, end} = props;

    return <div className="results-side col-sm-3 col-sm-push-9">
        <div className="panel panel-default facet">
            <div className="panel-heading">
                <strong>{format(gettext("%(numRecords)s matches."),
                    {numRecords: stringNum(total)})}
                </strong>
                <br/>
                {!!end && <span>{format(
                    gettext("Viewing %(start)s to %(end)s."),
                    {
                        start: stringNum(start || 1),
                        end: stringNum(end),
                    }
                )}</span>}
            </div>
            <div className="panel-body search-form">
                <SearchForm {...props} />
            </div>
        </div>
        <Facets {...props} />
    </div>;
};

Sidebar.contextTypes = childContextTypes;

const Breadcrumb = ({crumb}: {crumb: BreadcrumbType},
    {gettext, format}: Context) =>
<a href={crumb.url}
    className="btn btn-default btn-xs"
    title={format(gettext("Remove %(query)s"),
        {query: crumb.name})}
>
    <span className="glyphicon glyphicon-remove-sign"
        style={{verticalAlign: -1}} aria-hidden="true"
    />
    {" "}
    <span aria-hidden="true">{crumb.name}</span>
    <span className="sr-only">
        {format(gettext("Remove %(query)s"),
            {query: crumb.name})}
    </span>
</a>;

Breadcrumb.contextTypes = childContextTypes;

const Breadcrumbs = (props: Props) => {
    const {breadcrumbs} = props;

    if (!breadcrumbs) {
        return null;
    }

    return <div className="row">
        <div className="col-xs-12">
            <div className="btn-group" role="group">
                {breadcrumbs.map((crumb) =>
                    <Breadcrumb {...props} crumb={crumb} key={crumb.url} />)}
            </div>
        </div>
    </div>;
};

const NoResults = (props, {gettext}: Context) => <div className="row">
    <div className="col-xs-12">
        <div className="alert alert-info" role="alert">
            {gettext("No results found. Please refine your query.")}
        </div>
    </div>
</div>;

NoResults.contextTypes = childContextTypes;

const Pagination = ({prev, next}: Props, {gettext}: Context) => <nav>
    <ul className="pager">
        {prev && <li className="previous">
            <a href={prev}>
                <span aria-hidden="true">&larr;</span>
                {gettext("Previous")}
            </a>
        </li>}
        {next && <li className="next">
            <a href={next}>
                {gettext("Next")}
                <span aria-hidden="true">&rarr;</span>
            </a>
        </li>}
    </ul>
</nav>;

Pagination.contextTypes = childContextTypes;

const ImageResultFooter = ({
    record,
    sources,
}: Props & {record: RecordType}, {getSource}: Context) => {
    // Don't show the source selection if there isn't more than one source
    if (!sources || sources.length <= 1) {
        return null;
    }

    const source = getSource(record.source, sources);

    return <div className="details">
        <div className="wrap">
            {source && <span>
                <a className="pull-right"
                    href={source.getURL}
                    title={source.getFullName}
                >
                    {source.getShortName}
                </a>
            </span>}
        </div>
    </div>;
};

ImageResultFooter.contextTypes = childContextTypes;

const ImageResult = (props: Props & {record: RecordType}) => {
    const {record} = props;

    return <div className="img col-xs-6 col-sm-4 col-md-3">
        <div className="img-wrap">
            <a href={record.getURL}
                title={record.getTitle}
            >
                <img src={record.getThumbURL}
                    alt={record.getTitle}
                    title={record.getTitle}
                    className="img-responsive center-block"
                />
            </a>
        </div>
        <ImageResultFooter {...props} record={record} />
    </div>;
};

const TextResult = ({record}: {record: RecordType}) => (
    <div className="col-xs-12">
        <a href={record.getURL}
            title={record.getTitle}
        >
            {record.getTitle}
        </a>
    </div>
);

const Results = (props: Props, {options}: Context) => {
    const {breadcrumbs, records, type} = props;
    const imageResult = options.types[type].hasImages;

    return <div className="results-main col-sm-9 col-sm-pull-3">
        {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs {...props} />}
        {records.length === 0 && <NoResults {...props} />}
        <Pagination {...props} />
        <div className="row">
            {records.map((record) => imageResult ?
                <ImageResult {...props} record={record} key={record._id} /> :
                <TextResult {...props} record={record} key={record._id} />
            )}
        </div>
        <Pagination {...props} />
    </div>;
};

Results.contextTypes = childContextTypes;

const Search = (props: Props) => {
    const {title, url} = props;

    return <div>
        <div className="row">
            <div className="col-xs-12">
                <h1>{title}</h1>
                {url && <p><a href={url}>{url}</a></p>}
            </div>
        </div>
        <div className="row results-wrap">
            <Sidebar {...props} />
            <Results {...props} />
        </div>
    </div>;
};

module.exports = Search;
