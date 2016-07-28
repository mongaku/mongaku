"use strict";

const React = require("react");

const Page = require("./Page.jsx");

const Login = React.createClass({
    propTypes: {
        URL: React.PropTypes.func.isRequired,
        gettext: React.PropTypes.func.isRequired,
    },

    render() {
        const gettext = this.props.gettext;
        const title = gettext("Login");

        return <Page
            {...this.props}
            title={title}
        >
            <h1>{title}</h1>

            <form action={this.props.URL("/login")} method="post">
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
                    <input type="submit" value={gettext("Login")}/>
                </div>
            </form>
        </Page>;
    },
});

module.exports = Login;
