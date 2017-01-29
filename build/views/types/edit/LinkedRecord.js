"use strict";

var React = require("react");

var valueType = React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired
});

var LinkedRecordEdit = React.createClass({
    displayName: "LinkedRecordEdit",

    propTypes: {
        multiple: React.PropTypes.bool,
        name: React.PropTypes.string.isRequired,
        placeholder: React.PropTypes.string,
        recordType: React.PropTypes.string.isRequired,
        value: React.PropTypes.oneOfType([valueType, React.PropTypes.arrayOf(valueType)])
    },

    render: function render() {
        var value = this.props.value;
        var defaultValue = Array.isArray(value) ? value.map(function (value) {
            return value.id;
        }) : value && value.id;
        var values = Array.isArray(value) ? value : value ? [value] : [];

        return React.createElement(
            "select",
            {
                name: this.props.name,
                className: "form-control select2-remote",
                defaultValue: defaultValue,
                multiple: this.props.multiple,
                "data-record": this.props.recordType,
                "data-placeholder": this.props.placeholder
            },
            values.map(function (value) {
                return React.createElement(
                    "option",
                    { value: value.id, key: value.id },
                    value.title
                );
            })
        );
    }
});

module.exports = LinkedRecordEdit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy92aWV3cy90eXBlcy9lZGl0L0xpbmtlZFJlY29yZC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsInJlcXVpcmUiLCJ2YWx1ZVR5cGUiLCJQcm9wVHlwZXMiLCJzaGFwZSIsImlkIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsInRpdGxlIiwiTGlua2VkUmVjb3JkRWRpdCIsImNyZWF0ZUNsYXNzIiwicHJvcFR5cGVzIiwibXVsdGlwbGUiLCJib29sIiwibmFtZSIsInBsYWNlaG9sZGVyIiwicmVjb3JkVHlwZSIsInZhbHVlIiwib25lT2ZUeXBlIiwiYXJyYXlPZiIsInJlbmRlciIsInByb3BzIiwiZGVmYXVsdFZhbHVlIiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwidmFsdWVzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxRQUFRQyxRQUFRLE9BQVIsQ0FBZDs7QUFFQSxJQUFNQyxZQUFZRixNQUFNRyxTQUFOLENBQWdCQyxLQUFoQixDQUFzQjtBQUNwQ0MsUUFBSUwsTUFBTUcsU0FBTixDQUFnQkcsTUFBaEIsQ0FBdUJDLFVBRFM7QUFFcENDLFdBQU9SLE1BQU1HLFNBQU4sQ0FBZ0JHLE1BQWhCLENBQXVCQztBQUZNLENBQXRCLENBQWxCOztBQUtBLElBQU1FLG1CQUFtQlQsTUFBTVUsV0FBTixDQUFrQjtBQUFBOztBQUN2Q0MsZUFBVztBQUNQQyxrQkFBVVosTUFBTUcsU0FBTixDQUFnQlUsSUFEbkI7QUFFUEMsY0FBTWQsTUFBTUcsU0FBTixDQUFnQkcsTUFBaEIsQ0FBdUJDLFVBRnRCO0FBR1BRLHFCQUFhZixNQUFNRyxTQUFOLENBQWdCRyxNQUh0QjtBQUlQVSxvQkFBWWhCLE1BQU1HLFNBQU4sQ0FBZ0JHLE1BQWhCLENBQXVCQyxVQUo1QjtBQUtQVSxlQUFPakIsTUFBTUcsU0FBTixDQUFnQmUsU0FBaEIsQ0FBMEIsQ0FDN0JoQixTQUQ2QixFQUU3QkYsTUFBTUcsU0FBTixDQUFnQmdCLE9BQWhCLENBQXdCakIsU0FBeEIsQ0FGNkIsQ0FBMUI7QUFMQSxLQUQ0Qjs7QUFZdkNrQixVQVp1QyxvQkFZOUI7QUFDTCxZQUFNSCxRQUFRLEtBQUtJLEtBQUwsQ0FBV0osS0FBekI7QUFDQSxZQUFNSyxlQUFlQyxNQUFNQyxPQUFOLENBQWNQLEtBQWQsSUFDakJBLE1BQU1RLEdBQU4sQ0FBVSxVQUFDUixLQUFEO0FBQUEsbUJBQVdBLE1BQU1aLEVBQWpCO0FBQUEsU0FBVixDQURpQixHQUVqQlksU0FBU0EsTUFBTVosRUFGbkI7QUFHQSxZQUFNcUIsU0FBU0gsTUFBTUMsT0FBTixDQUFjUCxLQUFkLElBQ1hBLEtBRFcsR0FFWEEsUUFBUSxDQUFDQSxLQUFELENBQVIsR0FBa0IsRUFGdEI7O0FBSUEsZUFBTztBQUFBO0FBQUE7QUFDSCxzQkFBTSxLQUFLSSxLQUFMLENBQVdQLElBRGQ7QUFFSCwyQkFBVSw2QkFGUDtBQUdILDhCQUFjUSxZQUhYO0FBSUgsMEJBQVUsS0FBS0QsS0FBTCxDQUFXVCxRQUpsQjtBQUtILCtCQUFhLEtBQUtTLEtBQUwsQ0FBV0wsVUFMckI7QUFNSCxvQ0FBa0IsS0FBS0ssS0FBTCxDQUFXTjtBQU4xQjtBQVFGVyxtQkFBT0QsR0FBUCxDQUFXLFVBQUNSLEtBQUQ7QUFBQSx1QkFDUjtBQUFBO0FBQUEsc0JBQVEsT0FBT0EsTUFBTVosRUFBckIsRUFBeUIsS0FBS1ksTUFBTVosRUFBcEM7QUFDS1ksMEJBQU1UO0FBRFgsaUJBRFE7QUFBQSxhQUFYO0FBUkUsU0FBUDtBQWNIO0FBbkNzQyxDQUFsQixDQUF6Qjs7QUFzQ0FtQixPQUFPQyxPQUFQLEdBQWlCbkIsZ0JBQWpCIiwiZmlsZSI6IkxpbmtlZFJlY29yZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG5jb25zdCB2YWx1ZVR5cGUgPSBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuICAgIGlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgdGl0bGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbn0pO1xuXG5jb25zdCBMaW5rZWRSZWNvcmRFZGl0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIHByb3BUeXBlczoge1xuICAgICAgICBtdWx0aXBsZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgcGxhY2Vob2xkZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIHJlY29yZFR5cGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgdmFsdWU6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgICAgICAgICAgdmFsdWVUeXBlLFxuICAgICAgICAgICAgUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YodmFsdWVUeXBlKSxcbiAgICAgICAgXSksXG4gICAgfSxcblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnByb3BzLnZhbHVlO1xuICAgICAgICBjb25zdCBkZWZhdWx0VmFsdWUgPSBBcnJheS5pc0FycmF5KHZhbHVlKSA/XG4gICAgICAgICAgICB2YWx1ZS5tYXAoKHZhbHVlKSA9PiB2YWx1ZS5pZCkgOlxuICAgICAgICAgICAgdmFsdWUgJiYgdmFsdWUuaWQ7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IEFycmF5LmlzQXJyYXkodmFsdWUpID9cbiAgICAgICAgICAgIHZhbHVlIDpcbiAgICAgICAgICAgIHZhbHVlID8gW3ZhbHVlXSA6IFtdO1xuXG4gICAgICAgIHJldHVybiA8c2VsZWN0XG4gICAgICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2wgc2VsZWN0Mi1yZW1vdGVcIlxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXtkZWZhdWx0VmFsdWV9XG4gICAgICAgICAgICBtdWx0aXBsZT17dGhpcy5wcm9wcy5tdWx0aXBsZX1cbiAgICAgICAgICAgIGRhdGEtcmVjb3JkPXt0aGlzLnByb3BzLnJlY29yZFR5cGV9XG4gICAgICAgICAgICBkYXRhLXBsYWNlaG9sZGVyPXt0aGlzLnByb3BzLnBsYWNlaG9sZGVyfVxuICAgICAgICA+XG4gICAgICAgICAgICB7dmFsdWVzLm1hcCgodmFsdWUpID0+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17dmFsdWUuaWR9IGtleT17dmFsdWUuaWR9PlxuICAgICAgICAgICAgICAgICAgICB7dmFsdWUudGl0bGV9XG4gICAgICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgICApfVxuICAgICAgICA8L3NlbGVjdD47XG4gICAgfSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpbmtlZFJlY29yZEVkaXQ7XG4iXX0=