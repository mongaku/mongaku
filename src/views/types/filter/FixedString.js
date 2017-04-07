// @flow

const React = require("react");

const Select = require("../../shared/Select.js");

type Props = {
    multiple?: boolean,
    placeholder?: string,
    searchName: string,
    title: string,
    value?: string | Array<string>,
    values: Array<{
        id: string,
        name: string,
    }>,
};

const FixedStringFilter = ({
    multiple,
    placeholder,
    searchName,
    title,
    value,
    values,
}: Props) => (
    <div className="form-group">
        <label htmlFor={searchName} className="control-label">
            {title}
        </label>
        <Select
            name={searchName}
            value={value}
            options={values.map(type => ({
                value: type.id,
                label: type.name,
            }))}
            placeholder={placeholder}
            multi={multiple}
            clearable={true}
        />
    </div>
);

module.exports = FixedStringFilter;
