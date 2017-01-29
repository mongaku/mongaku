"use strict";

var React = require("react");

var NameFilter = React.createClass({
    displayName: "NameFilter",

    propTypes: {
        name: React.PropTypes.string.isRequired,
        placeholder: React.PropTypes.string,
        searchName: React.PropTypes.string,
        title: React.PropTypes.string.isRequired,
        value: React.PropTypes.string,
        values: React.PropTypes.arrayOf(React.PropTypes.string)
    },

    render: function render() {
        var searchName = this.props.searchName || this.props.name;

        return React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
                "label",
                { htmlFor: searchName, className: "control-label" },
                this.props.title
            ),
            React.createElement(
                "select",
                { name: searchName, style: { width: "100%" },
                    className: "form-control select2-select",
                    defaultValue: this.props.value,
                    "data-placeholder": this.props.placeholder
                },
                React.createElement(
                    "option",
                    { value: "" },
                    this.props.placeholder
                ),
                this.props.values.map(function (name) {
                    return React.createElement(
                        "option",
                        { value: name, key: name },
                        name
                    );
                })
            )
        );
    }
});

module.exports = NameFilter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy92aWV3cy90eXBlcy9maWx0ZXIvTmFtZS5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsInJlcXVpcmUiLCJOYW1lRmlsdGVyIiwiY3JlYXRlQ2xhc3MiLCJwcm9wVHlwZXMiLCJuYW1lIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsInBsYWNlaG9sZGVyIiwic2VhcmNoTmFtZSIsInRpdGxlIiwidmFsdWUiLCJ2YWx1ZXMiLCJhcnJheU9mIiwicmVuZGVyIiwicHJvcHMiLCJ3aWR0aCIsIm1hcCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsUUFBUUMsUUFBUSxPQUFSLENBQWQ7O0FBRUEsSUFBTUMsYUFBYUYsTUFBTUcsV0FBTixDQUFrQjtBQUFBOztBQUNqQ0MsZUFBVztBQUNQQyxjQUFNTCxNQUFNTSxTQUFOLENBQWdCQyxNQUFoQixDQUF1QkMsVUFEdEI7QUFFUEMscUJBQWFULE1BQU1NLFNBQU4sQ0FBZ0JDLE1BRnRCO0FBR1BHLG9CQUFZVixNQUFNTSxTQUFOLENBQWdCQyxNQUhyQjtBQUlQSSxlQUFPWCxNQUFNTSxTQUFOLENBQWdCQyxNQUFoQixDQUF1QkMsVUFKdkI7QUFLUEksZUFBT1osTUFBTU0sU0FBTixDQUFnQkMsTUFMaEI7QUFNUE0sZ0JBQVFiLE1BQU1NLFNBQU4sQ0FBZ0JRLE9BQWhCLENBQXdCZCxNQUFNTSxTQUFOLENBQWdCQyxNQUF4QztBQU5ELEtBRHNCOztBQVVqQ1EsVUFWaUMsb0JBVXhCO0FBQ0wsWUFBTUwsYUFBYSxLQUFLTSxLQUFMLENBQVdOLFVBQVgsSUFBeUIsS0FBS00sS0FBTCxDQUFXWCxJQUF2RDs7QUFFQSxlQUFPO0FBQUE7QUFBQSxjQUFLLFdBQVUsWUFBZjtBQUNIO0FBQUE7QUFBQSxrQkFBTyxTQUFTSyxVQUFoQixFQUE0QixXQUFVLGVBQXRDO0FBQ0sscUJBQUtNLEtBQUwsQ0FBV0w7QUFEaEIsYUFERztBQUlIO0FBQUE7QUFBQSxrQkFBUSxNQUFNRCxVQUFkLEVBQTBCLE9BQU8sRUFBQ08sT0FBTyxNQUFSLEVBQWpDO0FBQ0ksK0JBQVUsNkJBRGQ7QUFFSSxrQ0FBYyxLQUFLRCxLQUFMLENBQVdKLEtBRjdCO0FBR0ksd0NBQWtCLEtBQUtJLEtBQUwsQ0FBV1A7QUFIakM7QUFLSTtBQUFBO0FBQUEsc0JBQVEsT0FBTSxFQUFkO0FBQWtCLHlCQUFLTyxLQUFMLENBQVdQO0FBQTdCLGlCQUxKO0FBTUsscUJBQUtPLEtBQUwsQ0FBV0gsTUFBWCxDQUFrQkssR0FBbEIsQ0FBc0IsVUFBQ2IsSUFBRDtBQUFBLDJCQUNuQjtBQUFBO0FBQUEsMEJBQVEsT0FBT0EsSUFBZixFQUFxQixLQUFLQSxJQUExQjtBQUNLQTtBQURMLHFCQURtQjtBQUFBLGlCQUF0QjtBQU5MO0FBSkcsU0FBUDtBQWlCSDtBQTlCZ0MsQ0FBbEIsQ0FBbkI7O0FBaUNBYyxPQUFPQyxPQUFQLEdBQWlCbEIsVUFBakIiLCJmaWxlIjoiTmFtZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG5jb25zdCBOYW1lRmlsdGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIHByb3BUeXBlczoge1xuICAgICAgICBuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIHBsYWNlaG9sZGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBzZWFyY2hOYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB0aXRsZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICB2YWx1ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgdmFsdWVzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nKSxcbiAgICB9LFxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCBzZWFyY2hOYW1lID0gdGhpcy5wcm9wcy5zZWFyY2hOYW1lIHx8IHRoaXMucHJvcHMubmFtZTtcblxuICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj17c2VhcmNoTmFtZX0gY2xhc3NOYW1lPVwiY29udHJvbC1sYWJlbFwiPlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLnRpdGxlfVxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDxzZWxlY3QgbmFtZT17c2VhcmNoTmFtZX0gc3R5bGU9e3t3aWR0aDogXCIxMDAlXCJ9fVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbCBzZWxlY3QyLXNlbGVjdFwiXG4gICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLnByb3BzLnZhbHVlfVxuICAgICAgICAgICAgICAgIGRhdGEtcGxhY2Vob2xkZXI9e3RoaXMucHJvcHMucGxhY2Vob2xkZXJ9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPnt0aGlzLnByb3BzLnBsYWNlaG9sZGVyfTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLnZhbHVlcy5tYXAoKG5hbWUpID0+XG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e25hbWV9IGtleT17bmFtZX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7bmFtZX1cbiAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICA8L2Rpdj47XG4gICAgfSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5hbWVGaWx0ZXI7XG4iXX0=