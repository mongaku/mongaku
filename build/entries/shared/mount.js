"use strict";

var React = require("react");

var _require = require("react-dom"),
    render = _require.render;

var Wrapper = require("../../views/Wrapper.js");
var Page = require("../../views/Page.js");

module.exports = function (View) {
    var options = window.__STATE__ || {};

    delete window.__STATE__;

    render(React.createElement(
        Wrapper,
        options,
        React.createElement(
            Page,
            options,
            React.createElement(View, options)
        )
    ), document.getElementById("root"));
};