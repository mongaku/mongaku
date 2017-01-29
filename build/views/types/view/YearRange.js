"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = require("react");

var getDate = function getDate(item) {
    if (item.original) {
        return item.original;
    }

    if (item.start || item.end) {
        return (item.circa ? "ca. " : "") + item.start + (item.end && item.end !== item.start ? "-" + item.end : "");
    }

    return "";
};

var dateRangeType = React.PropTypes.shape({
    end: React.PropTypes.number,
    start: React.PropTypes.number
});

var YearRangeView = React.createClass({
    displayName: "YearRangeView",

    propTypes: {
        name: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
        value: React.PropTypes.arrayOf(dateRangeType).isRequired
    },

    renderDate: function renderDate(date) {
        var _searchURL;

        var searchURL = require("../../../logic/shared/search-url");

        var url = searchURL(this.props, (_searchURL = {}, _defineProperty(_searchURL, this.props.name, {
            start: date.start,
            end: date.end
        }), _defineProperty(_searchURL, "type", this.props.type), _searchURL));

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
    render: function render() {
        var _this = this;

        return React.createElement(
            "span",
            null,
            this.props.value.map(function (date) {
                return _this.renderDate(date);
            })
        );
    }
});

module.exports = YearRangeView;