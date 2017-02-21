"use strict";

const React = require("react");
const { renderToString, renderToStaticMarkup } = require("react-dom/server");

const Head = require("../views/Head.js");
const Page = require("../views/Page.js");
const Wrapper = require("../views/Wrapper.js");

const blacklist = (key, value) => key === "_locals" || key === "settings" ? undefined : value;

const engine = (filePath, options, callback) => {
    const View = require(filePath);

    // WARNING: Fixes security issues around embedding JSON in HTML:
    // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
    const state = JSON.stringify(options, blacklist).replace(/</g, "\\u003c");

    const head = renderToStaticMarkup(React.createElement(
        Wrapper,
        options,
        React.createElement(Head, options)
    ));

    const output = renderToString(React.createElement(
        Wrapper,
        options,
        React.createElement(
            Page,
            options,
            React.createElement(View, options)
        )
    ));

    callback(null, `<!DOCTYPE html>
<html lang="${options.lang}">
${head}
<body>
    ${output}
    <script>window.__STATE__=${state}</script>
</body>
</html>`);
};

module.exports = engine;