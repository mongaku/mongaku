// @flow

const React = require("react");

type LocationType = {
    _id: string,
    city?: string,
    name?: string,
};

type Props = {
    value: Array<LocationType>,
    url: Array<string>,
};

const Location = ({value, url}: {value: LocationType, url: string}) => {
    return (
        <span>
            {value.name && (
                <span>
                    <a href={url}>{value.name}</a>
                    <br />
                </span>
            )}
            {value.city && (
                <span>
                    {value.city}
                    <br />
                </span>
            )}
        </span>
    );
};

const LocationView = ({value, url}: Props) => (
    <div>
        {value.map((location, i) => (
            <Location key={location._id} value={location} url={url[i]} />
        ))}
    </div>
);

module.exports = LocationView;
