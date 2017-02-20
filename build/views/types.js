"use strict";

// Methods and properties defined in view-methods.js and i18n.js
if (typeof exports !== "undefined") Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_Options", {
    value: require("react").PropTypes.shape({
        getShortTitle: require("react").PropTypes.string.isRequired,
        getTitle: require("react").PropTypes.string.isRequired,
        noIndex: require("react").PropTypes.bool.isRequired,
        usei18nSubdomain: require("react").PropTypes.bool.isRequired,
        faviconUrl: require("react").PropTypes.string,
        logoUrl: require("react").PropTypes.string,
        maxUploadSize: require("react").PropTypes.number.isRequired,
        imageThumbSize: require("react").PropTypes.string.isRequired,
        imageScaledSize: require("react").PropTypes.string.isRequired,
        locales: require("react").PropTypes.shape({}).isRequired,
        types: require("react").PropTypes.shape({}).isRequired
    })
});


// From User.js
if (typeof exports !== "undefined") Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_Context", {
    value: require("react").PropTypes.shape({
        lang: require("react").PropTypes.string.isRequired,
        user: require("react").PropTypes.any,
        originalUrl: require("react").PropTypes.string.isRequired,
        gettext: require("react").PropTypes.func.isRequired,
        options: require("react").PropTypes.shape({
            getShortTitle: require("react").PropTypes.string.isRequired,
            getTitle: require("react").PropTypes.string.isRequired,
            noIndex: require("react").PropTypes.bool.isRequired,
            usei18nSubdomain: require("react").PropTypes.bool.isRequired,
            faviconUrl: require("react").PropTypes.string,
            logoUrl: require("react").PropTypes.string,
            maxUploadSize: require("react").PropTypes.number.isRequired,
            imageThumbSize: require("react").PropTypes.string.isRequired,
            imageScaledSize: require("react").PropTypes.string.isRequired,
            locales: require("react").PropTypes.shape({}).isRequired,
            types: require("react").PropTypes.shape({}).isRequired
        }).isRequired
    })
});
if (typeof exports !== "undefined") Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_User", {
    value: require("react").PropTypes.shape({
        email: require("react").PropTypes.string.isRequired,
        sourceAdmin: require("react").PropTypes.arrayOf(require("react").PropTypes.string).isRequired,
        siteAdmin: require("react").PropTypes.bool.isRequired,
        getEditableSourcesByType: require("react").PropTypes.shape({}).isRequired
    })
});