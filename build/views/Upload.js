"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react");

var Page = require("./Page.js");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

var _require = require("./Wrapper.js"),
    childContextTypes = _require.childContextTypes;

var UploadedImage = function UploadedImage(_ref, _ref2) {
    var image = _ref.image;
    var gettext = _ref2.gettext;

    var title = gettext("Uploaded Image");

    return React.createElement(
        "div",
        { className: "panel panel-default" },
        React.createElement(
            "div",
            { className: "panel-heading" },
            React.createElement(
                "strong",
                null,
                gettext("Uploaded Image")
            )
        ),
        React.createElement(
            "div",
            { className: "panel-body" },
            React.createElement(
                "a",
                { href: image.getOriginalURL() },
                React.createElement("img", { src: image.getScaledURL(),
                    alt: title,
                    title: title,
                    className: "img-responsive center-block"
                })
            )
        )
    );
};

UploadedImage.propTypes = {
    image: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getScaledURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired
    }).isRequired,
    similar: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        recordModel: require("react").PropTypes.shape({
            _id: require("react").PropTypes.string.isRequired,
            type: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired,
            images: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
                _id: require("react").PropTypes.string.isRequired,
                getOriginalURL: require("react").PropTypes.func.isRequired,
                getScaledURL: require("react").PropTypes.func.isRequired,
                getThumbURL: require("react").PropTypes.func.isRequired
            })).isRequired,
            getOriginalURL: require("react").PropTypes.func.isRequired,
            getThumbURL: require("react").PropTypes.func.isRequired,
            getTitle: require("react").PropTypes.func.isRequired,
            getSource: require("react").PropTypes.func.isRequired,
            getURL: require("react").PropTypes.func.isRequired
        }).isRequired,
        score: require("react").PropTypes.number.isRequired
    })).isRequired,
    title: require("react").PropTypes.string.isRequired
};
UploadedImage.contextTypes = childContextTypes;

var Match = function Match(_ref3, _ref4) {
    var _ref3$match = _ref3.match,
        recordModel = _ref3$match.recordModel,
        score = _ref3$match.score;
    var getTitle = _ref4.getTitle,
        URL = _ref4.URL,
        format = _ref4.format,
        gettext = _ref4.gettext,
        fullName = _ref4.fullName,
        shortName = _ref4.shortName;

    var source = recordModel.getSource();

    return React.createElement(
        "div",
        { className: "img col-md-6 col-sm-4 col-xs-6" },
        React.createElement(
            "div",
            { className: "img-wrap" },
            React.createElement(
                "a",
                { href: URL(recordModel) },
                React.createElement("img", { src: recordModel.getThumbURL(),
                    alt: getTitle(recordModel),
                    title: getTitle(recordModel),
                    className: "img-responsive center-block"
                })
            )
        ),
        React.createElement(
            "div",
            { className: "details" },
            React.createElement(
                "div",
                { className: "wrap" },
                React.createElement(
                    "span",
                    null,
                    format(gettext("Score: %(score)s"), { score: score })
                ),
                React.createElement(
                    "a",
                    { className: "pull-right",
                        href: URL(source),
                        title: fullName(source)
                    },
                    shortName(source)
                )
            )
        )
    );
};

Match.contextTypes = childContextTypes;

var Results = function Results(props, _ref5) {
    var gettext = _ref5.gettext;
    var similar = props.similar;


    var similarResults = void 0;

    if (similar.length === 0) {
        similarResults = React.createElement(
            "div",
            { className: "col-xs-12" },
            React.createElement(
                "p",
                null,
                gettext("No similar images were found.")
            )
        );
    } else {
        similarResults = similar.map(function (match) {
            return React.createElement(Match, _extends({}, props, { match: match, key: match.recordModel._id }));
        });
    }

    return React.createElement(
        "div",
        { className: "panel panel-default" },
        React.createElement(
            "div",
            { className: "panel-heading" },
            React.createElement(
                "strong",
                null,
                gettext("Similar Images")
            )
        ),
        React.createElement(
            "div",
            { className: "panel-body row" },
            similarResults
        )
    );
};

Results.propTypes = {
    image: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getScaledURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired
    }).isRequired,
    similar: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        recordModel: require("react").PropTypes.shape({
            _id: require("react").PropTypes.string.isRequired,
            type: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired,
            images: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
                _id: require("react").PropTypes.string.isRequired,
                getOriginalURL: require("react").PropTypes.func.isRequired,
                getScaledURL: require("react").PropTypes.func.isRequired,
                getThumbURL: require("react").PropTypes.func.isRequired
            })).isRequired,
            getOriginalURL: require("react").PropTypes.func.isRequired,
            getThumbURL: require("react").PropTypes.func.isRequired,
            getTitle: require("react").PropTypes.func.isRequired,
            getSource: require("react").PropTypes.func.isRequired,
            getURL: require("react").PropTypes.func.isRequired
        }).isRequired,
        score: require("react").PropTypes.number.isRequired
    })).isRequired,
    title: require("react").PropTypes.string.isRequired
};
Results.contextTypes = childContextTypes;

var Upload = function Upload(props) {
    var title = props.title;


    return React.createElement(
        Page,
        { title: title },
        React.createElement(
            "div",
            { className: "row" },
            React.createElement(
                "div",
                { className: "col-md-6" },
                React.createElement(UploadedImage, props)
            ),
            React.createElement(
                "div",
                { className: "col-md-6" },
                React.createElement(Results, props)
            )
        )
    );
};

Upload.propTypes = {
    image: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getScaledURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired
    }).isRequired,
    similar: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        recordModel: require("react").PropTypes.shape({
            _id: require("react").PropTypes.string.isRequired,
            type: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired,
            images: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
                _id: require("react").PropTypes.string.isRequired,
                getOriginalURL: require("react").PropTypes.func.isRequired,
                getScaledURL: require("react").PropTypes.func.isRequired,
                getThumbURL: require("react").PropTypes.func.isRequired
            })).isRequired,
            getOriginalURL: require("react").PropTypes.func.isRequired,
            getThumbURL: require("react").PropTypes.func.isRequired,
            getTitle: require("react").PropTypes.func.isRequired,
            getSource: require("react").PropTypes.func.isRequired,
            getURL: require("react").PropTypes.func.isRequired
        }).isRequired,
        score: require("react").PropTypes.number.isRequired
    })).isRequired,
    title: require("react").PropTypes.string.isRequired
};
module.exports = Upload;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92aWV3cy9VcGxvYWQuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiUGFnZSIsImNoaWxkQ29udGV4dFR5cGVzIiwiVXBsb2FkZWRJbWFnZSIsImltYWdlIiwiZ2V0dGV4dCIsInRpdGxlIiwiZ2V0T3JpZ2luYWxVUkwiLCJnZXRTY2FsZWRVUkwiLCJjb250ZXh0VHlwZXMiLCJNYXRjaCIsIm1hdGNoIiwicmVjb3JkTW9kZWwiLCJzY29yZSIsImdldFRpdGxlIiwiVVJMIiwiZm9ybWF0IiwiZnVsbE5hbWUiLCJzaG9ydE5hbWUiLCJzb3VyY2UiLCJnZXRTb3VyY2UiLCJnZXRUaHVtYlVSTCIsIlJlc3VsdHMiLCJwcm9wcyIsInNpbWlsYXIiLCJzaW1pbGFyUmVzdWx0cyIsImxlbmd0aCIsIm1hcCIsIl9pZCIsIlVwbG9hZCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFFQSxJQUFNQSxRQUFRQyxRQUFRLE9BQVIsQ0FBZDs7QUFFQSxJQUFNQyxPQUFPRCxRQUFRLFdBQVIsQ0FBYjs7OztlQUc0QkEsUUFBUSxjQUFSLEM7SUFBckJFLGlCLFlBQUFBLGlCOztBQXVDUCxJQUFNQyxnQkFBZ0IsU0FBaEJBLGFBQWdCLGNBQXdDO0FBQUEsUUFBdENDLEtBQXNDLFFBQXRDQSxLQUFzQztBQUFBLFFBQXRCQyxPQUFzQixTQUF0QkEsT0FBc0I7O0FBQzFELFFBQU1DLFFBQVFELFFBQVEsZ0JBQVIsQ0FBZDs7QUFFQSxXQUFPO0FBQUE7QUFBQSxVQUFLLFdBQVUscUJBQWY7QUFDSDtBQUFBO0FBQUEsY0FBSyxXQUFVLGVBQWY7QUFDSTtBQUFBO0FBQUE7QUFBU0Esd0JBQVEsZ0JBQVI7QUFBVDtBQURKLFNBREc7QUFJSDtBQUFBO0FBQUEsY0FBSyxXQUFVLFlBQWY7QUFDSTtBQUFBO0FBQUEsa0JBQUcsTUFBTUQsTUFBTUcsY0FBTixFQUFUO0FBQ0ksNkNBQUssS0FBS0gsTUFBTUksWUFBTixFQUFWO0FBQ0kseUJB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QSxLQUFiO0FBQ0g7QUFBQTtBQUFBLGNBQUssV0FBVSxLQUFmO0FBQ0k7QUFBQTtBQUFBLGtCQUFLLFdBQVUsVUFBZjtBQUNJLG9DQUFDLGFBQUQsRUFBbUJpQixLQUFuQjtBQURKLGFBREo7QUFJSTtBQUFBO0FBQUEsa0JBQUssV0FBVSxVQUFmO0FBQ0ksb0NBQUMsT0FBRCxFQUFhQSxLQUFiO0FBREo7QUFKSjtBQURHLEtBQVA7QUFVSCxDQWJEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZUFPLE9BQU9DLE9BQVAsR0FBaUJGLE1BQWpCIiwiZmlsZSI6IlVwbG9hZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmNvbnN0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG5jb25zdCBQYWdlID0gcmVxdWlyZShcIi4vUGFnZS5qc1wiKTtcblxuaW1wb3J0IHR5cGUge0NvbnRleHR9IGZyb20gXCIuL3R5cGVzLmpzXCI7XG5jb25zdCB7Y2hpbGRDb250ZXh0VHlwZXN9ID0gcmVxdWlyZShcIi4vV3JhcHBlci5qc1wiKTtcblxudHlwZSBJbWFnZVR5cGUgPSB7XG4gICAgX2lkOiBzdHJpbmcsXG4gICAgZ2V0T3JpZ2luYWxVUkw6ICgpID0+IHN0cmluZyxcbiAgICBnZXRTY2FsZWRVUkw6ICgpID0+IHN0cmluZyxcbiAgICBnZXRUaHVtYlVSTDogKCkgPT4gc3RyaW5nLFxufTtcblxudHlwZSBSZWNvcmRUeXBlID0ge1xuICAgIF9pZDogc3RyaW5nLFxuICAgIHR5cGU6IHN0cmluZyxcbiAgICB1cmw6IHN0cmluZyxcbiAgICBpbWFnZXM6IEFycmF5PEltYWdlVHlwZT4sXG4gICAgZ2V0T3JpZ2luYWxVUkw6ICgpID0+IHN0cmluZyxcbiAgICBnZXRUaHVtYlVSTDogKCkgPT4gc3RyaW5nLFxuICAgIGdldFRpdGxlOiAoKSA9PiBzdHJpbmcsXG4gICAgZ2V0U291cmNlOiAoKSA9PiBTb3VyY2UsXG4gICAgZ2V0VVJMOiAobGFuZzogc3RyaW5nKSA9PiBzdHJpbmcsXG59O1xuXG50eXBlIFNvdXJjZSA9IHtcbiAgICBfaWQ6IHN0cmluZyxcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgZ2V0VVJMOiAobGFuZzogc3RyaW5nKSA9PiBzdHJpbmcsXG59O1xuXG50eXBlIE1hdGNoVHlwZSA9IHtcbiAgICBfaWQ6IHN0cmluZyxcbiAgICByZWNvcmRNb2RlbDogUmVjb3JkVHlwZSxcbiAgICBzY29yZTogbnVtYmVyLFxufTtcblxudHlwZSBQcm9wcyA9IHtcbiAgICBpbWFnZTogSW1hZ2VUeXBlLFxuICAgIHNpbWlsYXI6IEFycmF5PE1hdGNoVHlwZT4sXG4gICAgdGl0bGU6IHN0cmluZyxcbn07XG5cbmNvbnN0IFVwbG9hZGVkSW1hZ2UgPSAoe2ltYWdlfTogUHJvcHMsIHtnZXR0ZXh0fTogQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IHRpdGxlID0gZ2V0dGV4dChcIlVwbG9hZGVkIEltYWdlXCIpO1xuXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWhlYWRpbmdcIj5cbiAgICAgICAgICAgIDxzdHJvbmc+e2dldHRleHQoXCJVcGxvYWRlZCBJbWFnZVwiKX08L3N0cm9uZz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keVwiPlxuICAgICAgICAgICAgPGEgaHJlZj17aW1hZ2UuZ2V0T3JpZ2luYWxVUkwoKX0+XG4gICAgICAgICAgICAgICAgPGltZyBzcmM9e2ltYWdlLmdldFNjYWxlZFVSTCgpfVxuICAgICAgICAgICAgICAgICAgICBhbHQ9e3RpdGxlfVxuICAgICAgICAgICAgICAgICAgICB0aXRsZT17dGl0bGV9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImltZy1yZXNwb25zaXZlIGNlbnRlci1ibG9ja1wiXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9kaXY+XG4gICAgPC9kaXY+O1xufTtcblxuVXBsb2FkZWRJbWFnZS5jb250ZXh0VHlwZXMgPSBjaGlsZENvbnRleHRUeXBlcztcblxuY29uc3QgTWF0Y2ggPSAoe1xuICAgIG1hdGNoOiB7cmVjb3JkTW9kZWwsIHNjb3JlfSxcbn06IFByb3BzICYge21hdGNoOiBNYXRjaFR5cGV9LCB7XG4gICAgZ2V0VGl0bGUsXG4gICAgVVJMLFxuICAgIGZvcm1hdCxcbiAgICBnZXR0ZXh0LFxuICAgIGZ1bGxOYW1lLFxuICAgIHNob3J0TmFtZSxcbn06IENvbnRleHQpID0+IHtcbiAgICBjb25zdCBzb3VyY2UgPSByZWNvcmRNb2RlbC5nZXRTb3VyY2UoKTtcblxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImltZyBjb2wtbWQtNiBjb2wtc20tNCBjb2wteHMtNlwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImltZy13cmFwXCI+XG4gICAgICAgICAgICA8YSBocmVmPXtVUkwocmVjb3JkTW9kZWwpfT5cbiAgICAgICAgICAgICAgICA8aW1nIHNyYz17cmVjb3JkTW9kZWwuZ2V0VGh1bWJVUkwoKX1cbiAgICAgICAgICAgICAgICAgICAgYWx0PXtnZXRUaXRsZShyZWNvcmRNb2RlbCl9XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlPXtnZXRUaXRsZShyZWNvcmRNb2RlbCl9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImltZy1yZXNwb25zaXZlIGNlbnRlci1ibG9ja1wiXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGV0YWlsc1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3cmFwXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4+e2Zvcm1hdChnZXR0ZXh0KFwiU2NvcmU6ICUoc2NvcmUpc1wiKSxcbiAgICAgICAgICAgICAgICAgICAge3Njb3JlOiBzY29yZX0pfTwvc3Bhbj5cblxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cInB1bGwtcmlnaHRcIlxuICAgICAgICAgICAgICAgICAgICBocmVmPXtVUkwoc291cmNlKX1cbiAgICAgICAgICAgICAgICAgICAgdGl0bGU9e2Z1bGxOYW1lKHNvdXJjZSl9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7c2hvcnROYW1lKHNvdXJjZSl9XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2Pjtcbn07XG5cbk1hdGNoLmNvbnRleHRUeXBlcyA9IGNoaWxkQ29udGV4dFR5cGVzO1xuXG5jb25zdCBSZXN1bHRzID0gKHByb3BzOiBQcm9wcywge2dldHRleHR9OiBDb250ZXh0KSA9PiB7XG4gICAgY29uc3Qge3NpbWlsYXJ9ID0gcHJvcHM7XG5cbiAgICBsZXQgc2ltaWxhclJlc3VsdHM7XG5cbiAgICBpZiAoc2ltaWxhci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgc2ltaWxhclJlc3VsdHMgPSA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMlwiPlxuICAgICAgICAgICAgPHA+e2dldHRleHQoXCJObyBzaW1pbGFyIGltYWdlcyB3ZXJlIGZvdW5kLlwiKX08L3A+XG4gICAgICAgIDwvZGl2PjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzaW1pbGFyUmVzdWx0cyA9IHNpbWlsYXIubWFwKChtYXRjaCkgPT5cbiAgICAgICAgICAgIDxNYXRjaCB7Li4ucHJvcHN9IG1hdGNoPXttYXRjaH0ga2V5PXttYXRjaC5yZWNvcmRNb2RlbC5faWR9IC8+KTtcbiAgICB9XG5cbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtaGVhZGluZ1wiPlxuICAgICAgICAgICAgPHN0cm9uZz57Z2V0dGV4dChcIlNpbWlsYXIgSW1hZ2VzXCIpfTwvc3Ryb25nPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1ib2R5IHJvd1wiPlxuICAgICAgICAgICAge3NpbWlsYXJSZXN1bHRzfVxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj47XG59O1xuXG5SZXN1bHRzLmNvbnRleHRUeXBlcyA9IGNoaWxkQ29udGV4dFR5cGVzO1xuXG5jb25zdCBVcGxvYWQgPSAocHJvcHM6IFByb3BzKSA9PiB7XG4gICAgY29uc3Qge3RpdGxlfSA9IHByb3BzO1xuXG4gICAgcmV0dXJuIDxQYWdlIHRpdGxlPXt0aXRsZX0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC02XCI+XG4gICAgICAgICAgICAgICAgPFVwbG9hZGVkSW1hZ2Ugey4uLnByb3BzfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC02XCI+XG4gICAgICAgICAgICAgICAgPFJlc3VsdHMgey4uLnByb3BzfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvUGFnZT47XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVwbG9hZDtcbiJdfQ==