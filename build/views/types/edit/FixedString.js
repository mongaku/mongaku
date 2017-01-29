"use strict";

var React = require("react");

var FixedStringEdit = React.createClass({
    displayName: "FixedStringEdit",

    propTypes: {
        multiline: React.PropTypes.bool,
        multiple: React.PropTypes.bool,
        name: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
        value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)]).isRequired,
        values: React.PropTypes.arrayOf(React.PropTypes.shape({
            id: React.PropTypes.string.isRequired,
            name: React.PropTypes.string.isRequired
        }))
    },

    getValue: function getValue(value) {
        if (!this.props.values) {
            return value;
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this.props.values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var map = _step.value;

                if (map.id === value) {
                    return map.name;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return value;
    },
    renderValue: function renderValue(value) {
        var defaultValue = this.getValue(value);

        if (this.props.multiline) {
            return React.createElement("textarea", {
                name: this.props.name,
                className: "form-control",
                defaultValue: defaultValue
            });
        }

        return React.createElement("input", {
            name: this.props.name,
            type: "text",
            className: "form-control",
            defaultValue: defaultValue
        });
    },
    renderValues: function renderValues(values) {
        var _this = this;

        return React.createElement(
            "span",
            null,
            values.map(function (value, i) {
                return React.createElement(
                    "span",
                    { key: i },
                    _this.renderValue(value),
                    values.length - 1 === i ? "" : ", "
                );
            })
        );
    },
    render: function render() {
        var _this2 = this;

        if (this.props.values && this.props.values.length > 0) {
            var values = Array.isArray(this.props.value) ? this.props.value.map(function (value) {
                return _this2.getValue(value);
            }) : this.getValue(this.props.value);

            return React.createElement(
                "select",
                {
                    name: this.props.name,
                    className: "form-control select2-select",
                    defaultValue: values,
                    multiple: this.props.multiple
                },
                this.props.values.map(function (value) {
                    return React.createElement(
                        "option",
                        { value: value.id, key: value.id },
                        value.name
                    );
                })
            );
        }

        return Array.isArray(this.props.value) ? this.renderValues(this.props.value) : this.renderValue(this.props.value);
    }
});

module.exports = FixedStringEdit;