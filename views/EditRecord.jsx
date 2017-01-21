"use strict";

const React = require("react");

const metadata = require("../lib/metadata");
const options = require("../lib/options");

const Page = require("./Page.jsx");

const Image = ({
    image,
    record,
    lang,
    gettext,
    title,
}) => <div className="img col-md-4 col-xs-12 col-sm-6" key={image._id}>
    <a href={image.getOriginalURL()}>
        <img src={image.getScaledURL()}
            alt={title}
            title={title}
            className="img-responsive center-block"
        />
    </a>

    <div className="details reduced">
        <form
            action={record.getRemoveImageURL(lang)}
            method="POST"
            encType="multipart/form-data"
        >
            <input
                type="hidden"
                name="lang"
                value={lang}
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
                {gettext("Remove Image")}
            </button>
        </form>
    </div>
</div>;

Image.propTypes = {
    gettext: React.PropTypes.func.isRequired,
    image: React.PropTypes.any.isRequired,
    lang: React.PropTypes.string.isRequired,
    record: React.PropTypes.shape({
        _id: React.PropTypes.string,
        id: React.PropTypes.string,
        type: React.PropTypes.string.isRequired,
        images: React.PropTypes.arrayOf(React.PropTypes.any),
    }),
    title: React.PropTypes.string.isRequired,
};

class EditRecord extends React.Component {
    getTitle() {
        const {record, mode, format, gettext, type} = this.props;

        if (!record || mode === "create") {
            return format(gettext("%(recordName)s: Create New"), {
                recordName: options.types[type].name(this.props),
            });
        }

        const recordTitle = options.types[type]
            .recordTitle(record, this.props);

        if (mode === "clone") {
            return format(gettext("Cloning '%(recordTitle)s'"), {recordTitle});
        }

        return format(gettext("Updating '%(recordTitle)s'"), {recordTitle});
    }

    renderIDForm() {
        const {record, type, gettext} = this.props;

        if (options.types[type].autoID || record && record._id) {
            return null;
        }

        return <tr className="has-error">
            <th className="text-right">
                <label className="control-label">
                    {gettext("ID")}
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
    }

    renderImageForm() {
        const {type, gettext} = this.props;

        if (options.types[type].noImages) {
            return null;
        }

        return <tr>
            <th className="text-right">
                {gettext("Add Images")}
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
    }

    renderMetadata() {
        const {type, globalFacets, dynamicValues, gettext} = this.props;
        const model = metadata.model(type);
        const props = Object.keys(options.types[type].model);
        let hasPrivate = false;

        const fields = props.map((type) => {
            const typeSchema = model[type];
            const dynamicValue = dynamicValues[type];
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
                        {gettext("Show private fields.")}
                    </label>
                </td>
            </tr>);
        }

        return fields;
    }

    renderSubmitButton() {
        const {gettext, mode} = this.props;

        let buttonText = gettext("Update");

        if (mode === "create") {
            buttonText = gettext("Create");
        } else if (mode === "clone") {
            buttonText = gettext("Clone");
        }

        return <tr>
            <th/>
            <td>
                <input
                    type="submit"
                    value={buttonText}
                    className="btn btn-primary"
                />
            </td>
        </tr>;
    }

    renderCloneButton() {
        const {gettext, record, mode, lang} = this.props;

        if (mode !== "edit") {
            return null;
        }

        return <div className="row">
            <a
                href={record.getCloneURL(lang)}
                className="btn btn-primary pull-right"
            >
                {gettext("Clone Record")}
            </a>
        </div>;
    }

    render() {
        const {record, lang} = this.props;
        const postURL = record ?
            (record._id ?
                record.getEditURL(lang) :
                record.getCreateURL(lang)) :
            "";
        const title = this.getTitle();

        return <Page
            {...this.props}
            title={title}
        >
            {this.renderCloneButton()}
            <div className="row">
                <div className="col-md-12 imageholder">
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
                                        <th className="col-xs-12 text-center">
                                            <h1 className="panel-title">
                                                {title}
                                            </h1>
                                        </th>
                                    </tr>
                                    <tr className="plain">
                                        <td/>
                                        <td>
                                            <div>
                                                <div>
                                                    {record && record.images
                                                        .map((image) => <Image
                                                            {...this.props}
                                                            image={image}
                                                            title={title}
                                                        />)}
                                                </div>
                                            </div>
                                        </td>
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
                </div>
            </div>
        </Page>;
    }
}

EditRecord.propTypes = {
    dynamicValues: React.PropTypes.any.isRequired,
    format: React.PropTypes.func.isRequired,
    gettext: React.PropTypes.func.isRequired,
    globalFacets: React.PropTypes.any,
    lang: React.PropTypes.string.isRequired,
    mode: React.PropTypes.oneOf(["create", "edit", "clone"]).isRequired,
    record: React.PropTypes.shape({
        _id: React.PropTypes.string,
        id: React.PropTypes.string,
        type: React.PropTypes.string.isRequired,
        images: React.PropTypes.arrayOf(React.PropTypes.any),
    }),
    type: React.PropTypes.string.isRequired,
};

module.exports = EditRecord;
