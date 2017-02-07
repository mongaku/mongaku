// @flow

const React = require("react");

const SimpleDateEdit = ({
    name,
    value,
}: {
    name: string,
    value?: Date,
}) => {
    let dateString = "";

    if (value) {
        dateString = value.toISOString().replace(/T.*$/, "");
    }

    return <input
        name={name}
        type="date"
        className="form-control"
        defaultValue={dateString}
    />;
};

module.exports = SimpleDateEdit;
