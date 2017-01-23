// @flow

"use strict";

const React = require("react");

const options = require("../lib/options");

const Page = require("./Page.jsx");

type SourceType = {
    _id: string,
    type: string,
    numRecords: number,
    getFullName: (lang: string) => string,
    getURL: (lang: string) => string,
};

type Props = {
    // GlobalProps
    URL: (path: string | {getURL: (lang: string) => string}) => string,
    format: (text: string, options: {}) => string,
    gettext: (text: string) => string,
    stringNum: (num: number) => string,
    lang: string,

    imageTotal: number,
    recordTotal: number,
    sources: Array<SourceType>,
};

const SearchForm = (props: Props & {type: string}) => {
    const {type, lang, URL, gettext} = props;
    const title = options.types[type].name(props);

    return <div>
        <h3>{title}</h3>
        <form action={URL(`/${type}/search`)} method="GET"
            className="form-search form-inline"
        >
            <div className="form-group">
                <input type="hidden" name="lang" value={lang} />
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
            <a href={URL(`/${type}/search`)} className="btn btn-default">
                {gettext("Browse All")}
            </a>
            {" "}
            <a href={URL(`/${type}/create`)} className="btn btn-success">
                {gettext("Create New")}
            </a>
        </form>
    </div>;
};

const ImageUploadForms = ({
    type,
    lang,
    gettext,
    URL,
}: Props & {type: string}) => <div>
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
            <form action={URL(`/${type}/file-upload`)} method="POST"
                encType="multipart/form-data"
            >
                <input type="hidden" name="lang"
                    value={lang}
                />
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
            <form action={URL(`/${type}/url-upload`)} method="GET">
                <input type="hidden" name="lang"
                    value={lang}
                />
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

const Source = (props: Props & {type: string, source: SourceType}) => {
    const {type, source, lang, stringNum} = props;
    const typeName = options.types[type].name(props);
    const recordCount = stringNum(source.numRecords);
    const desc = `${recordCount} ${typeName}`;

    return <div>
        <h4><a href={source.getURL(lang)}>
            {source.getFullName(lang)}
        </a></h4>
        <p>{desc}</p>
    </div>;
};

const Sources = (props: Props & {type: string}) => {
    const {type, sources, gettext} = props;
    return <div>
        <h3>{gettext("Browse by Collection:")}</h3>

        <div className="sources">
            {sources.map((source) => <Source
                {...props}
                key={source._id}
                source={source}
                type={type}
            />)}
        </div>
    </div>;
};

const Type = (props: Props & {type: string}) => {
    const {type, sources} = props;
    const sourcesByType = sources.filter((source) => source.type === type);

    return <div className="col-sm-8 col-sm-offset-2 upload-box">
        <SearchForm {...props} type={type} />
        {options.types[type].hasImageSearch() &&
            <ImageUploadForms {...props} type={type} />}
        {sourcesByType.length > 1 &&
            <Sources {...props} type={type} sources={sourcesByType} />}
    </div>;
};

const Home = (props: Props) => <Page
    {...props}
    splash={options.views.homeSplash &&
        <options.views.homeSplash {...props} />}
>
    {Object.keys(options.types).map((type) =>
        <Type key={type} {...props} type={type} />)}
</Page>;

module.exports = Home;
