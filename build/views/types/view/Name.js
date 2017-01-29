"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = require("react");

var NameView = React.createClass({
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

    renderPseudonym: function renderPseudonym(name) {
        if (!name.pseudoynm || name.name === name.pseudoynm) {
            return null;
        }

        var searchURL = require("../../../logic/shared/search-url");
        var pseudoURL = searchURL(this.props, {
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
    renderName: function renderName(name) {
        var _searchURL;

        var searchURL = require("../../../logic/shared/search-url");
        var url = searchURL(this.props, (_searchURL = {}, _defineProperty(_searchURL, this.props.name, name.name), _defineProperty(_searchURL, "type", this.props.type), _searchURL));

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
    render: function render() {
        var _this = this;

        return React.createElement(
            "div",
            null,
            this.props.value.map(function (name) {
                return _this.renderName(name);
            })
        );
    }
});

module.exports = NameView;