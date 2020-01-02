// @flow

const React = require("react");

const ImportResult = require("./ImportResult.js");

import type {Context} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

type Import = {
    _id: string,
    fileName: string,
    type: string,
    error?: string,
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

type Result = {
    error?: string,
    model?: string,
    warnings?: Array<string>,
    diff?: string,
    url?: string,
    data: {
        id?: string,
    },
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

const UnprocessedResult = ({result: data}: {result: Result}) => (
    <pre className="json">{JSON.stringify(data, null, "    ")}</pre>
);

const ErrorResult = ({result}: {result: Result}) => {
    if (!result.error) {
        return null;
    }

    const title = result.data.id
        ? `${result.data.id}: ${result.error}`
        : result.error;

    return (
        <div>
            <h4>{title}</h4>
            <UnprocessedResult result={result} />
        </div>
    );
};

const WarningResult = ({result}: Props & {result: Result}) => {
    if (!result.warnings) {
        return null;
    }

    return (
        <div>
            <h4>{result.data.id}</h4>
            <ul>
                {result.warnings.map(warning => (
                    <li key={warning}>{warning}</li>
                ))}
            </ul>
            <UnprocessedResult result={result} />
        </div>
    );
};

const ChangedResult = ({
    result: {model, diff: diffText, url},
}: Props & {result: Result}) => {
    if (!diffText || !model) {
        return null;
    }

    return (
        <div>
            <h4>
                <a href={url}>{model}</a>
            </h4>
            <div
                className="diff"
                dangerouslySetInnerHTML={{
                    __html: diffText,
                }}
            />
        </div>
    );
};

const CreatedResult = ({result, batch}: Props & {result: Result}) => {
    const title =
        result.model && batch.state === "completed" ? (
            <a href={result.url}>{result.model}</a>
        ) : (
            result.data.id
        );

    return (
        <div>
            <h4>{title}</h4>
            <UnprocessedResult result={result} />
        </div>
    );
};

const DeletedResult = ({result, batch}: Props & {result: Result}) => {
    if (!result.model) {
        return null;
    }

    const title =
        batch.state === "completed" ? (
            <a href={result.url}>{result.model}</a>
        ) : (
            result.model
        );

    return <div>{title}</div>;
};

const ConfirmButtons = ({batch}: Props, {gettext, URL}: Context) => (
    <p>
        <a
            href={URL(batch.getURL, {finalize: true})}
            className="btn btn-success"
        >
            {gettext("Finalize Import")}
        </a>{" "}
        <a href={URL(batch.getURL, {abandon: true})} className="btn btn-danger">
            {gettext("Abandon Import")}
        </a>
    </p>
);

ConfirmButtons.contextTypes = childContextTypes;

const ImportData = (
    props: Props,
    {gettext, format, fixedDate, STATIC}: Context,
) => {
    const {title, batch, adminURL} = props;
    const {state} = batch;
    const stateText =
        state === "error"
            ? format(gettext("Error: %(error)s"), {error: batch.getError})
            : batch.getStateName;
    const uploadDate = format(gettext("Uploaded: %(date)s"), {
        date: fixedDate(batch.created),
    });
    const lastUpdated = format(gettext("Last Updated: %(date)s"), {
        date: fixedDate(batch.modified),
    });

    const style = (
        <link rel="stylesheet" href={STATIC("/css/format-diff.css")} />
    );

    return (
        <div>
            {style}

            <p>
                <a href={adminURL} className="btn btn-primary">
                    « {gettext("Return to Admin Page")}
                </a>
            </p>

            <h1>{title}</h1>
            <p>{uploadDate}</p>
            <p>
                <strong>{stateText}</strong>
            </p>
            {state !== "completed" && state !== "error" && <p>{lastUpdated}</p>}
            {state === "process.completed" && <ConfirmButtons {...props} />}

            <ImportResult
                {...props}
                id="unprocessed"
                title={gettext("To Be Processed")}
                renderResult={UnprocessedResult}
            />

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
                id="changed"
                title={
                    state === "completed"
                        ? gettext("Changed")
                        : gettext("Will Be Changed")
                }
                renderResult={(result, i) => (
                    <ChangedResult {...props} result={result} key={i} />
                )}
            />

            <ImportResult
                {...props}
                id="created"
                title={
                    state === "completed"
                        ? gettext("Created")
                        : gettext("Will Be Created")
                }
                renderResult={(result, i) => (
                    <CreatedResult {...props} result={result} key={i} />
                )}
            />

            <ImportResult
                {...props}
                id="deleted"
                title={
                    state === "completed"
                        ? gettext("Deleted")
                        : gettext("Will Be Deleted")
                }
                renderResult={(result, i) => (
                    <DeletedResult {...props} result={result} key={i} />
                )}
            />
        </div>
    );
};

ImportData.contextTypes = childContextTypes;

module.exports = ImportData;
