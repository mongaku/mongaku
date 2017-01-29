"use strict";

var React = require("react");

var FixedStringFilter = React.createClass({
    displayName: "FixedStringFilter",

    propTypes: {
        multiple: React.PropTypes.bool,
        name: React.PropTypes.string.isRequired,
        placeholder: React.PropTypes.string,
        searchName: React.PropTypes.string,
        title: React.PropTypes.string.isRequired,
        value: React.PropTypes.string,
        values: React.PropTypes.arrayOf(React.PropTypes.shape({
            id: React.PropTypes.string.isRequired,
            name: React.PropTypes.string.isRequired
        }))
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
                    "data-placeholder": this.props.placeholder,
                    multiple: this.props.multiple
                },
                React.createElement(
                    "option",
                    { value: "" },
                    this.props.placeholder
                ),
                this.props.values.map(function (type) {
                    return React.createElement(
                        "option",
                        { value: type.id, key: type.id },
                        type.name
                    );
                })
            )
        );
    }
});

module.exports = FixedStringFilter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy92aWV3cy90eXBlcy9maWx0ZXIvRml4ZWRTdHJpbmcuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiRml4ZWRTdHJpbmdGaWx0ZXIiLCJjcmVhdGVDbGFzcyIsInByb3BUeXBlcyIsIm11bHRpcGxlIiwiUHJvcFR5cGVzIiwiYm9vbCIsIm5hbWUiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwicGxhY2Vob2xkZXIiLCJzZWFyY2hOYW1lIiwidGl0bGUiLCJ2YWx1ZSIsInZhbHVlcyIsImFycmF5T2YiLCJzaGFwZSIsImlkIiwicmVuZGVyIiwicHJvcHMiLCJ3aWR0aCIsIm1hcCIsInR5cGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFFBQVFDLFFBQVEsT0FBUixDQUFkOztBQUVBLElBQU1DLG9CQUFvQkYsTUFBTUcsV0FBTixDQUFrQjtBQUFBOztBQUN4Q0MsZUFBVztBQUNQQyxrQkFBVUwsTUFBTU0sU0FBTixDQUFnQkMsSUFEbkI7QUFFUEMsY0FBTVIsTUFBTU0sU0FBTixDQUFnQkcsTUFBaEIsQ0FBdUJDLFVBRnRCO0FBR1BDLHFCQUFhWCxNQUFNTSxTQUFOLENBQWdCRyxNQUh0QjtBQUlQRyxvQkFBWVosTUFBTU0sU0FBTixDQUFnQkcsTUFKckI7QUFLUEksZUFBT2IsTUFBTU0sU0FBTixDQUFnQkcsTUFBaEIsQ0FBdUJDLFVBTHZCO0FBTVBJLGVBQU9kLE1BQU1NLFNBQU4sQ0FBZ0JHLE1BTmhCO0FBT1BNLGdCQUFRZixNQUFNTSxTQUFOLENBQWdCVSxPQUFoQixDQUNKaEIsTUFBTU0sU0FBTixDQUFnQlcsS0FBaEIsQ0FBc0I7QUFDbEJDLGdCQUFJbEIsTUFBTU0sU0FBTixDQUFnQkcsTUFBaEIsQ0FBdUJDLFVBRFQ7QUFFbEJGLGtCQUFNUixNQUFNTSxTQUFOLENBQWdCRyxNQUFoQixDQUF1QkM7QUFGWCxTQUF0QixDQURJO0FBUEQsS0FENkI7O0FBZ0J4Q1MsVUFoQndDLG9CQWdCL0I7QUFDTCxZQUFNUCxhQUFhLEtBQUtRLEtBQUwsQ0FBV1IsVUFBWCxJQUF5QixLQUFLUSxLQUFMLENBQVdaLElBQXZEOztBQUVBLGVBQU87QUFBQTtBQUFBLGNBQUssV0FBVSxZQUFmO0FBQ0g7QUFBQTtBQUFBLGtCQUFPLFNBQVNJLFVBQWhCLEVBQTRCLFdBQVUsZUFBdEM7QUFDSyxxQkFBS1EsS0FBTCxDQUFXUDtBQURoQixhQURHO0FBSUg7QUFBQTtBQUFBLGtCQUFRLE1BQU1ELFVBQWQsRUFBMEIsT0FBTyxFQUFDUyxPQUFPLE1BQVIsRUFBakM7QUFDSSwrQkFBVSw2QkFEZDtBQUVJLGtDQUFjLEtBQUtELEtBQUwsQ0FBV04sS0FGN0I7QUFHSSx3Q0FBa0IsS0FBS00sS0FBTCxDQUFXVCxXQUhqQztBQUlJLDhCQUFVLEtBQUtTLEtBQUwsQ0FBV2Y7QUFKekI7QUFNSTtBQUFBO0FBQUEsc0JBQVEsT0FBTSxFQUFkO0FBQWtCLHlCQUFLZSxLQUFMLENBQVdUO0FBQTdCLGlCQU5KO0FBT0sscUJBQUtTLEtBQUwsQ0FBV0wsTUFBWCxDQUFrQk8sR0FBbEIsQ0FBc0IsVUFBQ0MsSUFBRDtBQUFBLDJCQUNuQjtBQUFBO0FBQUEsMEJBQVEsT0FBT0EsS0FBS0wsRUFBcEIsRUFBd0IsS0FBS0ssS0FBS0wsRUFBbEM7QUFDS0ssNkJBQUtmO0FBRFYscUJBRG1CO0FBQUEsaUJBQXRCO0FBUEw7QUFKRyxTQUFQO0FBa0JIO0FBckN1QyxDQUFsQixDQUExQjs7QUF3Q0FnQixPQUFPQyxPQUFQLEdBQWlCdkIsaUJBQWpCIiwiZmlsZSI6IkZpeGVkU3RyaW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cbmNvbnN0IEZpeGVkU3RyaW5nRmlsdGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIHByb3BUeXBlczoge1xuICAgICAgICBtdWx0aXBsZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgcGxhY2Vob2xkZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIHNlYXJjaE5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIHRpdGxlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB2YWx1ZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFxuICAgICAgICAgICAgUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgICAgICAgICBpZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICAgICAgICAgIG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICksXG4gICAgfSxcblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3Qgc2VhcmNoTmFtZSA9IHRoaXMucHJvcHMuc2VhcmNoTmFtZSB8fCB0aGlzLnByb3BzLm5hbWU7XG5cbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9e3NlYXJjaE5hbWV9IGNsYXNzTmFtZT1cImNvbnRyb2wtbGFiZWxcIj5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy50aXRsZX1cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8c2VsZWN0IG5hbWU9e3NlYXJjaE5hbWV9IHN0eWxlPXt7d2lkdGg6IFwiMTAwJVwifX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2wgc2VsZWN0Mi1zZWxlY3RcIlxuICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dGhpcy5wcm9wcy52YWx1ZX1cbiAgICAgICAgICAgICAgICBkYXRhLXBsYWNlaG9sZGVyPXt0aGlzLnByb3BzLnBsYWNlaG9sZGVyfVxuICAgICAgICAgICAgICAgIG11bHRpcGxlPXt0aGlzLnByb3BzLm11bHRpcGxlfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj57dGhpcy5wcm9wcy5wbGFjZWhvbGRlcn08L29wdGlvbj5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy52YWx1ZXMubWFwKCh0eXBlKSA9PlxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXt0eXBlLmlkfSBrZXk9e3R5cGUuaWR9PlxuICAgICAgICAgICAgICAgICAgICAgICAge3R5cGUubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICA8L2Rpdj47XG4gICAgfSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZpeGVkU3RyaW5nRmlsdGVyO1xuIl19