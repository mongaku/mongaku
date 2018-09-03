// @flow

const React = require("react");
const {render} = require("react-dom");

const Wrapper = require("../../views/Wrapper.js");
const Page = require("../../views/Page.js");

import type {User, Options} from "../../views/types.js";

module.exports = (View: React.ComponentType<*>) => {
    const options: {
        lang: string,
        originalUrl: string,
        user: User,
        options: Options,
        translations: {
            [message: string]: ?Array<string>,
        },
    } = window.__STATE__;

    if (options) {
        delete window.__STATE__;

        const root = document.getElementById("root");

        if (root) {
            render(
                <Wrapper {...options}>
                    <Page {...options}>
                        <View {...options} />
                    </Page>
                </Wrapper>,
                root,
            );
        }
    }
};
