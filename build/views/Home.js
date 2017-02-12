"use strict";

const React = require("react");

const Page = require("./Page.js");
const { stringNum, URL } = require("./utils.js");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

const { childContextTypes } = require("./Wrapper.js");

const SearchForm = ({ type }, {
    lang,
    gettext,
    user,
    options
}) => {
    const title = options.types[type].name;
    const sources = user && user.getEditableSourcesByType(type);

    return React.createElement(
        "div",
        null,
        React.createElement(
            "h3",
            null,
            title
        ),
        React.createElement(
            "form",
            { action: URL(lang, `/${type}/search`), method: "GET",
                className: "form-search form-inline"
            },
            React.createElement(
                "div",
                { className: "form-group" },
                React.createElement("input", { type: "hidden", name: "lang", value: lang }),
                React.createElement("input", { type: "search", id: "filter", name: "filter",
                    placeholder: gettext("Search"),
                    className: "form-control search-query"
                })
            ),
            " ",
            React.createElement("input", { type: "submit", value: gettext("Search"),
                className: "btn btn-primary"
            }),
            " ",
            React.createElement(
                "a",
                { href: URL(lang, `/${type}/search`), className: "btn btn-default" },
                gettext("Browse All")
            ),
            " ",
            sources && sources.length > 0 && React.createElement(
                "a",
                {
                    href: URL(lang, `/${type}/create`),
                    className: "btn btn-success"
                },
                gettext("Create New")
            )
        )
    );
};

SearchForm.propTypes = {
    type: require("react").PropTypes.string.isRequired
};
SearchForm.contextTypes = childContextTypes;

const ImageUploadForms = ({ type }, { lang, gettext }) => React.createElement(
    "div",
    null,
    React.createElement(
        "h3",
        null,
        gettext("Search by Image:")
    ),
    React.createElement(
        "p",
        null,
        gettext("Upload an image to find other " + "similar images.")
    ),
    React.createElement(
        "div",
        { className: "panel panel-default" },
        React.createElement(
            "div",
            { className: "panel-heading" },
            React.createElement(
                "h3",
                { className: "panel-title" },
                gettext("Upload an Image")
            )
        ),
        React.createElement(
            "div",
            { className: "panel-body" },
            React.createElement(
                "form",
                { action: URL(lang, `/${type}/file-upload`), method: "POST",
                    encType: "multipart/form-data"
                },
                React.createElement("input", { type: "hidden", name: "lang",
                    value: lang
                }),
                React.createElement(
                    "div",
                    { className: "form-inline" },
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement("input", { type: "file", id: "file", name: "file",
                            className: "form-control"
                        })
                    ),
                    " ",
                    React.createElement("input", { type: "submit", className: "btn btn-primary",
                        value: gettext("Search by Image")
                    })
                )
            )
        )
    ),
    React.createElement(
        "div",
        { className: "panel panel-default" },
        React.createElement(
            "div",
            { className: "panel-heading" },
            React.createElement(
                "h3",
                { className: "panel-title" },
                gettext("Paste Image URL")
            )
        ),
        React.createElement(
            "div",
            { className: "panel-body" },
            React.createElement(
                "form",
                { action: URL(lang, `/${type}/url-upload`), method: "GET" },
                React.createElement("input", { type: "hidden", name: "lang",
                    value: lang
                }),
                React.createElement(
                    "div",
                    { className: "form-inline" },
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement("input", { type: "text", id: "url", name: "url",
                            defaultValue: "http://",
                            className: "form-control"
                        })
                    ),
                    " ",
                    React.createElement("input", { type: "submit",
                        value: gettext("Search by Image"),
                        className: "btn btn-primary"
                    })
                )
            )
        )
    )
);

ImageUploadForms.propTypes = {
    type: require("react").PropTypes.string.isRequired
};
ImageUploadForms.contextTypes = childContextTypes;

const Source = ({ type, source }, { lang, options }) => {

    const typeName = options.types[type].name;
    const recordCount = stringNum(lang, source.numRecords);
    const desc = `${recordCount} ${typeName}`;

    return React.createElement(
        "div",
        null,
        React.createElement(
            "h4",
            null,
            React.createElement(
                "a",
                { href: source.getURL(lang) },
                source.getFullName(lang)
            )
        ),
        React.createElement(
            "p",
            null,
            desc
        )
    );
};

Source.propTypes = {
    type: require("react").PropTypes.string.isRequired,
    source: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        numRecords: require("react").PropTypes.number.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    }).isRequired
};
Source.contextTypes = childContextTypes;

const Sources = ({ type, sources }, { gettext }) => React.createElement(
    "div",
    null,
    React.createElement(
        "h3",
        null,
        gettext("Browse by Collection:")
    ),
    React.createElement(
        "div",
        { className: "sources" },
        sources.map(source => React.createElement(Source, {
            key: source._id,
            source: source,
            type: type
        }))
    )
);

Sources.contextTypes = childContextTypes;

const Type = ({ type, sources }, { options }) => {
    const sourcesByType = sources.filter(source => source.type === type);

    return React.createElement(
        "div",
        { className: "col-sm-8 col-sm-offset-2 upload-box" },
        React.createElement(SearchForm, { type: type }),
        options.types[type].hasImageSearch && React.createElement(ImageUploadForms, { type: type }),
        sourcesByType.length > 1 && React.createElement(Sources, { type: type, sources: sourcesByType })
    );
};

Type.contextTypes = childContextTypes;

const Home = ({ sources }, { options }) => React.createElement(
    Page,
    null,
    Object.keys(options.types).map(type => React.createElement(Type, { key: type, sources: sources, type: type }))
);

Home.propTypes = {
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        numRecords: require("react").PropTypes.number.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired
};
Home.contextTypes = childContextTypes;

module.exports = Home;