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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92aWV3cy9JbXBvcnRSZWNvcmRzLmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwicmVxdWlyZSIsInJlY29yZCIsIlBhZ2UiLCJJbXBvcnRSZXN1bHQiLCJjaGlsZENvbnRleHRUeXBlcyIsImdldFVSTEZyb21JRCIsImlkIiwibGFuZyIsInR5cGUiLCJVbnByb2Nlc3NlZFJlc3VsdCIsImRhdGEiLCJyZXN1bHQiLCJKU09OIiwic3RyaW5naWZ5IiwiRXJyb3JSZXN1bHQiLCJlcnJvciIsInRpdGxlIiwiV2FybmluZ1Jlc3VsdCIsImJhdGNoRXJyb3IiLCJ3YXJuaW5ncyIsIm1hcCIsIndhcm5pbmciLCJDaGFuZ2VkUmVzdWx0IiwibW9kZWwiLCJkaWZmVGV4dCIsImRpZmYiLCJiYXRjaCIsIl9faHRtbCIsImNvbnRleHRUeXBlcyIsIkNyZWF0ZWRSZXN1bHQiLCJzdGF0ZSIsIkRlbGV0ZWRSZXN1bHQiLCJDb25maXJtQnV0dG9ucyIsIlVSTCIsImdldHRleHQiLCJmaW5hbGl6ZSIsImFiYW5kb24iLCJJbXBvcnREYXRhIiwicHJvcHMiLCJmb3JtYXQiLCJmaXhlZERhdGUiLCJyZWxhdGl2ZURhdGUiLCJiYXRjaFN0YXRlIiwiYWRtaW5VUkwiLCJmaWxlTmFtZSIsInN0YXRlVGV4dCIsInVwbG9hZERhdGUiLCJkYXRlIiwiY3JlYXRlZCIsImxhc3RVcGRhdGVkIiwibW9kaWZpZWQiLCJzdHlsZSIsImkiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBRUEsSUFBTUEsUUFBUUMsUUFBUSxPQUFSLENBQWQ7O0FBRUEsSUFBTUMsU0FBU0QsUUFBUSxlQUFSLENBQWY7O0FBRUEsSUFBTUUsT0FBT0YsUUFBUSxXQUFSLENBQWI7QUFDQSxJQUFNRyxlQUFlSCxRQUFRLG1CQUFSLENBQXJCOzs7O2VBRzRCQSxRQUFRLGNBQVIsQztJQUFyQkksaUIsWUFBQUEsaUI7O0FBNENQLElBQU1DLGVBQWUsU0FBZkEsWUFBZSxDQUFDQyxFQUFE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UUFBUTNCLE1BQWxDLEVBQTBDLEtBQUt5QyxDQUEvQyxJQURVO0FBQUE7QUFObEI7QUF0REcsS0FBUDtBQWdFSCxDQTdGRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUErRkFmLFdBQVdULFlBQVgsR0FBMEJ4QixpQkFBMUI7O0FBRUFpRCxPQUFPQyxPQUFQLEdBQWlCakIsVUFBakIiLCJmaWxlIjoiSW1wb3J0UmVjb3Jkcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmNvbnN0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG5jb25zdCByZWNvcmQgPSByZXF1aXJlKFwiLi4vbGliL3JlY29yZFwiKTtcblxuY29uc3QgUGFnZSA9IHJlcXVpcmUoXCIuL1BhZ2UuanNcIik7XG5jb25zdCBJbXBvcnRSZXN1bHQgPSByZXF1aXJlKFwiLi9JbXBvcnRSZXN1bHQuanNcIik7XG5cbmltcG9ydCB0eXBlIHtDb250ZXh0fSBmcm9tIFwiLi90eXBlcy5qc1wiO1xuY29uc3Qge2NoaWxkQ29udGV4dFR5cGVzfSA9IHJlcXVpcmUoXCIuL1dyYXBwZXIuanNcIik7XG5cbnR5cGUgSW1wb3J0ID0ge1xuICAgIF9pZDogc3RyaW5nLFxuICAgIGZpbGVOYW1lOiBzdHJpbmcsXG4gICAgdHlwZTogc3RyaW5nLFxuICAgIGVycm9yPzogc3RyaW5nLFxuICAgIGdldEZpbHRlcmVkUmVzdWx0czogKCkgPT4gSW1wb3J0UmVzdWx0cyxcbiAgICBnZXRVUkw6IChsYW5nOiBzdHJpbmcpID0+IHN0cmluZyxcbiAgICBjcmVhdGVkOiBEYXRlLFxuICAgIG1vZGlmaWVkOiBEYXRlLFxuICAgIHN0YXRlOiBzdHJpbmcsXG59O1xuXG50eXBlIEltcG9ydFJlc3VsdHMgPSB7XG4gICAgbW9kZWxzOiBBcnJheTxSZXN1bHQ+LFxuICAgIHVucHJvY2Vzc2VkOiBBcnJheTxSZXN1bHQ+LFxuICAgIGNyZWF0ZWQ6IEFycmF5PFJlc3VsdD4sXG4gICAgY2hhbmdlZDogQXJyYXk8UmVzdWx0PixcbiAgICBkZWxldGVkOiBBcnJheTxSZXN1bHQ+LFxuICAgIGVycm9yczogQXJyYXk8UmVzdWx0PixcbiAgICB3YXJuaW5nczogQXJyYXk8UmVzdWx0Pixcbn07XG5cbnR5cGUgUmVzdWx0ID0ge1xuICAgIGVycm9yPzogc3RyaW5nLFxuICAgIG1vZGVsPzogc3RyaW5nLFxuICAgIHdhcm5pbmdzPzogQXJyYXk8c3RyaW5nPixcbiAgICBkaWZmPzogT2JqZWN0LFxuICAgIGRhdGE6IHtcbiAgICAgICAgaWQ/OiBzdHJpbmcsXG4gICAgfSxcbn07XG5cbnR5cGUgUHJvcHMgPSB7XG4gICAgYWRtaW5VUkw6IHN0cmluZyxcbiAgICBiYXRjaDogSW1wb3J0LFxuICAgIGJhdGNoRXJyb3I6IChlcnJvcjogc3RyaW5nKSA9PiBzdHJpbmcsXG4gICAgYmF0Y2hTdGF0ZTogKGJhdGNoOiBJbXBvcnQpID0+IHN0cmluZyxcbiAgICBleHBhbmRlZD86IFwibW9kZWxzXCIgfCBcInVucHJvY2Vzc2VkXCIgfCBcImNyZWF0ZWRcIiB8IFwiY2hhbmdlZFwiIHwgXCJkZWxldGVkXCIgfFxuICAgICAgICBcImVycm9yc1wiIHwgXCJ3YXJuaW5nc1wiLFxuICAgIGRpZmY6IChkZWx0YTogT2JqZWN0KSA9PiBzdHJpbmcsXG59O1xuXG5jb25zdCBnZXRVUkxGcm9tSUQgPSAoaWQ6IHN0cmluZywge3R5cGV9OiBJbXBvcnQsIGxhbmc6IHN0cmluZykgPT5cbiAgICByZWNvcmQodHlwZSkuZ2V0VVJMRnJvbUlEKGxhbmcsIGlkKTtcblxuY29uc3QgVW5wcm9jZXNzZWRSZXN1bHQgPSAoe3Jlc3VsdDogZGF0YX06IHtyZXN1bHQ6IFJlc3VsdH0pID0+XG4gICAgPHByZSBjbGFzc05hbWU9XCJqc29uXCI+XG4gICAgICAgIHtKU09OLnN0cmluZ2lmeShkYXRhLCBudWxsLCBcIiAgICBcIil9XG4gICAgPC9wcmU+O1xuXG5jb25zdCBFcnJvclJlc3VsdCA9ICh7cmVzdWx0fToge3Jlc3VsdDogUmVzdWx0fSkgPT4ge1xuICAgIGlmICghcmVzdWx0LmVycm9yKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHRpdGxlID0gcmVzdWx0LmRhdGEuaWQgP1xuICAgICAgICBgJHtyZXN1bHQuZGF0YS5pZH06ICR7cmVzdWx0LmVycm9yfWAgOlxuICAgICAgICByZXN1bHQuZXJyb3I7XG5cbiAgICByZXR1cm4gPGRpdj5cbiAgICAgICAgPGg0Pnt0aXRsZX08L2g0PlxuICAgICAgICA8VW5wcm9jZXNzZWRSZXN1bHQgcmVzdWx0PXtyZXN1bHR9IC8+XG4gICAgPC9kaXY+O1xufTtcblxuY29uc3QgV2FybmluZ1Jlc3VsdCA9ICh7XG4gICAgcmVzdWx0LFxuICAgIGJhdGNoRXJyb3IsXG59OiBQcm9wcyAmIHtyZXN1bHQ6IFJlc3VsdH0pID0+IHtcbiAgICBpZiAoIXJlc3VsdC53YXJuaW5ncykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gPGRpdj5cbiAgICAgICAgPGg0PntyZXN1bHQuZGF0YS5pZH08L2g0PlxuICAgICAgICA8dWw+XG4gICAgICAgICAgICB7cmVzdWx0Lndhcm5pbmdzLm1hcCgod2FybmluZykgPT5cbiAgICAgICAgICAgICAgICA8bGkga2V5PXt3YXJuaW5nfT57YmF0Y2hFcnJvcih3YXJuaW5nKX08L2xpPil9XG4gICAgICAgIDwvdWw+XG4gICAgICAgIDxVbnByb2Nlc3NlZFJlc3VsdCByZXN1bHQ9e3Jlc3VsdH0gLz5cbiAgICA8L2Rpdj47XG59O1xuXG5jb25zdCBDaGFuZ2VkUmVzdWx0ID0gKHtcbiAgICByZXN1bHQ6IHttb2RlbCwgZGlmZjogZGlmZlRleHR9LFxuICAgIGRpZmYsXG4gICAgYmF0Y2gsXG59OiBQcm9wcyAmIHtyZXN1bHQ6IFJlc3VsdH0sIHtsYW5nfTogQ29udGV4dCkgPT4ge1xuICAgIGlmICghZGlmZlRleHQgfHwgIW1vZGVsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiA8ZGl2PlxuICAgICAgICA8aDQ+PGEgaHJlZj17Z2V0VVJMRnJvbUlEKG1vZGVsLCBiYXRjaCwgbGFuZyl9PlxuICAgICAgICAgICAge21vZGVsfVxuICAgICAgICA8L2E+PC9oND5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaWZmXCJcbiAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7XG4gICAgICAgICAgICAgICAgX19odG1sOiBkaWZmKGRpZmZUZXh0KSxcbiAgICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgPC9kaXY+O1xufTtcblxuQ2hhbmdlZFJlc3VsdC5jb250ZXh0VHlwZXMgPSBjaGlsZENvbnRleHRUeXBlcztcblxuY29uc3QgQ3JlYXRlZFJlc3VsdCA9ICh7XG4gICAgcmVzdWx0LFxuICAgIGJhdGNoLFxufTogUHJvcHMgJiB7cmVzdWx0OiBSZXN1bHR9LCB7bGFuZ306IENvbnRleHQpID0+IHtcbiAgICBpZiAoIXJlc3VsdC5tb2RlbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB0aXRsZSA9IGJhdGNoLnN0YXRlID09PSBcImNvbXBsZXRlZFwiID9cbiAgICAgICAgPGEgaHJlZj17Z2V0VVJMRnJvbUlEKHJlc3VsdC5tb2RlbCwgYmF0Y2gsIGxhbmcpfT57cmVzdWx0Lm1vZGVsfTwvYT4gOlxuICAgICAgICByZXN1bHQubW9kZWw7XG5cbiAgICByZXR1cm4gPGRpdj5cbiAgICAgICAgPGg0Pnt0aXRsZX08L2g0PlxuICAgICAgICA8VW5wcm9jZXNzZWRSZXN1bHQgcmVzdWx0PXtyZXN1bHR9IC8+XG4gICAgPC9kaXY+O1xufTtcblxuQ3JlYXRlZFJlc3VsdC5jb250ZXh0VHlwZXMgPSBjaGlsZENvbnRleHRUeXBlcztcblxuY29uc3QgRGVsZXRlZFJlc3VsdCA9ICh7XG4gICAgcmVzdWx0LFxuICAgIGJhdGNoLFxufTogUHJvcHMgJiB7cmVzdWx0OiBSZXN1bHR9LCB7bGFuZ306IENvbnRleHQpID0+IHtcbiAgICBpZiAoIXJlc3VsdC5tb2RlbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB0aXRsZSA9IGJhdGNoLnN0YXRlID09PSBcImNvbXBsZXRlZFwiID9cbiAgICAgICAgPGEgaHJlZj17Z2V0VVJMRnJvbUlEKHJlc3VsdC5tb2RlbCwgYmF0Y2gsIGxhbmcpfT57cmVzdWx0Lm1vZGVsfTwvYT4gOlxuICAgICAgICByZXN1bHQubW9kZWw7XG5cbiAgICByZXR1cm4gPGRpdj57dGl0bGV9PC9kaXY+O1xufTtcblxuRGVsZXRlZFJlc3VsdC5jb250ZXh0VHlwZXMgPSBjaGlsZENvbnRleHRUeXBlcztcblxuY29uc3QgQ29uZmlybUJ1dHRvbnMgPSAoe2JhdGNofTogUHJvcHMsIHtVUkwsIGdldHRleHR9OiBDb250ZXh0KSA9PiA8cD5cbiAgICA8YSBocmVmPXtVUkwoYmF0Y2gsIHtmaW5hbGl6ZTogdHJ1ZX0pfSBjbGFzc05hbWU9XCJidG4gYnRuLXN1Y2Nlc3NcIj5cbiAgICAgICAge2dldHRleHQoXCJGaW5hbGl6ZSBJbXBvcnRcIil9XG4gICAgPC9hPlxuICAgIHtcIiBcIn1cbiAgICA8YSBocmVmPXtVUkwoYmF0Y2gsIHthYmFuZG9uOiB0cnVlfSl9IGNsYXNzTmFtZT1cImJ0biBidG4tZGFuZ2VyXCI+XG4gICAgICAgIHtnZXR0ZXh0KFwiQWJhbmRvbiBJbXBvcnRcIil9XG4gICAgPC9hPlxuPC9wPjtcblxuQ29uZmlybUJ1dHRvbnMuY29udGV4dFR5cGVzID0gY2hpbGRDb250ZXh0VHlwZXM7XG5cbmNvbnN0IEltcG9ydERhdGEgPSAocHJvcHM6IFByb3BzLCB7XG4gICAgZ2V0dGV4dCxcbiAgICBmb3JtYXQsXG4gICAgZml4ZWREYXRlLFxuICAgIHJlbGF0aXZlRGF0ZSxcbiAgICBVUkwsXG59OiBDb250ZXh0KSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgICBiYXRjaCxcbiAgICAgICAgYmF0Y2hFcnJvcixcbiAgICAgICAgYmF0Y2hTdGF0ZSxcbiAgICAgICAgYWRtaW5VUkwsXG4gICAgfSA9IHByb3BzO1xuICAgIGNvbnN0IHN0YXRlID0ge2JhdGNofTtcbiAgICBjb25zdCB0aXRsZSA9IGZvcm1hdChnZXR0ZXh0KFwiRGF0YSBJbXBvcnQ6ICUoZmlsZU5hbWUpc1wiKSxcbiAgICAgICAge2ZpbGVOYW1lOiBiYXRjaC5maWxlTmFtZX0pO1xuICAgIGNvbnN0IHN0YXRlVGV4dCA9IHN0YXRlID09PSBcImVycm9yXCIgP1xuICAgICAgICBmb3JtYXQoZ2V0dGV4dChcIkVycm9yOiAlKGVycm9yKXNcIiksXG4gICAgICAgICAgICB7ZXJyb3I6IGJhdGNoRXJyb3IoYmF0Y2guZXJyb3IgfHwgXCJcIil9KSA6XG4gICAgICAgIGJhdGNoU3RhdGUoYmF0Y2gpO1xuICAgIGNvbnN0IHVwbG9hZERhdGUgPSBmb3JtYXQoZ2V0dGV4dChcIlVwbG9hZGVkOiAlKGRhdGUpc1wiKSxcbiAgICAgICAge2RhdGU6IGZpeGVkRGF0ZShiYXRjaC5jcmVhdGVkKX0pO1xuICAgIGNvbnN0IGxhc3RVcGRhdGVkID0gZm9ybWF0KGdldHRleHQoXCJMYXN0IFVwZGF0ZWQ6ICUoZGF0ZSlzXCIpLFxuICAgICAgICB7ZGF0ZTogcmVsYXRpdmVEYXRlKGJhdGNoLm1vZGlmaWVkKX0pO1xuXG4gICAgY29uc3Qgc3R5bGUgPSA8bGluayByZWw9XCJzdHlsZXNoZWV0XCJcbiAgICAgICAgaHJlZj17VVJMKFwiL2Nzcy9mb3JtYXQtZGlmZi5jc3NcIil9XG4gICAgLz47XG5cbiAgICByZXR1cm4gPFBhZ2UgdGl0bGU9e3RpdGxlfSBzdHlsZT17c3R5bGV9PlxuICAgICAgICA8cD48YSBocmVmPXthZG1pblVSTH0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCI+XG4gICAgICAgICAgICAmbGFxdW87IHtnZXR0ZXh0KFwiUmV0dXJuIHRvIEFkbWluIFBhZ2VcIil9XG4gICAgICAgIDwvYT48L3A+XG5cbiAgICAgICAgPGgxPnt0aXRsZX08L2gxPlxuICAgICAgICA8cD57dXBsb2FkRGF0ZX08L3A+XG4gICAgICAgIDxwPjxzdHJvbmc+e3N0YXRlVGV4dH08L3N0cm9uZz48L3A+XG4gICAgICAgIHtzdGF0ZSAhPT0gXCJjb21wbGV0ZWRcIiAmJiBzdGF0ZSAhPT0gXCJlcnJvclwiICYmIDxwPntsYXN0VXBkYXRlZH08L3A+fVxuICAgICAgICB7c3RhdGUgPT09IFwicHJvY2Vzcy5jb21wbGV0ZWRcIiAmJiA8Q29uZmlybUJ1dHRvbnMgey4uLnByb3BzfSAvPn1cblxuICAgICAgICA8SW1wb3J0UmVzdWx0XG4gICAgICAgICAgICB7Li4ucHJvcHN9XG4gICAgICAgICAgICBpZD1cInVucHJvY2Vzc2VkXCJcbiAgICAgICAgICAgIHRpdGxlPXtnZXR0ZXh0KFwiVG8gQmUgUHJvY2Vzc2VkXCIpfVxuICAgICAgICAgICAgcmVuZGVyUmVzdWx0PXtVbnByb2Nlc3NlZFJlc3VsdH1cbiAgICAgICAgLz5cblxuICAgICAgICA8SW1wb3J0UmVzdWx0XG4gICAgICAgICAgICB7Li4ucHJvcHN9XG4gICAgICAgICAgICBpZD1cImVycm9yc1wiXG4gICAgICAgICAgICB0aXRsZT17Z2V0dGV4dChcIkVycm9yc1wiKX1cbiAgICAgICAgICAgIHJlbmRlclJlc3VsdD17KHJlc3VsdCwgaSkgPT5cbiAgICAgICAgICAgICAgICA8RXJyb3JSZXN1bHQgey4uLnByb3BzfSByZXN1bHQ9e3Jlc3VsdH0ga2V5PXtpfSAvPn1cbiAgICAgICAgLz5cblxuICAgICAgICA8SW1wb3J0UmVzdWx0XG4gICAgICAgICAgICB7Li4ucHJvcHN9XG4gICAgICAgICAgICBpZD1cIndhcm5pbmdzXCJcbiAgICAgICAgICAgIHRpdGxlPXtnZXR0ZXh0KFwiV2FybmluZ3NcIil9XG4gICAgICAgICAgICByZW5kZXJSZXN1bHQ9eyhyZXN1bHQsIGkpID0+XG4gICAgICAgICAgICAgICAgPFdhcm5pbmdSZXN1bHQgey4uLnByb3BzfSByZXN1bHQ9e3Jlc3VsdH0ga2V5PXtpfSAvPn1cbiAgICAgICAgLz5cblxuICAgICAgICA8SW1wb3J0UmVzdWx0XG4gICAgICAgICAgICB7Li4ucHJvcHN9XG4gICAgICAgICAgICBpZD1cImNoYW5nZWRcIlxuICAgICAgICAgICAgdGl0bGU9e3N0YXRlID09PSBcImNvbXBsZXRlZFwiID9cbiAgICAgICAgICAgICAgICBnZXR0ZXh0KFwiQ2hhbmdlZFwiKSA6XG4gICAgICAgICAgICAgICAgZ2V0dGV4dChcIldpbGwgQmUgQ2hhbmdlZFwiKX1cbiAgICAgICAgICAgIHJlbmRlclJlc3VsdD17KHJlc3VsdCwgaSkgPT5cbiAgICAgICAgICAgICAgICA8Q2hhbmdlZFJlc3VsdCB7Li4ucHJvcHN9IHJlc3VsdD17cmVzdWx0fSBrZXk9e2l9IC8+fVxuICAgICAgICAvPlxuXG4gICAgICAgIDxJbXBvcnRSZXN1bHRcbiAgICAgICAgICAgIHsuLi5wcm9wc31cbiAgICAgICAgICAgIGlkPVwiY3JlYXRlZFwiXG4gICAgICAgICAgICB0aXRsZT17c3RhdGUgPT09IFwiY29tcGxldGVkXCIgP1xuICAgICAgICAgICAgICAgIGdldHRleHQoXCJDcmVhdGVkXCIpIDpcbiAgICAgICAgICAgICAgICBnZXR0ZXh0KFwiV2lsbCBCZSBDcmVhdGVkXCIpfVxuICAgICAgICAgICAgcmVuZGVyUmVzdWx0PXsocmVzdWx0LCBpKSA9PlxuICAgICAgICAgICAgICAgIDxDcmVhdGVkUmVzdWx0IHsuLi5wcm9wc30gcmVzdWx0PXtyZXN1bHR9IGtleT17aX0gLz59XG4gICAgICAgIC8+XG5cbiAgICAgICAgPEltcG9ydFJlc3VsdFxuICAgICAgICAgICAgey4uLnByb3BzfVxuICAgICAgICAgICAgaWQ9XCJkZWxldGVkXCJcbiAgICAgICAgICAgIHRpdGxlPXtzdGF0ZSA9PT0gXCJjb21wbGV0ZWRcIiA/XG4gICAgICAgICAgICAgICAgZ2V0dGV4dChcIkRlbGV0ZWRcIikgOlxuICAgICAgICAgICAgICAgIGdldHRleHQoXCJXaWxsIEJlIERlbGV0ZWRcIil9XG4gICAgICAgICAgICByZW5kZXJSZXN1bHQ9eyhyZXN1bHQsIGkpID0+XG4gICAgICAgICAgICAgICAgPERlbGV0ZWRSZXN1bHQgey4uLnByb3BzfSByZXN1bHQ9e3Jlc3VsdH0ga2V5PXtpfSAvPn1cbiAgICAgICAgLz5cbiAgICA8L1BhZ2U+O1xufTtcblxuSW1wb3J0RGF0YS5jb250ZXh0VHlwZXMgPSBjaGlsZENvbnRleHRUeXBlcztcblxubW9kdWxlLmV4cG9ydHMgPSBJbXBvcnREYXRhO1xuIl19