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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92aWV3cy9Ib21lLmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwicmVxdWlyZSIsIm9wdGlvbnMiLCJQYWdlIiwiY2hpbGRDb250ZXh0VHlwZXMiLCJTZWFyY2hGb3JtIiwidHlwZSIsImxhbmciLCJVUkwiLCJnZXR0ZXh0IiwidGl0bGUiLCJ0eXBlcyIsIm5hbWUiLCJjb250ZXh0VHlwZXMiLCJJbWFnZVVwbG9hZEZvcm1zIiwiU291cmNlIiwic291cmNlIiwic3RyaW5nTnVtIiwidHlwZU5hbWUiLCJyZWNvcmRDb3VudCIsIm51bVJlY29yZHMiLCJkZXNjIiwiZ2V0VVJMIiwiZ2V0RnVsbE5hbWUiLCJTb3VyY2VzIiwic291cmNlcyIsIm1hcCIsIl9pZCIsIlR5cGUiLCJzb3VyY2VzQnlUeXBlIiwiZmlsdGVyIiwiaGFzSW1hZ2VTZWFyY2giLCJsZW5ndGgiLCJIb21lIiwidmlld3MiLCJob21lU3BsYXNoIiwiT2JqZWN0Iiwia2V5cyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBRUEsSUFBTUEsUUFBUUMsUUFBUSxPQUFSLENBQWQ7O0FBRUEsSUFBTUMsVUFBVUQsUUFBUSxnQkFBUixDQUFoQjs7QUFFQSxJQUFNRSxPQUFPRixRQUFRLFdBQVIsQ0FBYjs7OztlQUc0QkEsUUFBUSxjQUFSLEM7SUFBckJHLGlCLFlBQUFBLGlCOztBQWNQLElBQU1DLGFBQWEsU0FBYkEsVUFBYSxjQUEyRDtBQUFBLFFBQXpEQyxJQUF5RCxRQUF6REEsSUFBeUQ7QUFBQSxRQUFqQ0MsSUFBaUMsU0FBakNBLElBQWlDO0FBQUEsUUFBM0JDLEdBQTJCLFNBQTNCQSxHQUEyQjtBQUFBLFFBQXRCQyxPQUFzQixTQUF0QkEsT0FBc0I7O0FBQzFFLFFBQU1DLFFBQVFSLFFBQVFTLEtBQVIsQ0FBY0wsSUFBZCxFQUFvQk0sSUFBcEIsQ0FBeUIsRUFBQ0gsZ0JBQUQsRUFBekIsQ0FBZDs7QUFFQSxXQUFPO0FBQUE7QUFBQTtBQUNIO0FBQUE7QUFBQTtB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QUMsT0FBRCxDQUFTLEtBQVQsQ0FBZSxVQUFmO0FBRjJCO0FBSTlCQyxlQUFPQyxJQUFQLENBQVluQyxRQUFRUyxLQUFwQixFQUEyQmUsR0FBM0IsQ0FBK0IsVUFBQ3BCLElBQUQ7QUFBQSxtQkFDNUIsb0JBQUMsSUFBRCxJQUFNLEtBQUtBLElBQVgsRUFBaUIsU0FBU21CLE9BQTFCLEVBQW1DLE1BQU1uQixJQUF6QyxHQUQ0QjtBQUFBLFNBQS9CO0FBSjhCLEtBQXRCO0FBQUEsQ0FBYjs7Ozs7Ozs7Ozs7QUFRQWdDLE9BQU9DLE9BQVAsR0FBaUJOLElBQWpCIiwiZmlsZSI6IkhvbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxuY29uc3Qgb3B0aW9ucyA9IHJlcXVpcmUoXCIuLi9saWIvb3B0aW9uc1wiKTtcblxuY29uc3QgUGFnZSA9IHJlcXVpcmUoXCIuL1BhZ2UuanNcIik7XG5cbmltcG9ydCB0eXBlIHtDb250ZXh0fSBmcm9tIFwiLi90eXBlcy5qc1wiO1xuY29uc3Qge2NoaWxkQ29udGV4dFR5cGVzfSA9IHJlcXVpcmUoXCIuL1dyYXBwZXIuanNcIik7XG5cbnR5cGUgU291cmNlVHlwZSA9IHtcbiAgICBfaWQ6IHN0cmluZyxcbiAgICB0eXBlOiBzdHJpbmcsXG4gICAgbnVtUmVjb3JkczogbnVtYmVyLFxuICAgIGdldEZ1bGxOYW1lOiAobGFuZzogc3RyaW5nKSA9PiBzdHJpbmcsXG4gICAgZ2V0VVJMOiAobGFuZzogc3RyaW5nKSA9PiBzdHJpbmcsXG59O1xuXG50eXBlIFByb3BzID0ge1xuICAgIHNvdXJjZXM6IEFycmF5PFNvdXJjZVR5cGU+LFxufTtcblxuY29uc3QgU2VhcmNoRm9ybSA9ICh7dHlwZX06IHt0eXBlOiBzdHJpbmd9LCB7bGFuZywgVVJMLCBnZXR0ZXh0fTogQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IHRpdGxlID0gb3B0aW9ucy50eXBlc1t0eXBlXS5uYW1lKHtnZXR0ZXh0fSk7XG5cbiAgICByZXR1cm4gPGRpdj5cbiAgICAgICAgPGgzPnt0aXRsZX08L2gzPlxuICAgICAgICA8Zm9ybSBhY3Rpb249e1VSTChgLyR7dHlwZX0vc2VhcmNoYCl9IG1ldGhvZD1cIkdFVFwiXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLXNlYXJjaCBmb3JtLWlubGluZVwiXG4gICAgICAgID5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImxhbmdcIiB2YWx1ZT17bGFuZ30gLz5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInNlYXJjaFwiIGlkPVwiZmlsdGVyXCIgbmFtZT1cImZpbHRlclwiXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtnZXR0ZXh0KFwiU2VhcmNoXCIpfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2wgc2VhcmNoLXF1ZXJ5XCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7XCIgXCJ9XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPXtnZXR0ZXh0KFwiU2VhcmNoXCIpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAge1wiIFwifVxuICAgICAgICAgICAgPGEgaHJlZj17VVJMKGAvJHt0eXBlfS9zZWFyY2hgKX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCI+XG4gICAgICAgICAgICAgICAge2dldHRleHQoXCJCcm93c2UgQWxsXCIpfVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAge1wiIFwifVxuICAgICAgICAgICAgPGEgaHJlZj17VVJMKGAvJHt0eXBlfS9jcmVhdGVgKX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1zdWNjZXNzXCI+XG4gICAgICAgICAgICAgICAge2dldHRleHQoXCJDcmVhdGUgTmV3XCIpfVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICA8L2Zvcm0+XG4gICAgPC9kaXY+O1xufTtcblxuU2VhcmNoRm9ybS5jb250ZXh0VHlwZXMgPSBjaGlsZENvbnRleHRUeXBlcztcblxuY29uc3QgSW1hZ2VVcGxvYWRGb3JtcyA9ICh7dHlwZX06IHt0eXBlOiBzdHJpbmd9LFxuICAgICAgICB7bGFuZywgZ2V0dGV4dCwgVVJMfTogQ29udGV4dCkgPT4gPGRpdj5cbiAgICA8aDM+e2dldHRleHQoXCJTZWFyY2ggYnkgSW1hZ2U6XCIpfTwvaDM+XG4gICAgPHA+e2dldHRleHQoXCJVcGxvYWQgYW4gaW1hZ2UgdG8gZmluZCBvdGhlciBcIiArXG4gICAgICAgIFwic2ltaWxhciBpbWFnZXMuXCIpfTwvcD5cblxuICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWhlYWRpbmdcIj5cbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJwYW5lbC10aXRsZVwiPlxuICAgICAgICAgICAgICAgIHtnZXR0ZXh0KFwiVXBsb2FkIGFuIEltYWdlXCIpfVxuICAgICAgICAgICAgPC9oMz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keVwiPlxuICAgICAgICAgICAgPGZvcm0gYWN0aW9uPXtVUkwoYC8ke3R5cGV9L2ZpbGUtdXBsb2FkYCl9IG1ldGhvZD1cIlBPU1RcIlxuICAgICAgICAgICAgICAgIGVuY1R5cGU9XCJtdWx0aXBhcnQvZm9ybS1kYXRhXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJsYW5nXCJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2xhbmd9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0taW5saW5lXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgaWQ9XCJmaWxlXCIgbmFtZT1cImZpbGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAge1wiIFwifVxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Z2V0dGV4dChcIlNlYXJjaCBieSBJbWFnZVwiKX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCI+XG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwicGFuZWwtdGl0bGVcIj5cbiAgICAgICAgICAgICAgICB7Z2V0dGV4dChcIlBhc3RlIEltYWdlIFVSTFwiKX1cbiAgICAgICAgICAgIDwvaDM+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWJvZHlcIj5cbiAgICAgICAgICAgIDxmb3JtIGFjdGlvbj17VVJMKGAvJHt0eXBlfS91cmwtdXBsb2FkYCl9IG1ldGhvZD1cIkdFVFwiPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImxhbmdcIlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17bGFuZ31cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1pbmxpbmVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cInVybFwiIG5hbWU9XCJ1cmxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT1cImh0dHA6Ly9cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAge1wiIFwifVxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Z2V0dGV4dChcIlNlYXJjaCBieSBJbWFnZVwiKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiXG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+O1xuXG5JbWFnZVVwbG9hZEZvcm1zLmNvbnRleHRUeXBlcyA9IGNoaWxkQ29udGV4dFR5cGVzO1xuXG5jb25zdCBTb3VyY2UgPSAoe3R5cGUsIHNvdXJjZX06IHt0eXBlOiBzdHJpbmcsIHNvdXJjZTogU291cmNlVHlwZX0sXG4gICAge2xhbmcsIHN0cmluZ051bSwgZ2V0dGV4dH06IENvbnRleHQpID0+IHtcblxuICAgIGNvbnN0IHR5cGVOYW1lID0gb3B0aW9ucy50eXBlc1t0eXBlXS5uYW1lKHtnZXR0ZXh0fSk7XG4gICAgY29uc3QgcmVjb3JkQ291bnQgPSBzdHJpbmdOdW0oc291cmNlLm51bVJlY29yZHMpO1xuICAgIGNvbnN0IGRlc2MgPSBgJHtyZWNvcmRDb3VudH0gJHt0eXBlTmFtZX1gO1xuXG4gICAgcmV0dXJuIDxkaXY+XG4gICAgICAgIDxoND48YSBocmVmPXtzb3VyY2UuZ2V0VVJMKGxhbmcpfT5cbiAgICAgICAgICAgIHtzb3VyY2UuZ2V0RnVsbE5hbWUobGFuZyl9XG4gICAgICAgIDwvYT48L2g0PlxuICAgICAgICA8cD57ZGVzY308L3A+XG4gICAgPC9kaXY+O1xufTtcblxuU291cmNlLmNvbnRleHRUeXBlcyA9IGNoaWxkQ29udGV4dFR5cGVzO1xuXG5jb25zdCBTb3VyY2VzID0gKHt0eXBlLCBzb3VyY2VzfTogUHJvcHMgJiB7dHlwZTogc3RyaW5nfSxcbiAgICAgICAge2dldHRleHR9OiBDb250ZXh0KSA9PiA8ZGl2PlxuICAgIDxoMz57Z2V0dGV4dChcIkJyb3dzZSBieSBDb2xsZWN0aW9uOlwiKX08L2gzPlxuXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzb3VyY2VzXCI+XG4gICAgICAgIHtzb3VyY2VzLm1hcCgoc291cmNlKSA9PiA8U291cmNlXG4gICAgICAgICAgICBrZXk9e3NvdXJjZS5faWR9XG4gICAgICAgICAgICBzb3VyY2U9e3NvdXJjZX1cbiAgICAgICAgICAgIHR5cGU9e3R5cGV9XG4gICAgICAgIC8+KX1cbiAgICA8L2Rpdj5cbjwvZGl2PjtcblxuU291cmNlcy5jb250ZXh0VHlwZXMgPSBjaGlsZENvbnRleHRUeXBlcztcblxuY29uc3QgVHlwZSA9ICh7dHlwZSwgc291cmNlc306IFByb3BzICYge3R5cGU6IHN0cmluZ30pID0+IHtcbiAgICBjb25zdCBzb3VyY2VzQnlUeXBlID0gc291cmNlcy5maWx0ZXIoKHNvdXJjZSkgPT4gc291cmNlLnR5cGUgPT09IHR5cGUpO1xuXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTggY29sLXNtLW9mZnNldC0yIHVwbG9hZC1ib3hcIj5cbiAgICAgICAgPFNlYXJjaEZvcm0gdHlwZT17dHlwZX0gLz5cbiAgICAgICAge29wdGlvbnMudHlwZXNbdHlwZV0uaGFzSW1hZ2VTZWFyY2goKSAmJlxuICAgICAgICAgICAgPEltYWdlVXBsb2FkRm9ybXMgdHlwZT17dHlwZX0gLz59XG4gICAgICAgIHtzb3VyY2VzQnlUeXBlLmxlbmd0aCA+IDEgJiZcbiAgICAgICAgICAgIDxTb3VyY2VzIHR5cGU9e3R5cGV9IHNvdXJjZXM9e3NvdXJjZXNCeVR5cGV9IC8+fVxuICAgIDwvZGl2Pjtcbn07XG5cbmNvbnN0IEhvbWUgPSAoe3NvdXJjZXN9OiBQcm9wcykgPT4gPFBhZ2VcbiAgICBzcGxhc2g9e29wdGlvbnMudmlld3MuaG9tZVNwbGFzaCAmJlxuICAgICAgICA8b3B0aW9ucy52aWV3cy5ob21lU3BsYXNoIC8+fVxuPlxuICAgIHtPYmplY3Qua2V5cyhvcHRpb25zLnR5cGVzKS5tYXAoKHR5cGUpID0+XG4gICAgICAgIDxUeXBlIGtleT17dHlwZX0gc291cmNlcz17c291cmNlc30gdHlwZT17dHlwZX0gLz4pfVxuPC9QYWdlPjtcblxubW9kdWxlLmV4cG9ydHMgPSBIb21lO1xuIl19