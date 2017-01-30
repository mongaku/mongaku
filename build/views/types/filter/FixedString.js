"use strict";

const React = require("react");

const FixedStringFilter = React.createClass({
    displayName: "FixedStringFilter",

    propTypes: {
        multiple: React.PropTypes.bool,
        name: React.PropTypes.string.isRequired,
        placeholder: React.PropTypes.string,
        searchName: React.PropTypes.string,
        title: React.PropTypes.string.isRequired,
        value: React.PropTypes.string,
        values: React.PropTypes.arrayOf(React.PropTypes.shape({
            id: React.PropTypes.string.isRequired,
            name: React.PropTypes.string.isRequired
        }))
    },

    render() {
        const searchName = this.props.searchName || this.props.name;

        return React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
                "label",
                { htmlFor: searchName, className: "control-label" },
                this.props.title
            ),
            React.createElement(
                "select",
                { name: searchName, style: { width: "100%" },
                    className: "form-control select2-select",
                    defaultValue: this.props.value,
                    "data-placeholder": this.props.placeholder,
                    multiple: this.props.multiple
                },
                React.createElement(
                    "option",
                    { value: "" },
                    this.props.placeholder
                ),
                this.props.values.map(type => React.createElement(
                    "option",
                    { value: type.id, key: type.id },
                    type.name
                ))
            )
        );
    }
});

module.exports = FixedStringFilter;