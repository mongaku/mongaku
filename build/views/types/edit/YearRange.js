"use strict";

const React = require("react");

const YearRangeEdit = ({
    name,
    value
}) => {
    const defaultValue = value && value[0] && value[0].original;

    return React.createElement("input", {
        name: name,
        type: "text",
        className: "form-control",
        defaultValue: defaultValue
    });
};

YearRangeEdit.propTypes = {
    name: require("react").PropTypes.string.isRequired,
    value: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        original: require("react").PropTypes.string.isRequired
    }))
};
module.exports = YearRangeEdit;