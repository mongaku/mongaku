"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react");

var metadata = require("../lib/metadata");
var options = require("../lib/options");

var Page = require("./Page.js");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

var _require = require("./Wrapper.js"),
    childContextTypes = _require.childContextTypes;

var Image = function Image(_ref, _ref2) {
    var image = _ref.image,
        record = _ref.record,
        title = _ref.title;
    var lang = _ref2.lang,
        gettext = _ref2.gettext;
    return React.createElement(
        "div",
        { className: "img col-md-4 col-xs-12 col-sm-6", key: image._id },
        React.createElement(
            "a",
            { href: image.getOriginalURL() },
            React.createElement("img", { src: image.getScaledURL(),
                alt: title,
                title: title,
                className: "img-responsive center-block"
            })
        ),
        React.createElement(
            "div",
            { className: "details reduced" },
            React.createElement(
                "form",
                {
                    action: record && record.getRemoveImageURL(lang),
                    method: "POST",
                    encType: "multipart/form-data"
                },
                React.createElement("input", {
                    type: "hidden",
                    name: "lang",
                    value: lang
                }),
                React.createElement("input", {
                    type: "hidden",
                    name: "image",
                    value: image._id
                }),
                React.createElement(
                    "button",
                    {
                        type: "submit",
                        className: "btn btn-danger btn-xs"
                    },
                    React.createElement("span", {
                        className: "glyphicon glyphicon-remove",
                        "aria-hidden": "true"
                    }),
                    " ",
                    gettext("Remove Image")
                )
            )
        )
    );
};

Image.contextTypes = childContextTypes;

var Title = function Title(_ref3) {
    var title = _ref3.title;
    return React.createElement(
        "tr",
        { className: "plain" },
        React.createElement("th", null),
        React.createElement(
            "th",
            { className: "col-xs-12 text-center" },
            React.createElement(
                "h1",
                { className: "panel-title" },
                title
            )
        )
    );
};

Title.propTypes = {
    title: require("react").PropTypes.string.isRequired
};
var Images = function Images(props) {
    var record = props.record,
        title = props.title;


    return React.createElement(
        "tr",
        { className: "plain" },
        React.createElement("td", null),
        React.createElement(
            "td",
            null,
            React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    null,
                    record && record.images.map(function (image) {
                        return React.createElement(Image, _extends({}, props, {
                            image: image,
                            title: title
                        }));
                    })
                )
            )
        )
    );
};

var ImageForm = function ImageForm(props, _ref4) {
    var gettext = _ref4.gettext;
    return React.createElement(
        "tr",
        null,
        React.createElement(
            "th",
            { className: "text-right" },
            gettext("Add Images")
        ),
        React.createElement(
            "td",
            null,
            React.createElement("input", {
                type: "file",
                name: "images",
                className: "form-control",
                multiple: true
            })
        )
    );
};

ImageForm.contextTypes = childContextTypes;

var IDForm = function IDForm(_ref5, _ref6) {
    var record = _ref5.record,
        type = _ref5.type;
    var gettext = _ref6.gettext;

    if (options.types[type].autoID || record && record._id) {
        return null;
    }

    return React.createElement(
        "tr",
        { className: "has-error" },
        React.createElement(
            "th",
            { className: "text-right" },
            React.createElement(
                "label",
                { className: "control-label" },
                gettext("ID")
            )
        ),
        React.createElement(
            "td",
            null,
            React.createElement("input", {
                type: "text",
                name: "id",
                className: "form-control",
                "data-id": "true",
                defaultValue: record && record.id
            })
        )
    );
};

IDForm.propTypes = {
    dynamicValues: require("react").PropTypes.shape({}).isRequired,
    globalFacets: require("react").PropTypes.shape({}),
    mode: require("react").PropTypes.oneOf(["create", "edit", "clone"]).isRequired,
    record: require("react").PropTypes.any,
    type: require("react").PropTypes.string.isRequired
};
IDForm.contextTypes = childContextTypes;

var Contents = function Contents(props, _ref7) {
    var gettext = _ref7.gettext;
    var type = props.type,
        globalFacets = props.globalFacets,
        dynamicValues = props.dynamicValues;

    var model = metadata.model(type);
    var types = Object.keys(options.types[type].model);
    var hasPrivate = false;

    var fields = types.map(function (type) {
        var typeSchema = model[type];
        var dynamicValue = dynamicValues[type];
        var values = (globalFacets && globalFacets[type] || []).map(function (bucket) {
            return bucket.text;
        }).sort();
        var isPrivate = typeSchema.options.private;

        hasPrivate = hasPrivate || isPrivate;

        return React.createElement(
            "tr",
            { key: type },
            React.createElement(
                "th",
                { className: "text-right" },
                typeSchema.options.title({ gettext: gettext })
            ),
            React.createElement(
                "td",
                { "data-private": isPrivate },
                typeSchema.renderEdit(dynamicValue, values, { gettext: gettext })
            )
        );
    });

    if (hasPrivate) {
        fields.push(React.createElement(
            "tr",
            { key: "private" },
            React.createElement("th", null),
            React.createElement(
                "td",
                null,
                React.createElement(
                    "label",
                    null,
                    React.createElement("input", {
                        type: "checkbox",
                        className: "toggle-private"
                    }),
                    " ",
                    gettext("Show private fields.")
                )
            )
        ));
    }

    return React.createElement(
        "tbody",
        null,
        !options.types[type].noImages && React.createElement(ImageForm, props),
        React.createElement(IDForm, props),
        fields,
        React.createElement(SubmitButton, props)
    );
};

Contents.propTypes = {
    dynamicValues: require("react").PropTypes.shape({}).isRequired,
    globalFacets: require("react").PropTypes.shape({}),
    mode: require("react").PropTypes.oneOf(["create", "edit", "clone"]).isRequired,
    record: require("react").PropTypes.any,
    type: require("react").PropTypes.string.isRequired
};
Contents.contextTypes = childContextTypes;

var SubmitButton = function SubmitButton(_ref8, _ref9) {
    var mode = _ref8.mode;
    var gettext = _ref9.gettext;

    var buttonText = gettext("Update");

    if (mode === "create") {
        buttonText = gettext("Create");
    } else if (mode === "clone") {
        buttonText = gettext("Clone");
    }

    return React.createElement(
        "tr",
        null,
        React.createElement("th", null),
        React.createElement(
            "td",
            null,
            React.createElement("input", {
                type: "submit",
                value: buttonText,
                className: "btn btn-primary"
            })
        )
    );
};

SubmitButton.propTypes = {
    dynamicValues: require("react").PropTypes.shape({}).isRequired,
    globalFacets: require("react").PropTypes.shape({}),
    mode: require("react").PropTypes.oneOf(["create", "edit", "clone"]).isRequired,
    record: require("react").PropTypes.any,
    type: require("react").PropTypes.string.isRequired
};
SubmitButton.contextTypes = childContextTypes;

var CloneButton = function CloneButton(_ref10, _ref11) {
    var record = _ref10.record,
        mode = _ref10.mode;
    var gettext = _ref11.gettext,
        lang = _ref11.lang;
    return React.createElement(
        "div",
        { className: "row" },
        React.createElement(
            "a",
            {
                href: record && record.getCloneURL(lang),
                className: "btn btn-primary pull-right"
            },
            gettext("Clone Record")
        )
    );
};

CloneButton.propTypes = {
    dynamicValues: require("react").PropTypes.shape({}).isRequired,
    globalFacets: require("react").PropTypes.shape({}),
    mode: require("react").PropTypes.oneOf(["create", "edit", "clone"]).isRequired,
    record: require("react").PropTypes.any,
    type: require("react").PropTypes.string.isRequired
};
CloneButton.contextTypes = childContextTypes;

var EditRecord = function EditRecord(props, _ref12) {
    var lang = _ref12.lang,
        format = _ref12.format,
        gettext = _ref12.gettext;
    var record = props.record,
        type = props.type,
        mode = props.mode;

    var postURL = record ? record._id ? record.getEditURL(lang) : record.getCreateURL(lang) : "";

    var title = "";

    if (!record || mode === "create") {
        title = format(gettext("%(recordName)s: Create New"), {
            recordName: options.types[type].name({ gettext: gettext })
        });
    } else {
        var recordTitle = options.types[type].recordTitle(record, { gettext: gettext });

        if (mode === "clone") {
            title = format(gettext("Cloning '%(recordTitle)s'"), { recordTitle: recordTitle });
        } else {
            title = format(gettext("Updating '%(recordTitle)s'"), { recordTitle: recordTitle });
        }
    }

    return React.createElement(
        Page,
        { title: title },
        mode === "edit" && React.createElement(CloneButton, props),
        React.createElement(
            "div",
            { className: "row" },
            React.createElement(
                "div",
                { className: "col-md-12 imageholder" },
                React.createElement(
                    "form",
                    {
                        action: postURL,
                        method: "POST",
                        encType: "multipart/form-data",
                        "data-validate": true
                    },
                    React.createElement("input", { type: "hidden", name: "lang", value: lang }),
                    React.createElement(
                        "div",
                        { className: "responsive-table" },
                        React.createElement(
                            "table",
                            { className: "table table-hover" },
                            React.createElement(
                                "thead",
                                null,
                                React.createElement(Title, { title: title }),
                                React.createElement(Images, _extends({}, props, { title: title }))
                            ),
                            React.createElement(Contents, props)
                        )
                    )
                )
            )
        )
    );
};

EditRecord.propTypes = {
    dynamicValues: require("react").PropTypes.shape({}).isRequired,
    globalFacets: require("react").PropTypes.shape({}),
    mode: require("react").PropTypes.oneOf(["create", "edit", "clone"]).isRequired,
    record: require("react").PropTypes.any,
    type: require("react").PropTypes.string.isRequired
};
EditRecord.contextTypes = childContextTypes;

module.exports = EditRecord;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92aWV3cy9FZGl0UmVjb3JkLmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwicmVxdWlyZSIsIm1ldGFkYXRhIiwib3B0aW9ucyIsIlBhZ2UiLCJjaGlsZENvbnRleHRUeXBlcyIsIkltYWdlIiwiaW1hZ2UiLCJyZWNvcmQiLCJ0aXRsZSIsImxhbmciLCJnZXR0ZXh0IiwiX2lkIiwiZ2V0T3JpZ2luYWxVUkwiLCJnZXRTY2FsZWRVUkwiLCJnZXRSZW1vdmVJbWFnZVVSTCIsImNvbnRleHRUeXBlcyIsIlRpdGxlIiwiSW1hZ2VzIiwicHJvcHMiLCJpbWFnZXMiLCJtYXAiLCJJbWFnZUZvcm0iLCJJREZvcm0iLCJ0eXBlIiwidHlwZXMiLCJhdXRvSUQiLCJpZCIsIkNvbnRlbnRzIiwiZ2xvYmFsRmFjZXRzIiwiZHluYW1pY1ZhbHVlcyIsIm1vZGVsIiwiT2JqZWN0Iiwia2V5cyIsImhhc1ByaXZhdGUiLCJmaWVsZHMiLCJ0eXBlU2NoZW1hIiwiZHluYW1pY1ZhbHVlIiwidmFsdWVzIiwiYnVja2V0IiwidGV4dCIsInNvcnQiLCJpc1ByaXZhdGUiLCJwcml2YXRlIiwicmVuZGVyRWRpdCIsInB1c2giLCJub0ltYWdlcyIsIlN1Ym1pdEJ1dHRvbiIsIm1vZGUiLCJidXR0b25UZXh0IiwiQ2xvbmVCdXR0b24iLCJnZXRDbG9uZVVSTCIsIkVkaXRSZWNvcmQiLCJmb3JtYXQiLCJwb3N0VVJMIiwiZ2V0RWRpdFVSTCIsImdldENyZWF0ZVVSTCIsInJlY29yZE5hbWUiLCJuYW1lIiwicmVjb3JkVGl0bGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBRUEsSUFBTUEsUUFBUUMsUUFBUSxPQUFSLENBQWQ7O0FBRUEsSUFBTUMsV0FBV0QsUUFBUSxpQkFBUixDQUFqQjtBQUNBLElBQU1FLFVBQVVGLFFBQVEsZ0JBQVIsQ0FBaEI7O0FBRUEsSUFBTUcsT0FBT0gsUUFBUSxXQUFSLENBQWI7Ozs7ZUFHNEJBLFFBQVEsY0FBUixDO0lBQXJC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LGlCQUFTLE1BQVQsSUFBbUIsb0JBQUMsV0FBRCxFQUFpQjdCLEtBQWpCLENBRGpCO0FBRUg7QUFBQTtBQUFBLGNBQUssV0FBVSxLQUFmO0FBQ0k7QUFBQTtBQUFBLGtCQUFLLFdBQVUsdUJBQWY7QUFDSTtBQUFBO0FBQUE7QUFDSSxnQ0FBUW1DLE9BRFo7QUFFSSxnQ0FBTyxNQUZYO0FBR0ksaUNBQVEscUJBSFo7QUFJSSx5Q0FBZTtBQUpuQjtBQU1JLG1EQUFPLE1BQUssUUFBWixFQUFxQixNQUFLLE1BQTFCLEVBQWlDLE9BQU81QyxJQUF4QyxHQU5KO0FBT0k7QUFBQTtBQUFBLDBCQUFLLFdBQVUsa0JBQWY7QUFDSTtBQUFBO0FBQUEsOEJBQU8sV0FBVSxtQkFBakI7QUFDSTtBQUFBO0FBQUE7QUFDSSxvREFBQyxLQUFELElBQU8sT0FBT0QsS0FBZCxHQURKO0FBRUksb0RBQUMsTUFBRCxlQUFZVSxLQUFaLElBQW1CLE9BQU9WLEtBQTFCO0FBRkosNkJBREo7QUFLSSxnREFBQyxRQUFELEVBQWNVLEtBQWQ7QUFMSjtBQURKO0FBUEo7QUFESjtBQURKO0FBRkcsS0FBUDtBQXdCSCxDQWxERDs7Ozs7Ozs7O0FBb0RBaUMsV0FBV3BDLFlBQVgsR0FBMEJYLGlCQUExQjs7QUFFQXVELE9BQU9DLE9BQVAsR0FBaUJULFVBQWpCIiwiZmlsZSI6IkVkaXRSZWNvcmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxuY29uc3QgbWV0YWRhdGEgPSByZXF1aXJlKFwiLi4vbGliL21ldGFkYXRhXCIpO1xuY29uc3Qgb3B0aW9ucyA9IHJlcXVpcmUoXCIuLi9saWIvb3B0aW9uc1wiKTtcblxuY29uc3QgUGFnZSA9IHJlcXVpcmUoXCIuL1BhZ2UuanNcIik7XG5cbmltcG9ydCB0eXBlIHtDb250ZXh0fSBmcm9tIFwiLi90eXBlcy5qc1wiO1xuY29uc3Qge2NoaWxkQ29udGV4dFR5cGVzfSA9IHJlcXVpcmUoXCIuL1dyYXBwZXIuanNcIik7XG5cbnR5cGUgUHJvcHMgPSB7XG4gICAgZHluYW1pY1ZhbHVlczoge30sXG4gICAgZ2xvYmFsRmFjZXRzPzoge1xuICAgICAgICBbbmFtZTogc3RyaW5nXToge1xuICAgICAgICAgICAgdGV4dDogc3RyaW5nLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgbW9kZTogXCJjcmVhdGVcIiB8IFwiZWRpdFwiIHwgXCJjbG9uZVwiLFxuICAgIHJlY29yZD86IFJlY29yZCxcbiAgICB0eXBlOiBzdHJpbmcsXG59O1xuXG50eXBlIFJlY29yZCA9IHtcbiAgICBfaWQ/OiBzdHJpbmcsXG4gICAgaWQ/OiBzdHJpbmcsXG4gICAgdHlwZTogc3RyaW5nLFxuICAgIGltYWdlczogQXJyYXk8SW1hZ2VUeXBlPixcbiAgICBnZXRFZGl0VVJMOiAobGFuZzogc3RyaW5nKSA9PiBzdHJpbmcsXG4gICAgZ2V0Q2xvbmVVUkw6IChsYW5nOiBzdHJpbmcpID0+IHN0cmluZyxcbiAgICBnZXRDcmVhdGVVUkw6IChsYW5nOiBzdHJpbmcpID0+IHN0cmluZyxcbiAgICBnZXRSZW1vdmVJbWFnZVVSTDogKGxhbmc6IHN0cmluZykgPT4gc3RyaW5nLFxufTtcblxudHlwZSBJbWFnZVR5cGUgPSB7XG4gICAgX2lkOiBzdHJpbmcsXG4gICAgZ2V0T3JpZ2luYWxVUkw6ICgpID0+IHN0cmluZyxcbiAgICBnZXRTY2FsZWRVUkw6ICgpID0+IHN0cmluZyxcbn07XG5cbmNvbnN0IEltYWdlID0gKHtcbiAgICBpbWFnZSxcbiAgICByZWNvcmQsXG4gICAgdGl0bGUsXG59OiBQcm9wcyAmIHtcbiAgICBpbWFnZTogSW1hZ2VUeXBlLFxuICAgIHRpdGxlOiBzdHJpbmcsXG59LCB7XG4gICAgbGFuZyxcbiAgICBnZXR0ZXh0LFxufTogQ29udGV4dCkgPT4gPGRpdiBjbGFzc05hbWU9XCJpbWcgY29sLW1kLTQgY29sLXhzLTEyIGNvbC1zbS02XCIga2V5PXtpbWFnZS5faWR9PlxuICAgIDxhIGhyZWY9e2ltYWdlLmdldE9yaWdpbmFsVVJMKCl9PlxuICAgICAgICA8aW1nIHNyYz17aW1hZ2UuZ2V0U2NhbGVkVVJMKCl9XG4gICAgICAgICAgICBhbHQ9e3RpdGxlfVxuICAgICAgICAgICAgdGl0bGU9e3RpdGxlfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiaW1nLXJlc3BvbnNpdmUgY2VudGVyLWJsb2NrXCJcbiAgICAgICAgLz5cbiAgICA8L2E+XG5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImRldGFpbHMgcmVkdWNlZFwiPlxuICAgICAgICA8Zm9ybVxuICAgICAgICAgICAgYWN0aW9uPXtyZWNvcmQgJiYgcmVjb3JkLmdldFJlbW92ZUltYWdlVVJMKGxhbmcpfVxuICAgICAgICAgICAgbWV0aG9kPVwiUE9TVFwiXG4gICAgICAgICAgICBlbmNUeXBlPVwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiXG4gICAgICAgID5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIHR5cGU9XCJoaWRkZW5cIlxuICAgICAgICAgICAgICAgIG5hbWU9XCJsYW5nXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17bGFuZ31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICB0eXBlPVwiaGlkZGVuXCJcbiAgICAgICAgICAgICAgICBuYW1lPVwiaW1hZ2VcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtpbWFnZS5faWR9XG4gICAgICAgICAgICAvPlxuXG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgdHlwZT1cInN1Ym1pdFwiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kYW5nZXIgYnRuLXhzXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnbHlwaGljb24gZ2x5cGhpY29uLXJlbW92ZVwiXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICB7XCIgXCJ9XG4gICAgICAgICAgICAgICAge2dldHRleHQoXCJSZW1vdmUgSW1hZ2VcIil9XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9mb3JtPlxuICAgIDwvZGl2PlxuPC9kaXY+O1xuXG5JbWFnZS5jb250ZXh0VHlwZXMgPSBjaGlsZENvbnRleHRUeXBlcztcblxuY29uc3QgVGl0bGUgPSAoe3RpdGxlfToge3RpdGxlOiBzdHJpbmd9KSA9PiA8dHIgY2xhc3NOYW1lPVwicGxhaW5cIj5cbiAgICA8dGgvPlxuICAgIDx0aCBjbGFzc05hbWU9XCJjb2wteHMtMTIgdGV4dC1jZW50ZXJcIj5cbiAgICAgICAgPGgxIGNsYXNzTmFtZT1cInBhbmVsLXRpdGxlXCI+XG4gICAgICAgICAgICB7dGl0bGV9XG4gICAgICAgIDwvaDE+XG4gICAgPC90aD5cbjwvdHI+O1xuXG5jb25zdCBJbWFnZXMgPSAocHJvcHM6IFByb3BzICYge3RpdGxlOiBzdHJpbmd9KSA9PiB7XG4gICAgY29uc3Qge3JlY29yZCwgdGl0bGV9ID0gcHJvcHM7XG5cbiAgICByZXR1cm4gPHRyIGNsYXNzTmFtZT1cInBsYWluXCI+XG4gICAgICAgIDx0ZC8+XG4gICAgICAgIDx0ZD5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAge3JlY29yZCAmJiByZWNvcmQuaW1hZ2VzLm1hcCgoaW1hZ2UpID0+IDxJbWFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgey4uLnByb3BzfVxuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2U9e2ltYWdlfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9e3RpdGxlfVxuICAgICAgICAgICAgICAgICAgICAvPil9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC90ZD5cbiAgICA8L3RyPjtcbn07XG5cbmNvbnN0IEltYWdlRm9ybSA9IChwcm9wcywge2dldHRleHR9OiBDb250ZXh0KSA9PiA8dHI+XG4gICAgPHRoIGNsYXNzTmFtZT1cInRleHQtcmlnaHRcIj5cbiAgICAgICAge2dldHRleHQoXCJBZGQgSW1hZ2VzXCIpfVxuICAgIDwvdGg+XG4gICAgPHRkPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgICAgIG5hbWU9XCJpbWFnZXNcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgIG11bHRpcGxlXG4gICAgICAgIC8+XG4gICAgPC90ZD5cbjwvdHI+O1xuXG5JbWFnZUZvcm0uY29udGV4dFR5cGVzID0gY2hpbGRDb250ZXh0VHlwZXM7XG5cbmNvbnN0IElERm9ybSA9ICh7XG4gICAgcmVjb3JkLFxuICAgIHR5cGUsXG59OiBQcm9wcywge2dldHRleHR9OiBDb250ZXh0KSA9PiB7XG4gICAgaWYgKG9wdGlvbnMudHlwZXNbdHlwZV0uYXV0b0lEIHx8IHJlY29yZCAmJiByZWNvcmQuX2lkKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiA8dHIgY2xhc3NOYW1lPVwiaGFzLWVycm9yXCI+XG4gICAgICAgIDx0aCBjbGFzc05hbWU9XCJ0ZXh0LXJpZ2h0XCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29udHJvbC1sYWJlbFwiPlxuICAgICAgICAgICAgICAgIHtnZXR0ZXh0KFwiSURcIil9XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8L3RoPlxuICAgICAgICA8dGQ+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgbmFtZT1cImlkXCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgICAgIGRhdGEtaWQ9XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU9e3JlY29yZCAmJiByZWNvcmQuaWR9XG4gICAgICAgICAgICAvPlxuICAgICAgICA8L3RkPlxuICAgIDwvdHI+O1xufTtcblxuSURGb3JtLmNvbnRleHRUeXBlcyA9IGNoaWxkQ29udGV4dFR5cGVzO1xuXG5jb25zdCBDb250ZW50cyA9IChwcm9wczogUHJvcHMsIHtnZXR0ZXh0fTogQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgICAgdHlwZSxcbiAgICAgICAgZ2xvYmFsRmFjZXRzLFxuICAgICAgICBkeW5hbWljVmFsdWVzLFxuICAgIH0gPSBwcm9wcztcbiAgICBjb25zdCBtb2RlbCA9IG1ldGFkYXRhLm1vZGVsKHR5cGUpO1xuICAgIGNvbnN0IHR5cGVzID0gT2JqZWN0LmtleXMob3B0aW9ucy50eXBlc1t0eXBlXS5tb2RlbCk7XG4gICAgbGV0IGhhc1ByaXZhdGUgPSBmYWxzZTtcblxuICAgIGNvbnN0IGZpZWxkcyA9IHR5cGVzLm1hcCgodHlwZSkgPT4ge1xuICAgICAgICBjb25zdCB0eXBlU2NoZW1hID0gbW9kZWxbdHlwZV07XG4gICAgICAgIGNvbnN0IGR5bmFtaWNWYWx1ZSA9IGR5bmFtaWNWYWx1ZXNbdHlwZV07XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IChnbG9iYWxGYWNldHMgJiYgZ2xvYmFsRmFjZXRzW3R5cGVdIHx8IFtdKVxuICAgICAgICAgICAgLm1hcCgoYnVja2V0KSA9PiBidWNrZXQudGV4dCkuc29ydCgpO1xuICAgICAgICBjb25zdCBpc1ByaXZhdGUgPSB0eXBlU2NoZW1hLm9wdGlvbnMucHJpdmF0ZTtcblxuICAgICAgICBoYXNQcml2YXRlID0gaGFzUHJpdmF0ZSB8fCBpc1ByaXZhdGU7XG5cbiAgICAgICAgcmV0dXJuIDx0ciBrZXk9e3R5cGV9PlxuICAgICAgICAgICAgPHRoIGNsYXNzTmFtZT1cInRleHQtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICB7dHlwZVNjaGVtYS5vcHRpb25zLnRpdGxlKHtnZXR0ZXh0fSl9XG4gICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgPHRkIGRhdGEtcHJpdmF0ZT17aXNQcml2YXRlfT5cbiAgICAgICAgICAgICAgICB7dHlwZVNjaGVtYS5yZW5kZXJFZGl0KGR5bmFtaWNWYWx1ZSwgdmFsdWVzLCB7Z2V0dGV4dH0pfVxuICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgPC90cj47XG4gICAgfSk7XG5cbiAgICBpZiAoaGFzUHJpdmF0ZSkge1xuICAgICAgICBmaWVsZHMucHVzaCg8dHIga2V5PVwicHJpdmF0ZVwiPlxuICAgICAgICAgICAgPHRoLz5cbiAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRvZ2dsZS1wcml2YXRlXCJcbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAge1wiIFwifVxuICAgICAgICAgICAgICAgICAgICB7Z2V0dGV4dChcIlNob3cgcHJpdmF0ZSBmaWVsZHMuXCIpfVxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8L3RkPlxuICAgICAgICA8L3RyPik7XG4gICAgfVxuXG4gICAgcmV0dXJuIDx0Ym9keT5cbiAgICAgICAgeyFvcHRpb25zLnR5cGVzW3R5cGVdLm5vSW1hZ2VzICYmXG4gICAgICAgICAgICA8SW1hZ2VGb3JtIHsuLi5wcm9wc30gLz59XG4gICAgICAgIDxJREZvcm0gey4uLnByb3BzfSAvPlxuICAgICAgICB7ZmllbGRzfVxuICAgICAgICA8U3VibWl0QnV0dG9uIHsuLi5wcm9wc30gLz5cbiAgICA8L3Rib2R5Pjtcbn07XG5cbkNvbnRlbnRzLmNvbnRleHRUeXBlcyA9IGNoaWxkQ29udGV4dFR5cGVzO1xuXG5jb25zdCBTdWJtaXRCdXR0b24gPSAoe21vZGV9OiBQcm9wcywge2dldHRleHR9OiBDb250ZXh0KSA9PiB7XG4gICAgbGV0IGJ1dHRvblRleHQgPSBnZXR0ZXh0KFwiVXBkYXRlXCIpO1xuXG4gICAgaWYgKG1vZGUgPT09IFwiY3JlYXRlXCIpIHtcbiAgICAgICAgYnV0dG9uVGV4dCA9IGdldHRleHQoXCJDcmVhdGVcIik7XG4gICAgfSBlbHNlIGlmIChtb2RlID09PSBcImNsb25lXCIpIHtcbiAgICAgICAgYnV0dG9uVGV4dCA9IGdldHRleHQoXCJDbG9uZVwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gPHRyPlxuICAgICAgICA8dGgvPlxuICAgICAgICA8dGQ+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICB0eXBlPVwic3VibWl0XCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17YnV0dG9uVGV4dH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgPC90ZD5cbiAgICA8L3RyPjtcbn07XG5cblN1Ym1pdEJ1dHRvbi5jb250ZXh0VHlwZXMgPSBjaGlsZENvbnRleHRUeXBlcztcblxuY29uc3QgQ2xvbmVCdXR0b24gPSAoe3JlY29yZCwgbW9kZX06IFByb3BzLCB7Z2V0dGV4dCwgbGFuZ306IENvbnRleHQpID0+XG48ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgIDxhXG4gICAgICAgIGhyZWY9e3JlY29yZCAmJiByZWNvcmQuZ2V0Q2xvbmVVUkwobGFuZyl9XG4gICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBwdWxsLXJpZ2h0XCJcbiAgICA+XG4gICAgICAgIHtnZXR0ZXh0KFwiQ2xvbmUgUmVjb3JkXCIpfVxuICAgIDwvYT5cbjwvZGl2PjtcblxuQ2xvbmVCdXR0b24uY29udGV4dFR5cGVzID0gY2hpbGRDb250ZXh0VHlwZXM7XG5cbmNvbnN0IEVkaXRSZWNvcmQgPSAocHJvcHM6IFByb3BzLCB7bGFuZywgZm9ybWF0LCBnZXR0ZXh0fTogQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IHtyZWNvcmQsIHR5cGUsIG1vZGV9ID0gcHJvcHM7XG4gICAgY29uc3QgcG9zdFVSTCA9IHJlY29yZCA/XG4gICAgICAgIChyZWNvcmQuX2lkID9cbiAgICAgICAgICAgIHJlY29yZC5nZXRFZGl0VVJMKGxhbmcpIDpcbiAgICAgICAgICAgIHJlY29yZC5nZXRDcmVhdGVVUkwobGFuZykpIDpcbiAgICAgICAgXCJcIjtcblxuICAgIGxldCB0aXRsZSA9IFwiXCI7XG5cbiAgICBpZiAoIXJlY29yZCB8fCBtb2RlID09PSBcImNyZWF0ZVwiKSB7XG4gICAgICAgIHRpdGxlID0gZm9ybWF0KGdldHRleHQoXCIlKHJlY29yZE5hbWUpczogQ3JlYXRlIE5ld1wiKSwge1xuICAgICAgICAgICAgcmVjb3JkTmFtZTogb3B0aW9ucy50eXBlc1t0eXBlXS5uYW1lKHtnZXR0ZXh0fSksXG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHJlY29yZFRpdGxlID0gb3B0aW9ucy50eXBlc1t0eXBlXVxuICAgICAgICAgICAgLnJlY29yZFRpdGxlKHJlY29yZCwge2dldHRleHR9KTtcblxuICAgICAgICBpZiAobW9kZSA9PT0gXCJjbG9uZVwiKSB7XG4gICAgICAgICAgICB0aXRsZSA9IGZvcm1hdChnZXR0ZXh0KFwiQ2xvbmluZyAnJShyZWNvcmRUaXRsZSlzJ1wiKSwge3JlY29yZFRpdGxlfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aXRsZSA9IGZvcm1hdChnZXR0ZXh0KFwiVXBkYXRpbmcgJyUocmVjb3JkVGl0bGUpcydcIiksXG4gICAgICAgICAgICAgICAge3JlY29yZFRpdGxlfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gPFBhZ2UgdGl0bGU9e3RpdGxlfT5cbiAgICAgICAge21vZGUgPT09IFwiZWRpdFwiICYmIDxDbG9uZUJ1dHRvbiB7Li4ucHJvcHN9IC8+fVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtMTIgaW1hZ2Vob2xkZXJcIj5cbiAgICAgICAgICAgICAgICA8Zm9ybVxuICAgICAgICAgICAgICAgICAgICBhY3Rpb249e3Bvc3RVUkx9XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZD1cIlBPU1RcIlxuICAgICAgICAgICAgICAgICAgICBlbmNUeXBlPVwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtdmFsaWRhdGU9e3RydWV9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJsYW5nXCIgdmFsdWU9e2xhbmd9IC8+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVzcG9uc2l2ZS10YWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInRhYmxlIHRhYmxlLWhvdmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VGl0bGUgdGl0bGU9e3RpdGxlfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SW1hZ2VzIHsuLi5wcm9wc30gdGl0bGU9e3RpdGxlfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvbnRlbnRzIHsuLi5wcm9wc30gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L1BhZ2U+O1xufTtcblxuRWRpdFJlY29yZC5jb250ZXh0VHlwZXMgPSBjaGlsZENvbnRleHRUeXBlcztcblxubW9kdWxlLmV4cG9ydHMgPSBFZGl0UmVjb3JkO1xuIl19