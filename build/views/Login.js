"use strict";

var React = require("react");

var Page = require("./Page.js");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

var _require = require("./Wrapper.js"),
    childContextTypes = _require.childContextTypes;

var Login = function Login(props, _ref) {
    var gettext = _ref.gettext,
        URL = _ref.URL;

    var title = gettext("Login");

    return React.createElement(
        Page,
        { title: title },
        React.createElement(
            "h1",
            null,
            title
        ),
        React.createElement(
            "form",
            { action: URL("/login"), method: "post" },
            React.createElement(
                "div",
                null,
                React.createElement(
                    "label",
                    { htmlFor: "email" },
                    gettext("Email Address:")
                ),
                " ",
                React.createElement("input", { type: "text", name: "email" })
            ),
            React.createElement(
                "div",
                null,
                React.createElement(
                    "label",
                    { htmlFor: "password" },
                    gettext("Password:")
                ),
                " ",
                React.createElement("input", { type: "password", name: "password" })
            ),
            React.createElement(
                "div",
                null,
                React.createElement("input", { type: "submit", value: title })
            )
        )
    );
};

Login.propTypes = {};
Login.contextTypes = childContextTypes;

module.exports = Login;