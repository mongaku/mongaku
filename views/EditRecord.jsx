// @flow

"use strict";

const React = require("react");

const metadata = require("../lib/metadata");
const options = require("../lib/options");

const Page = require("./Page.jsx");

type Props = {
    // GlobalProps
    URL: (path: string | {getURL: (lang: string) => string}) => string,
    format: (text: string, options: {}) => string,
    gettext: (text: string) => string,
    lang: string,

    dynamicValues: {},
    globalFacets?: Array<{
        text: string,
    }>,
    mode: "create" | "edit" | "clone",
    record: {
        _id?: string,
        id?: string,
        type: string,
        images: Array<ImageType>,
        getEditURL: (lang: string) => string,
        getCloneURL: (lang: string) => string,
        getCreateURL: (lang: string) => string,
        getRemoveImageURL: (lang: string) => string,
    },
    type: string,
};

type ImageType = {
    _id: string,
    getOriginalURL: () => string,
    getScaledURL: () => string,
};

const Image = ({
    image,
    record,
    lang,
    gettext,
    title,
}: Props & {
    image: ImageType,
    title: string,
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

class EditRecord extends React.Component {
    props: Props

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

    renderTitle() {
        const title = this.getTitle();

        return <tr className="plain">
            <th/>
            <th className="col-xs-12 text-center">
                <h1 className="panel-title">
                    {title}
                </h1>
            </th>
        </tr>;
    }

    renderImages() {
        const {record} = this.props;
        const title = this.getTitle();

        return <tr className="plain">
            <td/>
            <td>
                <div>
                    <div>
                        {record && record.images.map((image) => <Image
                            {...this.props}
                            image={image}
                            title={title}
                        />)}
                    </div>
                </div>
            </td>
        </tr>;
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
            const values = (globalFacets && globalFacets[type] || [])
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
                        <input type="hidden" name="lang" value={lang} />
                        <div className="responsive-table">
                            <table className="table table-hover">
                                <thead>
                                    {this.renderTitle()}
                                    {this.renderImages()}
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

module.exports = EditRecord;
