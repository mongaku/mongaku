// @flow

const React = require("react");

const {searchURL} = require("../../utils.js");

import type {Context} from "../../types.js";
const {childContextTypes} = require("../../Wrapper.js");

type YearRangeType = {
    _id: string,
    original?: string,
    circa?: string,
    start: number,
    end: number,
};

type Props = {
    name: string,
    type: string,
    value: Array<YearRangeType>,
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

const YearRange = ({
    name,
    type,
    date,
}: Props & {date: YearRangeType}, {lang}: Context) => {
    const url = searchURL(lang, {
        [name]: {
            start: date.start,
            end: date.end,
        },
        type,
    });

    return <span key={date._id}>
        <a href={url}>
            {getDate(date)}
        </a><br/>
    </span>;
};

YearRange.contextTypes = childContextTypes;

const YearRangeView = (props: Props) => {
    const {value} = props;
    return <span>
        {value.map((date) => <YearRange
            {...props}
            date={date}
            key={date._id}
        />)}
    </span>;
};

module.exports = YearRangeView;
