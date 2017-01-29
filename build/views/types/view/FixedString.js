"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = require("react");

var FixedStringView = React.createClass({
    displayName: "FixedStringView",

    propTypes: {
        name: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
        value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)]).isRequired,
        values: React.PropTypes.arrayOf(React.PropTypes.shape({
            id: React.PropTypes.string.isRequired,
            name: React.PropTypes.string.isRequired
        }))
    },

    getTitle: function getTitle(value) {
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
        var _searchURL;

        if (!value) {
            return null;
        }

        var searchURL = require("../../../logic/shared/search-url");
        var title = this.getTitle(value);
        var url = searchURL(this.props, (_searchURL = {}, _defineProperty(_searchURL, this.props.name, value), _defineProperty(_searchURL, "type", this.props.type), _searchURL));

        return React.createElement(
            "a",
            { href: url },
            title
        );
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
        return Array.isArray(this.props.value) ? this.renderValues(this.props.value) : this.renderValue(this.props.value);
    }
});

module.exports = FixedStringView;