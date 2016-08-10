"use strict";

const React = require("react");

const metadata = require("../lib/metadata");
const options = require("../lib/options");

const Page = require("./Page.jsx");

const recordType = React.PropTypes.shape({
    artists: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            _id: React.PropTypes.string,
            name: React.PropTypes.string.isRequired,
            pseudonym: React.PropTypes.string,
        })
    ),
    dates: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            _id: React.PropTypes.string,
            original: React.PropTypes.string,
            circa: React.PropTypes.bool,
            end: React.PropTypes.number,
            start: React.PropTypes.number,
        })
    ),
    dimensions: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            _id: React.PropTypes.string,
            height: React.PropTypes.number,
            width: React.PropTypes.number,
        })
    ),
    images: React.PropTypes.arrayOf(React.PropTypes.any),
    medium: React.PropTypes.string,
    objectType: React.PropTypes.string,
    title: React.PropTypes.string,
});

const Record = React.createClass({
    propTypes: {
        URL: React.PropTypes.func.isRequired,
        compare: React.PropTypes.bool.isRequired,
        format: React.PropTypes.func.isRequired,
        fullName: React.PropTypes.func.isRequired,
        getTitle: React.PropTypes.func.isRequired,
        gettext: React.PropTypes.func.isRequired,
        records: React.PropTypes.arrayOf(recordType),
        shortName: React.PropTypes.func.isRequired,
        similar: React.PropTypes.arrayOf(recordType),
        sources: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                _id: React.PropTypes.string.isRequired,
                name: React.PropTypes.string.isRequired,
            })
        ),
    },

    getTitle(record) {
        return options.recordTitle(record, this.props);
    },

    // Determine if at least one record has a value for this type
    hasValue(type) {
        return this.props.records.some((record) => {
            const value = record[type];
            return value && (!Array.isArray(value) || value.length > 0);
        });
    },

    renderRecord() {
        const compare = this.props.compare;
        const records = this.props.records;
        const recordWidth = this.props.similar.length > 0 ?
            "col-md-9" : "col-md-12";

        return <div className={`${recordWidth} imageholder`}>
            {(compare || records.length > 1) &&
                <a href={this.props.URL(records[0])}
                    className="btn btn-success"
                >
                    &laquo; {this.props.gettext("End Comparison")}
                </a>}
            <div className="responsive-table">
                <table className="table table-hover">
                    <thead>
                        <tr className="plain">
                            <th/>
                            {records.map((record) =>
                                this.renderTitle(record))}
                        </tr>
                        <tr className="plain">
                            <td/>
                            {records.map((record) =>
                                this.renderImages(record))}
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderMetadata()}
                        {this.renderDetails()}
                        {this.renderSources()}
                    </tbody>
                </table>
            </div>
        </div>;
    },

    renderTitle(record) {
        const size = Math.max(Math.round(12 / this.props.records.length), 3);
        const title = this.getTitle(record);

        return <th className={`col-xs-${size} text-center`} key={record._id}>
            <h1 className="panel-title">{title}</h1>
        </th>;
    },

    renderImages(record) {
        const carouselId = record._id.replace("/", "-");

        return <td key={record._id}>
            <div id={carouselId} className="carousel" data-interval="0">
                <div className="carousel-inner" role="listbox">
                    {record.images.map((image, i) =>
                        this.renderImage(record, image, i))}
                </div>

                {record.images.length > 1 && this.renderCarousel(record)}
            </div>
        </td>;
    },

    renderImage(record, image, i) {
        const active = i === 0 ? "active" : "";

        return <div className={`item ${active}`} key={image._id}>
            <a href={image.getOriginalURL()}>
                <img src={image.getScaledURL()}
                    alt={this.props.getTitle(record)}
                    title={this.props.getTitle(record)}
                    className="img-responsive center-block"
                />
            </a>
        </div>;
    },

    renderCarousel(record) {
        const carouselId = record._id.replace("/", "-");

        return <div>
            <ol className="carousel-indicators">
                {record.images.map((image, i) =>
                    <li data-target={`#${carouselId}`} data-slide-to={i}
                        className={i === 0 ? "active" : ""} key={`img${i}`}
                    />
                )}
            </ol>
            <a className="left carousel-control"
                href={`#${carouselId}`} role="button"
                data-slide="prev"
            >
                <span className="glyphicon glyphicon-chevron-left"
                    aria-hidden="true"
                />
                <span className="sr-only">
                    {this.props.gettext("Previous")}
                </span>
            </a>
            <a className="right carousel-control"
                href={`#${carouselId}`} role="button"
                data-slide="next"
            >
                <span className="glyphicon glyphicon-chevron-right"
                    aria-hidden="true"
                />
                <span className="sr-only">
                    {this.props.gettext("Next")}
                </span>
            </a>
        </div>;
    },

    renderMetadata() {
        const records = this.props.records;

        return options.display.map((type) => {
            const typeSchema = metadata.model[type];

            // Hide if it there isn't at least one value to display
            if (!this.hasValue(type)) {
                return null;
            }

            return <tr key={type}>
                <th className="text-right">
                    {typeSchema.options.title(this.props)}
                </th>
                {records.map((record) => <td key={record._id}>
                    {typeSchema.renderView(record[type], this.props)}
                </td>)}
            </tr>;
        });
    },

    renderDetails() {
        if (!this.hasValue("url")) {
            return null;
        }

        return <tr>
            <th className="text-right">
                {this.props.gettext("Details")}
            </th>
            {this.props.records.map((record) => {
                const link = <a href={record.url}>
                    {this.props.gettext("More information...")}
                </a>;

                return <td key={record._id}>{link}</td>;
            })}
        </tr>;
    },

    renderSources() {
        if (this.props.sources.length <= 1) {
            return null;
        }

        return <tr>
            <th className="text-right">
                {this.props.gettext("Source")}
            </th>
            {this.props.records.map((record) => {
                const source = record.getSource();

                return <td key={record._id}>
                    <a href={this.props.URL(source)}>
                        {this.props.fullName(source)}
                    </a>
                </td>;
            })}
        </tr>;
    },

    renderSimilar() {
        return <div className="col-md-3">
            <a href="?compare" className="btn btn-success btn-block"
                style={{marginBottom: 20}}
            >
                {this.props.gettext("Compare Images")} &raquo;
            </a>

            <div className="panel panel-default">
                <div className="panel-heading">
                    {this.props.gettext("Similar Images")}
                </div>
                <div className="panel-body row">
                    {this.props.similar.map((match) =>
                        this.renderSimilarMatch(match))}
                </div>
            </div>
        </div>;
    },

    renderSimilarMatch(match) {
        if (!match.record) {
            return null;
        }

        return <div className="img col-md-12 col-xs-6 col-sm-4" key={match._id}>
            <a href={this.props.URL(match.record)}>
                <img src={match.record.getThumbURL()}
                    alt={this.props.getTitle(match.record)}
                    title={this.props.getTitle(match.record)}
                    className="img-responsive center-block"
                />
            </a>
            <div className="details">
                <div className="wrap">
                    <span>{this.props.format(this.props.gettext(
                        "Score: %(score)s"), {score: match.score})}</span>

                    <a className="pull-right"
                        href={this.props.URL(match.record.getSource())}
                        title={this.props.fullName(match.record.getSource())}
                    >
                        {this.props.shortName(match.record.getSource())}
                    </a>
                </div>
            </div>
        </div>;
    },

    renderScript() {
        return <script
            dangerouslySetInnerHTML={{__html: `
                $(function() {
                    $(".carousel").carousel();
                });
            `}}
        />;
    },

    render() {
        const record = this.props.records[0];
        const title = this.getTitle(record);
        const social = {
            imgURL: record.getOriginalURL(),
            title,
            url: this.props.URL(record),
        };

        return <Page
            {...this.props}
            title={title}
            scripts={this.renderScript()}
            social={social}
        >
            <div className="row">
                {this.renderRecord()}
                {this.props.similar.length > 0 && this.renderSimilar()}
            </div>
        </Page>;
    },
});

module.exports = Record;
