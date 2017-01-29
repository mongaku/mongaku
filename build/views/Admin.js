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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92aWV3cy9BZG1pbi5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsInJlcXVpcmUiLCJvcHRpb25zIiwiUGFnZSIsImNoaWxkQ29udGV4dFR5cGVzIiwiSW1hZ2VJbXBvcnQiLCJiYXRjaCIsImJhdGNoRXJyb3IiLCJiYXRjaFN0YXRlIiwiZm9ybWF0IiwiZ2V0dGV4dCIsInJlbGF0aXZlRGF0ZSIsIlVSTCIsInJlc3VsdHMiLCJnZXRGaWx0ZXJlZFJlc3VsdHMiLCJjb2x1bW5zIiwic3RhdGUiLCJlcnJvciIsIm1vZGVscyIsImxlbmd0aCIsImVycm9ycyIsIndhcm5pbmdzIiwiZmlsZU5hbWUiLCJtb2RpZmllZCIsImNvbnRleHRUeXBlcyIsIkltYWdlSW1wb3J0cyIsInByb3BzIiwiaW1hZ2VJbXBvcnQiLCJtYXAiLCJfaWQiLCJVcGxvYWRJbWFnZXNGb3JtIiwic291cmNlIiwibGFuZyIsInR5cGUiLCJEYXRhSW1wb3J0IiwidW5wcm9jZXNzZWQiLCJjcmVhdGVkIiwiY2hhbmdlZCIsImRlbGV0ZWQiLCJEYXRhSW1wb3J0cyIsImRhdGFJbXBvcnQiLCJVcGxvYWREYXRhRm9ybSIsImdldEV4cGVjdGVkRmlsZXMiLCJmaWxlIiwiaSIsIkFkbWluIiwiZnVsbE5hbWUiLCJoYXNJbWFnZXMiLCJ0eXBlcyIsInRpdGxlIiwibmFtZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFFQSxJQUFNQSxRQUFRQyxRQUFRLE9BQVIsQ0FBZDs7QUFFQSxJQUFNQyxVQUFVRCxRQUFRLGdCQUFSLENBQWhCOztBQUVBLElBQU1FLE9BQU9GLFFBQVEsV0FBUixDQUFiOzs7O2VBRzRCQSxRQUFRLGNBQVIsQztJQUFyQkcsaUIsWUFBQUEsaUI7O0FBbUNQLElBQU1DLGNBQWMsU0FBZEEsV0FBYyxjQVNMO0FBQUEsUUFSWEMsS0FRVyxRQVJYQSxLQVFXO0FBQUEsUUFQWEMsVUFPVyxRQVBYQSxVQU9XO0FBQUEsUUFOWEMsVUFNVyxRQU5YQSxV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V3JCLE1BQVgsR0FBb0IsQ0FBcEIsSUFBeUIsb0JBQUMsV0FBRCxFQUFpQk8sS0FBakI7QUFMdkIsS0FBUDtBQU9ILENBdEJEOzs7Ozs7Ozs7Ozs7OztBQXdCQW1CLE1BQU1yQixZQUFOLEdBQXFCcEIsaUJBQXJCOztBQUVBK0MsT0FBT0MsT0FBUCxHQUFpQlAsS0FBakIiLCJmaWxlIjoiQWRtaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxuY29uc3Qgb3B0aW9ucyA9IHJlcXVpcmUoXCIuLi9saWIvb3B0aW9uc1wiKTtcblxuY29uc3QgUGFnZSA9IHJlcXVpcmUoXCIuL1BhZ2UuanNcIik7XG5cbmltcG9ydCB0eXBlIHtDb250ZXh0fSBmcm9tIFwiLi90eXBlcy5qc1wiO1xuY29uc3Qge2NoaWxkQ29udGV4dFR5cGVzfSA9IHJlcXVpcmUoXCIuL1dyYXBwZXIuanNcIik7XG5cbnR5cGUgUHJvcHMgPSB7XG4gICAgZGF0YUltcG9ydDogQXJyYXk8SW1wb3J0PixcbiAgICBpbWFnZUltcG9ydDogQXJyYXk8SW1wb3J0PixcbiAgICBiYXRjaEVycm9yOiAoYmF0Y2g6IEltcG9ydCkgPT4gc3RyaW5nLFxuICAgIGJhdGNoU3RhdGU6IChiYXRjaDogSW1wb3J0KSA9PiBzdHJpbmcsXG4gICAgc291cmNlOiB7XG4gICAgICAgIF9pZDogc3RyaW5nLFxuICAgICAgICB0eXBlOiBzdHJpbmcsXG4gICAgICAgIGdldEV4cGVjdGVkRmlsZXM6ICgpID0+IEFycmF5PHN0cmluZz4sXG4gICAgICAgIGdldFVSTDogKGxhbmc6IHN0cmluZykgPT4gc3RyaW5nLFxuICAgIH0sXG59O1xuXG50eXBlIEltcG9ydCA9IHtcbiAgICBfaWQ6IHN0cmluZyxcbiAgICBlcnJvcj86IHN0cmluZyxcbiAgICBmaWxlTmFtZTogc3RyaW5nLFxuICAgIGdldEZpbHRlcmVkUmVzdWx0czogKCkgPT4gSW1wb3J0UmVzdWx0cyxcbiAgICBnZXRVUkw6IChsYW5nOiBzdHJpbmcpID0+IHN0cmluZyxcbiAgICBtb2RpZmllZDogRGF0ZSxcbiAgICBzdGF0ZTogc3RyaW5nLFxufTtcblxudHlwZSBJbXBvcnRSZXN1bHRzID0ge1xuICAgIG1vZGVsczogW10sXG4gICAgdW5wcm9jZXNzZWQ6IFtdLFxuICAgIGNyZWF0ZWQ6IFtdLFxuICAgIGNoYW5nZWQ6IFtdLFxuICAgIGRlbGV0ZWQ6IFtdLFxuICAgIGVycm9yczogW10sXG4gICAgd2FybmluZ3M6IFtdLFxufTtcblxuY29uc3QgSW1hZ2VJbXBvcnQgPSAoe1xuICAgIGJhdGNoLFxuICAgIGJhdGNoRXJyb3IsXG4gICAgYmF0Y2hTdGF0ZSxcbn06IFByb3BzICYge2JhdGNoOiBJbXBvcnR9LCB7XG4gICAgZm9ybWF0LFxuICAgIGdldHRleHQsXG4gICAgcmVsYXRpdmVEYXRlLFxuICAgIFVSTCxcbn06IENvbnRleHQpID0+IHtcbiAgICBjb25zdCByZXN1bHRzID0gYmF0Y2guZ2V0RmlsdGVyZWRSZXN1bHRzKCk7XG4gICAgbGV0IGNvbHVtbnM7XG5cbiAgICBpZiAoYmF0Y2guc3RhdGUgPT09IFwiZXJyb3JcIikge1xuICAgICAgICBjb2x1bW5zID0gPHRkIGNvbFNwYW49XCI0XCI+XG4gICAgICAgICAgICB7Zm9ybWF0KGdldHRleHQoXCJFcnJvcjogJShlcnJvcilzXCIpLFxuICAgICAgICAgICAgICAgIHtlcnJvcjogYmF0Y2hFcnJvcihiYXRjaCl9KX1cbiAgICAgICAgPC90ZD47XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29sdW1ucyA9IFtcbiAgICAgICAgICAgIDx0ZCBrZXk9XCJzdGF0ZVwiPntiYXRjaFN0YXRlKGJhdGNoKX08L3RkPixcbiAgICAgICAgICAgIDx0ZCBrZXk9XCJtb2RlbHNcIj57cmVzdWx0cy5tb2RlbHMubGVuZ3RofTwvdGQ+LFxuICAgICAgICAgICAgPHRkIGtleT1cImVycm9yc1wiPntyZXN1bHRzLmVycm9ycy5sZW5ndGh9PC90ZD4sXG4gICAgICAgICAgICA8dGQga2V5PVwid2FybmluZ3NcIj57cmVzdWx0cy53YXJuaW5ncy5sZW5ndGh9PC90ZD4sXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgcmV0dXJuIDx0cj5cbiAgICAgICAgPHRkPjxhIGhyZWY9e1VSTChiYXRjaCl9PntiYXRjaC5maWxlTmFtZX08L2E+PC90ZD5cbiAgICAgICAgPHRkPntyZWxhdGl2ZURhdGUoYmF0Y2gubW9kaWZpZWQpfTwvdGQ+XG4gICAgICAgIHtjb2x1bW5zfVxuICAgIDwvdHI+O1xufTtcblxuSW1hZ2VJbXBvcnQuY29udGV4dFR5cGVzID0gY2hpbGRDb250ZXh0VHlwZXM7XG5cbmNvbnN0IEltYWdlSW1wb3J0cyA9IChwcm9wczogUHJvcHMsIHtnZXR0ZXh0fTogQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IHtpbWFnZUltcG9ydH0gPSBwcm9wcztcblxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cInJlc3BvbnNpdmUtdGFibGVcIj5cbiAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInRhYmxlXCI+XG4gICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICA8dGg+e2dldHRleHQoXCJGaWxlIE5hbWVcIil9PC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoPntnZXR0ZXh0KFwiTGFzdCBVcGRhdGVkXCIpfTwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aD57Z2V0dGV4dChcIlN0YXR1c1wiKX08L3RoPlxuICAgICAgICAgICAgICAgICAgICA8dGg+e2dldHRleHQoXCJJbWFnZXNcIil9PC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoPntnZXR0ZXh0KFwiRXJyb3JzXCIpfTwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aD57Z2V0dGV4dChcIldhcm5pbmdzXCIpfTwvdGg+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAge2ltYWdlSW1wb3J0Lm1hcCgoYmF0Y2gpID0+XG4gICAgICAgICAgICAgICAgICAgIDxJbWFnZUltcG9ydCB7Li4ucHJvcHN9IGJhdGNoPXtiYXRjaH0ga2V5PXtiYXRjaC5faWR9IC8+KX1cbiAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgIDwvdGFibGU+XG4gICAgPC9kaXY+O1xufTtcblxuSW1hZ2VJbXBvcnRzLmNvbnRleHRUeXBlcyA9IGNoaWxkQ29udGV4dFR5cGVzO1xuXG5jb25zdCBVcGxvYWRJbWFnZXNGb3JtID0gKHtzb3VyY2V9OiBQcm9wcyxcbiAgICAgICAge2dldHRleHQsIGxhbmcsIFVSTH06IENvbnRleHQpID0+IDxkaXYgY2xhc3NOYW1lPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPlxuICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtaGVhZGluZ1wiPlxuICAgICAgICA8aDMgY2xhc3NOYW1lPVwicGFuZWwtdGl0bGVcIj5cbiAgICAgICAgICAgIHtnZXR0ZXh0KFwiVXBsb2FkIEltYWdlc1wiKX1cbiAgICAgICAgPC9oMz5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWJvZHlcIj5cbiAgICAgICAgPGZvcm0gYWN0aW9uPXtVUkwoXG4gICAgICAgICAgICAgICAgYC8ke3NvdXJjZS50eXBlfS9zb3VyY2UvJHtzb3VyY2UuX2lkfS91cGxvYWQtaW1hZ2VzYCl9XG4gICAgICAgICAgICBtZXRob2Q9XCJQT1NUXCIgZW5jVHlwZT1cIm11bHRpcGFydC9mb3JtLWRhdGFcIlxuICAgICAgICA+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJsYW5nXCIgdmFsdWU9e2xhbmd9Lz5cbiAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgIHtnZXR0ZXh0KFwiVXBsb2FkIGEgWmlwIGZpbGUgKC56aXApIG9mIFwiICtcbiAgICAgICAgICAgICAgICAgICAgXCJKUEcgaW1hZ2VzICguanBnIG9yIC5qcGVnKS5cIil9XG4gICAgICAgICAgICAgICAge1wiIFwifVxuICAgICAgICAgICAgICAgIHtnZXR0ZXh0KFwiTmFtZXMgb2YgaW1hZ2VzIHNob3VsZCBtYXRjaCBcIiArXG4gICAgICAgICAgICAgICAgICAgIFwidGhlIG5hbWVzIHByb3ZpZGVkIGluIHRoZSBtZXRhZGF0YS5cIil9XG4gICAgICAgICAgICAgICAge1wiIFwifVxuICAgICAgICAgICAgICAgIHtnZXR0ZXh0KFwiQWZ0ZXIgeW91J3ZlIHVwbG9hZGVkIGEgbmV3IFwiICtcbiAgICAgICAgICAgICAgICAgICAgXCJiYXRjaCBvZiBpbWFnZXMgdGhleSB3aWxsIGJlIHByb2Nlc3NlZCBcIiArXG4gICAgICAgICAgICAgICAgICAgIFwiaW1tZWRpYXRlbHkgYnV0IHRoZWlyIHNpbWlsYXJpdHkgdG8gb3RoZXIgXCIgK1xuICAgICAgICAgICAgICAgICAgICBcImltYWdlcyB3aWxsIGJlIGNvbXB1dGVkIGluIHRoZSBiYWNrZ3JvdW5kIG92ZXIgXCIgK1xuICAgICAgICAgICAgICAgICAgICBcInRoZSBzdWJzZXF1ZW50IGhvdXJzIGFuZCBkYXlzLlwiKX1cbiAgICAgICAgICAgIDwvcD5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWlubGluZVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBuYW1lPVwiemlwRmllbGRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB7XCIgXCJ9XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJzdWJtaXRcIlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Z2V0dGV4dChcIlVwbG9hZFwiKX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZm9ybT5cbiAgICA8L2Rpdj5cbjwvZGl2PjtcblxuVXBsb2FkSW1hZ2VzRm9ybS5jb250ZXh0VHlwZXMgPSBjaGlsZENvbnRleHRUeXBlcztcblxuY29uc3QgRGF0YUltcG9ydCA9ICh7XG4gICAgYmF0Y2gsXG4gICAgYmF0Y2hFcnJvcixcbiAgICBiYXRjaFN0YXRlLFxufTogUHJvcHMgJiB7YmF0Y2g6IEltcG9ydH0sIHtcbiAgICBmb3JtYXQsXG4gICAgZ2V0dGV4dCxcbiAgICByZWxhdGl2ZURhdGUsXG4gICAgVVJMLFxufTogQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdHMgPSBiYXRjaC5nZXRGaWx0ZXJlZFJlc3VsdHMoKTtcbiAgICBsZXQgY29sdW1ucztcblxuICAgIGlmIChiYXRjaC5zdGF0ZSA9PT0gXCJlcnJvclwiKSB7XG4gICAgICAgIGNvbHVtbnMgPSA8dGQgY29sU3Bhbj1cIjdcIj5cbiAgICAgICAgICAgIHtmb3JtYXQoZ2V0dGV4dChcIkVycm9yOiAlKGVycm9yKXNcIiksXG4gICAgICAgICAgICAgICAge2Vycm9yOiBiYXRjaEVycm9yKGJhdGNoKX0pfVxuICAgICAgICA8L3RkPjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb2x1bW5zID0gW1xuICAgICAgICAgICAgYmF0Y2guc3RhdGUgPT09IFwicHJvY2Vzcy5jb21wbGV0ZWRcIiAmJiA8dGQga2V5PVwiZmluYWxpemVcIj5cbiAgICAgICAgICAgICAgICA8YSBocmVmPXtVUkwoYmF0Y2gpfSBjbGFzc05hbWU9XCJidG4gYnRuLXN1Y2Nlc3MgYnRuLXhzXCI+XG4gICAgICAgICAgICAgICAgICAgIHtnZXR0ZXh0KFwiRmluYWxpemUgSW1wb3J0XCIpfVxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvdGQ+LFxuICAgICAgICAgICAgYmF0Y2guc3RhdGUgIT09IFwicHJvY2Vzcy5jb21wbGV0ZWRcIiAmJlxuICAgICAgICAgICAgICAgIDx0ZCBrZXk9XCJzdGF0ZVwiPntiYXRjaFN0YXRlKGJhdGNoKX08L3RkPixcbiAgICAgICAgICAgIDx0ZCBrZXk9XCJ1bnByb2Nlc3NlZFwiPntyZXN1bHRzLnVucHJvY2Vzc2VkLmxlbmd0aH08L3RkPixcbiAgICAgICAgICAgIDx0ZCBrZXk9XCJjcmVhdGVkXCI+e3Jlc3VsdHMuY3JlYXRlZC5sZW5ndGh9PC90ZD4sXG4gICAgICAgICAgICA8dGQga2V5PVwiY2hhbmdlZFwiPntyZXN1bHRzLmNoYW5nZWQubGVuZ3RofTwvdGQ+LFxuICAgICAgICAgICAgPHRkIGtleT1cImRlbGV0ZWRcIj57cmVzdWx0cy5kZWxldGVkLmxlbmd0aH08L3RkPixcbiAgICAgICAgICAgIDx0ZCBrZXk9XCJlcnJvcnNcIj57cmVzdWx0cy5lcnJvcnMubGVuZ3RofTwvdGQ+LFxuICAgICAgICAgICAgPHRkIGtleT1cIndhcm5pbmdzXCI+e3Jlc3VsdHMud2FybmluZ3MubGVuZ3RofTwvdGQ+LFxuICAgICAgICBdO1xuICAgIH1cblxuICAgIHJldHVybiA8dHI+XG4gICAgICAgIDx0ZD48YSBocmVmPXtVUkwoYmF0Y2gpfT57YmF0Y2guZmlsZU5hbWV9PC9hPjwvdGQ+XG4gICAgICAgIDx0ZD57cmVsYXRpdmVEYXRlKGJhdGNoLm1vZGlmaWVkKX08L3RkPlxuICAgICAgICB7Y29sdW1uc31cbiAgICA8L3RyPjtcbn07XG5cbkRhdGFJbXBvcnQuY29udGV4dFR5cGVzID0gY2hpbGRDb250ZXh0VHlwZXM7XG5cbmNvbnN0IERhdGFJbXBvcnRzID0gKHByb3BzOiBQcm9wcywge2dldHRleHR9OiBDb250ZXh0KSA9PiB7XG4gICAgY29uc3Qge2RhdGFJbXBvcnR9ID0gcHJvcHM7XG5cbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJyZXNwb25zaXZlLXRhYmxlXCI+XG4gICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJ0YWJsZVwiPlxuICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgPHRoPntnZXR0ZXh0KFwiRmlsZSBOYW1lXCIpfTwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aD57Z2V0dGV4dChcIkxhc3QgVXBkYXRlZFwiKX08L3RoPlxuICAgICAgICAgICAgICAgICAgICA8dGg+e2dldHRleHQoXCJTdGF0dXNcIil9PC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoPntnZXR0ZXh0KFwiVW5wcm9jZXNzZWRcIil9PC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoPntnZXR0ZXh0KFwiQ3JlYXRlZFwiKX08L3RoPlxuICAgICAgICAgICAgICAgICAgICA8dGg+e2dldHRleHQoXCJVcGRhdGVkXCIpfTwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aD57Z2V0dGV4dChcIkRlbGV0ZWRcIil9PC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoPntnZXR0ZXh0KFwiRXJyb3JzXCIpfTwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDx0aD57Z2V0dGV4dChcIldhcm5pbmdzXCIpfTwvdGg+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAge2RhdGFJbXBvcnQubWFwKChiYXRjaCkgPT5cbiAgICAgICAgICAgICAgICAgICAgPERhdGFJbXBvcnQgey4uLnByb3BzfSBiYXRjaD17YmF0Y2h9IGtleT17YmF0Y2guX2lkfSAvPil9XG4gICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuICAgIDwvZGl2Pjtcbn07XG5cbkRhdGFJbXBvcnRzLmNvbnRleHRUeXBlcyA9IGNoaWxkQ29udGV4dFR5cGVzO1xuXG5jb25zdCBVcGxvYWREYXRhRm9ybSA9ICh7c291cmNlfTogUHJvcHMsIHtcbiAgICBnZXR0ZXh0LFxuICAgIGxhbmcsXG4gICAgVVJMLFxufTogQ29udGV4dCkgPT4gPGRpdiBjbGFzc05hbWU9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCI+XG4gICAgICAgIDxoMyBjbGFzc05hbWU9XCJwYW5lbC10aXRsZVwiPlxuICAgICAgICAgICAge2dldHRleHQoXCJVcGxvYWQgTWV0YWRhdGFcIil9XG4gICAgICAgIDwvaDM+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1ib2R5XCI+XG4gICAgICAgIDxmb3JtIGFjdGlvbj17VVJMKFxuICAgICAgICAgICAgICAgIGAvJHtzb3VyY2UudHlwZX0vc291cmNlLyR7c291cmNlLl9pZH0vdXBsb2FkLWRhdGFgKX1cbiAgICAgICAgICAgIG1ldGhvZD1cIlBPU1RcIiBlbmNUeXBlPVwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiXG4gICAgICAgID5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImxhbmdcIiB2YWx1ZT17bGFuZ30vPlxuICAgICAgICAgICAge3NvdXJjZS5nZXRFeHBlY3RlZEZpbGVzKCkubWFwKChmaWxlLCBpKSA9PiA8ZGl2IGtleT17YGZpbGUke2l9YH0+XG4gICAgICAgICAgICAgICAgPHA+e2ZpbGV9PC9wPlxuXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWlubGluZVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIG5hbWU9XCJmaWxlc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICB7XCIgXCJ9XG4gICAgICAgICAgICAgICAgICAgIHtzb3VyY2UuZ2V0RXhwZWN0ZWRGaWxlcygpLmxlbmd0aCAtIDEgPT09IGkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Z2V0dGV4dChcIlVwbG9hZFwiKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgLz59XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj4pfVxuICAgICAgICA8L2Zvcm0+XG4gICAgPC9kaXY+XG48L2Rpdj47XG5cblVwbG9hZERhdGFGb3JtLmNvbnRleHRUeXBlcyA9IGNoaWxkQ29udGV4dFR5cGVzO1xuXG5jb25zdCBBZG1pbiA9IChwcm9wczogUHJvcHMsIHtcbiAgICBmb3JtYXQsXG4gICAgZ2V0dGV4dCxcbiAgICBmdWxsTmFtZSxcbn06IENvbnRleHQpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICAgIGltYWdlSW1wb3J0LFxuICAgICAgICBkYXRhSW1wb3J0LFxuICAgICAgICBzb3VyY2UsXG4gICAgfSA9IHByb3BzO1xuICAgIGNvbnN0IGhhc0ltYWdlcyA9IG9wdGlvbnMudHlwZXNbc291cmNlLnR5cGVdLmhhc0ltYWdlcygpO1xuICAgIGNvbnN0IHRpdGxlID0gZm9ybWF0KGdldHRleHQoXCIlKG5hbWUpcyBBZG1pbiBBcmVhXCIpLCB7XG4gICAgICAgIG5hbWU6IGZ1bGxOYW1lKHNvdXJjZSksXG4gICAgfSk7XG5cbiAgICByZXR1cm4gPFBhZ2UgdGl0bGU9e3RpdGxlfT5cbiAgICAgICAgPGgxPnt0aXRsZX08L2gxPlxuICAgICAgICB7aGFzSW1hZ2VzICYmIDxVcGxvYWRJbWFnZXNGb3JtIHsuLi5wcm9wc30gLz59XG4gICAgICAgIHtpbWFnZUltcG9ydC5sZW5ndGggPiAwICYmIDxJbWFnZUltcG9ydHMgey4uLnByb3BzfSAvPn1cbiAgICAgICAgPFVwbG9hZERhdGFGb3JtIHsuLi5wcm9wc30gLz5cbiAgICAgICAge2RhdGFJbXBvcnQubGVuZ3RoID4gMCAmJiA8RGF0YUltcG9ydHMgey4uLnByb3BzfSAvPn1cbiAgICA8L1BhZ2U+O1xufTtcblxuQWRtaW4uY29udGV4dFR5cGVzID0gY2hpbGRDb250ZXh0VHlwZXM7XG5cbm1vZHVsZS5leHBvcnRzID0gQWRtaW47XG4iXX0=