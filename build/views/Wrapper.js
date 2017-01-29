"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var qs = require("querystring");

var moment = require("moment");
var React = require("react");

var urls = require("../lib/urls");

var Wrapper = function (_React$Component) {
    _inherits(Wrapper, _React$Component);

    function Wrapper() {
        _classCallCheck(this, Wrapper);

        return _possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).apply(this, arguments));
    }

    _createClass(Wrapper, [{
        key: "getChildContext",
        value: function getChildContext() {
            var _props = this.props,
                originalUrl = _props.originalUrl,
                lang = _props.lang,
                gettext = _props.gettext,
                format = _props.format;


            return {
                lang: lang,
                gettext: gettext,
                format: format,

                getOtherURL: function getOtherURL(locale) {
                    return urls.gen(locale, originalUrl);
                },
                URL: function URL(path, query) {
                    var url = typeof path.getURL === "function" ? path.getURL(lang) : urls.gen(lang, path);

                    if (query) {
                        url = url + (url.indexOf("?") >= 0 ? "&" : "?") + qs.stringify(query);
                    }

                    return url;
                },
                fullName: function fullName(item) {
                    return typeof item.getFullName === "function" ? item.getFullName(lang) : typeof item.name === "string" ? item.name : typeof item === "string" ? item : "";
                },
                shortName: function shortName(item) {
                    return item.getShortName(lang);
                },
                getTitle: function (_getTitle) {
                    function getTitle(_x) {
                        return _getTitle.apply(this, arguments);
                    }

                    getTitle.toString = function () {
                        return _getTitle.toString();
                    };

                    return getTitle;
                }(function (item) {
                    return item.getTitle({ lang: lang, gettext: gettext, format: format });
                }),
                getShortTitle: function (_getShortTitle) {
                    function getShortTitle(_x2) {
                        return _getShortTitle.apply(this, arguments);
                    }

                    getShortTitle.toString = function () {
                        return _getShortTitle.toString();
                    };

                    return getShortTitle;
                }(function (item) {
                    return item.getShortTitle({ lang: lang, gettext: gettext, format: format });
                }),


                // Format a number using commas
                stringNum: function stringNum(num) {
                    // TODO(jeresig): Have a better way to handle this.
                    var separator = lang === "en" ? "," : ".";
                    var result = typeof num === "number" ? num : "";
                    return result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
                },
                relativeDate: function relativeDate(date) {
                    return moment(date).locale(lang).fromNow();
                },
                fixedDate: function fixedDate(date) {
                    return moment(date).locale(lang).format("LLL");
                }
            };
        }
    }, {
        key: "render",
        value: function render() {
            return this.props.children;
        }
    }]);

    return Wrapper;
}(React.Component);

Wrapper.propTypes = {
    originalUrl: require("react").PropTypes.string.isRequired,
    lang: require("react").PropTypes.string.isRequired,
    gettext: require("react").PropTypes.func.isRequired,
    format: require("react").PropTypes.func.isRequired,
    children: require("react").PropTypes.any
};


Wrapper.childContextTypes = {
    lang: React.PropTypes.string,
    gettext: React.PropTypes.func,
    format: React.PropTypes.func,
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