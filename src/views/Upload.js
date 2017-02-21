// @flow

const React = require("react");

const Page = require("./Page.js");

import type {Context} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

type ImageType = {
    _id: string,
    getOriginalURL: string,
    getScaledURL: string,
    getThumbURL: string,
};

type RecordType = {
    _id: string,
    type: string,
    url: string,
    source: string,
    images: Array<ImageType>,
    getOriginalURL: string,
    getThumbURL: string,
    getTitle: string,
    getURL: string,
};

type Source = {
    _id: string,
    name: string,
    getURL: string,
    getFullName: string,
    getShortName: string,
};

type MatchType = {
    _id: string,
    recordModel: RecordType,
    score: number,
    sources: Array<Source>,
};

type Props = {
    image: ImageType,
    similar: Array<MatchType>,
    title: string,
    sources: Array<Source>,
};

const UploadedImage = ({image}: Props, {gettext}: Context) => {
    const title = gettext("Uploaded Image");

    return <div className="panel panel-default">
        <div className="panel-heading">
            <strong>{gettext("Uploaded Image")}</strong>
        </div>
        <div className="panel-body">
            <a href={image.getOriginalURL}>
                <img src={image.getScaledURL}
                    alt={title}
                    title={title}
                    className="img-responsive center-block"
                />
            </a>
        </div>
    </div>;
};

UploadedImage.contextTypes = childContextTypes;

const Match = ({
    sources,
    match: {recordModel, score},
}: Props & {match: MatchType}, {
    gettext,
    utils: {format, getSource},
}: Context) => {
    const source = getSource(recordModel.source, sources);

    return <div className="img col-md-6 col-sm-4 col-xs-6">
        <div className="img-wrap">
            <a href={recordModel.getURL}>
                <img src={recordModel.getThumbURL}
                    alt={recordModel.getTitle}
                    title={recordModel.getTitle}
                    className="img-responsive center-block"
                />
            </a>
        </div>
        <div className="details">
            <div className="wrap">
                <span>{format(gettext("Score: %(score)s"),
                    {score: score})}</span>

                {source && <a className="pull-right"
                    href={source.getURL}
                    title={source.getFullName}
                >
                    {source.getShortName}
                </a>}
            </div>
        </div>
    </div>;
};

Match.contextTypes = childContextTypes;

const Results = (props: Props, {gettext}: Context) => {
    const {similar} = props;

    let similarResults;

    if (similar.length === 0) {
        similarResults = <div className="col-xs-12">
            <p>{gettext("No similar images were found.")}</p>
        </div>;
    } else {
        similarResults = similar.map((match) =>
            <Match {...props} match={match} key={match.recordModel._id} />);
    }

    return <div className="panel panel-default">
        <div className="panel-heading">
            <strong>{gettext("Similar Images")}</strong>
        </div>
        <div className="panel-body row">
            {similarResults}
        </div>
    </div>;
};

Results.contextTypes = childContextTypes;

const Upload = (props: Props) => {
    const {title} = props;

    return <Page title={title}>
        <div className="row">
            <div className="col-md-6">
                <UploadedImage {...props} />
            </div>
            <div className="col-md-6">
                <Results {...props} />
            </div>
        </div>
    </Page>;
};

module.exports = Upload;
