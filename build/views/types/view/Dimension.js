"use strict";

var React = require("react");
var pd = require("parse-dimensions");

var DimensionView = React.createClass({
    displayName: "DimensionView",

    propTypes: {
        defaultUnit: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        value: React.PropTypes.arrayOf(React.PropTypes.shape({
            _id: React.PropTypes.string.isRequired,
            height: React.PropTypes.number,
            width: React.PropTypes.number,
            unit: React.PropTypes.string
        })).isRequired
    },

    getDimension: function getDimension(item) {
        var label = item.label;
        var dimension = pd.convertDimension(item, this.props.defaultUnit);
        var unit = dimension.unit;
        return [dimension.width, unit, " x ", dimension.height, unit, label ? " (" + label + ")" : ""].join("");
    },
    renderDimension: function renderDimension(dimension) {
        return React.createElement(
            "span",
            { key: dimension._id },
            this.getDimension(dimension),
            React.createElement("br", null)
        );
    },
    render: function render() {
        var _this = this;

        return React.createElement(
            "span",
            null,
            this.props.value.map(function (dimension) {
                return _this.renderDimension(dimension);
            })
        );
    }
});

module.exports = DimensionView;