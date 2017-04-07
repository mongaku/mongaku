// @flow

const React = require("react");
const pd = require("parse-dimensions");

type DimensionType = {
    _id: string,
    height?: number,
    width?: number,
    unit?: string,
    label?: string,
};

type Props = {
    defaultUnit?: string,
    value: Array<DimensionType>,
};

const getDimension = (oldDimension, defaultUnit = "mm") => {
    const {label} = oldDimension;
    const dimension = pd.convertDimension(oldDimension, defaultUnit);
    const unit = dimension.unit;
    return [
        dimension.width,
        unit,
        " x ",
        dimension.height,
        unit,
        label ? ` (${label})` : "",
    ].join("");
};

const Dimension = ({
    dimension,
    defaultUnit,
}: {defaultUnit?: string, dimension: DimensionType}) => (
    <span>
        {getDimension(dimension, defaultUnit)}<br />
    </span>
);

const DimensionView = ({value, defaultUnit}: Props) => (
    <span>
        {value.map(dimension => (
            <Dimension
                key={dimension._id}
                dimension={dimension}
                defaultUnit={defaultUnit}
            />
        ))}
    </span>
);

module.exports = DimensionView;
