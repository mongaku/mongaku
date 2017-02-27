// @flow

const React = require("react");

const SimpleDateEdit = ({
    name,
    value,
}: {
    name: string,
    value?: Date | string,
}) => {
    let dateString = value || "";

    if (value instanceof Date) {
        dateString = value.toISOString();
    }

    dateString = dateString.toString().replace(/T.*$/, "");

    return <input
        name={name}
        type="date"
        className="form-control"
        defaultValue={dateString}
    />;
};

module.exports = SimpleDateEdit;
