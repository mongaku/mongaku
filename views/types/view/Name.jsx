"use strict";

const React = require("react");

const NameView = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
        value: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                _id: React.PropTypes.string.isRequired,
                name: React.PropTypes.string.isRequired,
                pseudonym: React.PropTypes.string,
            })
        ).isRequired,
    },

    renderPseudonym(name) {
        if (!name.pseudoynm || name.name === name.pseudoynm) {
            return null;
        }

        const searchURL = require("../../../logic/shared/search-url");
        const pseudoURL = searchURL(this.props, {
            filter: name.pseudonym,
            type: this.props.type,
        });

        return <span>
            {" "}(<a href={pseudoURL}>{name.pseudonym}</a>)
        </span>;
    },

    renderName(name) {
        const searchURL = require("../../../logic/shared/search-url");
        const url = searchURL(this.props, {
            [this.props.name]: name.name,
            type: this.props.type,
        });

        return <span key={name._id}>
            <a href={url}>{name.name}</a>
            {this.renderPseudonym(name)}
        </span>;
    },

    render() {
        return <div>
            {this.props.value.map((name) => this.renderName(name))}
        </div>;
    },
});

module.exports = NameView;
