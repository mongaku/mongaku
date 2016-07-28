"use strict";

const React = require("react");

const Page = require("./Page.jsx");

const Error = React.createClass({
    propTypes: {
        body: React.PropTypes.string,
        title: React.PropTypes.string.isRequired,
    },

    render() {
        return <Page
            {...this.props}
        >
            <div className="row">
                <div className="col-xs-12">
                    <h1>{this.props.title}</h1>
                    {this.props.body && <pre>{this.props.body}</pre>}
                </div>
            </div>
        </Page>;
    },
});

module.exports = Error;
