"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const React = require("react");

const { searchURL } = require("../../utils.js");

var babelPluginFlowReactPropTypes_proptype_Context = require("../../types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

const { childContextTypes } = require("../../Wrapper.js");

const Pseudonym = ({
    type,
    nameObject
}, { lang }) => {
    const pseudoURL = searchURL(lang, {
        filter: nameObject.pseudonym,
        type
    });

    return React.createElement(
        "span",
        null,
        " ",
        "(",
        React.createElement(
            "a",
            { href: pseudoURL },
            nameObject.pseudonym
        ),
        ")"
    );
};

Pseudonym.propTypes = {
    type: require("react").PropTypes.string.isRequired,
    nameObject: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        pseudonym: require("react").PropTypes.string
    }).isRequired
};
Pseudonym.contextTypes = childContextTypes;

const Name = ({
    name,
    type,
    nameObject
}, { lang }) => {
    const url = searchURL(lang, {
        [name]: nameObject.name,
        type
    });

    return React.createElement(
        "span",
        { key: nameObject._id },
        React.createElement(
            "a",
            { href: url },
            nameObject.name
        ),
        name.pseudoynm && name.name !== name.pseudoynm && React.createElement(Pseudonym, {
            type: type,
            nameObject: nameObject
        })
    );
};

Name.contextTypes = childContextTypes;

const NameView = props => {
    const { value } = props;
    return React.createElement(
        "div",
        null,
        value.map(name => React.createElement(Name, _extends({}, props, {
            key: name._id,
            nameObject: name
        })))
    );
};

NameView.propTypes = {
    name: require("react").PropTypes.string.isRequired,
    type: require("react").PropTypes.string.isRequired,
    value: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        pseudonym: require("react").PropTypes.string
    })).isRequired
};
module.exports = NameView;