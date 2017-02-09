"use strict";

const React = require("react");

const FixedStringFilter = ({
    multiple,
    placeholder,
    searchName,
    title,
    value,
    values
}) => React.createElement(
    "div",
    { className: "form-group" },
    React.createElement(
        "label",
        { htmlFor: searchName, className: "control-label" },
        title
    ),
    React.createElement(
        "select",
        { name: searchName, style: { width: "100%" },
            className: "form-control select2-select",
            defaultValue: value,
            "data-placeholder": placeholder,
            multiple: multiple
        },
        React.createElement(
            "option",
            { value: "" },
            placeholder
        ),
        values.map(type => React.createElement(
            "option",
            { value: type.id, key: type.id },
            type.name
        ))
    )
);

FixedStringFilter.propTypes = {
    multiple: require("react").PropTypes.bool,
    placeholder: require("react").PropTypes.string,
    searchName: require("react").PropTypes.string.isRequired,
    title: require("react").PropTypes.string.isRequired,
    value: require("react").PropTypes.string,
    values: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired
    })).isRequired
};
module.exports = FixedStringFilter;