"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = require("react");

var getDate = function getDate(item) {
    if (item.original) {
        return item.original;
    }

    if (item.start || item.end) {
        return (item.circa ? "ca. " : "") + item.start + (item.end && item.end !== item.start ? "-" + item.end : "");
    }

    return "";
};

var dateRangeType = React.PropTypes.shape({
    end: React.PropTypes.number,
    start: React.PropTypes.number
});

var YearRangeView = React.createClass({
    displayName: "YearRangeView",

    propTypes: {
        name: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
        value: React.PropTypes.arrayOf(dateRangeType).isRequired
    },

    renderDate: function renderDate(date) {
        var _searchURL;

        var searchURL = require("../../../logic/shared/search-url");

        var url = searchURL(this.props, (_searchURL = {}, _defineProperty(_searchURL, this.props.name, {
            start: date.start,
            end: date.end
        }), _defineProperty(_searchURL, "type", this.props.type), _searchURL));

        return React.createElement(
            "span",
            { key: date._id },
            React.createElement(
                "a",
                { href: url },
                getDate(date)
            ),
            React.createElement("br", null)
        );
    },
    render: function render() {
        var _this = this;

        return React.createElement(
            "span",
            null,
            this.props.value.map(function (date) {
                return _this.renderDate(date);
            })
        );
    }
});

module.exports = YearRangeView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy92aWV3cy90eXBlcy92aWV3L1llYXJSYW5nZS5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsInJlcXVpcmUiLCJnZXREYXRlIiwiaXRlbSIsIm9yaWdpbmFsIiwic3RhcnQiLCJlbmQiLCJjaXJjYSIsImRhdGVSYW5nZVR5cGUiLCJQcm9wVHlwZXMiLCJzaGFwZSIsIm51bWJlciIsIlllYXJSYW5nZVZpZXciLCJjcmVhdGVDbGFzcyIsInByb3BUeXBlcyIsIm5hbWUiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwidHlwZSIsInZhbHVlIiwiYXJyYXlPZiIsInJlbmRlckRhdGUiLCJkYXRlIiwic2VhcmNoVVJMIiwidXJsIiwicHJvcHMiLCJfaWQiLCJyZW5kZXIiLCJtYXAiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBTUEsUUFBUUMsUUFBUSxPQUFSLENBQWQ7O0FBRUEsSUFBTUMsVUFBVSxTQUFWQSxPQUFVLENBQUNDLElBQUQsRUFBVTtBQUN0QixRQUFJQSxLQUFLQyxRQUFULEVBQW1CO0FBQ2YsZUFBT0QsS0FBS0MsUUFBWjtBQUNIOztBQUVELFFBQUlELEtBQUtFLEtBQUwsSUFBY0YsS0FBS0csR0FBdkIsRUFBNEI7QUFDeEIsZUFBTyxDQUFDSCxLQUFLSSxLQUFMLEdBQWEsTUFBYixHQUFzQixFQUF2QixJQUNISixLQUFLRSxLQURGLElBQ1dGLEtBQUtHLEdBQUwsSUFBWUgsS0FBS0csR0FBTCxLQUFhSCxLQUFLRSxLQUE5QixTQUNWRixLQUFLRyxHQURLLEdBQ0csRUFGZCxDQUFQO0FBR0g7O0FBRUQsV0FBTyxFQUFQO0FBQ0gsQ0FaRDs7QUFjQSxJQUFNRSxnQkFBZ0JSLE1BQU1TLFNBQU4sQ0FBZ0JDLEtBQWhCLENBQXNCO0FBQ3hDSixTQUFLTixNQUFNUyxTQUFOLENBQWdCRSxNQURtQjtBQUV4Q04sV0FBT0wsTUFBTVMsU0FBTixDQUFnQkU7QUFGaUIsQ0FBdEIsQ0FBdEI7O0FBS0EsSUFBTUMsZ0JBQWdCWixNQUFNYSxXQUFOLENBQWtCO0FBQUE7O0FBQ3BDQyxlQUFXO0FBQ1BDLGNBQU1mLE1BQU1TLFNBQU4sQ0FBZ0JPLE1BQWhCLENBQXVCQyxVQUR0QjtBQUVQQyxjQUFNbEIsTUFBTVMsU0FBTixDQUFnQk8sTUFBaEIsQ0FBdUJDLFVBRnRCO0FBR1BFLGVBQU9uQixNQUFNUyxTQUFOLENBQWdCVyxPQUFoQixDQUNIWixhQURHLEVBRUxTO0FBTEssS0FEeUI7O0FBU3BDSSxjQVRvQyxzQkFTekJDLElBVHlCLEVBU25CO0FBQUE7O0FBQ2IsWUFBTUMsWUFBWXRCLFFBQVEsa0NBQVIsQ0FBbEI7O0FBRUEsWUFBTXVCLE1BQU1ELFVBQVUsS0FBS0UsS0FBZixnREFDUCxLQUFLQSxLQUFMLENBQVdWLElBREosRUFDVztBQUNmVixtQkFBT2lCLEtBQUtqQixLQURHO0FBRWZDLGlCQUFLZ0IsS0FBS2hCO0FBRkssU0FEWCx1Q0FLRixLQUFLbUIsS0FBTCxDQUFXUCxJQUxULGVBQVo7O0FBUUEsZUFBTztBQUFBO0FBQUEsY0FBTSxLQUFLSSxLQUFLSSxHQUFoQjtBQUNIO0FBQUE7QUFBQSxrQkFBRyxNQUFNRixHQUFUO0FBQ0t0Qix3QkFBUW9CLElBQVI7QUFETCxhQURHO0FBR0M7QUFIRCxTQUFQO0FBS0gsS0F6Qm1DO0FBMkJwQ0ssVUEzQm9DLG9CQTJCM0I7QUFBQTs7QUFDTCxlQUFPO0FBQUE7QUFBQTtBQUNGLGlCQUFLRixLQUFMLENBQVdOLEtBQVgsQ0FBaUJTLEdBQWpCLENBQXFCLFVBQUNOLElBQUQ7QUFBQSx1QkFBVSxNQUFLRCxVQUFMLENBQWdCQyxJQUFoQixDQUFWO0FBQUEsYUFBckI7QUFERSxTQUFQO0FBR0g7QUEvQm1DLENBQWxCLENBQXRCOztBQWtDQU8sT0FBT0MsT0FBUCxHQUFpQmxCLGFBQWpCIiwiZmlsZSI6IlllYXJSYW5nZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG5jb25zdCBnZXREYXRlID0gKGl0ZW0pID0+IHtcbiAgICBpZiAoaXRlbS5vcmlnaW5hbCkge1xuICAgICAgICByZXR1cm4gaXRlbS5vcmlnaW5hbDtcbiAgICB9XG5cbiAgICBpZiAoaXRlbS5zdGFydCB8fCBpdGVtLmVuZCkge1xuICAgICAgICByZXR1cm4gKGl0ZW0uY2lyY2EgPyBcImNhLiBcIiA6IFwiXCIpICtcbiAgICAgICAgICAgIGl0ZW0uc3RhcnQgKyAoaXRlbS5lbmQgJiYgaXRlbS5lbmQgIT09IGl0ZW0uc3RhcnQgP1xuICAgICAgICAgICAgYC0ke2l0ZW0uZW5kfWAgOiBcIlwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gXCJcIjtcbn07XG5cbmNvbnN0IGRhdGVSYW5nZVR5cGUgPSBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuICAgIGVuZDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICBzdGFydDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbn0pO1xuXG5jb25zdCBZZWFyUmFuZ2VWaWV3ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIHByb3BUeXBlczoge1xuICAgICAgICBuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIHR5cGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgdmFsdWU6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFxuICAgICAgICAgICAgZGF0ZVJhbmdlVHlwZVxuICAgICAgICApLmlzUmVxdWlyZWQsXG4gICAgfSxcblxuICAgIHJlbmRlckRhdGUoZGF0ZSkge1xuICAgICAgICBjb25zdCBzZWFyY2hVUkwgPSByZXF1aXJlKFwiLi4vLi4vLi4vbG9naWMvc2hhcmVkL3NlYXJjaC11cmxcIik7XG5cbiAgICAgICAgY29uc3QgdXJsID0gc2VhcmNoVVJMKHRoaXMucHJvcHMsIHtcbiAgICAgICAgICAgIFt0aGlzLnByb3BzLm5hbWVdOiB7XG4gICAgICAgICAgICAgICAgc3RhcnQ6IGRhdGUuc3RhcnQsXG4gICAgICAgICAgICAgICAgZW5kOiBkYXRlLmVuZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiB0aGlzLnByb3BzLnR5cGUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiA8c3BhbiBrZXk9e2RhdGUuX2lkfT5cbiAgICAgICAgICAgIDxhIGhyZWY9e3VybH0+XG4gICAgICAgICAgICAgICAge2dldERhdGUoZGF0ZSl9XG4gICAgICAgICAgICA8L2E+PGJyLz5cbiAgICAgICAgPC9zcGFuPjtcbiAgICB9LFxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gPHNwYW4+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy52YWx1ZS5tYXAoKGRhdGUpID0+IHRoaXMucmVuZGVyRGF0ZShkYXRlKSl9XG4gICAgICAgIDwvc3Bhbj47XG4gICAgfSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFllYXJSYW5nZVZpZXc7XG4iXX0=