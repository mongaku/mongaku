// @flow

const React = require("react");

import type {Context} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

type Props = {|
    success?: string,
    error?: string,
|};

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

class Admin extends React.Component<Props> {
    context: Context;

    static contextTypes = childContextTypes;

    componentDidMount() {
        const {URL} = this.context;
        history.replaceState({}, "", URL("/admin/add-user"));
    }

    render() {
        const {success, error} = this.props;
        const {gettext} = this.context;

        return (
            <div>
                <h1>{gettext("Add or Update User")}</h1>
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
            </div>
        );
    }
}

module.exports = Admin;
