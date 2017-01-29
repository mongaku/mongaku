"use strict";

var React = require("react");

var LocationFilter = React.createClass({
    displayName: "LocationFilter",

    propTypes: {
        name: React.PropTypes.string.isRequired,
        placeholder: React.PropTypes.string,
        searchName: React.PropTypes.string,
        title: React.PropTypes.string.isRequired,
        value: React.PropTypes.string
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
            React.createElement("input", { type: "text", name: searchName,
                placeholder: this.props.placeholder,
                defaultValue: this.props.value,
                className: "form-control"
            })
        );
    }
});

module.exports = LocationFilter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy92aWV3cy90eXBlcy9maWx0ZXIvTG9jYXRpb24uanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiTG9jYXRpb25GaWx0ZXIiLCJjcmVhdGVDbGFzcyIsInByb3BUeXBlcyIsIm5hbWUiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwicGxhY2Vob2xkZXIiLCJzZWFyY2hOYW1lIiwidGl0bGUiLCJ2YWx1ZSIsInJlbmRlciIsInByb3BzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxRQUFRQyxRQUFRLE9BQVIsQ0FBZDs7QUFFQSxJQUFNQyxpQkFBaUJGLE1BQU1HLFdBQU4sQ0FBa0I7QUFBQTs7QUFDckNDLGVBQVc7QUFDUEMsY0FBTUwsTUFBTU0sU0FBTixDQUFnQkMsTUFBaEIsQ0FBdUJDLFVBRHRCO0FBRVBDLHFCQUFhVCxNQUFNTSxTQUFOLENBQWdCQyxNQUZ0QjtBQUdQRyxvQkFBWVYsTUFBTU0sU0FBTixDQUFnQkMsTUFIckI7QUFJUEksZUFBT1gsTUFBTU0sU0FBTixDQUFnQkMsTUFBaEIsQ0FBdUJDLFVBSnZCO0FBS1BJLGVBQU9aLE1BQU1NLFNBQU4sQ0FBZ0JDO0FBTGhCLEtBRDBCOztBQVNyQ00sVUFUcUMsb0JBUzVCO0FBQ0wsWUFBTUgsYUFBYSxLQUFLSSxLQUFMLENBQVdKLFVBQVgsSUFBeUIsS0FBS0ksS0FBTCxDQUFXVCxJQUF2RDs7QUFFQSxlQUFPO0FBQUE7QUFBQSxjQUFLLFdBQVUsWUFBZjtBQUNIO0FBQUE7QUFBQSxrQkFBTyxTQUFTSyxVQUFoQixFQUE0QixXQUFVLGVBQXRDO0FBQ0sscUJBQUtJLEtBQUwsQ0FBV0g7QUFEaEIsYUFERztBQUlILDJDQUFPLE1BQUssTUFBWixFQUFtQixNQUFNRCxVQUF6QjtBQUNJLDZCQUFhLEtBQUtJLEtBQUwsQ0FBV0wsV0FENUI7QUFFSSw4QkFBYyxLQUFLSyxLQUFMLENBQVdGLEtBRjdCO0FBR0ksMkJBQVU7QUFIZDtBQUpHLFNBQVA7QUFVSDtBQXRCb0MsQ0FBbEIsQ0FBdkI7O0FBeUJBRyxPQUFPQyxPQUFQLEdBQWlCZCxjQUFqQiIsImZpbGUiOiJMb2NhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG5jb25zdCBMb2NhdGlvbkZpbHRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgbmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICBwbGFjZWhvbGRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgc2VhcmNoTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgdGl0bGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgdmFsdWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgfSxcblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3Qgc2VhcmNoTmFtZSA9IHRoaXMucHJvcHMuc2VhcmNoTmFtZSB8fCB0aGlzLnByb3BzLm5hbWU7XG5cbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9e3NlYXJjaE5hbWV9IGNsYXNzTmFtZT1cImNvbnRyb2wtbGFiZWxcIj5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy50aXRsZX1cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPXtzZWFyY2hOYW1lfVxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0aGlzLnByb3BzLnBsYWNlaG9sZGVyfVxuICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dGhpcy5wcm9wcy52YWx1ZX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+O1xuICAgIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2NhdGlvbkZpbHRlcjtcbiJdfQ==