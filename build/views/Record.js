"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react");

var metadata = require("../lib/metadata");
var options = require("../lib/options");

var Page = require("./Page.js");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

var _require = require("./Wrapper.js"),
    childContextTypes = _require.childContextTypes;

// Determine if at least one record has a value for this type
var hasValue = function hasValue(records, type) {
    return records.some(function (record) {
        var value = record[type];
        return value && (!Array.isArray(value) || value.length > 0);
    });
};

var Title = function Title(props) {
    var record = props.record,
        records = props.records;

    var size = Math.max(Math.round(12 / records.length), 3);
    var title = options.types[record.type].recordTitle(record, props);

    return React.createElement(
        "th",
        { className: "col-xs-" + size + " text-center" },
        React.createElement(
            "h1",
            { className: "panel-title" },
            title
        )
    );
};

var Image = function Image(_ref, _ref2) {
    var image = _ref.image,
        record = _ref.record,
        active = _ref.active;
    var getTitle = _ref2.getTitle;
    return React.createElement(
        "div",
        { className: "item " + (active ? "active" : "") },
        React.createElement(
            "a",
            { href: image.getOriginalURL() },
            React.createElement("img", { src: image.getScaledURL(),
                alt: getTitle(record),
                title: getTitle(record),
                className: "img-responsive center-block"
            })
        )
    );
};

Image.contextTypes = childContextTypes;

var Carousel = function Carousel(_ref3, _ref4) {
    var record = _ref3.record;
    var gettext = _ref4.gettext;

    var carouselId = record._id.replace("/", "-");
    return React.createElement(
        "div",
        null,
        React.createElement(
            "ol",
            { className: "carousel-indicators" },
            record.images.map(function (image, i) {
                return React.createElement("li", {
                    "data-target": "#" + carouselId,
                    "data-slide-to": i,
                    className: i === 0 ? "active" : "",
                    key: "img" + i
                });
            })
        ),
        React.createElement(
            "a",
            { className: "left carousel-control",
                href: "#" + carouselId, role: "button",
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
                href: "#" + carouselId, role: "button",
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

var Images = function Images(props) {
    var record = props.record;

    var carouselId = record._id.replace("/", "-");

    return React.createElement(
        "td",
        null,
        React.createElement(
            "div",
            { id: carouselId, className: "carousel", "data-interval": "0" },
            React.createElement(
                "div",
                { className: "carousel-inner", role: "listbox" },
                record.images.map(function (image, i) {
                    return React.createElement(Image, _extends({}, props, {
                        record: record,
                        image: image,
                        active: i === 0,
                        key: image._id
                    }));
                })
            ),
            record.images.length > 1 && React.createElement(Carousel, _extends({}, props, { record: record }))
        )
    );
};

var Metadata = function Metadata(props) {
    var records = props.records,
        sources = props.sources;

    var firstRecord = records[0];

    if (!firstRecord) {
        return null;
    }

    // We assume that all the records are the same type
    var type = records[0].type;
    var model = metadata.model(type);

    return React.createElement(
        "tbody",
        null,
        options.types[type].display.map(function (type) {
            var typeSchema = model[type];

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
                    typeSchema.options.title(props)
                ),
                records.map(function (record) {
                    return React.createElement(
                        "td",
                        { key: record._id },
                        typeSchema.renderView(record[type], props)
                    );
                })
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
        }).isRequired,
        score: require("react").PropTypes.number.isRequired
    })).isRequired,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired
};
var Details = function Details(_ref5, _ref6) {
    var records = _ref5.records;
    var gettext = _ref6.gettext;
    return React.createElement(
        "tr",
        null,
        React.createElement(
            "th",
            { className: "text-right" },
            gettext("Details")
        ),
        records.map(function (record) {
            var link = React.createElement(
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
};

Details.propTypes = {
    compare: require("react").PropTypes.bool.isRequired,
    records: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired,
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
        }).isRequired,
        score: require("react").PropTypes.number.isRequired
    })).isRequired,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired
};
Details.contextTypes = childContextTypes;

var Sources = function Sources(_ref7, _ref8) {
    var records = _ref7.records;
    var gettext = _ref8.gettext,
        URL = _ref8.URL,
        fullName = _ref8.fullName;
    return React.createElement(
        "tr",
        null,
        React.createElement(
            "th",
            { className: "text-right" },
            gettext("Source")
        ),
        records.map(function (record) {
            var source = record.getSource();

            return React.createElement(
                "td",
                { key: record._id },
                React.createElement(
                    "a",
                    { href: URL(source) },
                    fullName(source)
                )
            );
        })
    );
};

Sources.propTypes = {
    compare: require("react").PropTypes.bool.isRequired,
    records: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        url: require("react").PropTypes.string.isRequired,
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
        }).isRequired,
        score: require("react").PropTypes.number.isRequired
    })).isRequired,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired
};
Sources.contextTypes = childContextTypes;

var MainRecord = function MainRecord(props, _ref9) {
    var URL = _ref9.URL,
        gettext = _ref9.gettext;
    var similar = props.similar,
        compare = props.compare,
        records = props.records;

    var recordWidth = similar.length > 0 ? "col-md-9" : "col-md-12";

    return React.createElement(
        "div",
        { className: recordWidth + " imageholder" },
        (compare || records.length > 1) && React.createElement(
            "a",
            { href: URL(records[0]),
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
                        records.map(function (record) {
                            return React.createElement(Title, _extends({}, props, { record: record, key: record._id
                            }));
                        })
                    ),
                    React.createElement(
                        "tr",
                        { className: "plain" },
                        React.createElement("td", null),
                        records.map(function (record) {
                            return React.createElement(Images, _extends({}, props, { record: record, key: record._id
                            }));
                        })
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
        }).isRequired,
        score: require("react").PropTypes.number.isRequired
    })).isRequired,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired
};
MainRecord.contextTypes = childContextTypes;

var SimilarMatch = function SimilarMatch(_ref10, _ref11) {
    var _ref10$match = _ref10.match,
        recordModel = _ref10$match.recordModel,
        score = _ref10$match.score;
    var URL = _ref11.URL,
        getTitle = _ref11.getTitle,
        format = _ref11.format,
        gettext = _ref11.gettext,
        fullName = _ref11.fullName,
        shortName = _ref11.shortName;
    return React.createElement(
        "div",
        { className: "img col-md-12 col-xs-6 col-sm-4" },
        React.createElement(
            "a",
            { href: URL(recordModel) },
            React.createElement("img", { src: recordModel.getThumbURL(),
                alt: getTitle(recordModel),
                title: getTitle(recordModel),
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
                        href: URL(recordModel.getSource()),
                        title: fullName(recordModel.getSource())
                    },
                    shortName(recordModel.getSource())
                )
            )
        )
    );
};

SimilarMatch.contextTypes = childContextTypes;

var Similar = function Similar(props, _ref12) {
    var gettext = _ref12.gettext;
    var similar = props.similar;


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
                similar.map(function (match) {
                    return match.recordModel && React.createElement(SimilarMatch, _extends({}, props, { match: match, key: match._id }));
                })
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
        }).isRequired,
        score: require("react").PropTypes.number.isRequired
    })).isRequired,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired
};
Similar.contextTypes = childContextTypes;

var Script = function Script() {
    return React.createElement("script", {
        dangerouslySetInnerHTML: { __html: "\n        $(function() {\n            $(\".carousel\").carousel();\n        });\n    " }
    });
};

var Record = function Record(props, _ref13) {
    var URL = _ref13.URL;
    var records = props.records,
        similar = props.similar;

    var record = records[0];
    var title = options.types[record.type].recordTitle(record, props);
    var social = {
        imgURL: record.getOriginalURL(),
        title: title,
        url: URL(record)
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
        }).isRequired,
        score: require("react").PropTypes.number.isRequired
    })).isRequired,
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired
};
Record.contextTypes = childContextTypes;

module.exports = Record;