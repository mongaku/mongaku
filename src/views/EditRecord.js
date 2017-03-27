// @flow

const React = require("react");

const FixedStringEdit = require("./types/edit/FixedString.js");
const LinkedRecordEdit = require("./types/edit/LinkedRecord.js");
const NameEdit = require("./types/edit/Name.js");
const SimpleDateEdit = require("./types/edit/SimpleDate.js");
const YearRangeEdit = require("./types/edit/YearRange.js");
const Select = require("./shared/Select.js");

import type {Context, ModelType, Source} from "./types.js";
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
    source?: string,
    sources?: Array<Source>,
};

type Record = {
    _id?: string,
    id?: string,
    type: string,
    title?: string,
    imageModels: Array<ImageType>,
    getTitle: string,
    getEditURL: string,
    getCloneURL: string,
    getCreateURL: string,
    getRemoveImageURL: string,
};

type ImageType = {
    _id: string,
    getOriginalURL: string,
    getThumbURL: string,
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
}: Context) => <div className="img col-md-3 col-xs-6 col-sm-4" key={image._id}>
    <div className="img-wrap">
        <a href={image.getOriginalURL} target="_blank">
            <img src={image.getThumbURL}
                alt={title}
                title={title}
                className="img-responsive center-block"
            />
        </a>
    </div>

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

const Title = ({title}: {title: string}) => <div
    className="col-xs-12 text-center"
    style={{
        borderBottom: "1px solid lightgrey",
        paddingBottom: 10,
        marginBottom: 15,
    }}
>
    <h1 className="panel-title">
        {title}
    </h1>
</div>;

const Images = (props: Props & {title: string}) => {
    const {record, title} = props;

    return <div className="col-xs-12 text-center">
        <div>
            {record && record.imageModels.map((image, i) => <Image
                {...props}
                key={i}
                image={image}
                title={title}
            />)}
        </div>
    </div>;
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

class IDForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            unused: false,
        };
    }

    state: {
        unused: boolean,
    }

    componentDidUpdate(prevProps) {
        if (prevProps.curSource !== this.props.curSource) {
            this.checkID();
        }
    }

    props: Props & {
        curSource: string,
        onValid: () => void,
    }
    context: Context
    currentID: string

    setUnused(unused) {
        this.props.onValid(unused);
        this.setState({unused});
    }

    checkID() {
        const id = this.currentID;
        const {type, curSource} = this.props;

        if (!id) {
            return this.setUnused(false);
        }

        fetch(`/${type}/${curSource}/${id}/json`, {
            credentials: "same-origin",
        }).then((res) => {
            this.setUnused(res.status !== 200);
        });
    }

    handleInput(e: SyntheticInputEvent) {
        this.currentID = e.target.value;
        this.checkID();
    }

    render() {
        const {record, type, curSource} = this.props;
        const {gettext, options} = this.context;
        const {unused} = this.state;

        if (options.types[type].autoID || record && record._id) {
            return null;
        }

        return <tr className={unused ? "has-success" : "has-error"}>
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
                    defaultValue={record && record.id}
                    onInput={(e) => this.handleInput(e)}
                    disabled={!curSource}
                />
            </td>
        </tr>;
    }
}

IDForm.contextTypes = childContextTypes;

const HiddenSourceID = ({id}: {id: string}) => <tr style={{display: "none"}}>
    <td><input type="hidden" name="source" value={id} /></td>
</tr>;

const SourceForm = ({
    source,
    sources,
    onSourceChange,
}: Props & {
    onSourceChange: (curSource: string) => void,
}, {gettext}: Context) => {
    if (source) {
        return <HiddenSourceID id={source} />;
    }

    if (!sources) {
        return null;
    }

    if (sources.length === 1) {
        return <HiddenSourceID id={sources[0]._id} />;
    }

    return <tr>
        <th className="text-right">
            <label className="control-label">
                {gettext("Source")}
            </label>
        </th>
        <td>
            <Select
                name="source"
                value={sources[0]._id}
                options={sources.map((source) => ({
                    value: source._id,
                    label: source.getFullName,
                }))}
                clearable={false}
                onChange={(source) => {
                    if (typeof source === "string") {
                        onSourceChange(source);
                    }
                }}
            />
        </td>
    </tr>;
};

SourceForm.contextTypes = childContextTypes;

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
            value={value && String(value)}
        />;

    } else if (typeSchema.type === "SimpleString") {
        return <FixedStringEdit
            name={name}
            type={type}
            value={value}
            multiline={typeSchema.multiline}
        />;

    } else if (typeSchema.type === "URL") {
        return <FixedStringEdit
            name={name}
            type={type}
            value={value}
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

class Contents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPrivate: false,
            valid: (props.mode === "edit"),
            curSource: props.source || props.sources[0]._id,
        };
    }

    state: {
        showPrivate: boolean,
        valid: boolean,
        curSource: string,
    }

    componentDidMount() {
        const {showPrivate} = window.localStorage;
        this.setState({showPrivate}); // eslint-disable-line react/no-did-mount-set-state
    }

    props: Props
    context: Context

    togglePrivate(e: SyntheticInputEvent) {
        const showPrivate = e.target.checked;
        if (showPrivate) {
            window.localStorage.showPrivate = showPrivate;
        } else {
            delete window.localStorage.showPrivate;
        }
        this.setState({showPrivate});
    }

    render() {
        const {
            mode,
            type,
            globalFacets,
            dynamicValues,
        } = this.props;
        const {gettext, options} = this.context;
        const {model} = options.types[type];
        const types = Object.keys(model);
        const canBePrivate = (mode === "edit");
        let privateToggle = null;

        const fields = types.map((modelType) => {
            const typeSchema = model[modelType];
            const dynamicValue = dynamicValues[modelType];
            const values = (globalFacets && globalFacets[modelType] || [])
                .map((bucket) => bucket.text).sort();
            const isPrivate = (canBePrivate && !this.state.showPrivate &&
                typeSchema.private);

            return <tr key={modelType}>
                <th className="text-right">
                    {typeSchema.title}
                </th>
                <td {...isPrivate ? {"data-private": "true"} : {}}>
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

        if (canBePrivate) {
            privateToggle = <tr>
                <th/>
                <td>
                    <label>
                        <input
                            type="checkbox"
                            className="toggle-private"
                            defaultChecked={this.state.showPrivate}
                            onChange={(e) => this.togglePrivate(e)}
                        />
                        {" "}
                        {gettext("Show private fields.")}
                    </label>
                </td>
            </tr>;
        }

        return <tbody>
            {!options.types[type].noImages &&
                <ImageForm {...this.props} />}
            <SourceForm
                {...this.props}
                onSourceChange={(curSource) => this.setState({curSource})}
            />
            <IDForm
                {...this.props}
                curSource={this.state.curSource}
                onValid={(valid) => this.setState({valid})}
            />
            {fields}
            {privateToggle}
            <SubmitButtons {...this.props} valid={this.state.valid} />
        </tbody>;
    }
}

Contents.contextTypes = childContextTypes;

const SubmitButtons = (props: Props & {valid: boolean}) => {
    const {mode, valid} = props;

    return <tr>
        <th/>
        <td>
            <SubmitButton {...props} valid={valid} />
            <span className="pull-right">
                {mode === "edit" && <DeleteButton {...props} />}
            </span>
        </td>
    </tr>;
};

const SubmitButton = (props: Props & {valid: boolean}, {gettext}: Context) => {
    const {mode, valid} = props;
    let buttonText = gettext("Update");

    if (mode === "create") {
        buttonText = gettext("Create");
    } else if (mode === "clone") {
        buttonText = gettext("Clone");
    }

    return <input
        type="submit"
        value={buttonText}
        className="btn btn-primary"
        disabled={!valid}
    />;
};

SubmitButton.contextTypes = childContextTypes;

const DeleteButton = (props: Props, {gettext}: Context) => {
    const deleteText = gettext("Are you sure you wish to delete this?");
    return <input
        type="submit"
        name="removeRecord"
        value={gettext("Delete")}
        className="btn btn-danger pull-right"
        onClick={(e) => {
            if (!confirm(deleteText)) { // eslint-disable-line no-alert
                e.preventDefault();
            }
        }}
    />;
};

DeleteButton.contextTypes = childContextTypes;

const CloneButton = ({
    record,
    mode,
}: Props, {gettext}: Context) => <div className="row">
    <div
        className="col-xs-12"
        style={{
            marginBottom: 15,
            overflow: "auto",
        }}
    >
        <a
            href={record && record.getCloneURL}
            className="btn btn-primary pull-right"
        >
            {gettext("Clone Record")}
        </a>
    </div>
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
                <Title title={title} />
                <Images {...props} title={title} />
                <form
                    action={postURL}
                    method="POST"
                    encType="multipart/form-data"
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
