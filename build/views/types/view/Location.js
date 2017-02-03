"use strict";

const React = require("react");

const { childContextTypes } = require("../../Wrapper.js");

const LocationView = React.createClass({
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

    contextTypes: childContextTypes,

    renderName(location) {
        const { searchURL } = this.context;
        const url = searchURL({
            [this.props.name]: location.name,
            type: this.props.type
        });

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

    render() {
        return React.createElement(
            "div",
            null,
            this.props.value.map(location => React.createElement(
                "span",
                { key: location._id },
                location.name && this.renderName(location),
                location.city && React.createElement(
                    "span",
                    null,
                    location.city,
                    React.createElement("br", null)
                )
            ))
        );
    }
});

module.exports = LocationView;