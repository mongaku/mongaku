"use strict";

var React = require("react");

var Page = require("./Page.js");

var Error = function Error(props) {
    var title = props.title;

    return React.createElement(
        Page,
        { title: title },
        React.createElement(
            "div",
            { className: "row" },
            React.createElement(
                "div",
                { className: "col-xs-12" },
                React.createElement(
                    "h1",
                    null,
                    props.title
                ),
                props.body && React.createElement(
                    "pre",
                    null,
                    props.body
                )
            )
        )
    );
};

Error.propTypes = {
    body: require("react").PropTypes.string,
    title: require("react").PropTypes.string.isRequired
};
module.exports = Error;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92aWV3cy9FcnJvci5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsInJlcXVpcmUiLCJQYWdlIiwiRXJyb3IiLCJwcm9wcyIsInRpdGxlIiwiYm9keSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBRUEsSUFBTUEsUUFBUUMsUUFBUSxPQUFSLENBQWQ7O0FBRUEsSUFBTUMsT0FBT0QsUUFBUSxXQUFSLENBQWI7O0FBRUEsSUFBTUUsUUFBUSxTQUFSQSxLQUFRLENBQUNDLEtBQUQsRUFHUjtBQUFBLFFBQ0tDLEtBREwsR0FDY0QsS0FEZCxDQUNLQyxLQURMOztBQUVGLFdBQU87QUFBQyxZQUFEO0FBQUEsVUFBTSxPQUFPQSxLQUFiO0FBQ0g7QUFBQTtBQUFBLGNBQUssV0FBVSxLQUFmO0FBQ0k7QUFBQTtBQUFBLGtCQUFLLFdBQVUsV0FBZjtBQUNJO0FBQUE7QUFBQTtBQUFLRCwwQkFBTUM7QUFBWCxpQkFESjtBQUVLRCxzQkFBTUUsSUFBTixJQUFjO0FBQUE7QUFBQTtBQUFNRiwwQkFBTUU7QUFBWjtBQUZuQjtBQURKO0FBREcsS0FBUDtBQVFILENBYkQ7Ozs7OztBQWVBQyxPQUFPQyxPQUFQLEdBQWlCTCxLQUFqQiIsImZpbGUiOiJFcnJvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmNvbnN0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG5jb25zdCBQYWdlID0gcmVxdWlyZShcIi4vUGFnZS5qc1wiKTtcblxuY29uc3QgRXJyb3IgPSAocHJvcHM6IHtcbiAgICBib2R5Pzogc3RyaW5nLFxuICAgIHRpdGxlOiBzdHJpbmcsXG59KSA9PiB7XG4gICAgY29uc3Qge3RpdGxlfSA9IHByb3BzO1xuICAgIHJldHVybiA8UGFnZSB0aXRsZT17dGl0bGV9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTJcIj5cbiAgICAgICAgICAgICAgICA8aDE+e3Byb3BzLnRpdGxlfTwvaDE+XG4gICAgICAgICAgICAgICAge3Byb3BzLmJvZHkgJiYgPHByZT57cHJvcHMuYm9keX08L3ByZT59XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9QYWdlPjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXJyb3I7XG4iXX0=