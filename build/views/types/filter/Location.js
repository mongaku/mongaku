"use strict";

const React = require("react");

const LocationFilter = ({
    placeholder,
    searchName,
    title,
    value
}) => React.createElement(
    "div",
    { className: "form-group" },
    React.createElement(
        "label",
        { htmlFor: searchName, className: "control-label" },
        title
    ),
    React.createElement("input", {
        type: "text",
        name: searchName,
        placeholder: placeholder,
        defaultValue: value,
        className: "form-control"
    })
);

LocationFilter.propTypes = {
    placeholder: require("react").PropTypes.string,
    searchName: require("react").PropTypes.string.isRequired,
    title: require("react").PropTypes.string.isRequired,
    value: require("react").PropTypes.string
};
module.exports = LocationFilter;