// @flow

const React = require("react");

import type {Context} from "../../types.js";
const {childContextTypes} = require("../../Wrapper.js");

type FixedStringValue = {
    id: string,
    name: string,
};

type Props = {
    name: string,
    type: string,
    value: string | Array<string>,
    values?: Array<FixedStringValue>,
};

const getTitle = (value: string, values?: Array<FixedStringValue>): string => {
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
    stringValue,
    name,
    type,
    values,
}: Props & {stringValue: string}, {searchURL}: Context) => {
    if (!stringValue) {
        return null;
    }

    const title = getTitle(stringValue, values);
    const url = searchURL({
        [name]: stringValue,
        type,
    });

    return <a href={url}>
        {title}
    </a>;
};

Value.contextType = childContextTypes;

const Values = (props: Props & {stringValues: Array<string>}) => {
    const {stringValues} = props;

    return <span>
        {stringValues.map((value, i) => <span key={i}>
            <Value {...props} stringValue={value} />
            {stringValues.length - 1 === i ? "" : ", "}
        </span>)}
    </span>;
};

const FixedStringView = (props: Props) => {
    const {value} = props;
    return Array.isArray(value) ?
        <Values {...props} stringValues={value} /> :
        <Value {...props} stringValue={value} />;
};

module.exports = FixedStringView;
