// @flow

const React = require("react");

const Select = require("./shared/Select.js");
const DimensionFilter = require("./types/filter/Dimension.js");
const FixedStringFilter = require("./types/filter/FixedString.js");
const LocationFilter = require("./types/filter/Location.js");
const NameFilter = require("./types/filter/Name.js");
const YearRangeFilter = require("./types/filter/YearRange.js");

import type {Context, ModelType} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

type Source = {
    _id: string,
    name: string,
    getURL: string,
    getFullName: string,
    getShortName: string,
};

type Sort = {
    id: string,
    name: string,
};

type RecordType = {
    _id: string,
    type: string,
    source: string,
    getThumbURL: string,
    getTitle: string,
    getURL: string,
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
                    getTitle: string,
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
    const {searchName, filterMultiple} = typeSchema;
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
            multiple={filterMultiple}
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
            multiple={filterMultiple}
        />;

    } else if (typeSchema.type === "SimpleDate") {
        return null;

    } else if (typeSchema.type === "SimpleNumber") {
        return null;

    } else if (typeSchema.type === "SimpleString") {
        return null;

    } else if (typeSchema.type === "URL") {
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
    <Select
        name="source"
        value={values.source}
        placeholder={gettext("Filter by source...")}
        clearable={true}
        options={sources && sources.map((source) => ({
            value: source._id,
            label: source.name,
        }))}
    />
</div>;

SourceFilter.contextTypes = childContextTypes;

const SimilarityFilter = ({
    queries,
    values,
}: Props, {gettext}: Context) => {
    const similarity = queries.similar.filters;

    return <div className="form-group">
        <label htmlFor="similar" className="control-label">
            {gettext("Similarity")}
        </label>
        <Select
            name="similar"
            value={values.similar}
            clearable={true}
            options={Object.keys(similarity).map((id) => ({
                value: id,
                label: similarity[id].getTitle,
            }))}
        />
    </div>;
};

SimilarityFilter.contextTypes = childContextTypes;

const ImageFilter = ({
    queries,
    values,
}: Props, {gettext}: Context) => {
    const images = queries.images.filters;

    return <div className="form-group">
        <label htmlFor="images" className="control-label">
            {gettext("Images")}
        </label>
        <Select
            name="images"
            value={values.images}
            placeholder={gettext("Filter by image...")}
            clearable={true}
            options={Object.keys(images).map((id) => ({
                value: id,
                label: images[id].getTitle,
            }))}
        />
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
    <Select
        name="sort"
        value={values.sort}
        options={sorts && sorts.map((sort) => ({
            value: sort.id,
            label: sort.name,
        }))}
        clearable={false}
    />
</div>;

Sorts.contextTypes = childContextTypes;

const SearchForm = (props: Props, {
    gettext,
    options,
    URL,
}: Context) => {
    const {type, values, sorts, sources} = props;
    const typeOptions = options.types[type];
    const placeholder = typeOptions.getSearchPlaceholder;
    const showImageFilter = typeOptions.hasImages &&
        !typeOptions.requiresImages;

    return <form action={URL(`/${type}/search`)} method="GET">
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
