"use strict";

const React = require("react");

const NameFilter = ({
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
            "data-placeholder": placeholder
        },
        React.createElement(
            "option",
            { value: "" },
            placeholder
        ),
        values.map(name => React.createElement(
            "option",
            { value: name, key: name },
            name
        ))
    )
);

NameFilter.propTypes = {
    placeholder: require("react").PropTypes.string,
    searchName: require("react").PropTypes.string.isRequired,
    title: require("react").PropTypes.string.isRequired,
    value: require("react").PropTypes.string,
    values: require("react").PropTypes.arrayOf(require("react").PropTypes.string).isRequired
};
module.exports = NameFilter;