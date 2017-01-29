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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92aWV3cy9XcmFwcGVyLmpzIl0sIm5hbWVzIjpbInFzIiwicmVxdWlyZSIsIm1vbWVudCIsIlJlYWN0IiwidXJscyIsIldyYXBwZXIiLCJwcm9wcyIsIm9yaWdpbmFsVXJsIiwibGFuZyIsImdldHRleHQiLCJmb3JtYXQiLCJnZXRPdGhlclVSTCIsImxvY2FsZSIsImdlbiIsIlVSTCIsInBhdGgiLCJxdWVyeSIsInVybCIsImdldFVSTCIsImluZGV4T2YiLCJzdHJpbmdpZnkiLCJmdWxsTmFtZSIsIml0ZW0iLCJnZXRGdWxsTmFtZSIsIm5hbWUiLCJzaG9ydE5hbWUiLCJnZXRTaG9ydE5hbWUiLCJnZXRUaXRsZSIsImdldFNob3J0VGl0bGUiLCJzdHJpbmdOdW0iLCJudW0iLCJzZXBhcmF0b3IiLCJyZXN1bHQiLCJ0b1N0cmluZyIsInJlcGxhY2UiLCJyZWxhdGl2ZURhdGUiLCJkYXRlIiwiZnJvbU5vdyIsImZpeGVkRGF0ZSIsImNoaWxkcmVuIiwiQ29tcG9uZW50IiwiY2hpbGRDb250ZXh0VHlwZXMiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJmdW5jIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUVBLElBQU1BLEtBQUtDLFFBQVEsYUFBUixDQUFYOztBQUVBLElBQU1DLFNBQVNELFFBQVEsUUFBUixDQUFmO0FBQ0EsSUFBTUUsUUFBUUYsUUFBUSxPQUFSLENBQWQ7O0FBRUEsSUFBTUcsT0FBT0gsUUFBUSxhQUFSLENBQWI7O0lBRU1JLE87Ozs7Ozs7Ozs7OzBDQUNnQjtBQUFBLHlCQUMrQixLQUFLQyxLQURwQztBQUFBLGdCQUNQQyxXQURPLFVBQ1BBLFdBRE87QUFBQSxnQkFDTUMsSUFETixVQUNNQSxJQUROO0FBQUEsZ0JBQ1lDLE9BRFosVUFDWUEsT0FEWjtBQUFBLGdCQUNxQkMsTUFEckIsVUFDcUJBLE1BRHJCOzs7QUFHZCxtQkFBTztBQUNIRiwwQkFERztBQUVIQyxnQ0FGRztBQUdIQyw4QkFI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QmpDLGlCQUFhUixNQUFNdUMsU0FBTixDQUFnQkUsSUFKTDtBQUt4QjlCLFNBQUtYLE1BQU11QyxTQUFOLENBQWdCRSxJQUxHO0FBTXhCdkIsY0FBVWxCLE1BQU11QyxTQUFOLENBQWdCRSxJQU5GO0FBT3hCbkIsZUFBV3RCLE1BQU11QyxTQUFOLENBQWdCRSxJQVBIO0FBUXhCakIsY0FBVXhCLE1BQU11QyxTQUFOLENBQWdCRSxJQVJGO0FBU3hCaEIsbUJBQWV6QixNQUFNdUMsU0FBTixDQUFnQkUsSUFUUDtBQVV4QmYsZUFBVzFCLE1BQU11QyxTQUFOLENBQWdCRSxJQVZIO0FBV3hCVCxrQkFBY2hDLE1BQU11QyxTQUFOLENBQWdCRSxJQVhOO0FBWXhCTixlQUFXbkMsTUFBTXVDLFNBQU4sQ0FBZ0JFO0FBWkgsQ0FBNUI7O0FBZUFDLE9BQU9DLE9BQVAsR0FBaUJ6QyxPQUFqQiIsImZpbGUiOiJXcmFwcGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuY29uc3QgcXMgPSByZXF1aXJlKFwicXVlcnlzdHJpbmdcIik7XG5cbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoXCJtb21lbnRcIik7XG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxuY29uc3QgdXJscyA9IHJlcXVpcmUoXCIuLi9saWIvdXJsc1wiKTtcblxuY2xhc3MgV3JhcHBlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgZ2V0Q2hpbGRDb250ZXh0KCkge1xuICAgICAgICBjb25zdCB7b3JpZ2luYWxVcmwsIGxhbmcsIGdldHRleHQsIGZvcm1hdH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsYW5nLFxuICAgICAgICAgICAgZ2V0dGV4dCxcbiAgICAgICAgICAgIGZvcm1hdCxcblxuICAgICAgICAgICAgZ2V0T3RoZXJVUkwobG9jYWxlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICAgICAgICAgIHJldHVybiB1cmxzLmdlbihsb2NhbGUsIG9yaWdpbmFsVXJsKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIFVSTChwYXRoOiBzdHJpbmcgfCB7Z2V0VVJMOiAobGFuZzogc3RyaW5nKSA9PiBzdHJpbmd9LFxuICAgICAgICAgICAgICAgICAgICBxdWVyeT86IE9iamVjdCk6IHN0cmluZyB7XG4gICAgICAgICAgICAgICAgbGV0IHVybCA9IHR5cGVvZiBwYXRoLmdldFVSTCA9PT0gXCJmdW5jdGlvblwiID9cbiAgICAgICAgICAgICAgICAgICAgcGF0aC5nZXRVUkwobGFuZykgOlxuICAgICAgICAgICAgICAgICAgICB1cmxzLmdlbihsYW5nLCBwYXRoKTtcblxuICAgICAgICAgICAgICAgIGlmIChxdWVyeSkge1xuICAgICAgICAgICAgICAgICAgICB1cmwgPSB1cmwgKyAodXJsLmluZGV4T2YoXCI/XCIpID49IDAgPyBcIiZcIiA6IFwiP1wiKSArXG4gICAgICAgICAgICAgICAgICAgICAgICBxcy5zdHJpbmdpZnkocXVlcnkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB1cmw7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBmdWxsTmFtZShpdGVtOiB7Z2V0RnVsbE5hbWU6IChsYW5nOiBzdHJpbmcpID0+IHN0cmluZ30gfFxuICAgICAgICAgICAgICAgICAgICB7bmFtZTogc3RyaW5nfSB8IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBpdGVtLmdldEZ1bGxOYW1lID09PSBcImZ1bmN0aW9uXCIgP1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmdldEZ1bGxOYW1lKGxhbmcpIDpcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGl0ZW0ubmFtZSA9PT0gXCJzdHJpbmdcIiA/XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLm5hbWUgOlxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGl0ZW0gPT09IFwic3RyaW5nXCIgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0gOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXCI7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBzaG9ydE5hbWUoaXRlbToge2dldFNob3J0TmFtZTogKGxhbmc6IHN0cmluZykgPT4gc3RyaW5nfSk6IHN0cmluZyB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uZ2V0U2hvcnROYW1lKGxhbmcpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0VGl0bGUoaXRlbToge2dldFRpdGxlOiAoKSA9PiBzdHJpbmd9KTogc3RyaW5nIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5nZXRUaXRsZSh7bGFuZywgZ2V0dGV4dCwgZm9ybWF0fSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXRTaG9ydFRpdGxlKGl0ZW06IHtnZXRTaG9ydFRpdGxlOiAoKSA9PiBzdHJpbmd9KTogc3RyaW5nIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5nZXRTaG9ydFRpdGxlKHtsYW5nLCBnZXR0ZXh0LCBmb3JtYXR9KTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIEZvcm1hdCBhIG51bWJlciB1c2luZyBjb21tYXNcbiAgICAgICAgICAgIHN0cmluZ051bShudW06IG51bWJlcik6IHN0cmluZyB7XG4gICAgICAgICAgICAgICAgLy8gVE9ETyhqZXJlc2lnKTogSGF2ZSBhIGJldHRlciB3YXkgdG8gaGFuZGxlIHRoaXMuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VwYXJhdG9yID0gbGFuZyA9PT0gXCJlblwiID8gXCIsXCIgOiBcIi5cIjtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSAodHlwZW9mIG51bSA9PT0gXCJudW1iZXJcIiA/IG51bSA6IFwiXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQudG9TdHJpbmcoKS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLFxuICAgICAgICAgICAgICAgICAgICBzZXBhcmF0b3IpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgcmVsYXRpdmVEYXRlKGRhdGU6IERhdGUpOiBzdHJpbmcge1xuICAgICAgICAgICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSkubG9jYWxlKGxhbmcpLmZyb21Ob3coKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGZpeGVkRGF0ZShkYXRlOiBEYXRlKTogc3RyaW5nIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUpLmxvY2FsZShsYW5nKS5mb3JtYXQoXCJMTExcIik7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByb3BzOiB7XG4gICAgICAgIG9yaWdpbmFsVXJsOiBzdHJpbmcsXG4gICAgICAgIGxhbmc6IHN0cmluZyxcbiAgICAgICAgZ2V0dGV4dDogKHRleHQ6IHN0cmluZykgPT4gc3RyaW5nLFxuICAgICAgICBmb3JtYXQ6ICh0ZXh0OiBzdHJpbmcsIG9wdGlvbnM6IHt9KSA9PiBzdHJpbmcsXG4gICAgICAgIGNoaWxkcmVuPzogUmVhY3QuRWxlbWVudDwqPixcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuO1xuICAgIH1cbn1cblxuV3JhcHBlci5jaGlsZENvbnRleHRUeXBlcyA9IHtcbiAgICBsYW5nOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGdldHRleHQ6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIGZvcm1hdDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgZ2V0T3RoZXJVUkw6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIFVSTDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgZnVsbE5hbWU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIHNob3J0TmFtZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgZ2V0VGl0bGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIGdldFNob3J0VGl0bGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIHN0cmluZ051bTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgcmVsYXRpdmVEYXRlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICBmaXhlZERhdGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBXcmFwcGVyO1xuIl19