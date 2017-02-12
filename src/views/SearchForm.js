// @flow

const React = require("react");

const DimensionFilter = require("./types/filter/Dimension.js");
const FixedStringFilter = require("./types/filter/FixedString.js");
const LocationFilter = require("./types/filter/Location.js");
const NameFilter = require("./types/filter/Name.js");
const YearRangeFilter = require("./types/filter/YearRange.js");
const {URL} = require("./utils.js");

import type {Context, ModelType} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

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
    url?: string,
    getOriginalURL: () => string,
    getThumbURL: () => string,
    getTitle: () => string,
    getSource: () => Source,
    getURL: (lang: string) => string,
};

type Props = {
    type: string,
    total: number,
    start?: number,
    end?: number,
    sources?: Array<Source>,
    sorts?: Array<Sort>,
    records: Array<RecordType>,
    globalFacets: {
        [key: string]: Array<{
            text: string,
        }>,
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

const TypeFilter = ({
    name,
    value,
    allValues,
    typeSchema,
}: {
    name: string,
    value?: any,
    allValues: Array<any>,
    typeSchema: ModelType,
}) => {
    const {searchName, multiple} = typeSchema;
    const searchField = searchName || name;

    if (typeSchema.type === "Dimension") {
        return <DimensionFilter
            value={value}
            searchName={searchField}
            placeholder={typeSchema.placeholder}
            heightTitle={typeSchema.heightTitle}
            widthTitle={typeSchema.widthTitle}
        />;

    } else if (typeSchema.type === "FixedString") {
        const expectedValues = typeSchema.values || {};
        let values = Object.keys(expectedValues).map((id) => ({
            id,
            name: expectedValues[id].name,
        }));

        if (values.length === 0) {
            values = allValues.map((text) => ({
                id: text,
                name: text,
            }));
        }

        return <FixedStringFilter
            value={value}
            values={values}
            searchName={searchField}
            placeholder={typeSchema.placeholder}
            title={typeSchema.title}
            multiple={multiple}
        />;

    } else if (typeSchema.type === "LinkedRecord") {
        return null;

    } else if (typeSchema.type === "Location") {
        return <LocationFilter
            value={value}
            searchName={searchField}
            placeholder={typeSchema.placeholder}
            title={typeSchema.title}
        />;

    } else if (typeSchema.type === "Name") {
        return <NameFilter
            value={value}
            values={allValues}
            searchName={searchField}
            placeholder={typeSchema.placeholder}
            title={typeSchema.title}
            multiple={multiple}
        />;

    } else if (typeSchema.type === "SimpleDate") {
        return null;

    } else if (typeSchema.type === "SimpleNumber") {
        return null;

    } else if (typeSchema.type === "SimpleString") {
        return null;

    } else if (typeSchema.type === "YearRange") {
        return <YearRangeFilter
            value={value}
            searchName={searchField}
            placeholder={typeSchema.placeholder}
            title={typeSchema.title}
        />;
    }

    return null;
};

const Filters = ({type, globalFacets, values}: Props,
        {options}: Context) => {
    const {model} = options.types[type];

    return <div>
        {options.types[type].filters.map((modelType) => {
            const typeSchema = model[modelType];

            const allValues = (globalFacets[modelType] || [])
                .map((bucket) => bucket.text).sort();

            return <div key={modelType}>
                <TypeFilter
                    name={modelType}
                    value={values[modelType]}
                    allValues={allValues}
                    typeSchema={typeSchema}
                />
            </div>;
        })}
    </div>;
};

Filters.contextTypes = childContextTypes;

const SourceFilter = ({
    values,
    sources,
}: Props, {gettext}: Context) => <div className="form-group">
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

SourceFilter.contextTypes = childContextTypes;

const SimilarityFilter = ({
    queries,
    values,
}: Props, {gettext, lang}: Context) => {
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
                    {similarity[id].getTitle(lang)}
                </option>
            )}
        </select>
    </div>;
};

SimilarityFilter.contextTypes = childContextTypes;

const ImageFilter = ({
    queries,
    values,
}: Props, {gettext, lang}: Context) => {
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
                    {images[id].getTitle(lang)}
                </option>
            )}
        </select>
    </div>;
};

ImageFilter.contextTypes = childContextTypes;

const Sorts = ({
    values,
    sorts,
}: Props, {gettext}: Context) => <div className="form-group">
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

Sorts.contextTypes = childContextTypes;

const SearchForm = (props: Props, {lang, gettext, options}: Context) => {
    const {type, values, sorts, sources} = props;
    const searchURL = URL(lang, `/${type}/search`);
    const typeOptions = options.types[type];
    const placeholder = typeOptions.getSearchPlaceholder;
    const showImageFilter = typeOptions.hasImages ||
        !typeOptions.requiresImages;

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
        {typeOptions.hasImageSearch &&
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

SearchForm.contextTypes = childContextTypes;

module.exports = SearchForm;
