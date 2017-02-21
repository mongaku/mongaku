"use strict";

const React = require("react");
const { renderToString } = require("react-dom/server");

const Wrapper = require("../views/Wrapper.js");

const blacklist = (key, value) => key === "_locals" || key === "settings" ? undefined : value;

const engine = (filePath, options, callback) => {
    const View = require(filePath);

    // WARNING: Fixes security issues around embedding JSON in HTML:
    // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
    const state = JSON.stringify(options, blacklist).replace(/</g, "\\u003c");

    const wrapped = React.createElement(
        Wrapper,
        options,
        React.createElement(View, options)
    );

    const output = renderToString(wrapped);
    const json = `<script>window.__STATE__=${state}</script>`;

    callback(null, `<!DOCTYPE html>${output}${json}`);
};

module.exports = engine;