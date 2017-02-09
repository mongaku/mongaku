// @flow

const React = require("react");

type Props = {
    placeholder?: string,
    searchName: string,
    title: string,
    value?: string,
    values: Array<string>,
};

const NameFilter = ({
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
    >
        <option value="">{placeholder}</option>
        {values.map((name) =>
            <option value={name} key={name}>
                {name}
            </option>
        )}
    </select>
</div>;

module.exports = NameFilter;
