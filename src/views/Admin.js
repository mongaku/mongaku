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
                        <label htmlFor="username">{gettext("Username")}</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">{gettext("Password")}</label>
                        <input
                            type="text"
                            name="password"
                            id="password"
                            className="form-control"
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                name="canViewPrivateSources"
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
                            {gettext("Usernames and Passwords (CSV):")}
                        </label>
                        <textarea
                            id="usernames"
                            name="usernames"
                            className="form-control"
                            style={{minHeight: 200}}
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                name="canViewPrivateSources"
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

class Admin extends React.Component<Props> {
    static contextTypes = childContextTypes;

    context: Context;

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
            </div>
        );
    }
}

module.exports = Admin;
