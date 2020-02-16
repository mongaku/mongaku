// @flow

const React = require("react");

import type {Context} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

type Props = {|
    success?: string,
    error?: string,
|};

class Admin extends React.Component<Props> {
    context: Context;

    static contextTypes = childContextTypes;

    componentDidMount() {
        const {URL} = this.context;
        history.replaceState({}, "", URL("/admin"));
    }

    render() {
        const {success, error} = this.props;
        const {gettext, URL} = this.context;

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
                <ul>
                    <li>
                        <a href={URL("/admin/add-user")}>
                            {gettext("Add or Update User")}
                        </a>
                    </li>
                    <li>
                        <a href={URL("/admin/add-users")}>
                            {gettext("Bulk Add or Update Users")}
                        </a>
                    </li>
                    <li>
                        <a href={URL("/admin/add-source")}>
                            {gettext("Add or Update Source")}
                        </a>
                    </li>
                    <li>
                        <a href={URL("/admin/add-sources")}>
                            {gettext("Bulk Add or Update Sources")}
                        </a>
                    </li>
                    <li>
                        <a href={URL("/admin/manage-sources")}>
                            {gettext("Manage Sources")}
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}

module.exports = Admin;
