"use strict";

const qs = require("querystring");

const moment = require("moment");
const React = require("react");

const urls = require("../lib/urls");
const searchURL = require("../logic/shared/search-url");

var babelPluginFlowReactPropTypes_proptype_Options = require("./types.js").babelPluginFlowReactPropTypes_proptype_Options || require("react").PropTypes.any;

var babelPluginFlowReactPropTypes_proptype_User = require("./types.js").babelPluginFlowReactPropTypes_proptype_User || require("react").PropTypes.any;

class Wrapper extends React.Component {
    getChildContext() {
        const { originalUrl, user, options, lang, gettext, format } = this.props;

        return {
            lang,
            gettext,
            format,
            user,
            options,

            getOtherURL(locale) {
                return urls.gen(locale, originalUrl);
            },

            URL(path, query) {
                let url = urls.gen(lang, path);

                if (query) {
                    url = url + (url.indexOf("?") >= 0 ? "&" : "?") + qs.stringify(query);
                }

                return url;
            },

            // Format a number using commas
            stringNum(num) {
                // TODO(jeresig): Have a better way to handle this.
                const separator = lang === "en" ? "," : ".";
                const result = typeof num === "number" ? num : "";
                return result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
            },

            relativeDate(date) {
                return moment(date).locale(lang).fromNow();
            },

            fixedDate(date) {
                return moment(date).locale(lang).format("LLL");
            },

            searchURL(params) {
                return searchURL({ lang }, params);
            }
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
    format: require("react").PropTypes.func.isRequired,
    children: require("react").PropTypes.any
};
Wrapper.childContextTypes = {
    lang: React.PropTypes.string,
    gettext: React.PropTypes.func,
    format: React.PropTypes.func,
    user: React.PropTypes.any,
    options: React.PropTypes.any,
    getOtherURL: React.PropTypes.func,
    URL: React.PropTypes.func,
    stringNum: React.PropTypes.func,
    relativeDate: React.PropTypes.func,
    fixedDate: React.PropTypes.func,
    searchURL: React.PropTypes.func
};

module.exports = Wrapper;