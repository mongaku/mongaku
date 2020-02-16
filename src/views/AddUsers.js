// @flow

const React = require("react");

import type {Context} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

type Props = {|
    success?: string,
    error?: string,
|};

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
                        value={gettext("Bulk Add or Update Users")}
                        className="btn btn-primary"
                    />
                </form>
            </div>
        </div>
    );
};

BulkAddUsers.contextTypes = childContextTypes;

class Admin extends React.Component<Props> {
    context: Context;

    static contextTypes = childContextTypes;

    componentDidMount() {
        const {URL} = this.context;
        history.replaceState({}, "", URL("/admin/add-users"));
    }

    render() {
        const {success, error} = this.props;
        const {gettext} = this.context;

        return (
            <div>
                <h1>{gettext("Bulk Add or Update Users")}</h1>
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
                <BulkAddUsers />
            </div>
        );
    }
}

module.exports = Admin;
