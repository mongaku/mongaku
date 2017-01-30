"use strict";

const React = require("react");

const dateRangeType = React.PropTypes.shape({
    end: React.PropTypes.number,
    start: React.PropTypes.number
});

const YearRangeFilter = React.createClass({
    displayName: "YearRangeFilter",

    propTypes: {
        name: React.PropTypes.string.isRequired,
        placeholder: dateRangeType,
        searchName: React.PropTypes.string,
        title: React.PropTypes.string.isRequired,
        value: dateRangeType
    },

    getDefaultProps() {
        return {
            placeholder: {},
            value: {}
        };
    },

    render() {
        const searchName = this.props.searchName || this.props.name;

        return React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
                "label",
                { htmlFor: `${searchName}.start`, className: "control-label" },
                this.props.title
            ),
            React.createElement(
                "div",
                { className: "form-inline" },
                React.createElement("input", { type: "text", name: `${searchName}.start`,
                    defaultValue: this.props.value.start,
                    placeholder: this.props.placeholder.start,
                    className: "form-control date-control"
                }),
                "\u2014",
                React.createElement("input", { type: "text", name: `${searchName}.end`,
                    defaultValue: this.props.value.end,
                    placeholder: this.props.placeholder.end,
                    className: "form-control date-control"
                })
            )
        );
    }
});

module.exports = YearRangeFilter;