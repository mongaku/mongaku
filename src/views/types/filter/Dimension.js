// @flow

const React = require("react");

type Props = {
    heightTitle: string,
    name: string,
    placeholder?: {
        max?: number,
        min?: number,
    },
    searchName: string,
    value?: {
        heightMin?: number,
        heightMax?: number,
        widthMin?: number,
        widthMax?: number,
    },
    widthTitle: string,
};

const DimensionFilter = ({
    heightTitle,
    placeholder = {},
    searchName,
    value = {},
    widthTitle,
}: Props) => <div className="row">
    <div className="form-group col-xs-6 col-sm-12 col-lg-6">
        <label htmlFor={`${searchName}.widthMin`}
            className="control-label"
        >
            {widthTitle}
        </label>
        <div className="form-inline">
            <input type="text" name={`${searchName}.widthMin`}
                defaultValue={value.widthMin}
                placeholder={placeholder.min}
                className="form-control size-control"
            />
            &mdash;
            <input type="text" name={`${searchName}.widthMax`}
                defaultValue={value.widthMax}
                placeholder={placeholder.max}
                className="form-control size-control"
            />
        </div>
    </div>
    <div className="form-group col-xs-6 col-sm-12 col-lg-6">
        <label htmlFor={`${searchName}.heightMin`}
            className="control-label"
        >
            {heightTitle}
        </label>
        <div className="form-inline">
            <input type="text" name={`${searchName}.heightMin`}
                defaultValue={value.heightMin}
                placeholder={placeholder.min}
                className="form-control size-control"
            />
            &mdash;
            <input type="text" name={`${searchName}.heightMax`}
                defaultValue={value.heightMax}
                placeholder={placeholder.max}
                className="form-control size-control"
            />
        </div>
    </div>
</div>;

module.exports = DimensionFilter;
