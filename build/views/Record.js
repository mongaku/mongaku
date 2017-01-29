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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92aWV3cy9SZWNvcmQuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwibWV0YWRhdGEiLCJvcHRpb25zIiwiUGFnZSIsImNoaWxkQ29udGV4dFR5cGVzIiwiaGFzVmFsdWUiLCJyZWNvcmRzIiwidHlwZSIsInNvbWUiLCJyZWNvcmQiLCJ2YWx1ZSIsIkFycmF5IiwiaXNBcnJheSIsImxlbmd0aCIsIlRpdGxlIiwicHJvcHMiLCJzaXplIiwiTWF0aCIsIm1heCIsInJvdW5kIiwidGl0bGUiLCJ0eXBlcyIsInJlY29yZFRpdGxlIiwiSW1hZ2UiLCJpbWFnZSIsImFjdGl2ZSIsImdldFRpdGxlIiwiZ2V0T3JpZ2luYWxVUkwiLCJnZXRTY2FsZWRVUkwiLCJjb250ZXh0VHlwZXMiLCJDYXJvdXNlbCIsImdldHRleHQiLCJjYXJvdXNlbElkIiwiX2lkIiwicmVwbGFjZSIsImltYWdlcyIsIm1hcCIsImkiLCJJbWFnZXMiLCJNZXRhZGF0YSIsInNvdXJjZXMiLCJmaXJzdFJlY29yZCIsIm1vZGVsIiwiZGlzcGxheSIsInR5cGVTY2hlbWEiLCJyZW5kZXJWaWV3IiwiRGV0YWlscyIsImxpbmsiLCJ1cmwiLCJTb3VyY2VzIiwiVVJMIiwiZnVsbE5hbWUiLCJzb3VyY2UiLCJnZXRTb3VyY2UiLCJNYWluUmVjb3JkIiwic2ltaWxhciIsImNvbXBhcmUiLCJyZWNvcmRXaWR0aCIsIlNpbWlsYXJNYXRjaCIsIm1hdGNoIiwicmVjb3JkTW9kZWwiLCJzY29yZSIsImZvcm1hdCIsInNob3J0TmFtZSIsImdldFRodW1iVVJMIiwiU2ltaWxhciIsIm1hcmdpbkJvdHRvbSIsIlNjcmlwdCIsIl9faHRtbCIsIlJlY29yZCIsInNvY2lhbCIsImltZ1VSTCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFFQSxJQUFNQSxRQUFRQyxRQUFRLE9BQVIsQ0FBZDs7QUFFQSxJQUFNQyxXQUFXRCxRQUFRLGlCQUFSLENBQWpCO0FBQ0EsSUFB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bGUiOiJSZWNvcmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxuY29uc3QgbWV0YWRhdGEgPSByZXF1aXJlKFwiLi4vbGliL21ldGFkYXRhXCIpO1xuY29uc3Qgb3B0aW9ucyA9IHJlcXVpcmUoXCIuLi9saWIvb3B0aW9uc1wiKTtcblxuY29uc3QgUGFnZSA9IHJlcXVpcmUoXCIuL1BhZ2UuanNcIik7XG5cbmltcG9ydCB0eXBlIHtDb250ZXh0fSBmcm9tIFwiLi90eXBlcy5qc1wiO1xuY29uc3Qge2NoaWxkQ29udGV4dFR5cGVzfSA9IHJlcXVpcmUoXCIuL1dyYXBwZXIuanNcIik7XG5cbnR5cGUgSW1hZ2VUeXBlID0ge1xuICAgIF9pZDogc3RyaW5nLFxuICAgIGdldE9yaWdpbmFsVVJMOiAoKSA9PiBzdHJpbmcsXG4gICAgZ2V0U2NhbGVkVVJMOiAoKSA9PiBzdHJpbmcsXG4gICAgZ2V0VGh1bWJVUkw6ICgpID0+IHN0cmluZyxcbn07XG5cbnR5cGUgUmVjb3JkVHlwZSA9IHtcbiAgICBfaWQ6IHN0cmluZyxcbiAgICB0eXBlOiBzdHJpbmcsXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgaW1hZ2VzOiBBcnJheTxJbWFnZVR5cGU+LFxuICAgIGdldE9yaWdpbmFsVVJMOiAoKSA9PiBzdHJpbmcsXG4gICAgZ2V0VGh1bWJVUkw6ICgpID0+IHN0cmluZyxcbiAgICBnZXRUaXRsZTogKCkgPT4gc3RyaW5nLFxuICAgIGdldFNvdXJjZTogKCkgPT4gU291cmNlLFxuICAgIGdldFVSTDogKGxhbmc6IHN0cmluZykgPT4gc3RyaW5nLFxufTtcblxudHlwZSBTb3VyY2UgPSB7XG4gICAgX2lkOiBzdHJpbmcsXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGdldFVSTDogKGxhbmc6IHN0cmluZykgPT4gc3RyaW5nLFxufTtcblxudHlwZSBNYXRjaCA9IHtcbiAgICBfaWQ6IHN0cmluZyxcbiAgICByZWNvcmRNb2RlbDogUmVjb3JkVHlwZSxcbiAgICBzY29yZTogbnVtYmVyLFxufTtcblxudHlwZSBQcm9wcyA9IHtcbiAgICBjb21wYXJlOiBib29sZWFuLFxuICAgIHJlY29yZHM6IEFycmF5PFJlY29yZFR5cGU+LFxuICAgIHNpbWlsYXI6IEFycmF5PE1hdGNoPixcbiAgICBzb3VyY2VzOiBBcnJheTxTb3VyY2U+LFxufTtcblxuLy8gRGV0ZXJtaW5lIGlmIGF0IGxlYXN0IG9uZSByZWNvcmQgaGFzIGEgdmFsdWUgZm9yIHRoaXMgdHlwZVxuY29uc3QgaGFzVmFsdWUgPSAocmVjb3JkcywgdHlwZSkgPT4ge1xuICAgIHJldHVybiByZWNvcmRzLnNvbWUoKHJlY29yZCkgPT4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHJlY29yZFt0eXBlXTtcbiAgICAgICAgcmV0dXJuIHZhbHVlICYmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHwgdmFsdWUubGVuZ3RoID4gMCk7XG4gICAgfSk7XG59O1xuXG5jb25zdCBUaXRsZSA9IChwcm9wczogUHJvcHMgJiB7cmVjb3JkOiBSZWNvcmRUeXBlfSkgPT4ge1xuICAgIGNvbnN0IHtyZWNvcmQsIHJlY29yZHN9ID0gcHJvcHM7XG4gICAgY29uc3Qgc2l6ZSA9IE1hdGgubWF4KE1hdGgucm91bmQoMTIgLyByZWNvcmRzLmxlbmd0aCksIDMpO1xuICAgIGNvbnN0IHRpdGxlID0gb3B0aW9ucy50eXBlc1tyZWNvcmQudHlwZV1cbiAgICAgICAgLnJlY29yZFRpdGxlKHJlY29yZCwgcHJvcHMpO1xuXG4gICAgcmV0dXJuIDx0aCBjbGFzc05hbWU9e2Bjb2wteHMtJHtzaXplfSB0ZXh0LWNlbnRlcmB9PlxuICAgICAgICA8aDEgY2xhc3NOYW1lPVwicGFuZWwtdGl0bGVcIj57dGl0bGV9PC9oMT5cbiAgICA8L3RoPjtcbn07XG5cbmNvbnN0IEltYWdlID0gKHtcbiAgICBpbWFnZSxcbiAgICByZWNvcmQsXG4gICAgYWN0aXZlLFxufTogUHJvcHMgJiB7XG4gICAgcmVjb3JkOiBSZWNvcmRUeXBlLFxuICAgIGltYWdlOiBJbWFnZVR5cGUsXG4gICAgYWN0aXZlOiBib29sZWFuLFxufSwge2dldFRpdGxlfTogQ29udGV4dCkgPT4gPGRpdiBjbGFzc05hbWU9e2BpdGVtICR7YWN0aXZlID8gXCJhY3RpdmVcIiA6IFwiXCJ9YH0+XG4gICAgPGEgaHJlZj17aW1hZ2UuZ2V0T3JpZ2luYWxVUkwoKX0+XG4gICAgICAgIDxpbWcgc3JjPXtpbWFnZS5nZXRTY2FsZWRVUkwoKX1cbiAgICAgICAgICAgIGFsdD17Z2V0VGl0bGUocmVjb3JkKX1cbiAgICAgICAgICAgIHRpdGxlPXtnZXRUaXRsZShyZWNvcmQpfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiaW1nLXJlc3BvbnNpdmUgY2VudGVyLWJsb2NrXCJcbiAgICAgICAgLz5cbiAgICA8L2E+XG48L2Rpdj47XG5cbkltYWdlLmNvbnRleHRUeXBlcyA9IGNoaWxkQ29udGV4dFR5cGVzO1xuXG5jb25zdCBDYXJvdXNlbCA9ICh7cmVjb3JkfTogUHJvcHMgJiB7cmVjb3JkOiBSZWNvcmRUeXBlfSwge1xuICAgIGdldHRleHQsXG59OiBDb250ZXh0KSA9PiB7XG4gICAgY29uc3QgY2Fyb3VzZWxJZCA9IHJlY29yZC5faWQucmVwbGFjZShcIi9cIiwgXCItXCIpO1xuICAgIHJldHVybiA8ZGl2PlxuICAgICAgICA8b2wgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtaW5kaWNhdG9yc1wiPlxuICAgICAgICAgICAge3JlY29yZC5pbWFnZXMubWFwKChpbWFnZSwgaSkgPT5cbiAgICAgICAgICAgICAgICA8bGlcbiAgICAgICAgICAgICAgICAgICAgZGF0YS10YXJnZXQ9e2AjJHtjYXJvdXNlbElkfWB9XG4gICAgICAgICAgICAgICAgICAgIGRhdGEtc2xpZGUtdG89e2l9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17aSA9PT0gMCA/IFwiYWN0aXZlXCIgOiBcIlwifVxuICAgICAgICAgICAgICAgICAgICBrZXk9e2BpbWcke2l9YH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgPC9vbD5cbiAgICAgICAgPGEgY2xhc3NOYW1lPVwibGVmdCBjYXJvdXNlbC1jb250cm9sXCJcbiAgICAgICAgICAgIGhyZWY9e2AjJHtjYXJvdXNlbElkfWB9IHJvbGU9XCJidXR0b25cIlxuICAgICAgICAgICAgZGF0YS1zbGlkZT1cInByZXZcIlxuICAgICAgICA+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLWNoZXZyb24tbGVmdFwiXG4gICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzci1vbmx5XCI+XG4gICAgICAgICAgICAgICAge2dldHRleHQoXCJQcmV2aW91c1wiKX1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9hPlxuICAgICAgICA8YSBjbGFzc05hbWU9XCJyaWdodCBjYXJvdXNlbC1jb250cm9sXCJcbiAgICAgICAgICAgIGhyZWY9e2AjJHtjYXJvdXNlbElkfWB9IHJvbGU9XCJidXR0b25cIlxuICAgICAgICAgICAgZGF0YS1zbGlkZT1cIm5leHRcIlxuICAgICAgICA+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLWNoZXZyb24tcmlnaHRcIlxuICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3Itb25seVwiPlxuICAgICAgICAgICAgICAgIHtnZXR0ZXh0KFwiTmV4dFwiKX1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9hPlxuICAgIDwvZGl2Pjtcbn07XG5cbkNhcm91c2VsLmNvbnRleHRUeXBlcyA9IGNoaWxkQ29udGV4dFR5cGVzO1xuXG5jb25zdCBJbWFnZXMgPSAocHJvcHM6IFByb3BzICYge3JlY29yZDogUmVjb3JkVHlwZX0pID0+IHtcbiAgICBjb25zdCB7cmVjb3JkfSA9IHByb3BzO1xuICAgIGNvbnN0IGNhcm91c2VsSWQgPSByZWNvcmQuX2lkLnJlcGxhY2UoXCIvXCIsIFwiLVwiKTtcblxuICAgIHJldHVybiA8dGQ+XG4gICAgICAgIDxkaXYgaWQ9e2Nhcm91c2VsSWR9IGNsYXNzTmFtZT1cImNhcm91c2VsXCIgZGF0YS1pbnRlcnZhbD1cIjBcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2Fyb3VzZWwtaW5uZXJcIiByb2xlPVwibGlzdGJveFwiPlxuICAgICAgICAgICAgICAgIHtyZWNvcmQuaW1hZ2VzLm1hcCgoaW1hZ2UsIGkpID0+IDxJbWFnZVxuICAgICAgICAgICAgICAgICAgICB7Li4ucHJvcHN9XG4gICAgICAgICAgICAgICAgICAgIHJlY29yZD17cmVjb3JkfVxuICAgICAgICAgICAgICAgICAgICBpbWFnZT17aW1hZ2V9XG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZT17aSA9PT0gMH1cbiAgICAgICAgICAgICAgICAgICAga2V5PXtpbWFnZS5faWR9XG4gICAgICAgICAgICAgICAgLz4pfVxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHtyZWNvcmQuaW1hZ2VzLmxlbmd0aCA+IDEgJiZcbiAgICAgICAgICAgICAgICA8Q2Fyb3VzZWwgey4uLnByb3BzfSByZWNvcmQ9e3JlY29yZH0gLz59XG4gICAgICAgIDwvZGl2PlxuICAgIDwvdGQ+O1xufTtcblxuY29uc3QgTWV0YWRhdGEgPSAocHJvcHM6IFByb3BzKSA9PiB7XG4gICAgY29uc3Qge3JlY29yZHMsIHNvdXJjZXN9ID0gcHJvcHM7XG4gICAgY29uc3QgZmlyc3RSZWNvcmQgPSByZWNvcmRzWzBdO1xuXG4gICAgaWYgKCFmaXJzdFJlY29yZCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBXZSBhc3N1bWUgdGhhdCBhbGwgdGhlIHJlY29yZHMgYXJlIHRoZSBzYW1lIHR5cGVcbiAgICBjb25zdCB0eXBlID0gcmVjb3Jkc1swXS50eXBlO1xuICAgIGNvbnN0IG1vZGVsID0gbWV0YWRhdGEubW9kZWwodHlwZSk7XG5cbiAgICByZXR1cm4gPHRib2R5PlxuICAgICAgICB7b3B0aW9ucy50eXBlc1t0eXBlXS5kaXNwbGF5Lm1hcCgodHlwZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdHlwZVNjaGVtYSA9IG1vZGVsW3R5cGVdO1xuXG4gICAgICAgICAgICAvLyBIaWRlIGlmIGl0IHRoZXJlIGlzbid0IGF0IGxlYXN0IG9uZSB2YWx1ZSB0byBkaXNwbGF5XG4gICAgICAgICAgICBpZiAoIWhhc1ZhbHVlKHJlY29yZHMsIHR5cGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiA8dHIga2V5PXt0eXBlfT5cbiAgICAgICAgICAgICAgICA8dGggY2xhc3NOYW1lPVwidGV4dC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgICB7dHlwZVNjaGVtYS5vcHRpb25zLnRpdGxlKHByb3BzKX1cbiAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgIHtyZWNvcmRzLm1hcCgocmVjb3JkKSA9PiA8dGQga2V5PXtyZWNvcmQuX2lkfT5cbiAgICAgICAgICAgICAgICAgICAge3R5cGVTY2hlbWEucmVuZGVyVmlldyhyZWNvcmRbdHlwZV0sIHByb3BzKX1cbiAgICAgICAgICAgICAgICA8L3RkPil9XG4gICAgICAgICAgICA8L3RyPjtcbiAgICAgICAgfSl9XG4gICAgICAgIHtoYXNWYWx1ZShyZWNvcmRzLCBcInVybFwiKSAmJiA8RGV0YWlscyB7Li4ucHJvcHN9IC8+fVxuICAgICAgICB7c291cmNlcy5sZW5ndGggPiAxICYmXG4gICAgICAgICAgICA8U291cmNlcyB7Li4ucHJvcHN9IC8+fVxuICAgIDwvdGJvZHk+O1xufTtcblxuY29uc3QgRGV0YWlscyA9ICh7cmVjb3Jkc306IFByb3BzLCB7Z2V0dGV4dH06IENvbnRleHQpID0+IDx0cj5cbiAgICA8dGggY2xhc3NOYW1lPVwidGV4dC1yaWdodFwiPlxuICAgICAgICB7Z2V0dGV4dChcIkRldGFpbHNcIil9XG4gICAgPC90aD5cbiAgICB7cmVjb3Jkcy5tYXAoKHJlY29yZCkgPT4ge1xuICAgICAgICBjb25zdCBsaW5rID0gPGEgaHJlZj17cmVjb3JkLnVybH0+XG4gICAgICAgICAgICB7Z2V0dGV4dChcIk1vcmUgaW5mb3JtYXRpb24uLi5cIil9XG4gICAgICAgIDwvYT47XG5cbiAgICAgICAgcmV0dXJuIDx0ZCBrZXk9e3JlY29yZC5faWR9PntsaW5rfTwvdGQ+O1xuICAgIH0pfVxuPC90cj47XG5cbkRldGFpbHMuY29udGV4dFR5cGVzID0gY2hpbGRDb250ZXh0VHlwZXM7XG5cbmNvbnN0IFNvdXJjZXMgPSAoe3JlY29yZHN9OiBQcm9wcywge1xuICAgIGdldHRleHQsXG4gICAgVVJMLFxuICAgIGZ1bGxOYW1lLFxufTogQ29udGV4dCkgPT4gPHRyPlxuICAgIDx0aCBjbGFzc05hbWU9XCJ0ZXh0LXJpZ2h0XCI+XG4gICAgICAgIHtnZXR0ZXh0KFwiU291cmNlXCIpfVxuICAgIDwvdGg+XG4gICAge3JlY29yZHMubWFwKChyZWNvcmQpID0+IHtcbiAgICAgICAgY29uc3Qgc291cmNlID0gcmVjb3JkLmdldFNvdXJjZSgpO1xuXG4gICAgICAgIHJldHVybiA8dGQga2V5PXtyZWNvcmQuX2lkfT5cbiAgICAgICAgICAgIDxhIGhyZWY9e1VSTChzb3VyY2UpfT5cbiAgICAgICAgICAgICAgICB7ZnVsbE5hbWUoc291cmNlKX1cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgPC90ZD47XG4gICAgfSl9XG48L3RyPjtcblxuU291cmNlcy5jb250ZXh0VHlwZXMgPSBjaGlsZENvbnRleHRUeXBlcztcblxuY29uc3QgTWFpblJlY29yZCA9IChwcm9wczogUHJvcHMsIHtcbiAgICBVUkwsXG4gICAgZ2V0dGV4dCxcbn06IENvbnRleHQpID0+IHtcbiAgICBjb25zdCB7c2ltaWxhciwgY29tcGFyZSwgcmVjb3Jkc30gPSBwcm9wcztcbiAgICBjb25zdCByZWNvcmRXaWR0aCA9IHNpbWlsYXIubGVuZ3RoID4gMCA/XG4gICAgICAgIFwiY29sLW1kLTlcIiA6IFwiY29sLW1kLTEyXCI7XG5cbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9e2Ake3JlY29yZFdpZHRofSBpbWFnZWhvbGRlcmB9PlxuICAgICAgICB7KGNvbXBhcmUgfHwgcmVjb3Jkcy5sZW5ndGggPiAxKSAmJlxuICAgICAgICAgICAgPGEgaHJlZj17VVJMKHJlY29yZHNbMF0pfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tc3VjY2Vzc1wiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgJmxhcXVvOyB7Z2V0dGV4dChcIkVuZCBDb21wYXJpc29uXCIpfVxuICAgICAgICAgICAgPC9hPn1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZXNwb25zaXZlLXRhYmxlXCI+XG4gICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwidGFibGUgdGFibGUtaG92ZXJcIj5cbiAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0ciBjbGFzc05hbWU9XCJwbGFpblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtyZWNvcmRzLm1hcCgocmVjb3JkKSA9PiA8VGl0bGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Li4ucHJvcHN9IHJlY29yZD17cmVjb3JkfSBrZXk9e3JlY29yZC5faWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAvPil9XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDx0ciBjbGFzc05hbWU9XCJwbGFpblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtyZWNvcmRzLm1hcCgocmVjb3JkKSA9PiA8SW1hZ2VzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgey4uLnByb3BzfSByZWNvcmQ9e3JlY29yZH0ga2V5PXtyZWNvcmQuX2lkfVxuICAgICAgICAgICAgICAgICAgICAgICAgLz4pfVxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgPE1ldGFkYXRhIHsuLi5wcm9wc30gLz5cbiAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2Pjtcbn07XG5cbk1haW5SZWNvcmQuY29udGV4dFR5cGVzID0gY2hpbGRDb250ZXh0VHlwZXM7XG5cbmNvbnN0IFNpbWlsYXJNYXRjaCA9ICh7XG4gICAgbWF0Y2g6IHtyZWNvcmRNb2RlbCwgc2NvcmV9LFxufTogUHJvcHMgJiB7bWF0Y2g6IE1hdGNofSwge1xuICAgIFVSTCxcbiAgICBnZXRUaXRsZSxcbiAgICBmb3JtYXQsXG4gICAgZ2V0dGV4dCxcbiAgICBmdWxsTmFtZSxcbiAgICBzaG9ydE5hbWUsXG59OiBDb250ZXh0KSA9PiA8ZGl2IGNsYXNzTmFtZT1cImltZyBjb2wtbWQtMTIgY29sLXhzLTYgY29sLXNtLTRcIj5cbiAgICA8YSBocmVmPXtVUkwocmVjb3JkTW9kZWwpfT5cbiAgICAgICAgPGltZyBzcmM9e3JlY29yZE1vZGVsLmdldFRodW1iVVJMKCl9XG4gICAgICAgICAgICBhbHQ9e2dldFRpdGxlKHJlY29yZE1vZGVsKX1cbiAgICAgICAgICAgIHRpdGxlPXtnZXRUaXRsZShyZWNvcmRNb2RlbCl9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJpbWctcmVzcG9uc2l2ZSBjZW50ZXItYmxvY2tcIlxuICAgICAgICAvPlxuICAgIDwvYT5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImRldGFpbHNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3cmFwXCI+XG4gICAgICAgICAgICA8c3Bhbj57Zm9ybWF0KGdldHRleHQoXG4gICAgICAgICAgICAgICAgXCJTY29yZTogJShzY29yZSlzXCIpLCB7c2NvcmU6IHNjb3JlfSl9PC9zcGFuPlxuXG4gICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJwdWxsLXJpZ2h0XCJcbiAgICAgICAgICAgICAgICBocmVmPXtVUkwocmVjb3JkTW9kZWwuZ2V0U291cmNlKCkpfVxuICAgICAgICAgICAgICAgIHRpdGxlPXtmdWxsTmFtZShyZWNvcmRNb2RlbC5nZXRTb3VyY2UoKSl9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3Nob3J0TmFtZShyZWNvcmRNb2RlbC5nZXRTb3VyY2UoKSl9XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+O1xuXG5TaW1pbGFyTWF0Y2guY29udGV4dFR5cGVzID0gY2hpbGRDb250ZXh0VHlwZXM7XG5cbmNvbnN0IFNpbWlsYXIgPSAocHJvcHM6IFByb3BzLCB7Z2V0dGV4dH06IENvbnRleHQpID0+IHtcbiAgICBjb25zdCB7c2ltaWxhcn0gPSBwcm9wcztcblxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC0zXCI+XG4gICAgICAgIDxhIGhyZWY9XCI/Y29tcGFyZVwiIGNsYXNzTmFtZT1cImJ0biBidG4tc3VjY2VzcyBidG4tYmxvY2tcIlxuICAgICAgICAgICAgc3R5bGU9e3ttYXJnaW5Cb3R0b206IDIwfX1cbiAgICAgICAgPlxuICAgICAgICAgICAge2dldHRleHQoXCJDb21wYXJlIEltYWdlc1wiKX0gJnJhcXVvO1xuICAgICAgICA8L2E+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWhlYWRpbmdcIj5cbiAgICAgICAgICAgICAgICB7Z2V0dGV4dChcIlNpbWlsYXIgSW1hZ2VzXCIpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWJvZHkgcm93XCI+XG4gICAgICAgICAgICAgICAge3NpbWlsYXIubWFwKChtYXRjaCkgPT4gbWF0Y2gucmVjb3JkTW9kZWwgJiZcbiAgICAgICAgICAgICAgICAgICAgPFNpbWlsYXJNYXRjaCB7Li4ucHJvcHN9IG1hdGNoPXttYXRjaH0ga2V5PXttYXRjaC5faWR9IC8+KX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj47XG59O1xuXG5TaW1pbGFyLmNvbnRleHRUeXBlcyA9IGNoaWxkQ29udGV4dFR5cGVzO1xuXG5jb25zdCBTY3JpcHQgPSAoKSA9PiA8c2NyaXB0XG4gICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3tfX2h0bWw6IGBcbiAgICAgICAgJChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoXCIuY2Fyb3VzZWxcIikuY2Fyb3VzZWwoKTtcbiAgICAgICAgfSk7XG4gICAgYH19XG4vPjtcblxuY29uc3QgUmVjb3JkID0gKHByb3BzOiBQcm9wcywge1VSTH06IENvbnRleHQpID0+IHtcbiAgICBjb25zdCB7cmVjb3Jkcywgc2ltaWxhcn0gPSBwcm9wcztcbiAgICBjb25zdCByZWNvcmQgPSByZWNvcmRzWzBdO1xuICAgIGNvbnN0IHRpdGxlID0gb3B0aW9ucy50eXBlc1tyZWNvcmQudHlwZV1cbiAgICAgICAgLnJlY29yZFRpdGxlKHJlY29yZCwgcHJvcHMpO1xuICAgIGNvbnN0IHNvY2lhbCA9IHtcbiAgICAgICAgaW1nVVJMOiByZWNvcmQuZ2V0T3JpZ2luYWxVUkwoKSxcbiAgICAgICAgdGl0bGUsXG4gICAgICAgIHVybDogVVJMKHJlY29yZCksXG4gICAgfTtcblxuICAgIHJldHVybiA8UGFnZVxuICAgICAgICB0aXRsZT17dGl0bGV9XG4gICAgICAgIHNjcmlwdHM9ezxTY3JpcHQvPn1cbiAgICAgICAgc29jaWFsPXtzb2NpYWx9XG4gICAgPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgPE1haW5SZWNvcmQgey4uLnByb3BzfSAvPlxuICAgICAgICAgICAge3NpbWlsYXIubGVuZ3RoID4gMCAmJiA8U2ltaWxhciB7Li4ucHJvcHN9IC8+fVxuICAgICAgICA8L2Rpdj5cbiAgICA8L1BhZ2U+O1xufTtcblxuUmVjb3JkLmNvbnRleHRUeXBlcyA9IGNoaWxkQ29udGV4dFR5cGVzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlY29yZDtcbiJdfQ==