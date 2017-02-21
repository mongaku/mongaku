// @flow

const React = require("react");

type YearRangeType = {
    _id: string,
    original?: string,
    circa?: boolean,
    start: number,
    end: number,
};

type Props = {
    value: Array<YearRangeType>,
    url: Array<string>,
};

const getDate = (date: YearRange): string => {
    if (date.original) {
        return date.original;
    }

    if (date.start || date.end) {
        // TODO(jeresig): Handle "ca. " for non-English locales
        return (date.circa ? "ca. " : "") +
            date.start + (date.end && date.end !== date.start ?
            `-${date.end}` : "");
    }

    return "";
};

const YearRange = ({date, url}: {date: YearRangeType, url: string}) => {
    return <span key={date._id}>
        <a href={url}>
            {getDate(date)}
        </a><br/>
    </span>;
};

const YearRangeView = ({value, url}: Props) => {
    return <span>
        {value.map((date, i) => <YearRange
            key={date._id}
            date={date}
            url={url[i]}
        />)}
    </span>;
};

module.exports = YearRangeView;
