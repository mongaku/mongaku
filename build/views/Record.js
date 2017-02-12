"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const React = require("react");

const Page = require("./Page.js");
const DimensionView = require("./types/view/Dimension.js");
const FixedStringView = require("./types/view/FixedString.js");
const LocationView = require("./types/view/Location.js");
const NameView = require("./types/view/Name.js");
const YearRangeView = require("./types/view/YearRange.js");
const { format } = require("./utils.js");

var babelPluginFlowReactPropTypes_proptype_ModelType = require("./types.js").babelPluginFlowReactPropTypes_proptype_ModelType || require("react").PropTypes.any;

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

const { childContextTypes } = require("./Wrapper.js");

// Determine if at least one record has a value for this type
const hasValue = (records, type) => {
    return records.some(record => {
        const value = record[type];
        return value && (!Array.isArray(value) || value.length > 0);
    });
};

const Title = props => {
    const { record, records } = props;
    const size = Math.max(Math.round(12 / records.length), 3);
    // TODO(jeresig): Fix recordTitle to be i18n
    const title = record.title || "";

    return React.createElement(
        "th",
        { className: `col-xs-${size} text-center` },
        React.createElement(
            "h1",
            { className: "panel-title" },
            title
        )
    );
};

const Image = ({
    image,
    record,
    active
}, { lang }) => React.createElement(
    "div",
    { className: `item ${active ? "active" : ""}` },
    React.createElement(
        "a",
        { href: image.getOriginalURL() },
        React.createElement("img", { src: image.getScaledURL(),
            alt: record.getTitle(lang),
            title: record.getTitle(lang),
            className: "img-responsive center-block"
        })
    )
);

Image.contextTypes = childContextTypes;

const Carousel = ({ record }, {
    gettext
}) => {
    const carouselId = record._id.replace("/", "-");
    return React.createElement(
        "div",
        null,
        React.createElement(
            "ol",
            { className: "carousel-indicators" },
            record.images.map((image, i) => React.createElement("li", {
                "data-target": `#${carouselId}`,
                "data-slide-to": i,
                className: i === 0 ? "active" : "",
                key: `img${i}`
            }))
        ),
        React.createElement(
            "a",
            { className: "left carousel-control",
                href: `#${carouselId}`, role: "button",
                "data-slide": "prev"
            },
            React.createElement("span", { className: "glyphicon glyphicon-chevron-left",
                "aria-hidden": "true"
            }),
            React.createElement(
                "span",
                { className: "sr-only" },
                gettext("Previous")
            )
        ),
        React.createElement(
            "a",
            { className: "right carousel-control",
                href: `#${carouselId}`, role: "button",
                "data-slide": "next"
            },
            React.createElement("span", { className: "glyphicon glyphicon-chevron-right",
                "aria-hidden": "true"
            }),
            React.createElement(
                "span",
                { className: "sr-only" },
                gettext("Next")
            )
        )
    );
};

Carousel.contextTypes = childContextTypes;

const Images = props => {
    const { record } = props;
    const carouselId = record._id.replace("/", "-");

    return React.createElement(
        "td",
        null,
        React.createElement(
            "div",
            { id: carouselId, className: "carousel", "data-interval": "0" },
            React.createElement(
                "div",
                { className: "carousel-inner", role: "listbox" },
                record.images.map((image, i) => React.createElement(Image, _extends({}, props, {
                    record: record,
                    image: image,
                    active: i === 0,
                    key: i
                })))
            ),
            record.images.length > 1 && React.createElement(Carousel, _extends({}, props, { record: record }))
        )
    );
};

const TypeView = ({
    name,
    type,
    value,
    typeSchema
}) => {
    const { multiple } = typeSchema;

    if (typeSchema.type === "Dimension") {
        return React.createElement(DimensionView, {
            name: name,
            type: type,
            value: value,
            defaultUnit: typeSchema.defaultUnit
        });
    } else if (typeSchema.type === "FixedString") {
        const expectedValues = typeSchema.values || {};
        const values = Object.keys(expectedValues).map(id => ({
            id,
            name: expectedValues[id].name
        }));

        return React.createElement(FixedStringView, {
            name: name,
            type: type,
            value: value,
            values: values,
            multiple: multiple
        });
    } else if (typeSchema.type === "LinkedRecord") {
        return null;
    } else if (typeSchema.type === "Location") {
        return React.createElement(LocationView, {
            name: name,
            type: type,
            value: value
        });
    } else if (typeSchema.type === "Name") {
        return React.createElement(NameView, {
            name: name,
            type: type,
            value: value,
            multiple: multiple
        });
    } else if (typeSchema.type === "SimpleDate") {
        return React.createElement(FixedStringView, {
            name: name,
            type: type,
            value: value
        });
    } else if (typeSchema.type === "SimpleNumber") {
        return React.createElement(FixedStringView, {
            name: name,
            type: type,
            value: value
        });
    } else if (typeSchema.type === "SimpleString") {
        return React.createElement(FixedStringView, {
            name: name,
            type: type,
            value: value,
            multiline: typeSchema.multiline
        });
    } else if (typeSchema.type === "YearRange") {
        return React.createElement(YearRangeView, {
            name: name,
            type: type,
            value: value
        });
    }

    return null;
};

TypeView.propTypes = {
    name: require("react").PropTypes.string.isRequired,
    type: require("react").PropTypes.string.isRequired,
    value: require("react").PropTypes.any.isRequired,
    typeSchema: babelPluginFlowReactPropTypes_proptype_ModelType
};
const Metadata = (props, { options }) => {
    const { records, sources } = props;
    const firstRecord = records[0];

    if (!firstRecord) {
        return null;
    }

    // We assume that all the records are the same type
    const recordType = firstRecord.type;
    const { model } = options.types[recordType];

    return React.createElement(
        "tbody",
        null,
        options.types[recordType].display.map(type => {
            const typeSchema = model[type];

            // Hide if it there isn't at least one value to display
            if (!hasValue(records, type)) {
                return null;
            }

            return React.createElement(
                "tr",
                { key: type },
                React.createElement(
                    "th",
                    { className: "text-right" },
                    typeSchema.title
                ),
                records.map(record => React.createElement(
                    "td",
                    { key: record._id },
                    React.createElement(TypeView, {
                        name: type,
                        type: recordType,
                        value: record[type],
                        typeSchema: typeSchema
                    })
                ))
            );
        }),
        hasValue(records, "url") && React.createElement(Details, props),
        sources.length > 1 && React.createElement(Sources, props)
    );
};

Metadata.propTypes = {
    compare: require("react").PropTypes.bool.isRequired,
    records: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired,
        title: require("react").PropTypes.string,
        images: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
            _id: require("react").PropTypes.string.isRequired,
            getOriginalURL: require("react").PropTypes.func.isRequired,
            getScaledURL: require("react").PropTypes.func.isRequired,
            getThumbURL: require("react").PropTypes.func.isRequired
        })).isRequired,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired,
        getTitle: require("react").PropTypes.func.isRequired,
        getSource: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired,
    similar: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        recordModel: require("react").PropTypes.shape({
            _id: require("react").PropTypes.string.isRequired,
            type: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired,
            images: require("react").PropTypes.arrayOf(require("react").PropTypes.string).isRequired,
            getOriginalURL: require("react").PropTypes.func.isRequired,
            getThumbURL: require("react").PropTypes.func.isRequired,
            getTitle: require("react").PropTypes.func.isRequired,
            getSource: require("react").PropTypes.func.isRequired,
            getURL: require("react").PropTypes.func.isRequired
        }).isRequired,
        score: require("react").PropTypes.number.isRequired
    })).isRequired,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getShortName: require("react").PropTypes.func.isRequired
    })).isRequired
};
Metadata.contextTypes = childContextTypes;

const Details = ({ records }, { gettext }) => React.createElement(
    "tr",
    null,
    React.createElement(
        "th",
        { className: "text-right" },
        gettext("Details")
    ),
    records.map(record => {
        const link = React.createElement(
            "a",
            { href: record.url },
            gettext("More information...")
        );

        return React.createElement(
            "td",
            { key: record._id },
            link
        );
    })
);

Details.propTypes = {
    compare: require("react").PropTypes.bool.isRequired,
    records: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired,
        title: require("react").PropTypes.string,
        images: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
            _id: require("react").PropTypes.string.isRequired,
            getOriginalURL: require("react").PropTypes.func.isRequired,
            getScaledURL: require("react").PropTypes.func.isRequired,
            getThumbURL: require("react").PropTypes.func.isRequired
        })).isRequired,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired,
        getTitle: require("react").PropTypes.func.isRequired,
        getSource: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired,
    similar: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        recordModel: require("react").PropTypes.shape({
            _id: require("react").PropTypes.string.isRequired,
            type: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired,
            images: require("react").PropTypes.arrayOf(require("react").PropTypes.string).isRequired,
            getOriginalURL: require("react").PropTypes.func.isRequired,
            getThumbURL: require("react").PropTypes.func.isRequired,
            getTitle: require("react").PropTypes.func.isRequired,
            getSource: require("react").PropTypes.func.isRequired,
            getURL: require("react").PropTypes.func.isRequired
        }).isRequired,
        score: require("react").PropTypes.number.isRequired
    })).isRequired,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getShortName: require("react").PropTypes.func.isRequired
    })).isRequired
};
Details.contextTypes = childContextTypes;

const Sources = ({ records }, { gettext, lang }) => React.createElement(
    "tr",
    null,
    React.createElement(
        "th",
        { className: "text-right" },
        gettext("Source")
    ),
    records.map(record => {
        const source = record.getSource();

        return React.createElement(
            "td",
            { key: record._id },
            React.createElement(
                "a",
                { href: source.getURL(lang) },
                source.getFullName(lang)
            )
        );
    })
);

Sources.propTypes = {
    compare: require("react").PropTypes.bool.isRequired,
    records: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired,
        title: require("react").PropTypes.string,
        images: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
            _id: require("react").PropTypes.string.isRequired,
            getOriginalURL: require("react").PropTypes.func.isRequired,
            getScaledURL: require("react").PropTypes.func.isRequired,
            getThumbURL: require("react").PropTypes.func.isRequired
        })).isRequired,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired,
        getTitle: require("react").PropTypes.func.isRequired,
        getSource: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired,
    similar: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        recordModel: require("react").PropTypes.shape({
            _id: require("react").PropTypes.string.isRequired,
            type: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired,
            images: require("react").PropTypes.arrayOf(require("react").PropTypes.string).isRequired,
            getOriginalURL: require("react").PropTypes.func.isRequired,
            getThumbURL: require("react").PropTypes.func.isRequired,
            getTitle: require("react").PropTypes.func.isRequired,
            getSource: require("react").PropTypes.func.isRequired,
            getURL: require("react").PropTypes.func.isRequired
        }).isRequired,
        score: require("react").PropTypes.number.isRequired
    })).isRequired,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getShortName: require("react").PropTypes.func.isRequired
    })).isRequired
};
Sources.contextTypes = childContextTypes;

const MainRecord = (props, {
    lang,
    gettext
}) => {
    const { similar, compare, records } = props;
    const recordWidth = similar.length > 0 ? "col-md-9" : "col-md-12";

    return React.createElement(
        "div",
        { className: `${recordWidth} imageholder` },
        (compare || records.length > 1) && React.createElement(
            "a",
            { href: records[0].getURL(lang),
                className: "btn btn-success"
            },
            "\xAB ",
            gettext("End Comparison")
        ),
        React.createElement(
            "div",
            { className: "responsive-table" },
            React.createElement(
                "table",
                { className: "table table-hover" },
                React.createElement(
                    "thead",
                    null,
                    React.createElement(
                        "tr",
                        { className: "plain" },
                        React.createElement("th", null),
                        records.map(record => React.createElement(Title, _extends({}, props, { record: record, key: record._id
                        })))
                    ),
                    React.createElement(
                        "tr",
                        { className: "plain" },
                        React.createElement("td", null),
                        records.map(record => React.createElement(Images, _extends({}, props, { record: record, key: record._id
                        })))
                    )
                ),
                React.createElement(Metadata, props)
            )
        )
    );
};

MainRecord.propTypes = {
    compare: require("react").PropTypes.bool.isRequired,
    records: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired,
        title: require("react").PropTypes.string,
        images: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
            _id: require("react").PropTypes.string.isRequired,
            getOriginalURL: require("react").PropTypes.func.isRequired,
            getScaledURL: require("react").PropTypes.func.isRequired,
            getThumbURL: require("react").PropTypes.func.isRequired
        })).isRequired,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired,
        getTitle: require("react").PropTypes.func.isRequired,
        getSource: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired,
    similar: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        recordModel: require("react").PropTypes.shape({
            _id: require("react").PropTypes.string.isRequired,
            type: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired,
            images: require("react").PropTypes.arrayOf(require("react").PropTypes.string).isRequired,
            getOriginalURL: require("react").PropTypes.func.isRequired,
            getThumbURL: require("react").PropTypes.func.isRequired,
            getTitle: require("react").PropTypes.func.isRequired,
            getSource: require("react").PropTypes.func.isRequired,
            getURL: require("react").PropTypes.func.isRequired
        }).isRequired,
        score: require("react").PropTypes.number.isRequired
    })).isRequired,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getShortName: require("react").PropTypes.func.isRequired
    })).isRequired
};
MainRecord.contextTypes = childContextTypes;

const SimilarMatch = ({
    match: { recordModel, score }
}, {
    gettext,
    lang
}) => React.createElement(
    "div",
    { className: "img col-md-12 col-xs-6 col-sm-4" },
    React.createElement(
        "a",
        { href: recordModel.getURL(lang) },
        React.createElement("img", { src: recordModel.getThumbURL(),
            alt: recordModel.getTitle(lang),
            title: recordModel.getTitle(lang),
            className: "img-responsive center-block"
        })
    ),
    React.createElement(
        "div",
        { className: "details" },
        React.createElement(
            "div",
            { className: "wrap" },
            React.createElement(
                "span",
                null,
                format(gettext("Score: %(score)s"), { score: score })
            ),
            React.createElement(
                "a",
                { className: "pull-right",
                    href: recordModel.getSource().getURL(lang),
                    title: recordModel.getSource().getFullName(lang)
                },
                recordModel.getSource().getShortName(lang)
            )
        )
    )
);

SimilarMatch.contextTypes = childContextTypes;

const Similar = (props, { gettext }) => {
    const { similar } = props;

    return React.createElement(
        "div",
        { className: "col-md-3" },
        React.createElement(
            "a",
            { href: "?compare", className: "btn btn-success btn-block",
                style: { marginBottom: 20 }
            },
            gettext("Compare Images"),
            " \xBB"
        ),
        React.createElement(
            "div",
            { className: "panel panel-default" },
            React.createElement(
                "div",
                { className: "panel-heading" },
                gettext("Similar Images")
            ),
            React.createElement(
                "div",
                { className: "panel-body row" },
                similar.map(match => match.recordModel && React.createElement(SimilarMatch, _extends({}, props, { match: match, key: match._id })))
            )
        )
    );
};

Similar.propTypes = {
    compare: require("react").PropTypes.bool.isRequired,
    records: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired,
        title: require("react").PropTypes.string,
        images: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
            _id: require("react").PropTypes.string.isRequired,
            getOriginalURL: require("react").PropTypes.func.isRequired,
            getScaledURL: require("react").PropTypes.func.isRequired,
            getThumbURL: require("react").PropTypes.func.isRequired
        })).isRequired,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired,
        getTitle: require("react").PropTypes.func.isRequired,
        getSource: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired,
    similar: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        recordModel: require("react").PropTypes.shape({
            _id: require("react").PropTypes.string.isRequired,
            type: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired,
            images: require("react").PropTypes.arrayOf(require("react").PropTypes.string).isRequired,
            getOriginalURL: require("react").PropTypes.func.isRequired,
            getThumbURL: require("react").PropTypes.func.isRequired,
            getTitle: require("react").PropTypes.func.isRequired,
            getSource: require("react").PropTypes.func.isRequired,
            getURL: require("react").PropTypes.func.isRequired
        }).isRequired,
        score: require("react").PropTypes.number.isRequired
    })).isRequired,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getShortName: require("react").PropTypes.func.isRequired
    })).isRequired
};
Similar.contextTypes = childContextTypes;

const Script = () => React.createElement("script", {
    dangerouslySetInnerHTML: { __html: `
        $(function() {
            $(".carousel").carousel();
        });
    ` }
});

const Record = (props, { lang }) => {
    const { records, similar } = props;
    const record = records[0];
    const title = record.title || "";
    const social = {
        imgURL: record.getOriginalURL(),
        title,
        url: record.getURL(lang)
    };

    return React.createElement(
        Page,
        {
            title: title,
            scripts: React.createElement(Script, null),
            social: social
        },
        React.createElement(
            "div",
            { className: "row" },
            React.createElement(MainRecord, props),
            similar.length > 0 && React.createElement(Similar, props)
        )
    );
};

Record.propTypes = {
    compare: require("react").PropTypes.bool.isRequired,
    records: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired,
        title: require("react").PropTypes.string,
        images: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
            _id: require("react").PropTypes.string.isRequired,
            getOriginalURL: require("react").PropTypes.func.isRequired,
            getScaledURL: require("react").PropTypes.func.isRequired,
            getThumbURL: require("react").PropTypes.func.isRequired
        })).isRequired,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired,
        getTitle: require("react").PropTypes.func.isRequired,
        getSource: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired,
    similar: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        recordModel: require("react").PropTypes.shape({
            _id: require("react").PropTypes.string.isRequired,
            type: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired,
            images: require("react").PropTypes.arrayOf(require("react").PropTypes.string).isRequired,
            getOriginalURL: require("react").PropTypes.func.isRequired,
            getThumbURL: require("react").PropTypes.func.isRequired,
            getTitle: require("react").PropTypes.func.isRequired,
            getSource: require("react").PropTypes.func.isRequired,
            getURL: require("react").PropTypes.func.isRequired
        }).isRequired,
        score: require("react").PropTypes.number.isRequired
    })).isRequired,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getShortName: require("react").PropTypes.func.isRequired
    })).isRequired
};
Record.contextTypes = childContextTypes;

module.exports = Record;