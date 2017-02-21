"use strict";

const React = require("react");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

const { childContextTypes } = require("./Wrapper.js");

const Login = ({ title }, { gettext, URL }) => {
    return React.createElement(
        "div",
        null,
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

Login.propTypes = {
    title: require("react").PropTypes.string.isRequired
};
Login.contextTypes = childContextTypes;

module.exports = Login;