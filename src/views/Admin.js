// @flow

const React = require("react");

import type {Context} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

type Props = {
    success?: string,
    error?: string,
};

const AddUser = (props, {gettext, URL}: Context) => {
    return (
        <div className="panel panel-default">
            <div className="panel-heading">
                <h3 className="panel-title">{gettext("Add or Update User")}</h3>
            </div>
            <div className="panel-body">
                <form
                    action={URL("/admin/add-user")}
                    method="POST"
                    autoComplete="off"
                >
                    <div className="form-group">
                        <label htmlFor="username">
                            {gettext("Username (required)")}
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">
                            {gettext("Password (required)")}
                        </label>
                        <input
                            type="text"
                            name="password"
                            id="password"
                            className="form-control"
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                name="canViewPrivateSources"
                                defaultChecked={true}
                            />{" "}
                            {gettext("Can view private sources")}
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            <input type="checkbox" name="siteAdmin" />{" "}
                            {gettext("Admin User")}
                        </label>
                    </div>
                    <input
                        type="submit"
                        value={gettext("Add or Update User")}
                        className="btn btn-primary"
                    />
                </form>
            </div>
        </div>
    );
};

AddUser.contextTypes = childContextTypes;

const BulkAddUsers = (props, {gettext, URL}: Context) => {
    return (
        <div className="panel panel-default">
            <div className="panel-heading">
                <h3 className="panel-title">
                    {gettext("Bulk Add or Update Users")}
                </h3>
            </div>
            <div className="panel-body">
                <p>
                    {gettext(
                        "Paste in a CSV list of usernames and passwords separated by endlines, for example:",
                    )}
                </p>
                <pre>
                    "user1","password1"
                    <br />
                    "user2","password2"
                    <br />
                    ...
                </pre>
                <form action={URL("/admin/add-users")} method="POST">
                    <div className="form-group">
                        <label htmlFor="usernames">
                            {gettext("Usernames and Passwords (CSV, required)")}
                        </label>
                        <textarea
                            id="usernames"
                            name="usernames"
                            className="form-control"
                            style={{minHeight: 200}}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                name="canViewPrivateSources"
                                defaultChecked={true}
                            />{" "}
                            {gettext("Can view private sources")}
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            <input type="checkbox" name="siteAdmin" />{" "}
                            {gettext("Admin User")}
                        </label>
                    </div>
                    <input
                        type="submit"
                        value={gettext("Add or Update Users")}
                        className="btn btn-primary"
                    />
                </form>
            </div>
        </div>
    );
};

BulkAddUsers.contextTypes = childContextTypes;

const AddSource = (props, {gettext, URL, options}: Context) => {
    const types = Object.keys(options.types);
    const converters = Object.keys(options.converters || {default: true});
    return (
        <div className="panel panel-default">
            <div className="panel-heading">
                <h3 className="panel-title">{gettext("Add Source")}</h3>
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
                            pattern="[a-z]+"
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
                            minLength="2"
                            maxLength="8"
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
                        value={gettext("Add Source")}
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
        history.replaceState({}, "", URL("/admin"));
    }

    render() {
        const {success, error} = this.props;
        const {gettext} = this.context;

        return (
            <div>
                <h1>{gettext("Admin")}</h1>
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
                <AddUser />
                <BulkAddUsers />
                <AddSource />
            </div>
        );
    }
}

module.exports = Admin;
