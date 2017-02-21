"use strict";

const React = require("react");

const utils = require("./utils");

var babelPluginFlowReactPropTypes_proptype_Options = require("./types.js").babelPluginFlowReactPropTypes_proptype_Options || require("react").PropTypes.any;

var babelPluginFlowReactPropTypes_proptype_User = require("./types.js").babelPluginFlowReactPropTypes_proptype_User || require("react").PropTypes.any;

class Wrapper extends React.Component {
    getChildContext() {
        const { originalUrl, user, options, lang, translations } = this.props;
        // Object is needed, unfortunately, see:
        // https://github.com/facebook/flow/issues/1606
        const context = {
            lang,
            user,
            options,
            originalUrl
        };
        return Object.assign(context, utils(lang, options, translations));
    }

    render() {
        return this.props.children;
    }
}

Wrapper.propTypes = {
    lang: require("react").PropTypes.string.isRequired,
    originalUrl: require("react").PropTypes.string.isRequired,
    user: babelPluginFlowReactPropTypes_proptype_User,
    options: babelPluginFlowReactPropTypes_proptype_Options,
    translations: require("react").PropTypes.shape({}).isRequired,
    children: require("react").PropTypes.any
};
Wrapper.childContextTypes = {
    lang: React.PropTypes.string,
    user: React.PropTypes.any,
    options: React.PropTypes.any,
    originalUrl: React.PropTypes.string,

    // Coming from utils.js
    getOtherURL: React.PropTypes.func,
    URL: React.PropTypes.func,
    stringNum: React.PropTypes.func,
    relativeDate: React.PropTypes.func,
    fixedDate: React.PropTypes.func,
    format: React.PropTypes.func,
    gettext: React.PropTypes.func,
    getSource: React.PropTypes.func
};

module.exports = Wrapper;