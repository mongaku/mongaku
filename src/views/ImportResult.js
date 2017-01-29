// @flow

const React = require("react");

import type {Context} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

type Import = {
    _id: string,
    error?: string,
    getFilteredResults: () => ImportResults,
    getURL: (lang: string) => string,
    modified: Date,
    state: string,
};

type ImportResults = {
    models: Array<any>,
    unprocessed: Array<any>,
    created: Array<any>,
    changed: Array<any>,
    deleted: Array<any>,
    errors: Array<any>,
    warnings: Array<any>,
};

type Props = {
    batch: Import,
    expanded?: string,
    id: "models" | "unprocessed" | "created" | "changed" | "deleted" |
        "errors" | "warnings",
    numShow?: number,
    renderResult: (result: any, i: number) => React.Element<*>,
    title: string,
};

const ImportResult = (props: Props, {
    URL,
    format,
    gettext,
    stringNum,
}: Context) => {
    const {
        batch,
        expanded,
        id,
        numShow = 5,
        renderResult,
        title,
    } = props;
    const allResults = batch.getFilteredResults()[id];
    const showAll = format(gettext(
        "Show all %(count)s results..."),
        {count: stringNum(allResults.length)});
    const expandURL = URL(batch, {expanded: id});
    const isExpanded = (expanded === id || allResults.length <= numShow);
    const results = expanded ? allResults : allResults.slice(0, numShow);

    if (results.length === 0) {
        return null;
    }

    return <div className="panel panel-default">
        <div className="panel-heading">
            <h3 id={id} className="panel-title">
                {title}
                {" "}
                ({stringNum(allResults.length)})
            </h3>
        </div>
        <div className="panel-body">
            <div className="row">
                <ul className="col-xs-12">
                    {results.map(renderResult)}
                </ul>
            </div>
            <div className="row">
                <div className="col-xs-12">
                    {!isExpanded &&
                        <a href={`${expandURL}#${id}`}>{showAll}</a>}
                </div>
            </div>
        </div>
    </div>;
};

ImportResult.contextTypes = childContextTypes;

module.exports = ImportResult;
