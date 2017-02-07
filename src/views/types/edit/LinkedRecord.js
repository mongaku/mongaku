// @flow

const React = require("react");

type Link = {
    id: string,
    title: string,
};

const LinkedRecordEdit = ({
    name,
    recordType,
    value,
    placeholder,
    multiple,
}: {
    name: string,
    recordType: string,
    value?: Link | Array<Link>,
    placeholder?: string,
    multiple?: boolean,
}) => {
    const defaultValue = Array.isArray(value) ?
        value.map((value) => value.id) :
        value && value.id;
    const values = Array.isArray(value) ?
        value :
        value ? [value] : [];

    return <select
        name={name}
        className="form-control select2-remote"
        defaultValue={defaultValue}
        multiple={multiple}
        data-record={recordType}
        data-placeholder={placeholder}
    >
        {values.map((value) =>
            <option value={value.id} key={value.id}>
                {value.title}
            </option>
        )}
    </select>;
};

module.exports = LinkedRecordEdit;
