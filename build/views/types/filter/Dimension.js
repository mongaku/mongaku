"use strict";

var React = require("react");

var DimensionFilter = React.createClass({
    displayName: "DimensionFilter",

    propTypes: {
        heightTitle: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        placeholder: React.PropTypes.shape({
            max: React.PropTypes.number,
            min: React.PropTypes.number
        }),
        searchName: React.PropTypes.string,
        value: React.PropTypes.shape({
            heightMin: React.PropTypes.number,
            heightMax: React.PropTypes.number,
            widthMax: React.PropTypes.number,
            widthMin: React.PropTypes.number
        }),
        widthTitle: React.PropTypes.string.isRequired
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
            { className: "row" },
            React.createElement(
                "div",
                { className: "form-group col-xs-6 col-sm-12 col-lg-6" },
                React.createElement(
                    "label",
                    { htmlFor: searchName + ".widthMin",
                        className: "control-label"
                    },
                    this.props.widthTitle
                ),
                React.createElement(
                    "div",
                    { className: "form-inline" },
                    React.createElement("input", { type: "text", name: searchName + ".widthMin",
                        defaultValue: this.props.value.widthMin,
                        placeholder: this.props.placeholder.min,
                        className: "form-control size-control"
                    }),
                    "\u2014",
                    React.createElement("input", { type: "text", name: searchName + ".widthMax",
                        defaultValue: this.props.value.widthMax,
                        placeholder: this.props.placeholder.max,
                        className: "form-control size-control"
                    })
                )
            ),
            React.createElement(
                "div",
                { className: "form-group col-xs-6 col-sm-12 col-lg-6" },
                React.createElement(
                    "label",
                    { htmlFor: searchName + ".heightMin",
                        className: "control-label"
                    },
                    this.props.heightTitle
                ),
                React.createElement(
                    "div",
                    { className: "form-inline" },
                    React.createElement("input", { type: "text", name: searchName + ".heightMin",
                        defaultValue: this.props.value.heightMin,
                        placeholder: this.props.placeholder.min,
                        className: "form-control size-control"
                    }),
                    "\u2014",
                    React.createElement("input", { type: "text", name: searchName + ".heightMax",
                        defaultValue: this.props.value.heightMax,
                        placeholder: this.props.placeholder.max,
                        className: "form-control size-control"
                    })
                )
            )
        );
    }
});

module.exports = DimensionFilter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy92aWV3cy90eXBlcy9maWx0ZXIvRGltZW5zaW9uLmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwicmVxdWlyZSIsIkRpbWVuc2lvbkZpbHRlciIsImNyZWF0ZUNsYXNzIiwicHJvcFR5cGVzIiwiaGVpZ2h0VGl0bGUiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwibmFtZSIsInBsYWNlaG9sZGVyIiwic2hhcGUiLCJtYXgiLCJudW1iZXIiLCJtaW4iLCJzZWFyY2hOYW1lIiwidmFsdWUiLCJoZWlnaHRNaW4iLCJoZWlnaHRNYXgiLCJ3aWR0aE1heCIsIndpZHRoTWluIiwid2lkdGhUaXRsZSIsImdldERlZmF1bHRQcm9wcyIsInJlbmRlciIsInByb3BzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxRQUFRQyxRQUFRLE9BQVIsQ0FBZDs7QUFFQSxJQUFNQyxrQkFBa0JGLE1BQU1HLFdBQU4sQ0FBa0I7QUFBQTs7QUFDdENDLGVBQVc7QUFDUEMscUJBQWFMLE1BQU1NLFNBQU4sQ0FBZ0JDLE1BQWhCLENBQXVCQyxVQUQ3QjtBQUVQQyxjQUFNVCxNQUFNTSxTQUFOLENBQWdCQyxNQUFoQixDQUF1QkMsVUFGdEI7QUFHUEUscUJBQWFWLE1BQU1NLFNBQU4sQ0FBZ0JLLEtBQWhCLENBQXNCO0FBQy9CQyxpQkFBS1osTUFBTU0sU0FBTixDQUFnQk8sTUFEVTtBQUUvQkMsaUJBQUtkLE1BQU1NLFNBQU4sQ0FBZ0JPO0FBRlUsU0FBdEIsQ0FITjtBQU9QRSxvQkFBWWYsTUFBTU0sU0FBTixDQUFnQkMsTUFQckI7QUFRUFMsZUFBT2hCLE1BQU1NLFNBQU4sQ0FBZ0JLLEtBQWhCLENBQXNCO0FBQ3pCTSx1QkFBV2pCLE1BQU1NLFNBQU4sQ0FBZ0JPLE1BREY7QUFFekJLLHVCQUFXbEIsTUFBTU0sU0FBTixDQUFnQk8sTUFGRjtBQUd6Qk0sc0JBQVVuQixNQUFNTSxTQUFOLENBQWdCTyxNQUhEO0FBSXpCTyxzQkFBVXBCLE1BQU1NLFNBQU4sQ0FBZ0JPO0FBSkQsU0FBdEIsQ0FSQTtBQWNQUSxvQkFBWXJCLE1BQU1NLFNBQU4sQ0FBZ0JDLE1BQWhCLENBQXVCQztBQWQ1QixLQUQyQjs7QUFrQnRDYyxtQkFsQnNDLDZCQWtCcEI7QUFDZCxlQUFPO0FBQ0haLHlCQUFhLEVBRFY7QUFFSE0sbUJBQU87QUFGSixTQUFQO0FBSUgsS0F2QnFDO0FBeUJ0Q08sVUF6QnNDLG9CQXlCN0I7QUFDTCxZQUFNUixhQUFhLEtBQUtTLEtBQUwsQ0FBV1QsVUFBWCxJQUF5QixLQUFLUyxLQUFMLENBQVdmLElBQXZEOztBQUVBLGVBQU87QUFBQTtBQUFBLGNBQUssV0FBVSxLQUFmO0FBQ0g7QUFBQTtBQUFBLGtCQUFLLFdBQVUsd0NBQWY7QUFDSTtBQUFBO0FBQUEsc0JBQU8sU0FBWU0sVUFBWixjQUFQO0FBQ0ksbUNBQVU7QUFEZDtBQUdLLHlCQUFLUyxLQUFMLENBQVdIO0FBSGhCLGlCQURKO0FBTUk7QUFBQTtBQUFBLHNCQUFLLFdBQVUsYUFBZjtBQUNJLG1EQUFPLE1BQUssTUFBWixFQUFtQixNQUFTTixVQUFULGNBQW5CO0FBQ0ksc0NBQWMsS0FBS1MsS0FBTCxDQUFXUixLQUFYLENBQWlCSSxRQURuQztBQUVJLHFDQUFhLEtBQUtJLEtBQUwsQ0FBV2QsV0FBWCxDQUF1QkksR0FGeEM7QUFHSSxtQ0FBVTtBQUhkLHNCQURKO0FBQUE7QUFPSSxtREFBTyxNQUFLLE1BQVosRUFBbUIsTUFBU0MsVUFBVCxjQUFuQjtBQUNJLHNDQUFjLEtBQUtTLEtBQUwsQ0FBV1IsS0FBWCxDQUFpQkcsUUFEbkM7QUFFSSxxQ0FBYSxLQUFLSyxLQUFMLENBQVdkLFdBQVgsQ0FBdUJFLEdBRnhDO0FBR0ksbUNBQVU7QUFIZDtBQVBKO0FBTkosYUFERztBQXFCSDtBQUFBO0FBQUEsa0JBQUssV0FBVSx3Q0FBZjtBQUNJO0FBQUE7QUFBQSxzQkFBTyxTQUFZRyxVQUFaLGVBQVA7QUFDSSxtQ0FBVTtBQURkO0FBR0sseUJBQUtTLEtBQUwsQ0FBV25CO0FBSGhCLGlCQURKO0FBTUk7QUFBQTtBQUFBLHNCQUFLLFdBQVUsYUFBZjtBQUNJLG1EQUFPLE1BQUssTUFBWixFQUFtQixNQUFTVSxVQUFULGVBQW5CO0FBQ0ksc0NBQWMsS0FBS1MsS0FBTCxDQUFXUixLQUFYLENBQWlCQyxTQURuQztBQUVJLHFDQUFhLEtBQUtPLEtBQUwsQ0FBV2QsV0FBWCxDQUF1QkksR0FGeEM7QUFHSSxtQ0FBVTtBQUhkLHNCQURKO0FBQUE7QUFPSSxtREFBTyxNQUFLLE1BQVosRUFBbUIsTUFBU0MsVUFBVCxlQUFuQjtBQUNJLHNDQUFjLEtBQUtTLEtBQUwsQ0FBV1IsS0FBWCxDQUFpQkUsU0FEbkM7QUFFSSxxQ0FBYSxLQUFLTSxLQUFMLENBQVdkLFdBQVgsQ0FBdUJFLEdBRnhDO0FBR0ksbUNBQVU7QUFIZDtBQVBKO0FBTko7QUFyQkcsU0FBUDtBQTBDSDtBQXRFcUMsQ0FBbEIsQ0FBeEI7O0FBeUVBYSxPQUFPQyxPQUFQLEdBQWlCeEIsZUFBakIiLCJmaWxlIjoiRGltZW5zaW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cbmNvbnN0IERpbWVuc2lvbkZpbHRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgaGVpZ2h0VGl0bGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgbmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgICBwbGFjZWhvbGRlcjogUmVhY3QuUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgICAgICAgIG1heDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgICAgIG1pbjogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgfSksXG4gICAgICAgIHNlYXJjaE5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgICAgICAgaGVpZ2h0TWluOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgICAgICAgICAgaGVpZ2h0TWF4OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgICAgICAgICAgd2lkdGhNYXg6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gICAgICAgICAgICB3aWR0aE1pbjogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgfSksXG4gICAgICAgIHdpZHRoVGl0bGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICB9LFxuXG4gICAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGxhY2Vob2xkZXI6IHt9LFxuICAgICAgICAgICAgdmFsdWU6IHt9LFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHNlYXJjaE5hbWUgPSB0aGlzLnByb3BzLnNlYXJjaE5hbWUgfHwgdGhpcy5wcm9wcy5uYW1lO1xuXG4gICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwIGNvbC14cy02IGNvbC1zbS0xMiBjb2wtbGctNlwiPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPXtgJHtzZWFyY2hOYW1lfS53aWR0aE1pbmB9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNvbnRyb2wtbGFiZWxcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMud2lkdGhUaXRsZX1cbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1pbmxpbmVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT17YCR7c2VhcmNoTmFtZX0ud2lkdGhNaW5gfVxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLnByb3BzLnZhbHVlLndpZHRoTWlufVxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3RoaXMucHJvcHMucGxhY2Vob2xkZXIubWlufVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sIHNpemUtY29udHJvbFwiXG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICZtZGFzaDtcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT17YCR7c2VhcmNoTmFtZX0ud2lkdGhNYXhgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLnByb3BzLnZhbHVlLndpZHRoTWF4fVxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3RoaXMucHJvcHMucGxhY2Vob2xkZXIubWF4fVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sIHNpemUtY29udHJvbFwiXG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cCBjb2wteHMtNiBjb2wtc20tMTIgY29sLWxnLTZcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj17YCR7c2VhcmNoTmFtZX0uaGVpZ2h0TWluYH1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY29udHJvbC1sYWJlbFwiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5oZWlnaHRUaXRsZX1cbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1pbmxpbmVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT17YCR7c2VhcmNoTmFtZX0uaGVpZ2h0TWluYH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dGhpcy5wcm9wcy52YWx1ZS5oZWlnaHRNaW59XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17dGhpcy5wcm9wcy5wbGFjZWhvbGRlci5taW59XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2wgc2l6ZS1jb250cm9sXCJcbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgJm1kYXNoO1xuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPXtgJHtzZWFyY2hOYW1lfS5oZWlnaHRNYXhgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLnByb3BzLnZhbHVlLmhlaWdodE1heH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0aGlzLnByb3BzLnBsYWNlaG9sZGVyLm1heH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbCBzaXplLWNvbnRyb2xcIlxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PjtcbiAgICB9LFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGltZW5zaW9uRmlsdGVyO1xuIl19