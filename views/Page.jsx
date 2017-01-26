// @flow

const React = require("react");

const options = require("../lib/options");

import type {Context} from "./types.jsx";
const {childContextTypes} = require("./Wrapper.jsx");

const types = Object.keys(options.types);
const multipleTypes = types.length > 1;

type Props = {
    children?: React.Element<*>,
    noIndex?: boolean,
    scripts?: React.Element<*>,
    splash?: React.Element<*>,
    style?: React.Element<*>,
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
    style,
    noIndex,
}: Props, {URL, getTitle, lang}: Context) => {
    const siteTitle = getTitle(options);
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
        {options.faviconUrl && <link rel="icon" type="image/x-icon"
            href={URL(options.faviconUrl)}
        />}
        <title>{pageTitle || title}</title>
        {socialMeta}
        <link rel="stylesheet" href={URL("/css/bootstrap.min.css")}/>
        <link
            rel="stylesheet"
            href={URL("/css/bootstrap-theme.min.css")}
        />
        <link rel="stylesheet" href={URL("/css/select2.min.css")}/>
        <link
            rel="stylesheet"
            href={URL("/css/select2-bootstrap.min.css")}
        />
        <link rel="stylesheet" href={URL("/css/style.css")}/>
        {style}
    </head>;
};

Head.contextTypes = childContextTypes;

const Logo = (props, {getTitle, URL}: Context) => <span>
    <img alt={getTitle(options)}
        src={URL(options.logoUrl)}
        height="40" width="40"
    />
    {" "}
</span>;

const NavLink = ({type, title}: Props & {type: string},
        {URL, lang, gettext}: Context) => <li className="dropdown">
    <a
        href={URL(`/${type}/search`)}
        className="dropdown-toggle"
        data-toggle="dropdown"
        role="button"
        aria-haspopup="true"
        aria-expanded="false"
    >
        {title}
        {" "}
        <span className="caret"/>
    </a>
    <ul className="dropdown-menu">
        <li>
            <form
                action={URL(`/${type}/search`)}
                method="GET"
                className="form-search form-inline dropdown-search"
            >
                <div className="form-group">
                    <input
                        type="hidden"
                        name="lang"
                        value={lang}
                    />
                    <input type="search" id="filter" name="filter"
                        placeholder={gettext("Search")}
                        className="form-control search-query"
                    />
                </div>
                {" "}
                <input
                    type="submit"
                    value={gettext("Search")}
                    className="btn btn-primary"
                />
            </form>
        </li>
        <li>
            <a href={URL(`/${type}/search`)}>
                {gettext("Browse All")}
            </a>
        </li>
        <li>
            <a href={URL(`/${type}/create`)}>
                {gettext("Create New")}
            </a>
        </li>
    </ul>
</li>;

NavLink.contextTypes = childContextTypes;

const NavLinks = (props, {gettext}: Context) => <div>
    {Object.keys(options.types).map((type) => {
        const title = options.types[type].name({gettext});
        return <NavLink type={type} title={title} key={type} />;
    })}
</div>;

NavLinks.contextTypes = childContextTypes;

const SearchForm = (props, {gettext, URL}: Context) => <form
    action={URL(`/${types[0]}/search`)}
    method="GET"
    className={"navbar-form navbar-right search form-inline hidden-xs"}
>
    <div className="form-group">
        <input name="filter" type="text"
            className="form-control search-query"
            placeholder={gettext("Search")}
        />
    </div>
    {" "}
    <input type="submit" className="btn btn-primary"
        value={gettext("Search")}
    />
</form>;

SearchForm.contextTypes = childContextTypes;

const LocaleMenu = (props, {
    lang,
    URL,
    getOtherURL,
}: Context) => <li className="dropdown">
    <a href="" className="dropdown-toggle"
        data-toggle="dropdown" role="button"
        aria-expanded="false"
    >
        <img alt={options.locales[lang]}
            src={URL(`/images/${lang}.png`)}
            width="16" height="11"
        />
        {" "}
        {options.locales[lang]}
        <span className="caret"/>
    </a>
    <ul className="dropdown-menu" role="menu">
        {Object.keys(options.locales)
            .filter((locale) => locale !== lang)
            .map((locale) => <li key={locale}>
                <a href={getOtherURL(locale)}>
                    <img src={URL(`/images/${locale}.png`)}
                        alt={options.locales[locale]}
                        width="16" height="11"
                    />
                    {" "}
                    {options.locales[locale]}
                </a>
            </li>)
        }
    </ul>
</li>;

LocaleMenu.contextTypes = childContextTypes;

const Header = (props, {
    gettext,
    URL,
    getShortTitle,
    currentUser,
}: Context) => <div
    className="navbar navbar-default navbar-static-top"
>
    <div className="container">
        <div className="navbar-header">
            <button type="button" className="navbar-toggle"
                data-toggle="collapse"
                data-target="#header-navbar"
            >
                <span className="sr-only">Toggle Navigation</span>
                <span className="icon-bar"/>
                <span className="icon-bar"/>
                <span className="icon-bar"/>
            </button>
            <a className="navbar-brand" href={URL("/")}>
                {options.logoUrl && <Logo />}
                {getShortTitle(options)}
            </a>
        </div>

        <div id="header-navbar" className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
                {!multipleTypes && <li>
                    <a href={URL(`/${types[0]}/search`)}>
                        {gettext("Browse All")}
                    </a>
                </li>}
                {<NavLinks />}
                {currentUser() && <li>
                    <a href={URL("/logout")}>
                        {gettext("Logout")}
                    </a>
                </li>}
                {Object.keys(options.locales).length > 1 &&
                    <LocaleMenu />}
            </ul>

            {multipleTypes && <SearchForm />}
        </div>
    </div>
</div>;

Header.contextTypes = childContextTypes;

const Scripts = ({scripts}: Props, {URL}: Context) => <div>
    <script src={URL("/js/jquery.min.js")} />
    <script src={URL("/js/bootstrap.min.js")} />
    <script src={URL("/js/select2.min.js")} />
    <script src={URL("/js/app.js")} />
    {scripts}
</div>;

Scripts.contextTypes = childContextTypes;

const Page = ({
    splash,
    children,
    scripts,
    title,
    social,
    style,
    noIndex,
}: Props, {lang}: Context) => <html lang={lang}>
    <Head title={title} social={social} style={style} noIndex={noIndex} />
    <body>
        <Header/>
        {splash}
        <div className="container">
            {children}
        </div>
        <Scripts scripts={scripts} />
    </body>
</html>;

Page.contextTypes = childContextTypes;

module.exports = Page;
