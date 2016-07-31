"use strict";

const path = require("path");

require("babel-register")({
    "only": "**/*.jsx",
    "sourceMaps": "inline",
    "presets": [
        path.resolve(__dirname, "..", "node_modules", "babel-preset-es2015"),
        path.resolve(__dirname, "..", "node_modules", "babel-preset-react"),
    ],
});
