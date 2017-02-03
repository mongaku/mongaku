"use strict";

const React = require("react");
const ReactDOMServer = require("react-dom/server");

const Wrapper = require("../views/Wrapper.js");

const engine = (filePath, options, callback) => {
    const View = require(filePath);

    const wrapped = React.createElement(
        Wrapper,
        options,
        React.createElement(View, options)
    );

    const output = ReactDOMServer.renderToStaticMarkup(wrapped);

    callback(null, `<!DOCTYPE html>${output}`);
};

module.exports = engine;