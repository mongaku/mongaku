// @flow

const React = require("react");

const Page = require("./Page.jsx");

type ImageType = {
    _id: string,
    getOriginalURL: () => string,
    getScaledURL: () => string,
    getThumbURL: () => string,
};

type RecordType = {
    _id: string,
    type: string,
    url: string,
    images: Array<ImageType>,
    getOriginalURL: () => string,
    getThumbURL: () => string,
    getTitle: () => string,
    getSource: () => Source,
    getURL: (lang: string) => string,
};

type Source = {
    _id: string,
    name: string,
    getURL: (lang: string) => string,
};

type MatchType = {
    _id: string,
    recordModel: RecordType,
    score: number,
};

type Props = {
    // GlobalProps
    URL: (path: string | {getURL: (lang: string) => string}) => string,
    gettext: (text: string) => string,
    lang: string,
    getTitle: (item: {getTitle: () => string}) => string,
    format: (text: string, options: {}) => string,
    fullName: (name: *) => string,
    shortName: (name: *) => string,

    image: ImageType,
    similar: Array<MatchType>,
};

const UploadedImage = ({
    gettext,
    image,
}: Props) => {
    const title = gettext("Uploaded Image");

    return <div className="panel panel-default">
        <div className="panel-heading">
            <strong>{gettext("Uploaded Image")}</strong>
        </div>
        <div className="panel-body">
            <a href={image.getOriginalURL()}>
                <img src={image.getScaledURL()}
                    alt={title}
                    title={title}
                    className="img-responsive center-block"
                />
            </a>
        </div>
    </div>;
};

const Match = ({
    match: {recordModel, score},
    getTitle,
    URL,
    format,
    gettext,
    fullName,
    shortName,
}: Props & {match: MatchType}) => {
    const source = recordModel.getSource();

    return <div className="img col-md-6 col-sm-4 col-xs-6">
        <div className="img-wrap">
            <a href={URL(recordModel)}>
                <img src={recordModel.getThumbURL()}
                    alt={getTitle(recordModel)}
                    title={getTitle(recordModel)}
                    className="img-responsive center-block"
                />
            </a>
        </div>
        <div className="details">
            <div className="wrap">
                <span>{format(gettext("Score: %(score)s"),
                    {score: score})}</span>

                <a className="pull-right"
                    href={URL(source)}
                    title={fullName(source)}
                >
                    {shortName(source)}
                </a>
            </div>
        </div>
    </div>;
};

const Results = (props: Props) => {
    const {gettext, similar} = props;

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

const Upload = (props: Props) => {
    return <Page {...props}>
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
