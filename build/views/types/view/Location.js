"use strict";

const React = require("react");

const Location = ({ value, url }) => {
    return React.createElement(
        "span",
        null,
        value.name && React.createElement(
            "span",
            null,
            React.createElement(
                "a",
                { href: url },
                value.name
            ),
            React.createElement("br", null)
        ),
        value.city && React.createElement(
            "span",
            null,
            value.city,
            React.createElement("br", null)
        )
    );
};

Location.propTypes = {
    value: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        city: require("react").PropTypes.string,
        name: require("react").PropTypes.string
    }).isRequired,
    url: require("react").PropTypes.string.isRequired
};
const LocationView = ({ value, url }) => React.createElement(
    "div",
    null,
    value.map((location, i) => React.createElement(Location, {
        key: location._id,
        value: location,
        url: url[i]
    }))
);

LocationView.propTypes = {
    value: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        city: require("react").PropTypes.string,
        name: require("react").PropTypes.string
    })).isRequired,
    url: require("react").PropTypes.arrayOf(require("react").PropTypes.string).isRequired
};
module.exports = LocationView;