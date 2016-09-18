"use strict";

const React = require("react");

const options = require("../lib/options");

const Page = require("./Page.jsx");

const importsType = React.PropTypes.arrayOf(
    React.PropTypes.shape({
        _id: React.PropTypes.string.isRequired,
        error: React.PropTypes.string,
        fileName: React.PropTypes.string.isRequired,
        getFilteredResults: React.PropTypes.func.isRequired,
        modified: React.PropTypes.instanceOf(Date).isRequired,
        state: React.PropTypes.string.isRequired,
    })
).isRequired;

module.exports = React.createClass({
    propTypes: {
        URL: React.PropTypes.func.isRequired,
        batchError: React.PropTypes.func.isRequired,
        batchState: React.PropTypes.func.isRequired,
        dataImport: importsType,
        format: React.PropTypes.func.isRequired,
        fullName: React.PropTypes.func.isRequired,
        gettext: React.PropTypes.func.isRequired,
        imageImport: importsType,
        lang: React.PropTypes.string.isRequired,
        relativeDate: React.PropTypes.func.isRequired,
        source: React.PropTypes.any.isRequired,
    },

    hasImages() {
        return options.types[this.props.source.type].hasImages();
    },

    renderUploadImagesForm() {
        if (!this.hasImages()) {
            return null;
        }

        return <div className="panel panel-default">
            <div className="panel-heading">
                <h3 className="panel-title">
                    {this.props.gettext("Upload Images")}
                </h3>
            </div>
            <div className="panel-body">
                <form action={this.props.URL(
                        `/source/${this.props.source._id}/upload-images`)}
                    method="POST" encType="multipart/form-data"
                >
                    <input type="hidden" name="lang" value={this.props.lang}/>
                    <p>
                        {this.props.gettext("Upload a Zip file (.zip) of " +
                            "JPG images (.jpg or .jpeg).")}
                        {" "}
                        {this.props.gettext("Names of images should match " +
                            "the names provided in the metadata.")}
                        {" "}
                        {this.props.gettext("After you've uploaded a new " +
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
                            value={this.props.gettext("Upload")}
                            className="btn btn-primary"
                        />
                    </div>
                </form>
            </div>
        </div>;
    },

    renderImageImports() {
        return <div className="responsive-table">
            <table className="table">
                <thead>
                    <tr>
                        <th>{this.props.gettext("File Name")}</th>
                        <th>{this.props.gettext("Last Updated")}</th>
                        <th>{this.props.gettext("Status")}</th>
                        <th>{this.props.gettext("Images")}</th>
                        <th>{this.props.gettext("Errors")}</th>
                        <th>{this.props.gettext("Warnings")}</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.imageImport.map((batch) =>
                        this.renderImageImport(batch))}
                </tbody>
            </table>
        </div>;
    },

    renderImageImport(batch) {
        const results = batch.getFilteredResults();
        let columns;

        if (batch.state === "error") {
            columns = <td colSpan="4">
                {this.props.format(this.props.gettext("Error: %(error)s"),
                    {error: this.props.batchError(batch)})}
            </td>;
        } else {
            columns = [
                <td key="state">{this.props.batchState(batch)}</td>,
                <td key="models">{results.models.length}</td>,
                <td key="errors">{results.errors.length}</td>,
                <td key="warnings">{results.warnings.length}</td>,
            ];
        }

        return <tr key={batch._id}>
            <td><a href={this.props.URL(batch)}>{batch.fileName}</a></td>
            <td>{this.props.relativeDate(batch.modified)}</td>
            {columns}
        </tr>;
    },

    renderUploadDataForm() {
        return <div className="panel panel-default">
            <div className="panel-heading">
                <h3 className="panel-title">
                    {this.props.gettext("Upload Metadata")}
                </h3>
            </div>
            <div className="panel-body">
                {this.renderUploadDataFormContents()}
            </div>
        </div>;
    },

    renderUploadDataFormContents() {
        const files = this.props.source.getExpectedFiles();

        return <form action={this.props.URL(
                `/source/${this.props.source._id}/upload-data`)}
            method="POST" encType="multipart/form-data"
        >
            <input type="hidden" name="lang" value={this.props.lang}/>
            {files.map((file, i) => <div key={`file${i}`}>
                <p>{file}</p>

                <div className="form-inline">
                    <div className="form-group">
                        <input type="file" name="files"
                            className="form-control"
                        />
                    </div>
                    {" "}
                    {files.length - 1 === i && <input type="submit"
                        value={this.props.gettext("Upload")}
                        className="btn btn-primary"
                    />}
                </div>
            </div>)}
        </form>;
    },

    renderDataImports() {
        return <div className="responsive-table">
            <table className="table">
                <thead>
                    <tr>
                        <th>{this.props.gettext("File Name")}</th>
                        <th>{this.props.gettext("Last Updated")}</th>
                        <th>{this.props.gettext("Status")}</th>
                        <th>{this.props.gettext("Unprocessed")}</th>
                        <th>{this.props.gettext("Created")}</th>
                        <th>{this.props.gettext("Updated")}</th>
                        <th>{this.props.gettext("Deleted")}</th>
                        <th>{this.props.gettext("Errors")}</th>
                        <th>{this.props.gettext("Warnings")}</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.dataImport.map((batch) =>
                        this.renderDataImport(batch))}
                </tbody>
            </table>
        </div>;
    },

    renderDataImport(batch) {
        const results = batch.getFilteredResults();
        let columns;

        if (batch.state === "error") {
            columns = <td colSpan="7">
                {this.props.format(this.props.gettext("Error: %(error)s"),
                    {error: this.props.batchError(batch)})}
            </td>;
        } else {
            columns = [
                batch.state === "process.completed" && <td key="finalize">
                    <a href={this.props.URL(batch)}
                        className="btn btn-success btn-xs"
                    >
                        {this.props.gettext("Finalize Import")}
                    </a>
                </td>,
                batch.state !== "process.completed" &&
                    <td key="state">{this.props.batchState(batch)}</td>,
                <td key="unprocessed">{results.unprocessed.length}</td>,
                <td key="created">{results.created.length}</td>,
                <td key="changed">{results.changed.length}</td>,
                <td key="deleted">{results.deleted.length}</td>,
                <td key="errors">{results.errors.length}</td>,
                <td key="warnings">{results.warnings.length}</td>,
            ];
        }

        return <tr key={batch._id}>
            <td><a href={this.props.URL(batch)}>{batch.fileName}</a></td>
            <td>{this.props.relativeDate(batch.modified)}</td>
            {columns}
        </tr>;
    },

    render() {
        const title = this.props.format(
            this.props.gettext("%(name)s Admin Area"),
            {name: this.props.fullName(this.props.source)});

        return <Page
            {...this.props}
            title={title}
        >
            <h1>{title}</h1>
            {this.renderUploadImagesForm()}
            {this.props.imageImport.length > 0 && this.renderImageImports()}
            {this.renderUploadDataForm()}
            {this.props.dataImport.length > 0 && this.renderDataImports()}
        </Page>;
    },
});
