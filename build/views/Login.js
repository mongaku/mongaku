"use strict";

var React = require("react");

var Page = require("./Page.js");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

var _require = require("./Wrapper.js"),
    childContextTypes = _require.childContextTypes;

var Login = function Login(props, _ref) {
    var gettext = _ref.gettext,
        URL = _ref.URL;

    var title = gettext("Login");

    return React.createElement(
        Page,
        { title: title },
        React.createElement(
            "h1",
            null,
            title
        ),
        React.createElement(
            "form",
            { action: URL("/login"), method: "post" },
            React.createElement(
                "div",
                null,
                React.createElement(
                    "label",
                    { htmlFor: "email" },
                    gettext("Email Address:")
                ),
                " ",
                React.createElement("input", { type: "text", name: "email" })
            ),
            React.createElement(
                "div",
                null,
                React.createElement(
                    "label",
                    { htmlFor: "password" },
                    gettext("Password:")
                ),
                " ",
                React.createElement("input", { type: "password", name: "password" })
            ),
            React.createElement(
                "div",
                null,
                React.createElement("input", { type: "submit", value: title })
            )
        )
    );
};

Login.propTypes = {};
Login.contextTypes = childContextTypes;

module.exports = Login;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92aWV3cy9Mb2dpbi5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsInJlcXVpcmUiLCJQYWdlIiwiY2hpbGRDb250ZXh0VHlwZXMiLCJMb2dpbiIsInByb3BzIiwiZ2V0dGV4dCIsIlVSTCIsInRpdGxlIiwiY29udGV4dFR5cGVzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFFQSxJQUFNQSxRQUFRQyxRQUFRLE9BQVIsQ0FBZDs7QUFFQSxJQUFNQyxPQUFPRCxRQUFRLFdBQVIsQ0FBYjs7OztlQUc0QkEsUUFBUSxjQUFSLEM7SUFBckJFLGlCLFlBQUFBLGlCOztBQUVQLElBQU1DLFFBQVEsU0FBUkEsS0FBUSxDQUFDQyxLQUFELFFBQXdDO0FBQUEsUUFBM0JDLE9BQTJCLFFBQTNCQSxPQUEyQjtBQUFBLFFBQWxCQyxHQUFrQixRQUFsQkEsR0FBa0I7O0FBQ2xELFFBQU1DLFFBQVFGLFFBQVEsT0FBUixDQUFkOztBQUVBLFdBQU87QUFBQyxZQUFEO0FBQUEsVUFBTSxPQUFPRSxLQUFiO0FBQ0g7QUFBQTtBQUFBO0FBQUtBO0FBQUwsU0FERztBQUdIO0FBQUE7QUFBQSxjQUFNLFFBQVFELElBQUksUUFBSixDQUFkLEVBQTZCLFFBQU8sTUFBcEM7QUFDSTtBQUFBO0FBQUE7QUFDSTtBQUFBO0FBQUEsc0JBQU8sU0FBUSxPQUFmO0FBQXdCRCw0QkFBUSxnQkFBUjtBQUF4QixpQkFESjtBQUVLLG1CQUZMO0FBR0ksK0NBQU8sTUFBSyxNQUFaLEVBQW1CLE1BQUssT0FBeEI7QUFISixhQURKO0FBTUk7QUFBQTtBQUFBO0FBQ0k7QUFBQTtBQUFBLHNCQUFPLFNBQVEsVUFBZjtBQUEyQkEsNEJBQVEsV0FBUjtBQUEzQixpQkFESjtBQUVLLG1CQUZMO0FBR0ksK0NBQU8sTUFBSyxVQUFaLEVBQXVCLE1BQUssVUFBNUI7QUFISixhQU5KO0FBV0k7QUFBQTtBQUFBO0FBQ0ksK0NBQU8sTUFBSyxRQUFaLEVBQXFCLE9BQU9FLEtBQTVCO0FBREo7QUFYSjtBQUhHLEtBQVA7QUFtQkgsQ0F0QkQ7OztBQXdCQUosTUFBTUssWUFBTixHQUFxQk4saUJBQXJCOztBQUVBTyxPQUFPQyxPQUFQLEdBQWlCUCxLQUFqQiIsImZpbGUiOiJMb2dpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmNvbnN0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG5jb25zdCBQYWdlID0gcmVxdWlyZShcIi4vUGFnZS5qc1wiKTtcblxuaW1wb3J0IHR5cGUge0NvbnRleHR9IGZyb20gXCIuL3R5cGVzLmpzXCI7XG5jb25zdCB7Y2hpbGRDb250ZXh0VHlwZXN9ID0gcmVxdWlyZShcIi4vV3JhcHBlci5qc1wiKTtcblxuY29uc3QgTG9naW4gPSAocHJvcHM6IHt9LCB7Z2V0dGV4dCwgVVJMfTogQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IHRpdGxlID0gZ2V0dGV4dChcIkxvZ2luXCIpO1xuXG4gICAgcmV0dXJuIDxQYWdlIHRpdGxlPXt0aXRsZX0+XG4gICAgICAgIDxoMT57dGl0bGV9PC9oMT5cblxuICAgICAgICA8Zm9ybSBhY3Rpb249e1VSTChcIi9sb2dpblwiKX0gbWV0aG9kPVwicG9zdFwiPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImVtYWlsXCI+e2dldHRleHQoXCJFbWFpbCBBZGRyZXNzOlwiKX08L2xhYmVsPlxuICAgICAgICAgICAgICAgIHtcIiBcIn1cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZW1haWxcIi8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJwYXNzd29yZFwiPntnZXR0ZXh0KFwiUGFzc3dvcmQ6XCIpfTwvbGFiZWw+XG4gICAgICAgICAgICAgICAge1wiIFwifVxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicGFzc3dvcmRcIiBuYW1lPVwicGFzc3dvcmRcIi8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJzdWJtaXRcIiB2YWx1ZT17dGl0bGV9Lz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Zvcm0+XG4gICAgPC9QYWdlPjtcbn07XG5cbkxvZ2luLmNvbnRleHRUeXBlcyA9IGNoaWxkQ29udGV4dFR5cGVzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvZ2luO1xuIl19