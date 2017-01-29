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