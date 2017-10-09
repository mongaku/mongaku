/**
 * Extract translatable strings from Mongaku and the app code.
 */

const fs = require("fs");
const path = require("path");
const {execFile} = require("child_process");

const glob = require("glob");

const config = require("../lib/config");

const translationsDir = config.TRANSLATIONS_DIR;
const mongakuRoot = path.resolve(__dirname, "..", "..");
const jsxgettext = path.resolve(mongakuRoot, "node_modules", ".bin",
    "babel-jsxgettext");
const mongakuBuildRoot = path.resolve(mongakuRoot, "build");
const mongakuSrcRoot = path.resolve(mongakuRoot, "src");
const mongakuTypesRoot = path.resolve(mongakuRoot, "types");

module.exports = (args, callback) => {
    if (!fs.existsSync(translationsDir)) {
        fs.mkdirSync(translationsDir);
    }

    // mongaku/build/**/*.js mongaku.js translations/messages.po
    const globPath = `{${mongakuBuildRoot}/**/*.js,${process.cwd()}/**/*.js}`;

    glob(globPath, {
        ignore: [
            `${mongakuSrcRoot}/**/*.js`,
            `${mongakuTypesRoot}/**/*.js`,
            `${mongakuBuildRoot}/**/node_modules/**/*.js`,
            `${process.cwd()}/**/node_modules/**/*.js`,
        ],
    }, (err, files) => {
        const relativeFiles = files.map(file =>
            path.relative(process.cwd(), file));
        console.log(relativeFiles);
        execFile(jsxgettext, [
            ...relativeFiles,
            path.relative(process.cwd(),
                path.resolve(translationsDir, "messages.po")),
        ], callback);
    });
};
