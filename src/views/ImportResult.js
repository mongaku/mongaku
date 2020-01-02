// @flow

const React = require("react");

import type {Context} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

type Import = {
    _id: string,
    error?: string,
    getFilteredResults: ImportResults,
    getFilteredResultsSummary: ImportResultsSummary,
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

type ImportResultsSummary = {
    models: number,
    unprocessed: number,
    created: number,
    changed: number,
    deleted: number,
    errors: number,
    warnings: number,
};

type Expanded =
    | "models"
    | "unprocessed"
    | "created"
    | "changed"
    | "deleted"
    | "errors"
    | "warnings";

type Props = {
    batch: Import,
    expanded?: Expanded,
    id: Expanded,
    numShow?: number,
    renderResult: (result: any, i: number) => React.Element<*>,
    title: string,
};

const ImportResult = (
    props: Props,
    {gettext, stringNum, URL, format}: Context,
) => {
    const {batch, expanded, id, renderResult, title} = props;
    const numShow = 8;
    const allResults = batch.getFilteredResults[id];
    const totalResults = batch.getFilteredResultsSummary[id];
    const showAll = format(gettext("Show all %(count)s results..."), {
        count: stringNum(totalResults),
    });
    const expandURL = URL(batch.getURL, {expanded: id});
    const isExpanded = expanded === id || totalResults <= numShow;
    const results = isExpanded ? allResults : allResults.slice(0, numShow);

    if (results.length === 0) {
        return null;
    }

    return (
        <div className="panel panel-default">
            <div className="panel-heading">
                <h3 id={id} className="panel-title">
                    {title} ({stringNum(totalResults)})
                </h3>
            </div>
            <div className="panel-body">
                <div className="row">
                    <ul className="col-xs-12">{results.map(renderResult)}</ul>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        {!isExpanded && (
                            <a href={`${expandURL}#${id}`}>{showAll}</a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

ImportResult.contextTypes = childContextTypes;

module.exports = ImportResult;
