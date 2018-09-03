// @flow

const React = require("react");

import type {Context} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

type Props = {
    title: string,
    dataImport: Array<Import>,
    imageImport: Array<Import>,
    source: {
        _id: string,
        type: string,
        getExpectedFiles: Array<string>,
        getURL: string,
        getFullName: string,
        getShortName: string,
    },
};

type Import = {
    _id: string,
    error?: string,
    fileName: string,
    getFilteredResults: ImportResults,
    getURL: string,
    getError: string,
    getStateName: string,
    modified: Date,
    state: string,
};

type ImportResults = {
    models: [],
    unprocessed: [],
    created: [],
    changed: [],
    deleted: [],
    errors: [],
    warnings: [],
};

const ImageImport = (
    {batch}: Props & {batch: Import},
    {gettext, format, fixedDate}: Context,
) => {
    const results = batch.getFilteredResults;
    let columns;

    if (batch.state === "error") {
        columns = (
            <td colSpan="4">
                {format(gettext("Error: %(error)s"), {error: batch.getError})}
            </td>
        );
    } else {
        columns = [
            <td key="state">{batch.getStateName}</td>,
            <td key="models">{results.models.length}</td>,
            <td key="errors">{results.errors.length}</td>,
            <td key="warnings">{results.warnings.length}</td>,
        ];
    }

    return (
        <tr>
            <td>
                <a href={batch.getURL}>{batch.fileName}</a>
            </td>
            <td>{fixedDate(batch.modified)}</td>
            {columns}
        </tr>
    );
};

ImageImport.contextTypes = childContextTypes;

const ImageImports = (props: Props, {gettext}: Context) => {
    const {imageImport} = props;

    return (
        <div className="responsive-table">
            <table className="table">
                <thead>
                    <tr>
                        <th>{gettext("File Name")}</th>
                        <th>{gettext("Last Updated")}</th>
                        <th>{gettext("Status")}</th>
                        <th>{gettext("Images")}</th>
                        <th>{gettext("Errors")}</th>
                        <th>{gettext("Warnings")}</th>
                    </tr>
                </thead>
                <tbody>
                    {imageImport.map(batch => (
                        <ImageImport {...props} batch={batch} key={batch._id} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

ImageImports.contextTypes = childContextTypes;

const UploadImagesForm = ({source}: Props, {gettext, URL}: Context) => (
    <div className="panel panel-default">
        <div className="panel-heading">
            <h3 className="panel-title">{gettext("Upload Images")}</h3>
        </div>
        <div className="panel-body">
            <form
                action={URL(
                    `/${source.type}/source/${source._id}/upload-images`,
                )}
                method="POST"
                encType="multipart/form-data"
            >
                <p>
                    {gettext(
                        "Upload a Zip file (.zip) of " +
                            "JPG images (.jpg or .jpeg).",
                    )}{" "}
                    {gettext(
                        "Names of images should match " +
                            "the names provided in the metadata.",
                    )}{" "}
                    {gettext(
                        "After you've uploaded a new " +
                            "batch of images they will be processed " +
                            "immediately but their similarity to other " +
                            "images will be computed in the background over " +
                            "the subsequent hours and days.",
                    )}
                </p>

                <div className="form-inline">
                    <div className="form-group">
                        <input
                            type="file"
                            name="zipField"
                            className="form-control"
                        />
                    </div>{" "}
                    <input
                        type="submit"
                        value={gettext("Upload")}
                        className="btn btn-primary"
                    />
                </div>
            </form>
        </div>
    </div>
);

UploadImagesForm.contextTypes = childContextTypes;

const DataImport = (
    {batch}: Props & {batch: Import},
    {gettext, format, fixedDate}: Context,
) => {
    const results = batch.getFilteredResults;
    let columns;

    if (batch.state === "error") {
        columns = (
            <td colSpan="7">
                {format(gettext("Error: %(error)s"), {error: batch.getError})}
            </td>
        );
    } else {
        columns = [
            batch.state === "process.completed" && (
                <td key="finalize">
                    <a href={batch.getURL} className="btn btn-success btn-xs">
                        {gettext("Finalize Import")}
                    </a>
                </td>
            ),
            batch.state !== "process.completed" && (
                <td key="state">{batch.getStateName}</td>
            ),
            <td key="unprocessed">{results.unprocessed.length}</td>,
            <td key="created">{results.created.length}</td>,
            <td key="changed">{results.changed.length}</td>,
            <td key="deleted">{results.deleted.length}</td>,
            <td key="errors">{results.errors.length}</td>,
            <td key="warnings">{results.warnings.length}</td>,
        ];
    }

    return (
        <tr>
            <td>
                <a href={batch.getURL}>{batch.fileName}</a>
            </td>
            <td>{fixedDate(batch.modified)}</td>
            {columns}
        </tr>
    );
};

DataImport.contextTypes = childContextTypes;

const DataImports = (props: Props, {gettext}: Context) => {
    const {dataImport} = props;

    return (
        <div className="responsive-table">
            <table className="table">
                <thead>
                    <tr>
                        <th>{gettext("File Name")}</th>
                        <th>{gettext("Last Updated")}</th>
                        <th>{gettext("Status")}</th>
                        <th>{gettext("Unprocessed")}</th>
                        <th>{gettext("Created")}</th>
                        <th>{gettext("Updated")}</th>
                        <th>{gettext("Deleted")}</th>
                        <th>{gettext("Errors")}</th>
                        <th>{gettext("Warnings")}</th>
                    </tr>
                </thead>
                <tbody>
                    {dataImport.map(batch => (
                        <DataImport {...props} batch={batch} key={batch._id} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

DataImports.contextTypes = childContextTypes;

const UploadDataForm = ({source}: Props, {gettext, URL}: Context) => (
    <div className="panel panel-default">
        <div className="panel-heading">
            <h3 className="panel-title">{gettext("Upload Metadata")}</h3>
        </div>
        <div className="panel-body">
            <form
                action={URL(`/${source.type}/source/${source._id}/upload-data`)}
                method="POST"
                encType="multipart/form-data"
            >
                {source.getExpectedFiles.map((file, i) => (
                    <div key={`file${i}`}>
                        <p>{file}</p>

                        <div className="form-inline">
                            <div className="form-group">
                                <input
                                    type="file"
                                    name="files"
                                    className="form-control"
                                />
                            </div>{" "}
                            {source.getExpectedFiles.length - 1 === i && (
                                <input
                                    type="submit"
                                    value={gettext("Upload")}
                                    className="btn btn-primary"
                                />
                            )}
                        </div>
                    </div>
                ))}
            </form>
        </div>
    </div>
);

UploadDataForm.contextTypes = childContextTypes;

const Admin = (props: Props, {options}: Context) => {
    const {title, imageImport, dataImport, source} = props;
    const hasImages = options.types[source.type].hasImages;

    return (
        <div>
            <h1>{title}</h1>
            {hasImages && <UploadImagesForm {...props} />}
            {imageImport.length > 0 && <ImageImports {...props} />}
            <UploadDataForm {...props} />
            {dataImport.length > 0 && <DataImports {...props} />}
        </div>
    );
};

Admin.contextTypes = childContextTypes;

module.exports = Admin;
