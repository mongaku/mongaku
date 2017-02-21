"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const React = require("react");

const Page = require("./Page.js");
const ImportResult = require("./ImportResult.js");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

const { childContextTypes } = require("./Wrapper.js");

const UnprocessedResult = ({ result: data }) => React.createElement(
    "pre",
    { className: "json" },
    JSON.stringify(data, null, "    ")
);

UnprocessedResult.propTypes = {
    result: require("react").PropTypes.shape({
        error: require("react").PropTypes.string,
        model: require("react").PropTypes.string,
        warnings: require("react").PropTypes.arrayOf(require("react").PropTypes.string),
        diff: require("react").PropTypes.string,
        url: require("react").PropTypes.string,
        data: require("react").PropTypes.shape({
            id: require("react").PropTypes.string
        }).isRequired
    }).isRequired
};
const ErrorResult = ({ result }) => {
    if (!result.error) {
        return null;
    }

    const title = result.data.id ? `${result.data.id}: ${result.error}` : result.error;

    return React.createElement(
        "div",
        null,
        React.createElement(
            "h4",
            null,
            title
        ),
        React.createElement(UnprocessedResult, { result: result })
    );
};

ErrorResult.propTypes = {
    result: require("react").PropTypes.shape({
        error: require("react").PropTypes.string,
        model: require("react").PropTypes.string,
        warnings: require("react").PropTypes.arrayOf(require("react").PropTypes.string),
        diff: require("react").PropTypes.string,
        url: require("react").PropTypes.string,
        data: require("react").PropTypes.shape({
            id: require("react").PropTypes.string
        }).isRequired
    }).isRequired
};
const WarningResult = ({ result }) => {
    if (!result.warnings) {
        return null;
    }

    return React.createElement(
        "div",
        null,
        React.createElement(
            "h4",
            null,
            result.data.id
        ),
        React.createElement(
            "ul",
            null,
            result.warnings.map(warning => React.createElement(
                "li",
                { key: warning },
                warning
            ))
        ),
        React.createElement(UnprocessedResult, { result: result })
    );
};

const ChangedResult = ({
    result: { model, diff: diffText, url }
}) => {
    if (!diffText || !model) {
        return null;
    }

    return React.createElement(
        "div",
        null,
        React.createElement(
            "h4",
            null,
            React.createElement(
                "a",
                { href: url },
                model
            )
        ),
        React.createElement("div", { className: "diff",
            dangerouslySetInnerHTML: {
                __html: diffText
            }
        })
    );
};

const CreatedResult = ({
    result,
    batch
}) => {
    const title = result.model && batch.state === "completed" ? React.createElement(
        "a",
        { href: result.url },
        result.model
    ) : result.data.id;

    return React.createElement(
        "div",
        null,
        React.createElement(
            "h4",
            null,
            title
        ),
        React.createElement(UnprocessedResult, { result: result })
    );
};

const DeletedResult = ({
    result,
    batch
}) => {
    if (!result.model) {
        return null;
    }

    const title = batch.state === "completed" ? React.createElement(
        "a",
        { href: result.url },
        result.model
    ) : result.model;

    return React.createElement(
        "div",
        null,
        title
    );
};

const ConfirmButtons = ({ batch }, {
    gettext,
    utils: { URL }
}) => React.createElement(
    "p",
    null,
    React.createElement(
        "a",
        {
            href: URL(batch.getURL, { finalize: true }),
            className: "btn btn-success"
        },
        gettext("Finalize Import")
    ),
    " ",
    React.createElement(
        "a",
        {
            href: URL(batch.getURL, { abandon: true }),
            className: "btn btn-danger"
        },
        gettext("Abandon Import")
    )
);

ConfirmButtons.propTypes = {
    adminURL: require("react").PropTypes.string.isRequired,
    batch: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        fileName: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        error: require("react").PropTypes.string,
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
ConfirmButtons.contextTypes = childContextTypes;

const ImportData = (props, {
    gettext,
    utils: { format, fixedDate, relativeDate, URL }
}) => {
    const {
        batch,
        adminURL
    } = props;
    const { state } = batch;
    const title = format(gettext("Data Import: %(fileName)s"), { fileName: batch.fileName });
    const stateText = state === "error" ? format(gettext("Error: %(error)s"), { error: batch.getError }) : batch.getStateName;
    const uploadDate = format(gettext("Uploaded: %(date)s"), { date: fixedDate(batch.created) });
    const lastUpdated = format(gettext("Last Updated: %(date)s"), { date: relativeDate(batch.modified) });

    const style = React.createElement("link", { rel: "stylesheet",
        href: URL("/css/format-diff.css")
    });

    return React.createElement(
        Page,
        { title: title, style: style },
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
                stateText
            )
        ),
        state !== "completed" && state !== "error" && React.createElement(
            "p",
            null,
            lastUpdated
        ),
        state === "process.completed" && React.createElement(ConfirmButtons, props),
        React.createElement(ImportResult, _extends({}, props, {
            id: "unprocessed",
            title: gettext("To Be Processed"),
            renderResult: UnprocessedResult
        })),
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
            id: "changed",
            title: state === "completed" ? gettext("Changed") : gettext("Will Be Changed"),
            renderResult: (result, i) => React.createElement(ChangedResult, _extends({}, props, { result: result, key: i }))
        })),
        React.createElement(ImportResult, _extends({}, props, {
            id: "created",
            title: state === "completed" ? gettext("Created") : gettext("Will Be Created"),
            renderResult: (result, i) => React.createElement(CreatedResult, _extends({}, props, { result: result, key: i }))
        })),
        React.createElement(ImportResult, _extends({}, props, {
            id: "deleted",
            title: state === "completed" ? gettext("Deleted") : gettext("Will Be Deleted"),
            renderResult: (result, i) => React.createElement(DeletedResult, _extends({}, props, { result: result, key: i }))
        }))
    );
};

ImportData.propTypes = {
    adminURL: require("react").PropTypes.string.isRequired,
    batch: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        fileName: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        error: require("react").PropTypes.string,
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
ImportData.contextTypes = childContextTypes;

module.exports = ImportData;