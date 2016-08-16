"use strict";

const React = require("react");

const record = require("../lib/record");

const Page = require("./Page.jsx");
const ImportResult = require("./ImportResult.jsx");

const batchType = React.PropTypes.shape({
    _id: React.PropTypes.string.isRequired,
    created: React.PropTypes.instanceOf(Date).isRequired,
    error: React.PropTypes.string,
    fileName: React.PropTypes.string.isRequired,
    getFilteredResults: React.PropTypes.func.isRequired,
    modified: React.PropTypes.instanceOf(Date).isRequired,
    state: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
});

const ImportData = React.createClass({
    propTypes: {
        URL: React.PropTypes.func.isRequired,
        adminURL: React.PropTypes.string.isRequired,
        batch: batchType.isRequired,
        batchError: React.PropTypes.func.isRequired,
        batchState: React.PropTypes.func.isRequired,
        diff: React.PropTypes.func.isRequired,
        expanded: React.PropTypes.string,
        fixedDate: React.PropTypes.func.isRequired,
        format: React.PropTypes.func.isRequired,
        fullName: React.PropTypes.func.isRequired,
        gettext: React.PropTypes.func.isRequired,
        lang: React.PropTypes.string.isRequired,
        relativeDate: React.PropTypes.func.isRequired,
    },

    getURLFromID(id) {
        const Record = record(this.props.batch.type);
        return Record.getURLFromID(this.props.lang, id);
    },

    renderUnprocessedResult(result, i) {
        return <pre className="json" key={`item${i}`}>
            {JSON.stringify(result.data, null, "    ")}
        </pre>;
    },

    renderErrorResult(result, i) {
        const title = result.data.id ?
            `${result.data.id}: ${result.error}` :
            result.error;

        return <div key={`item${i}`}>
            <h4>{title}</h4>
            <pre className="json">
                {JSON.stringify(result.data, null, "    ")}
            </pre>
        </div>;
    },

    renderWarningResult(result, i) {
        return <div key={`item${i}`}>
            <h4>{result.data.id}</h4>
            <ul>
                {result.warnings.map((warning) =>
                    <li key={warning}>{this.props.batchError(warning)}</li>)}
            </ul>
            <pre className="json">
                {JSON.stringify(result.data, null, "    ")}
            </pre>
        </div>;
    },

    renderChangedResult(result, i) {
        return <div key={`item${i}`}>
            <h4><a href={this.getURLFromID(result.model)}>
                {result.model}
            </a></h4>
            <div className="diff"
                dangerouslySetInnerHTML={{
                    __html: this.props.diff(result.diff),
                }}
            />
        </div>;
    },

    renderCreatedResult(result, i) {
        const title = this.props.batch.state === "completed" ?
            <a href={this.getURLFromID(result.model)}>{result.model}</a> :
            result.model;

        return <div key={`item${i}`}>
            <h4>{title}</h4>
            <pre className="json">
                {JSON.stringify(result.data, null, "    ")}
            </pre>
        </div>;
    },

    renderDeletedResult(result, i) {
        const title = this.props.batch.state === "completed" ?
            <a href={this.getURLFromID(result.model)}>{result.model}</a> :
            result.model;

        return <div key={`item${i}`}>{title}</div>;
    },

    renderConfirmButtons() {
        return <p>
            <a href={this.props.URL(this.props.batch, {finalize: true})}
                className="btn btn-success"
            >
                {this.props.gettext("Finalize Import")}
            </a>
            {" "}
            <a href={this.props.URL(this.props.batch, {abandon: true})}
                className="btn btn-danger"
            >
                {this.props.gettext("Abandon Import")}
            </a>
        </p>;
    },

    render() {
        const format = this.props.format;
        const gettext = this.props.gettext;

        const state = this.props.batch.state;
        const title = format(gettext("Data Import: %(fileName)s"),
            {fileName: this.props.batch.fileName});
        const stateText = state === "error" ?
            format(gettext("Error: %(error)s"),
                {error: this.props.batchError(this.props.batch.error)}) :
            this.props.batchState(this.props.batch);
        const uploadDate = format(gettext("Uploaded: %(date)s"),
            {date: this.props.fixedDate(this.props.batch.created)});
        const lastUpdated = format(gettext("Last Updated: %(date)s"),
            {date: this.props.relativeDate(this.props.batch.modified)});

        const style = <link rel="stylesheet"
            href={this.props.URL("/css/format-diff.css")}
        />;

        return <Page
            {...this.props}
            title={title}
            style={style}
        >
            <p><a href={this.props.adminURL} className="btn btn-primary">
                &laquo; {gettext("Return to Admin Page")}
            </a></p>

            <h1>{title}</h1>
            <p>{uploadDate}</p>
            <p><strong>{stateText}</strong></p>
            {state !== "completed" && state !== "error" && <p>{lastUpdated}</p>}
            {state === "process.completed" && this.renderConfirmButtons()}

            <ImportResult
                {...this.props}
                id="unprocessed"
                title={this.props.gettext("To Be Processed")}
                renderResult={this.renderUnprocessedResult}
            />

            <ImportResult
                {...this.props}
                id="errors"
                title={this.props.gettext("Errors")}
                renderResult={this.renderErrorResult}
            />

            <ImportResult
                {...this.props}
                id="warnings"
                title={this.props.gettext("Warnings")}
                renderResult={this.renderWarningResult}
            />

            <ImportResult
                {...this.props}
                id="changed"
                title={state === "completed" ?
                    this.props.gettext("Changed") :
                    this.props.gettext("Will Be Changed")}
                renderResult={this.renderChangedResult}
            />

            <ImportResult
                {...this.props}
                id="created"
                title={state === "completed" ?
                    this.props.gettext("Created") :
                    this.props.gettext("Will Be Created")}
                renderResult={this.renderCreatedResult}
            />

            <ImportResult
                {...this.props}
                id="deleted"
                title={state === "completed" ?
                    this.props.gettext("Deleted") :
                    this.props.gettext("Will Be Deleted")}
                renderResult={this.renderDeletedResult}
            />
        </Page>;
    },
});

module.exports = ImportData;
