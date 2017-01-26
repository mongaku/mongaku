const React = require("react");

const NameFilter = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        placeholder: React.PropTypes.string,
        searchName: React.PropTypes.string,
        title: React.PropTypes.string.isRequired,
        value: React.PropTypes.string,
        values: React.PropTypes.arrayOf(React.PropTypes.string),
    },

    render() {
        const searchName = this.props.searchName || this.props.name;

        return <div className="form-group">
            <label htmlFor={searchName} className="control-label">
                {this.props.title}
            </label>
            <select name={searchName} style={{width: "100%"}}
                className="form-control select2-select"
                defaultValue={this.props.value}
                data-placeholder={this.props.placeholder}
            >
                <option value="">{this.props.placeholder}</option>
                {this.props.values.map((name) =>
                    <option value={name} key={name}>
                        {name}
                    </option>
                )}
            </select>
        </div>;
    },
});

module.exports = NameFilter;
