// @flow

const React = require("react");

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
        .map((name) => name.name || name.original);

    if (!multiple) {
        defaultValue = defaultValue[0];
    }

    if (names && names.length > 0) {
        return <select
            name={name}
            className="form-control select2-select"
            defaultValue={defaultValue}
            multiple={multiple}
        >
            {names.map((name) =>
                <option value={name} key={name}>
                    {name}
                </option>
            )}
        </select>;
    }

    return <input
        name={name}
        type="text"
        className="form-control"
        defaultValue={defaultValue}
    />;
};

module.exports = NameEdit;
