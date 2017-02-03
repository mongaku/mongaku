"use strict";

const React = require("react");
const pd = require("parse-dimensions");

const DimensionView = React.createClass({
    displayName: "DimensionView",

    propTypes: {
        defaultUnit: React.PropTypes.string,
        name: React.PropTypes.string.isRequired,
        value: React.PropTypes.arrayOf(React.PropTypes.shape({
            _id: React.PropTypes.string.isRequired,
            height: React.PropTypes.number,
            width: React.PropTypes.number,
            unit: React.PropTypes.string
        })).isRequired
    },

    defaultProps: () => {
        return {
            defaultUnit: "mm"
        };
    },

    getDimension(item) {
        const label = item.label;
        const dimension = pd.convertDimension(item, this.props.defaultUnit);
        const unit = dimension.unit;
        return [dimension.width, unit, " x ", dimension.height, unit, label ? ` (${label})` : ""].join("");
    },

    renderDimension(dimension) {
        return React.createElement(
            "span",
            { key: dimension._id },
            this.getDimension(dimension),
            React.createElement("br", null)
        );
    },

    render() {
        return React.createElement(
            "span",
            null,
            this.props.value.map(dimension => this.renderDimension(dimension))
        );
    }
});

module.exports = DimensionView;