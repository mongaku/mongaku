"use strict";

const React = require("react");

var babelPluginFlowReactPropTypes_proptype_Options = require("./types.js").babelPluginFlowReactPropTypes_proptype_Options || require("react").PropTypes.any;

var babelPluginFlowReactPropTypes_proptype_User = require("./types.js").babelPluginFlowReactPropTypes_proptype_User || require("react").PropTypes.any;

class Wrapper extends React.Component {
    getChildContext() {
        const { originalUrl, user, options, lang, gettext } = this.props;

        return {
            lang,
            gettext,
            user,
            options,
            originalUrl
        };
    }

    render() {
        return this.props.children;
    }
}

Wrapper.propTypes = {
    originalUrl: require("react").PropTypes.string.isRequired,
    lang: require("react").PropTypes.string.isRequired,
    user: babelPluginFlowReactPropTypes_proptype_User,
    options: babelPluginFlowReactPropTypes_proptype_Options,
    gettext: require("react").PropTypes.func.isRequired,
    children: require("react").PropTypes.any
};
Wrapper.childContextTypes = {
    lang: React.PropTypes.string,
    gettext: React.PropTypes.func,
    user: React.PropTypes.any,
    options: React.PropTypes.any,
    originalUrl: React.PropTypes.string
};

module.exports = Wrapper;