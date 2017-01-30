"use strict";

const React = require("react");

const NameFilter = React.createClass({
    displayName: "NameFilter",

    propTypes: {
        name: React.PropTypes.string.isRequired,
        placeholder: React.PropTypes.string,
        searchName: React.PropTypes.string,
        title: React.PropTypes.string.isRequired,
        value: React.PropTypes.string,
        values: React.PropTypes.arrayOf(React.PropTypes.string)
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
                    "data-placeholder": this.props.placeholder
                },
                React.createElement(
                    "option",
                    { value: "" },
                    this.props.placeholder
                ),
                this.props.values.map(name => React.createElement(
                    "option",
                    { value: name, key: name },
                    name
                ))
            )
        );
    }
});

module.exports = NameFilter;