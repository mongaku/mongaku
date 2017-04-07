// @flow

const React = require("react");

const YearRangeEdit = ({
    name,
    value,
}: {
    name: string,
    value?: Array<{original?: string}>,
}) => {
    const defaultValue = value && value[0] && value[0].original;

    return (
        <input
            name={name}
            type="text"
            className="form-control"
            defaultValue={defaultValue}
        />
    );
};

module.exports = YearRangeEdit;
