"use strict";

const React = require("react");

const getDate = (item) => {
    if (item.original) {
        return item.original;
    }

    if (item.start || item.end) {
        return (item.circa ? "ca. " : "") +
            item.start + (item.end && item.end !== item.start ?
            `-${item.end}` : "");
    }

    return "";
};

const dateRangeType = React.PropTypes.shape({
    end: React.PropTypes.number,
    start: React.PropTypes.number,
});

const YearRangeView = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        value: React.PropTypes.arrayOf(
            dateRangeType
        ).isRequired,
    },

    renderDate(date) {
        const searchURL = require("../../../logic/shared/search-url");

        return <span key={date._id}>
            <a
                href={searchURL(this.props, {
                    [this.props.name]: {
                        start: date.start,
                        end: date.end,
                    },
                })}
            >
                {getDate(date)}
            </a><br/>
        </span>;
    },

    render() {
        return <span>
            {this.props.value.map((date) => this.renderDate(date))}
        </span>;
    },
});

module.exports = YearRangeView;
