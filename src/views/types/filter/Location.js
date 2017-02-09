// @flow

const React = require("react");

type Props = {
    placeholder?: string,
    searchName: string,
    title: string,
    value?: string,
};

const LocationFilter = ({
    placeholder,
    searchName,
    title,
    value,
}: Props) => <div className="form-group">
    <label htmlFor={searchName} className="control-label">
        {title}
    </label>
    <input
        type="text"
        name={searchName}
        placeholder={placeholder}
        defaultValue={value}
        className="form-control"
    />
</div>;

module.exports = LocationFilter;
