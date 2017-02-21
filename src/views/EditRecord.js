// @flow

const React = require("react");

const FixedStringEdit = require("./types/edit/FixedString.js");
const LinkedRecordEdit = require("./types/edit/LinkedRecord.js");
const NameEdit = require("./types/edit/Name.js");
const SimpleDateEdit = require("./types/edit/SimpleDate.js");
const YearRangeEdit = require("./types/edit/YearRange.js");

import type {Context, ModelType} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

type Props = {
    title: string,
    dynamicValues: {},
    globalFacets?: {
        [name: string]: Array<{
            text: string,
        }>,
    },
    mode: "create" | "edit" | "clone",
    record?: Record,
    type: string,
};

type Record = {
    _id?: string,
    id?: string,
    type: string,
    title?: string,
    images: Array<ImageType>,
    getTitle: string,
    getEditURL: string,
    getCloneURL: string,
    getCreateURL: string,
    getRemoveImageURL: string,
};

type ImageType = {
    _id: string,
    getOriginalURL: string,
    getScaledURL: string,
};

const Image = ({
    image,
    record,
    title,
}: Props & {
    image: ImageType,
    title: string,
}, {
    gettext,
}: Context) => <div className="img col-md-4 col-xs-12 col-sm-6" key={image._id}>
    <a href={image.getOriginalURL}>
        <img src={image.getScaledURL}
            alt={title}
            title={title}
            className="img-responsive center-block"
        />
    </a>

    <div className="details reduced">
        <form
            action={record && record.getRemoveImageURL}
            method="POST"
            encType="multipart/form-data"
        >
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

Image.contextTypes = childContextTypes;

const Title = ({title}: {title: string}) => <tr className="plain">
    <th/>
    <th className="col-xs-12 text-center">
        <h1 className="panel-title">
            {title}
        </h1>
    </th>
</tr>;

const Images = (props: Props & {title: string}) => {
    const {record, title} = props;

    return <tr className="plain">
        <td/>
        <td>
            <div>
                <div>
                    {record && record.images.map((image, i) => <Image
                        {...props}
                        key={i}
                        image={image}
                        title={title}
                    />)}
                </div>
            </div>
        </td>
    </tr>;
};

const ImageForm = (props, {gettext}: Context) => <tr>
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

ImageForm.contextTypes = childContextTypes;

const IDForm = ({
    record,
    type,
}: Props, {gettext, options}: Context) => {
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
};

IDForm.contextTypes = childContextTypes;

const TypeEdit = ({
    name,
    type,
    value,
    allValues,
    typeSchema,
}: {
    name: string,
    type: string,
    value?: any,
    allValues: Array<any>,
    typeSchema: ModelType,
}) => {
    const {multiple} = typeSchema;

    if (typeSchema.type === "Dimension") {
        return null;

    } else if (typeSchema.type === "FixedString") {
        const expectedValues = typeSchema.values || {};
        let values = Object.keys(expectedValues).map((id) => ({
            id,
            name: expectedValues[id].name,
        }));

        if (values.length === 0) {
            values = allValues.map((text) => ({
                id: text,
                name: text,
            }));
        }

        return <FixedStringEdit
            name={name}
            type={type}
            value={value}
            values={values}
            multiple={multiple}
        />;

    } else if (typeSchema.type === "LinkedRecord") {
        return <LinkedRecordEdit
            name={name}
            type={type}
            value={value}
            multiple={multiple}
            recordType={typeSchema.recordType}
            placeholder={typeSchema.placeholder}
        />;

    } else if (typeSchema.type === "Location") {
        return null;

    } else if (typeSchema.type === "Name") {
        return <NameEdit
            name={name}
            type={type}
            value={value}
            multiple={multiple}
            names={allValues}
        />;

    } else if (typeSchema.type === "SimpleDate") {
        return <SimpleDateEdit
            name={name}
            type={type}
            value={value}
        />;

    } else if (typeSchema.type === "SimpleNumber") {
        return <FixedStringEdit
            name={name}
            type={type}
            value={value}
        />;

    } else if (typeSchema.type === "SimpleString") {
        return <FixedStringEdit
            name={name}
            type={type}
            value={value}
            multiline={typeSchema.multiline}
        />;

    } else if (typeSchema.type === "YearRange") {
        return <YearRangeEdit
            name={name}
            type={type}
            value={value}
        />;
    }

    return null;
};

const Contents = (props: Props, {gettext, options}: Context) => {
    const {
        type,
        globalFacets,
        dynamicValues,
    } = props;
    const {model} = options.types[type];
    const types = Object.keys(model);
    let hasPrivate = false;

    const fields = types.map((modelType) => {
        const typeSchema = model[modelType];
        const dynamicValue = dynamicValues[modelType];
        const values = (globalFacets && globalFacets[modelType] || [])
            .map((bucket) => bucket.text).sort();
        const isPrivate = typeSchema.private;

        hasPrivate = hasPrivate || isPrivate;

        return <tr key={modelType}>
            <th className="text-right">
                {typeSchema.title}
            </th>
            <td data-private={isPrivate}>
                <TypeEdit
                    name={modelType}
                    type={type}
                    value={dynamicValue}
                    allValues={values}
                    typeSchema={typeSchema}
                />
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

    return <tbody>
        {!options.types[type].noImages &&
            <ImageForm {...props} />}
        <IDForm {...props} />
        {fields}
        <SubmitButton {...props} />
    </tbody>;
};

Contents.contextTypes = childContextTypes;

const SubmitButton = ({mode}: Props, {gettext}: Context) => {
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
};

SubmitButton.contextTypes = childContextTypes;

const CloneButton = ({
    record,
    mode,
}: Props, {gettext}: Context) => <div className="row">
    <a
        href={record && record.getCloneURL}
        className="btn btn-primary pull-right"
    >
        {gettext("Clone Record")}
    </a>
</div>;

CloneButton.contextTypes = childContextTypes;

const EditRecord = (props: Props) => {
    const {record, mode, title} = props;
    const postURL = record ?
        (record._id ?
            record.getEditURL :
            record.getCreateURL) :
        "";

    return <div>
        {mode === "edit" && <CloneButton {...props} />}
        <div className="row">
            <div className="col-md-12 imageholder">
                <div className="responsive-table">
                    <table className="table table-hover">
                        <thead>
                            <Title title={title} />
                            <Images {...props} title={title} />
                        </thead>
                    </table>
                </div>
                <form
                    action={postURL}
                    method="POST"
                    encType="multipart/form-data"
                    data-validate={true}
                >
                    <div className="responsive-table">
                        <table className="table table-hover">
                            <Contents {...props} />
                        </table>
                    </div>
                </form>
            </div>
        </div>
    </div>;
};

module.exports = EditRecord;
