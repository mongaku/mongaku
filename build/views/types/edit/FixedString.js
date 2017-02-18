"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const React = require("react");

const getValue = (value, values) => {
    if (!value) {
        return "";
    }

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
    name,
    stringValue,
    values,
    multiline
}) => {
    const defaultValue = getValue(stringValue, values);

    if (multiline) {
        return React.createElement("textarea", {
            name: name,
            className: "form-control",
            defaultValue: defaultValue
        });
    }

    return React.createElement("input", {
        name: name,
        type: "text",
        className: "form-control",
        defaultValue: defaultValue
    });
};

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

const FixedStringEdit = props => {
    const {
        name,
        value,
        values,
        multiple
    } = props;

    if (values && Array.isArray(values) && values.length > 0) {
        const formValues = Array.isArray(value) ? value.map(value => ({
            id: value,
            name: getValue(value, values)
        })) : [{
            id: value,
            name: getValue(value, values)
        }];

        return React.createElement(
            "select",
            {
                name: name,
                className: "form-control select2-select",
                defaultValue: values,
                multiple: multiple
            },
            formValues.map(value => React.createElement(
                "option",
                { value: value.id, key: value.id },
                value.name
            ))
        );
    }

    return Array.isArray(value) ? React.createElement(Values, _extends({}, props, { stringValues: value })) : React.createElement(Value, _extends({}, props, { stringValue: value }));
};

FixedStringEdit.propTypes = {
    name: require("react").PropTypes.string.isRequired,
    multiline: require("react").PropTypes.bool,
    value: require("react").PropTypes.oneOfType([require("react").PropTypes.string, require("react").PropTypes.arrayOf(require("react").PropTypes.string)]),
    values: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired
    })),
    multiple: require("react").PropTypes.bool
};
module.exports = FixedStringEdit;