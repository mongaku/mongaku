// @flow

const React = require("react");

const record = require("../lib/record");

const Page = require("./Page.jsx");
const ImportResult = require("./ImportResult.jsx");

type Import = {
    _id: string,
    type: string,
    error?: string,
    fileName: string,
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
    fileName: string,
    error?: string,
    model?: string,
    warnings?: Array<string>,
    diff?: Object,
    data: {
        id?: string,
    },
};

type Props = {
    // GlobalProps
    URL: (path: string | {getURL: (lang: string) => string}) => string,
    format: (text: string, options: {}) => string,
    fullName: (name: *) => string,
    gettext: (text: string) => string,
    stringNum: (num: number) => string,
    lang: string,
    fixedDate: (date: Date) => string,
    relativeDate: (date: Date) => string,

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
    lang,
}: Props & {result: Result}) => {
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

const CreatedResult = ({
    result,
    batch,
    lang,
}: Props & {result: Result}) => {
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

const DeletedResult = ({
    result,
    batch,
    lang,
}: Props & {result: Result}) => {
    if (!result.model) {
        return null;
    }

    const title = batch.state === "completed" ?
        <a href={getURLFromID(result.model, batch, lang)}>{result.model}</a> :
        result.model;

    return <div>{title}</div>;
};

const ConfirmButtons = ({
    batch,
    URL,
    gettext,
}: Props) => <p>
    <a href={URL(batch, {finalize: true})} className="btn btn-success">
        {gettext("Finalize Import")}
    </a>
    {" "}
    <a href={URL(batch, {abandon: true})} className="btn btn-danger">
        {gettext("Abandon Import")}
    </a>
</p>;

const ImportData = (props: Props) => {
    const {
        gettext,
        format,
        batch,
        batchError,
        batchState,
        fixedDate,
        relativeDate,
        URL,
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

    return <Page
        {...props}
        title={title}
        style={style}
    >
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
            renderResult={ErrorResult}
        />

        <ImportResult
            {...props}
            id="warnings"
            title={gettext("Warnings")}
            renderResult={WarningResult}
        />

        <ImportResult
            {...props}
            id="changed"
            title={state === "completed" ?
                gettext("Changed") :
                gettext("Will Be Changed")}
            renderResult={ChangedResult}
        />

        <ImportResult
            {...props}
            id="created"
            title={state === "completed" ?
                gettext("Created") :
                gettext("Will Be Created")}
            renderResult={CreatedResult}
        />

        <ImportResult
            {...props}
            id="deleted"
            title={state === "completed" ?
                gettext("Deleted") :
                gettext("Will Be Deleted")}
            renderResult={DeletedResult}
        />
    </Page>;
};

module.exports = ImportData;
