"use strict";

const React = require("react");

const metadata = require("../lib/metadata");
const options = require("../lib/options");

const Page = require("./Page.jsx");

const EditRecord = React.createClass({
    propTypes: {
        gettext: React.PropTypes.func.isRequired,

        lang: React.PropTypes.string.isRequired,

        record: React.PropTypes.shape({
            type: React.PropTypes.string.isRequired,
            images: React.PropTypes.arrayOf(React.PropTypes.any),
        }).isRequired,
    },

    getTitle(record) {
        return options.types[record.type]
            .recordTitle(record, this.props);
    },

    renderRecord() {
        const record = this.props.record;

        return <div className="col-md-12 imageholder">
            <form
                action={record.getEditURL(this.props.lang)}
                method="POST"
                encType="multipart/form-data"
            >
                <input type="hidden" name="lang"
                    value={this.props.lang}
                />
                <div className="responsive-table">
                    <table className="table table-hover">
                        <thead>
                            <tr className="plain">
                                <th/>
                                {this.renderTitle(record)}
                            </tr>
                            <tr className="plain">
                                <td/>
                                {this.renderImages(record)}
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderMetadata()}
                            {this.renderSubmitButton()}
                        </tbody>
                    </table>
                </div>
            </form>
        </div>;
    },

    renderTitle(record) {
        const title = this.getTitle(record);

        return <th className="col-xs-12 text-center" key={record._id}>
            <h1 className="panel-title">{title}</h1>
        </th>;
    },

    renderImages(record) {
        return <td key={record._id}>
            <div>
                <div>
                    {record.images.map((image, i) =>
                        this.renderImage(record, image, i))}
                </div>
            </div>
        </td>;
    },

    renderImage(record, image) {
        return <div className="item" key={image._id}>
            <a href={image.getOriginalURL()}>
                <img src={image.getScaledURL()}
                    alt={this.getTitle(record)}
                    title={this.getTitle(record)}
                    className="img-responsive center-block"
                />
            </a>
        </div>;
    },

    renderMetadata() {
        const record = this.props.record;
        const type = record.type;
        const model = metadata.model(type);
        const props = Object.keys(options.types[type].model);

        return props.map((type) => {
            const typeSchema = model[type];

            return <tr key={type}>
                <th className="text-right">
                    {typeSchema.options.title(this.props)}
                </th>
                <td key={record._id}>
                    {typeSchema.renderEdit(record[type], this.props)}
                </td>
            </tr>;
        });
    },

    renderSubmitButton() {
        return <tr>
            <th/>
            <td>
                <input
                    type="submit"
                    value={this.props.gettext("Update")}
                    className="btn btn-primary"
                />
            </td>
        </tr>;
    },

    render() {
        const title = this.getTitle(this.props.record);

        return <Page
            {...this.props}
            title={title}
        >
            <div className="row">
                {this.renderRecord()}
            </div>
        </Page>;
    },
});

module.exports = EditRecord;
