"use strict";

var React = require("react");

var NameEdit = React.createClass({
    displayName: "NameEdit",

    propTypes: {
        multiple: React.PropTypes.bool,
        name: React.PropTypes.string.isRequired,
        names: React.PropTypes.arrayOf(React.PropTypes.string),
        type: React.PropTypes.string.isRequired,
        value: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string,
            original: React.PropTypes.string
        }))
    },

    render: function render() {
        var value = (this.props.value || []).map(function (name) {
            return name.name || name.original;
        });

        if (!this.props.multiple) {
            value = value[0];
        }

        if (this.props.names && this.props.names.length > 0) {
            return React.createElement(
                "select",
                {
                    name: this.props.name,
                    className: "form-control select2-select",
                    defaultValue: value,
                    multiple: this.props.multiple
                },
                this.props.names.map(function (name) {
                    return React.createElement(
                        "option",
                        { value: name, key: name },
                        name
                    );
                })
            );
        }

        return React.createElement("input", {
            name: this.props.name,
            type: "text",
            className: "form-control",
            defaultValue: value
        });
    }
});

module.exports = NameEdit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy92aWV3cy90eXBlcy9lZGl0L05hbWUuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiTmFtZUVkaXQiLCJjcmVhdGVDbGFzcyIsInByb3BUeXBlcyIsIm11bHRpcGxlIiwiUHJvcFR5cGVzIiwiYm9vbCIsIm5hbWUiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwibmFtZXMiLCJhcnJheU9mIiwidHlwZSIsInZhbHVlIiwic2hhcGUiLCJvcmlnaW5hbCIsInJlbmRlciIsInByb3BzIiwibWFwIiwibGVuZ3RoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxRQUFRQyxRQUFRLE9BQVIsQ0FBZDs7QUFFQSxJQUFNQyxXQUFXRixNQUFNRyxXQUFOLENBQWtCO0FBQUE7O0FBQy9CQyxlQUFXO0FBQ1BDLGtCQUFVTCxNQUFNTSxTQUFOLENBQWdCQyxJQURuQjtBQUVQQyxjQUFNUixNQUFNTSxTQUFOLENBQWdCRyxNQUFoQixDQUF1QkMsVUFGdEI7QUFHUEMsZUFBT1gsTUFBTU0sU0FBTixDQUFnQk0sT0FBaEIsQ0FBd0JaLE1BQU1NLFNBQU4sQ0FBZ0JHLE1BQXhDLENBSEE7QUFJUEksY0FBTWIsTUFBTU0sU0FBTixDQUFnQkcsTUFBaEIsQ0FBdUJDLFVBSnRCO0FBS1BJLGVBQU9kLE1BQU1NLFNBQU4sQ0FBZ0JNLE9BQWhCLENBQ0haLE1BQU1NLFNBQU4sQ0FBZ0JTLEtBQWhCLENBQXNCO0FBQ2xCUCxrQkFBTVIsTUFBTU0sU0FBTixDQUFnQkcsTUFESjtBQUVsQk8sc0JBQVVoQixNQUFNTSxTQUFOLENBQWdCRztBQUZSLFNBQXRCLENBREc7QUFMQSxLQURvQjs7QUFjL0JRLFVBZCtCLG9CQWN0QjtBQUNMLFlBQUlILFFBQVEsQ0FBQyxLQUFLSSxLQUFMLENBQVdKLEtBQVgsSUFBb0IsRUFBckIsRUFDUEssR0FETyxDQUNILFVBQUNYLElBQUQ7QUFBQSxtQkFBVUEsS0FBS0EsSUFBTCxJQUFhQSxLQUFLUSxRQUE1QjtBQUFBLFNBREcsQ0FBWjs7QUFHQSxZQUFJLENBQUMsS0FBS0UsS0FBTCxDQUFXYixRQUFoQixFQUEwQjtBQUN0QlMsb0JBQVFBLE1BQU0sQ0FBTixDQUFSO0FBQ0g7O0FBRUQsWUFBSSxLQUFLSSxLQUFMLENBQVdQLEtBQVgsSUFBb0IsS0FBS08sS0FBTCxDQUFXUCxLQUFYLENBQWlCUyxNQUFqQixHQUEwQixDQUFsRCxFQUFxRDtBQUNqRCxtQkFBTztBQUFBO0FBQUE7QUFDSCwwQkFBTSxLQUFLRixLQUFMLENBQVdWLElBRGQ7QUFFSCwrQkFBVSw2QkFGUDtBQUdILGtDQUFjTSxLQUhYO0FBSUgsOEJBQVUsS0FBS0ksS0FBTCxDQUFXYjtBQUpsQjtBQU1GLHFCQUFLYSxLQUFMLENBQVdQLEtBQVgsQ0FBaUJRLEdBQWpCLENBQXFCLFVBQUNYLElBQUQ7QUFBQSwyQkFDbEI7QUFBQTtBQUFBLDBCQUFRLE9BQU9BLElBQWYsRUFBcUIsS0FBS0EsSUFBMUI7QUFDS0E7QUFETCxxQkFEa0I7QUFBQSxpQkFBckI7QUFORSxhQUFQO0FBWUg7O0FBRUQsZUFBTztBQUNILGtCQUFNLEtBQUtVLEtBQUwsQ0FBV1YsSUFEZDtBQUVILGtCQUFLLE1BRkY7QUFHSCx1QkFBVSxjQUhQO0FBSUgsMEJBQWNNO0FBSlgsVUFBUDtBQU1IO0FBM0M4QixDQUFsQixDQUFqQjs7QUE4Q0FPLE9BQU9DLE9BQVAsR0FBaUJwQixRQUFqQiIsImZpbGUiOiJOYW1lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cbmNvbnN0IE5hbWVFZGl0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIHByb3BUeXBlczoge1xuICAgICAgICBtdWx0aXBsZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICAgICAgbmFtZXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheU9mKFJlYWN0LlByb3BUeXBlcy5zdHJpbmcpLFxuICAgICAgICB0eXBlOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgICAgIHZhbHVlOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlPZihcbiAgICAgICAgICAgIFJlYWN0LlByb3BUeXBlcy5zaGFwZSh7XG4gICAgICAgICAgICAgICAgbmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICksXG4gICAgfSxcblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gKHRoaXMucHJvcHMudmFsdWUgfHwgW10pXG4gICAgICAgICAgICAubWFwKChuYW1lKSA9PiBuYW1lLm5hbWUgfHwgbmFtZS5vcmlnaW5hbCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLm11bHRpcGxlKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucHJvcHMubmFtZXMgJiYgdGhpcy5wcm9wcy5uYW1lcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gPHNlbGVjdFxuICAgICAgICAgICAgICAgIG5hbWU9e3RoaXMucHJvcHMubmFtZX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2wgc2VsZWN0Mi1zZWxlY3RcIlxuICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dmFsdWV9XG4gICAgICAgICAgICAgICAgbXVsdGlwbGU9e3RoaXMucHJvcHMubXVsdGlwbGV9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMubmFtZXMubWFwKChuYW1lKSA9PlxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtuYW1lfSBrZXk9e25hbWV9PlxuICAgICAgICAgICAgICAgICAgICAgICAge25hbWV9XG4gICAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L3NlbGVjdD47XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gPGlucHV0XG4gICAgICAgICAgICBuYW1lPXt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXt2YWx1ZX1cbiAgICAgICAgLz47XG4gICAgfSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5hbWVFZGl0O1xuIl19