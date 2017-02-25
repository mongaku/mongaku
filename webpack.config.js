// @flow

const path = require("path");

const webpack = require("webpack");

const entry = {};

// TODO: Generate this dynamically
const entries = ["Admin", "EditRecord", "Error", "Home", "ImportImages",
    "ImportRecords", "Login", "Record", "Search", "Upload"];

for (const file of entries) {
    entry[file] = path.resolve(__dirname, `src/entries/${file}.js`);
}

module.exports = {
    entry,

    output: {
        filename: "[name].js",
        path: path.resolve(process.cwd(), "static"),
    },

    resolve: {
        modules: [path.resolve(__dirname, "node_modules"), "node_modules"],
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "shared",
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: ["vendor", "manifest"],
            chunks: ["shared"],
            minChunks(module) {
                return module.userRequest &&
                    module.userRequest.indexOf("node_modules") >= 0;
            },
        }),
    ],

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: path.resolve(__dirname, "node_modules",
                    "babel-loader"),
            },
        ],
    },
};
