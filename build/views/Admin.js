"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const React = require("react");

const Page = require("./Page.js");
const { format, relativeDate, URL } = require("./utils.js");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

const { childContextTypes } = require("./Wrapper.js");

const ImageImport = ({
    batch,
    batchError,
    batchState
}, {
    gettext,
    lang
}) => {
    const results = batch.getFilteredResults();
    let columns;

    if (batch.state === "error") {
        columns = React.createElement(
            "td",
            { colSpan: "4" },
            format(gettext("Error: %(error)s"), { error: batchError(batch) })
        );
    } else {
        columns = [React.createElement(
            "td",
            { key: "state" },
            batchState(batch)
        ), React.createElement(
            "td",
            { key: "models" },
            results.models.length
        ), React.createElement(
            "td",
            { key: "errors" },
            results.errors.length
        ), React.createElement(
            "td",
            { key: "warnings" },
            results.warnings.length
        )];
    }

    return React.createElement(
        "tr",
        null,
        React.createElement(
            "td",
            null,
            React.createElement(
                "a",
                { href: batch.getURL(lang) },
                batch.fileName
            )
        ),
        React.createElement(
            "td",
            null,
            relativeDate(lang, batch.modified)
        ),
        columns
    );
};

ImageImport.contextTypes = childContextTypes;

const ImageImports = (props, { gettext }) => {
    const { imageImport } = props;

    return React.createElement(
        "div",
        { className: "responsive-table" },
        React.createElement(
            "table",
            { className: "table" },
            React.createElement(
                "thead",
                null,
                React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "th",
                        null,
                        gettext("File Name")
                    ),
                    React.createElement(
                        "th",
                        null,
                        gettext("Last Updated")
                    ),
                    React.createElement(
                        "th",
                        null,
                        gettext("Status")
                    ),
                    React.createElement(
                        "th",
                        null,
                        gettext("Images")
                    ),
                    React.createElement(
                        "th",
                        null,
                        gettext("Errors")
                    ),
                    React.createElement(
                        "th",
                        null,
                        gettext("Warnings")
                    )
                )
            ),
            React.createElement(
                "tbody",
                null,
                imageImport.map(batch => React.createElement(ImageImport, _extends({}, props, { batch: batch, key: batch._id })))
            )
        )
    );
};

ImageImports.propTypes = {
    dataImport: require("react").PropTypes.arrayOf(require("react").PropTypes.any).isRequired,
    imageImport: require("react").PropTypes.arrayOf(require("react").PropTypes.any).isRequired,
    batchError: require("react").PropTypes.func.isRequired,
    batchState: require("react").PropTypes.func.isRequired,
    source: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        getExpectedFiles: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getShortName: require("react").PropTypes.func.isRequired
    }).isRequired
};
ImageImports.contextTypes = childContextTypes;

const UploadImagesForm = ({ source }, { gettext, lang }) => React.createElement(
    "div",
    { className: "panel panel-default" },
    React.createElement(
        "div",
        { className: "panel-heading" },
        React.createElement(
            "h3",
            { className: "panel-title" },
            gettext("Upload Images")
        )
    ),
    React.createElement(
        "div",
        { className: "panel-body" },
        React.createElement(
            "form",
            { action: URL(lang, `/${source.type}/source/${source._id}/upload-images`),
                method: "POST", encType: "multipart/form-data"
            },
            React.createElement("input", { type: "hidden", name: "lang", value: lang }),
            React.createElement(
                "p",
                null,
                gettext("Upload a Zip file (.zip) of " + "JPG images (.jpg or .jpeg)."),
                " ",
                gettext("Names of images should match " + "the names provided in the metadata."),
                " ",
                gettext("After you've uploaded a new " + "batch of images they will be processed " + "immediately but their similarity to other " + "images will be computed in the background over " + "the subsequent hours and days.")
            ),
            React.createElement(
                "div",
                { className: "form-inline" },
                React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement("input", { type: "file", name: "zipField",
                        className: "form-control"
                    })
                ),
                " ",
                React.createElement("input", { type: "submit",
                    value: gettext("Upload"),
                    className: "btn btn-primary"
                })
            )
        )
    )
);

UploadImagesForm.propTypes = {
    dataImport: require("react").PropTypes.arrayOf(require("react").PropTypes.any).isRequired,
    imageImport: require("react").PropTypes.arrayOf(require("react").PropTypes.any).isRequired,
    batchError: require("react").PropTypes.func.isRequired,
    batchState: require("react").PropTypes.func.isRequired,
    source: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        getExpectedFiles: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getShortName: require("react").PropTypes.func.isRequired
    }).isRequired
};
UploadImagesForm.contextTypes = childContextTypes;

const DataImport = ({
    batch,
    batchError,
    batchState
}, {
    gettext,
    lang
}) => {
    const results = batch.getFilteredResults();
    let columns;

    if (batch.state === "error") {
        columns = React.createElement(
            "td",
            { colSpan: "7" },
            format(gettext("Error: %(error)s"), { error: batchError(batch) })
        );
    } else {
        columns = [batch.state === "process.completed" && React.createElement(
            "td",
            { key: "finalize" },
            React.createElement(
                "a",
                { href: batch.getURL(lang), className: "btn btn-success btn-xs" },
                gettext("Finalize Import")
            )
        ), batch.state !== "process.completed" && React.createElement(
            "td",
            { key: "state" },
            batchState(batch)
        ), React.createElement(
            "td",
            { key: "unprocessed" },
            results.unprocessed.length
        ), React.createElement(
            "td",
            { key: "created" },
            results.created.length
        ), React.createElement(
            "td",
            { key: "changed" },
            results.changed.length
        ), React.createElement(
            "td",
            { key: "deleted" },
            results.deleted.length
        ), React.createElement(
            "td",
            { key: "errors" },
            results.errors.length
        ), React.createElement(
            "td",
            { key: "warnings" },
            results.warnings.length
        )];
    }

    return React.createElement(
        "tr",
        null,
        React.createElement(
            "td",
            null,
            React.createElement(
                "a",
                { href: batch.getURL(lang) },
                batch.fileName
            )
        ),
        React.createElement(
            "td",
            null,
            relativeDate(lang, batch.modified)
        ),
        columns
    );
};

DataImport.contextTypes = childContextTypes;

const DataImports = (props, { gettext }) => {
    const { dataImport } = props;

    return React.createElement(
        "div",
        { className: "responsive-table" },
        React.createElement(
            "table",
            { className: "table" },
            React.createElement(
                "thead",
                null,
                React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "th",
                        null,
                        gettext("File Name")
                    ),
                    React.createElement(
                        "th",
                        null,
                        gettext("Last Updated")
                    ),
                    React.createElement(
                        "th",
                        null,
                        gettext("Status")
                    ),
                    React.createElement(
                        "th",
                        null,
                        gettext("Unprocessed")
                    ),
                    React.createElement(
                        "th",
                        null,
                        gettext("Created")
                    ),
                    React.createElement(
                        "th",
                        null,
                        gettext("Updated")
                    ),
                    React.createElement(
                        "th",
                        null,
                        gettext("Deleted")
                    ),
                    React.createElement(
                        "th",
                        null,
                        gettext("Errors")
                    ),
                    React.createElement(
                        "th",
                        null,
                        gettext("Warnings")
                    )
                )
            ),
            React.createElement(
                "tbody",
                null,
                dataImport.map(batch => React.createElement(DataImport, _extends({}, props, { batch: batch, key: batch._id })))
            )
        )
    );
};

DataImports.propTypes = {
    dataImport: require("react").PropTypes.arrayOf(require("react").PropTypes.any).isRequired,
    imageImport: require("react").PropTypes.arrayOf(require("react").PropTypes.any).isRequired,
    batchError: require("react").PropTypes.func.isRequired,
    batchState: require("react").PropTypes.func.isRequired,
    source: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        getExpectedFiles: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getShortName: require("react").PropTypes.func.isRequired
    }).isRequired
};
DataImports.contextTypes = childContextTypes;

const UploadDataForm = ({ source }, {
    gettext,
    lang
}) => React.createElement(
    "div",
    { className: "panel panel-default" },
    React.createElement(
        "div",
        { className: "panel-heading" },
        React.createElement(
            "h3",
            { className: "panel-title" },
            gettext("Upload Metadata")
        )
    ),
    React.createElement(
        "div",
        { className: "panel-body" },
        React.createElement(
            "form",
            { action: URL(lang, `/${source.type}/source/${source._id}/upload-data`),
                method: "POST", encType: "multipart/form-data"
            },
            React.createElement("input", { type: "hidden", name: "lang", value: lang }),
            source.getExpectedFiles().map((file, i) => React.createElement(
                "div",
                { key: `file${i}` },
                React.createElement(
                    "p",
                    null,
                    file
                ),
                React.createElement(
                    "div",
                    { className: "form-inline" },
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement("input", { type: "file", name: "files",
                            className: "form-control"
                        })
                    ),
                    " ",
                    source.getExpectedFiles().length - 1 === i && React.createElement("input", { type: "submit",
                        value: gettext("Upload"),
                        className: "btn btn-primary"
                    })
                )
            ))
        )
    )
);

UploadDataForm.propTypes = {
    dataImport: require("react").PropTypes.arrayOf(require("react").PropTypes.any).isRequired,
    imageImport: require("react").PropTypes.arrayOf(require("react").PropTypes.any).isRequired,
    batchError: require("react").PropTypes.func.isRequired,
    batchState: require("react").PropTypes.func.isRequired,
    source: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        getExpectedFiles: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getShortName: require("react").PropTypes.func.isRequired
    }).isRequired
};
UploadDataForm.contextTypes = childContextTypes;

const Admin = (props, {
    gettext,
    options,
    lang
}) => {
    const {
        imageImport,
        dataImport,
        source
    } = props;
    const hasImages = options.types[source.type].hasImages;
    const title = format(gettext("%(name)s Admin Area"), {
        name: source.getFullName(lang)
    });

    return React.createElement(
        Page,
        { title: title },
        React.createElement(
            "h1",
            null,
            title
        ),
        hasImages && React.createElement(UploadImagesForm, props),
        imageImport.length > 0 && React.createElement(ImageImports, props),
        React.createElement(UploadDataForm, props),
        dataImport.length > 0 && React.createElement(DataImports, props)
    );
};

Admin.propTypes = {
    dataImport: require("react").PropTypes.arrayOf(require("react").PropTypes.any).isRequired,
    imageImport: require("react").PropTypes.arrayOf(require("react").PropTypes.any).isRequired,
    batchError: require("react").PropTypes.func.isRequired,
    batchState: require("react").PropTypes.func.isRequired,
    source: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        getExpectedFiles: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getShortName: require("react").PropTypes.func.isRequired
    }).isRequired
};
Admin.contextTypes = childContextTypes;

module.exports = Admin;