// @flow

const React = require("react");

const Page = require("./Page.js");
const DimensionView = require("./types/view/Dimension.js");
const FixedStringView = require("./types/view/FixedString.js");
const LocationView = require("./types/view/Location.js");
const NameView = require("./types/view/Name.js");
const YearRangeView = require("./types/view/YearRange.js");
const {format, getSource} = require("./utils.js");

import type {Context, ModelType} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

type ImageType = {
    _id: string,
    getOriginalURL: string,
    getScaledURL: string,
    getThumbURL: string,
};

type UnpopulatedRecordType = {
    _id: string,
    type: string,
    url: string,
    source: string,
    getOriginalURL: string,
    getThumbURL: string,
    getTitle: string,
    getURL: string,
};

type RecordType = {
    _id: string,
    type: string,
    url: string,
    title?: string,
    source: string,
    imageModels: Array<ImageType>,
    getOriginalURL: string,
    getThumbURL: string,
    getTitle: string,
    getURL: string,
};

type Source = {
    _id: string,
    name: string,
    getURL: string,
    getFullName: string,
    getShortName: string,
};

type Match = {
    _id: string,
    recordModel: UnpopulatedRecordType,
    score: number,
};

type Props = {
    compare: boolean,
    records: Array<RecordType>,
    similar: Array<Match>,
    sources: Array<Source>,
};

// Determine if at least one record has a value for this type
const hasValue = (records, type) => {
    return records.some((record) => {
        const value = record[type];
        return value && (!Array.isArray(value) || value.length > 0);
    });
};

const Title = (props: Props & {record: RecordType}) => {
    const {record, records} = props;
    const size = Math.max(Math.round(12 / records.length), 3);
    const title = record.getTitle || "";

    return <th className={`col-xs-${size} text-center`}>
        <h1 className="panel-title">{title}</h1>
    </th>;
};

const Image = ({
    image,
    record,
    active,
}: Props & {
    record: RecordType,
    image: ImageType,
    active: boolean,
}) => <div className={`item ${active ? "active" : ""}`}>
    <a href={image.getOriginalURL}>
        <img src={image.getScaledURL}
            alt={record.getTitle}
            title={record.getTitle}
            className="img-responsive center-block"
        />
    </a>
</div>;

const Carousel = ({record}: Props & {record: RecordType}, {
    gettext,
}: Context) => {
    const carouselId = record._id.replace("/", "-");
    return <div>
        <ol className="carousel-indicators">
            {record.imageModels.map((image, i) =>
                <li
                    data-target={`#${carouselId}`}
                    data-slide-to={i}
                    className={i === 0 ? "active" : ""}
                    key={`img${i}`}
                />
            )}
        </ol>
        <a className="left carousel-control"
            href={`#${carouselId}`} role="button"
            data-slide="prev"
        >
            <span className="glyphicon glyphicon-chevron-left"
                aria-hidden="true"
            />
            <span className="sr-only">
                {gettext("Previous")}
            </span>
        </a>
        <a className="right carousel-control"
            href={`#${carouselId}`} role="button"
            data-slide="next"
        >
            <span className="glyphicon glyphicon-chevron-right"
                aria-hidden="true"
            />
            <span className="sr-only">
                {gettext("Next")}
            </span>
        </a>
    </div>;
};

Carousel.contextTypes = childContextTypes;

const Images = (props: Props & {record: RecordType}) => {
    const {record} = props;
    const carouselId = record._id.replace("/", "-");

    return <td>
        <div id={carouselId} className="carousel" data-interval="0">
            <div className="carousel-inner" role="listbox">
                {record.imageModels.map((image, i) => <Image
                    {...props}
                    record={record}
                    image={image}
                    active={i === 0}
                    key={i}
                />)}
            </div>

            {record.imageModels.length > 1 &&
                <Carousel {...props} record={record} />}
        </div>
    </td>;
};

const TypeView = ({
    name,
    type,
    value,
    typeSchema,
}: {
    name: string,
    type: string,
    value: any,
    typeSchema: ModelType,
}) => {
    const {multiple} = typeSchema;

    if (typeSchema.type === "Dimension") {
        return <DimensionView
            name={name}
            type={type}
            value={value}
            defaultUnit={typeSchema.defaultUnit}
        />;

    } else if (typeSchema.type === "FixedString") {
        const expectedValues = typeSchema.values || {};
        const values = Object.keys(expectedValues).map((id) => ({
            id,
            name: expectedValues[id].name,
        }));

        return <FixedStringView
            name={name}
            type={type}
            value={value}
            values={values}
            multiple={multiple}
        />;

    } else if (typeSchema.type === "LinkedRecord") {
        return null;

    } else if (typeSchema.type === "Location") {
        return <LocationView
            name={name}
            type={type}
            value={value}
        />;

    } else if (typeSchema.type === "Name") {
        return <NameView
            name={name}
            type={type}
            value={value}
            multiple={multiple}
        />;

    } else if (typeSchema.type === "SimpleDate") {
        return <FixedStringView
            name={name}
            type={type}
            value={value}
        />;

    } else if (typeSchema.type === "SimpleNumber") {
        return <FixedStringView
            name={name}
            type={type}
            value={value}
        />;

    } else if (typeSchema.type === "SimpleString") {
        return <FixedStringView
            name={name}
            type={type}
            value={value}
            multiline={typeSchema.multiline}
        />;

    } else if (typeSchema.type === "YearRange") {
        return <YearRangeView
            name={name}
            type={type}
            value={value}
        />;
    }

    return null;
};

const Metadata = (props: Props, {options}: Context) => {
    const {records, sources} = props;
    const firstRecord = records[0];

    if (!firstRecord) {
        return null;
    }

    // We assume that all the records are the same type
    const recordType = firstRecord.type;
    const {model} = options.types[recordType];

    return <tbody>
        {options.types[recordType].display.map((type) => {
            const typeSchema = model[type];

            // Hide if it there isn't at least one value to display
            if (!hasValue(records, type)) {
                return null;
            }

            return <tr key={type}>
                <th className="text-right">
                    {typeSchema.title}
                </th>
                {records.map((record) => <td key={record._id}>
                    <TypeView
                        name={type}
                        type={recordType}
                        value={record[type]}
                        typeSchema={typeSchema}
                    />
                </td>)}
            </tr>;
        })}
        {hasValue(records, "url") && <Details {...props} />}
        {sources.length > 1 && <Sources {...props} />}
    </tbody>;
};

Metadata.contextTypes = childContextTypes;

const Details = ({records}: Props, {gettext}: Context) => <tr>
    <th className="text-right">
        {gettext("Details")}
    </th>
    {records.map((record) => {
        const link = <a href={record.url}>
            {gettext("More information...")}
        </a>;

        return <td key={record._id}>{link}</td>;
    })}
</tr>;

Details.contextTypes = childContextTypes;

const Sources = ({records, sources}: Props, {gettext}: Context) => <tr>
    <th className="text-right">
        {gettext("Source")}
    </th>
    {records.map((record) => {
        const source = getSource(record.source, sources);

        return <td key={record._id}>
            {source && <a href={source.getURL}>
                {source.getFullName}
            </a>}
        </td>;
    })}
</tr>;

Sources.contextTypes = childContextTypes;

const MainRecord = (props: Props, {gettext}: Context) => {
    const {similar, compare, records} = props;
    const recordWidth = similar.length > 0 ?
        "col-md-9" : "col-md-12";

    return <div className={`${recordWidth} imageholder`}>
        {(compare || records.length > 1) &&
            <a href={records[0].getURL}
                className="btn btn-success"
            >
                &laquo; {gettext("End Comparison")}
            </a>}
        <div className="responsive-table">
            <table className="table table-hover">
                <thead>
                    <tr className="plain">
                        <th/>
                        {records.map((record) => <Title
                            {...props} record={record} key={record._id}
                        />)}
                    </tr>
                    <tr className="plain">
                        <td/>
                        {records.map((record) => <Images
                            {...props} record={record} key={record._id}
                        />)}
                    </tr>
                </thead>
                <Metadata {...props} />
            </table>
        </div>
    </div>;
};

MainRecord.contextTypes = childContextTypes;

const SimilarMatch = ({
    source,
    match: {recordModel, score},
}: Props & {source: ?Source, match: Match}, {
    gettext,
}: Context) => <div className="img col-md-12 col-xs-6 col-sm-4">
    <a href={recordModel.getURL}>
        <img src={recordModel.getThumbURL}
            alt={recordModel.getTitle}
            title={recordModel.getTitle}
            className="img-responsive center-block"
        />
    </a>
    <div className="details">
        <div className="wrap">
            <span>{format(gettext(
                "Score: %(score)s"), {score: score})}</span>

            {source && <a className="pull-right"
                href={source.getURL}
                title={source.getFullName}
            >
                {source.getShortName}
            </a>}
        </div>
    </div>
</div>;

SimilarMatch.contextTypes = childContextTypes;

const Similar = (props: Props, {gettext}: Context) => {
    const {similar, sources} = props;

    return <div className="col-md-3">
        <a href="?compare" className="btn btn-success btn-block"
            style={{marginBottom: 20}}
        >
            {gettext("Compare Images")} &raquo;
        </a>

        <div className="panel panel-default">
            <div className="panel-heading">
                {gettext("Similar Images")}
            </div>
            <div className="panel-body row">
                {similar.map((match) => {
                    if (match.recordModel) {
                        return <SimilarMatch
                            {...props}
                            source={getSource(match.recordModel.source,
                                sources)}
                            match={match}
                            key={match._id}
                        />;
                    }

                    return null;
                })}
            </div>
        </div>
    </div>;
};

Similar.contextTypes = childContextTypes;

const Script = () => <script
    dangerouslySetInnerHTML={{__html: `
        $(function() {
            $(".carousel").carousel();
        });
    `}}
/>;

const Record = (props: Props) => {
    const {records, similar} = props;
    const record = records[0];
    const title = record.title || "";
    const social = {
        imgURL: record.getOriginalURL,
        title,
        url: record.getURL,
    };

    return <Page
        title={title}
        scripts={<Script/>}
        social={social}
    >
        <div className="row">
            <MainRecord {...props} />
            {similar.length > 0 && <Similar {...props} />}
        </div>
    </Page>;
};

module.exports = Record;
