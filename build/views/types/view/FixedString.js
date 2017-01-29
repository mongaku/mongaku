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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy92aWV3cy90eXBlcy92aWV3L0ZpeGVkU3RyaW5nLmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwicmVxdWlyZSIsIkZpeGVkU3RyaW5nVmlldyIsImNyZWF0ZUNsYXNzIiwicHJvcFR5cGVzIiwibmFtZSIsIlByb3BUeXBlcyIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJ0eXBlIiwidmFsdWUiLCJvbmVPZlR5cGUiLCJhcnJheU9mIiwidmFsdWVzIiwic2hhcGUiLCJpZCIsImdldFRpdGxlIiwicHJvcHMiLCJtYXAiLCJyZW5kZXJWYWx1ZSIsInNlYXJjaFVSTCIsInRpdGxlIiwidXJsIiwicmVuZGVyVmFsdWVzIiwiaSIsImxlbmd0aCIsInJlbmRlciIsIkFycmF5IiwiaXNBcnJheSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFNQSxRQUFRQyxRQUFRLE9BQVIsQ0FBZDs7QUFFQSxJQUFNQyxrQkFBa0JGLE1BQU1HLFdBQU4sQ0FBa0I7QUFBQTs7QUFDdENDLGVBQVc7QUFDUEMsY0FBTUwsTUFBTU0sU0FBTixDQUFnQkMsTUFBaEIsQ0FBdUJDLFVBRHRCO0FBRVBDLGNBQU1ULE1BQU1NLFNBQU4sQ0FBZ0JDLE1BQWhCLENBQXVCQyxVQUZ0QjtBQUdQRSxlQUFPVixNQUFNTSxTQUFOLENBQWdCSyxTQUFoQixDQUEwQixDQUM3QlgsTUFBTU0sU0FBTixDQUFnQkMsTUFEYSxFQUU3QlAsTUFBTU0sU0FBTixDQUFnQk0sT0FBaEIsQ0FDSVosTUFBTU0sU0FBTixDQUFnQkMsTUFEcEIsQ0FGNkIsQ0FBMUIsRUFLSkMsVUFSSTtBQVNQSyxnQkFBUWIsTUFBTU0sU0FBTixDQUFnQk0sT0FBaEIsQ0FDSlosTUFBTU0sU0FBTixDQUFnQlEsS0FBaEIsQ0FBc0I7QUFDbEJDLGdCQUFJZixNQUFNTSxTQUFOLENBQWdCQyxNQUFoQixDQUF1QkMsVUFEVDtBQUVsQkgsa0JBQU1MLE1BQU1NLFNBQU4sQ0FBZ0JDLE1BQWhCLENBQXVCQztBQUZYLFNBQXRCLENBREk7QUFURCxLQUQyQjs7QUFrQnRDUSxZQWxCc0Msb0JBa0I3Qk4sS0FsQjZCLEVBa0J0QjtBQUNaLFlBQUksQ0FBQyxLQUFLTyxLQUFMLENBQVdKLE1BQWhCLEVBQXdCO0FBQ3BCLG1CQUFPSCxLQUFQO0FBQ0g7O0FBSFc7QUFBQTtBQUFBOztBQUFBO0FBS1osaUNBQWtCLEtBQUtPLEtBQUwsQ0FBV0osTUFBN0IsOEhBQXFDO0FBQUEsb0JBQTFCSyxHQUEwQjs7QUFDakMsb0JBQUlBLElBQUlILEVBQUosS0FBV0wsS0FBZixFQUFzQjtBQUNsQiwyQkFBT1EsSUFBSWIsSUFBWDtBQUNIO0FBQ0o7QUFUVztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVdaLGVBQU9LLEtBQVA7QUFDSCxLQTlCcUM7QUFnQ3RDUyxlQWhDc0MsdUJBZ0MxQlQsS0FoQzBCLEVBZ0NuQjtBQUFBOztBQUNmLFlBQUksQ0FBQ0EsS0FBTCxFQUFZO0FBQ1IsbUJBQU8sSUFBUDtBQUNIOztBQUVELFlBQU1VLFlBQVluQixRQUFRLGtDQUFSLENBQWxCO0FBQ0EsWUFBTW9CLFFBQVEsS0FBS0wsUUFBTCxDQUFjTixLQUFkLENBQWQ7QUFDQSxZQUFNWSxNQUFNRixVQUFVLEtBQUtILEtBQWYsZ0RBQ1AsS0FBS0EsS0FBTCxDQUFXWixJQURKLEVBQ1dLLEtBRFgsdUNBRUYsS0FBS08sS0FBTCxDQUFXUixJQUZULGVBQVo7O0FBS0EsZUFBTztBQUFBO0FBQUEsY0FBRyxNQUFNYSxHQUFUO0FBQ0ZEO0FBREUsU0FBUDtBQUdILEtBL0NxQztBQWlEdENFLGdCQWpEc0Msd0JBaUR6QlYsTUFqRHlCLEVBaURqQjtBQUFBOztBQUNqQixlQUFPO0FBQUE7QUFBQTtBQUNGQSxtQkFBT0ssR0FBUCxDQUFXLFVBQUNSLEtBQUQsRUFBUWMsQ0FBUjtBQUFBLHVCQUFjO0FBQUE7QUFBQSxzQkFBTSxLQUFLQSxDQUFYO0FBQ3JCLDBCQUFLTCxXQUFMLENBQWlCVCxLQUFqQixDQURxQjtBQUVyQkcsMkJBQU9ZLE1BQVAsR0FBZ0IsQ0FBaEIsS0FBc0JELENBQXRCLEdBQTBCLEVBQTFCLEdBQStCO0FBRlYsaUJBQWQ7QUFBQSxhQUFYO0FBREUsU0FBUDtBQU1ILEtBeERxQztBQTBEdENFLFVBMURzQyxvQkEwRDdCO0FBQ0wsZUFBT0MsTUFBTUMsT0FBTixDQUFjLEtBQUtYLEtBQUwsQ0FBV1AsS0FBekIsSUFDSCxLQUFLYSxZQUFMLENBQWtCLEtBQUtOLEtBQUwsQ0FBV1AsS0FBN0IsQ0FERyxHQUVILEtBQUtTLFdBQUwsQ0FBaUIsS0FBS0YsS0FBTCxDQUFXUCxLQUE1QixDQUZKO0FBR0g7QUE5RHFDLENBQWxCLENBQXhCOztBQWlFQW1CLE9BQU9DLE9BQVAsR0FBaUI1QixlQUFqQiIsImZpbGUiOiJGaXhlZFN0cmluZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG5jb25zdCBGaXhlZFN0cmluZ1ZpZXcgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgdHlwZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICB2YWx1ZTogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoXG4gICAgICAgICAgICAgICAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICAgICAgICAgICAgKSxcbiAgICAgICAgXSkuaXNSZXF1aXJlZCxcbiAgICAgICAgdmFsdWVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihcbiAgICAgICAgICAgIFJlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgICAgICAgaWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgICAgICAgICBuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgICAgICB9KVxuICAgICAgICApLFxuICAgIH0sXG5cbiAgICBnZXRUaXRsZSh2YWx1ZSkge1xuICAgICAgICBpZiAoIXRoaXMucHJvcHMudmFsdWVzKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IG1hcCBvZiB0aGlzLnByb3BzLnZhbHVlcykge1xuICAgICAgICAgICAgaWYgKG1hcC5pZCA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFwLm5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSxcblxuICAgIHJlbmRlclZhbHVlKHZhbHVlKSB7XG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2VhcmNoVVJMID0gcmVxdWlyZShcIi4uLy4uLy4uL2xvZ2ljL3NoYXJlZC9zZWFyY2gtdXJsXCIpO1xuICAgICAgICBjb25zdCB0aXRsZSA9IHRoaXMuZ2V0VGl0bGUodmFsdWUpO1xuICAgICAgICBjb25zdCB1cmwgPSBzZWFyY2hVUkwodGhpcy5wcm9wcywge1xuICAgICAgICAgICAgW3RoaXMucHJvcHMubmFtZV06IHZhbHVlLFxuICAgICAgICAgICAgdHlwZTogdGhpcy5wcm9wcy50eXBlLFxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gPGEgaHJlZj17dXJsfT5cbiAgICAgICAgICAgIHt0aXRsZX1cbiAgICAgICAgPC9hPjtcbiAgICB9LFxuXG4gICAgcmVuZGVyVmFsdWVzKHZhbHVlcykge1xuICAgICAgICByZXR1cm4gPHNwYW4+XG4gICAgICAgICAgICB7dmFsdWVzLm1hcCgodmFsdWUsIGkpID0+IDxzcGFuIGtleT17aX0+XG4gICAgICAgICAgICAgICAge3RoaXMucmVuZGVyVmFsdWUodmFsdWUpfVxuICAgICAgICAgICAgICAgIHt2YWx1ZXMubGVuZ3RoIC0gMSA9PT0gaSA/IFwiXCIgOiBcIiwgXCJ9XG4gICAgICAgICAgICA8L3NwYW4+KX1cbiAgICAgICAgPC9zcGFuPjtcbiAgICB9LFxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh0aGlzLnByb3BzLnZhbHVlKSA/XG4gICAgICAgICAgICB0aGlzLnJlbmRlclZhbHVlcyh0aGlzLnByb3BzLnZhbHVlKSA6XG4gICAgICAgICAgICB0aGlzLnJlbmRlclZhbHVlKHRoaXMucHJvcHMudmFsdWUpO1xuICAgIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaXhlZFN0cmluZ1ZpZXc7XG4iXX0=