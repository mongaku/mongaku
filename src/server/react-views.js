const React = require("react");
const ReactDOMServer = require("react-dom/server");

const Wrapper = require("../views/Wrapper.js");

const engine = (filePath: string, options: Object, callback: Function) => {
    const View = require(filePath);

    const wrapped = <Wrapper {...options}>
        <View {...options} />
    </Wrapper>;

    const output = ReactDOMServer.renderToStaticMarkup(wrapped);

    callback(null, `<!DOCTYPE html>${output}`);
};

module.exports = engine;
