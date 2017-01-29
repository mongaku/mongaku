const React = require("react");

const valueType = React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
});

const LinkedRecordEdit = React.createClass({
    propTypes: {
        multiple: React.PropTypes.bool,
        name: React.PropTypes.string.isRequired,
        placeholder: React.PropTypes.string,
        recordType: React.PropTypes.string.isRequired,
        value: React.PropTypes.oneOfType([
            valueType,
            React.PropTypes.arrayOf(valueType),
        ]),
    },

    render() {
        const value = this.props.value;
        const defaultValue = Array.isArray(value) ?
            value.map((value) => value.id) :
            value && value.id;
        const values = Array.isArray(value) ?
            value :
            value ? [value] : [];

        return <select
            name={this.props.name}
            className="form-control select2-remote"
            defaultValue={defaultValue}
            multiple={this.props.multiple}
            data-record={this.props.recordType}
            data-placeholder={this.props.placeholder}
        >
            {values.map((value) =>
                <option value={value.id} key={value.id}>
                    {value.title}
                </option>
            )}
        </select>;
    },
});

module.exports = LinkedRecordEdit;
