// @flow

const React = require("react");
const {render} = require("react-dom");

const Wrapper = require("../../views/Wrapper.js");
const Page = require("../../views/Page.js");

module.exports = (View: ReactClass<*>) => {
    const options = window.__STATE__ || {};

    delete window.__STATE__;

    render(
        <Wrapper {...options}>
            <Page {...options}>
                <View {...options} />
            </Page>
        </Wrapper>,
        document.getElementById("root"),
    );
};
