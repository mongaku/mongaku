"use strict";

const React = require("react");

const { childContextTypes } = require("../../Wrapper.js");

const FixedStringView = React.createClass({
    displayName: "FixedStringView",

    propTypes: {
        name: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
        value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)]).isRequired,
        values: React.PropTypes.arrayOf(React.PropTypes.shape({
            id: React.PropTypes.string.isRequired,
            name: React.PropTypes.string.isRequired
        }))
    },

    contextTypes: childContextTypes,

    getTitle(value) {
        if (!this.props.values) {
            return value;
        }

        for (const map of this.props.values) {
            if (map.id === value) {
                return map.name;
            }
        }

        return value;
    },

    renderValue(value) {
        if (!value) {
            return null;
        }

        const { searchURL } = this.context;
        const title = this.getTitle(value);
        const url = searchURL({
            [this.props.name]: value,
            type: this.props.type
        });

        return React.createElement(
            "a",
            { href: url },
            title
        );
    },

    renderValues(values) {
        return React.createElement(
            "span",
            null,
            values.map((value, i) => React.createElement(
                "span",
                { key: i },
                this.renderValue(value),
                values.length - 1 === i ? "" : ", "
            ))
        );
    },

    render() {
        return Array.isArray(this.props.value) ? this.renderValues(this.props.value) : this.renderValue(this.props.value);
    }
});

module.exports = FixedStringView;