const React = require("react");
const pd = require("parse-dimensions");

const DimensionView = React.createClass({
    propTypes: {
        defaultUnit: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        value: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                _id: React.PropTypes.string.isRequired,
                height: React.PropTypes.number,
                width: React.PropTypes.number,
                unit: React.PropTypes.string,
            })
        ).isRequired,
    },

    getDimension(item) {
        const label = item.label;
        const dimension = pd.convertDimension(item, this.props.defaultUnit);
        const unit = dimension.unit;
        return [dimension.width, unit, " x ", dimension.height, unit,
            label ? ` (${label})` : ""].join("");
    },

    renderDimension(dimension) {
        return <span key={dimension._id}>
            {this.getDimension(dimension)}<br/>
        </span>;
    },

    render() {
        return <span>
            {this.props.value.map((dimension) =>
                this.renderDimension(dimension))}
        </span>;
    },
});

module.exports = DimensionView;
