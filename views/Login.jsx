// @flow

"use strict";

const React = require("react");

const Page = require("./Page.jsx");

type Props = {
    // GlobalProps
    URL: (path: string | {getURL: (lang: string) => string}) => string,
    gettext: (text: string) => string,
};

const Login = (props: Props) => {
    const {gettext, URL} = props;
    const title = gettext("Login");

    return <Page
        {...props}
        title={title}
    >
        <h1>{title}</h1>

        <form action={URL("/login")} method="post">
            <div>
                <label htmlFor="email">{gettext("Email Address:")}</label>
                {" "}
                <input type="text" name="email"/>
            </div>
            <div>
                <label htmlFor="password">{gettext("Password:")}</label>
                {" "}
                <input type="password" name="password"/>
            </div>
            <div>
                <input type="submit" value={title}/>
            </div>
        </form>
    </Page>;
};

module.exports = Login;
