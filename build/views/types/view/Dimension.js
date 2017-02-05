"use strict";

const React = require("react");
const pd = require("parse-dimensions");

const getDimension = (oldDimension, defaultUnit = "mm") => {
    const { label } = oldDimension;
    const dimension = pd.convertDimension(oldDimension, defaultUnit);
    const unit = dimension.unit;
    return [dimension.width, unit, " x ", dimension.height, unit, label ? ` (${label})` : ""].join("");
};

const Dimension = ({
    dimension,
    defaultUnit
}) => React.createElement(
    "span",
    null,
    getDimension(dimension, defaultUnit),
    React.createElement("br", null)
);

Dimension.propTypes = {
    defaultUnit: require("react").PropTypes.string,
    dimension: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        height: require("react").PropTypes.number,
        width: require("react").PropTypes.number,
        unit: require("react").PropTypes.string,
        label: require("react").PropTypes.string
    }).isRequired
};
const DimensionView = ({ value, defaultUnit }) => React.createElement(
    "span",
    null,
    value.map(dimension => React.createElement(Dimension, {
        key: dimension._id,
        dimension: dimension,
        defaultUnit: defaultUnit
    }))
);

DimensionView.propTypes = {
    defaultUnit: require("react").PropTypes.string,
    value: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        height: require("react").PropTypes.number,
        width: require("react").PropTypes.number,
        unit: require("react").PropTypes.string,
        label: require("react").PropTypes.string
    })).isRequired
};
module.exports = DimensionView;