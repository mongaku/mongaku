"use strict";

const React = require("react");

const { childContextTypes } = require("../../Wrapper.js");

const NameView = React.createClass({
    displayName: "NameView",

    propTypes: {
        name: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
        value: React.PropTypes.arrayOf(React.PropTypes.shape({
            _id: React.PropTypes.string.isRequired,
            name: React.PropTypes.string.isRequired,
            pseudonym: React.PropTypes.string
        })).isRequired
    },

    contextTypes: childContextTypes,

    renderPseudonym(name) {
        if (!name.pseudoynm || name.name === name.pseudoynm) {
            return null;
        }

        const { searchURL } = this.context;
        const pseudoURL = searchURL({
            filter: name.pseudonym,
            type: this.props.type
        });

        return React.createElement(
            "span",
            null,
            " ",
            "(",
            React.createElement(
                "a",
                { href: pseudoURL },
                name.pseudonym
            ),
            ")"
        );
    },

    renderName(name) {
        const { searchURL } = this.context;
        const url = searchURL({
            [this.props.name]: name.name,
            type: this.props.type
        });

        return React.createElement(
            "span",
            { key: name._id },
            React.createElement(
                "a",
                { href: url },
                name.name
            ),
            this.renderPseudonym(name)
        );
    },

    render() {
        return React.createElement(
            "div",
            null,
            this.props.value.map(name => this.renderName(name))
        );
    }
});

module.exports = NameView;