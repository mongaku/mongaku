"use strict";

var React = require("react");

var YearRangeEdit = React.createClass({
    displayName: "YearRangeEdit",

    propTypes: {
        name: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
        value: React.PropTypes.arrayOf(React.PropTypes.shape({
            original: React.PropTypes.string.isRequired
        }))
    },

    render: function render() {
        var value = this.props.value && this.props.value[0] && this.props.value[0].original;

        return React.createElement("input", {
            name: this.props.name,
            type: "text",
            className: "form-control",
            defaultValue: value
        });
    }
});

module.exports = YearRangeEdit;