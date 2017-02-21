"use strict";

const React = require("react");

const getDate = date => {
    if (date.original) {
        return date.original;
    }

    if (date.start || date.end) {
        // TODO(jeresig): Handle "ca. " for non-English locales
        return (date.circa ? "ca. " : "") + date.start + (date.end && date.end !== date.start ? `-${date.end}` : "");
    }

    return "";
};

const YearRange = ({ date, url }) => {
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
};

YearRange.propTypes = {
    date: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        original: require("react").PropTypes.string,
        circa: require("react").PropTypes.bool,
        start: require("react").PropTypes.number.isRequired,
        end: require("react").PropTypes.number.isRequired
    }).isRequired,
    url: require("react").PropTypes.string.isRequired
};
const YearRangeView = ({ value, url }) => {
    return React.createElement(
        "span",
        null,
        value.map((date, i) => React.createElement(YearRange, {
            key: date._id,
            date: date,
            url: url[i]
        }))
    );
};

YearRangeView.propTypes = {
    value: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        original: require("react").PropTypes.string,
        circa: require("react").PropTypes.bool,
        start: require("react").PropTypes.number.isRequired,
        end: require("react").PropTypes.number.isRequired
    })).isRequired,
    url: require("react").PropTypes.arrayOf(require("react").PropTypes.string).isRequired
};
module.exports = YearRangeView;