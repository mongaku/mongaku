// @flow

const React = require("react");

import type {Context} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

type Props = {
    title: string,
    error?: string,
};

class Login extends React.Component<Props> {
    static contextTypes = childContextTypes;
    context: Context;

    componentDidMount() {
        const {URL} = this.context;
        history.replaceState({}, "", URL("/login"));
    }

    render() {
        const {title, error} = this.props;
        const {gettext, URL} = this.context;

        return (
            <div style={{maxWidth: 400}}>
                <h1>{title}</h1>

                {error && (
                    <p className="alert alert-danger" role="alert">
                        {error}
                    </p>
                )}

                <form action={URL("/login")} method="post">
                    <div className="form-group">
                        <label htmlFor="email">{gettext("Username:")}</label>{" "}
                        <input
                            type="text"
                            name="email"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">{gettext("Password:")}</label>{" "}
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="submit"
                            value={title}
                            className="form-control btn-primary"
                        />
                    </div>
                </form>
            </div>
        );
    }
}

module.exports = Login;
