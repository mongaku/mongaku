// @flow

const React = require("react");

import type {Context} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

type Props = {|
    success?: string,
    error?: string,
|};

const AddSource = (props, {gettext, URL, options}: Context) => {
    const types = Object.keys(options.types);
    const converters = Object.keys(options.converters || {default: true});
    return (
        <div className="panel panel-default">
            <div className="panel-heading">
                <h3 className="panel-title">
                    {gettext("Add or Update Source")}
                </h3>
            </div>
            <div className="panel-body">
                <form action={URL("/admin/add-source")} method="POST">
                    <div className="form-group">
                        <label htmlFor="_id">
                            {gettext(
                                "Source ID (required, lowercase letters only)",
                            )}
                        </label>
                        <input
                            type="text"
                            name="_id"
                            id="_id"
                            placeholder={gettext("e.g. frick")}
                            className="form-control"
                            pattern="[a-z0-9-]+"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">
                            {gettext("Full Name (required)")}
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder={gettext("e.g. Frick Library")}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="shortName">
                            {gettext("Short Name (required)")}
                        </label>
                        <input
                            type="text"
                            name="shortName"
                            id="shortName"
                            placeholder={gettext("e.g. Frick")}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="url">{gettext("URL")}</label>
                        <input
                            type="url"
                            name="url"
                            id="url"
                            placeholder="https://..."
                            className="form-control"
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
                        value={gettext("Add or Update Source")}
                        className="btn btn-primary"
                    />
                </form>
            </div>
        </div>
    );
};

AddSource.contextTypes = childContextTypes;

class Admin extends React.Component<Props> {
    context: Context;

    static contextTypes = childContextTypes;

    componentDidMount() {
        const {URL} = this.context;
        history.replaceState({}, "", URL("/admin/add-source"));
    }

    render() {
        const {success, error} = this.props;
        const {gettext} = this.context;

        return (
            <div>
                <h1>{gettext("Add or Update Source")}</h1>
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
                <AddSource />
            </div>
        );
    }
}

module.exports = Admin;
