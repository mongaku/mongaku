"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = require("react");

var FixedStringDisplay = React.createFactory(require("../../views/types/view/FixedString.js"));
var FixedStringEdit = React.createFactory(require("../../views/types/edit/FixedString.js"));

var SimpleString = function SimpleString(options) {
    this.options = options;
    /*
    name
    type
    searchName
    title(i18n)
    placeholder(i18n)
    multiple: Bool
    recommended: Bool
    */
};

SimpleString.prototype = {
    searchName: function searchName() {
        return this.options.searchName || this.options.name;
    },
    value: function value(query) {
        return query[this.searchName()];
    },
    fields: function fields(value) {
        return _defineProperty({}, this.searchName(), value);
    },
    renderView: function renderView(value) {
        return FixedStringDisplay({
            name: this.options.name,
            type: this.options.type,
            value: value,
            multiline: this.options.multiline
        });
    },
    renderEdit: function renderEdit(value) {
        return FixedStringEdit({
            name: this.options.name,
            type: this.options.type,
            value: value,
            multiline: this.options.multiline
        });
    },
    schema: function schema() {
        var type = {
            type: String,
            es_indexed: true,
            recommended: !!this.options.recommended
        };

        return this.options.multiple ? [type] : type;
    }
};

module.exports = SimpleString;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zY2hlbWFzL3R5cGVzL1NpbXBsZVN0cmluZy5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsInJlcXVpcmUiLCJGaXhlZFN0cmluZ0Rpc3BsYXkiLCJjcmVhdGVGYWN0b3J5IiwiRml4ZWRTdHJpbmdFZGl0IiwiU2ltcGxlU3RyaW5nIiwib3B0aW9ucyIsInByb3RvdHlwZSIsInNlYXJjaE5hbWUiLCJuYW1lIiwidmFsdWUiLCJxdWVyeSIsImZpZWxkcyIsInJlbmRlclZpZXciLCJ0eXBlIiwibXVsdGlsaW5lIiwicmVuZGVyRWRpdCIsInNjaGVtYSIsIlN0cmluZyIsImVzX2luZGV4ZWQiLCJyZWNvbW1lbmRlZCIsIm11bHRpcGxlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQU1BLFFBQVFDLFFBQVEsT0FBUixDQUFkOztBQUVBLElBQU1DLHFCQUFxQkYsTUFBTUcsYUFBTixDQUN2QkYsUUFBUSx1Q0FBUixDQUR1QixDQUEzQjtBQUVBLElBQU1HLGtCQUFrQkosTUFBTUcsYUFBTixDQUNwQkYsUUFBUSx1Q0FBUixDQURvQixDQUF4Qjs7QUFHQSxJQUFNSSxlQUFlLFNBQWZBLFlBQWUsQ0FBU0MsT0FBVCxFQUFrQjtBQUNuQyxTQUFLQSxPQUFMLEdBQWVBLE9BQWY7QUFDQTs7Ozs7Ozs7O0FBU0gsQ0FYRDs7QUFhQUQsYUFBYUUsU0FBYixHQUF5QjtBQUNyQkMsY0FEcUIsd0JBQ1I7QUFDVCxlQUFPLEtBQUtGLE9BQUwsQ0FBYUUsVUFBYixJQUEyQixLQUFLRixPQUFMLENBQWFHLElBQS9DO0FBQ0gsS0FIb0I7QUFLckJDLFNBTHFCLGlCQUtmQyxLQUxlLEVBS1I7QUFDVCxlQUFPQSxNQUFNLEtBQUtILFVBQUwsRUFBTixDQUFQO0FBQ0gsS0FQb0I7QUFTckJJLFVBVHFCLGtCQVNkRixLQVRjLEVBU1A7QUFDVixtQ0FBUyxLQUFLRixVQUFMLEVBQVQsRUFBNkJFLEtBQTdCO0FBQ0gsS0FYb0I7QUFhckJHLGNBYnFCLHNCQWFWSCxLQWJVLEVBYUg7QUFDZCxlQUFPUixtQkFBbUI7QUFDdEJPLGtCQUFNLEtBQUtILE9BQUwsQ0FBYUcsSUFERztBQUV0Qkssa0JBQU0sS0FBS1IsT0FBTCxDQUFhUSxJQUZHO0FBR3RCSix3QkFIc0I7QUFJdEJLLHVCQUFXLEtBQUtULE9BQUwsQ0FBYVM7QUFKRixTQUFuQixDQUFQO0FBTUgsS0FwQm9CO0FBc0JyQkMsY0F0QnFCLHNCQXNCVk4sS0F0QlUsRUFzQkg7QUFDZCxlQUFPTixnQkFBZ0I7QUFDbkJLLGtCQUFNLEtBQUtILE9BQUwsQ0FBYUcsSUFEQTtBQUVuQkssa0JBQU0sS0FBS1IsT0FBTCxDQUFhUSxJQUZBO0FBR25CSix3QkFIbUI7QUFJbkJLLHVCQUFXLEtBQUtULE9BQUwsQ0FBYVM7QUFKTCxTQUFoQixDQUFQO0FBTUgsS0E3Qm9CO0FBK0JyQkUsVUEvQnFCLG9CQStCWjtBQUNMLFlBQU1ILE9BQU87QUFDVEEsa0JBQU1JLE1BREc7QUFFVEMsd0JBQVksSUFGSDtBQUdUQyx5QkFBYSxDQUFDLENBQUMsS0FBS2QsT0FBTCxDQUFhYztBQUhuQixTQUFiOztBQU1BLGVBQU8sS0FBS2QsT0FBTCxDQUFhZSxRQUFiLEdBQXdCLENBQUNQLElBQUQsQ0FBeEIsR0FBaUNBLElBQXhDO0FBQ0g7QUF2Q29CLENBQXpCOztBQTBDQVEsT0FBT0MsT0FBUCxHQUFpQmxCLFlBQWpCIiwiZmlsZSI6IlNpbXBsZVN0cmluZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG5jb25zdCBGaXhlZFN0cmluZ0Rpc3BsYXkgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KFxuICAgIHJlcXVpcmUoXCIuLi8uLi92aWV3cy90eXBlcy92aWV3L0ZpeGVkU3RyaW5nLmpzXCIpKTtcbmNvbnN0IEZpeGVkU3RyaW5nRWRpdCA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkoXG4gICAgcmVxdWlyZShcIi4uLy4uL3ZpZXdzL3R5cGVzL2VkaXQvRml4ZWRTdHJpbmcuanNcIikpO1xuXG5jb25zdCBTaW1wbGVTdHJpbmcgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAvKlxuICAgIG5hbWVcbiAgICB0eXBlXG4gICAgc2VhcmNoTmFtZVxuICAgIHRpdGxlKGkxOG4pXG4gICAgcGxhY2Vob2xkZXIoaTE4bilcbiAgICBtdWx0aXBsZTogQm9vbFxuICAgIHJlY29tbWVuZGVkOiBCb29sXG4gICAgKi9cbn07XG5cblNpbXBsZVN0cmluZy5wcm90b3R5cGUgPSB7XG4gICAgc2VhcmNoTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zZWFyY2hOYW1lIHx8IHRoaXMub3B0aW9ucy5uYW1lO1xuICAgIH0sXG5cbiAgICB2YWx1ZShxdWVyeSkge1xuICAgICAgICByZXR1cm4gcXVlcnlbdGhpcy5zZWFyY2hOYW1lKCldO1xuICAgIH0sXG5cbiAgICBmaWVsZHModmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHtbdGhpcy5zZWFyY2hOYW1lKCldOiB2YWx1ZX07XG4gICAgfSxcblxuICAgIHJlbmRlclZpZXcodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIEZpeGVkU3RyaW5nRGlzcGxheSh7XG4gICAgICAgICAgICBuYW1lOiB0aGlzLm9wdGlvbnMubmFtZSxcbiAgICAgICAgICAgIHR5cGU6IHRoaXMub3B0aW9ucy50eXBlLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBtdWx0aWxpbmU6IHRoaXMub3B0aW9ucy5tdWx0aWxpbmUsXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICByZW5kZXJFZGl0KHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBGaXhlZFN0cmluZ0VkaXQoe1xuICAgICAgICAgICAgbmFtZTogdGhpcy5vcHRpb25zLm5hbWUsXG4gICAgICAgICAgICB0eXBlOiB0aGlzLm9wdGlvbnMudHlwZSxcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgbXVsdGlsaW5lOiB0aGlzLm9wdGlvbnMubXVsdGlsaW5lLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2NoZW1hKCkge1xuICAgICAgICBjb25zdCB0eXBlID0ge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZXNfaW5kZXhlZDogdHJ1ZSxcbiAgICAgICAgICAgIHJlY29tbWVuZGVkOiAhIXRoaXMub3B0aW9ucy5yZWNvbW1lbmRlZCxcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm11bHRpcGxlID8gW3R5cGVdIDogdHlwZTtcbiAgICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTaW1wbGVTdHJpbmc7XG4iXX0=