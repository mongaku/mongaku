"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const React = require("react");

const Page = require("./Page.js");
const ImportResult = require("./ImportResult.js");
const { format, relativeDate, fixedDate } = require("./utils.js");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

const { childContextTypes } = require("./Wrapper.js");

const ErrorResult = ({ result }) => {
    if (!result.error) {
        return null;
    }

    return React.createElement(
        "li",
        null,
        result.fileName,
        ": ",
        result.error
    );
};

const WarningResult = ({ result }) => {
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
            result.warnings.map(warning => React.createElement(
                "li",
                { key: warning },
                warning
            ))
        )
    );
};

const ModelResult = ({ result: { model, fileName } }) => {
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
                { href: model.getOriginalURL },
                React.createElement("img", { src: model.getThumbURL,
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
            getOriginalURL: require("react").PropTypes.string.isRequired,
            getScaledURL: require("react").PropTypes.string.isRequired,
            getThumbURL: require("react").PropTypes.string.isRequired
        }),
        warnings: require("react").PropTypes.arrayOf(require("react").PropTypes.string)
    }).isRequired
};
const ImportImages = (props, { lang, gettext }) => {
    const {
        adminURL,
        batch
    } = props;
    const title = format(gettext("Image Import: %(fileName)s"), { fileName: batch.fileName });
    const state = batch.state === "error" ? format(gettext("Error: %(error)s"), { error: batch.getError }) : batch.getStateName;
    const uploadDate = format(gettext("Uploaded: %(date)s"), { date: fixedDate(lang, batch.created) });
    const lastUpdated = format(gettext("Last Updated: %(date)s"), { date: relativeDate(lang, batch.modified) });

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
            renderResult: (result, i) => React.createElement(ErrorResult, _extends({}, props, { result: result, key: i }))
        })),
        React.createElement(ImportResult, _extends({}, props, {
            id: "warnings",
            title: gettext("Warnings"),
            renderResult: (result, i) => React.createElement(WarningResult, _extends({}, props, { result: result, key: i }))
        })),
        React.createElement(ImportResult, _extends({}, props, {
            id: "models",
            title: gettext("Images"),
            renderResult: (result, i) => React.createElement(ModelResult, _extends({}, props, { result: result, key: i })),
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
        getFilteredResults: require("react").PropTypes.any.isRequired,
        getURL: require("react").PropTypes.string.isRequired,
        created: require("react").PropTypes.any.isRequired,
        modified: require("react").PropTypes.any.isRequired,
        state: require("react").PropTypes.string.isRequired,
        getError: require("react").PropTypes.string.isRequired,
        getStateName: require("react").PropTypes.string.isRequired
    }).isRequired,
    expanded: require("react").PropTypes.oneOf(["models", "unprocessed", "created", "changed", "deleted", "errors", "warnings"])
};
ImportImages.contextTypes = childContextTypes;

module.exports = ImportImages;