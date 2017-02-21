"use strict";

const React = require("react");

const Pseudonym = ({ value }) => React.createElement(
    "span",
    null,
    " ",
    "(",
    value.pseudonym,
    ")"
);

Pseudonym.propTypes = {
    value: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        pseudonym: require("react").PropTypes.string
    }).isRequired
};
const Name = ({ value, url }) => {
    return React.createElement(
        "span",
        { key: value._id },
        React.createElement(
            "a",
            { href: url },
            value.name
        ),
        value.pseudoynm && value.name !== value.pseudoynm && React.createElement(Pseudonym, { value: value })
    );
};

Name.propTypes = {
    value: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        pseudonym: require("react").PropTypes.string
    }).isRequired,
    url: require("react").PropTypes.string.isRequired
};
const NameView = ({ value, url }) => {
    return React.createElement(
        "div",
        null,
        value.map((name, i) => React.createElement(Name, {
            key: name._id,
            value: name,
            url: url[i]
        }))
    );
};

NameView.propTypes = {
    value: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        name: require("react").PropTypes.string.isRequired,
        pseudonym: require("react").PropTypes.string
    })).isRequired,
    url: require("react").PropTypes.arrayOf(require("react").PropTypes.string).isRequired
};
module.exports = NameView;