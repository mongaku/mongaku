"use strict";

const React = require("react");

const FixedStringFilter = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        placeholder: React.PropTypes.string,
        searchName: React.PropTypes.string,
        title: React.PropTypes.string.isRequired,
        value: React.PropTypes.string,
        values: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                id: React.PropTypes.string.isRequired,
                name: React.PropTypes.string.isRequired,
            })
        ),
    },

    render() {
        const searchName = this.props.searchName || this.props.name;

        return <div className="form-group">
            <label htmlFor={searchName} className="control-label">
                {this.props.title}
            </label>
            <select name={searchName} style={{width: "100%"}}
                className="form-control"
                defaultValue={this.props.value}
            >
                <option value="">{this.props.placeholder}</option>
                {this.props.values.map((type) =>
                    <option value={type.id} key={type.id}>
                        {type.name}
                    </option>
                )}
            </select>
        </div>;
    },
});

module.exports = FixedStringFilter;
