const React = require("react");

const LocationFilter = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        placeholder: React.PropTypes.string,
        searchName: React.PropTypes.string,
        title: React.PropTypes.string.isRequired,
        value: React.PropTypes.string,
    },

    render() {
        const searchName = this.props.searchName || this.props.name;

        return <div className="form-group">
            <label htmlFor={searchName} className="control-label">
                {this.props.title}
            </label>
            <input type="text" name={searchName}
                placeholder={this.props.placeholder}
                defaultValue={this.props.value}
                className="form-control"
            />
        </div>;
    },
});

module.exports = LocationFilter;
