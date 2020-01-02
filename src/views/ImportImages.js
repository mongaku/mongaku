// @flow

const React = require("react");

const ImportResult = require("./ImportResult.js");

import type {Context} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

type Import = {
    _id: string,
    error?: string,
    fileName: string,
    getFilteredResults: ImportResults,
    getFilteredResultsSummary: ImportResultsSummary,
    getURL: string,
    created: Date,
    modified: Date,
    state: string,
    getError: string,
    getStateName: string,
};

type ImportResults = {
    models: Array<Result>,
    unprocessed: Array<Result>,
    created: Array<Result>,
    changed: Array<Result>,
    deleted: Array<Result>,
    errors: Array<Result>,
    warnings: Array<Result>,
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

type ImageType = {
    _id: string,
    getOriginalURL: string,
    getScaledURL: string,
    getThumbURL: string,
};

type Result = {
    fileName: string,
    error?: string,
    model?: ImageType,
    warnings?: Array<string>,
};

type Props = {
    title: string,
    adminURL: string,
    batch: Import,
    expanded?:
        | "models"
        | "unprocessed"
        | "created"
        | "changed"
        | "deleted"
        | "errors"
        | "warnings",
};

const ErrorResult = ({result}: Props & {result: Result}) => {
    if (!result.error) {
        return null;
    }

    return (
        <li>
            {result.fileName}: {result.error}
        </li>
    );
};

const WarningResult = ({result}: Props & {result: Result}) => {
    if (!result.warnings) {
        return null;
    }

    return (
        <li>
            {result.fileName}:
            <ul>
                {result.warnings.map(warning => (
                    <li key={warning}>{warning}</li>
                ))}
            </ul>
        </li>
    );
};

const ModelResult = ({result: {model, fileName}}: {result: Result}) => {
    if (!model) {
        return null;
    }

    return (
        <div className="img col-xs-6 col-sm-4 col-md-3">
            <div className="img-wrap">
                <a href={model.getOriginalURL}>
                    <img
                        src={model.getThumbURL}
                        className="img-responsive center-block"
                    />
                </a>
            </div>
            <div className="details">
                <div className="wrap">{fileName}</div>
            </div>
        </div>
    );
};

const ImportImages = (props: Props, {gettext, format, fixedDate}: Context) => {
    const {title, adminURL, batch} = props;
    const state =
        batch.state === "error"
            ? format(gettext("Error: %(error)s"), {error: batch.getError})
            : batch.getStateName;
    const uploadDate = format(gettext("Uploaded: %(date)s"), {
        date: fixedDate(batch.created),
    });
    const lastUpdated = format(gettext("Last Updated: %(date)s"), {
        date: fixedDate(batch.modified),
    });

    return (
        <div>
            <p>
                <a href={adminURL} className="btn btn-primary">
                    « {gettext("Return to Admin Page")}
                </a>
            </p>

            <h1>{title}</h1>
            <p>{uploadDate}</p>
            <p>
                <strong>{state}</strong>
            </p>
            {batch.state !== "completed" &&
                batch.state !== "error" && <p>{lastUpdated}</p>}

            <ImportResult
                {...props}
                id="errors"
                title={gettext("Errors")}
                renderResult={(result, i) => (
                    <ErrorResult {...props} result={result} key={i} />
                )}
            />

            <ImportResult
                {...props}
                id="warnings"
                title={gettext("Warnings")}
                renderResult={(result, i) => (
                    <WarningResult {...props} result={result} key={i} />
                )}
            />

            <ImportResult
                {...props}
                id="models"
                title={gettext("Images")}
                renderResult={(result, i) => (
                    <ModelResult {...props} result={result} key={i} />
                )}
            />
        </div>
    );
};

ImportImages.contextTypes = childContextTypes;

module.exports = ImportImages;
