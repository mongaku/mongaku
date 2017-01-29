"use strict";

var React = require("react");

var SimpleDateEdit = React.createClass({
    displayName: "SimpleDateEdit",

    propTypes: {
        name: React.PropTypes.string.isRequired,
        value: React.PropTypes.instanceOf(Date)
    },

    render: function render() {
        var dateString = "";

        if (this.props.value) {
            dateString = this.props.value.toISOString().replace(/T.*$/, "");
        }

        return React.createElement("input", {
            name: this.props.name,
            type: "date",
            className: "form-control",
            defaultValue: dateString
        });
    }
});

module.exports = SimpleDateEdit;