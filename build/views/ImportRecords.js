"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react");

var record = require("../lib/record");

var Page = require("./Page.js");
var ImportResult = require("./ImportResult.js");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

var _require = require("./Wrapper.js"),
    childContextTypes = _require.childContextTypes;

var getURLFromID = function getURLFromID(id, _ref, lang) {
    var type = _ref.type;
    return record(type).getURLFromID(lang, id);
};

var UnprocessedResult = function UnprocessedResult(_ref2) {
    var data = _ref2.result;
    return React.createElement(
        "pre",
        { className: "json" },
        JSON.stringify(data, null, "    ")
    );
};

UnprocessedResult.propTypes = {
    result: require("react").PropTypes.shape({
        error: require("react").PropTypes.string,
        model: require("react").PropTypes.string,
        warnings: require("react").PropTypes.arrayOf(require("react").PropTypes.string),
        diff: require("react").PropTypes.object,
        data: require("react").PropTypes.shape({
            id: require("react").PropTypes.string
        }).isRequired
    }).isRequired
};
var ErrorResult = function ErrorResult(_ref3) {
    var result = _ref3.result;

    if (!result.error) {
        return null;
    }

    var title = result.data.id ? result.data.id + ": " + result.error : result.error;

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
        diff: require("react").PropTypes.object,
        data: require("react").PropTypes.shape({
            id: require("react").PropTypes.string
        }).isRequired
    }).isRequired
};
var WarningResult = function WarningResult(_ref4) {
    var result = _ref4.result,
        batchError = _ref4.batchError;

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
            result.warnings.map(function (warning) {
                return React.createElement(
                    "li",
                    { key: warning },
                    batchError(warning)
                );
            })
        ),
        React.createElement(UnprocessedResult, { result: result })
    );
};

var ChangedResult = function ChangedResult(_ref5, _ref6) {
    var _ref5$result = _ref5.result,
        model = _ref5$result.model,
        diffText = _ref5$result.diff,
        diff = _ref5.diff,
        batch = _ref5.batch;
    var lang = _ref6.lang;

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
                { href: getURLFromID(model, batch, lang) },
                model
            )
        ),
        React.createElement("div", { className: "diff",
            dangerouslySetInnerHTML: {
                __html: diff(diffText)
            }
        })
    );
};

ChangedResult.contextTypes = childContextTypes;

var CreatedResult = function CreatedResult(_ref7, _ref8) {
    var result = _ref7.result,
        batch = _ref7.batch;
    var lang = _ref8.lang;

    if (!result.model) {
        return null;
    }

    var title = batch.state === "completed" ? React.createElement(
        "a",
        { href: getURLFromID(result.model, batch, lang) },
        result.model
    ) : result.model;

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

CreatedResult.contextTypes = childContextTypes;

var DeletedResult = function DeletedResult(_ref9, _ref10) {
    var result = _ref9.result,
        batch = _ref9.batch;
    var lang = _ref10.lang;

    if (!result.model) {
        return null;
    }

    var title = batch.state === "completed" ? React.createElement(
        "a",
        { href: getURLFromID(result.model, batch, lang) },
        result.model
    ) : result.model;

    return React.createElement(
        "div",
        null,
        title
    );
};

DeletedResult.contextTypes = childContextTypes;

var ConfirmButtons = function ConfirmButtons(_ref11, _ref12) {
    var batch = _ref11.batch;
    var URL = _ref12.URL,
        gettext = _ref12.gettext;
    return React.createElement(
        "p",
        null,
        React.createElement(
            "a",
            { href: URL(batch, { finalize: true }), className: "btn btn-success" },
            gettext("Finalize Import")
        ),
        " ",
        React.createElement(
            "a",
            { href: URL(batch, { abandon: true }), className: "btn btn-danger" },
            gettext("Abandon Import")
        )
    );
};

ConfirmButtons.propTypes = {
    adminURL: require("react").PropTypes.string.isRequired,
    batch: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        fileName: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        error: require("react").PropTypes.string,
        getFilteredResults: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        created: require("react").PropTypes.any.isRequired,
        modified: require("react").PropTypes.any.isRequired,
        state: require("react").PropTypes.string.isRequired
    }).isRequired,
    batchError: require("react").PropTypes.func.isRequired,
    batchState: require("react").PropTypes.func.isRequired,
    expanded: require("react").PropTypes.oneOf(["models", "unprocessed", "created", "changed", "deleted", "errors", "warnings"]),
    diff: require("react").PropTypes.func.isRequired
};
ConfirmButtons.contextTypes = childContextTypes;

var ImportData = function ImportData(props, _ref13) {
    var gettext = _ref13.gettext,
        format = _ref13.format,
        fixedDate = _ref13.fixedDate,
        relativeDate = _ref13.relativeDate,
        URL = _ref13.URL;
    var batch = props.batch,
        batchError = props.batchError,
        batchState = props.batchState,
        adminURL = props.adminURL;

    var state = { batch: batch };
    var title = format(gettext("Data Import: %(fileName)s"), { fileName: batch.fileName });
    var stateText = state === "error" ? format(gettext("Error: %(error)s"), { error: batchError(batch.error || "") }) : batchState(batch);
    var uploadDate = format(gettext("Uploaded: %(date)s"), { date: fixedDate(batch.created) });
    var lastUpdated = format(gettext("Last Updated: %(date)s"), { date: relativeDate(batch.modified) });

    var style = React.createElement("link", { rel: "stylesheet",
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
            id: "changed",
            title: state === "completed" ? gettext("Changed") : gettext("Will Be Changed"),
            renderResult: function renderResult(result, i) {
                return React.createElement(ChangedResult, _extends({}, props, { result: result, key: i }));
            }
        })),
        React.createElement(ImportResult, _extends({}, props, {
            id: "created",
            title: state === "completed" ? gettext("Created") : gettext("Will Be Created"),
            renderResult: function renderResult(result, i) {
                return React.createElement(CreatedResult, _extends({}, props, { result: result, key: i }));
            }
        })),
        React.createElement(ImportResult, _extends({}, props, {
            id: "deleted",
            title: state === "completed" ? gettext("Deleted") : gettext("Will Be Deleted"),
            renderResult: function renderResult(result, i) {
                return React.createElement(DeletedResult, _extends({}, props, { result: result, key: i }));
            }
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
        getFilteredResults: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        created: require("react").PropTypes.any.isRequired,
        modified: require("react").PropTypes.any.isRequired,
        state: require("react").PropTypes.string.isRequired
    }).isRequired,
    batchError: require("react").PropTypes.func.isRequired,
    batchState: require("react").PropTypes.func.isRequired,
    expanded: require("react").PropTypes.oneOf(["models", "unprocessed", "created", "changed", "deleted", "errors", "warnings"]),
    diff: require("react").PropTypes.func.isRequired
};
ImportData.contextTypes = childContextTypes;

module.exports = ImportData;