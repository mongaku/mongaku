"use strict";

const qs = require("querystring");

const moment = require("moment");
const React = require("react");

const urls = require("../lib/urls");

var babelPluginFlowReactPropTypes_proptype_User = require("./types.js").babelPluginFlowReactPropTypes_proptype_User || require("react").PropTypes.any;

class Wrapper extends React.Component {
    getChildContext() {
        const { originalUrl, user, lang, gettext, format } = this.props;

        return {
            lang,
            gettext,
            format,
            user,

            getOtherURL(locale) {
                return urls.gen(locale, originalUrl);
            },

            URL(path, query) {
                let url = typeof path.getURL === "function" ? path.getURL(lang) : urls.gen(lang, path);

                if (query) {
                    url = url + (url.indexOf("?") >= 0 ? "&" : "?") + qs.stringify(query);
                }

                return url;
            },

            fullName(item) {
                return typeof item.getFullName === "function" ? item.getFullName(lang) : typeof item.name === "string" ? item.name : typeof item === "string" ? item : "";
            },

            shortName(item) {
                return item.getShortName(lang);
            },

            getTitle(item) {
                return item.getTitle({ lang, gettext, format });
            },

            getShortTitle(item) {
                return item.getShortTitle({ lang, gettext, format });
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
    gettext: require("react").PropTypes.func.isRequired,
    format: require("react").PropTypes.func.isRequired,
    children: require("react").PropTypes.any
};
Wrapper.childContextTypes = {
    lang: React.PropTypes.string,
    gettext: React.PropTypes.func,
    format: React.PropTypes.func,
    user: React.PropTypes.any,
    getOtherURL: React.PropTypes.func,
    URL: React.PropTypes.func,
    fullName: React.PropTypes.func,
    shortName: React.PropTypes.func,
    getTitle: React.PropTypes.func,
    getShortTitle: React.PropTypes.func,
    stringNum: React.PropTypes.func,
    relativeDate: React.PropTypes.func,
    fixedDate: React.PropTypes.func
};

module.exports = Wrapper;