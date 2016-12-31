"use strict";

const React = require("react");

const FixedStringEdit = React.createClass({
    propTypes: {
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
            type="text"
            className="form-control"
            defaultValue={defaultValue}
        />;
    },

    renderValues(values) {
        return <span>
            {values.map((value, i) => <span key={i}>
                {this.renderValue(value)}
                {values.length - 1 === i ? "" : ", "}
            </span>)}
        </span>;
    },

    render() {
        if (this.props.values && this.props.values.length > 0) {
            const values = Array.isArray(this.props.value) ?
                this.props.value.map((value) => this.getValue(value)) :
                this.getValue(this.props.value);

            return <select
                name={this.props.name}
                className="form-control select2-select"
                defaultValue={values}
                multiple={this.props.multiple}
            >
                {this.props.values.map((value) =>
                    <option value={value.id} key={value.id}>
                        {value.name}
                    </option>
                )}
            </select>;
        }

        return Array.isArray(this.props.value) ?
            this.renderValues(this.props.value) :
            this.renderValue(this.props.value);
    },
});

module.exports = FixedStringEdit;
