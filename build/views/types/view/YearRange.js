"use strict";

const React = require("react");

const { childContextTypes } = require("../../Wrapper.js");

const getDate = item => {
    if (item.original) {
        return item.original;
    }

    if (item.start || item.end) {
        return (item.circa ? "ca. " : "") + item.start + (item.end && item.end !== item.start ? `-${item.end}` : "");
    }

    return "";
};

const dateRangeType = React.PropTypes.shape({
    end: React.PropTypes.number,
    start: React.PropTypes.number
});

const YearRangeView = React.createClass({
    displayName: "YearRangeView",

    propTypes: {
        name: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
        value: React.PropTypes.arrayOf(dateRangeType).isRequired
    },

    contextTypes: childContextTypes,

    renderDate(date) {
        const { searchURL } = this.context;

        const url = searchURL({
            [this.props.name]: {
                start: date.start,
                end: date.end
            },
            type: this.props.type
        });

        return React.createElement(
            "span",
            { key: date._id },
            React.createElement(
                "a",
                { href: url },
                getDate(date)
            ),
            React.createElement("br", null)
        );
    },

    render() {
        return React.createElement(
            "span",
            null,
            this.props.value.map(date => this.renderDate(date))
        );
    }
});

module.exports = YearRangeView;