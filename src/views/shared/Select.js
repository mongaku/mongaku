// @flow

const React = require("react");
const ReactSelect = require("react-select");

type Props = {
    name: string,
    options: Array<{
        value: string,
        label: string,
    }>,
    value?: string | Array<string>,
    multi?: boolean,
    clearable?: boolean,
    loadOptions?: (input: string) => Promise<*>,
};

class Select extends React.Component {
    constructor(props: Props) {
        super(props);
        this.state = {
            value: props.value,
        };
    }

    state: {
        value?: string | Array<string>,
    }
    props: Props

    render() {
        const {multi, loadOptions} = this.props;
        let Selector = ReactSelect;

        if (multi && loadOptions) {
            Selector = ReactSelect.AsyncCreatable;
        } else if (multi) {
            Selector = ReactSelect.Creatable;
        } else if (loadOptions) {
            Selector = ReactSelect.Async;
        }

        return <Selector
            {...this.props}
            value={this.state.value}
            onChange={(value) => this.setState({value})}
            // NOTE(jersig): Setting instanceId due to this issue:
            // https://github.com/JedWatson/react-select/issues/1325
            instanceId={this.props.name}
        />;
    }
}

module.exports = Select;
