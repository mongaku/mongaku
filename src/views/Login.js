// @flow

const React = require("react");

const Page = require("./Page.js");
const {URL} = require("./utils.js");

import type {Context} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

const Login = (props: {}, {lang, gettext}: Context) => {
    const title = gettext("Login");

    return <Page title={title}>
        <h1>{title}</h1>

        <form action={URL(lang, "/login")} method="post">
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

Login.contextTypes = childContextTypes;

module.exports = Login;
