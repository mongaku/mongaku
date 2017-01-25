// @flow

const React = require("react");

const metadata = require("../lib/metadata");
const options = require("../lib/options");

const Page = require("./Page.jsx");

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
    getURL: (lang: string) => string,
    getFullName: (lang: string) => string,
    getShortName: (lang: string) => string,
};

type Sort = {
    id: string,
    name: string,
};

type RecordType = {
    _id: string,
    type: string,
    url: string,
    getOriginalURL: () => string,
    getThumbURL: () => string,
    getTitle: () => string,
    getSource: () => Source,
    getURL: (lang: string) => string,
};

type Props = {
    // GlobalProps
    URL: (path: string | {getURL: (lang: string) => string}) => string,
    gettext: (text: string) => string,
    lang: string,
    getTitle: (item: {getTitle: () => string}) => string,
    format: (text: string, options: {}) => string,
    stringNum: (num?: number) => string,

    title: string,
    url?: string,
    type: string,
    total: number,
    start?: number,
    end?: number,
    prev?: string,
    next?: string,
    sources?: Array<Source>,
    sorts?: Array<Sort>,
    breadcrumbs?: Array<BreadcrumbType>,
    facets?: Array<FacetType>,
    records: Array<RecordType>,
    globalFacets: {
        [key: string]: {
            text: string,
        },
    },
    values: {
        [key: string]: string,
    },
    queries: {
        [key: string]: {
            filters: {
                [key: string]: {
                    getTitle: () => string,
                },
            },
        },
    },
};

const Filters = (props: Props) => {
    const {type, globalFacets} = props;
    const model = metadata.model(type);

    return options.types[type].filters.map((type) => {
        const typeSchema = model[type];

        if (!typeSchema.renderFilter) {
            return null;
        }

        const values = (globalFacets[type] || [])
            .map((bucket) => bucket.text).sort();

        return <div key={type}>
            {typeSchema.renderFilter(values[type], values, props)}
        </div>;
    });
};

const SourceFilter = ({
    gettext,
    values,
    sources,
}: Props) => <div className="form-group">
    <label htmlFor="source" className="control-label">
        {gettext("Source")}
    </label>
    <select name="source" style={{width: "100%"}}
        className="form-control select2-select"
        defaultValue={values.source}
        data-placeholder={gettext("Filter by source...")}
    >
        {sources && sources.map((source) =>
            <option value={source._id} key={source._id}>
                {source.name}
            </option>
        )}
    </select>
</div>;

const SimilarityFilter = ({
    queries,
    gettext,
    values,
    getTitle,
}: Props) => {
    const similarity = queries.similar.filters;

    return <div className="form-group">
        <label htmlFor="similar" className="control-label">
            {gettext("Similarity")}
        </label>
        <select name="similar" style={{width: "100%"}}
            className="form-control select2-select"
            defaultValue={values.similar}
        >
            {Object.keys(similarity).map((id) =>
                <option value={id} key={id}>
                    {getTitle(similarity[id])}
                </option>
            )}
        </select>
    </div>;
};

const ImageFilter = ({
    queries,
    gettext,
    values,
    getTitle,
}: Props) => {
    const images = queries.images.filters;

    return <div className="form-group">
        <label htmlFor="imageFilter" className="control-label">
            {gettext("Images")}
        </label>
        <select name="imageFilter" style={{width: "100%"}}
            className="form-control select2-select"
            defaultValue={values.images}
            data-placeholder={gettext("Filter by image...")}
        >
            <option value="">
                {gettext("Filter by image...")}
            </option>
            {Object.keys(images).map((id) =>
                <option value={id} key={id}>
                    {getTitle(images[id])}
                </option>
            )}
        </select>
    </div>;
};

const Sorts = ({
    gettext,
    values,
    sorts,
}: Props) => <div className="form-group">
    <label htmlFor="source" className="control-label">
        {gettext("Sort")}
    </label>
    <select name="sort" style={{width: "100%"}}
        className="form-control select2-select"
        defaultValue={values.sort}
    >
        {sorts && sorts.map((sort) =>
            <option value={sort.id} key={sort.id}>
                {sort.name}
            </option>
        )}
    </select>
</div>;

const SearchForm = (props: Props) => {
    const {
        URL,
        type,
        lang,
        gettext,
        values,
        sorts,
        sources,
    } = props;

    const searchURL = URL(`/${type}/search`);
    const typeOptions = options.types[type];
    const placeholder = typeOptions.getSearchPlaceholder(props);
    const showImageFilter = typeOptions.hasImages() ||
        !typeOptions.requiresImages();

    return <form action={searchURL} method="GET">
        <input type="hidden" name="lang" value={lang}/>
        <div className="form-group">
            <label htmlFor="filter" className="control-label">
                {gettext("Query")}
            </label>
            <input type="search" name="filter"
                placeholder={placeholder}
                defaultValue={values.filter}
                className="form-control"
            />
        </div>
        <Filters {...props} />
        {/* Don't show the source selection if there isn't more than
            one source */}
        {sources && sources.length > 1 && <SourceFilter {...props} />}
        {typeOptions.hasImageSearch() &&
            <SimilarityFilter {...props} />}
        {showImageFilter && <ImageFilter {...props} />}
        {sorts && sorts.length > 0 && <Sorts {...props} />}
        <div className="form-group">
            <input type="submit" value={gettext("Search")}
                className="btn btn-primary"
            />
        </div>
    </form>;
};

const FacetBucket = ({bucket}: {bucket: Bucket}) => <li>
    <a href={bucket.url}>{bucket.text}</a>
    {" "}({bucket.count})
</li>;

const Facet = ({
    facet,
    type,
    format,
    gettext,
}: Props & {facet: FacetType}) => {
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

    return <div className="panel panel-default facet">
        <div className="panel-heading">{facet.name}</div>
        <div className="panel-body">
            <ul>
                {buckets.map((bucket) =>
                    <FacetBucket bucket={bucket} key={bucket.url} />)}
            </ul>

            {extra && <div>
                <button className="btn btn-default btn-xs toggle-facets">
                    {format(
                        gettext("Show %(count)s more..."),
                            {count: extra.length})}
                </button>

                <div className="extra-facets">
                    <ul>
                        {extra.map((bucket) =>
                            <FacetBucket bucket={bucket} key={bucket.url} />)}
                    </ul>
                </div>
            </div>}
        </div>
    </div>;
};

const Facets = (props: Props) => {
    const {facets} = props;
    return <div className="hidden-xs hidden-sm">
        {facets && facets.map((facet) =>
            <Facet {...props} facet={facet} key={facet.name} />)}
    </div>;
};

const Sidebar = (props: Props) => {
    const {
        format,
        gettext,
        stringNum,
        total,
        start,
        end,
    } = props;

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
                        start: stringNum(start),
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

const Breadcrumb = ({
    crumb,
    format,
    gettext,
}: Props & {crumb: BreadcrumbType}) => <a href={crumb.url}
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

const NoResults = ({gettext}: Props) => <div className="row">
    <div className="col-xs-12">
        <div className="alert alert-info" role="alert">
            {gettext(
                "No results found. Please refine your query.")}
        </div>
    </div>
</div>;

const Pagination = ({
    prev,
    next,
    gettext,
}: Props) => <nav>
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

const ImageResultFooter = (props: Props & {record: RecordType}) => {
    const {
        record,
        sources,
        URL,
        lang,
        type,
    } = props;
    const resultFooter = options.types[type]
        .views.resultFooter;

    if (resultFooter) {
        return <div className="details">
            <div className="wrap">
                <resultFooter
                    {...props}
                    record={record}
                />
            </div>
        </div>;
    }

    // Don't show the source selection if there isn't more than one source
    if (!sources || sources.length <= 1) {
        return null;
    }

    return <div className="details">
        <div className="wrap">
            <span>
                <a className="pull-right"
                    href={URL(record.getSource())}
                    title={record.getSource().getFullName(lang)}
                >
                    {record.getSource().getShortName(lang)}
                </a>
            </span>
        </div>
    </div>;
};

const ImageResult = (props: Props & {record: RecordType}) => {
    const {
        record,
        URL,
        getTitle,
    } = props;

    return <div className="img col-xs-6 col-sm-4 col-md-3">
        <div className="img-wrap">
            <a href={URL(record)}
                title={getTitle(record)}
            >
                <img src={record.getThumbURL()}
                    alt={getTitle(record)}
                    title={getTitle(record)}
                    className="img-responsive center-block"
                />
            </a>
        </div>
        <ImageResultFooter {...props} record={record} />
    </div>;
};

const TextResult = ({
    URL,
    getTitle,
    record,
}: Props & {record: RecordType}) => <div className="col-xs-12">
    <a href={URL(record)}
        title={getTitle(record)}
    >
        {getTitle(record)}
    </a>
</div>;

const Results = (props: Props) => {
    const {breadcrumbs, records, type} = props;
    const imageResult = options.types[type].hasImages();

    return <div className="results-main col-sm-9 col-sm-pull-3">
        {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs {...props} />}
        {records.length === 0 && <NoResults {...props} />}
        {<Pagination {...props} />}
        <div className="row">
            {records.map((record) => imageResult ?
                <ImageResult {...props} record={record} key={record._id} /> :
                <TextResult {...props} record={record} key={record._id} />
            )}
        </div>
        {<Pagination {...props} />}
    </div>;
};

const Search = (props: Props) => {
    const {title, url} = props;

    return <Page {...props}>
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
    </Page>;
};

module.exports = Search;
