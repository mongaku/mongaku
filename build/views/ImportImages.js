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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92aWV3cy9JbXBvcnRJbWFnZXMuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiUGFnZSIsIkltcG9ydFJlc3VsdCIsImNoaWxkQ29udGV4dFR5cGVzIiwiRXJyb3JSZXN1bHQiLCJyZXN1bHQiLCJiYXRjaEVycm9yIiwiZXJyb3IiLCJmaWxlTmFtZSIsIldhcm5pbmdSZXN1bHQiLCJ3YXJuaW5ncyIsIm1hcCIsIndhcm5pbmciLCJNb2RlbFJlc3VsdCIsIm1vZGVsIiwiZ2V0T3JpZ2luYWxVUkwiLCJnZXRUaHVtYlVSTCIsIkltcG9ydEltYWdlcyIsInByb3BzIiwiZm9ybWF0IiwiZ2V0dGV4dCIsImZpeGVkRGF0ZSIsInJlbGF0aXZlRGF0ZSIsImFkbWluVVJMIiwiYmF0Y2giLCJiYXRjaFN0YXRlIiwidGl0bGUiLCJzdGF0ZSIsInVwbG9hZERhdGUiLCJkYXRlIiwiY3JlYXRlZCIsImxhc3RVcGRhdGVkIiwibW9kaWZpZWQiLCJpIiwiY29udGV4dFR5cGVzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLElBQU1BLFFBQVFDLFFBQVEsT0FBUixDQUFkOztBQUVBLElBQU1DLE9BQU9ELFFBQVEsV0FBUixDQUFiO0FBQ0EsSUFBTUUsZUFBZUYsUUFBUSxtQkFBUixDQUFyQjs7OztlQUc0QkEsUUFBUSxjQUFSLEM7SUFBckJHLGlCLFlBQUFBLGlCOztBQThDUCxJQUFNQyxjQUFjLFNBQWRBLFdBQWMsT0FBb0Q7QUFBQSxRQUFsREMsTUFBa0QsUUFBbERBLE1BQWtEO0FBQUEsUUFBMUNDLFVBQTBDLFFBQTFDQSxVQUEwQzs7QUFDcEUsUUFBSSxDQUFDRCxPQUFPRSxLQUFaLEVBQW1CO0FBQ2YsZUFBTyxJQUFQO0FBQ0g7O0FBRUQsV0FBTztBQUFBO0FBQUE7QUFDRkYsZUFBT0csUUFETDtBQUFBO0FBQ2lCRixtQkFBV0QsT0FBT0UsS0FBUCxJQUFnQixFQUEzQjtBQURqQixLQUFQO0FBR0gsQ0FSRDs7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RztBQVFGSCxjQUFNRyxLQUFOLEtBQWdCLFdBQWhCLElBQ0dILE1BQU1HLEtBQU4sS0FBZ0IsT0FEbkIsSUFDOEI7QUFBQTtBQUFBO0FBQUlJO0FBQUosU0FUNUI7QUFXSCw0QkFBQyxZQUFELGVBQ1FiLEtBRFI7QUFFSSxnQkFBRyxRQUZQO0FBR0ksbUJBQU9FLFFBQVEsUUFBUixDQUhYO0FBSUksMEJBQWMsc0JBQUNmLE1BQUQsRUFBUzRCLENBQVQ7QUFBQSx1QkFDVixvQkFBQyxXQUFELGVBQWlCZixLQUFqQixJQUF3QixRQUFRYixNQUFoQyxFQUF3QyxLQUFLNEIsQ0FBN0MsSUFEVTtBQUFBO0FBSmxCLFdBWEc7QUFtQkgsNEJBQUMsWUFBRCxlQUNRZixLQURSO0FBRUksZ0JBQUcsVUFGUDtBQUdJLG1CQUFPRSxRQUFRLFVBQVIsQ0FIWDtBQUlJLDBCQUFjLHNCQUFDZixNQUFELEVBQVM0QixDQUFUO0FBQUEsdUJBQ1Ysb0JBQUMsYUFBRCxlQUFtQmYsS0FBbkIsSUFBMEIsUUFBUWIsTUFBbEMsRUFBMEMsS0FBSzRCLENBQS9DLElBRFU7QUFBQTtBQUpsQixXQW5CRztBQTJCSCw0QkFBQyxZQUFELGVBQ1FmLEtBRFI7QUFFSSxnQkFBRyxRQUZQO0FBR0ksbUJBQU9FLFFBQVEsUUFBUixDQUhYO0FBSUksMEJBQWMsc0JBQUNmLE1BQUQsRUFBUzRCLENBQVQ7QUFBQSx1QkFDVixvQkFBQyxXQUFELGVBQWlCZixLQUFqQixJQUF3QixRQUFRYixNQUFoQyxFQUF3QyxLQUFLNEIsQ0FBN0MsSUFEVTtBQUFBLGFBSmxCO0FBTUkscUJBQVM7QUFOYjtBQTNCRyxLQUFQO0FBb0NILENBM0REOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2REFoQixhQUFhaUIsWUFBYixHQUE0Qi9CLGlCQUE1Qjs7QUFFQWdDLE9BQU9DLE9BQVAsR0FBaUJuQixZQUFqQiIsImZpbGUiOiJJbXBvcnRJbWFnZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxuY29uc3QgUGFnZSA9IHJlcXVpcmUoXCIuL1BhZ2UuanNcIik7XG5jb25zdCBJbXBvcnRSZXN1bHQgPSByZXF1aXJlKFwiLi9JbXBvcnRSZXN1bHQuanNcIik7XG5cbmltcG9ydCB0eXBlIHtDb250ZXh0fSBmcm9tIFwiLi90eXBlcy5qc1wiO1xuY29uc3Qge2NoaWxkQ29udGV4dFR5cGVzfSA9IHJlcXVpcmUoXCIuL1dyYXBwZXIuanNcIik7XG5cbnR5cGUgSW1wb3J0ID0ge1xuICAgIF9pZDogc3RyaW5nLFxuICAgIGVycm9yPzogc3RyaW5nLFxuICAgIGZpbGVOYW1lOiBzdHJpbmcsXG4gICAgZ2V0RmlsdGVyZWRSZXN1bHRzOiAoKSA9PiBJbXBvcnRSZXN1bHRzLFxuICAgIGdldFVSTDogKGxhbmc6IHN0cmluZykgPT4gc3RyaW5nLFxuICAgIGNyZWF0ZWQ6IERhdGUsXG4gICAgbW9kaWZpZWQ6IERhdGUsXG4gICAgc3RhdGU6IHN0cmluZyxcbn07XG5cbnR5cGUgSW1wb3J0UmVzdWx0cyA9IHtcbiAgICBtb2RlbHM6IEFycmF5PFJlc3VsdD4sXG4gICAgdW5wcm9jZXNzZWQ6IEFycmF5PFJlc3VsdD4sXG4gICAgY3JlYXRlZDogQXJyYXk8UmVzdWx0PixcbiAgICBjaGFuZ2VkOiBBcnJheTxSZXN1bHQ+LFxuICAgIGRlbGV0ZWQ6IEFycmF5PFJlc3VsdD4sXG4gICAgZXJyb3JzOiBBcnJheTxSZXN1bHQ+LFxuICAgIHdhcm5pbmdzOiBBcnJheTxSZXN1bHQ+LFxufTtcblxudHlwZSBJbWFnZVR5cGUgPSB7XG4gICAgX2lkOiBzdHJpbmcsXG4gICAgZ2V0T3JpZ2luYWxVUkw6ICgpID0+IHN0cmluZyxcbiAgICBnZXRTY2FsZWRVUkw6ICgpID0+IHN0cmluZyxcbiAgICBnZXRUaHVtYlVSTDogKCkgPT4gc3RyaW5nLFxufTtcblxudHlwZSBSZXN1bHQgPSB7XG4gICAgZmlsZU5hbWU6IHN0cmluZyxcbiAgICBlcnJvcj86IHN0cmluZyxcbiAgICBtb2RlbD86IEltYWdlVHlwZSxcbiAgICB3YXJuaW5ncz86IEFycmF5PHN0cmluZz4sXG59O1xuXG50eXBlIFByb3BzID0ge1xuICAgIGFkbWluVVJMOiBzdHJpbmcsXG4gICAgYmF0Y2g6IEltcG9ydCxcbiAgICBiYXRjaEVycm9yOiAoZXJyb3I6IHN0cmluZykgPT4gc3RyaW5nLFxuICAgIGJhdGNoU3RhdGU6IChiYXRjaDogSW1wb3J0KSA9PiBzdHJpbmcsXG4gICAgZXhwYW5kZWQ/OiBcIm1vZGVsc1wiIHwgXCJ1bnByb2Nlc3NlZFwiIHwgXCJjcmVhdGVkXCIgfCBcImNoYW5nZWRcIiB8IFwiZGVsZXRlZFwiIHxcbiAgICAgICAgXCJlcnJvcnNcIiB8IFwid2FybmluZ3NcIixcbn07XG5cbmNvbnN0IEVycm9yUmVzdWx0ID0gKHtyZXN1bHQsIGJhdGNoRXJyb3J9OiBQcm9wcyAmIHtyZXN1bHQ6IFJlc3VsdH0pID0+IHtcbiAgICBpZiAoIXJlc3VsdC5lcnJvcikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gPGxpPlxuICAgICAgICB7cmVzdWx0LmZpbGVOYW1lfToge2JhdGNoRXJyb3IocmVzdWx0LmVycm9yIHx8IFwiXCIpfVxuICAgIDwvbGk+O1xufTtcblxuY29uc3QgV2FybmluZ1Jlc3VsdCA9ICh7cmVzdWx0LCBiYXRjaEVycm9yfTogUHJvcHMgJiB7cmVzdWx0OiBSZXN1bHR9KSA9PiB7XG4gICAgaWYgKCFyZXN1bHQud2FybmluZ3MpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIDxsaT5cbiAgICAgICAge3Jlc3VsdC5maWxlTmFtZX06XG4gICAgICAgIDx1bD5cbiAgICAgICAgICAgIHtyZXN1bHQud2FybmluZ3MubWFwKCh3YXJuaW5nKSA9PlxuICAgICAgICAgICAgICAgIDxsaSBrZXk9e3dhcm5pbmd9PntiYXRjaEVycm9yKHdhcm5pbmcpfTwvbGk+KX1cbiAgICAgICAgPC91bD5cbiAgICA8L2xpPjtcbn07XG5cbmNvbnN0IE1vZGVsUmVzdWx0ID0gKHtyZXN1bHQ6IHttb2RlbCwgZmlsZU5hbWV9fToge3Jlc3VsdDogUmVzdWx0fSkgPT4ge1xuICAgIGlmICghbW9kZWwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiaW1nIGNvbC14cy02IGNvbC1zbS00IGNvbC1tZC0zXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW1nLXdyYXBcIj5cbiAgICAgICAgICAgIDxhIGhyZWY9e21vZGVsLmdldE9yaWdpbmFsVVJMKCl9PlxuICAgICAgICAgICAgICAgIDxpbWcgc3JjPXttb2RlbC5nZXRUaHVtYlVSTCgpfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJpbWctcmVzcG9uc2l2ZSBjZW50ZXItYmxvY2tcIlxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRldGFpbHNcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwid3JhcFwiPntmaWxlTmFtZX08L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+O1xufTtcblxuY29uc3QgSW1wb3J0SW1hZ2VzID0gKHByb3BzOiBQcm9wcywge1xuICAgIGZvcm1hdCxcbiAgICBnZXR0ZXh0LFxuICAgIGZpeGVkRGF0ZSxcbiAgICByZWxhdGl2ZURhdGUsXG59OiBDb250ZXh0KSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgICBhZG1pblVSTCxcbiAgICAgICAgYmF0Y2hFcnJvcixcbiAgICAgICAgYmF0Y2gsXG4gICAgICAgIGJhdGNoU3RhdGUsXG4gICAgfSA9IHByb3BzO1xuICAgIGNvbnN0IHRpdGxlID0gZm9ybWF0KGdldHRleHQoXCJJbWFnZSBJbXBvcnQ6ICUoZmlsZU5hbWUpc1wiKSxcbiAgICAgICAge2ZpbGVOYW1lOiBiYXRjaC5maWxlTmFtZX0pO1xuICAgIGNvbnN0IHN0YXRlID0gYmF0Y2guc3RhdGUgPT09IFwiZXJyb3JcIiA/XG4gICAgICAgIGZvcm1hdChnZXR0ZXh0KFwiRXJyb3I6ICUoZXJyb3Ipc1wiKSxcbiAgICAgICAgICAgIHtlcnJvcjogYmF0Y2hFcnJvcihiYXRjaC5lcnJvciB8fCBcIlwiKX0pIDpcbiAgICAgICAgYmF0Y2hTdGF0ZShiYXRjaCk7XG4gICAgY29uc3QgdXBsb2FkRGF0ZSA9IGZvcm1hdChnZXR0ZXh0KFwiVXBsb2FkZWQ6ICUoZGF0ZSlzXCIpLFxuICAgICAgICB7ZGF0ZTogZml4ZWREYXRlKGJhdGNoLmNyZWF0ZWQpfSk7XG4gICAgY29uc3QgbGFzdFVwZGF0ZWQgPSBmb3JtYXQoZ2V0dGV4dChcIkxhc3QgVXBkYXRlZDogJShkYXRlKXNcIiksXG4gICAgICAgIHtkYXRlOiByZWxhdGl2ZURhdGUoYmF0Y2gubW9kaWZpZWQpfSk7XG5cbiAgICByZXR1cm4gPFBhZ2UgdGl0bGU9e3RpdGxlfT5cbiAgICAgICAgPHA+PGEgaHJlZj17YWRtaW5VUkx9IGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiPlxuICAgICAgICAgICAgJmxhcXVvOyB7Z2V0dGV4dChcIlJldHVybiB0byBBZG1pbiBQYWdlXCIpfVxuICAgICAgICA8L2E+PC9wPlxuXG4gICAgICAgIDxoMT57dGl0bGV9PC9oMT5cbiAgICAgICAgPHA+e3VwbG9hZERhdGV9PC9wPlxuICAgICAgICA8cD48c3Ryb25nPntzdGF0ZX08L3N0cm9uZz48L3A+XG4gICAgICAgIHtiYXRjaC5zdGF0ZSAhPT0gXCJjb21wbGV0ZWRcIiAmJlxuICAgICAgICAgICAgYmF0Y2guc3RhdGUgIT09IFwiZXJyb3JcIiAmJiA8cD57bGFzdFVwZGF0ZWR9PC9wPn1cblxuICAgICAgICA8SW1wb3J0UmVzdWx0XG4gICAgICAgICAgICB7Li4ucHJvcHN9XG4gICAgICAgICAgICBpZD1cImVycm9yc1wiXG4gICAgICAgICAgICB0aXRsZT17Z2V0dGV4dChcIkVycm9yc1wiKX1cbiAgICAgICAgICAgIHJlbmRlclJlc3VsdD17KHJlc3VsdCwgaSkgPT5cbiAgICAgICAgICAgICAgICA8RXJyb3JSZXN1bHQgey4uLnByb3BzfSByZXN1bHQ9e3Jlc3VsdH0ga2V5PXtpfSAvPn1cbiAgICAgICAgLz5cblxuICAgICAgICA8SW1wb3J0UmVzdWx0XG4gICAgICAgICAgICB7Li4ucHJvcHN9XG4gICAgICAgICAgICBpZD1cIndhcm5pbmdzXCJcbiAgICAgICAgICAgIHRpdGxlPXtnZXR0ZXh0KFwiV2FybmluZ3NcIil9XG4gICAgICAgICAgICByZW5kZXJSZXN1bHQ9eyhyZXN1bHQsIGkpID0+XG4gICAgICAgICAgICAgICAgPFdhcm5pbmdSZXN1bHQgey4uLnByb3BzfSByZXN1bHQ9e3Jlc3VsdH0ga2V5PXtpfSAvPn1cbiAgICAgICAgLz5cblxuICAgICAgICA8SW1wb3J0UmVzdWx0XG4gICAgICAgICAgICB7Li4ucHJvcHN9XG4gICAgICAgICAgICBpZD1cIm1vZGVsc1wiXG4gICAgICAgICAgICB0aXRsZT17Z2V0dGV4dChcIkltYWdlc1wiKX1cbiAgICAgICAgICAgIHJlbmRlclJlc3VsdD17KHJlc3VsdCwgaSkgPT5cbiAgICAgICAgICAgICAgICA8TW9kZWxSZXN1bHQgey4uLnByb3BzfSByZXN1bHQ9e3Jlc3VsdH0ga2V5PXtpfSAvPn1cbiAgICAgICAgICAgIG51bVNob3c9ezh9XG4gICAgICAgIC8+XG4gICAgPC9QYWdlPjtcbn07XG5cbkltcG9ydEltYWdlcy5jb250ZXh0VHlwZXMgPSBjaGlsZENvbnRleHRUeXBlcztcblxubW9kdWxlLmV4cG9ydHMgPSBJbXBvcnRJbWFnZXM7XG4iXX0=