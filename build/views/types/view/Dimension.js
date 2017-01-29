"use strict";

var React = require("react");
var pd = require("parse-dimensions");

var DimensionView = React.createClass({
    displayName: "DimensionView",

    propTypes: {
        defaultUnit: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        value: React.PropTypes.arrayOf(React.PropTypes.shape({
            _id: React.PropTypes.string.isRequired,
            height: React.PropTypes.number,
            width: React.PropTypes.number,
            unit: React.PropTypes.string
        })).isRequired
    },

    getDimension: function getDimension(item) {
        var label = item.label;
        var dimension = pd.convertDimension(item, this.props.defaultUnit);
        var unit = dimension.unit;
        return [dimension.width, unit, " x ", dimension.height, unit, label ? " (" + label + ")" : ""].join("");
    },
    renderDimension: function renderDimension(dimension) {
        return React.createElement(
            "span",
            { key: dimension._id },
            this.getDimension(dimension),
            React.createElement("br", null)
        );
    },
    render: function render() {
        var _this = this;

        return React.createElement(
            "span",
            null,
            this.props.value.map(function (dimension) {
                return _this.renderDimension(dimension);
            })
        );
    }
});

module.exports = DimensionView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy92aWV3cy90eXBlcy92aWV3L0RpbWVuc2lvbi5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsInJlcXVpcmUiLCJwZCIsIkRpbWVuc2lvblZpZXciLCJjcmVhdGVDbGFzcyIsInByb3BUeXBlcyIsImRlZmF1bHRVbml0IiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIm5hbWUiLCJ2YWx1ZSIsImFycmF5T2YiLCJzaGFwZSIsIl9pZCIsImhlaWdodCIsIm51bWJlciIsIndpZHRoIiwidW5pdCIsImdldERpbWVuc2lvbiIsIml0ZW0iLCJsYWJlbCIsImRpbWVuc2lvbiIsImNvbnZlcnREaW1lbnNpb24iLCJwcm9wcyIsImpvaW4iLCJyZW5kZXJEaW1lbnNpb24iLCJyZW5kZXIiLCJtYXAiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFFBQVFDLFFBQVEsT0FBUixDQUFkO0FBQ0EsSUFBTUMsS0FBS0QsUUFBUSxrQkFBUixDQUFYOztBQUVBLElBQU1FLGdCQUFnQkgsTUFBTUksV0FBTixDQUFrQjtBQUFBOztBQUNwQ0MsZUFBVztBQUNQQyxxQkFBYU4sTUFBTU8sU0FBTixDQUFnQkMsTUFBaEIsQ0FBdUJDLFVBRDdCO0FBRVBDLGNBQU1WLE1BQU1PLFNBQU4sQ0FBZ0JDLE1BQWhCLENBQXVCQyxVQUZ0QjtBQUdQRSxlQUFPWCxNQUFNTyxTQUFOLENBQWdCSyxPQUFoQixDQUNIWixNQUFNTyxTQUFOLENBQWdCTSxLQUFoQixDQUFzQjtBQUNsQkMsaUJBQUtkLE1BQU1PLFNBQU4sQ0FBZ0JDLE1BQWhCLENBQXVCQyxVQURWO0FBRWxCTSxvQkFBUWYsTUFBTU8sU0FBTixDQUFnQlMsTUFGTjtBQUdsQkMsbUJBQU9qQixNQUFNTyxTQUFOLENBQWdCUyxNQUhMO0FBSWxCRSxrQkFBTWxCLE1BQU1PLFNBQU4sQ0FBZ0JDO0FBSkosU0FBdEIsQ0FERyxFQU9MQztBQVZLLEtBRHlCOztBQWNwQ1UsZ0JBZG9DLHdCQWN2QkMsSUFkdUIsRUFjakI7QUFDZixZQUFNQyxRQUFRRCxLQUFLQyxLQUFuQjtBQUNBLFlBQU1DLFlBQVlwQixHQUFHcUIsZ0JBQUgsQ0FBb0JILElBQXBCLEVBQTBCLEtBQUtJLEtBQUwsQ0FBV2xCLFdBQXJDLENBQWxCO0FBQ0EsWUFBTVksT0FBT0ksVUFBVUosSUFBdkI7QUFDQSxlQUFPLENBQUNJLFVBQVVMLEtBQVgsRUFBa0JDLElBQWxCLEVBQXdCLEtBQXhCLEVBQStCSSxVQUFVUCxNQUF6QyxFQUFpREcsSUFBakQsRUFDSEcsZUFBYUEsS0FBYixTQUF3QixFQURyQixFQUN5QkksSUFEekIsQ0FDOEIsRUFEOUIsQ0FBUDtBQUVILEtBcEJtQztBQXNCcENDLG1CQXRCb0MsMkJBc0JwQkosU0F0Qm9CLEVBc0JUO0FBQ3ZCLGVBQU87QUFBQTtBQUFBLGNBQU0sS0FBS0EsVUFBVVIsR0FBckI7QUFDRixpQkFBS0ssWUFBTCxDQUFrQkcsU0FBbEIsQ0FERTtBQUMyQjtBQUQzQixTQUFQO0FBR0gsS0ExQm1DO0FBNEJwQ0ssVUE1Qm9DLG9CQTRCM0I7QUFBQTs7QUFDTCxlQUFPO0FBQUE7QUFBQTtBQUNGLGlCQUFLSCxLQUFMLENBQVdiLEtBQVgsQ0FBaUJpQixHQUFqQixDQUFxQixVQUFDTixTQUFEO0FBQUEsdUJBQ2xCLE1BQUtJLGVBQUwsQ0FBcUJKLFNBQXJCLENBRGtCO0FBQUEsYUFBckI7QUFERSxTQUFQO0FBSUg7QUFqQ21DLENBQWxCLENBQXRCOztBQW9DQU8sT0FBT0MsT0FBUCxHQUFpQjNCLGFBQWpCIiwiZmlsZSI6IkRpbWVuc2lvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuY29uc3QgcGQgPSByZXF1aXJlKFwicGFyc2UtZGltZW5zaW9uc1wiKTtcblxuY29uc3QgRGltZW5zaW9uVmlldyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgZGVmYXVsdFVuaXQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgbmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICB2YWx1ZTogUmVhY3QuUHJvcFR5cGVzLmFycmF5T2YoXG4gICAgICAgICAgICBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICAgICAgICAgIF9pZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICAgICAgICAgIGhlaWdodDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgICAgICAgICB3aWR0aDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgICAgICAgICB1bml0OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgKS5pc1JlcXVpcmVkLFxuICAgIH0sXG5cbiAgICBnZXREaW1lbnNpb24oaXRlbSkge1xuICAgICAgICBjb25zdCBsYWJlbCA9IGl0ZW0ubGFiZWw7XG4gICAgICAgIGNvbnN0IGRpbWVuc2lvbiA9IHBkLmNvbnZlcnREaW1lbnNpb24oaXRlbSwgdGhpcy5wcm9wcy5kZWZhdWx0VW5pdCk7XG4gICAgICAgIGNvbnN0IHVuaXQgPSBkaW1lbnNpb24udW5pdDtcbiAgICAgICAgcmV0dXJuIFtkaW1lbnNpb24ud2lkdGgsIHVuaXQsIFwiIHggXCIsIGRpbWVuc2lvbi5oZWlnaHQsIHVuaXQsXG4gICAgICAgICAgICBsYWJlbCA/IGAgKCR7bGFiZWx9KWAgOiBcIlwiXS5qb2luKFwiXCIpO1xuICAgIH0sXG5cbiAgICByZW5kZXJEaW1lbnNpb24oZGltZW5zaW9uKSB7XG4gICAgICAgIHJldHVybiA8c3BhbiBrZXk9e2RpbWVuc2lvbi5faWR9PlxuICAgICAgICAgICAge3RoaXMuZ2V0RGltZW5zaW9uKGRpbWVuc2lvbil9PGJyLz5cbiAgICAgICAgPC9zcGFuPjtcbiAgICB9LFxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gPHNwYW4+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy52YWx1ZS5tYXAoKGRpbWVuc2lvbikgPT5cbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckRpbWVuc2lvbihkaW1lbnNpb24pKX1cbiAgICAgICAgPC9zcGFuPjtcbiAgICB9LFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGltZW5zaW9uVmlldztcbiJdfQ==