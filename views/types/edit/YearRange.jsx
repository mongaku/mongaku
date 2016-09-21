"use strict";

const React = require("react");

const YearRangeEdit = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
        value: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                original: React.PropTypes.string.isRequired,
            })
        ),
    },

    render() {
        const value = this.props.value &&
            this.props.value[0] &&
            this.props.value[0].original;

        return <input
            name={this.props.name}
            type="text"
            className="form-control"
            defaultValue={value}
        />;
    },
});

module.exports = YearRangeEdit;
