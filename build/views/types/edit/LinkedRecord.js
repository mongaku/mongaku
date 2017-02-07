"use strict";

const React = require("react");

const LinkedRecordEdit = ({
    name,
    recordType,
    value,
    placeholder,
    multiple
}) => {
    const defaultValue = Array.isArray(value) ? value.map(value => value.id) : value && value.id;
    const values = Array.isArray(value) ? value : value ? [value] : [];

    return React.createElement(
        "select",
        {
            name: name,
            className: "form-control select2-remote",
            defaultValue: defaultValue,
            multiple: multiple,
            "data-record": recordType,
            "data-placeholder": placeholder
        },
        values.map(value => React.createElement(
            "option",
            { value: value.id, key: value.id },
            value.title
        ))
    );
};

LinkedRecordEdit.propTypes = {
    name: require("react").PropTypes.string.isRequired,
    recordType: require("react").PropTypes.string.isRequired,
    value: require("react").PropTypes.oneOfType([require("react").PropTypes.shape({
        id: require("react").PropTypes.string.isRequired,
        title: require("react").PropTypes.string.isRequired
    }), require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        id: require("react").PropTypes.string.isRequired,
        title: require("react").PropTypes.string.isRequired
    }))]),
    placeholder: require("react").PropTypes.string,
    multiple: require("react").PropTypes.bool
};
module.exports = LinkedRecordEdit;