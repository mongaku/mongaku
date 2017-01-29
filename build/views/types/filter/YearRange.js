"use strict";

var React = require("react");

var dateRangeType = React.PropTypes.shape({
    end: React.PropTypes.number,
    start: React.PropTypes.number
});

var YearRangeFilter = React.createClass({
    displayName: "YearRangeFilter",

    propTypes: {
        name: React.PropTypes.string.isRequired,
        placeholder: dateRangeType,
        searchName: React.PropTypes.string,
        title: React.PropTypes.string.isRequired,
        value: dateRangeType
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
            { className: "form-group" },
            React.createElement(
                "label",
                { htmlFor: searchName + ".start", className: "control-label" },
                this.props.title
            ),
            React.createElement(
                "div",
                { className: "form-inline" },
                React.createElement("input", { type: "text", name: searchName + ".start",
                    defaultValue: this.props.value.start,
                    placeholder: this.props.placeholder.start,
                    className: "form-control date-control"
                }),
                "\u2014",
                React.createElement("input", { type: "text", name: searchName + ".end",
                    defaultValue: this.props.value.end,
                    placeholder: this.props.placeholder.end,
                    className: "form-control date-control"
                })
            )
        );
    }
});

module.exports = YearRangeFilter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy92aWV3cy90eXBlcy9maWx0ZXIvWWVhclJhbmdlLmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwicmVxdWlyZSIsImRhdGVSYW5nZVR5cGUiLCJQcm9wVHlwZXMiLCJzaGFwZSIsImVuZCIsIm51bWJlciIsInN0YXJ0IiwiWWVhclJhbmdlRmlsdGVyIiwiY3JlYXRlQ2xhc3MiLCJwcm9wVHlwZXMiLCJuYW1lIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsInBsYWNlaG9sZGVyIiwic2VhcmNoTmFtZSIsInRpdGxlIiwidmFsdWUiLCJnZXREZWZhdWx0UHJvcHMiLCJyZW5kZXIiLCJwcm9wcyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsUUFBUUMsUUFBUSxPQUFSLENBQWQ7O0FBRUEsSUFBTUMsZ0JBQWdCRixNQUFNRyxTQUFOLENBQWdCQyxLQUFoQixDQUFzQjtBQUN4Q0MsU0FBS0wsTUFBTUcsU0FBTixDQUFnQkcsTUFEbUI7QUFFeENDLFdBQU9QLE1BQU1HLFNBQU4sQ0FBZ0JHO0FBRmlCLENBQXRCLENBQXRCOztBQUtBLElBQU1FLGtCQUFrQlIsTUFBTVMsV0FBTixDQUFrQjtBQUFBOztBQUN0Q0MsZUFBVztBQUNQQyxjQUFNWCxNQUFNRyxTQUFOLENBQWdCUyxNQUFoQixDQUF1QkMsVUFEdEI7QUFFUEMscUJBQWFaLGFBRk47QUFHUGEsb0JBQVlmLE1BQU1HLFNBQU4sQ0FBZ0JTLE1BSHJCO0FBSVBJLGVBQU9oQixNQUFNRyxTQUFOLENBQWdCUyxNQUFoQixDQUF1QkMsVUFKdkI7QUFLUEksZUFBT2Y7QUFMQSxLQUQyQjs7QUFTdENnQixtQkFUc0MsNkJBU3BCO0FBQ2QsZUFBTztBQUNISix5QkFBYSxFQURWO0FBRUhHLG1CQUFPO0FBRkosU0FBUDtBQUlILEtBZHFDO0FBZ0J0Q0UsVUFoQnNDLG9CQWdCN0I7QUFDTCxZQUFNSixhQUFhLEtBQUtLLEtBQUwsQ0FBV0wsVUFBWCxJQUF5QixLQUFLSyxLQUFMLENBQVdULElBQXZEOztBQUVBLGVBQU87QUFBQTtBQUFBLGNBQUssV0FBVSxZQUFmO0FBQ0g7QUFBQTtBQUFBLGtCQUFPLFNBQVlJLFVBQVosV0FBUCxFQUF1QyxXQUFVLGVBQWpEO0FBQ0sscUJBQUtLLEtBQUwsQ0FBV0o7QUFEaEIsYUFERztBQUlIO0FBQUE7QUFBQSxrQkFBSyxXQUFVLGFBQWY7QUFDSSwrQ0FBTyxNQUFLLE1BQVosRUFBbUIsTUFBU0QsVUFBVCxXQUFuQjtBQUNJLGtDQUFjLEtBQUtLLEtBQUwsQ0FBV0gsS0FBWCxDQUFpQlYsS0FEbkM7QUFFSSxpQ0FBYSxLQUFLYSxLQUFMLENBQVdOLFdBQVgsQ0FBdUJQLEtBRnhDO0FBR0ksK0JBQVU7QUFIZCxrQkFESjtBQUFBO0FBT0ksK0NBQU8sTUFBSyxNQUFaLEVBQW1CLE1BQVNRLFVBQVQsU0FBbkI7QUFDSSxrQ0FBYyxLQUFLSyxLQUFMLENBQVdILEtBQVgsQ0FBaUJaLEdBRG5DO0FBRUksaUNBQWEsS0FBS2UsS0FBTCxDQUFXTixXQUFYLENBQXVCVCxHQUZ4QztBQUdJLCtCQUFVO0FBSGQ7QUFQSjtBQUpHLFNBQVA7QUFrQkg7QUFyQ3FDLENBQWxCLENBQXhCOztBQXdDQWdCLE9BQU9DLE9BQVAsR0FBaUJkLGVBQWpCIiwiZmlsZSI6IlllYXJSYW5nZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG5jb25zdCBkYXRlUmFuZ2VUeXBlID0gUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHtcbiAgICBlbmQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gICAgc3RhcnQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG59KTtcblxuY29uc3QgWWVhclJhbmdlRmlsdGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIHByb3BUeXBlczoge1xuICAgICAgICBuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIHBsYWNlaG9sZGVyOiBkYXRlUmFuZ2VUeXBlLFxuICAgICAgICBzZWFyY2hOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB0aXRsZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICB2YWx1ZTogZGF0ZVJhbmdlVHlwZSxcbiAgICB9LFxuXG4gICAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGxhY2Vob2xkZXI6IHt9LFxuICAgICAgICAgICAgdmFsdWU6IHt9LFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHNlYXJjaE5hbWUgPSB0aGlzLnByb3BzLnNlYXJjaE5hbWUgfHwgdGhpcy5wcm9wcy5uYW1lO1xuXG4gICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPXtgJHtzZWFyY2hOYW1lfS5zdGFydGB9IGNsYXNzTmFtZT1cImNvbnRyb2wtbGFiZWxcIj5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy50aXRsZX1cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0taW5saW5lXCI+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT17YCR7c2VhcmNoTmFtZX0uc3RhcnRgfVxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU9e3RoaXMucHJvcHMudmFsdWUuc3RhcnR9XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0aGlzLnByb3BzLnBsYWNlaG9sZGVyLnN0YXJ0fVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2wgZGF0ZS1jb250cm9sXCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICZtZGFzaDtcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPXtgJHtzZWFyY2hOYW1lfS5lbmRgfVxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU9e3RoaXMucHJvcHMudmFsdWUuZW5kfVxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17dGhpcy5wcm9wcy5wbGFjZWhvbGRlci5lbmR9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbCBkYXRlLWNvbnRyb2xcIlxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+O1xuICAgIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBZZWFyUmFuZ2VGaWx0ZXI7XG4iXX0=