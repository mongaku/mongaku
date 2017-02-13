"use strict";

const React = require("react");

var babelPluginFlowReactPropTypes_proptype_Options = require("./types.js").babelPluginFlowReactPropTypes_proptype_Options || require("react").PropTypes.any;

var babelPluginFlowReactPropTypes_proptype_User = require("./types.js").babelPluginFlowReactPropTypes_proptype_User || require("react").PropTypes.any;

class Wrapper extends React.Component {
    getChildContext() {
        const { originalUrl, user, options, i18n } = this.props;

        return {
            lang: i18n.lang,
            gettext: msg => i18n.gettext(msg),
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
    user: babelPluginFlowReactPropTypes_proptype_User,
    options: babelPluginFlowReactPropTypes_proptype_Options,
    i18n: require("react").PropTypes.shape({
        lang: require("react").PropTypes.string.isRequired,
        gettext: require("react").PropTypes.func.isRequired
    }).isRequired,
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