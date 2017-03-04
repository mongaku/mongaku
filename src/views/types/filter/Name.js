// @flow

const React = require("react");

const Select = require("../../shared/Select.js");

type Props = {
    multiple?: boolean,
    placeholder?: string,
    searchName: string,
    title: string,
    value?: string,
    values: Array<string>,
};

const NameFilter = ({
    multiple,
    placeholder,
    searchName,
    title,
    value,
    values,
}: Props) => <div className="form-group">
    <label htmlFor={searchName} className="control-label">
        {title}
    </label>
    <Select
        name={searchName}
        value={value}
        options={values.map((name) => ({
            value: name,
            label: name,
        }))}
        placeholder={placeholder}
        multi={multiple}
    />
</div>;

module.exports = NameFilter;
