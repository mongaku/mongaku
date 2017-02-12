"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const React = require("react");

const { searchURL } = require("../../utils.js");

var babelPluginFlowReactPropTypes_proptype_Context = require("../../types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

const { childContextTypes } = require("../../Wrapper.js");

const Location = ({
    name,
    type,
    location
}, { lang }) => {
    const url = searchURL(lang, {
        [name]: location.name,
        type
    });

    return React.createElement(
        "span",
        null,
        location.name && React.createElement(
            "span",
            null,
            React.createElement(
                "a",
                { href: url },
                location.name
            ),
            React.createElement("br", null)
        ),
        location.city && React.createElement(
            "span",
            null,
            location.city,
            React.createElement("br", null)
        )
    );
};

Location.contextTypes = childContextTypes;

const LocationView = props => {
    const { value } = props;

    return React.createElement(
        "div",
        null,
        value.map(location => React.createElement(Location, _extends({}, props, {
            key: location._id,
            location: location
        })))
    );
};

LocationView.propTypes = {
    name: require("react").PropTypes.string.isRequired,
    type: require("react").PropTypes.string.isRequired,
    value: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        city: require("react").PropTypes.string,
        name: require("react").PropTypes.string
    })).isRequired
};
module.exports = LocationView;