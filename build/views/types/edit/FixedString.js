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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy92aWV3cy90eXBlcy9lZGl0L0ZpeGVkU3RyaW5nLmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwicmVxdWlyZSIsIkZpeGVkU3RyaW5nRWRpdCIsImNyZWF0ZUNsYXNzIiwicHJvcFR5cGVzIiwibXVsdGlsaW5lIiwiUHJvcFR5cGVzIiwiYm9vbCIsIm11bHRpcGxlIiwibmFtZSIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJ0eXBlIiwidmFsdWUiLCJvbmVPZlR5cGUiLCJhcnJheU9mIiwidmFsdWVzIiwic2hhcGUiLCJpZCIsImdldFZhbHVlIiwicHJvcHMiLCJtYXAiLCJyZW5kZXJWYWx1ZSIsImRlZmF1bHRWYWx1ZSIsInJlbmRlclZhbHVlcyIsImkiLCJsZW5ndGgiLCJyZW5kZXIiLCJBcnJheSIsImlzQXJyYXkiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFFBQVFDLFFBQVEsT0FBUixDQUFkOztBQUVBLElBQU1DLGtCQUFrQkYsTUFBTUcsV0FBTixDQUFrQjtBQUFBOztBQUN0Q0MsZUFBVztBQUNQQyxtQkFBV0wsTUFBTU0sU0FBTixDQUFnQkMsSUFEcEI7QUFFUEMsa0JBQVVSLE1BQU1NLFNBQU4sQ0FBZ0JDLElBRm5CO0FBR1BFLGNBQU1ULE1BQU1NLFNBQU4sQ0FBZ0JJLE1BQWhCLENBQXVCQyxVQUh0QjtBQUlQQyxjQUFNWixNQUFNTSxTQUFOLENBQWdCSSxNQUFoQixDQUF1QkMsVUFKdEI7QUFLUEUsZUFBT2IsTUFBTU0sU0FBTixDQUFnQlEsU0FBaEIsQ0FBMEIsQ0FDN0JkLE1BQU1NLFNBQU4sQ0FBZ0JJLE1BRGEsRUFFN0JWLE1BQU1NLFNBQU4sQ0FBZ0JTLE9BQWhCLENBQ0lmLE1BQU1NLFNBQU4sQ0FBZ0JJLE1BRHBCLENBRjZCLENBQTFCLEVBS0pDLFVBVkk7QUFXUEssZ0JBQVFoQixNQUFNTSxTQUFOLENBQWdCUyxPQUFoQixDQUNKZixNQUFNTSxTQUFOLENBQWdCVyxLQUFo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Q0gsS0FBS1csWUFBTCxDQUFrQixLQUFLSixLQUFMLENBQVdQLEtBQTdCLENBREcsR0FFSCxLQUFLUyxXQUFMLENBQWlCLEtBQUtGLEtBQUwsQ0FBV1AsS0FBNUIsQ0FGSjtBQUdIO0FBckZxQyxDQUFsQixDQUF4Qjs7QUF3RkFpQixPQUFPQyxPQUFQLEdBQWlCN0IsZUFBakIiLCJmaWxlIjoiRml4ZWRTdHJpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxuY29uc3QgRml4ZWRTdHJpbmdFZGl0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIHByb3BUeXBlczoge1xuICAgICAgICBtdWx0aWxpbmU6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgICAgICBtdWx0aXBsZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgdHlwZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICB2YWx1ZTogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoXG4gICAgICAgICAgICAgICAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICAgICAgICAgICAgKSxcbiAgICAgICAgXSkuaXNSZXF1aXJlZCxcbiAgICAgICAgdmFsdWVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihcbiAgICAgICAgICAgIFJlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgICAgICAgaWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgICAgICAgICBuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgICAgICB9KVxuICAgICAgICApLFxuICAgIH0sXG5cbiAgICBnZXRWYWx1ZSh2YWx1ZSkge1xuICAgICAgICBpZiAoIXRoaXMucHJvcHMudmFsdWVzKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IG1hcCBvZiB0aGlzLnByb3BzLnZhbHVlcykge1xuICAgICAgICAgICAgaWYgKG1hcC5pZCA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFwLm5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSxcblxuICAgIHJlbmRlclZhbHVlKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IHRoaXMuZ2V0VmFsdWUodmFsdWUpO1xuXG4gICAgICAgIGlmICh0aGlzLnByb3BzLm11bHRpbGluZSkge1xuICAgICAgICAgICAgcmV0dXJuIDx0ZXh0YXJlYVxuICAgICAgICAgICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17ZGVmYXVsdFZhbHVlfVxuICAgICAgICAgICAgLz47XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gPGlucHV0XG4gICAgICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXtkZWZhdWx0VmFsdWV9XG4gICAgICAgIC8+O1xuICAgIH0sXG5cbiAgICByZW5kZXJWYWx1ZXModmFsdWVzKSB7XG4gICAgICAgIHJldHVybiA8c3Bhbj5cbiAgICAgICAgICAgIHt2YWx1ZXMubWFwKCh2YWx1ZSwgaSkgPT4gPHNwYW4ga2V5PXtpfT5cbiAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJWYWx1ZSh2YWx1ZSl9XG4gICAgICAgICAgICAgICAge3ZhbHVlcy5sZW5ndGggLSAxID09PSBpID8gXCJcIiA6IFwiLCBcIn1cbiAgICAgICAgICAgIDwvc3Bhbj4pfVxuICAgICAgICA8L3NwYW4+O1xuICAgIH0sXG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLnZhbHVlcyAmJiB0aGlzLnByb3BzLnZhbHVlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBBcnJheS5pc0FycmF5KHRoaXMucHJvcHMudmFsdWUpID9cbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnZhbHVlLm1hcCgodmFsdWUpID0+IHRoaXMuZ2V0VmFsdWUodmFsdWUpKSA6XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRWYWx1ZSh0aGlzLnByb3BzLnZhbHVlKTtcblxuICAgICAgICAgICAgcmV0dXJuIDxzZWxlY3RcbiAgICAgICAgICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sIHNlbGVjdDItc2VsZWN0XCJcbiAgICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU9e3ZhbHVlc31cbiAgICAgICAgICAgICAgICBtdWx0aXBsZT17dGhpcy5wcm9wcy5tdWx0aXBsZX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy52YWx1ZXMubWFwKCh2YWx1ZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17dmFsdWUuaWR9IGtleT17dmFsdWUuaWR9PlxuICAgICAgICAgICAgICAgICAgICAgICAge3ZhbHVlLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L3NlbGVjdD47XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh0aGlzLnByb3BzLnZhbHVlKSA/XG4gICAgICAgICAgICB0aGlzLnJlbmRlclZhbHVlcyh0aGlzLnByb3BzLnZhbHVlKSA6XG4gICAgICAgICAgICB0aGlzLnJlbmRlclZhbHVlKHRoaXMucHJvcHMudmFsdWUpO1xuICAgIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaXhlZFN0cmluZ0VkaXQ7XG4iXX0=