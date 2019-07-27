// @flow

const React = require("react");

type NameType = {
    _id: string,
    name: string,
    pseudonym?: string,
};

type Props = {
    value: Array<NameType>,
    url: Array<string>,
};

const Pseudonym = ({value}: {value: NameType}) => (
    <span> ({value.pseudonym})</span>
);

const Name = ({value, url}: {value: NameType, url: string}) => {
    return (
        <span key={value._id}>
            <a href={url}>{value.name}</a>
            {value.pseudonym !== undefined &&
                value.name !== value.pseudonym && <Pseudonym value={value} />}
        </span>
    );
};

const NameView = ({value, url}: Props) => {
    return (
        <div>
            {value.map((name, i) => (
                <Name key={name._id} value={name} url={url[i]} />
            ))}
        </div>
    );
};

module.exports = NameView;
