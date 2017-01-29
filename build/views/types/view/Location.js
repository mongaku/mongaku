"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = require("react");

var LocationView = React.createClass({
    displayName: "LocationView",

    propTypes: {
        name: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
        value: React.PropTypes.arrayOf(React.PropTypes.shape({
            _id: React.PropTypes.string.isRequired,
            city: React.PropTypes.string,
            name: React.PropTypes.string
        })).isRequired
    },

    renderName: function renderName(location) {
        var _searchURL;

        var searchURL = require("../../../logic/shared/search-url");
        var url = searchURL(this.props, (_searchURL = {}, _defineProperty(_searchURL, this.props.name, location.name), _defineProperty(_searchURL, "type", this.props.type), _searchURL));

        return React.createElement(
            "span",
            null,
            React.createElement(
                "a",
                { href: url },
                location.name
            ),
            React.createElement("br", null)
        );
    },
    render: function render() {
        var _this = this;

        return React.createElement(
            "div",
            null,
            this.props.value.map(function (location) {
                return React.createElement(
                    "span",
                    { key: location._id },
                    location.name && _this.renderName(location),
                    location.city && React.createElement(
                        "span",
                        null,
                        location.city,
                        React.createElement("br", null)
                    )
                );
            })
        );
    }
});

module.exports = LocationView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy92aWV3cy90eXBlcy92aWV3L0xvY2F0aW9uLmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwicmVxdWlyZSIsIkxvY2F0aW9uVmlldyIsImNyZWF0ZUNsYXNzIiwicHJvcFR5cGVzIiwibmFtZSIsIlByb3BUeXBlcyIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJ0eXBlIiwidmFsdWUiLCJhcnJheU9mIiwic2hhcGUiLCJfaWQiLCJjaXR5IiwicmVuZGVyTmFtZSIsImxvY2F0aW9uIiwic2VhcmNoVVJMIiwidXJsIiwicHJvcHMiLCJyZW5kZXIiLCJtYXAiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBTUEsUUFBUUMsUUFBUSxPQUFSLENBQWQ7O0FBRUEsSUFBTUMsZUFBZUYsTUFBTUcsV0FBTixDQUFrQjtBQUFBOztBQUNuQ0MsZUFBVztBQUNQQyxjQUFNTCxNQUFNTSxTQUFOLENBQWdCQyxNQUFoQixDQUF1QkMsVUFEdEI7QUFFUEMsY0FBTVQsTUFBTU0sU0FBTixDQUFnQkMsTUFBaEIsQ0FBdUJDLFVBRnRCO0FBR1BFLGVBQU9WLE1BQU1NLFNBQU4sQ0FBZ0JLLE9BQWhCLENBQ0hYLE1BQU1NLFNBQU4sQ0FBZ0JNLEtBQWhCLENBQXNCO0FBQ2xCQyxpQkFBS2IsTUFBTU0sU0FBTixDQUFnQkMsTUFBaEIsQ0FBdUJDLFVBRFY7QUFFbEJNLGtCQUFNZCxNQUFNTSxTQUFOLENBQWdCQyxNQUZKO0FBR2xCRixrQkFBTUwsTUFBTU0sU0FBTixDQUFnQkM7QUFISixTQUF0QixDQURHLEVBTUxDO0FBVEssS0FEd0I7O0FBYW5DTyxjQWJtQyxzQkFheEJDLFFBYndCLEVBYWQ7QUFBQTs7QUFDakIsWUFBTUMsWUFBWWhCLFFBQVEsa0NBQVIsQ0FBbEI7QUFDQSxZQUFNaUIsTUFBTUQsVUFBVSxLQUFLRSxLQUFmLGdEQUNQLEtBQUtBLEtBQUwsQ0FBV2QsSUFESixFQUNXVyxTQUFTWCxJQURwQix1Q0FFRixLQUFLYyxLQUFMLENBQVdWLElBRlQsZUFBWjs7QUFLQSxlQUFPO0FBQUE7QUFBQTtBQUNIO0FBQUE7QUFBQSxrQkFBRyxNQUFNUyxHQUFUO0FBQWVGLHlCQUFTWDtBQUF4QixhQURHO0FBQzhCO0FBRDlCLFNBQVA7QUFHSCxLQXZCa0M7QUF5Qm5DZSxVQXpCbUMsb0JBeUIxQjtBQUFBOztBQUNMLGVBQU87QUFBQTtBQUFBO0FBQ0YsaUJBQUtELEtBQUwsQ0FBV1QsS0FBWCxDQUFpQlcsR0FBakIsQ0FBcUIsVUFBQ0wsUUFBRDtBQUFBLHVCQUFjO0FBQUE7QUFBQSxzQkFBTSxLQUFLQSxTQUFTSCxHQUFwQjtBQUMvQkcsNkJBQVNYLElBQVQsSUFBaUIsTUFBS1UsVUFBTCxDQUFnQkMsUUFBaEIsQ0FEYztBQUUvQkEsNkJBQVNGLElBQVQsSUFBaUI7QUFBQTtBQUFBO0FBQU9FLGlDQUFTRixJQUFoQjtBQUFxQjtBQUFyQjtBQUZjLGlCQUFkO0FBQUEsYUFBckI7QUFERSxTQUFQO0FBTUg7QUFoQ2tDLENBQWxCLENBQXJCOztBQW1DQVEsT0FBT0MsT0FBUCxHQUFpQnJCLFlBQWpCIiwiZmlsZSI6IkxvY2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cbmNvbnN0IExvY2F0aW9uVmlldyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgbmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICB0eXBlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihcbiAgICAgICAgICAgIFJlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgICAgICAgX2lkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgICAgICAgICAgY2l0eTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgICAgICAgICBuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgKS5pc1JlcXVpcmVkLFxuICAgIH0sXG5cbiAgICByZW5kZXJOYW1lKGxvY2F0aW9uKSB7XG4gICAgICAgIGNvbnN0IHNlYXJjaFVSTCA9IHJlcXVpcmUoXCIuLi8uLi8uLi9sb2dpYy9zaGFyZWQvc2VhcmNoLXVybFwiKTtcbiAgICAgICAgY29uc3QgdXJsID0gc2VhcmNoVVJMKHRoaXMucHJvcHMsIHtcbiAgICAgICAgICAgIFt0aGlzLnByb3BzLm5hbWVdOiBsb2NhdGlvbi5uYW1lLFxuICAgICAgICAgICAgdHlwZTogdGhpcy5wcm9wcy50eXBlLFxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gPHNwYW4+XG4gICAgICAgICAgICA8YSBocmVmPXt1cmx9Pntsb2NhdGlvbi5uYW1lfTwvYT48YnIvPlxuICAgICAgICA8L3NwYW4+O1xuICAgIH0sXG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiA8ZGl2PlxuICAgICAgICAgICAge3RoaXMucHJvcHMudmFsdWUubWFwKChsb2NhdGlvbikgPT4gPHNwYW4ga2V5PXtsb2NhdGlvbi5faWR9PlxuICAgICAgICAgICAgICAgIHtsb2NhdGlvbi5uYW1lICYmIHRoaXMucmVuZGVyTmFtZShsb2NhdGlvbil9XG4gICAgICAgICAgICAgICAge2xvY2F0aW9uLmNpdHkgJiYgPHNwYW4+e2xvY2F0aW9uLmNpdHl9PGJyLz48L3NwYW4+fVxuICAgICAgICAgICAgPC9zcGFuPil9XG4gICAgICAgIDwvZGl2PjtcbiAgICB9LFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTG9jYXRpb25WaWV3O1xuIl19