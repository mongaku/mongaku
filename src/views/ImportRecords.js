// @flow

const React = require("react");

const record = require("../lib/record");

const Page = require("./Page.js");
const ImportResult = require("./ImportResult.js");

import type {Context} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

type Import = {
    _id: string,
    fileName: string,
    type: string,
    error?: string,
    getFilteredResults: () => ImportResults,
    getURL: (lang: string) => string,
    created: Date,
    modified: Date,
    state: string,
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

type Result = {
    error?: string,
    model?: string,
    warnings?: Array<string>,
    diff?: Object,
    data: {
        id?: string,
    },
};

type Props = {
    adminURL: string,
    batch: Import,
    batchError: (error: string) => string,
    batchState: (batch: Import) => string,
    expanded?: "models" | "unprocessed" | "created" | "changed" | "deleted" |
        "errors" | "warnings",
    diff: (delta: Object) => string,
};

const getURLFromID = (id: string, {type}: Import, lang: string) =>
    record(type).getURLFromID(lang, id);

const UnprocessedResult = ({result: data}: {result: Result}) =>
    <pre className="json">
        {JSON.stringify(data, null, "    ")}
    </pre>;

const ErrorResult = ({result}: {result: Result}) => {
    if (!result.error) {
        return null;
    }

    const title = result.data.id ?
        `${result.data.id}: ${result.error}` :
        result.error;

    return <div>
        <h4>{title}</h4>
        <UnprocessedResult result={result} />
    </div>;
};

const WarningResult = ({
    result,
    batchError,
}: Props & {result: Result}) => {
    if (!result.warnings) {
        return null;
    }

    return <div>
        <h4>{result.data.id}</h4>
        <ul>
            {result.warnings.map((warning) =>
                <li key={warning}>{batchError(warning)}</li>)}
        </ul>
        <UnprocessedResult result={result} />
    </div>;
};

const ChangedResult = ({
    result: {model, diff: diffText},
    diff,
    batch,
}: Props & {result: Result}, {lang}: Context) => {
    if (!diffText || !model) {
        return null;
    }

    return <div>
        <h4><a href={getURLFromID(model, batch, lang)}>
            {model}
        </a></h4>
        <div className="diff"
            dangerouslySetInnerHTML={{
                __html: diff(diffText),
            }}
        />
    </div>;
};

ChangedResult.contextTypes = childContextTypes;

const CreatedResult = ({
    result,
    batch,
}: Props & {result: Result}, {lang}: Context) => {
    if (!result.model) {
        return null;
    }

    const title = batch.state === "completed" ?
        <a href={getURLFromID(result.model, batch, lang)}>{result.model}</a> :
        result.model;

    return <div>
        <h4>{title}</h4>
        <UnprocessedResult result={result} />
    </div>;
};

CreatedResult.contextTypes = childContextTypes;

const DeletedResult = ({
    result,
    batch,
}: Props & {result: Result}, {lang}: Context) => {
    if (!result.model) {
        return null;
    }

    const title = batch.state === "completed" ?
        <a href={getURLFromID(result.model, batch, lang)}>{result.model}</a> :
        result.model;

    return <div>{title}</div>;
};

DeletedResult.contextTypes = childContextTypes;

const ConfirmButtons = ({batch}: Props, {URL, gettext, lang}: Context) => <p>
    <a
        href={URL(batch.getURL(lang), {finalize: true})}
        className="btn btn-success"
    >
        {gettext("Finalize Import")}
    </a>
    {" "}
    <a
        href={URL(batch.getURL(lang), {abandon: true})}
        className="btn btn-danger"
    >
        {gettext("Abandon Import")}
    </a>
</p>;

ConfirmButtons.contextTypes = childContextTypes;

const ImportData = (props: Props, {
    gettext,
    format,
    fixedDate,
    relativeDate,
    URL,
}: Context) => {
    const {
        batch,
        batchError,
        batchState,
        adminURL,
    } = props;
    const state = {batch};
    const title = format(gettext("Data Import: %(fileName)s"),
        {fileName: batch.fileName});
    const stateText = state === "error" ?
        format(gettext("Error: %(error)s"),
            {error: batchError(batch.error || "")}) :
        batchState(batch);
    const uploadDate = format(gettext("Uploaded: %(date)s"),
        {date: fixedDate(batch.created)});
    const lastUpdated = format(gettext("Last Updated: %(date)s"),
        {date: relativeDate(batch.modified)});

    const style = <link rel="stylesheet"
        href={URL("/css/format-diff.css")}
    />;

    return <Page title={title} style={style}>
        <p><a href={adminURL} className="btn btn-primary">
            &laquo; {gettext("Return to Admin Page")}
        </a></p>

        <h1>{title}</h1>
        <p>{uploadDate}</p>
        <p><strong>{stateText}</strong></p>
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
            renderResult={(result, i) =>
                <ErrorResult {...props} result={result} key={i} />}
        />

        <ImportResult
            {...props}
            id="warnings"
            title={gettext("Warnings")}
            renderResult={(result, i) =>
                <WarningResult {...props} result={result} key={i} />}
        />

        <ImportResult
            {...props}
            id="changed"
            title={state === "completed" ?
                gettext("Changed") :
                gettext("Will Be Changed")}
            renderResult={(result, i) =>
                <ChangedResult {...props} result={result} key={i} />}
        />

        <ImportResult
            {...props}
            id="created"
            title={state === "completed" ?
                gettext("Created") :
                gettext("Will Be Created")}
            renderResult={(result, i) =>
                <CreatedResult {...props} result={result} key={i} />}
        />

        <ImportResult
            {...props}
            id="deleted"
            title={state === "completed" ?
                gettext("Deleted") :
                gettext("Will Be Deleted")}
            renderResult={(result, i) =>
                <DeletedResult {...props} result={result} key={i} />}
        />
    </Page>;
};

ImportData.contextTypes = childContextTypes;

module.exports = ImportData;
