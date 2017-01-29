"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = require("react");

var LocationView = React.createClass({
    displayName: "LocationView",

    propTypes: {
        name: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
        value: React.PropTypes.arrayOf(React.PropTypes.shape({
            _id: React.PropTypes.string.isRequired,
            city: React.PropTypes.string,
            name: React.PropTypes.string
        })).isRequired
    },

    renderName: function renderName(location) {
        var _searchURL;

        var searchURL = require("../../../logic/shared/search-url");
        var url = searchURL(this.props, (_searchURL = {}, _defineProperty(_searchURL, this.props.name, location.name), _defineProperty(_searchURL, "type", this.props.type), _searchURL));

        return React.createElement(
            "span",
            null,
            React.createElement(
                "a",
                { href: url },
                location.name
            ),
            React.createElement("br", null)
        );
    },
    render: function render() {
        var _this = this;

        return React.createElement(
            "div",
            null,
            this.props.value.map(function (location) {
                return React.createElement(
                    "span",
                    { key: location._id },
                    location.name && _this.renderName(location),
                    location.city && React.createElement(
                        "span",
                        null,
                        location.city,
                        React.createElement("br", null)
                    )
                );
            })
        );
    }
});

module.exports = LocationView;