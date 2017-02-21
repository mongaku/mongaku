// @flow

const React = require("react");

type FixedStringValue = {
    id: string,
    name: string,
};

type Props = {
    value: string | Array<string>,
    values?: Array<FixedStringValue>,
    url: string | Array<string>,
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
    values,
    urlValue,
}: Props & {stringValue: string, urlValue: string}) => {
    if (!stringValue) {
        return null;
    }

    const title = getTitle(stringValue, values);

    return <a href={urlValue}>
        {title}
    </a>;
};

const Values = (props: Props & {stringValues: Array<string>}) => {
    const {stringValues, url} = props;

    return <span>
        {stringValues.map((value, i) => <span key={i}>
            <Value {...props} stringValue={value} urlValue={url[i]} />
            {stringValues.length - 1 === i ? "" : ", "}
        </span>)}
    </span>;
};

const FixedStringView = (props: Props) => {
    const {value, url} = props;

    if (Array.isArray(value) && Array.isArray(url)) {
        return <Values {...props} stringValues={value} />;
    }

    if (!Array.isArray(value) && !Array.isArray(url)) {
        return <Value {...props} stringValue={value} urlValue={url} />;
    }

    return null;
};

module.exports = FixedStringView;
