const React = require("react");

const SimpleDateEdit = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        value: React.PropTypes.instanceOf(Date),
    },

    render() {
        let dateString = "";

        if (this.props.value) {
            dateString = this.props.value.toISOString()
                .replace(/T.*$/, "");
        }

        return <input
            name={this.props.name}
            type="date"
            className="form-control"
            defaultValue={dateString}
        />;
    },
});

module.exports = SimpleDateEdit;
