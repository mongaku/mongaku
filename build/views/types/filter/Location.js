"use strict";

const React = require("react");

const LocationFilter = React.createClass({
    displayName: "LocationFilter",

    propTypes: {
        name: React.PropTypes.string.isRequired,
        placeholder: React.PropTypes.string,
        searchName: React.PropTypes.string,
        title: React.PropTypes.string.isRequired,
        value: React.PropTypes.string
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
            React.createElement("input", { type: "text", name: searchName,
                placeholder: this.props.placeholder,
                defaultValue: this.props.value,
                className: "form-control"
            })
        );
    }
});

module.exports = LocationFilter;