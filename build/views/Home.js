"use strict";

var React = require("react");

var options = require("../lib/options");

var Page = require("./Page.js");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

var _require = require("./Wrapper.js"),
    childContextTypes = _require.childContextTypes;

var SearchForm = function SearchForm(_ref, _ref2) {
    var type = _ref.type;
    var lang = _ref2.lang,
        URL = _ref2.URL,
        gettext = _ref2.gettext;

    var title = options.types[type].name({ gettext: gettext });

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
            { action: URL("/" + type + "/search"), method: "GET",
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
                { href: URL("/" + type + "/search"), className: "btn btn-default" },
                gettext("Browse All")
            ),
            " ",
            React.createElement(
                "a",
                { href: URL("/" + type + "/create"), className: "btn btn-success" },
                gettext("Create New")
            )
        )
    );
};

SearchForm.propTypes = {
    type: require("react").PropTypes.string.isRequired
};
SearchForm.contextTypes = childContextTypes;

var ImageUploadForms = function ImageUploadForms(_ref3, _ref4) {
    var type = _ref3.type;
    var lang = _ref4.lang,
        gettext = _ref4.gettext,
        URL = _ref4.URL;
    return React.createElement(
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
                    { action: URL("/" + type + "/file-upload"), method: "POST",
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
                    { action: URL("/" + type + "/url-upload"), method: "GET" },
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
};

ImageUploadForms.propTypes = {
    type: require("react").PropTypes.string.isRequired
};
ImageUploadForms.contextTypes = childContextTypes;

var Source = function Source(_ref5, _ref6) {
    var type = _ref5.type,
        source = _ref5.source;
    var lang = _ref6.lang,
        stringNum = _ref6.stringNum,
        gettext = _ref6.gettext;


    var typeName = options.types[type].name({ gettext: gettext });
    var recordCount = stringNum(source.numRecords);
    var desc = recordCount + " " + typeName;

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

var Sources = function Sources(_ref7, _ref8) {
    var type = _ref7.type,
        sources = _ref7.sources;
    var gettext = _ref8.gettext;
    return React.createElement(
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
            sources.map(function (source) {
                return React.createElement(Source, {
                    key: source._id,
                    source: source,
                    type: type
                });
            })
        )
    );
};

Sources.contextTypes = childContextTypes;

var Type = function Type(_ref9) {
    var type = _ref9.type,
        sources = _ref9.sources;

    var sourcesByType = sources.filter(function (source) {
        return source.type === type;
    });

    return React.createElement(
        "div",
        { className: "col-sm-8 col-sm-offset-2 upload-box" },
        React.createElement(SearchForm, { type: type }),
        options.types[type].hasImageSearch() && React.createElement(ImageUploadForms, { type: type }),
        sourcesByType.length > 1 && React.createElement(Sources, { type: type, sources: sourcesByType })
    );
};

var Home = function Home(_ref10) {
    var sources = _ref10.sources;
    return React.createElement(
        Page,
        {
            splash: options.views.homeSplash && React.createElement(options.views.homeSplash, null)
        },
        Object.keys(options.types).map(function (type) {
            return React.createElement(Type, { key: type, sources: sources, type: type });
        })
    );
};

Home.propTypes = {
    sources: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        type: require("react").PropTypes.string.isRequired,
        numRecords: require("react").PropTypes.number.isRequired,
        getFullName: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired
    })).isRequired
};
module.exports = Home;