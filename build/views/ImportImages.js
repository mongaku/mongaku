"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react");

var Page = require("./Page.js");
var ImportResult = require("./ImportResult.js");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

var _require = require("./Wrapper.js"),
    childContextTypes = _require.childContextTypes;

var ErrorResult = function ErrorResult(_ref) {
    var result = _ref.result,
        batchError = _ref.batchError;

    if (!result.error) {
        return null;
    }

    return React.createElement(
        "li",
        null,
        result.fileName,
        ": ",
        batchError(result.error || "")
    );
};

var WarningResult = function WarningResult(_ref2) {
    var result = _ref2.result,
        batchError = _ref2.batchError;

    if (!result.warnings) {
        return null;
    }

    return React.createElement(
        "li",
        null,
        result.fileName,
        ":",
        React.createElement(
            "ul",
            null,
            result.warnings.map(function (warning) {
                return React.createElement(
                    "li",
                    { key: warning },
                    batchError(warning)
                );
            })
        )
    );
};

var ModelResult = function ModelResult(_ref3) {
    var _ref3$result = _ref3.result,
        model = _ref3$result.model,
        fileName = _ref3$result.fileName;

    if (!model) {
        return null;
    }

    return React.createElement(
        "div",
        { className: "img col-xs-6 col-sm-4 col-md-3" },
        React.createElement(
            "div",
            { className: "img-wrap" },
            React.createElement(
                "a",
                { href: model.getOriginalURL() },
                React.createElement("img", { src: model.getThumbURL(),
                    className: "img-responsive center-block"
                })
            )
        ),
        React.createElement(
            "div",
            { className: "details" },
            React.createElement(
                "div",
                { className: "wrap" },
                fileName
            )
        )
    );
};

ModelResult.propTypes = {
    result: require("react").PropTypes.shape({
        fileName: require("react").PropTypes.string.isRequired,
        error: require("react").PropTypes.string,
        model: require("react").PropTypes.shape({
            _id: require("react").PropTypes.string.isRequired,
            getOriginalURL: require("react").PropTypes.func.isRequired,
            getScaledURL: require("react").PropTypes.func.isRequired,
            getThumbURL: require("react").PropTypes.func.isRequired
        }),
        warnings: require("react").PropTypes.arrayOf(require("react").PropTypes.string)
    }).isRequired
};
var ImportImages = function ImportImages(props, _ref4) {
    var format = _ref4.format,
        gettext = _ref4.gettext,
        fixedDate = _ref4.fixedDate,
        relativeDate = _ref4.relativeDate;
    var adminURL = props.adminURL,
        batchError = props.batchError,
        batch = props.batch,
        batchState = props.batchState;

    var title = format(gettext("Image Import: %(fileName)s"), { fileName: batch.fileName });
    var state = batch.state === "error" ? format(gettext("Error: %(error)s"), { error: batchError(batch.error || "") }) : batchState(batch);
    var uploadDate = format(gettext("Uploaded: %(date)s"), { date: fixedDate(batch.created) });
    var lastUpdated = format(gettext("Last Updated: %(date)s"), { date: relativeDate(batch.modified) });

    return React.createElement(
        Page,
        { title: title },
        React.createElement(
            "p",
            null,
            React.createElement(
                "a",
                { href: adminURL, className: "btn btn-primary" },
                "\xAB ",
                gettext("Return to Admin Page")
            )
        ),
        React.createElement(
            "h1",
            null,
            title
        ),
        React.createElement(
            "p",
            null,
            uploadDate
        ),
        React.createElement(
            "p",
            null,
            React.createElement(
                "strong",
                null,
                state
            )
        ),
        batch.state !== "completed" && batch.state !== "error" && React.createElement(
            "p",
            null,
            lastUpdated
        ),
        React.createElement(ImportResult, _extends({}, props, {
            id: "errors",
            title: gettext("Errors"),
            renderResult: function renderResult(result, i) {
                return React.createElement(ErrorResult, _extends({}, props, { result: result, key: i }));
            }
        })),
        React.createElement(ImportResult, _extends({}, props, {
            id: "warnings",
            title: gettext("Warnings"),
            renderResult: function renderResult(result, i) {
                return React.createElement(WarningResult, _extends({}, props, { result: result, key: i }));
            }
        })),
        React.createElement(ImportResult, _extends({}, props, {
            id: "models",
            title: gettext("Images"),
            renderResult: function renderResult(result, i) {
                return React.createElement(ModelResult, _extends({}, props, { result: result, key: i }));
            },
            numShow: 8
        }))
    );
};

ImportImages.propTypes = {
    adminURL: require("react").PropTypes.string.isRequired,
    batch: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        error: require("react").PropTypes.string,
        fileName: require("react").PropTypes.string.isRequired,
        getFilteredResults: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        created: require("react").PropTypes.any.isRequired,
        modified: require("react").PropTypes.any.isRequired,
        state: require("react").PropTypes.string.isRequired
    }).isRequired,
    batchError: require("react").PropTypes.func.isRequired,
    batchState: require("react").PropTypes.func.isRequired,
    expanded: require("react").PropTypes.oneOf(["models", "unprocessed", "created", "changed", "deleted", "errors", "warnings"])
};
ImportImages.contextTypes = childContextTypes;

module.exports = ImportImages;