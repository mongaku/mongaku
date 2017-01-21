"use strict";

const React = require("react");

const Page = require("./Page.jsx");

const Error = (props) => <Page{...props}>
    <div className="row">
        <div className="col-xs-12">
            <h1>{props.title}</h1>
            {props.body && <pre>{props.body}</pre>}
        </div>
    </div>
</Page>;

Error.propTypes = {
    body: React.PropTypes.string,
    title: React.PropTypes.string.isRequired,
};

module.exports = Error;
