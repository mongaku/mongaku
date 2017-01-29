"use strict";

var React = require("react");
var ReactDOMServer = require("react-dom/server");

var Wrapper = require("../views/Wrapper.js");

var engine = function engine(filePath, options, callback) {
    var View = require(filePath);

    var wrapped = React.createElement(
        Wrapper,
        {
            originalUrl: options.originalUrl,
            user: options.user,
            lang: options.lang,
            gettext: options.gettext,
            format: options.format
        },
        React.createElement(View, options)
    );

    var output = ReactDOMServer.renderToStaticMarkup(wrapped);

    callback(null, "<!DOCTYPE html>" + output);
};

module.exports = engine;