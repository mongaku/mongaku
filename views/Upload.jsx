// @flow

const React = require("react");

const Page = require("./Page.jsx");

const Upload = React.createClass({
    propTypes: {
        URL: React.PropTypes.func.isRequired,
        format: React.PropTypes.func.isRequired,
        fullName: React.PropTypes.func.isRequired,
        getTitle: React.PropTypes.func.isRequired,
        gettext: React.PropTypes.func.isRequired,
        image: React.PropTypes.shape({
            getOriginalURL: React.PropTypes.func.isRequired,
            getScaledURL: React.PropTypes.func.isRequired,
        }).isRequired,
        shortName: React.PropTypes.func.isRequired,
        similar: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                record: React.PropTypes.shape({
                    _id: React.PropTypes.string.isRequired,
                    source: React.PropTypes.string.isRequired,
                }).isRequired,
                score: React.PropTypes.number.isRequired,
            })
        ).isRequired,
    },

    renderUpload() {
        const title = this.props.gettext("Uploaded Image");

        return <div className="panel panel-default">
            <div className="panel-heading">
                <strong>{this.props.gettext("Uploaded Image")}</strong>
            </div>
            <div className="panel-body">
                <a href={this.props.image.getOriginalURL()}>
                    <img src={this.props.image.getScaledURL()}
                        alt={title}
                        title={title}
                        className="img-responsive center-block"
                    />
                </a>
            </div>
        </div>;
    },

    renderResults() {
        return <div className="panel panel-default">
            <div className="panel-heading">
                <strong>{this.props.gettext("Similar Images")}</strong>
            </div>
            <div className="panel-body row">
                {this.renderSimilar(this.props.similar)}
            </div>
        </div>;
    },

    renderSimilar(similar) {
        if (similar.length === 0) {
            return <div className="col-xs-12">
                <p>{this.props.gettext("No similar images were found.")}</p>
            </div>;
        }

        return similar.map((match) => this.renderMatch(match));
    },

    renderMatch(match) {
        const record = match.recordModel;
        const source = record.getSource();

        return <div className="img col-md-6 col-sm-4 col-xs-6"
            key={record._id}
        >
            <div className="img-wrap">
                <a href={this.props.URL(record)}>
                    <img src={record.getThumbURL()}
                        alt={this.props.getTitle(record)}
                        title={this.props.getTitle(record)}
                        className="img-responsive center-block"
                    />
                </a>
            </div>
            <div className="details">
                <div className="wrap">
                    <span>{this.props.format(
                        this.props.gettext("Score: %(score)s"),
                            {score: match.score})}</span>

                    <a className="pull-right"
                        href={this.props.URL(source)}
                        title={this.props.fullName(source)}
                    >
                        {this.props.shortName(source)}
                    </a>
                </div>
            </div>
        </div>;
    },

    render() {
        return <Page
            {...this.props}
        >
            <div className="row">
                <div className="col-md-6">
                    {this.renderUpload()}
                </div>
                <div className="col-md-6">
                    {this.renderResults()}
                </div>
            </div>
        </Page>;
    },
});

module.exports = Upload;
