// @flow

const React = require("react");

const Error = ({title, body}: {body?: string, title: string}) => (
    <div>
        <div className="row">
            <div className="col-xs-12">
                <h1>{title}</h1>
                {body && <pre>{body}</pre>}
            </div>
        </div>
    </div>
);

module.exports = Error;
