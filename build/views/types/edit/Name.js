"use strict";

const React = require("react");

const NameEdit = ({
    name,
    names,
    value,
    multiple
}) => {
    let defaultValue = (value || []).map(name => name.name || name.original);

    if (!multiple) {
        defaultValue = defaultValue[0];
    }

    if (names && names.length > 0) {
        return React.createElement(
            "select",
            {
                name: name,
                className: "form-control select2-select",
                defaultValue: defaultValue,
                multiple: multiple
            },
            names.map(name => React.createElement(
                "option",
                { value: name, key: name },
                name
            ))
        );
    }

    return React.createElement("input", {
        name: name,
        type: "text",
        className: "form-control",
        defaultValue: defaultValue
    });
};

NameEdit.propTypes = {
    name: require("react").PropTypes.string.isRequired,
    names: require("react").PropTypes.arrayOf(require("react").PropTypes.string),
    value: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        name: require("react").PropTypes.string,
        original: require("react").PropTypes.string
    })),
    multiple: require("react").PropTypes.bool
};
module.exports = NameEdit;