"use strict";

const React = require("react");

const Page = require("./Page.js");

const Error = props => {
    const { title } = props;
    return React.createElement(
        Page,
        { title: title },
        React.createElement(
            "div",
            { className: "row" },
            React.createElement(
                "div",
                { className: "col-xs-12" },
                React.createElement(
                    "h1",
                    null,
                    props.title
                ),
                props.body && React.createElement(
                    "pre",
                    null,
                    props.body
                )
            )
        )
    );
};

Error.propTypes = {
    body: require("react").PropTypes.string,
    title: require("react").PropTypes.string.isRequired
};
module.exports = Error;