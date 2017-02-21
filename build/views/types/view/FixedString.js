"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const React = require("react");

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
    values,
    urlValue
}) => {
    if (!stringValue) {
        return null;
    }

    const title = getTitle(stringValue, values);

    return React.createElement(
        "a",
        { href: urlValue },
        title
    );
};

const Values = props => {
    const { stringValues, url } = props;

    return React.createElement(
        "span",
        null,
        stringValues.map((value, i) => React.createElement(
            "span",
            { key: i },
            React.createElement(Value, _extends({}, props, { stringValue: value, urlValue: url[i] })),
            stringValues.length - 1 === i ? "" : ", "
        ))
    );
};

const FixedStringView = props => {
    const { value, url } = props;

    if (Array.isArray(value) && Array.isArray(url)) {
        return React.createElement(Values, _extends({}, props, { stringValues: value }));
    }

    if (!Array.isArray(value) && !Array.isArray(url)) {
        return React.createElement(Value, _extends({}, props, { stringValue: value, urlValue: url }));
    }

    return null;
};

FixedStringView.propTypes = {
    value: require("react").PropTypes.oneOfType([require("react").PropTypes.string, require("react").PropTypes.arrayOf(require("react").PropTypes.string)]).isRequired,
    values: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired
    })),
    url: require("react").PropTypes.oneOfType([require("react").PropTypes.string, require("react").PropTypes.arrayOf(require("react").PropTypes.string)]).isRequired
};
module.exports = FixedStringView;