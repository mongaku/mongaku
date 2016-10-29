"use strict";

const React = require("react");

const FixedStringEdit = React.createClass({
    propTypes: {
        hidden: React.PropTypes.bool,
        multiline: React.PropTypes.bool,
        multiple: React.PropTypes.bool,
        name: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
        value: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.arrayOf(
                React.PropTypes.string
            ),
        ]).isRequired,
        values: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                id: React.PropTypes.string.isRequired,
                name: React.PropTypes.string.isRequired,
            })
        ),
    },

    getValue(value) {
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
        const defaultValue = this.getValue(value);

        if (this.props.multiline) {
            return <textarea
                name={this.props.name}
                className="form-control"
                defaultValue={defaultValue}
            />;
        }

        return <input
            name={this.props.name}
            type={this.props.hidden ? "password" : "text"}
            className="form-control"
            defaultValue={defaultValue}
            data-hidden={this.props.hidden}
        />;
    },

    renderValues(values) {
        if (this.props.values && this.props.values.length > 0) {
            return <select
                name={this.props.name}
                className="form-control select2-select"
                defaultValue={values.map((value) => this.getValue(value))}
                multiple={this.props.multiple}
            >
                {this.props.values.map((value) =>
                    <option value={value.id} key={value.id}>
                        {value.name}
                    </option>
                )}
            </select>;
        }

        return <span>
            {values.map((value, i) => <span key={i}>
                {this.renderValue(value)}
                {values.length - 1 === i ? "" : ", "}
            </span>)}
        </span>;
    },

    render() {
        return Array.isArray(this.props.value) ?
            this.renderValues(this.props.value) :
            this.renderValue(this.props.value);
    },
});

module.exports = FixedStringEdit;
