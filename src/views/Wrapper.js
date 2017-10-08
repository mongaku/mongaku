// @flow

const React = require("react");
const PropTypes = require("prop-types");

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
    };
    render() {
        return this.props.children;
    }
}

Wrapper.childContextTypes = {
    lang: PropTypes.string,
    user: PropTypes.any,
    options: PropTypes.any,
    originalUrl: PropTypes.string,

    // Coming from utils.js
    getOtherURL: PropTypes.func,
    URL: PropTypes.func,
    STATIC: PropTypes.func,
    stringNum: PropTypes.func,
    fixedDate: PropTypes.func,
    format: PropTypes.func,
    gettext: PropTypes.func,
    getSource: PropTypes.func,
};

module.exports = Wrapper;
