// @flow

const React = require("react");

import type {Context} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

type Props = {|
    success?: string,
    error?: string,
|};

const AddSources = (props, {gettext, URL, options}: Context) => {
    const types = Object.keys(options.types);
    const converters = Object.keys(options.converters || {default: true});
    return (
        <div className="panel panel-default">
            <div className="panel-heading">
                <h3 className="panel-title">
                    {gettext("Bulk Add or Update Sources")}
                </h3>
            </div>
            <div className="panel-body">
                <p>
                    {gettext(
                        "Paste in a CSV list of ids, full names, short names, and URLs separated by endlines, for example:",
                    )}
                </p>
                <pre>
                    "id1","Full Name1","Short1","URL1"
                    <br />
                    "id2","Full Name2","Short2","URL2"
                    <br />
                    ...
                </pre>
                <form action={URL("/admin/add-sources")} method="POST">
                    <div className="form-group">
                        <label htmlFor="sources">
                            {gettext(
                                "Source IDs, Full Names, Short Names, and URLs (CSV, required)",
                            )}
                        </label>
                        <textarea
                            id="sources"
                            name="sources"
                            className="form-control"
                            style={{minHeight: 200}}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            <input type="checkbox" name="isPrivate" />{" "}
                            {gettext("Private?")}
                        </label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">{gettext("Data Type")}</label>
                        <select
                            name="type"
                            id="type"
                            className="form-control"
                            required
                        >
                            {types.map(name => (
                                <option key={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="converter">
                            {gettext("Data Converter")}
                        </label>
                        <select
                            name="converter"
                            id="converter"
                            defaultValue="default"
                            className="form-control"
                            required
                        >
                            {converters.map(name => (
                                <option key={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                    <input
                        type="submit"
                        value={gettext("Bulk Add or Update Sources")}
                        className="btn btn-primary"
                    />
                </form>
            </div>
        </div>
    );
};

AddSources.contextTypes = childContextTypes;

class Admin extends React.Component<Props> {
    context: Context;

    static contextTypes = childContextTypes;

    componentDidMount() {
        const {URL} = this.context;
        history.replaceState({}, "", URL("/admin/add-sources"));
    }

    render() {
        const {success, error} = this.props;
        const {gettext} = this.context;

        return (
            <div>
                <h1>{gettext("Bulk Add or Update Sources")}</h1>
                {success && (
                    <p className="alert alert-success" role="alert">
                        {success}
                    </p>
                )}
                {error && (
                    <p className="alert alert-danger" role="alert">
                        {error}
                    </p>
                )}
                <AddSources />
            </div>
        );
    }
}

module.exports = Admin;
