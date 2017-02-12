"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const React = require("react");

const { searchURL } = require("../../utils.js");

var babelPluginFlowReactPropTypes_proptype_Context = require("../../types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

const { childContextTypes } = require("../../Wrapper.js");

const getDate = date => {
    if (date.original) {
        return date.original;
    }

    if (date.start || date.end) {
        // TODO(jeresig): Handle "ca. " for non-English locales
        return (date.circa ? "ca. " : "") + date.start + (date.end && date.end !== date.start ? `-${date.end}` : "");
    }

    return "";
};

const YearRange = ({
    name,
    type,
    date
}, { lang }) => {
    const url = searchURL(lang, {
        [name]: {
            start: date.start,
            end: date.end
        },
        type
    });

    return React.createElement(
        "span",
        { key: date._id },
        React.createElement(
            "a",
            { href: url },
            getDate(date)
        ),
        React.createElement("br", null)
    );
};

YearRange.contextTypes = childContextTypes;

const YearRangeView = props => {
    const { value } = props;
    return React.createElement(
        "span",
        null,
        value.map(date => React.createElement(YearRange, _extends({}, props, {
            date: date,
            key: date._id
        })))
    );
};

YearRangeView.propTypes = {
    name: require("react").PropTypes.string.isRequired,
    type: require("react").PropTypes.string.isRequired,
    value: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        original: require("react").PropTypes.string,
        circa: require("react").PropTypes.string,
        start: require("react").PropTypes.number.isRequired,
        end: require("react").PropTypes.number.isRequired
    })).isRequired
};
module.exports = YearRangeView;