const React = require("react");
const ReactDOMServer = require("react-dom/server");

const Wrapper = require("../views/Wrapper.jsx");

const engine = (filePath: string, options: Object, callback: Function) => {
    const View = require(filePath);

    const wrapped = <Wrapper
        originalUrl={options.originalUrl}
        user={options.user}
        lang={options.lang}
        gettext={options.gettext}
        format={options.format}
    >
        <View {...options} />
    </Wrapper>;

    const output = ReactDOMServer.renderToStaticMarkup(wrapped);

    callback(null, `<!DOCTYPE html>${output}`);
};

module.exports = engine;
