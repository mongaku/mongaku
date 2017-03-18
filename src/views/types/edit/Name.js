// @flow

const React = require("react");

const Select = require("../../shared/Select.js");

const NameEdit = ({
    name,
    names,
    value,
    multiple,
}: {
    name: string,
    names?: Array<string>,
    value?: Array<{
        name?: string,
        original?: string,
    }>,
    multiple?: boolean,
}) => {
    let defaultValue = (value || [])
        .map((name) => name.name || name.original || "");

    if (!multiple) {
        defaultValue = defaultValue[0];
    }

    if (names && names.length > 0) {
        return <Select
            name={name}
            value={defaultValue}
            multi={multiple}
            options={names.map((name) => ({
                value: name,
                label: name,
            }))}
            clearable={false}
            create={true}
        />;
    }

    return <input
        name={name}
        type="text"
        className="form-control"
        defaultValue={defaultValue}
    />;
};

module.exports = NameEdit;
