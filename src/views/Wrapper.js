// @flow

const React = require("react");

const utils = require("./utils");

import type {User, Options} from "./types.js";

class Wrapper extends React.Component {
    getChildContext() {
        const {originalUrl, user, options, lang, translations} = this.props;
        // Object is needed, unfortunately, see:
        // https://github.com/facebook/flow/issues/1606
        const context: Object = {
            lang,
            user,
            options,
            originalUrl,
        };
        return Object.assign(context, utils(lang, options, translations));
    }

    props: {
        lang: string,
        originalUrl: string,
        user: User,
        options: Options,
        translations: {
            [message: string]: ?Array<string>,
        },
        children?: React.Element<*>,
    }

    render() {
        return this.props.children;
    }
}

Wrapper.childContextTypes = {
    lang: React.PropTypes.string,
    user: React.PropTypes.any,
    options: React.PropTypes.any,
    originalUrl: React.PropTypes.string,

    // Coming from utils.js
    getOtherURL: React.PropTypes.func,
    URL: React.PropTypes.func,
    STATIC: React.PropTypes.func,
    stringNum: React.PropTypes.func,
    fixedDate: React.PropTypes.func,
    format: React.PropTypes.func,
    gettext: React.PropTypes.func,
    getSource: React.PropTypes.func,
};

module.exports = Wrapper;
