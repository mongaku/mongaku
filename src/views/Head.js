// @flow

const React = require("react");

import type {Context} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

type Props = {
    noIndex?: boolean,
    title?: string,
    social?: {
        url: string,
        title: string,
        imgURL: string,
    },
};

const Head = ({
    title,
    social,
    noIndex,
}: Props, {lang, options, STATIC}: Context) => {
    const siteTitle = options.getTitle;
    let pageTitle = siteTitle;

    if (title) {
        pageTitle = `${title}: ${pageTitle}`;
    }

    // An option to disable indexing of this page
    const disableIndex = options.noIndex || noIndex;

    const socialMeta = social && [
        <meta key="1" name="twitter:card" content="photo"/>,
        <meta key="2" name="twitter:url" content={social.url}/>,
        <meta key="3" name="twitter:title" content={social.title}/>,
        <meta key="4" name="twitter:image" content={social.imgURL}/>,
        <meta key="5" property="og:title" content={social.title}/>,
        <meta key="6" property="og:type" content="article"/>,
        <meta key="7" property="og:url" content={social.url}/>,
        <meta key="8" property="og:image" content={social.imgURL}/>,
        <meta key="9" property="og:site_name" content={siteTitle}/>,
    ];

    return <head>
        <meta httpEquiv="content-type" content="text/html; charset=utf-8"/>
        <meta httpEquiv="content-language" content={lang}/>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="viewport"
            content="width=device-width, initial-scale=1.0"
        />
        {disableIndex && <meta name="robots" content="noindex"/>}
        {options.favicon && <link rel="icon" type="image/x-icon"
            href={STATIC(options.favicon)}
        />}
        <title>{pageTitle || title}</title>
        {socialMeta}
        <link rel="stylesheet" href={STATIC("/css/bootstrap.min.css")}/>
        <link
            rel="stylesheet"
            href={STATIC("/css/bootstrap-theme.min.css")}
        />
        <link rel="stylesheet" href={STATIC("/css/style.css")}/>
    </head>;
};

Head.contextTypes = childContextTypes;

module.exports = Head;
