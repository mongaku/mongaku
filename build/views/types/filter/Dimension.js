"use strict";

var React = require("react");

var DimensionFilter = React.createClass({
    displayName: "DimensionFilter",

    propTypes: {
        heightTitle: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        placeholder: React.PropTypes.shape({
            max: React.PropTypes.number,
            min: React.PropTypes.number
        }),
        searchName: React.PropTypes.string,
        value: React.PropTypes.shape({
            heightMin: React.PropTypes.number,
            heightMax: React.PropTypes.number,
            widthMax: React.PropTypes.number,
            widthMin: React.PropTypes.number
        }),
        widthTitle: React.PropTypes.string.isRequired
    },

    getDefaultProps: function getDefaultProps() {
        return {
            placeholder: {},
            value: {}
        };
    },
    render: function render() {
        var searchName = this.props.searchName || this.props.name;

        return React.createElement(
            "div",
            { className: "row" },
            React.createElement(
                "div",
                { className: "form-group col-xs-6 col-sm-12 col-lg-6" },
                React.createElement(
                    "label",
                    { htmlFor: searchName + ".widthMin",
                        className: "control-label"
                    },
                    this.props.widthTitle
                ),
                React.createElement(
                    "div",
                    { className: "form-inline" },
                    React.createElement("input", { type: "text", name: searchName + ".widthMin",
                        defaultValue: this.props.value.widthMin,
                        placeholder: this.props.placeholder.min,
                        className: "form-control size-control"
                    }),
                    "\u2014",
                    React.createElement("input", { type: "text", name: searchName + ".widthMax",
                        defaultValue: this.props.value.widthMax,
                        placeholder: this.props.placeholder.max,
                        className: "form-control size-control"
                    })
                )
            ),
            React.createElement(
                "div",
                { className: "form-group col-xs-6 col-sm-12 col-lg-6" },
                React.createElement(
                    "label",
                    { htmlFor: searchName + ".heightMin",
                        className: "control-label"
                    },
                    this.props.heightTitle
                ),
                React.createElement(
                    "div",
                    { className: "form-inline" },
                    React.createElement("input", { type: "text", name: searchName + ".heightMin",
                        defaultValue: this.props.value.heightMin,
                        placeholder: this.props.placeholder.min,
                        className: "form-control size-control"
                    }),
                    "\u2014",
                    React.createElement("input", { type: "text", name: searchName + ".heightMax",
                        defaultValue: this.props.value.heightMax,
                        placeholder: this.props.placeholder.max,
                        className: "form-control size-control"
                    })
                )
            )
        );
    }
});

module.exports = DimensionFilter;