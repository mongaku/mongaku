// @flow

const React = require("react");

const Page = require("./Page.jsx");

const Error = (props: {
    body?: string,
    title: string,
}) => <Page{...props}>
    <div className="row">
        <div className="col-xs-12">
            <h1>{props.title}</h1>
            {props.body && <pre>{props.body}</pre>}
        </div>
    </div>
</Page>;

module.exports = Error;
