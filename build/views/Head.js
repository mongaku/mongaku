"use strict";

const React = require("react");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

const { childContextTypes } = require("./Wrapper.js");

const Head = ({
    title,
    social,
    noIndex
}, { lang, options, URL }) => {
    const siteTitle = options.getTitle;
    let pageTitle = siteTitle;

    if (title) {
        pageTitle = `${title}: ${pageTitle}`;
    }

    // An option to disable indexing of this page
    const disableIndex = options.noIndex || noIndex;

    const socialMeta = social && [React.createElement("meta", { key: "1", name: "twitter:card", content: "photo" }), React.createElement("meta", { key: "2", name: "twitter:url", content: social.url }), React.createElement("meta", { key: "3", name: "twitter:title", content: social.title }), React.createElement("meta", { key: "4", name: "twitter:image", content: social.imgURL }), React.createElement("meta", { key: "5", property: "og:title", content: social.title }), React.createElement("meta", { key: "6", property: "og:type", content: "article" }), React.createElement("meta", { key: "7", property: "og:url", content: social.url }), React.createElement("meta", { key: "8", property: "og:image", content: social.imgURL }), React.createElement("meta", { key: "9", property: "og:site_name", content: siteTitle })];

    return React.createElement(
        "head",
        null,
        React.createElement("meta", { httpEquiv: "content-type", content: "text/html; charset=utf-8" }),
        React.createElement("meta", { httpEquiv: "content-language", content: lang }),
        React.createElement("meta", { httpEquiv: "X-UA-Compatible", content: "IE=edge" }),
        React.createElement("meta", { name: "viewport",
            content: "width=device-width, initial-scale=1.0"
        }),
        disableIndex && React.createElement("meta", { name: "robots", content: "noindex" }),
        options.faviconUrl && React.createElement("link", { rel: "icon", type: "image/x-icon",
            href: URL(options.faviconUrl)
        }),
        React.createElement(
            "title",
            null,
            pageTitle || title
        ),
        socialMeta,
        React.createElement("link", { rel: "stylesheet", href: URL("/css/bootstrap.min.css") }),
        React.createElement("link", {
            rel: "stylesheet",
            href: URL("/css/bootstrap-theme.min.css")
        }),
        React.createElement("link", { rel: "stylesheet", href: URL("/css/select2.min.css") }),
        React.createElement("link", {
            rel: "stylesheet",
            href: URL("/css/select2-bootstrap.min.css")
        }),
        React.createElement("link", { rel: "stylesheet", href: URL("/css/style.css") }),
        React.createElement("script", { src: URL("/js/jquery.min.js") }),
        React.createElement("script", { src: URL("/js/bootstrap.min.js") }),
        React.createElement("script", { src: URL("/js/select2.min.js") }),
        React.createElement("script", { src: URL("/js/app.js") })
    );
};

Head.propTypes = {
    noIndex: require("react").PropTypes.bool,
    title: require("react").PropTypes.string,
    social: require("react").PropTypes.shape({
        url: require("react").PropTypes.string.isRequired,
        title: require("react").PropTypes.string.isRequired,
        imgURL: require("react").PropTypes.string.isRequired
    })
};
Head.contextTypes = childContextTypes;

module.exports = Head;