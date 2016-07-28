"use strict";

const React = require("react");

const dateRangeType = React.PropTypes.shape({
    end: React.PropTypes.number,
    start: React.PropTypes.number,
});

const YearRangeFilter = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        placeholder: dateRangeType,
        searchName: React.PropTypes.string,
        title: React.PropTypes.string.isRequired,
        value: dateRangeType,
    },

    getDefaultProps() {
        return {
            placeholder: {},
            value: {},
        };
    },

    render() {
        const searchName = this.props.searchName || this.props.name;

        return <div className="form-group">
            <label htmlFor={`${searchName}.start`} className="control-label">
                {this.props.title}
            </label>
            <div className="form-inline">
                <input type="text" name={`${searchName}.start`}
                    defaultValue={this.props.value.start}
                    placeholder={this.props.placeholder.start}
                    className="form-control date-control"
                />
                &mdash;
                <input type="text" name={`${searchName}.end`}
                    defaultValue={this.props.value.end}
                    placeholder={this.props.placeholder.end}
                    className="form-control date-control"
                />
            </div>
        </div>;
    },
});

module.exports = YearRangeFilter;
