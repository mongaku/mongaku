// @flow

const React = require("react");

const Page = require("./Page.jsx");

import type {Context} from "./types.jsx";
const {childContextTypes} = require("./Wrapper.jsx");

const Login = (props: {}, {gettext, URL}: Context) => {
    const title = gettext("Login");

    return <Page title={title}>
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

Login.contextTypes = childContextTypes;

module.exports = Login;
