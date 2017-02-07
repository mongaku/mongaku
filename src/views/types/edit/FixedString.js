// @flow

const React = require("react");

type ValueType = {
    id: string,
    name: string,
};

type Props = {
    name: string,
    multiline?: boolean,
    value: string | Array<string>,
    values?: Array<ValueType>,
    multiple?: boolean,
};

const getValue = (value: string, values?: Array<ValueType>): string => {
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
}: Props & {stringValue: string}) => {
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

const Values = (props: Props & {stringValues: Array<string>}) => {
    const {stringValues} = props;

    return <span>
        {stringValues.map((value, i) => <span key={i}>
            <Value {...props} stringValue={value} />
            {stringValues.length - 1 === i ? "" : ", "}
        </span>)}
    </span>;
};

const FixedStringEdit = (props: Props) => {
    const {
        name,
        value,
        values,
        multiple,
    } = props;

    if (values && Array.isArray(values) && values.length > 0) {
        const formValues = Array.isArray(value) ?
            value.map((value) => ({
                id: value,
                name: getValue(value, values),
            })) : [{
                id: value,
                name: getValue(value, values),
            }];

        return <select
            name={name}
            className="form-control select2-select"
            defaultValue={values}
            multiple={multiple}
        >
            {formValues.map((value) =>
                <option value={value.id} key={value.id}>
                    {value.name}
                </option>
            )}
        </select>;
    }

    return Array.isArray(value) ?
        <Values {...props} stringValues={value} /> :
        <Value {...props} stringValue={value} />;
};

module.exports = FixedStringEdit;
