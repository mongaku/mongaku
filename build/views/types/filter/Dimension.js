"use strict";

const React = require("react");

const DimensionFilter = ({
    heightTitle,
    placeholder = {},
    searchName,
    value = {},
    widthTitle
}) => React.createElement(
    "div",
    { className: "row" },
    React.createElement(
        "div",
        { className: "form-group col-xs-6 col-sm-12 col-lg-6" },
        React.createElement(
            "label",
            { htmlFor: `${searchName}.widthMin`,
                className: "control-label"
            },
            widthTitle
        ),
        React.createElement(
            "div",
            { className: "form-inline" },
            React.createElement("input", { type: "text", name: `${searchName}.widthMin`,
                defaultValue: value.widthMin,
                placeholder: placeholder.min,
                className: "form-control size-control"
            }),
            "\u2014",
            React.createElement("input", { type: "text", name: `${searchName}.widthMax`,
                defaultValue: value.widthMax,
                placeholder: placeholder.max,
                className: "form-control size-control"
            })
        )
    ),
    React.createElement(
        "div",
        { className: "form-group col-xs-6 col-sm-12 col-lg-6" },
        React.createElement(
            "label",
            { htmlFor: `${searchName}.heightMin`,
                className: "control-label"
            },
            heightTitle
        ),
        React.createElement(
            "div",
            { className: "form-inline" },
            React.createElement("input", { type: "text", name: `${searchName}.heightMin`,
                defaultValue: value.heightMin,
                placeholder: placeholder.min,
                className: "form-control size-control"
            }),
            "\u2014",
            React.createElement("input", { type: "text", name: `${searchName}.heightMax`,
                defaultValue: value.heightMax,
                placeholder: placeholder.max,
                className: "form-control size-control"
            })
        )
    )
);

DimensionFilter.propTypes = {
    heightTitle: require("react").PropTypes.string.isRequired,
    name: require("react").PropTypes.string.isRequired,
    placeholder: require("react").PropTypes.shape({
        max: require("react").PropTypes.number,
        min: require("react").PropTypes.number
    }),
    searchName: require("react").PropTypes.string.isRequired,
    value: require("react").PropTypes.shape({
        heightMin: require("react").PropTypes.number,
        heightMax: require("react").PropTypes.number,
        widthMin: require("react").PropTypes.number,
        widthMax: require("react").PropTypes.number
    }),
    widthTitle: require("react").PropTypes.string.isRequired
};
module.exports = DimensionFilter;