"use strict";

const React = require("react");

const ImportResult = React.createClass({
    propTypes: {
        URL: React.PropTypes.func.isRequired,
        batch: React.PropTypes.any.isRequired,
        expanded: React.PropTypes.string,
        format: React.PropTypes.func.isRequired,
        gettext: React.PropTypes.func.isRequired,
        id: React.PropTypes.string.isRequired,
        numShow: React.PropTypes.number,
        renderResult: React.PropTypes.func.isRequired,
        stringNum: React.PropTypes.func.isRequired,
        title: React.PropTypes.string.isRequired,
    },

    render() {
        const id = this.props.id;
        const allResults = this.props.batch.getFilteredResults()[id];
        const showAll = this.props.format(this.props.gettext(
            "Show all %(count)s results..."),
            {count: this.props.stringNum(allResults.length)});
        const expandURL = this.props.URL(this.props.batch, {expanded: id});
        const numShow = this.props.numShow || 5;
        const expanded = (this.props.expanded === id ||
            allResults.length <= numShow);
        const results = expanded ? allResults : allResults.slice(0, numShow);

        if (results.length === 0) {
            return null;
        }

        return <div className="panel panel-default">
            <div className="panel-heading">
                <h3 id={id} className="panel-title">
                    {this.props.title}
                    {" "}
                    ({this.props.stringNum(allResults.length)})
                </h3>
            </div>
            <div className="panel-body">
                <div className="row">
                    <ul className="col-xs-12">
                        {results.map((result, i) =>
                            this.props.renderResult(result, i))}
                    </ul>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        {!expanded &&
                            <a href={`${expandURL}#${id}`}>{showAll}</a>}
                    </div>
                </div>
            </div>
        </div>;
    },
});

module.exports = ImportResult;
