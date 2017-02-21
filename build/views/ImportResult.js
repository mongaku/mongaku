"use strict";

const React = require("react");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

const { childContextTypes } = require("./Wrapper.js");

const ImportResult = (props, {
    gettext,
    stringNum,
    URL,
    format
}) => {
    const {
        batch,
        expanded,
        id,
        numShow = 5,
        renderResult,
        title
    } = props;
    const allResults = batch.getFilteredResults[id];
    const showAll = format(gettext("Show all %(count)s results..."), { count: stringNum(allResults.length) });
    const expandURL = URL(batch.getURL, { expanded: id });
    const isExpanded = expanded === id || allResults.length <= numShow;
    const results = isExpanded ? allResults : allResults.slice(0, numShow);

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
                        { href: `${expandURL}#${id}` },
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
        getFilteredResults: require("react").PropTypes.any.isRequired,
        getURL: require("react").PropTypes.string.isRequired,
        modified: require("react").PropTypes.any.isRequired,
        state: require("react").PropTypes.string.isRequired
    }).isRequired,
    expanded: require("react").PropTypes.oneOf(["models", "unprocessed", "created", "changed", "deleted", "errors", "warnings"]),
    id: require("react").PropTypes.oneOf(["models", "unprocessed", "created", "changed", "deleted", "errors", "warnings"]).isRequired,
    numShow: require("react").PropTypes.number,
    renderResult: require("react").PropTypes.func.isRequired,
    title: require("react").PropTypes.string.isRequired
};
ImportResult.contextTypes = childContextTypes;

module.exports = ImportResult;