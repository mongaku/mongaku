"use strict";

const React = require("react");

const options = require("../lib/options");

const Page = require("./Page.jsx");

const importType = React.PropTypes.shape({
    _id: React.PropTypes.string.isRequired,
    error: React.PropTypes.string,
    fileName: React.PropTypes.string.isRequired,
    getFilteredResults: React.PropTypes.func.isRequired,
    modified: React.PropTypes.instanceOf(Date).isRequired,
    state: React.PropTypes.string.isRequired,
});
const importsType = React.PropTypes.arrayOf(importType).isRequired;

const ImageImport = ({
    batch,
    batchError,
    batchState,
    format,
    gettext,
    relativeDate,
    URL,
}) => {
    const results = batch.getFilteredResults();
    let columns;

    if (batch.state === "error") {
        columns = <td colSpan="4">
            {format(gettext("Error: %(error)s"),
                {error: batchError(batch)})}
        </td>;
    } else {
        columns = [
            <td key="state">{batchState(batch)}</td>,
            <td key="models">{results.models.length}</td>,
            <td key="errors">{results.errors.length}</td>,
            <td key="warnings">{results.warnings.length}</td>,
        ];
    }

    return <tr>
        <td><a href={URL(batch)}>{batch.fileName}</a></td>
        <td>{relativeDate(batch.modified)}</td>
        {columns}
    </tr>;
};

ImageImport.propTypes = {
    URL: React.PropTypes.func.isRequired,
    batch: importType,
    batchError: React.PropTypes.func.isRequired,
    batchState: React.PropTypes.func.isRequired,
    format: React.PropTypes.func.isRequired,
    gettext: React.PropTypes.func.isRequired,
    relativeDate: React.PropTypes.func.isRequired,
};

const ImageImports = (props) => {
    const {gettext, imageImport} = props;

    return <div className="responsive-table">
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
                {imageImport.map((batch) =>
                    <ImageImport {...props} batch={batch} key={batch._id} />)}
            </tbody>
        </table>
    </div>;
};

ImageImports.propTypes = {
    gettext: React.PropTypes.func.isRequired,
    imageImport: importsType,
};

const UploadImagesForm = ({
    gettext,
    source,
    lang,
    URL,
}) => <div className="panel panel-default">
    <div className="panel-heading">
        <h3 className="panel-title">
            {gettext("Upload Images")}
        </h3>
    </div>
    <div className="panel-body">
        <form action={URL(
                `/${source.type}/source/${source._id}/upload-images`)}
            method="POST" encType="multipart/form-data"
        >
            <input type="hidden" name="lang" value={lang}/>
            <p>
                {gettext("Upload a Zip file (.zip) of " +
                    "JPG images (.jpg or .jpeg).")}
                {" "}
                {gettext("Names of images should match " +
                    "the names provided in the metadata.")}
                {" "}
                {gettext("After you've uploaded a new " +
                    "batch of images they will be processed " +
                    "immediately but their similarity to other " +
                    "images will be computed in the background over " +
                    "the subsequent hours and days.")}
            </p>

            <div className="form-inline">
                <div className="form-group">
                    <input type="file" name="zipField"
                        className="form-control"
                    />
                </div>
                {" "}
                <input type="submit"
                    value={gettext("Upload")}
                    className="btn btn-primary"
                />
            </div>
        </form>
    </div>
</div>;

UploadImagesForm.propTypes = {
    URL: React.PropTypes.func.isRequired,
    gettext: React.PropTypes.func.isRequired,
    lang: React.PropTypes.string.isRequired,
    source: React.PropTypes.any.isRequired,
};

const DataImport = ({
    batch,
    batchError,
    batchState,
    format,
    gettext,
    relativeDate,
    URL,
}) => {
    const results = batch.getFilteredResults();
    let columns;

    if (batch.state === "error") {
        columns = <td colSpan="7">
            {format(gettext("Error: %(error)s"), {error: batchError(batch)})}
        </td>;
    } else {
        columns = [
            batch.state === "process.completed" && <td key="finalize">
                <a href={URL(batch)} className="btn btn-success btn-xs">
                    {gettext("Finalize Import")}
                </a>
            </td>,
            batch.state !== "process.completed" &&
                <td key="state">{batchState(batch)}</td>,
            <td key="unprocessed">{results.unprocessed.length}</td>,
            <td key="created">{results.created.length}</td>,
            <td key="changed">{results.changed.length}</td>,
            <td key="deleted">{results.deleted.length}</td>,
            <td key="errors">{results.errors.length}</td>,
            <td key="warnings">{results.warnings.length}</td>,
        ];
    }

    return <tr>
        <td><a href={URL(batch)}>{batch.fileName}</a></td>
        <td>{relativeDate(batch.modified)}</td>
        {columns}
    </tr>;
};

DataImport.propTypes = {
    URL: React.PropTypes.func.isRequired,
    batch: importType,
    batchError: React.PropTypes.func.isRequired,
    batchState: React.PropTypes.func.isRequired,
    format: React.PropTypes.func.isRequired,
    gettext: React.PropTypes.func.isRequired,
    relativeDate: React.PropTypes.func.isRequired,
};

const DataImports = (props) => {
    const {gettext, dataImport} = props;

    return <div className="responsive-table">
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
                {dataImport.map((batch) =>
                    <DataImport {...props} batch={batch} key={batch._id} />)}
            </tbody>
        </table>
    </div>;
};

DataImports.propTypes = {
    dataImport: importsType,
    gettext: React.PropTypes.func.isRequired,
};

const UploadDataForm = ({
    gettext,
    source,
    lang,
    URL,
}) => <div className="panel panel-default">
    <div className="panel-heading">
        <h3 className="panel-title">
            {gettext("Upload Metadata")}
        </h3>
    </div>
    <div className="panel-body">
        <form action={URL(
                `/${source.type}/source/${source._id}/upload-data`)}
            method="POST" encType="multipart/form-data"
        >
            <input type="hidden" name="lang" value={lang}/>
            {source.getExpectedFiles().map((file, i) => <div key={`file${i}`}>
                <p>{file}</p>

                <div className="form-inline">
                    <div className="form-group">
                        <input type="file" name="files"
                            className="form-control"
                        />
                    </div>
                    {" "}
                    {source.getExpectedFiles().length - 1 === i &&
                        <input type="submit"
                            value={gettext("Upload")}
                            className="btn btn-primary"
                        />}
                </div>
            </div>)}
        </form>
    </div>
</div>;

UploadDataForm.propTypes = {
    URL: React.PropTypes.func.isRequired,
    gettext: React.PropTypes.func.isRequired,
    lang: React.PropTypes.string.isRequired,
    source: React.PropTypes.any.isRequired,
};

const Admin = (props) => {
    const {
        format,
        gettext,
        fullName,
        imageImport,
        dataImport,
        source,
    } = props;
    const hasImages = options.types[source.type].hasImages();
    const title = format(gettext("%(name)s Admin Area"), {
        name: fullName(source),
    });

    return <Page
        {...props}
        title={title}
    >
        <h1>{title}</h1>
        {hasImages && <UploadImagesForm {...props} />}
        {imageImport.length > 0 && <ImageImports {...props} />}
        {<UploadDataForm {...props} />}
        {dataImport.length > 0 && <DataImports {...props} />}
    </Page>;
};

Admin.propTypes = {
    URL: React.PropTypes.func.isRequired,
    dataImport: importsType,
    format: React.PropTypes.func.isRequired,
    fullName: React.PropTypes.func.isRequired,
    gettext: React.PropTypes.func.isRequired,
    imageImport: importsType,
    lang: React.PropTypes.string.isRequired,
    source: React.PropTypes.any.isRequired,
};

module.exports = Admin;
