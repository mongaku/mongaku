// @flow

const React = require("react");

const DimensionView = require("./types/view/Dimension.js");
const FixedStringView = require("./types/view/FixedString.js");
const LocationView = require("./types/view/Location.js");
const NameView = require("./types/view/Name.js");
const YearRangeView = require("./types/view/YearRange.js");

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
    getValueURLs: {
        [name: string]: string,
    },
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
    <a href={image.getOriginalURL} target="_blank">
        <img src={image.getScaledURL}
            alt={record.getTitle}
            title={record.getTitle}
            className="img-responsive center-block"
        />
    </a>
</div>;

class Images extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            curPos: 0,
        };
    }

    state: {
        curPos: number,
    }

    props: Props & {record: RecordType}
    context: Context

    toggleImage(newPos) {
        const max = this.props.record.imageModels.length;
        let curPos = newPos;
        if (curPos < 0) {
            curPos = max - 1;
        } else if (curPos === max) {
            curPos = 0;
        }
        this.setState({curPos});
    }

    renderCarousel() {
        const {record} = this.props;
        const {gettext} = this.context;
        const {curPos} = this.state;
        return <div>
            <ol className="carousel-indicators">
                {record.imageModels.map((image, i) =>
                    <li
                        className={i === curPos ? "active" : ""}
                        key={`img${i}`}
                        onClick={() => this.toggleImage(i)}
                    />
                )}
            </ol>
            <a className="left carousel-control"
                href="javascript: void 0"
                role="button"
                onClick={() => this.toggleImage(curPos - 1)}
            >
                <span className="glyphicon glyphicon-chevron-left"
                    aria-hidden="true"
                />
                <span className="sr-only">
                    {gettext("Previous")}
                </span>
            </a>
            <a className="right carousel-control"
                href="javascript: void 0"
                role="button"
                onClick={() => this.toggleImage(curPos + 1)}
            >
                <span className="glyphicon glyphicon-chevron-right"
                    aria-hidden="true"
                />
                <span className="sr-only">
                    {gettext("Next")}
                </span>
            </a>
        </div>;
    }

    render() {
        const {record} = this.props;
        return <td>
            <div className="carousel">
                <div className="carousel-inner" role="listbox">
                    {record.imageModels.map((image, i) => <Image
                        {...this.props}
                        record={record}
                        image={image}
                        active={i === this.state.curPos}
                        key={i}
                    />)}
                </div>

                {record.imageModels.length > 1 && this.renderCarousel()}
            </div>
        </td>;
    }
}

Images.contextTypes = childContextTypes;

const TypeView = ({
    value,
    url,
    typeSchema,
}: {
    value: any,
    url: string | Array<string>,
    typeSchema: ModelType,
}) => {
    const {multiple} = typeSchema;

    if (typeSchema.type === "Dimension") {
        return <DimensionView
            value={value}
            url={url}
            defaultUnit={typeSchema.defaultUnit}
        />;

    } else if (typeSchema.type === "FixedString") {
        const expectedValues = typeSchema.values || {};
        const values = Object.keys(expectedValues).map((id) => ({
            id,
            name: expectedValues[id].name,
        }));

        return <FixedStringView
            value={value}
            values={values}
            url={url}
            multiple={multiple}
        />;

    } else if (typeSchema.type === "LinkedRecord") {
        return null;

    } else if (typeSchema.type === "Location" && Array.isArray(url)) {
        return <LocationView
            value={value}
            url={url}
        />;

    } else if (typeSchema.type === "Name" && Array.isArray(url)) {
        return <NameView
            value={value}
            url={url}
            multiple={multiple}
        />;

    } else if (typeSchema.type === "SimpleDate") {
        return <FixedStringView
            value={value}
            url={url}
        />;

    } else if (typeSchema.type === "SimpleNumber") {
        return <FixedStringView
            value={value}
            url={url}
        />;

    } else if (typeSchema.type === "SimpleString") {
        return <FixedStringView
            value={value}
            url={url}
            multiline={typeSchema.multiline}
        />;

    } else if (typeSchema.type === "URL") {
        return <FixedStringView
            value={value}
            url={value}
        />;

    } else if (typeSchema.type === "YearRange" && Array.isArray(url)) {
        return <YearRangeView
            value={value}
            url={url}
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
                        value={record[type]}
                        url={record.getValueURLs[type]}
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

const Sources = ({records, sources}: Props, {
    gettext,
    getSource,
}: Context) => <tr>
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
    format,
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

const Similar = (props: Props, {gettext, getSource}: Context) => {
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

const Record = (props: Props) => {
    const {similar} = props;

    return <div className="row">
        <MainRecord {...props} />
        {similar.length > 0 && <Similar {...props} />}
    </div>;
};

module.exports = Record;
