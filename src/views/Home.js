// @flow

const React = require("react");

const Page = require("./Page.js");
const {stringNum, URL} = require("./utils.js");

import type {Context} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

type SourceType = {
    _id: string,
    type: string,
    numRecords: number,
    getFullName: string,
    getURL: string,
};

type Props = {
    sources: Array<SourceType>,
};

const SearchForm = ({type}: {type: string}, {
    lang,
    gettext,
    user,
    options,
}: Context) => {
    const title = options.types[type].name;
    const sources = user && user.getEditableSourcesByType[type];

    return <div>
        <h3>{title}</h3>
        <form action={URL(lang, `/${type}/search`)} method="GET"
            className="form-search form-inline"
        >
            <div className="form-group">
                <input type="search" id="filter" name="filter"
                    placeholder={gettext("Search")}
                    className="form-control search-query"
                />
            </div>
            {" "}
            <input type="submit" value={gettext("Search")}
                className="btn btn-primary"
            />
            {" "}
            <a href={URL(lang, `/${type}/search`)} className="btn btn-default">
                {gettext("Browse All")}
            </a>
            {" "}
            {sources && sources.length > 0 &&
                <a
                    href={URL(lang, `/${type}/create`)}
                    className="btn btn-success"
                >
                    {gettext("Create New")}
                </a>
            }
        </form>
    </div>;
};

SearchForm.contextTypes = childContextTypes;

const ImageUploadForms = ({type}: {type: string},
        {lang, gettext}: Context) => <div>
    <h3>{gettext("Search by Image:")}</h3>
    <p>{gettext("Upload an image to find other " +
        "similar images.")}</p>

    <div className="panel panel-default">
        <div className="panel-heading">
            <h3 className="panel-title">
                {gettext("Upload an Image")}
            </h3>
        </div>
        <div className="panel-body">
            <form action={URL(lang, `/${type}/file-upload`)} method="POST"
                encType="multipart/form-data"
            >
                <div className="form-inline">
                    <div className="form-group">
                        <input type="file" id="file" name="file"
                            className="form-control"
                        />
                    </div>
                    {" "}
                    <input type="submit" className="btn btn-primary"
                        value={gettext("Search by Image")}
                    />
                </div>
            </form>
        </div>
    </div>

    <div className="panel panel-default">
        <div className="panel-heading">
            <h3 className="panel-title">
                {gettext("Paste Image URL")}
            </h3>
        </div>
        <div className="panel-body">
            <form action={URL(lang, `/${type}/url-upload`)} method="GET">
                <div className="form-inline">
                    <div className="form-group">
                        <input type="text" id="url" name="url"
                            defaultValue="http://"
                            className="form-control"
                        />
                    </div>
                    {" "}
                    <input type="submit"
                        value={gettext("Search by Image")}
                        className="btn btn-primary"
                    />
                </div>
            </form>
        </div>
    </div>
</div>;

ImageUploadForms.contextTypes = childContextTypes;

const Source = ({type, source}: {type: string, source: SourceType},
    {lang, options}: Context) => {

    const typeName = options.types[type].name;
    const recordCount = stringNum(lang, source.numRecords);
    const desc = `${recordCount} ${typeName}`;

    return <div>
        <h4><a href={source.getURL}>
            {source.getFullName}
        </a></h4>
        <p>{desc}</p>
    </div>;
};

Source.contextTypes = childContextTypes;

const Sources = ({type, sources}: Props & {type: string},
        {gettext}: Context) => <div>
    <h3>{gettext("Browse by Collection:")}</h3>

    <div className="sources">
        {sources.map((source) => <Source
            key={source._id}
            source={source}
            type={type}
        />)}
    </div>
</div>;

Sources.contextTypes = childContextTypes;

const Type = ({type, sources}: Props & {type: string}, {options}: Context) => {
    const sourcesByType = sources.filter((source) => source.type === type);

    return <div className="col-sm-8 col-sm-offset-2 upload-box">
        <SearchForm type={type} />
        {options.types[type].hasImageSearch &&
            <ImageUploadForms type={type} />}
        {sourcesByType.length > 1 &&
            <Sources type={type} sources={sourcesByType} />}
    </div>;
};

Type.contextTypes = childContextTypes;

const Home = ({sources}: Props, {options}: Context) => <Page>
    {Object.keys(options.types).map((type) =>
        <Type key={type} sources={sources} type={type} />)}
</Page>;

Home.contextTypes = childContextTypes;

module.exports = Home;
