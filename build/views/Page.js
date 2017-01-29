"use strict";

var React = require("react");

var options = require("../lib/options");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

var _require = require("./Wrapper.js"),
    childContextTypes = _require.childContextTypes;

var types = Object.keys(options.types);
var multipleTypes = types.length > 1;

var Head = function Head(_ref, _ref2) {
    var title = _ref.title,
        social = _ref.social,
        style = _ref.style,
        noIndex = _ref.noIndex;
    var URL = _ref2.URL,
        getTitle = _ref2.getTitle,
        lang = _ref2.lang;

    var siteTitle = getTitle(options);
    var pageTitle = siteTitle;

    if (title) {
        pageTitle = title + ": " + pageTitle;
    }

    // An option to disable indexing of this page
    var disableIndex = options.noIndex || noIndex;

    var socialMeta = social && [React.createElement("meta", { key: "1", name: "twitter:card", content: "photo" }), React.createElement("meta", { key: "2", name: "twitter:url", content: social.url }), React.createElement("meta", { key: "3", name: "twitter:title", content: social.title }), React.createElement("meta", { key: "4", name: "twitter:image", content: social.imgURL }), React.createElement("meta", { key: "5", property: "og:title", content: social.title }), React.createElement("meta", { key: "6", property: "og:type", content: "article" }), React.createElement("meta", { key: "7", property: "og:url", content: social.url }), React.createElement("meta", { key: "8", property: "og:image", content: social.imgURL }), React.createElement("meta", { key: "9", property: "og:site_name", content: siteTitle })];

    return React.createElement(
        "head",
        null,
        React.createElement("meta", { httpEquiv: "content-type", content: "text/html; charset=utf-8" }),
        React.createElement("meta", { httpEquiv: "content-language", content: lang }),
        React.createElement("meta", { httpEquiv: "X-UA-Compatible", content: "IE=edge" }),
        React.createElement("meta", { name: "viewport",
            content: "width=device-width, initial-scale=1.0"
        }),
        disableIndex && React.createElement("meta", { name: "robots", content: "noindex" }),
        options.faviconUrl && React.createElement("link", { rel: "icon", type: "image/x-icon",
            href: URL(options.faviconUrl)
        }),
        React.createElement(
            "title",
            null,
            pageTitle || title
        ),
        socialMeta,
        React.createElement("link", { rel: "stylesheet", href: URL("/css/bootstrap.min.css") }),
        React.createElement("link", {
            rel: "stylesheet",
            href: URL("/css/bootstrap-theme.min.css")
        }),
        React.createElement("link", { rel: "stylesheet", href: URL("/css/select2.min.css") }),
        React.createElement("link", {
            rel: "stylesheet",
            href: URL("/css/select2-bootstrap.min.css")
        }),
        React.createElement("link", { rel: "stylesheet", href: URL("/css/style.css") }),
        style
    );
};

Head.propTypes = {
    children: require("react").PropTypes.any,
    noIndex: require("react").PropTypes.bool,
    scripts: require("react").PropTypes.any,
    splash: require("react").PropTypes.any,
    style: require("react").PropTypes.any,
    title: require("react").PropTypes.string,
    social: require("react").PropTypes.shape({
        url: require("react").PropTypes.string.isRequired,
        title: require("react").PropTypes.string.isRequired,
        imgURL: require("react").PropTypes.string.isRequired
    })
};
Head.contextTypes = childContextTypes;

var Logo = function Logo(props, _ref3) {
    var getTitle = _ref3.getTitle,
        URL = _ref3.URL;
    return React.createElement(
        "span",
        null,
        React.createElement("img", { alt: getTitle(options),
            src: URL(options.logoUrl),
            height: "40", width: "40"
        }),
        " "
    );
};

var NavLink = function NavLink(_ref4, _ref5) {
    var type = _ref4.type,
        title = _ref4.title;
    var URL = _ref5.URL,
        lang = _ref5.lang,
        gettext = _ref5.gettext;
    return React.createElement(
        "li",
        { className: "dropdown" },
        React.createElement(
            "a",
            {
                href: URL("/" + type + "/search"),
                className: "dropdown-toggle",
                "data-toggle": "dropdown",
                role: "button",
                "aria-haspopup": "true",
                "aria-expanded": "false"
            },
            title,
            " ",
            React.createElement("span", { className: "caret" })
        ),
        React.createElement(
            "ul",
            { className: "dropdown-menu" },
            React.createElement(
                "li",
                null,
                React.createElement(
                    "form",
                    {
                        action: URL("/" + type + "/search"),
                        method: "GET",
                        className: "form-search form-inline dropdown-search"
                    },
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement("input", {
                            type: "hidden",
                            name: "lang",
                            value: lang
                        }),
                        React.createElement("input", { type: "search", id: "filter", name: "filter",
                            placeholder: gettext("Search"),
                            className: "form-control search-query"
                        })
                    ),
                    " ",
                    React.createElement("input", {
                        type: "submit",
                        value: gettext("Search"),
                        className: "btn btn-primary"
                    })
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "a",
                    { href: URL("/" + type + "/search") },
                    gettext("Browse All")
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "a",
                    { href: URL("/" + type + "/create") },
                    gettext("Create New")
                )
            )
        )
    );
};

NavLink.contextTypes = childContextTypes;

var SearchForm = function SearchForm(props, _ref6) {
    var gettext = _ref6.gettext,
        URL = _ref6.URL;
    return React.createElement(
        "form",
        {
            action: URL("/" + types[0] + "/search"),
            method: "GET",
            className: "navbar-form navbar-right search form-inline hidden-xs"
        },
        React.createElement(
            "div",
            { className: "form-group" },
            React.createElement("input", { name: "filter", type: "text",
                className: "form-control search-query",
                placeholder: gettext("Search")
            })
        ),
        " ",
        React.createElement("input", { type: "submit", className: "btn btn-primary",
            value: gettext("Search")
        })
    );
};

SearchForm.contextTypes = childContextTypes;

var LocaleMenu = function LocaleMenu(props, _ref7) {
    var lang = _ref7.lang,
        URL = _ref7.URL,
        getOtherURL = _ref7.getOtherURL;
    return React.createElement(
        "li",
        { className: "dropdown" },
        React.createElement(
            "a",
            { href: "", className: "dropdown-toggle",
                "data-toggle": "dropdown", role: "button",
                "aria-expanded": "false"
            },
            React.createElement("img", { alt: options.locales[lang],
                src: URL("/images/" + lang + ".png"),
                width: "16", height: "11"
            }),
            " ",
            options.locales[lang],
            React.createElement("span", { className: "caret" })
        ),
        React.createElement(
            "ul",
            { className: "dropdown-menu", role: "menu" },
            Object.keys(options.locales).filter(function (locale) {
                return locale !== lang;
            }).map(function (locale) {
                return React.createElement(
                    "li",
                    { key: locale },
                    React.createElement(
                        "a",
                        { href: getOtherURL(locale) },
                        React.createElement("img", { src: URL("/images/" + locale + ".png"),
                            alt: options.locales[locale],
                            width: "16", height: "11"
                        }),
                        " ",
                        options.locales[locale]
                    )
                );
            })
        )
    );
};

LocaleMenu.contextTypes = childContextTypes;

var Header = function Header(props, _ref8) {
    var gettext = _ref8.gettext,
        URL = _ref8.URL,
        getShortTitle = _ref8.getShortTitle,
        user = _ref8.user;
    return React.createElement(
        "div",
        {
            className: "navbar navbar-default navbar-static-top"
        },
        React.createElement(
            "div",
            { className: "container" },
            React.createElement(
                "div",
                { className: "navbar-header" },
                React.createElement(
                    "button",
                    { type: "button", className: "navbar-toggle",
                        "data-toggle": "collapse",
                        "data-target": "#header-navbar"
                    },
                    React.createElement(
                        "span",
                        { className: "sr-only" },
                        "Toggle Navigation"
                    ),
                    React.createElement("span", { className: "icon-bar" }),
                    React.createElement("span", { className: "icon-bar" }),
                    React.createElement("span", { className: "icon-bar" })
                ),
                React.createElement(
                    "a",
                    { className: "navbar-brand", href: URL("/") },
                    options.logoUrl && React.createElement(Logo, null),
                    getShortTitle(options)
                )
            ),
            React.createElement(
                "div",
                { id: "header-navbar", className: "collapse navbar-collapse" },
                React.createElement(
                    "ul",
                    { className: "nav navbar-nav" },
                    !multipleTypes && React.createElement(
                        "li",
                        null,
                        React.createElement(
                            "a",
                            { href: URL("/" + types[0] + "/search") },
                            gettext("Browse All")
                        )
                    ),
                    Object.keys(options.types).map(function (type) {
                        var title = options.types[type].name({ gettext: gettext });
                        return React.createElement(NavLink, { type: type, title: title, key: type });
                    }),
                    user && React.createElement(
                        "li",
                        null,
                        React.createElement(
                            "a",
                            { href: URL("/logout") },
                            gettext("Logout")
                        )
                    ),
                    Object.keys(options.locales).length > 1 && React.createElement(LocaleMenu, null)
                ),
                multipleTypes && React.createElement(SearchForm, null)
            )
        )
    );
};

Header.contextTypes = childContextTypes;

var Scripts = function Scripts(_ref9, _ref10) {
    var scripts = _ref9.scripts;
    var URL = _ref10.URL;
    return React.createElement(
        "div",
        null,
        React.createElement("script", { src: URL("/js/jquery.min.js") }),
        React.createElement("script", { src: URL("/js/bootstrap.min.js") }),
        React.createElement("script", { src: URL("/js/select2.min.js") }),
        React.createElement("script", { src: URL("/js/app.js") }),
        scripts
    );
};

Scripts.propTypes = {
    children: require("react").PropTypes.any,
    noIndex: require("react").PropTypes.bool,
    scripts: require("react").PropTypes.any,
    splash: require("react").PropTypes.any,
    style: require("react").PropTypes.any,
    title: require("react").PropTypes.string,
    social: require("react").PropTypes.shape({
        url: require("react").PropTypes.string.isRequired,
        title: require("react").PropTypes.string.isRequired,
        imgURL: require("react").PropTypes.string.isRequired
    })
};
Scripts.contextTypes = childContextTypes;

var Page = function Page(_ref11, _ref12) {
    var splash = _ref11.splash,
        children = _ref11.children,
        scripts = _ref11.scripts,
        title = _ref11.title,
        social = _ref11.social,
        style = _ref11.style,
        noIndex = _ref11.noIndex;
    var lang = _ref12.lang;
    return React.createElement(
        "html",
        { lang: lang },
        React.createElement(Head, { title: title, social: social, style: style, noIndex: noIndex }),
        React.createElement(
            "body",
            null,
            React.createElement(Header, null),
            splash,
            React.createElement(
                "div",
                { className: "container" },
                children
            ),
            React.createElement(Scripts, { scripts: scripts })
        )
    );
};

Page.propTypes = {
    children: require("react").PropTypes.any,
    noIndex: require("react").PropTypes.bool,
    scripts: require("react").PropTypes.any,
    splash: require("react").PropTypes.any,
    style: require("react").PropTypes.any,
    title: require("react").PropTypes.string,
    social: require("react").PropTypes.shape({
        url: require("react").PropTypes.string.isRequired,
        title: require("react").PropTypes.string.isRequired,
        imgURL: require("react").PropTypes.string.isRequired
    })
};
Page.contextTypes = childContextTypes;

module.exports = Page;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92aWV3cy9QYWdlLmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwicmVxdWlyZSIsIm9wdGlvbnMiLCJjaGlsZENvbnRleHRUeXBlcyIsInR5cGVzIiwiT2JqZWN0Iiwia2V5cyIsIm11bHRpcGxlVHlwZXMiLCJsZW5ndGgiLCJIZWFkIiwidGl0bGUiLCJzb2NpYWwiLCJzdHlsZSIsIm5vSW5kZXgiLCJVUkwiLCJnZXRUaXRsZSIsImxhbmciLCJzaXRlVGl0bGUiLCJwYWdlVGl0bGUiLCJkaXNhYmxlSW5kZXgiLCJzb2NpYWxNZXRhIiwidXJsIiwiaW1nVVJMIiwiZmF2aWNvblVybCIsImNvbnRleHRUeXBlcyIsIkxvZ28iLCJwcm9wcyIsImxvZ29VcmwiLCJOYXZMaW5rIiwidHlwZSIsImdldHRleHQiLCJTZWFyY2hGb3JtIiwiTG9jYWxlTWVudSIsImdldE90aGVyVVJMIiwibG9jYWxlcyIsImZpbHRlciIsImxvY2FsZSIsIm1hcCIsIkhlYWRlciIsImdldFNob3J0VGl0bGUiLCJ1c2VyIiwibmFtZSIsIlNjcmlwdHMiLCJzY3JpcHRzIiwiUGFnZSIsInNwbGFzaCIsImNoaWxkcmVuIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFFQSxJQUFNQSxRQUFRQyxRQUFRLE9BQVIsQ0FBZDs7QUFFQSxJQUFNQyxVQUFVRCxRQUFRLGdCQUFSLENBQWhCOzs7O2VBRzRCQSxRQUFRLGNBQVIsQztJQUFyQkUsaUIsWUFBQUEsaUI7O0FBRVAsSUFBTUMsUUFBUUMsT0FBT0MsSUFBUCxDQUFZSixRQUFRRSxLQUFwQixDQUFkO0FBQ0EsSUFBTUcsZ0JBQWdCSCxNQUFNSSxNQUFOLEdBQWUsQ0FBckM7O0FBZ0JBLElBQU1DLE9BQU8sU0FBUEEsSUFBTyxjQUtnQztBQUFBLFFBSnpDQyxLQUl5QyxRQUp6Q0EsS0FJeUM7QUFBQSxRQUh6Q0MsTUFHeUMsUUFIekNBLE1BR3lDO0FBQUEsUUFGekNDLEtBRXlDLFFBRnpDQSxLQUV5QztBQUFBLFFB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SUFSRTtBQUFBLFdBUWlCO0FBQUE7QUFBQSxVQUFNLE1BQU1BLElBQVo7QUFDMUIsNEJBQUMsSUFBRCxJQUFNLE9BQU9OLEtBQWIsRUFBb0IsUUFBUUMsTUFBNUIsRUFBb0MsT0FBT0MsS0FBM0MsRUFBa0QsU0FBU0MsT0FBM0QsR0FEMEI7QUFFMUI7QUFBQTtBQUFBO0FBQ0ksZ0NBQUMsTUFBRCxPQURKO0FBRUtnQyxrQkFGTDtBQUdJO0FBQUE7QUFBQSxrQkFBSyxXQUFVLFdBQWY7QUFDS0M7QUFETCxhQUhKO0FBTUksZ0NBQUMsT0FBRCxJQUFTLFNBQVNILE9BQWxCO0FBTko7QUFGMEIsS0FSakI7QUFBQSxDQUFiOzs7Ozs7Ozs7Ozs7Ozs7QUFvQkFDLEtBQUtwQixZQUFMLEdBQW9CckIsaUJBQXBCOztBQUVBNEMsT0FBT0MsT0FBUCxHQUFpQkosSUFBakIiLCJmaWxlIjoiUGFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmNvbnN0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG5jb25zdCBvcHRpb25zID0gcmVxdWlyZShcIi4uL2xpYi9vcHRpb25zXCIpO1xuXG5pbXBvcnQgdHlwZSB7Q29udGV4dH0gZnJvbSBcIi4vdHlwZXMuanNcIjtcbmNvbnN0IHtjaGlsZENvbnRleHRUeXBlc30gPSByZXF1aXJlKFwiLi9XcmFwcGVyLmpzXCIpO1xuXG5jb25zdCB0eXBlcyA9IE9iamVjdC5rZXlzKG9wdGlvbnMudHlwZXMpO1xuY29uc3QgbXVsdGlwbGVUeXBlcyA9IHR5cGVzLmxlbmd0aCA+IDE7XG5cbnR5cGUgUHJvcHMgPSB7XG4gICAgY2hpbGRyZW4/OiBSZWFjdC5FbGVtZW50PCo+LFxuICAgIG5vSW5kZXg/OiBib29sZWFuLFxuICAgIHNjcmlwdHM/OiBSZWFjdC5FbGVtZW50PCo+LFxuICAgIHNwbGFzaD86IFJlYWN0LkVsZW1lbnQ8Kj4sXG4gICAgc3R5bGU/OiBSZWFjdC5FbGVtZW50PCo+LFxuICAgIHRpdGxlPzogc3RyaW5nLFxuICAgIHNvY2lhbD86IHtcbiAgICAgICAgdXJsOiBzdHJpbmcsXG4gICAgICAgIHRpdGxlOiBzdHJpbmcsXG4gICAgICAgIGltZ1VSTDogc3RyaW5nLFxuICAgIH0sXG59O1xuXG5jb25zdCBIZWFkID0gKHtcbiAgICB0aXRsZSxcbiAgICBzb2NpYWwsXG4gICAgc3R5bGUsXG4gICAgbm9JbmRleCxcbn06IFByb3BzLCB7VVJMLCBnZXRUaXRsZSwgbGFuZ306IENvbnRleHQpID0+IHtcbiAgICBjb25zdCBzaXRlVGl0bGUgPSBnZXRUaXRsZShvcHRpb25zKTtcbiAgICBsZXQgcGFnZVRpdGxlID0gc2l0ZVRpdGxlO1xuXG4gICAgaWYgKHRpdGxlKSB7XG4gICAgICAgIHBhZ2VUaXRsZSA9IGAke3RpdGxlfTogJHtwYWdlVGl0bGV9YDtcbiAgICB9XG5cbiAgICAvLyBBbiBvcHRpb24gdG8gZGlzYWJsZSBpbmRleGluZyBvZiB0aGlzIHBhZ2VcbiAgICBjb25zdCBkaXNhYmxlSW5kZXggPSBvcHRpb25zLm5vSW5kZXggfHwgbm9JbmRleDtcblxuICAgIGNvbnN0IHNvY2lhbE1ldGEgPSBzb2NpYWwgJiYgW1xuICAgICAgICA8bWV0YSBrZXk9XCIxXCIgbmFtZT1cInR3aXR0ZXI6Y2FyZFwiIGNvbnRlbnQ9XCJwaG90b1wiLz4sXG4gICAgICAgIDxtZXRhIGtleT1cIjJcIiBuYW1lPVwidHdpdHRlcjp1cmxcIiBjb250ZW50PXtzb2NpYWwudXJsfS8+LFxuICAgICAgICA8bWV0YSBrZXk9XCIzXCIgbmFtZT1cInR3aXR0ZXI6dGl0bGVcIiBjb250ZW50PXtzb2NpYWwudGl0bGV9Lz4sXG4gICAgICAgIDxtZXRhIGtleT1cIjRcIiBuYW1lPVwidHdpdHRlcjppbWFnZVwiIGNvbnRlbnQ9e3NvY2lhbC5pbWdVUkx9Lz4sXG4gICAgICAgIDxtZXRhIGtleT1cIjVcIiBwcm9wZXJ0eT1cIm9nOnRpdGxlXCIgY29udGVudD17c29jaWFsLnRpdGxlfS8+LFxuICAgICAgICA8bWV0YSBrZXk9XCI2XCIgcHJvcGVydHk9XCJvZzp0eXBlXCIgY29udGVudD1cImFydGljbGVcIi8+LFxuICAgICAgICA8bWV0YSBrZXk9XCI3XCIgcHJvcGVydHk9XCJvZzp1cmxcIiBjb250ZW50PXtzb2NpYWwudXJsfS8+LFxuICAgICAgICA8bWV0YSBrZXk9XCI4XCIgcHJvcGVydHk9XCJvZzppbWFnZVwiIGNvbnRlbnQ9e3NvY2lhbC5pbWdVUkx9Lz4sXG4gICAgICAgIDxtZXRhIGtleT1cIjlcIiBwcm9wZXJ0eT1cIm9nOnNpdGVfbmFtZVwiIGNvbnRlbnQ9e3NpdGVUaXRsZX0vPixcbiAgICBdO1xuXG4gICAgcmV0dXJuIDxoZWFkPlxuICAgICAgICA8bWV0YSBodHRwRXF1aXY9XCJjb250ZW50LXR5cGVcIiBjb250ZW50PVwidGV4dC9odG1sOyBjaGFyc2V0PXV0Zi04XCIvPlxuICAgICAgICA8bWV0YSBodHRwRXF1aXY9XCJjb250ZW50LWxhbmd1YWdlXCIgY29udGVudD17bGFuZ30vPlxuICAgICAgICA8bWV0YSBodHRwRXF1aXY9XCJYLVVBLUNvbXBhdGlibGVcIiBjb250ZW50PVwiSUU9ZWRnZVwiLz5cbiAgICAgICAgPG1ldGEgbmFtZT1cInZpZXdwb3J0XCJcbiAgICAgICAgICAgIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MS4wXCJcbiAgICAgICAgLz5cbiAgICAgICAge2Rpc2FibGVJbmRleCAmJiA8bWV0YSBuYW1lPVwicm9ib3RzXCIgY29udGVudD1cIm5vaW5kZXhcIi8+fVxuICAgICAgICB7b3B0aW9ucy5mYXZpY29uVXJsICYmIDxsaW5rIHJlbD1cImljb25cIiB0eXBlPVwiaW1hZ2UveC1pY29uXCJcbiAgICAgICAgICAgIGhyZWY9e1VSTChvcHRpb25zLmZhdmljb25VcmwpfVxuICAgICAgICAvPn1cbiAgICAgICAgPHRpdGxlPntwYWdlVGl0bGUgfHwgdGl0bGV9PC90aXRsZT5cbiAgICAgICAge3NvY2lhbE1ldGF9XG4gICAgICAgIDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPXtVUkwoXCIvY3NzL2Jvb3RzdHJhcC5taW4uY3NzXCIpfS8+XG4gICAgICAgIDxsaW5rXG4gICAgICAgICAgICByZWw9XCJzdHlsZXNoZWV0XCJcbiAgICAgICAgICAgIGhyZWY9e1VSTChcIi9jc3MvYm9vdHN0cmFwLXRoZW1lLm1pbi5jc3NcIil9XG4gICAgICAgIC8+XG4gICAgICAgIDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPXtVUkwoXCIvY3NzL3NlbGVjdDIubWluLmNzc1wiKX0vPlxuICAgICAgICA8bGlua1xuICAgICAgICAgICAgcmVsPVwic3R5bGVzaGVldFwiXG4gICAgICAgICAgICBocmVmPXtVUkwoXCIvY3NzL3NlbGVjdDItYm9vdHN0cmFwLm1pbi5jc3NcIil9XG4gICAgICAgIC8+XG4gICAgICAgIDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPXtVUkwoXCIvY3NzL3N0eWxlLmNzc1wiKX0vPlxuICAgICAgICB7c3R5bGV9XG4gICAgPC9oZWFkPjtcbn07XG5cbkhlYWQuY29udGV4dFR5cGVzID0gY2hpbGRDb250ZXh0VHlwZXM7XG5cbmNvbnN0IExvZ28gPSAocHJvcHMsIHtnZXRUaXRsZSwgVVJMfTogQ29udGV4dCkgPT4gPHNwYW4+XG4gICAgPGltZyBhbHQ9e2dldFRpdGxlKG9wdGlvbnMpfVxuICAgICAgICBzcmM9e1VSTChvcHRpb25zLmxvZ29VcmwpfVxuICAgICAgICBoZWlnaHQ9XCI0MFwiIHdpZHRoPVwiNDBcIlxuICAgIC8+XG4gICAge1wiIFwifVxuPC9zcGFuPjtcblxuY29uc3QgTmF2TGluayA9ICh7dHlwZSwgdGl0bGV9OiBQcm9wcyAmIHt0eXBlOiBzdHJpbmd9LFxuICAgICAgICB7VVJMLCBsYW5nLCBnZXR0ZXh0fTogQ29udGV4dCkgPT4gPGxpIGNsYXNzTmFtZT1cImRyb3Bkb3duXCI+XG4gICAgPGFcbiAgICAgICAgaHJlZj17VVJMKGAvJHt0eXBlfS9zZWFyY2hgKX1cbiAgICAgICAgY2xhc3NOYW1lPVwiZHJvcGRvd24tdG9nZ2xlXCJcbiAgICAgICAgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXG4gICAgICAgIHJvbGU9XCJidXR0b25cIlxuICAgICAgICBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiXG4gICAgICAgIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiXG4gICAgPlxuICAgICAgICB7dGl0bGV9XG4gICAgICAgIHtcIiBcIn1cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY2FyZXRcIi8+XG4gICAgPC9hPlxuICAgIDx1bCBjbGFzc05hbWU9XCJkcm9wZG93bi1tZW51XCI+XG4gICAgICAgIDxsaT5cbiAgICAgICAgICAgIDxmb3JtXG4gICAgICAgICAgICAgICAgYWN0aW9uPXtVUkwoYC8ke3R5cGV9L3NlYXJjaGApfVxuICAgICAgICAgICAgICAgIG1ldGhvZD1cIkdFVFwiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1zZWFyY2ggZm9ybS1pbmxpbmUgZHJvcGRvd24tc2VhcmNoXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiaGlkZGVuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9XCJsYW5nXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtsYW5nfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInNlYXJjaFwiIGlkPVwiZmlsdGVyXCIgbmFtZT1cImZpbHRlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17Z2V0dGV4dChcIlNlYXJjaFwiKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbCBzZWFyY2gtcXVlcnlcIlxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIHtcIiBcIn1cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cInN1Ym1pdFwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtnZXR0ZXh0KFwiU2VhcmNoXCIpfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIlxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgIDwvbGk+XG4gICAgICAgIDxsaT5cbiAgICAgICAgICAgIDxhIGhyZWY9e1VSTChgLyR7dHlwZX0vc2VhcmNoYCl9PlxuICAgICAgICAgICAgICAgIHtnZXR0ZXh0KFwiQnJvd3NlIEFsbFwiKX1cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9saT5cbiAgICAgICAgPGxpPlxuICAgICAgICAgICAgPGEgaHJlZj17VVJMKGAvJHt0eXBlfS9jcmVhdGVgKX0+XG4gICAgICAgICAgICAgICAge2dldHRleHQoXCJDcmVhdGUgTmV3XCIpfVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICA8L2xpPlxuICAgIDwvdWw+XG48L2xpPjtcblxuTmF2TGluay5jb250ZXh0VHlwZXMgPSBjaGlsZENvbnRleHRUeXBlcztcblxuY29uc3QgU2VhcmNoRm9ybSA9IChwcm9wcywge2dldHRleHQsIFVSTH06IENvbnRleHQpID0+IDxmb3JtXG4gICAgYWN0aW9uPXtVUkwoYC8ke3R5cGVzWzBdfS9zZWFyY2hgKX1cbiAgICBtZXRob2Q9XCJHRVRcIlxuICAgIGNsYXNzTmFtZT17XCJuYXZiYXItZm9ybSBuYXZiYXItcmlnaHQgc2VhcmNoIGZvcm0taW5saW5lIGhpZGRlbi14c1wifVxuPlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICA8aW5wdXQgbmFtZT1cImZpbHRlclwiIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbCBzZWFyY2gtcXVlcnlcIlxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9e2dldHRleHQoXCJTZWFyY2hcIil9XG4gICAgICAgIC8+XG4gICAgPC9kaXY+XG4gICAge1wiIFwifVxuICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCJcbiAgICAgICAgdmFsdWU9e2dldHRleHQoXCJTZWFyY2hcIil9XG4gICAgLz5cbjwvZm9ybT47XG5cblNlYXJjaEZvcm0uY29udGV4dFR5cGVzID0gY2hpbGRDb250ZXh0VHlwZXM7XG5cbmNvbnN0IExvY2FsZU1lbnUgPSAocHJvcHMsIHtcbiAgICBsYW5nLFxuICAgIFVSTCxcbiAgICBnZXRPdGhlclVSTCxcbn06IENvbnRleHQpID0+IDxsaSBjbGFzc05hbWU9XCJkcm9wZG93blwiPlxuICAgIDxhIGhyZWY9XCJcIiBjbGFzc05hbWU9XCJkcm9wZG93bi10b2dnbGVcIlxuICAgICAgICBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgcm9sZT1cImJ1dHRvblwiXG4gICAgICAgIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiXG4gICAgPlxuICAgICAgICA8aW1nIGFsdD17b3B0aW9ucy5sb2NhbGVzW2xhbmddfVxuICAgICAgICAgICAgc3JjPXtVUkwoYC9pbWFnZXMvJHtsYW5nfS5wbmdgKX1cbiAgICAgICAgICAgIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxMVwiXG4gICAgICAgIC8+XG4gICAgICAgIHtcIiBcIn1cbiAgICAgICAge29wdGlvbnMubG9jYWxlc1tsYW5nXX1cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY2FyZXRcIi8+XG4gICAgPC9hPlxuICAgIDx1bCBjbGFzc05hbWU9XCJkcm9wZG93bi1tZW51XCIgcm9sZT1cIm1lbnVcIj5cbiAgICAgICAge09iamVjdC5rZXlzKG9wdGlvbnMubG9jYWxlcylcbiAgICAgICAgICAgIC5maWx0ZXIoKGxvY2FsZSkgPT4gbG9jYWxlICE9PSBsYW5nKVxuICAgICAgICAgICAgLm1hcCgobG9jYWxlKSA9PiA8bGkga2V5PXtsb2NhbGV9PlxuICAgICAgICAgICAgICAgIDxhIGhyZWY9e2dldE90aGVyVVJMKGxvY2FsZSl9PlxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17VVJMKGAvaW1hZ2VzLyR7bG9jYWxlfS5wbmdgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGFsdD17b3B0aW9ucy5sb2NhbGVzW2xvY2FsZV19XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTFcIlxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICB7XCIgXCJ9XG4gICAgICAgICAgICAgICAgICAgIHtvcHRpb25zLmxvY2FsZXNbbG9jYWxlXX1cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L2xpPilcbiAgICAgICAgfVxuICAgIDwvdWw+XG48L2xpPjtcblxuTG9jYWxlTWVudS5jb250ZXh0VHlwZXMgPSBjaGlsZENvbnRleHRUeXBlcztcblxuY29uc3QgSGVhZGVyID0gKHByb3BzLCB7XG4gICAgZ2V0dGV4dCxcbiAgICBVUkwsXG4gICAgZ2V0U2hvcnRUaXRsZSxcbiAgICB1c2VyLFxufTogQ29udGV4dCkgPT4gPGRpdlxuICAgIGNsYXNzTmFtZT1cIm5hdmJhciBuYXZiYXItZGVmYXVsdCBuYXZiYXItc3RhdGljLXRvcFwiXG4+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItaGVhZGVyXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJuYXZiYXItdG9nZ2xlXCJcbiAgICAgICAgICAgICAgICBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJcbiAgICAgICAgICAgICAgICBkYXRhLXRhcmdldD1cIiNoZWFkZXItbmF2YmFyXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzci1vbmx5XCI+VG9nZ2xlIE5hdmlnYXRpb248L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbi1iYXJcIi8+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbi1iYXJcIi8+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbi1iYXJcIi8+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIm5hdmJhci1icmFuZFwiIGhyZWY9e1VSTChcIi9cIil9PlxuICAgICAgICAgICAgICAgIHtvcHRpb25zLmxvZ29VcmwgJiYgPExvZ28gLz59XG4gICAgICAgICAgICAgICAge2dldFNob3J0VGl0bGUob3B0aW9ucyl9XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgaWQ9XCJoZWFkZXItbmF2YmFyXCIgY2xhc3NOYW1lPVwiY29sbGFwc2UgbmF2YmFyLWNvbGxhcHNlXCI+XG4gICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2IG5hdmJhci1uYXZcIj5cbiAgICAgICAgICAgICAgICB7IW11bHRpcGxlVHlwZXMgJiYgPGxpPlxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPXtVUkwoYC8ke3R5cGVzWzBdfS9zZWFyY2hgKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7Z2V0dGV4dChcIkJyb3dzZSBBbGxcIil9XG4gICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPn1cbiAgICAgICAgICAgICAgICB7T2JqZWN0LmtleXMob3B0aW9ucy50eXBlcykubWFwKCh0eXBlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gb3B0aW9ucy50eXBlc1t0eXBlXS5uYW1lKHtnZXR0ZXh0fSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA8TmF2TGluayB0eXBlPXt0eXBlfSB0aXRsZT17dGl0bGV9IGtleT17dHlwZX0gLz47XG4gICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAge3VzZXIgJiYgPGxpPlxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPXtVUkwoXCIvbG9nb3V0XCIpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtnZXR0ZXh0KFwiTG9nb3V0XCIpfVxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9saT59XG4gICAgICAgICAgICAgICAge09iamVjdC5rZXlzKG9wdGlvbnMubG9jYWxlcykubGVuZ3RoID4gMSAmJlxuICAgICAgICAgICAgICAgICAgICA8TG9jYWxlTWVudSAvPn1cbiAgICAgICAgICAgIDwvdWw+XG5cbiAgICAgICAgICAgIHttdWx0aXBsZVR5cGVzICYmIDxTZWFyY2hGb3JtIC8+fVxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PjtcblxuSGVhZGVyLmNvbnRleHRUeXBlcyA9IGNoaWxkQ29udGV4dFR5cGVzO1xuXG5jb25zdCBTY3JpcHRzID0gKHtzY3JpcHRzfTogUHJvcHMsIHtVUkx9OiBDb250ZXh0KSA9PiA8ZGl2PlxuICAgIDxzY3JpcHQgc3JjPXtVUkwoXCIvanMvanF1ZXJ5Lm1pbi5qc1wiKX0gLz5cbiAgICA8c2NyaXB0IHNyYz17VVJMKFwiL2pzL2Jvb3RzdHJhcC5taW4uanNcIil9IC8+XG4gICAgPHNjcmlwdCBzcmM9e1VSTChcIi9qcy9zZWxlY3QyLm1pbi5qc1wiKX0gLz5cbiAgICA8c2NyaXB0IHNyYz17VVJMKFwiL2pzL2FwcC5qc1wiKX0gLz5cbiAgICB7c2NyaXB0c31cbjwvZGl2PjtcblxuU2NyaXB0cy5jb250ZXh0VHlwZXMgPSBjaGlsZENvbnRleHRUeXBlcztcblxuY29uc3QgUGFnZSA9ICh7XG4gICAgc3BsYXNoLFxuICAgIGNoaWxkcmVuLFxuICAgIHNjcmlwdHMsXG4gICAgdGl0bGUsXG4gICAgc29jaWFsLFxuICAgIHN0eWxlLFxuICAgIG5vSW5kZXgsXG59OiBQcm9wcywge2xhbmd9OiBDb250ZXh0KSA9PiA8aHRtbCBsYW5nPXtsYW5nfT5cbiAgICA8SGVhZCB0aXRsZT17dGl0bGV9IHNvY2lhbD17c29jaWFsfSBzdHlsZT17c3R5bGV9IG5vSW5kZXg9e25vSW5kZXh9IC8+XG4gICAgPGJvZHk+XG4gICAgICAgIDxIZWFkZXIvPlxuICAgICAgICB7c3BsYXNofVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPFNjcmlwdHMgc2NyaXB0cz17c2NyaXB0c30gLz5cbiAgICA8L2JvZHk+XG48L2h0bWw+O1xuXG5QYWdlLmNvbnRleHRUeXBlcyA9IGNoaWxkQ29udGV4dFR5cGVzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhZ2U7XG4iXX0=