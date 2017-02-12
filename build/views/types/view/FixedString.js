"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const React = require("react");

const { searchURL } = require("../../utils.js");

var babelPluginFlowReactPropTypes_proptype_Context = require("../../types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

const { childContextTypes } = require("../../Wrapper.js");

const getTitle = (value, values) => {
    if (!values) {
        return value;
    }

    for (const map of values) {
        if (map.id === value) {
            return map.name;
        }
    }

    return value;
};

const Value = ({
    stringValue,
    name,
    type,
    values
}, { lang }) => {
    if (!stringValue) {
        return null;
    }

    const title = getTitle(stringValue, values);
    const url = searchURL(lang, {
        [name]: stringValue,
        type
    });

    return React.createElement(
        "a",
        { href: url },
        title
    );
};

Value.contextType = childContextTypes;

const Values = props => {
    const { stringValues } = props;

    return React.createElement(
        "span",
        null,
        stringValues.map((value, i) => React.createElement(
            "span",
            { key: i },
            React.createElement(Value, _extends({}, props, { stringValue: value })),
            stringValues.length - 1 === i ? "" : ", "
        ))
    );
};

const FixedStringView = props => {
    const { value } = props;
    return Array.isArray(value) ? React.createElement(Values, _extends({}, props, { stringValues: value })) : React.createElement(Value, _extends({}, props, { stringValue: value }));
};

FixedStringView.propTypes = {
    name: require("react").PropTypes.string.isRequired,
    type: require("react").PropTypes.string.isRequired,
    value: require("react").PropTypes.oneOfType([require("react").PropTypes.string, require("react").PropTypes.arrayOf(require("react").PropTypes.string)]).isRequired,
    values: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired
    }))
};
module.exports = FixedStringView;