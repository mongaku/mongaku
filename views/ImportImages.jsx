"use strict";

const React = require("react");

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
});

const ImportImages = React.createClass({
    propTypes: {
        URL: React.PropTypes.func.isRequired,
        adminURL: React.PropTypes.string.isRequired,
        batch: batchType.isRequired,
        batchError: React.PropTypes.func.isRequired,
        batchState: React.PropTypes.func.isRequired,
        expanded: React.PropTypes.string,
        fixedDate: React.PropTypes.func.isRequired,
        format: React.PropTypes.func.isRequired,
        fullName: React.PropTypes.func.isRequired,
        gettext: React.PropTypes.func.isRequired,
        lang: React.PropTypes.string.isRequired,
        relativeDate: React.PropTypes.func.isRequired,
    },

    renderErrorResult(result) {
        return <li key={result.fileName}>
            {result.fileName}: {this.props.batchError(result.error)}
        </li>;
    },

    renderWarningResult(result) {
        return <li key={result.fileName}>
            {result.fileName}:
            <ul>
                {result.warnings.map((warning) =>
                    <li key={warning}>{this.props.batchError(warning)}</li>)}
            </ul>
        </li>;
    },

    renderModelResult(result) {
        return <div className="img col-xs-6 col-sm-4 col-md-3"
            key={result.model._id}
        >
            <div className="img-wrap">
                <a href={result.model.getOriginalURL()}>
                    <img src={result.model.getThumbURL()}
                        className="img-responsive center-block"
                    />
                </a>
            </div>
            <div className="details">
                <div className="wrap">{result.fileName}</div>
            </div>
        </div>;
    },

    render() {
        const format = this.props.format;
        const gettext = this.props.gettext;

        const title = format(gettext("Image Import: %(fileName)s"),
            {fileName: this.props.batch.fileName});
        const state = this.props.batch.state === "error" ?
            format(gettext("Error: %(error)s"),
                {error: this.props.batchError(this.props.batch.error)}) :
            this.props.batchState(this.props.batch);
        const uploadDate = format(gettext("Uploaded: %(date)s"),
            {date: this.props.fixedDate(this.props.batch.created)});
        const lastUpdated = format(gettext("Last Updated: %(date)s"),
            {date: this.props.relativeDate(this.props.batch.modified)});

        return <Page
            {...this.props}
            title={title}
        >
            <p><a href={this.props.adminURL} className="btn btn-primary">
                &laquo; {gettext("Return to Admin Page")}
            </a></p>

            <h1>{title}</h1>
            <p>{uploadDate}</p>
            <p><strong>{state}</strong></p>
            {this.props.batch.state !== "completed" &&
                this.props.batch.state !== "error" && <p>{lastUpdated}</p>}

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
                id="models"
                title={this.props.gettext("Images")}
                renderResult={this.renderModelResult}
                numShow={8}
            />
        </Page>;
    },
});

module.exports = ImportImages;
