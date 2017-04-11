// @flow

const React = require("react");

const Select = require("../../shared/Select.js");

type Link = {
    id: string,
    title: string,
};

type Props = {
    name: string,
    recordType: string,
    value?: Link | Array<Link>,
    placeholder?: string,
    multiple?: boolean,
};

class LinkedRecordEdit extends React.Component {
    props: Props;
    getOptions(input: string) {
        const {recordType} = this.props;
        const filter = encodeURIComponent(`${input || ""}*`);
        return fetch(`/${recordType}/search?format=json&filter=${filter}`, {
            credentials: "same-origin",
        })
            .then(res => res.json())
            .then((records: Array<{
                _id: string,
                getTitle: string,
            }>) => {
                return records.filter(record => record).map(({
                    _id,
                    getTitle,
                }) => ({
                    value: _id,
                    label: getTitle,
                }));
            });
    }

    render() {
        const {name, value, placeholder, multiple} = this.props;
        const defaultValue = Array.isArray(value)
            ? value.map(value => value.id)
            : value && value.id;
        const values = Array.isArray(value) ? value : value ? [value] : [];

        return (
            <Select
                name={name}
                value={defaultValue}
                options={values.map(value => ({
                    value: value.id,
                    label: value.title,
                }))}
                placeholder={placeholder}
                multi={multiple}
                autoload={false}
                cache={true}
                loadOptions={input => this.getOptions(input)}
            />
        );
    }
}

module.exports = LinkedRecordEdit;
