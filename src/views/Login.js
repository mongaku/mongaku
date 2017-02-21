// @flow

const React = require("react");

import type {Context} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

const Login = ({title}: {title: string}, {gettext, URL}: Context) => {
    return <div>
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
    </div>;
};

Login.contextTypes = childContextTypes;

module.exports = Login;
