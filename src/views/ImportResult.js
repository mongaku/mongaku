// @flow

const React = require("react");

const {format, URL, stringNum} = require("./utils.js");

import type {Context} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

type Import = {
    _id: string,
    error?: string,
    getFilteredResults: ImportResults,
    getURL: string,
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

type Expanded = "models" | "unprocessed" | "created" | "changed" | "deleted" |
        "errors" | "warnings";

type Props = {
    batch: Import,
    expanded?: Expanded,
    id: Expanded,
    numShow?: number,
    renderResult: (result: any, i: number) => React.Element<*>,
    title: string,
};

const ImportResult = (props: Props, {gettext, lang}: Context) => {
    const {
        batch,
        expanded,
        id,
        numShow = 5,
        renderResult,
        title,
    } = props;
    const allResults = batch.getFilteredResults[id];
    const showAll = format(gettext(
        "Show all %(count)s results..."),
        {count: stringNum(lang, allResults.length)});
    const expandURL = URL(lang, batch.getURL, {expanded: id});
    const isExpanded = (expanded === id || allResults.length <= numShow);
    const results = isExpanded ? allResults : allResults.slice(0, numShow);

    if (results.length === 0) {
        return null;
    }

    return <div className="panel panel-default">
        <div className="panel-heading">
            <h3 id={id} className="panel-title">
                {title}
                {" "}
                ({stringNum(lang, allResults.length)})
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
