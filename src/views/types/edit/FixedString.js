// @flow

const React = require("react");

const Select = require("../../shared/Select.js");

type ValueType = {
    id: string,
    name: string,
};

type Props = {
    name: string,
    multiline?: boolean,
    value?: string | Array<string>,
    values?: Array<ValueType>,
    multiple?: boolean,
};

const getValue = (value?: string, values?: Array<ValueType>): string => {
    if (!value) {
        return "";
    }

    if (!values) {
        return value;
    }

    for (const map of values) {
        if (map.id === value) {
            return map.name;
        }
    }

    return value;
};

const Value = ({
    name,
    stringValue,
    values,
    multiline,
}: Props & {stringValue?: string}) => {
    const defaultValue = getValue(stringValue, values);

    if (multiline) {
        return <textarea
            name={name}
            className="form-control"
            defaultValue={defaultValue}
        />;
    }

    return <input
        name={name}
        type="text"
        className="form-control"
        defaultValue={defaultValue}
    />;
};

const FixedStringEdit = (props: Props) => {
    const {name, value, values, multiple} = props;

    // If we have values to choose from then we render a select
    if (Array.isArray(values)) {
        return <Select
            name={name}
            value={value}
            multi={multiple}
            options={values && values.map((value) => ({
                value: value.id,
                label: value.name,
            }))}
            clearable={multiple}
            create={true}
        />;

    // If we're expecting multiple input values
    } else if (multiple || Array.isArray(value)) {
        // TODO(jeresig): Support inputting multiple values without a select
        return null;
    }

    return <Value {...props} stringValue={value} />;
};

module.exports = FixedStringEdit;
