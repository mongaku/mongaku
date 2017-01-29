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