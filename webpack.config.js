// @flow

const path = require("path");

const webpack = require("webpack");

const entry = {};
const entries = ["Admin", "EditRecord", "Home", "ImportImages",
    "ImportRecords", "Login", "Record", "Search", "Upload"];

for (const file of entries) {
    entry[file] = `./src/views/${file}.js`;
}

module.exports = {
    entry,

    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "client"),
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "shared",
        }),
        // From: https://github.com/moment/moment/issues/1435#issuecomment-249773545
        new webpack.ContextReplacementPlugin(/^\.\/locale$/, (context) => {
            if (!/\/moment\//.test(context.context)) {
                return;
            }
            // context needs to be modified in place
            Object.assign(context, {
                // include only CJK
                regExp: /^\.\/(it|de)/,
                // point to the locale data folder relative to moment's
                // src/lib/locale
                request: "../../locale",
            });
        }),
    ],

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel-loader",
            },
        ],
    },
};
