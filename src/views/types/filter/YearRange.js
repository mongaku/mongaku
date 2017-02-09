// @flow

const React = require("react");

type DateRange = {
    end?: number,
    start?: number,
};

type Props = {
    placeholder?: DateRange,
    searchName: string,
    title: string,
    value?: DateRange,
};

const YearRangeFilter = ({
    placeholder,
    searchName,
    title,
    value,
}: Props) => <div className="form-group">
    <label htmlFor={`${searchName}.start`} className="control-label">
        {title}
    </label>
    <div className="form-inline">
        <input type="text" name={`${searchName}.start`}
            defaultValue={value && value.start}
            placeholder={placeholder && placeholder.start}
            className="form-control date-control"
        />
        &mdash;
        <input type="text" name={`${searchName}.end`}
            defaultValue={value && value.end}
            placeholder={placeholder && placeholder.end}
            className="form-control date-control"
        />
    </div>
</div>;

module.exports = YearRangeFilter;
