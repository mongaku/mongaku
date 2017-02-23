"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require("react");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

var _require = require("./Wrapper.js"),
    childContextTypes = _require.childContextTypes;

var Logo = function Logo(props, _ref) {
    var options = _ref.options,
        URL = _ref.URL;
    return React.createElement(
        "span",
        null,
        React.createElement("img", { alt: options.getTitle,
            src: URL(options.logoUrl || ""),
            height: "40", width: "40"
        }),
        " "
    );
};

var NavLink = function (_React$Component) {
    _inherits(NavLink, _React$Component);

    function NavLink(props) {
        _classCallCheck(this, NavLink);

        var _this = _possibleConstructorReturn(this, (NavLink.__proto__ || Object.getPrototypeOf(NavLink)).call(this, props));

        _this.state = { open: false };
        return _this;
    }

    _createClass(NavLink, [{
        key: "handleToggle",
        value: function handleToggle(e) {
            e.preventDefault();
            this.setState({
                open: !this.state.open
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                type = _props.type,
                title = _props.title;
            var _context = this.context,
                gettext = _context.gettext,
                user = _context.user,
                URL = _context.URL;

            return React.createElement(
                "li",
                { className: "dropdown " + (this.state.open ? "open" : "") },
                React.createElement(
                    "a",
                    {
                        href: URL("/" + type + "/search"),
                        className: "dropdown-toggle",
                        role: "button",
                        "aria-haspopup": "true",
                        "aria-expanded": "false",
                        onClick: function onClick(e) {
                            return _this2.handleToggle(e);
                        }
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
                    user && user.getEditableSourcesByType[type].length > 0 && React.createElement(
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
        }
    }]);

    return NavLink;
}(React.Component);

NavLink.propTypes = {
    type: require("react").PropTypes.string.isRequired,
    title: require("react").PropTypes.string.isRequired
};


NavLink.contextTypes = childContextTypes;

var SearchForm = function SearchForm(props, _ref2) {
    var gettext = _ref2.gettext,
        options = _ref2.options,
        URL = _ref2.URL;
    return React.createElement(
        "form",
        {
            action: URL("/" + Object.keys(options.types)[0] + "/search"),
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

var LocaleMenu = function LocaleMenu(props, _ref3) {
    var lang = _ref3.lang,
        originalUrl = _ref3.originalUrl,
        options = _ref3.options,
        URL = _ref3.URL,
        getOtherURL = _ref3.getOtherURL;
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
                        { href: getOtherURL(originalUrl, locale) },
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

var Header = function Header(props, _ref4) {
    var gettext = _ref4.gettext,
        user = _ref4.user,
        options = _ref4.options,
        URL = _ref4.URL;
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
                    options.getShortTitle
                )
            ),
            React.createElement(
                "div",
                { id: "header-navbar", className: "collapse navbar-collapse" },
                React.createElement(
                    "ul",
                    { className: "nav navbar-nav" },
                    Object.keys(options.types).map(function (type) {
                        var title = options.types[type].name;
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
};

Header.contextTypes = childContextTypes;

var Page = function Page(_ref5) {
    var children = _ref5.children;
    return React.createElement(
        "div",
        null,
        React.createElement(Header, null),
        React.createElement(
            "div",
            { className: "container" },
            children
        )
    );
};

Page.propTypes = {
    children: require("react").PropTypes.any
};
module.exports = Page;