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
    numImages: number,
    numImagesIndexed: number,
    numImagesUpdated: number,
    numRecords: number,
    numRecordsUpdated: number,
    allImagesImported: boolean,
    allRecordsImported: boolean,
};

type Import = {
    _id: string,
    error?: string,
    fileName: string,
    getFilteredResultsSummary: ImportResultsSummary,
    getURL: string,
    getError: string,
    getStateName: string,
    modified: Date,
    state: string,
    isCompleted: boolean,
};

type ImportResultsSummary = {
    models: number,
    unprocessed: number,
    created: number,
    changed: number,
    deleted: number,
    errors: number,
    warnings: number,
};

const ImageImport = (
    {batch}: Props & {batch: Import},
    {gettext, format, fixedDate}: Context,
) => {
    const results = batch.getFilteredResultsSummary;
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
            <td key="models">{results.models}</td>,
            <td key="errors">{results.errors}</td>,
            <td key="warnings">{results.warnings}</td>,
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

const ImageIndexingProgress = (props: Props, {gettext, URL}: Context) => {
    const {numImages, numImagesIndexed, numImagesUpdated, source} = props;

    return (
        <div
            className={`panel panel-default ${
                numImagesUpdated === numImages && numImagesIndexed === numImages
                    ? "panel-success"
                    : "panel-warning"
            }`}
        >
            <div className="panel-heading">
                <h3 className="panel-title">
                    {gettext("Image Similarity Indexing Progress")}
                </h3>
            </div>
            <div className="panel-body">
                <p>
                    {gettext(
                        "After images have been imported into the database they will be indexed by the image similiarity search engine. This process can take a while (but you don't need to wait for it to finish before importing any metadata).",
                    )}
                </p>
                <p>
                    <strong>{gettext("Images Indexed:")}</strong>{" "}
                    <strong
                        className={
                            numImagesIndexed === numImages
                                ? "text-success"
                                : "text-warning"
                        }
                    >
                        {((numImagesIndexed * 100) / numImages).toFixed(1)}%
                    </strong>{" "}
                    <small>
                        ({numImagesIndexed}/{numImages})
                    </small>
                    <br />
                    {gettext(
                        "As images get indexed by the simliarity search engine they will become findable via the image search.",
                    )}
                </p>
                <form
                    action={URL(
                        `/${source.type}/source/${
                            source._id
                        }/update-similarity`,
                    )}
                    method="POST"
                >
                    <p>
                        <strong>{gettext("Images Similarity Updated:")}</strong>{" "}
                        <strong
                            className={
                                numImagesUpdated === numImages
                                    ? "text-success"
                                    : "text-warning"
                            }
                        >
                            {((numImagesUpdated * 100) / numImages).toFixed(1)}%
                        </strong>{" "}
                        <small>
                            ({numImagesUpdated}/{numImages})
                        </small>
                        {numImagesUpdated === numImages && (
                            <>
                                {" "}
                                <input
                                    type="submit"
                                    className="btn btn-primary btn-xs"
                                    value={gettext("Update Similarity")}
                                />
                            </>
                        )}
                        <br />
                        {gettext(
                            "Once all of the images are indexed their similarity records will update, making it possible to find similar records when browsing.",
                        )}
                    </p>
                </form>
            </div>
        </div>
    );
};

ImageIndexingProgress.contextTypes = childContextTypes;

const UploadImagesForm = (
    {source, allImagesImported}: Props,
    {gettext, URL}: Context,
) => (
    <div
        className={`panel panel-default ${
            allImagesImported ? "panel-success" : "panel-warning"
        }`}
    >
        <div className="panel-heading">
            <h3 className="panel-title">{gettext("Upload Images")}</h3>
        </div>
        <div className="panel-body">
            <form
                action={URL(`/${source.type}/source/${source._id}/upload-zip`)}
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

const UploadDirectoryForm = (
    {source, allImagesImported}: Props,
    {gettext, URL}: Context,
) => (
    <div
        className={`panel panel-default ${
            allImagesImported ? "panel-success" : "panel-warning"
        }`}
    >
        <div className="panel-heading">
            <h3 className="panel-title">
                {gettext("Upload Directory of Images")}
            </h3>
        </div>
        <div className="panel-body">
            <form
                action={URL(
                    `/${source.type}/source/${source._id}/upload-directory`,
                )}
                method="POST"
                encType="multipart/form-data"
            >
                <p>
                    {gettext(
                        "Upload a directory of " +
                            "JPG images (.jpg or .jpeg).",
                    )}{" "}
                    {gettext(
                        "Names of images should match " +
                            "the names provided in the metadata.",
                    )}{" "}
                    {gettext(
                        "Directory must be a file path on the same system" +
                            " on which this server is running.",
                    )}
                </p>

                <div className="form-inline">
                    <div className="form-group">
                        <input
                            type="text"
                            name="directory"
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

UploadDirectoryForm.contextTypes = childContextTypes;

const DataImport = (
    {batch}: Props & {batch: Import},
    {gettext, format, fixedDate}: Context,
) => {
    const results = batch.getFilteredResultsSummary;
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
            <td key="unprocessed">{results.unprocessed}</td>,
            <td key="created">{results.created}</td>,
            <td key="changed">{results.changed}</td>,
            <td key="deleted">{results.deleted}</td>,
            <td key="errors">{results.errors}</td>,
            <td key="warnings">{results.warnings}</td>,
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

const UploadDataImagesRequired = (
    {allRecordsImported}: Props,
    {gettext}: Context,
) => (
    <div
        className={`panel panel-default ${
            allRecordsImported ? "panel-success" : "panel-warning"
        }`}
    >
        <div className="panel-heading">
            <h3 className="panel-title">{gettext("Upload Metadata")}</h3>
        </div>
        <div className="panel-body">
            <p>
                {gettext(
                    "Please upload some images, or wait for the images to finish processing, before uploading any metadata.",
                )}
            </p>
        </div>
    </div>
);

UploadDataImagesRequired.contextTypes = childContextTypes;

const UploadDataForm = (
    {source, allRecordsImported}: Props,
    {gettext, URL}: Context,
) => (
    <div
        className={`panel panel-default ${
            allRecordsImported ? "panel-success" : "panel-warning"
        }`}
    >
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

const DataIndexingProgress = (props: Props, {gettext}: Context) => {
    const {numRecords, numRecordsUpdated} = props;

    return (
        <div
            className={`panel panel-default ${
                numRecordsUpdated === numRecords
                    ? "panel-success"
                    : "panel-warning"
            }`}
        >
            <div className="panel-heading">
                <h3 className="panel-title">
                    {gettext("Record Similarity Indexing Progress")}
                </h3>
            </div>
            <div className="panel-body">
                <p>
                    <strong>{gettext("Record Similarity Updated:")}</strong>{" "}
                    <strong
                        className={
                            numRecordsUpdated === numRecords
                                ? "text-success"
                                : "text-warning"
                        }
                    >
                        {((numRecordsUpdated * 100) / numRecords).toFixed(1)}%
                    </strong>{" "}
                    <small>
                        ({numRecordsUpdated}/{numRecords})
                    </small>
                    <br />
                    {gettext(
                        "Whenever new data is added or image similarity updated the similarity between records will need to be re-computed. This should be a very fast operation.",
                    )}
                </p>
            </div>
        </div>
    );
};

DataIndexingProgress.contextTypes = childContextTypes;

const Admin = (props: Props, {options}: Context) => {
    const {
        title,
        imageImport,
        dataImport,
        source,
        allImagesImported,
        allRecordsImported,
    } = props;
    const {hasImages, allowDirectoryUpload} = options.types[source.type];

    return (
        <div>
            <h1>{title}</h1>
            {hasImages && allowDirectoryUpload ? (
                <UploadDirectoryForm {...props} />
            ) : (
                <UploadImagesForm {...props} />
            )}
            {imageImport.length > 0 && <ImageImports {...props} />}
            {allImagesImported ? (
                <>
                    <ImageIndexingProgress {...props} />
                    <UploadDataForm {...props} />
                    {dataImport.length > 0 && <DataImports {...props} />}
                    {allRecordsImported && <DataIndexingProgress {...props} />}
                </>
            ) : (
                <UploadDataImagesRequired {...props} />
            )}
        </div>
    );
};

Admin.contextTypes = childContextTypes;

module.exports = Admin;
