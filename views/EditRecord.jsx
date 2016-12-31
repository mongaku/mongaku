"use strict";

const React = require("react");

const metadata = require("../lib/metadata");
const options = require("../lib/options");

const Page = require("./Page.jsx");

const EditRecord = React.createClass({
    propTypes: {
        dynamicValues: React.PropTypes.any.isRequired,
        gettext: React.PropTypes.func.isRequired,
        globalFacets: React.PropTypes.any,
        lang: React.PropTypes.string.isRequired,
        record: React.PropTypes.shape({
            _id: React.PropTypes.string,
            id: React.PropTypes.string,
            type: React.PropTypes.string.isRequired,
            images: React.PropTypes.arrayOf(React.PropTypes.any),
        }),
        type: React.PropTypes.string.isRequired,
    },

    getTitle() {
        const {record} = this.props;

        if (!record) {
            return this.props.gettext("Create Record");
        }

        return options.types[record.type]
            .recordTitle(record, this.props);
    },

    renderRecord() {
        const {record, lang} = this.props;
        const postURL = record ?
            (record._id ?
                record.getEditURL(lang) :
                record.getCreateURL(lang)) :
            "";

        return <div className="col-md-12 imageholder">
            <form
                action={postURL}
                method="POST"
                encType="multipart/form-data"
                data-validate={true}
            >
                <input type="hidden" name="lang"
                    value={lang}
                />
                <div className="responsive-table">
                    <table className="table table-hover">
                        <thead>
                            <tr className="plain">
                                <th/>
                                {this.renderTitle()}
                            </tr>
                            <tr className="plain">
                                <td/>
                                {this.renderImages(record)}
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderImageForm()}
                            {this.renderIDForm()}
                            {this.renderMetadata()}
                            {this.renderSubmitButton()}
                        </tbody>
                    </table>
                </div>
            </form>
        </div>;
    },

    renderTitle() {
        const title = this.getTitle();

        return <th className="col-xs-12 text-center">
            <h1 className="panel-title">{title}</h1>
        </th>;
    },

    renderImages() {
        const {record} = this.props;

        return <td>
            <div>
                <div>
                    {record && record.images.map((image, i) =>
                        this.renderImage(image, i))}
                </div>
            </div>
        </td>;
    },

    renderImage(image) {
        const {record} = this.props;

        return <div className="img col-md-4 col-xs-12 col-sm-6" key={image._id}>
            <a href={image.getOriginalURL()}>
                <img src={image.getScaledURL()}
                    alt={this.getTitle()}
                    title={this.getTitle()}
                    className="img-responsive center-block"
                />
            </a>

            <div className="details reduced">
                <form
                    action={record.getRemoveImageURL(this.props.lang)}
                    method="POST"
                    encType="multipart/form-data"
                >
                    <input
                        type="hidden"
                        name="lang"
                        value={this.props.lang}
                    />
                    <input
                        type="hidden"
                        name="image"
                        value={image._id}
                    />

                    <button
                        type="submit"
                        className="btn btn-danger btn-xs"
                    >
                        <span
                            className="glyphicon glyphicon-remove"
                            aria-hidden="true"
                        />
                        {" "}
                        {this.props.gettext("Remove Image")}
                    </button>
                </form>
            </div>
        </div>;
    },

    renderIDForm() {
        const {record, type} = this.props;

        if (options.types[type].autoID || record && record._id) {
            return null;
        }

        return <tr className="has-error">
            <th className="text-right">
                <label className="control-label">
                    {this.props.gettext("ID")}
                </label>
            </th>
            <td>
                <input
                    type="text"
                    name="id"
                    className="form-control"
                    data-id="true"
                    defaultValue={record && record.id}
                />
            </td>
        </tr>;
    },

    renderImageForm() {
        const {type} = this.props;

        if (options.types[type].noImages) {
            return null;
        }

        return <tr>
            <th className="text-right">
                {this.props.gettext("Add Images")}
            </th>
            <td>
                <input
                    type="file"
                    name="images"
                    className="form-control"
                    multiple
                />
            </td>
        </tr>;
    },

    renderMetadata() {
        const {type, globalFacets} = this.props;
        const model = metadata.model(type);
        const props = Object.keys(options.types[type].model);
        let hasPrivate = false;

        const fields = props.map((type) => {
            const typeSchema = model[type];
            const dynamicValue = this.props.dynamicValues[type];
            const values = (globalFacets[type] || [])
                .map((bucket) => bucket.text).sort();
            const isPrivate = typeSchema.options.private;

            hasPrivate = hasPrivate || isPrivate;

            return <tr key={type}>
                <th className="text-right">
                    {typeSchema.options.title(this.props)}
                </th>
                <td data-private={isPrivate}>
                    {typeSchema.renderEdit(dynamicValue, values, this.props)}
                </td>
            </tr>;
        });

        if (hasPrivate) {
            fields.push(<tr key="private">
                <th/>
                <td>
                    <label>
                        <input
                            type="checkbox"
                            className="toggle-private"
                        />
                        {" "}
                        {this.props.gettext(
                            "Show private fields.")}
                    </label>
                </td>
            </tr>);
        }

        return fields;
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
        const title = this.getTitle();

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
