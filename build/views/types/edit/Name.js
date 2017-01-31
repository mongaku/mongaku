"use strict";

const React = require("react");

const NameEdit = React.createClass({
    displayName: "NameEdit",

    propTypes: {
        multiple: React.PropTypes.bool,
        name: React.PropTypes.string.isRequired,
        names: React.PropTypes.arrayOf(React.PropTypes.string),
        type: React.PropTypes.string.isRequired,
        value: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string,
            original: React.PropTypes.string
        }))
    },

    render() {
        let value = (this.props.value || []).map(name => name.name || name.original);

        if (!this.props.multiple) {
            value = value[0];
        }

        if (this.props.names && this.props.names.length > 0) {
            return React.createElement(
                "select",
                {
                    name: this.props.name,
                    className: "form-control select2-select",
                    defaultValue: value,
                    multiple: this.props.multiple
                },
                this.props.names.map(name => React.createElement(
                    "option",
                    { value: name, key: name },
                    name
                ))
            );
        }

        return React.createElement("input", {
            name: this.props.name,
            type: "text",
            className: "form-control",
            defaultValue: value
        });
    }
});

module.exports = NameEdit;