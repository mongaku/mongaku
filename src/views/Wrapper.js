// @flow

const React = require("react");

import type {User, Options} from "./types.js";

class Wrapper extends React.Component {
    getChildContext() {
        const {originalUrl, user, options, lang, gettext} = this.props;

        return {
            lang,
            gettext,
            user,
            options,
            originalUrl,
        };
    }

    props: {
        originalUrl: string,
        lang: string,
        user: User,
        options: Options,
        gettext: (text: string) => string,
        children?: React.Element<*>,
    }

    render() {
        return this.props.children;
    }
}

Wrapper.childContextTypes = {
    lang: React.PropTypes.string,
    gettext: React.PropTypes.func,
    user: React.PropTypes.any,
    options: React.PropTypes.any,
    originalUrl: React.PropTypes.string,
};

module.exports = Wrapper;
