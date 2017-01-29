"use strict";

// From User.js
if (typeof exports !== "undefined") Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_Context", {
    value: require("react").PropTypes.shape({
        lang: require("react").PropTypes.string.isRequired,
        URL: require("react").PropTypes.func.isRequired,
        getOtherURL: require("react").PropTypes.func.isRequired,
        fullName: require("react").PropTypes.func.isRequired,
        shortName: require("react").PropTypes.func.isRequired,
        getTitle: require("react").PropTypes.func.isRequired,
        getShortTitle: require("react").PropTypes.func.isRequired,
        stringNum: require("react").PropTypes.func.isRequired,
        fixedDate: require("react").PropTypes.func.isRequired,
        relativeDate: require("react").PropTypes.func.isRequired,
        user: require("react").PropTypes.any,
        gettext: require("react").PropTypes.func.isRequired,
        format: require("react").PropTypes.func.isRequired
    })
});

// Methods and properties defined in view-methods.js and i18n.js

if (typeof exports !== "undefined") Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_User", {
    value: require("react").PropTypes.shape({
        email: require("react").PropTypes.string.isRequired,
        sourceAdmin: require("react").PropTypes.arrayOf(require("react").PropTypes.string).isRequired,
        siteAdmin: require("react").PropTypes.bool.isRequired
    })
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92aWV3cy90eXBlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQW1CQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWpCQSIsImZpbGUiOiJ0eXBlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbi8vIE1ldGhvZHMgYW5kIHByb3BlcnRpZXMgZGVmaW5lZCBpbiB2aWV3LW1ldGhvZHMuanMgYW5kIGkxOG4uanNcbmV4cG9ydCB0eXBlIENvbnRleHQgPSB7XG4gICAgbGFuZzogc3RyaW5nLFxuICAgIFVSTDogKHBhdGg6IHN0cmluZyB8IHtnZXRVUkw6IChsYW5nOiBzdHJpbmcpID0+IHN0cmluZ30pID0+IHN0cmluZyxcbiAgICBnZXRPdGhlclVSTDogKGxhbmc6IHN0cmluZykgPT4gc3RyaW5nLFxuICAgIGZ1bGxOYW1lOiAobmFtZTogKikgPT4gc3RyaW5nLFxuICAgIHNob3J0TmFtZTogKG5hbWU6ICopID0+IHN0cmluZyxcbiAgICBnZXRUaXRsZTogKGl0ZW06IHtnZXRUaXRsZTogKCkgPT4gc3RyaW5nfSkgPT4gc3RyaW5nLFxuICAgIGdldFNob3J0VGl0bGU6IChpdGVtOiB7Z2V0U2hvcnRUaXRsZTogKCkgPT4gc3RyaW5nfSkgPT4gc3RyaW5nLFxuICAgIHN0cmluZ051bTogKG51bTogbnVtYmVyKSA9PiBzdHJpbmcsXG4gICAgZml4ZWREYXRlOiAoZGF0ZTogRGF0ZSkgPT4gc3RyaW5nLFxuICAgIHJlbGF0aXZlRGF0ZTogKGRhdGU6IERhdGUpID0+IHN0cmluZyxcbiAgICB1c2VyPzogVXNlcixcbiAgICBnZXR0ZXh0OiAodGV4dDogc3RyaW5nKSA9PiBzdHJpbmcsXG4gICAgZm9ybWF0OiAodGV4dDogc3RyaW5nLCBvcHRpb25zOiB7fSkgPT4gc3RyaW5nLFxufTtcblxuLy8gRnJvbSBVc2VyLmpzXG5leHBvcnQgdHlwZSBVc2VyID0ge1xuICAgIGVtYWlsOiBzdHJpbmcsXG4gICAgc291cmNlQWRtaW46IEFycmF5PHN0cmluZz4sXG4gICAgc2l0ZUFkbWluOiBib29sZWFuLFxufTtcbiJdfQ==