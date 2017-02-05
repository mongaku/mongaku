// @flow

const React = require("react");

import type {Context} from "../../types.js";
const {childContextTypes} = require("../../Wrapper.js");

type LocationType = {
    _id: string,
    city?: string,
    name?: string,
};

type Props = {
    name: string,
    type: string,
    value: Array<LocationType>,
};

const Location = ({
    name,
    type,
    location,
}: Props & {location: LocationType}, {searchURL}: Context) => {
    const url = searchURL({
        [name]: location.name,
        type,
    });

    return <span>
        {location.name && <span>
            <a href={url}>{location.name}</a><br/>
        </span>}
        {location.city && <span>{location.city}<br/></span>}
    </span>;
};

Location.contextTypes = childContextTypes;

const LocationView = (props: Props) => {
    const {value} = props;

    return <div>
        {value.map((location) => <Location
            {...props}
            key={location._id}
            location={location}
        />)}
    </div>;
};

module.exports = LocationView;
