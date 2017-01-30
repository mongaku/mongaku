// @flow

const qs = require("querystring");

const moment = require("moment");
const React = require("react");

const urls = require("../lib/urls");

class Wrapper extends React.Component {
    getChildContext() {
        const {originalUrl, user, lang, gettext, format} = this.props;

        return {
            lang,
            gettext,
            format,
            user,

            getOtherURL(locale: string): string {
                return urls.gen(locale, originalUrl);
            },

            URL(path: string | {getURL: (lang: string) => string},
                    query?: Object): string {
                let url = typeof path.getURL === "function" ?
                    path.getURL(lang) :
                    urls.gen(lang, path);

                if (query) {
                    url = url + (url.indexOf("?") >= 0 ? "&" : "?") +
                        qs.stringify(query);
                }

                return url;
            },

            fullName(item: {getFullName: (lang: string) => string} |
                    {name: string} | string): string {
                return typeof item.getFullName === "function" ?
                    item.getFullName(lang) :
                    typeof item.name === "string" ?
                        item.name :
                        typeof item === "string" ?
                            item :
                            "";
            },

            shortName(item: {getShortName: (lang: string) => string}): string {
                return item.getShortName(lang);
            },

            getTitle(item: {getTitle: () => string}): string {
                return item.getTitle({lang, gettext, format});
            },

            getShortTitle(item: {getShortTitle: () => string}): string {
                return item.getShortTitle({lang, gettext, format});
            },

            // Format a number using commas
            stringNum(num: number): string {
                // TODO(jeresig): Have a better way to handle this.
                const separator = lang === "en" ? "," : ".";
                const result = (typeof num === "number" ? num : "");
                return result.toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                    separator);
            },

            relativeDate(date: Date): string {
                return moment(date).locale(lang).fromNow();
            },

            fixedDate(date: Date): string {
                return moment(date).locale(lang).format("LLL");
            },
        };
    }

    props: {
        originalUrl: string,
        lang: string,
        gettext: (text: string) => string,
        format: (text: string, options: {}) => string,
        children?: React.Element<*>,
    }

    render() {
        return this.props.children;
    }
}

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
    fixedDate: React.PropTypes.func,
};

module.exports = Wrapper;
