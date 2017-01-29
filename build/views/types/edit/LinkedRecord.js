"use strict";

var React = require("react");

var valueType = React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired
});

var LinkedRecordEdit = React.createClass({
    displayName: "LinkedRecordEdit",

    propTypes: {
        multiple: React.PropTypes.bool,
        name: React.PropTypes.string.isRequired,
        placeholder: React.PropTypes.string,
        recordType: React.PropTypes.string.isRequired,
        value: React.PropTypes.oneOfType([valueType, React.PropTypes.arrayOf(valueType)])
    },

    render: function render() {
        var value = this.props.value;
        var defaultValue = Array.isArray(value) ? value.map(function (value) {
            return value.id;
        }) : value && value.id;
        var values = Array.isArray(value) ? value : value ? [value] : [];

        return React.createElement(
            "select",
            {
                name: this.props.name,
                className: "form-control select2-remote",
                defaultValue: defaultValue,
                multiple: this.props.multiple,
                "data-record": this.props.recordType,
                "data-placeholder": this.props.placeholder
            },
            values.map(function (value) {
                return React.createElement(
                    "option",
                    { value: value.id, key: value.id },
                    value.title
                );
            })
        );
    }
});

module.exports = LinkedRecordEdit;