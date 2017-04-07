const Module = require("module");
const path = require("path");

const IntlPolyfill = require("intl");
const React = require("react");
const {renderToString, renderToStaticMarkup} = require("react-dom/server");

const config = require("../lib/config");
const urlsLib = require("../lib/urls");

const Head = require("../views/Head.js");
const Page = require("../views/Page.js");
const Wrapper = require("../views/Wrapper.js");

const blacklist = (key, value) =>
    (key === "_locals" || key === "settings" ? undefined : value);

if (config.NODE_ENV === "production") {
    const originalLoader = Module._load;

    // Override the normal "require" call to handle any attempts to dynamically
    // load react or react-dom instead of preact
    Module._load = function(request, parent) {
        if (request === "react" || request === "react-dom") {
            return originalLoader.call(this, "preact-compat", parent);
        }

        return originalLoader(...arguments);
    };
}

// Import in the Intl polyfills for better locale support (only needed for
// Node as the browser already has good support)
global.Intl.NumberFormat = IntlPolyfill.NumberFormat;
global.Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;

const engine = (filePath: string, options: Object, callback: Function) => {
    const urls = urlsLib(options.options);
    const viewName = path.basename(filePath, ".js");
    const View = require(filePath);

    // WARNING: Fixes security issues around embedding JSON in HTML:
    // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
    const state = JSON.stringify(options, blacklist).replace(/</g, "\\u003c");

    const head = renderToStaticMarkup(
        <Wrapper {...options}>
            <Head {...options} />
        </Wrapper>
    );

    const output = renderToString(
        <Wrapper {...options}>
            <Page {...options}>
                <View {...options} />
            </Page>
        </Wrapper>
    );

    callback(
        null,
        `<!DOCTYPE html>
<html lang="${options.lang}">
${head}
<body>
    <div id="root">${output}</div>
    <script>window.__STATE__=${state}</script>
    <script src="${urls.genStatic("/js/vendor.js")}" defer></script>
    <script src="${urls.genStatic("/js/shared.js")}" defer></script>
    <script src="${urls.genStatic(`/js/${viewName}.js`)}" defer></script>
</body>
</html>`
    );
};

module.exports = engine;
