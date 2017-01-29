"use strict";

var React = require("react");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

var _require = require("./Wrapper.js"),
    childContextTypes = _require.childContextTypes;

var ImportResult = function ImportResult(props, _ref) {
    var URL = _ref.URL,
        format = _ref.format,
        gettext = _ref.gettext,
        stringNum = _ref.stringNum;
    var batch = props.batch,
        expanded = props.expanded,
        id = props.id,
        _props$numShow = props.numShow,
        numShow = _props$numShow === undefined ? 5 : _props$numShow,
        renderResult = props.renderResult,
        title = props.title;

    var allResults = batch.getFilteredResults()[id];
    var showAll = format(gettext("Show all %(count)s results..."), { count: stringNum(allResults.length) });
    var expandURL = URL(batch, { expanded: id });
    var isExpanded = expanded === id || allResults.length <= numShow;
    var results = expanded ? allResults : allResults.slice(0, numShow);

    if (results.length === 0) {
        return null;
    }

    return React.createElement(
        "div",
        { className: "panel panel-default" },
        React.createElement(
            "div",
            { className: "panel-heading" },
            React.createElement(
                "h3",
                { id: id, className: "panel-title" },
                title,
                " ",
                "(",
                stringNum(allResults.length),
                ")"
            )
        ),
        React.createElement(
            "div",
            { className: "panel-body" },
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "ul",
                    { className: "col-xs-12" },
                    results.map(renderResult)
                )
            ),
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-xs-12" },
                    !isExpanded && React.createElement(
                        "a",
                        { href: expandURL + "#" + id },
                        showAll
                    )
                )
            )
        )
    );
};

ImportResult.propTypes = {
    batch: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        error: require("react").PropTypes.string,
        getFilteredResults: require("react").PropTypes.func.isRequired,
        getURL: require("react").PropTypes.func.isRequired,
        modified: require("react").PropTypes.any.isRequired,
        state: require("react").PropTypes.string.isRequired
    }).isRequired,
    expanded: require("react").PropTypes.string,
    id: require("react").PropTypes.oneOf(["models", "unprocessed", "created", "changed", "deleted", "errors", "warnings"]).isRequired,
    numShow: require("react").PropTypes.number,
    renderResult: require("react").PropTypes.func.isRequired,
    title: require("react").PropTypes.string.isRequired
};
ImportResult.contextTypes = childContextTypes;

module.exports = ImportResult;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92aWV3cy9JbXBvcnRSZXN1bHQuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiY2hpbGRDb250ZXh0VHlwZXMiLCJJbXBvcnRSZXN1bHQiLCJwcm9wcyIsIlVSTCIsImZvcm1hdCIsImdldHRleHQiLCJzdHJpbmdOdW0iLCJiYXRjaCIsImV4cGFuZGVkIiwiaWQiLCJudW1TaG93IiwicmVuZGVyUmVzdWx0IiwidGl0bGUiLCJhbGxSZXN1bHRzIiwiZ2V0RmlsdGVyZWRSZXN1bHRzIiwic2hvd0FsbCIsImNvdW50IiwibGVuZ3RoIiwiZXhwYW5kVVJMIiwiaXNFeHBhbmRlZCIsInJlc3VsdHMiLCJzbGljZSIsIm1hcCIsImNvbnRleHRUeXBlcyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBRUEsSUFBTUEsUUFBUUMsUUFBUSxPQUFSLENBQWQ7Ozs7ZUFHNEJBLFFBQVEsY0FBUixDO0lBQXJCQyxpQixZQUFBQSxpQjs7QUErQlAsSUFBTUMsZUFBZSxTQUFmQSxZQUFlLENBQUNDLEtBQUQsUUFLTjtBQUFBLFFBSlhDLEdBSVcsUUFKWEEsR0FJVztBQUFBLFFBSFhDLE1BR1csUUFIWEEsTUFHVztBQUFBLFFBRlhDLE9BRVcsUUFGWEEsT0FFVztBQUFBLFFBRFhDLFNBQ1csUUFEWEEsU0FDVztBQUFBLFFBRVBDLEtBRk8sR0FRUEwsS0FSTyxDQUVQSyxLQUZPO0FBQUEsUUFHUEMsUUFITyxHQVFQTixLQVJPLENBR1BNLFFBSE87QUFBQSxRQUlQQyxFQUpPLEdBUVBQLEtBUk8sQ0FJUE8sRUFKTztBQUFBLHlCQVFQUCxLQVJPLENBS1BRLE9BTE87QUFBQSxRQUtQQSxPQUxPLGtDQUtHLENBTEg7QUFBQSxRQU1QQyxZQU5PLEdBUVBULEtBUk8sQ0FNUFMsWUFOTztBQUFBLFFBT1BDLEtBUE8sR0FRUFYsS0FSTyxDQU9QVSxLQVBPOztBQVNYLFFBQU1DLGFBQWFOLE1BQU1PLGtCQUFOLEdBQTJCTCxFQUEzQixDQUFuQjtBQUNBLFFBQU1NLFVBQVVYLE9BQU9DLFFBQ25CLCtCQURtQixDQUFQLEVBRVosRUFBQ1csT0FBT1YsVUFBVU8sV0FBV0ksTUFBckIsQ0FBUixFQUZZLENBQWhCO0FBR0EsUUFBTUMsWUFBWWYsSUFBSUksS0FBSixFQUFXLEVBQUNDLFVBQVVDLEVBQVgsRUFBWCxDQUFsQjtBQUNBLFFBQU1VLGFBQWNYLGFBQWFDLEVBQWIsSUFBbUJJLFdBQVdJLE1BQVgsSUFBcUJQLE9BQTVEO0FBQ0EsUUFBTVUsVUFBVVosV0FBV0ssVUFBWCxHQUF3QkEsV0FBV1EsS0FBWCxDQUFpQixDQUFqQixFQUFvQlgsT0FBcEIsQ0FBeEM7O0FBRUEsUUFBSVUsUUFBUUgsTUFBUixLQUFtQixDQUF2QixFQUEwQjtBQUN0QixlQUFPLElBQVA7QUFDSDs7QUFFRCxXQUFPO0FBQUE7QUFBQSxVQUFLLFdBQVUscUJBQWY7QUFDSDtBQUFBO0FBQUEsY0FBSyxXQUFVLGVBQWY7QUFDSTtBQUFBO0FBQUEsa0JBQUksSUFBSVIsRUFBUixFQUFZLFdBQVUsYUFBdEI7QUFDS0cscUJBREw7QUFFSyxtQkFGTDtBQUFBO0FBR01OLDBCQUFVTyxXQUFXSSxNQUFyQixDQUhOO0FBQUE7QUFBQTtBQURKLFNBREc7QUFRSDtBQUFBO0FBQUEsY0FBSyxXQUFVLFlBQWY7QUFDSTtBQUFBO0FBQUEsa0JBQUssV0FBVSxLQUFmO0FBQ0k7QUFBQTtBQUFBLHNCQUFJLFdBQVUsV0FBZDtBQUNLRyw0QkFBUUUsR0FBUixDQUFZWCxZQUFaO0FBREw7QUFESixhQURKO0FBTUk7QUFBQTtBQUFBLGtCQUFLLFdBQVUsS0FBZjtBQUNJO0FBQUE7QUFBQSxzQkFBSyxXQUFVLFdBQWY7QUFDSyxxQkFBQ1EsVUFBRCxJQUNHO0FBQUE7QUFBQSwwQkFBRyxNQUFTRCxTQUFULFNBQXNCVCxFQUF6QjtBQUFnQ007QUFBaEM7QUFGUjtBQURKO0FBTko7QUFSRyxLQUFQO0FBc0JILENBaEREOzs7Ozs7Ozs7Ozs7Ozs7OztBQWtEQWQsYUFBYXNCLFlBQWIsR0FBNEJ2QixpQkFBNUI7O0FBRUF3QixPQUFPQyxPQUFQLEdBQWlCeEIsWUFBakIiLCJmaWxlIjoiSW1wb3J0UmVzdWx0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuY29uc3QgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cbmltcG9ydCB0eXBlIHtDb250ZXh0fSBmcm9tIFwiLi90eXBlcy5qc1wiO1xuY29uc3Qge2NoaWxkQ29udGV4dFR5cGVzfSA9IHJlcXVpcmUoXCIuL1dyYXBwZXIuanNcIik7XG5cbnR5cGUgSW1wb3J0ID0ge1xuICAgIF9pZDogc3RyaW5nLFxuICAgIGVycm9yPzogc3RyaW5nLFxuICAgIGdldEZpbHRlcmVkUmVzdWx0czogKCkgPT4gSW1wb3J0UmVzdWx0cyxcbiAgICBnZXRVUkw6IChsYW5nOiBzdHJpbmcpID0+IHN0cmluZyxcbiAgICBtb2RpZmllZDogRGF0ZSxcbiAgICBzdGF0ZTogc3RyaW5nLFxufTtcblxudHlwZSBJbXBvcnRSZXN1bHRzID0ge1xuICAgIG1vZGVsczogQXJyYXk8YW55PixcbiAgICB1bnByb2Nlc3NlZDogQXJyYXk8YW55PixcbiAgICBjcmVhdGVkOiBBcnJheTxhbnk+LFxuICAgIGNoYW5nZWQ6IEFycmF5PGFueT4sXG4gICAgZGVsZXRlZDogQXJyYXk8YW55PixcbiAgICBlcnJvcnM6IEFycmF5PGFueT4sXG4gICAgd2FybmluZ3M6IEFycmF5PGFueT4sXG59O1xuXG50eXBlIFByb3BzID0ge1xuICAgIGJhdGNoOiBJbXBvcnQsXG4gICAgZXhwYW5kZWQ/OiBzdHJpbmcsXG4gICAgaWQ6IFwibW9kZWxzXCIgfCBcInVucHJvY2Vzc2VkXCIgfCBcImNyZWF0ZWRcIiB8IFwiY2hhbmdlZFwiIHwgXCJkZWxldGVkXCIgfFxuICAgICAgICBcImVycm9yc1wiIHwgXCJ3YXJuaW5nc1wiLFxuICAgIG51bVNob3c/OiBudW1iZXIsXG4gICAgcmVuZGVyUmVzdWx0OiAocmVzdWx0OiBhbnksIGk6IG51bWJlcikgPT4gUmVhY3QuRWxlbWVudDwqPixcbiAgICB0aXRsZTogc3RyaW5nLFxufTtcblxuY29uc3QgSW1wb3J0UmVzdWx0ID0gKHByb3BzOiBQcm9wcywge1xuICAgIFVSTCxcbiAgICBmb3JtYXQsXG4gICAgZ2V0dGV4dCxcbiAgICBzdHJpbmdOdW0sXG59OiBDb250ZXh0KSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgICBiYXRjaCxcbiAgICAgICAgZXhwYW5kZWQsXG4gICAgICAgIGlkLFxuICAgICAgICBudW1TaG93ID0gNSxcbiAgICAgICAgcmVuZGVyUmVzdWx0LFxuICAgICAgICB0aXRsZSxcbiAgICB9ID0gcHJvcHM7XG4gICAgY29uc3QgYWxsUmVzdWx0cyA9IGJhdGNoLmdldEZpbHRlcmVkUmVzdWx0cygpW2lkXTtcbiAgICBjb25zdCBzaG93QWxsID0gZm9ybWF0KGdldHRleHQoXG4gICAgICAgIFwiU2hvdyBhbGwgJShjb3VudClzIHJlc3VsdHMuLi5cIiksXG4gICAgICAgIHtjb3VudDogc3RyaW5nTnVtKGFsbFJlc3VsdHMubGVuZ3RoKX0pO1xuICAgIGNvbnN0IGV4cGFuZFVSTCA9IFVSTChiYXRjaCwge2V4cGFuZGVkOiBpZH0pO1xuICAgIGNvbnN0IGlzRXhwYW5kZWQgPSAoZXhwYW5kZWQgPT09IGlkIHx8IGFsbFJlc3VsdHMubGVuZ3RoIDw9IG51bVNob3cpO1xuICAgIGNvbnN0IHJlc3VsdHMgPSBleHBhbmRlZCA/IGFsbFJlc3VsdHMgOiBhbGxSZXN1bHRzLnNsaWNlKDAsIG51bVNob3cpO1xuXG4gICAgaWYgKHJlc3VsdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCI+XG4gICAgICAgICAgICA8aDMgaWQ9e2lkfSBjbGFzc05hbWU9XCJwYW5lbC10aXRsZVwiPlxuICAgICAgICAgICAgICAgIHt0aXRsZX1cbiAgICAgICAgICAgICAgICB7XCIgXCJ9XG4gICAgICAgICAgICAgICAgKHtzdHJpbmdOdW0oYWxsUmVzdWx0cy5sZW5ndGgpfSlcbiAgICAgICAgICAgIDwvaDM+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWJvZHlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImNvbC14cy0xMlwiPlxuICAgICAgICAgICAgICAgICAgICB7cmVzdWx0cy5tYXAocmVuZGVyUmVzdWx0KX1cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgICAgICAgICAgIHshaXNFeHBhbmRlZCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj17YCR7ZXhwYW5kVVJMfSMke2lkfWB9PntzaG93QWxsfTwvYT59XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+O1xufTtcblxuSW1wb3J0UmVzdWx0LmNvbnRleHRUeXBlcyA9IGNoaWxkQ29udGV4dFR5cGVzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEltcG9ydFJlc3VsdDtcbiJdfQ==