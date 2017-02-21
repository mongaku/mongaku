"use strict";

const React = require("react");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

const { childContextTypes } = require("./Wrapper.js");

const Logo = (props, { options, URL }) => React.createElement(
    "span",
    null,
    React.createElement("img", { alt: options.getTitle,
        src: URL(options.logoUrl || ""),
        height: "40", width: "40"
    }),
    " "
);

const NavLink = ({ type, title }, {
    gettext,
    user,
    URL
}) => React.createElement(
    "li",
    { className: "dropdown" },
    React.createElement(
        "a",
        {
            href: URL(`/${type}/search`),
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
                    action: URL(`/${type}/search`),
                    method: "GET",
                    className: "form-search form-inline dropdown-search"
                },
                React.createElement(
                    "div",
                    { className: "form-group" },
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
                { href: URL(`/${type}/search`) },
                gettext("Browse All")
            )
        ),
        user && user.getEditableSourcesByType[type].length > 0 && React.createElement(
            "li",
            null,
            React.createElement(
                "a",
                { href: URL(`/${type}/create`) },
                gettext("Create New")
            )
        )
    )
);

NavLink.propTypes = {
    type: require("react").PropTypes.string.isRequired,
    title: require("react").PropTypes.string.isRequired
};
NavLink.contextTypes = childContextTypes;

const SearchForm = (props, {
    gettext,
    options,
    URL
}) => React.createElement(
    "form",
    {
        action: URL(`/${Object.keys(options.types)[0]}/search`),
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

SearchForm.contextTypes = childContextTypes;

const LocaleMenu = (props, {
    lang,
    originalUrl,
    options,
    URL,
    getOtherURL
}) => React.createElement(
    "li",
    { className: "dropdown" },
    React.createElement(
        "a",
        { href: "", className: "dropdown-toggle",
            "data-toggle": "dropdown", role: "button",
            "aria-expanded": "false"
        },
        React.createElement("img", { alt: options.locales[lang],
            src: URL(`/images/${lang}.png`),
            width: "16", height: "11"
        }),
        " ",
        options.locales[lang],
        React.createElement("span", { className: "caret" })
    ),
    React.createElement(
        "ul",
        { className: "dropdown-menu", role: "menu" },
        Object.keys(options.locales).filter(locale => locale !== lang).map(locale => React.createElement(
            "li",
            { key: locale },
            React.createElement(
                "a",
                { href: getOtherURL(originalUrl, locale) },
                React.createElement("img", { src: URL(`/images/${locale}.png`),
                    alt: options.locales[locale],
                    width: "16", height: "11"
                }),
                " ",
                options.locales[locale]
            )
        ))
    )
);

LocaleMenu.contextTypes = childContextTypes;

const Header = (props, {
    gettext,
    user,
    options,
    URL
}) => React.createElement(
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
                options.getShortTitle
            )
        ),
        React.createElement(
            "div",
            { id: "header-navbar", className: "collapse navbar-collapse" },
            React.createElement(
                "ul",
                { className: "nav navbar-nav" },
                Object.keys(options.types).map(type => {
                    const title = options.types[type].name;
                    return React.createElement(NavLink, { type: type, title: title, key: type });
                }),
                !user && React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "a",
                        { href: URL("/login") },
                        gettext("Login")
                    )
                ),
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
            Object.keys(options.types).length > 1 && React.createElement(SearchForm, null)
        )
    )
);

Header.contextTypes = childContextTypes;

const Page = ({ children }) => React.createElement(
    "div",
    null,
    React.createElement(Header, null),
    React.createElement(
        "div",
        { className: "container" },
        children
    )
);

Page.propTypes = {
    children: require("react").PropTypes.any
};
module.exports = Page;