"use strict";

const React = require("react");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

const { childContextTypes } = require("./Wrapper.js");

const Head = ({
    title,
    social,
    style,
    noIndex
}, { lang, options, utils: { URL } }) => {
    const siteTitle = options.getTitle;
    let pageTitle = siteTitle;

    if (title) {
        pageTitle = `${title}: ${pageTitle}`;
    }

    // An option to disable indexing of this page
    const disableIndex = options.noIndex || noIndex;

    const socialMeta = social && [React.createElement("meta", { key: "1", name: "twitter:card", content: "photo" }), React.createElement("meta", { key: "2", name: "twitter:url", content: social.url }), React.createElement("meta", { key: "3", name: "twitter:title", content: social.title }), React.createElement("meta", { key: "4", name: "twitter:image", content: social.imgURL }), React.createElement("meta", { key: "5", property: "og:title", content: social.title }), React.createElement("meta", { key: "6", property: "og:type", content: "article" }), React.createElement("meta", { key: "7", property: "og:url", content: social.url }), React.createElement("meta", { key: "8", property: "og:image", content: social.imgURL }), React.createElement("meta", { key: "9", property: "og:site_name", content: siteTitle })];

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

const Logo = (props, { options, utils: { URL } }) => React.createElement(
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
    utils: { URL }
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

NavLink.contextTypes = childContextTypes;

const SearchForm = (props, {
    gettext,
    options,
    utils: { URL }
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
    utils: { URL, getOtherURL }
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
    utils: { URL }
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

const Scripts = ({ scripts }, { utils: { URL } }) => React.createElement(
    "div",
    null,
    React.createElement("script", { src: URL("/js/jquery.min.js") }),
    React.createElement("script", { src: URL("/js/bootstrap.min.js") }),
    React.createElement("script", { src: URL("/js/select2.min.js") }),
    React.createElement("script", { src: URL("/js/app.js") }),
    scripts
);

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

const Page = ({
    splash,
    children,
    scripts,
    title,
    social,
    style,
    noIndex
}, { lang }) => React.createElement(
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