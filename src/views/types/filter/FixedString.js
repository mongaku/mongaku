// @flow

const React = require("react");

type Props = {
    multiple?: boolean,
    placeholder?: string,
    searchName: string,
    title: string,
    value?: string,
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
}: Props) => <div className="form-group">
    <label htmlFor={searchName} className="control-label">
        {title}
    </label>
    <select name={searchName} style={{width: "100%"}}
        className="form-control select2-select"
        defaultValue={value}
        data-placeholder={placeholder}
        multiple={multiple}
    >
        <option value="">{placeholder}</option>
        {values.map((type) =>
            <option value={type.id} key={type.id}>
                {type.name}
            </option>
        )}
    </select>
</div>;

module.exports = FixedStringFilter;
