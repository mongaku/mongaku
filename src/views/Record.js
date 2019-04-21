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
    similarImages: Array<string>,
    width: number,
    height: number,
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
    return records.some(record => {
        const value = record[type];
        return value && (!Array.isArray(value) || value.length > 0);
    });
};

const Title = (props: Props & {record: RecordType}) => {
    const {record, records} = props;
    const size = Math.max(Math.round(12 / records.length), 3);
    const title = record.getTitle || "";

    return (
        <th className={`col-xs-${size} text-center`}>
            <h1 className="panel-title">{title}</h1>
        </th>
    );
};

const Image = ({
    image,
    record,
    active,
}: Props & {
    record: RecordType,
    image: ImageType,
    active: boolean,
}) => (
    <div className={`item ${active ? "active" : ""}`}>
        <a href={image.getOriginalURL} target="_blank">
            <img
                src={image.getScaledURL}
                alt={record.getTitle}
                title={record.getTitle}
                className="img-responsive center-block"
            />
        </a>
    </div>
);

class Images extends React.Component<
    Props & {record: RecordType},
    {
        curPos: number,
    },
> {
    constructor(props) {
        super(props);
        this.state = {
            curPos: 0,
        };
    }

    context: Context;
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
        return (
            <div>
                <ol className="carousel-indicators">
                    {record.imageModels.map((image, i) => (
                        <li
                            className={i === curPos ? "active" : ""}
                            key={`img${i}`}
                            onClick={() => this.toggleImage(i)}
                        />
                    ))}
                </ol>
                <a
                    className="left carousel-control"
                    href="javascript: void 0"
                    role="button"
                    onClick={() => this.toggleImage(curPos - 1)}
                >
                    <span
                        className="glyphicon glyphicon-chevron-left"
                        aria-hidden="true"
                    />
                    <span className="sr-only">{gettext("Previous")}</span>
                </a>
                <a
                    className="right carousel-control"
                    href="javascript: void 0"
                    role="button"
                    onClick={() => this.toggleImage(curPos + 1)}
                >
                    <span
                        className="glyphicon glyphicon-chevron-right"
                        aria-hidden="true"
                    />
                    <span className="sr-only">{gettext("Next")}</span>
                </a>
            </div>
        );
    }

    render() {
        const {record} = this.props;
        return (
            <td>
                <div className="carousel">
                    <div className="carousel-inner" role="listbox">
                        {record.imageModels.map((image, i) => (
                            <Image
                                {...this.props}
                                record={record}
                                image={image}
                                active={i === this.state.curPos}
                                key={i}
                            />
                        ))}
                    </div>

                    {record.imageModels.length > 1 && this.renderCarousel()}
                </div>
            </td>
        );
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
        return (
            <DimensionView
                value={value}
                url={url}
                defaultUnit={typeSchema.defaultUnit}
            />
        );
    } else if (typeSchema.type === "FixedString") {
        const expectedValues = typeSchema.values || {};
        const values = Object.keys(expectedValues).map(id => ({
            id,
            name: expectedValues[id].name,
        }));

        return (
            <FixedStringView
                value={value}
                values={values}
                url={url}
                multiple={multiple}
            />
        );
    } else if (typeSchema.type === "LinkedRecord") {
        return null;
    } else if (typeSchema.type === "Location" && Array.isArray(url)) {
        return <LocationView value={value} url={url} />;
    } else if (typeSchema.type === "Name" && Array.isArray(url)) {
        return <NameView value={value} url={url} multiple={multiple} />;
    } else if (typeSchema.type === "SimpleDate") {
        return <FixedStringView value={value} url={url} />;
    } else if (typeSchema.type === "SimpleNumber") {
        return <FixedStringView value={value} url={url} />;
    } else if (typeSchema.type === "SimpleString") {
        return (
            <FixedStringView
                value={value}
                url={url}
                multiline={typeSchema.multiline}
            />
        );
    } else if (typeSchema.type === "URL") {
        return <FixedStringView value={value} url={value} />;
    } else if (typeSchema.type === "YearRange" && Array.isArray(url)) {
        return <YearRangeView value={value} url={url} />;
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

    return (
        <tbody>
            {options.types[recordType].display.map(type => {
                const typeSchema = model[type];

                // Hide if it there isn't at least one value to display
                if (!hasValue(records, type)) {
                    return null;
                }

                return (
                    <tr key={type}>
                        <th className="text-right">{typeSchema.title}</th>
                        {records.map(record => (
                            <td key={record._id}>
                                <TypeView
                                    value={record[type]}
                                    url={record.getValueURLs[type]}
                                    typeSchema={typeSchema}
                                />
                            </td>
                        ))}
                    </tr>
                );
            })}
            {hasValue(records, "url") && <Details {...props} />}
            {sources.length > 1 && <Sources {...props} />}
        </tbody>
    );
};

Metadata.contextTypes = childContextTypes;

const Details = ({records}: Props, {gettext}: Context) => (
    <tr>
        <th className="text-right">{gettext("Details")}</th>
        {records.map(record => {
            const link = (
                <a href={record.url}>{gettext("More information...")}</a>
            );

            return <td key={record._id}>{link}</td>;
        })}
    </tr>
);

Details.contextTypes = childContextTypes;

const Sources = ({records, sources}: Props, {gettext, getSource}: Context) => (
    <tr>
        <th className="text-right">{gettext("Source")}</th>
        {records.map(record => {
            const source = getSource(record.source, sources);

            return (
                <td key={record._id}>
                    {source && <a href={source.getURL}>{source.getFullName}</a>}
                </td>
            );
        })}
    </tr>
);

Sources.contextTypes = childContextTypes;

const MainRecord = (props: Props, {gettext}: Context) => {
    const {similar, compare, records} = props;
    const recordWidth = similar.length > 0 ? "col-md-9" : "col-md-12";

    return (
        <div className={`${recordWidth} imageholder`}>
            {(compare || records.length > 1) && (
                <a href={records[0].getURL} className="btn btn-success">
                    « {gettext("End Comparison")}
                </a>
            )}
            <div className="responsive-table">
                <table className="table table-hover">
                    <thead>
                        <tr className="plain">
                            <th />
                            {records.map(record => (
                                <Title
                                    {...props}
                                    record={record}
                                    key={record._id}
                                />
                            ))}
                        </tr>
                        <tr className="plain">
                            <td />
                            {records.map(record => (
                                <Images
                                    {...props}
                                    record={record}
                                    key={record._id}
                                />
                            ))}
                        </tr>
                    </thead>
                    <Metadata {...props} />
                </table>
            </div>
        </div>
    );
};

MainRecord.contextTypes = childContextTypes;

const SimilarMatch = (
    {
        source,
        match: {recordModel, score},
    }: Props & {source: ?Source, match: Match},
    {gettext, format}: Context,
) => (
    <div className="img col-md-12 col-xs-6 col-sm-4">
        <a href={recordModel.getURL}>
            <img
                src={recordModel.getThumbURL}
                alt={recordModel.getTitle}
                title={recordModel.getTitle}
                className="img-responsive center-block"
            />
        </a>
        <div className="details">
            <div className="wrap">
                <span>
                    {format(gettext("Score: %(score)s"), {score: score})}
                </span>

                {source && (
                    <a
                        className="pull-right"
                        href={source.getURL}
                        title={source.getFullName}
                    >
                        {source.getShortName}
                    </a>
                )}
            </div>
        </div>
    </div>
);

SimilarMatch.contextTypes = childContextTypes;

const Similar = (props: Props, {gettext, getSource}: Context) => {
    const {similar, sources} = props;

    return (
        <div className="col-md-3">
            <a
                href="?compare"
                className="btn btn-success btn-block"
                style={{marginBottom: 20}}
            >
                {gettext("Compare Images")} »
            </a>

            <div className="panel panel-default">
                <div className="panel-heading">{gettext("Similar Images")}</div>
                <div className="panel-body row">
                    {similar.map(match => {
                        if (match.recordModel) {
                            return (
                                <SimilarMatch
                                    {...props}
                                    source={getSource(
                                        match.recordModel.source,
                                        sources,
                                    )}
                                    match={match}
                                    key={match._id}
                                />
                            );
                        }

                        return null;
                    })}
                </div>
            </div>
        </div>
    );
};

Similar.contextTypes = childContextTypes;

const RecordDetails = (
    {record}: {record: RecordType},
    {gettext, options}: Context,
) => (
    <td style={{width: "auto", maxWidth: 300}}>
        <table className="table">
            <thead>
                <tr className="plain">
                    <th />
                    <th>
                        <a href={record.getURL} target="_blank">
                            {record.title}
                        </a>
                    </th>
                </tr>
            </thead>
            <tbody>
                {options.types[record.type].display.map(type => {
                    // We assume that all the records are the same type
                    const {model} = options.types[record.type];
                    const typeSchema = model[type];

                    // Hide if it there isn't at least one value to display
                    if (!hasValue([record], type)) {
                        return null;
                    }

                    return (
                        <tr key={type}>
                            <th className="text-right">{typeSchema.title}</th>
                            <td>
                                <TypeView
                                    value={record[type]}
                                    url={record.getValueURLs[type]}
                                    typeSchema={typeSchema}
                                />
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </td>
);

RecordDetails.contextTypes = childContextTypes;

const clusterImages = (records: Array<RecordType>) => {
    const sourceRecord = records[0];
    const rows = [
        {
            record: sourceRecord,
            slots: [{noMatch: true, images: []}],
        },
    ];
    const {slots} = rows[0];
    let curSlot = slots[0];

    for (const image of sourceRecord.imageModels) {
        if (image.similarImages.length > 0) {
            slots.push({
                match: image._id,
                matching: image.similarImages.map(similar => similar._id),
                images: [image],
            });

            curSlot = {
                noMatch: true,
                images: [],
            };
            slots.push(curSlot);
        } else {
            curSlot.images.push(image);
        }
    }

    for (let i = 1; i < records.length; i += 1) {
        const record = records[i];
        const row = {
            record,
            slots: rows[0].slots.map(slot => ({
                noMatch: slot.noMatch,
                match: slot.match,
                matching: slot.matching,
                expected: slot.images.length,
                images: [],
            })),
        };
        let curSlotPos = 0;

        for (const image of record.imageModels) {
            const matchingSlotPos = row.slots.findIndex(
                ({matching}) => matching && matching.includes(image._id),
            );

            if (matchingSlotPos > -1) {
                row.slots[matchingSlotPos].images.push(image);
                curSlotPos = matchingSlotPos + 1;
            } else {
                row.slots[curSlotPos].images.push(image);
            }
        }

        // Some hackiness to try and optimize the display a bit when there
        // are more than 2 matches
        for (let s = row.slots.length - 1; s >= 1; s -= 1) {
            const slot = row.slots[s];

            // Find a place where we expect some images but none was found
            if (slot.expected > 0 && slot.images.length === 0) {
                let needed = slot.expected;

                for (let ss = s - 1; ss >= 0; ss -= 1) {
                    const searchSlot = row.slots[ss];

                    if (searchSlot.noMatch && searchSlot.images.length > 0) {
                        if (searchSlot.images.length >= needed) {
                            while (
                                searchSlot.images.length > 0 &&
                                slot.images.length < slot.expected
                            ) {
                                const image = searchSlot.images.pop();
                                slot.images.push(image);
                            }
                        }
                        break;
                    } else if (searchSlot.expected > 0) {
                        if (searchSlot.images.length > 0) {
                            break;
                        }
                        needed += searchSlot.expected;
                    }
                }
            }
        }

        rows.push(row);
    }

    return rows;
};

const openModal = (rows, slotPos: number, rowPos: number) => {
    const images = [];

    for (const row of rows) {
        for (const image of row.slots[slotPos].images) {
            images.push({
                src: image.getOriginalURL,
                w: image.width,
                h: image.height,
            });
        }
    }

    const psElem = document.querySelector(".pswp");
    // $FlowFixMe
    const gallery = new PhotoSwipe(psElem, PhotoSwipeUI_Default, images, {
        index: rowPos,
    });
    gallery.init();
};

const PhotoSwipeHtml = (props, {gettext}: Context) => (
    <div className="pswp" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="pswp__bg" />

        <div className="pswp__scroll-wrap">
            <div className="pswp__container">
                <div className="pswp__item" />
                <div className="pswp__item" />
                <div className="pswp__item" />
            </div>

            <div className="pswp__ui pswp__ui--hidden">
                <div className="pswp__top-bar">
                    <div className="pswp__counter" />

                    <button
                        className="pswp__button pswp__button--close"
                        title={gettext("Close (Esc)")}
                    />

                    <button
                        className="pswp__button pswp__button--share"
                        title={gettext("Share")}
                    />

                    <button
                        className="pswp__button pswp__button--fs"
                        title={gettext("Toggle fullscreen")}
                    />

                    <button
                        className="pswp__button pswp__button--zoom"
                        title={gettext("Zoom in/out")}
                    />
                    <div className="pswp__preloader">
                        <div className="pswp__preloader__icn">
                            <div className="pswp__preloader__cut">
                                <div className="pswp__preloader__donut" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                    <div className="pswp__share-tooltip" />
                </div>

                <button
                    className="pswp__button pswp__button--arrow--left"
                    title={gettext("Previous (arrow left)")}
                />

                <button
                    className="pswp__button pswp__button--arrow--right"
                    title={gettext("Next (arrow right)")}
                />

                <div className="pswp__caption">
                    <div className="pswp__caption__center" />
                </div>
            </div>
        </div>
    </div>
);

PhotoSwipeHtml.contextTypes = childContextTypes;

const BookStyleComparison = ({records}: Props, {gettext}: Context) => {
    const rows = clusterImages(records);

    return (
        <div>
            <a href={records[0].getURL} className="btn btn-success">
                « {gettext("End Comparison")}
            </a>
            <br />
            <br />
            <table
                className="table table-bordered"
                style={{width: "min-content"}}
            >
                <thead>
                    <tr>
                        {rows.map((row, i) => (
                            <RecordDetails key={i} record={row.record} />
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows[0].slots.map((cluster, i) => (
                        <tr key={`row-${i}`}>
                            {rows.map((row, rowPos) => (
                                <td
                                    key={`cluster-${i}-${rowPos}`}
                                    style={{textAlign: "center"}}
                                    className={
                                        row.slots[i].match ? "success" : ""
                                    }
                                >
                                    {row.slots[i].images.map(image => (
                                        <a
                                            href={image.getOriginalURL}
                                            target="_blank"
                                            key={image._id}
                                            onClick={e => {
                                                if (row.slots[i].match) {
                                                    e.preventDefault();
                                                    openModal(rows, i, rowPos);
                                                }
                                            }}
                                        >
                                            <img
                                                src={image.getScaledURL}
                                                alt={row.record.getTitle}
                                                title={row.record.getTitle}
                                                style={{height: 250}}
                                            />
                                        </a>
                                    ))}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <PhotoSwipeHtml />
        </div>
    );
};

BookStyleComparison.contextTypes = childContextTypes;

const Record = (props: Props, {options}: Context) => {
    const {similar, records} = props;

    if (records.length > 1) {
        const recordType = records[0].type;
        if (options.types[recordType].bookStyleComparison) {
            return <BookStyleComparison {...props} />;
        }
    }

    return (
        <div className="row">
            <MainRecord {...props} />
            {similar.length > 0 && <Similar {...props} />}
        </div>
    );
};

Record.contextTypes = childContextTypes;

module.exports = Record;
