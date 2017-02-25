const path = require("path");

const React = require("react");
const {renderToString, renderToStaticMarkup} = require("react-dom/server");

const Head = require("../views/Head.js");
const Page = require("../views/Page.js");
const Wrapper = require("../views/Wrapper.js");

const blacklist = (key, value) =>
    key === "_locals" || key === "settings" ?
        undefined :
        value;

const engine = (filePath: string, options: Object, callback: Function) => {
    const viewName = path.basename(filePath, ".js");
    const View = require(filePath);

    // WARNING: Fixes security issues around embedding JSON in HTML:
    // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
    const state = JSON.stringify(options, blacklist)
        .replace(/</g, "\\u003c");

    const head = renderToStaticMarkup(<Wrapper {...options}>
        <Head {...options} />
    </Wrapper>);

    const output = renderToString(<Wrapper {...options}>
        <Page {...options}>
            <View {...options} />
        </Page>
    </Wrapper>);

    callback(null, `<!DOCTYPE html>
<html lang="${options.lang}">
${head}
<body>
    <div id="root">${output}</div>
    <script>window.__STATE__=${state}</script>
    <script src="/static/vendor.js"></script>
    <script src="/static/shared.js"></script>
    <script src="/static/${viewName}.js"></script>
</body>
</html>`);
};

module.exports = engine;
