"use strict";

const React = require("react");

const SimpleDateEdit = ({
    name,
    value
}) => {
    let dateString = "";

    if (value) {
        dateString = value.toISOString().replace(/T.*$/, "");
    }

    return React.createElement("input", {
        name: name,
        type: "date",
        className: "form-control",
        defaultValue: dateString
    });
};

SimpleDateEdit.propTypes = {
    name: require("react").PropTypes.string.isRequired,
    value: require("react").PropTypes.any
};
module.exports = SimpleDateEdit;