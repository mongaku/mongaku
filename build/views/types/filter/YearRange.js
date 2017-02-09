"use strict";

const React = require("react");

const YearRangeFilter = ({
    placeholder,
    searchName,
    title,
    value
}) => React.createElement(
    "div",
    { className: "form-group" },
    React.createElement(
        "label",
        { htmlFor: `${searchName}.start`, className: "control-label" },
        title
    ),
    React.createElement(
        "div",
        { className: "form-inline" },
        React.createElement("input", { type: "text", name: `${searchName}.start`,
            defaultValue: value && value.start,
            placeholder: placeholder && placeholder.start,
            className: "form-control date-control"
        }),
        "\u2014",
        React.createElement("input", { type: "text", name: `${searchName}.end`,
            defaultValue: value && value.end,
            placeholder: placeholder && placeholder.end,
            className: "form-control date-control"
        })
    )
);

YearRangeFilter.propTypes = {
    placeholder: require("react").PropTypes.shape({
        end: require("react").PropTypes.number,
        start: require("react").PropTypes.number
    }),
    searchName: require("react").PropTypes.string.isRequired,
    title: require("react").PropTypes.string.isRequired,
    value: require("react").PropTypes.shape({
        end: require("react").PropTypes.number,
        start: require("react").PropTypes.number
    })
};
module.exports = YearRangeFilter;