"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const React = require("react");

const metadata = require("../lib/metadata");

const Page = require("./Page.js");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

const { childContextTypes } = require("./Wrapper.js");

const Image = ({
    image,
    record,
    title
}, {
    lang,
    gettext
}) => React.createElement(
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
                    record && record.images.map(image => React.createElement(Image, _extends({}, props, {
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

const Contents = (props, { gettext, options }) => {
    const {
        type,
        globalFacets,
        dynamicValues
    } = props;
    const model = metadata.model(type);
    const types = Object.keys(options.types[type].model);
    let hasPrivate = false;

    const fields = types.map(type => {
        const typeSchema = model[type];
        const dynamicValue = dynamicValues[type];
        const values = (globalFacets && globalFacets[type] || []).map(bucket => bucket.text).sort();
        const isPrivate = typeSchema.options.private;

        hasPrivate = hasPrivate || isPrivate;

        return React.createElement(
            "tr",
            { key: type },
            React.createElement(
                "th",
                { className: "text-right" },
                typeSchema.options.title({ gettext })
            ),
            React.createElement(
                "td",
                { "data-private": isPrivate },
                typeSchema.renderEdit(dynamicValue, values, { gettext })
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

const CloneButton = ({ record, mode }, { gettext, lang }) => React.createElement(
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

CloneButton.propTypes = {
    dynamicValues: require("react").PropTypes.shape({}).isRequired,
    globalFacets: require("react").PropTypes.shape({}),
    mode: require("react").PropTypes.oneOf(["create", "edit", "clone"]).isRequired,
    record: require("react").PropTypes.any,
    type: require("react").PropTypes.string.isRequired
};
CloneButton.contextTypes = childContextTypes;

const EditRecord = (props, { lang, format, gettext, options }) => {
    const { record, type, mode } = props;
    const postURL = record ? record._id ? record.getEditURL(lang) : record.getCreateURL(lang) : "";

    let title = "";

    if (!record || mode === "create") {
        title = format(gettext("%(recordName)s: Create New"), {
            recordName: options.types[type].name
        });
    } else {
        // NOTE(jeresig): Fix recordTitle i18n
        const recordTitle = record.title || "";

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