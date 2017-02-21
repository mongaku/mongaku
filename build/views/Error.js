"use strict";

const React = require("react");

const Error = ({ title, body }) => React.createElement(
    "div",
    null,
    React.createElement(
        "div",
        { className: "row" },
        React.createElement(
            "div",
            { className: "col-xs-12" },
            React.createElement(
                "h1",
                null,
                title
            ),
            body && React.createElement(
                "pre",
                null,
                body
            )
        )
    )
);

Error.propTypes = {
    body: require("react").PropTypes.string,
    title: require("react").PropTypes.string.isRequired
};
module.exports = Error;