// @flow

const React = require("react");

import type {Context, Source as SourceType} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

type Props = {|
    success?: string,
    error?: string,
    sources: Array<SourceType>,
|};

const ManageSources = (
    {sources, title}: {sources: Array<SourceType>, title: string},
    {gettext, stringNum}: Context,
) => {
    if (sources.length === 0) {
        return null;
    }

    return (
        <div className="panel panel-default">
            <div className="panel-heading">
                <h3 className="panel-title">{title}</h3>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>{gettext("ID")}</th>
                        <th style={{width: "100%"}}>{gettext("Full Name")}</th>
                        <th>{gettext("Images")}</th>
                        <th>{gettext("Records")}</th>
                        <th>{gettext("Admin")}</th>
                    </tr>
                </thead>
                <tbody>
                    {sources.map(source => (
                        <tr
                            key={source._id}
                            className={
                                source.numRecords === 0 ? "text-muted" : ""
                            }
                        >
                            <td>{source._id}</td>
                            <td>
                                {source.numRecords > 0 ? (
                                    <a href={source.getURL}>{source.name}</a>
                                ) : (
                                    source.name
                                )}
                            </td>
                            <td className="text-right">
                                {stringNum(source.numImages)}
                            </td>
                            <td className="text-right">
                                {stringNum(source.numRecords)}
                            </td>
                            <td>
                                <a
                                    className="btn btn-primary btn-xs"
                                    role="button"
                                    href={source.getAdminURL}
                                >
                                    {gettext("Admin")}
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

ManageSources.contextTypes = childContextTypes;

class Admin extends React.Component<Props> {
    context: Context;

    static contextTypes = childContextTypes;

    componentDidMount() {
        const {URL} = this.context;
        history.replaceState({}, "", URL("/admin/manage-sources"));
    }

    render() {
        const {success, error, sources} = this.props;
        const {gettext, URL} = this.context;

        return (
            <div>
                <h1>{gettext("Manage Sources")}</h1>
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
                <p>
                    <a
                        href={URL("/admin/add-source")}
                        className="btn btn-success"
                    >
                        {gettext("Add or Update Source")}
                    </a>{" "}
                    <a
                        href={URL("/admin/add-sources")}
                        className="btn btn-default"
                    >
                        {gettext("Bulk Add or Update Sources")}
                    </a>
                </p>
                <ManageSources
                    {...this.props}
                    title={gettext("Public Sources")}
                    sources={sources.filter(source => !source.private)}
                />
                <ManageSources
                    {...this.props}
                    title={gettext("Private Sources")}
                    sources={sources.filter(source => source.private)}
                />
            </div>
        );
    }
}

module.exports = Admin;
