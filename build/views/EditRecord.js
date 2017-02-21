"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const React = require("react");

const Page = require("./Page.js");
const FixedStringEdit = require("./types/edit/FixedString.js");
const LinkedRecordEdit = require("./types/edit/LinkedRecord.js");
const NameEdit = require("./types/edit/Name.js");
const SimpleDateEdit = require("./types/edit/SimpleDate.js");
const YearRangeEdit = require("./types/edit/YearRange.js");

var babelPluginFlowReactPropTypes_proptype_ModelType = require("./types.js").babelPluginFlowReactPropTypes_proptype_ModelType || require("react").PropTypes.any;

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

const { childContextTypes } = require("./Wrapper.js");

const Image = ({
    image,
    record,
    title
}, {
    gettext
}) => React.createElement(
    "div",
    { className: "img col-md-4 col-xs-12 col-sm-6", key: image._id },
    React.createElement(
        "a",
        { href: image.getOriginalURL },
        React.createElement("img", { src: image.getScaledURL,
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
                action: record && record.getRemoveImageURL,
                method: "POST",
                encType: "multipart/form-data"
            },
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

Image.contextTypes = childContextTypes;

const Title = ({ title }) => React.createElement(
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

Title.propTypes = {
    title: require("react").PropTypes.string.isRequired
};
const Images = props => {
    const { record, title } = props;

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
                    record && record.images.map((image, i) => React.createElement(Image, _extends({}, props, {
                        key: i,
                        image: image,
                        title: title
                    })))
                )
            )
        )
    );
};

const ImageForm = (props, { gettext }) => React.createElement(
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

ImageForm.contextTypes = childContextTypes;

const IDForm = ({
    record,
    type
}, { gettext, options }) => {
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

const TypeEdit = ({
    name,
    type,
    value,
    allValues,
    typeSchema
}) => {
    const { multiple } = typeSchema;

    if (typeSchema.type === "Dimension") {
        return null;
    } else if (typeSchema.type === "FixedString") {
        const expectedValues = typeSchema.values || {};
        let values = Object.keys(expectedValues).map(id => ({
            id,
            name: expectedValues[id].name
        }));

        if (values.length === 0) {
            values = allValues.map(text => ({
                id: text,
                name: text
            }));
        }

        return React.createElement(FixedStringEdit, {
            name: name,
            type: type,
            value: value,
            values: values,
            multiple: multiple
        });
    } else if (typeSchema.type === "LinkedRecord") {
        return React.createElement(LinkedRecordEdit, {
            name: name,
            type: type,
            value: value,
            multiple: multiple,
            recordType: typeSchema.recordType,
            placeholder: typeSchema.placeholder
        });
    } else if (typeSchema.type === "Location") {
        return null;
    } else if (typeSchema.type === "Name") {
        return React.createElement(NameEdit, {
            name: name,
            type: type,
            value: value,
            multiple: multiple,
            names: allValues
        });
    } else if (typeSchema.type === "SimpleDate") {
        return React.createElement(SimpleDateEdit, {
            name: name,
            type: type,
            value: value
        });
    } else if (typeSchema.type === "SimpleNumber") {
        return React.createElement(FixedStringEdit, {
            name: name,
            type: type,
            value: value
        });
    } else if (typeSchema.type === "SimpleString") {
        return React.createElement(FixedStringEdit, {
            name: name,
            type: type,
            value: value,
            multiline: typeSchema.multiline
        });
    } else if (typeSchema.type === "YearRange") {
        return React.createElement(YearRangeEdit, {
            name: name,
            type: type,
            value: value
        });
    }

    return null;
};

TypeEdit.propTypes = {
    name: require("react").PropTypes.string.isRequired,
    type: require("react").PropTypes.string.isRequired,
    value: require("react").PropTypes.any,
    allValues: require("react").PropTypes.arrayOf(require("react").PropTypes.any).isRequired,
    typeSchema: babelPluginFlowReactPropTypes_proptype_ModelType
};
const Contents = (props, { gettext, options }) => {
    const {
        type,
        globalFacets,
        dynamicValues
    } = props;
    const { model } = options.types[type];
    const types = Object.keys(model);
    let hasPrivate = false;

    const fields = types.map(modelType => {
        const typeSchema = model[modelType];
        const dynamicValue = dynamicValues[modelType];
        const values = (globalFacets && globalFacets[modelType] || []).map(bucket => bucket.text).sort();
        const isPrivate = typeSchema.private;

        hasPrivate = hasPrivate || isPrivate;

        return React.createElement(
            "tr",
            { key: modelType },
            React.createElement(
                "th",
                { className: "text-right" },
                typeSchema.title
            ),
            React.createElement(
                "td",
                { "data-private": isPrivate },
                React.createElement(TypeEdit, {
                    name: modelType,
                    type: type,
                    value: dynamicValue,
                    allValues: values,
                    typeSchema: typeSchema
                })
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

const SubmitButton = ({ mode }, { gettext }) => {
    let buttonText = gettext("Update");

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

const CloneButton = ({
    record,
    mode
}, { gettext }) => React.createElement(
    "div",
    { className: "row" },
    React.createElement(
        "a",
        {
            href: record && record.getCloneURL,
            className: "btn btn-primary pull-right"
        },
        gettext("Clone Record")
    )
);

CloneButton.propTypes = {
    dynamicValues: require("react").PropTypes.shape({}).isRequired,
    globalFacets: require("react").PropTypes.shape({}),
    mode: require("react").PropTypes.oneOf(["create", "edit", "clone"]).isRequired,
    record: require("react").PropTypes.any,
    type: require("react").PropTypes.string.isRequired
};
CloneButton.contextTypes = childContextTypes;

const EditRecord = (props, {
    gettext,
    options,
    utils: { format }
}) => {
    const { record, type, mode } = props;
    const postURL = record ? record._id ? record.getEditURL : record.getCreateURL : "";

    let title = "";

    if (!record || mode === "create") {
        title = format(gettext("%(recordName)s: Create New"), {
            recordName: options.types[type].name
        });
    } else {
        const recordTitle = record.getTitle || "";

        if (mode === "clone") {
            title = format(gettext("Cloning '%(recordTitle)s'"), { recordTitle });
        } else {
            title = format(gettext("Updating '%(recordTitle)s'"), { recordTitle });
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
                        )
                    )
                ),
                React.createElement(
                    "form",
                    {
                        action: postURL,
                        method: "POST",
                        encType: "multipart/form-data",
                        "data-validate": true
                    },
                    React.createElement(
                        "div",
                        { className: "responsive-table" },
                        React.createElement(
                            "table",
                            { className: "table table-hover" },
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