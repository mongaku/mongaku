"use strict";

var path = require("path");

var React = require("react");

var _require = require("react-dom/server"),
    renderToString = _require.renderToString,
    renderToStaticMarkup = _require.renderToStaticMarkup;

var Head = require("../views/Head.js");
var Page = require("../views/Page.js");
var Wrapper = require("../views/Wrapper.js");

var blacklist = function blacklist(key, value) {
    return key === "_locals" || key === "settings" ? undefined : value;
};

var engine = function engine(filePath, options, callback) {
    var viewName = path.basename(filePath, ".js");
    var View = require(filePath);

    // WARNING: Fixes security issues around embedding JSON in HTML:
    // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
    var state = JSON.stringify(options, blacklist).replace(/</g, "\\u003c");

    var head = renderToStaticMarkup(React.createElement(
        Wrapper,
        options,
        React.createElement(Head, options)
    ));

    var output = renderToString(React.createElement(
        Wrapper,
        options,
        React.createElement(
            Page,
            options,
            React.createElement(View, options)
        )
    ));

    callback(null, "<!DOCTYPE html>\n<html lang=\"" + options.lang + "\">\n" + head + "\n<body>\n    <div id=\"root\">" + output + "</div>\n    <script>window.__STATE__=" + state + "</script>\n    <script src=\"/client/shared.js\"></script>\n    <script src=\"/client/" + viewName + ".js\"</script>\n</body>\n</html>");
};

module.exports = engine;