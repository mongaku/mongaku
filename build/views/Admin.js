"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react");

var options = require("../lib/options");

var Page = require("./Page.js");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

var _require = require("./Wrapper.js"),
    childContextTypes = _require.childContextTypes;

var ImageImport = function ImageImport(_ref, _ref2) {
    var batch = _ref.batch,
        batchError = _ref.batchError,
        batchState = _ref.batchState;
    var format = _ref2.format,
        gettext = _ref2.gettext,
        relativeDate = _ref2.relativeDate,
        URL = _ref2.URL;

    var results = batch.getFilteredResults();
    var columns = void 0;

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
                { href: URL(batch) },
                batch.fileName
            )
        ),
        React.createElement(
            "td",
            null,
            relativeDate(batch.modified)
        ),
        columns
    );
};

ImageImport.contextTypes = childContextTypes;

var ImageImports = function ImageImports(props, _ref3) {
    var gettext = _ref3.gettext;
    var imageImport = props.imageImport;


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
                imageImport.map(function (batch) {
                    return React.createElement(ImageImport, _extends({}, props, { batch: batch, key: batch._id }));
                })
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
        getURL: require("react").PropTypes.func.isRequired
    }).isRequired
};
ImageImports.contextTypes = childContextTypes;

var UploadImagesForm = function UploadImagesForm(_ref4, _ref5) {
    var source = _ref4.source;
    var gettext = _ref5.gettext,
        lang = _ref5.lang,
        URL = _ref5.URL;
    return React.createElement(
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
                { action: URL("/" + source.type + "/source/" + source._id + "/upload-images"),
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
};

UploadImagesForm.propTypes = {
    dataImport: require("react").PropTypes.arrayOf(require("react").PropTypes.any).isRequired,
    imageImport: require("react").PropTypes.arrayOf(require("react").PropTypes.any).isRequired,
    batchError: require("react").PropTypes.func.isRequired,
    batchState: require("react").PropTypes.func.isRequired,
    source: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        getExpectedFiles: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    }).isRequired
};
UploadImagesForm.contextTypes = childContextTypes;

var DataImport = function DataImport(_ref6, _ref7) {
    var batch = _ref6.batch,
        batchError = _ref6.batchError,
        batchState = _ref6.batchState;
    var format = _ref7.format,
        gettext = _ref7.gettext,
        relativeDate = _ref7.relativeDate,
        URL = _ref7.URL;

    var results = batch.getFilteredResults();
    var columns = void 0;

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
                { href: URL(batch), className: "btn btn-success btn-xs" },
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
                { href: URL(batch) },
                batch.fileName
            )
        ),
        React.createElement(
            "td",
            null,
            relativeDate(batch.modified)
        ),
        columns
    );
};

DataImport.contextTypes = childContextTypes;

var DataImports = function DataImports(props, _ref8) {
    var gettext = _ref8.gettext;
    var dataImport = props.dataImport;


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
                dataImport.map(function (batch) {
                    return React.createElement(DataImport, _extends({}, props, { batch: batch, key: batch._id }));
                })
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
        getURL: require("react").PropTypes.func.isRequired
    }).isRequired
};
DataImports.contextTypes = childContextTypes;

var UploadDataForm = function UploadDataForm(_ref9, _ref10) {
    var source = _ref9.source;
    var gettext = _ref10.gettext,
        lang = _ref10.lang,
        URL = _ref10.URL;
    return React.createElement(
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
                { action: URL("/" + source.type + "/source/" + source._id + "/upload-data"),
                    method: "POST", encType: "multipart/form-data"
                },
                React.createElement("input", { type: "hidden", name: "lang", value: lang }),
                source.getExpectedFiles().map(function (file, i) {
                    return React.createElement(
                        "div",
                        { key: "file" + i },
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
                    );
                })
            )
        )
    );
};

UploadDataForm.propTypes = {
    dataImport: require("react").PropTypes.arrayOf(require("react").PropTypes.any).isRequired,
    imageImport: require("react").PropTypes.arrayOf(require("react").PropTypes.any).isRequired,
    batchError: require("react").PropTypes.func.isRequired,
    batchState: require("react").PropTypes.func.isRequired,
    source: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        getExpectedFiles: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    }).isRequired
};
UploadDataForm.contextTypes = childContextTypes;

var Admin = function Admin(props, _ref11) {
    var format = _ref11.format,
        gettext = _ref11.gettext,
        fullName = _ref11.fullName;
    var imageImport = props.imageImport,
        dataImport = props.dataImport,
        source = props.source;

    var hasImages = options.types[source.type].hasImages();
    var title = format(gettext("%(name)s Admin Area"), {
        name: fullName(source)
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
        getURL: require("react").PropTypes.func.isRequired
    }).isRequired
};
Admin.contextTypes = childContextTypes;

module.exports = Admin;