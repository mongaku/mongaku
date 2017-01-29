"use strict";

var React = require("react");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

var _require = require("./Wrapper.js"),
    childContextTypes = _require.childContextTypes;

var ImportResult = function ImportResult(props, _ref) {
    var URL = _ref.URL,
        format = _ref.format,
        gettext = _ref.gettext,
        stringNum = _ref.stringNum;
    var batch = props.batch,
        expanded = props.expanded,
        id = props.id,
        _props$numShow = props.numShow,
        numShow = _props$numShow === undefined ? 5 : _props$numShow,
        renderResult = props.renderResult,
        title = props.title;

    var allResults = batch.getFilteredResults()[id];
    var showAll = format(gettext("Show all %(count)s results..."), { count: stringNum(allResults.length) });
    var expandURL = URL(batch, { expanded: id });
    var isExpanded = expanded === id || allResults.length <= numShow;
    var results = expanded ? allResults : allResults.slice(0, numShow);

    if (results.length === 0) {
        return null;
    }

    return React.createElement(
        "div",
        { className: "panel panel-default" },
        React.createElement(
            "div",
            { className: "panel-heading" },
            React.createElement(
                "h3",
                { id: id, className: "panel-title" },
                title,
                " ",
                "(",
                stringNum(allResults.length),
                ")"
            )
        ),
        React.createElement(
            "div",
            { className: "panel-body" },
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "ul",
                    { className: "col-xs-12" },
                    results.map(renderResult)
                )
            ),
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-xs-12" },
                    !isExpanded && React.createElement(
                        "a",
                        { href: expandURL + "#" + id },
                        showAll
                    )
                )
            )
        )
    );
};

ImportResult.propTypes = {
    batch: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        error: require("react").PropTypes.string,
        getFilteredResults: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        modified: require("react").PropTypes.any.isRequired,
        state: require("react").PropTypes.string.isRequired
    }).isRequired,
    expanded: require("react").PropTypes.string,
    id: require("react").PropTypes.oneOf(["models", "unprocessed", "created", "changed", "deleted", "errors", "warnings"]).isRequired,
    numShow: require("react").PropTypes.number,
    renderResult: require("react").PropTypes.func.isRequired,
    title: require("react").PropTypes.string.isRequired
};
ImportResult.contextTypes = childContextTypes;

module.exports = ImportResult;