"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = require("react");

var NameView = React.createClass({
    displayName: "NameView",

    propTypes: {
        name: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
        value: React.PropTypes.arrayOf(React.PropTypes.shape({
            _id: React.PropTypes.string.isRequired,
            name: React.PropTypes.string.isRequired,
            pseudonym: React.PropTypes.string
        })).isRequired
    },

    renderPseudonym: function renderPseudonym(name) {
        if (!name.pseudoynm || name.name === name.pseudoynm) {
            return null;
        }

        var searchURL = require("../../../logic/shared/search-url");
        var pseudoURL = searchURL(this.props, {
            filter: name.pseudonym,
            type: this.props.type
        });

        return React.createElement(
            "span",
            null,
            " ",
            "(",
            React.createElement(
                "a",
                { href: pseudoURL },
                name.pseudonym
            ),
            ")"
        );
    },
    renderName: function renderName(name) {
        var _searchURL;

        var searchURL = require("../../../logic/shared/search-url");
        var url = searchURL(this.props, (_searchURL = {}, _defineProperty(_searchURL, this.props.name, name.name), _defineProperty(_searchURL, "type", this.props.type), _searchURL));

        return React.createElement(
            "span",
            { key: name._id },
            React.createElement(
                "a",
                { href: url },
                name.name
            ),
            this.renderPseudonym(name)
        );
    },
    render: function render() {
        var _this = this;

        return React.createElement(
            "div",
            null,
            this.props.value.map(function (name) {
                return _this.renderName(name);
            })
        );
    }
});

module.exports = NameView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy92aWV3cy90eXBlcy92aWV3L05hbWUuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiTmFtZVZpZXciLCJjcmVhdGVDbGFzcyIsInByb3BUeXBlcyIsIm5hbWUiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwidHlwZSIsInZhbHVlIiwiYXJyYXlPZiIsInNoYXBlIiwiX2lkIiwicHNldWRvbnltIiwicmVuZGVyUHNldWRvbnltIiwicHNldWRveW5tIiwic2VhcmNoVVJMIiwicHNldWRvVVJMIiwicHJvcHMiLCJmaWx0ZXIiLCJyZW5kZXJOYW1lIiwidXJsIiwicmVuZGVyIiwibWFwIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQU1BLFFBQVFDLFFBQVEsT0FBUixDQUFkOztBQUVBLElBQU1DLFdBQVdGLE1BQU1HLFdBQU4sQ0FBa0I7QUFBQTs7QUFDL0JDLGVBQVc7QUFDUEMsY0FBTUwsTUFBTU0sU0FBTixDQUFnQkMsTUFBaEIsQ0FBdUJDLFVBRHRCO0FBRVBDLGNBQU1ULE1BQU1NLFNBQU4sQ0FBZ0JDLE1BQWhCLENBQXVCQyxVQUZ0QjtBQUdQRSxlQUFPVixNQUFNTSxTQUFOLENBQWdCSyxPQUFoQixDQUNIWCxNQUFNTSxTQUFOLENBQWdCTSxLQUFoQixDQUFzQjtBQUNsQkMsaUJBQUtiLE1BQU1NLFNBQU4sQ0FBZ0JDLE1BQWhCLENBQXVCQyxVQURWO0FBRWxCSCxrQkFBTUwsTUFBTU0sU0FBTixDQUFnQkMsTUFBaEIsQ0FBdUJDLFVBRlg7QUFHbEJNLHVCQUFXZCxNQUFNTSxTQUFOLENBQWdCQztBQUhULFNBQXRCLENBREcsRUFNTEM7QUFUSyxLQURvQjs7QUFhL0JPLG1CQWIrQiwyQkFhZlYsSUFiZSxFQWFUO0FBQ2xCLFlBQUksQ0FBQ0EsS0FBS1csU0FBTixJQUFtQlgsS0FBS0EsSUFBTCxLQUFjQSxLQUFLVyxTQUExQyxFQUFxRDtBQUNqRCxtQkFBTyxJQUFQO0FBQ0g7O0FBRUQsWUFBTUMsWUFBWWhCLFFBQVEsa0NBQVIsQ0FBbEI7QUFDQSxZQUFNaUIsWUFBWUQsVUFBVSxLQUFLRSxLQUFmLEVBQXNCO0FBQ3BDQyxvQkFBUWYsS0FBS1MsU0FEdUI7QUFFcENMLGtCQUFNLEtBQUtVLEtBQUwsQ0FBV1Y7QUFGbUIsU0FBdEIsQ0FBbEI7O0FBS0EsZUFBTztBQUFBO0FBQUE7QUFDRixlQURFO0FBQUE7QUFDRztBQUFBO0FBQUEsa0JBQUcsTUFBTVMsU0FBVDtBQUFxQmIscUJBQUtTO0FBQTFCLGFBREg7QUFBQTtBQUFBLFNBQVA7QUFHSCxLQTNCOEI7QUE2Qi9CTyxjQTdCK0Isc0JBNkJwQmhCLElBN0JvQixFQTZCZDtBQUFBOztBQUNiLFlBQU1ZLFlBQVloQixRQUFRLGtDQUFSLENBQWxCO0FBQ0EsWUFBTXFCLE1BQU1MLFVBQVUsS0FBS0UsS0FBZixnREFDUCxLQUFLQSxLQUFMLENBQVdkLElBREosRUFDV0EsS0FBS0EsSUFEaEIsdUNBRUYsS0FBS2MsS0FBTCxDQUFXVixJQUZULGVBQVo7O0FBS0EsZUFBTztBQUFBO0FBQUEsY0FBTSxLQUFLSixLQUFLUSxHQUFoQjtBQUNIO0FBQUE7QUFBQSxrQkFBRyxNQUFNUyxHQUFUO0FBQWVqQixxQkFBS0E7QUFBcEIsYUFERztBQUVGLGlCQUFLVSxlQUFMLENBQXFCVixJQUFyQjtBQUZFLFNBQVA7QUFJSCxLQXhDOEI7QUEwQy9Ca0IsVUExQytCLG9CQTBDdEI7QUFBQTs7QUFDTCxlQUFPO0FBQUE7QUFBQTtBQUNGLGlCQUFLSixLQUFMLENBQVdULEtBQVgsQ0FBaUJjLEdBQWpCLENBQXFCLFVBQUNuQixJQUFEO0FBQUEsdUJBQVUsTUFBS2dCLFVBQUwsQ0FBZ0JoQixJQUFoQixDQUFWO0FBQUEsYUFBckI7QUFERSxTQUFQO0FBR0g7QUE5QzhCLENBQWxCLENBQWpCOztBQWlEQW9CLE9BQU9DLE9BQVAsR0FBaUJ4QixRQUFqQiIsImZpbGUiOiJOYW1lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cbmNvbnN0IE5hbWVWaWV3ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIHByb3BUeXBlczoge1xuICAgICAgICBuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIHR5cGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgdmFsdWU6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFxuICAgICAgICAgICAgUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgICAgICAgICBfaWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgICAgICAgICBuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgICAgICAgICAgcHNldWRvbnltOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgKS5pc1JlcXVpcmVkLFxuICAgIH0sXG5cbiAgICByZW5kZXJQc2V1ZG9ueW0obmFtZSkge1xuICAgICAgICBpZiAoIW5hbWUucHNldWRveW5tIHx8IG5hbWUubmFtZSA9PT0gbmFtZS5wc2V1ZG95bm0pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2VhcmNoVVJMID0gcmVxdWlyZShcIi4uLy4uLy4uL2xvZ2ljL3NoYXJlZC9zZWFyY2gtdXJsXCIpO1xuICAgICAgICBjb25zdCBwc2V1ZG9VUkwgPSBzZWFyY2hVUkwodGhpcy5wcm9wcywge1xuICAgICAgICAgICAgZmlsdGVyOiBuYW1lLnBzZXVkb255bSxcbiAgICAgICAgICAgIHR5cGU6IHRoaXMucHJvcHMudHlwZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIDxzcGFuPlxuICAgICAgICAgICAge1wiIFwifSg8YSBocmVmPXtwc2V1ZG9VUkx9PntuYW1lLnBzZXVkb255bX08L2E+KVxuICAgICAgICA8L3NwYW4+O1xuICAgIH0sXG5cbiAgICByZW5kZXJOYW1lKG5hbWUpIHtcbiAgICAgICAgY29uc3Qgc2VhcmNoVVJMID0gcmVxdWlyZShcIi4uLy4uLy4uL2xvZ2ljL3NoYXJlZC9zZWFyY2gtdXJsXCIpO1xuICAgICAgICBjb25zdCB1cmwgPSBzZWFyY2hVUkwodGhpcy5wcm9wcywge1xuICAgICAgICAgICAgW3RoaXMucHJvcHMubmFtZV06IG5hbWUubmFtZSxcbiAgICAgICAgICAgIHR5cGU6IHRoaXMucHJvcHMudHlwZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIDxzcGFuIGtleT17bmFtZS5faWR9PlxuICAgICAgICAgICAgPGEgaHJlZj17dXJsfT57bmFtZS5uYW1lfTwvYT5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlclBzZXVkb255bShuYW1lKX1cbiAgICAgICAgPC9zcGFuPjtcbiAgICB9LFxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gPGRpdj5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLnZhbHVlLm1hcCgobmFtZSkgPT4gdGhpcy5yZW5kZXJOYW1lKG5hbWUpKX1cbiAgICAgICAgPC9kaXY+O1xuICAgIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBOYW1lVmlldztcbiJdfQ==