"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = require("react");

//const LinkedRecordDisplay = React.createFactory(
//    require("../../views/types/view/LinkedRecord.js"));
var LinkedRecordEdit = React.createFactory(require("../../views/types/edit/LinkedRecord.js"));

var LinkedRecord = function LinkedRecord(options) {
    this.options = options;
    /*
    name
    recordType
    searchName
    recordType: String
    title(i18n)
    placeholder(i18n)
    multiple: Bool
    recommended: Bool
    */
};

LinkedRecord.prototype = {
    searchName: function searchName() {
        return this.options.searchName || this.options.name;
    },
    value: function value(query) {
        return query[this.searchName()];
    },
    fields: function fields(value) {
        return _defineProperty({}, this.searchName(), value);
    },
    loadDynamicValue: function loadDynamicValue(value, i18n, callback) {
        var record = require("../../lib/record");
        var Record = record(this.options.recordType);
        Record.findById(value, function (err, item) {
            if (err) {
                return callback(err);
            }

            callback(null, {
                id: value,
                title: item.getTitle(i18n)
            });
        });
    },
    renderView: function renderView() {
        /*
        return LinkedRecordDisplay({
            name: this.options.name,
            type: this.options.type,
            value,
        });
        */
    },
    renderEdit: function renderEdit(value, allValues, i18n) {
        return LinkedRecordEdit({
            name: this.options.name,
            type: this.options.type,
            value: value,
            multiple: this.options.multiple,
            recordType: this.options.recordType,
            placeholder: this.options.placeholder(i18n)
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

module.exports = LinkedRecord;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zY2hlbWFzL3R5cGVzL0xpbmtlZFJlY29yZC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsInJlcXVpcmUiLCJMaW5rZWRSZWNvcmRFZGl0IiwiY3JlYXRlRmFjdG9yeSIsIkxpbmtlZFJlY29yZCIsIm9wdGlvbnMiLCJwcm90b3R5cGUiLCJzZWFyY2hOYW1lIiwibmFtZSIsInZhbHVlIiwicXVlcnkiLCJmaWVsZHMiLCJsb2FkRHluYW1pY1ZhbHVlIiwiaTE4biIsImNhbGxiYWNrIiwicmVjb3JkIiwiUmVjb3JkIiwicmVjb3JkVHlwZSIsImZpbmRCeUlkIiwiZXJyIiwiaXRlbSIsImlkIiwidGl0bGUiLCJnZXRUaXRsZSIsInJlbmRlclZpZXciLCJyZW5kZXJFZGl0IiwiYWxsVmFsdWVzIiwidHlwZSIsIm11bHRpcGxlIiwicGxhY2Vob2xkZXIiLCJzY2hlbWEiLCJTdHJpbmciLCJlc19pbmRleGVkIiwicmVjb21tZW5kZWQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBTUEsUUFBUUMsUUFBUSxPQUFSLENBQWQ7O0FBRUE7QUFDQTtBQUNBLElBQU1DLG1CQUFtQkYsTUFBTUcsYUFBTixDQUNyQkYsUUFBUSx3Q0FBUixDQURxQixDQUF6Qjs7QUFHQSxJQUFNRyxlQUFlLFNBQWZBLFlBQWUsQ0FBU0MsT0FBVCxFQUFrQjtBQUNuQyxTQUFLQSxPQUFMLEdBQWVBLE9BQWY7QUFDQTs7Ozs7Ozs7OztBQVVILENBWkQ7O0FBY0FELGFBQWFFLFNBQWIsR0FBeUI7QUFDckJDLGNBRHFCLHdCQUNSO0FBQ1QsZUFBTyxLQUFLRixPQUFMLENBQWFFLFVBQWIsSUFBMkIsS0FBS0YsT0FBTCxDQUFhRyxJQUEvQztBQUNILEtBSG9CO0FBS3JCQyxTQUxxQixpQkFLZkMsS0FMZSxFQUtSO0FBQ1QsZUFBT0EsTUFBTSxLQUFLSCxVQUFMLEVBQU4sQ0FBUDtBQUNILEtBUG9CO0FBU3JCSSxVQVRxQixrQkFTZEYsS0FUYyxFQVNQO0FBQ1YsbUNBQVMsS0FBS0YsVUFBTCxFQUFULEVBQTZCRSxLQUE3QjtBQUNILEtBWG9CO0FBYXJCRyxvQkFicUIsNEJBYUpILEtBYkksRUFhR0ksSUFiSCxFQWFTQyxRQWJULEVBYW1CO0FBQ3BDLFlBQU1DLFNBQVNkLFFBQVEsa0JBQVIsQ0FBZjtBQUNBLFlBQU1lLFNBQVNELE9BQU8sS0FBS1YsT0FBTCxDQUFhWSxVQUFwQixDQUFmO0FBQ0FELGVBQU9FLFFBQVAsQ0FBZ0JULEtBQWhCLEVBQXVCLFVBQUNVLEdBQUQsRUFBTUMsSUFBTixFQUFlO0FBQ2xDLGdCQUFJRCxHQUFKLEVBQVM7QUFDTCx1QkFBT0wsU0FBU0ssR0FBVCxDQUFQO0FBQ0g7O0FBRURMLHFCQUFTLElBQVQsRUFBZTtBQUNYTyxvQkFBSVosS0FETztBQUVYYSx1QkFBT0YsS0FBS0csUUFBTCxDQUFjVixJQUFkO0FBRkksYUFBZjtBQUlILFNBVEQ7QUFVSCxLQTFCb0I7QUE0QnJCVyxjQTVCcUIsd0JBNEJSO0FBQ1Q7Ozs7Ozs7QUFPSCxLQXBDb0I7QUFzQ3JCQyxjQXRDcUIsc0JBc0NWaEIsS0F0Q1UsRUFzQ0hpQixTQXRDRyxFQXNDUWIsSUF0Q1IsRUFzQ2M7QUFDL0IsZUFBT1gsaUJBQWlCO0FBQ3BCTSxrQkFBTSxLQUFLSCxPQUFMLENBQWFHLElBREM7QUFFcEJtQixrQkFBTSxLQUFLdEIsT0FBTCxDQUFhc0IsSUFGQztBQUdwQmxCLHdCQUhvQjtBQUlwQm1CLHNCQUFVLEtBQUt2QixPQUFMLENBQWF1QixRQUpIO0FBS3BCWCx3QkFBWSxLQUFLWixPQUFMLENBQWFZLFVBTEw7QUFNcEJZLHlCQUFhLEtBQUt4QixPQUFMLENBQWF3QixXQUFiLENBQXlCaEIsSUFBekI7QUFOTyxTQUFqQixDQUFQO0FBUUgsS0EvQ29CO0FBaURyQmlCLFVBakRxQixvQkFpRFo7QUFDTCxZQUFNSCxPQUFPO0FBQ1RBLGtCQUFNSSxNQURHO0FBRVRDLHdCQUFZLElBRkg7QUFHVEMseUJBQWEsQ0FBQyxDQUFDLEtBQUs1QixPQUFMLENBQWE0QjtBQUhuQixTQUFiOztBQU1BLGVBQU8sS0FBSzVCLE9BQUwsQ0FBYXVCLFFBQWIsR0FBd0IsQ0FBQ0QsSUFBRCxDQUF4QixHQUFpQ0EsSUFBeEM7QUFDSDtBQXpEb0IsQ0FBekI7O0FBNERBTyxPQUFPQyxPQUFQLEdBQWlCL0IsWUFBakIiLCJmaWxlIjoiTGlua2VkUmVjb3JkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cbi8vY29uc3QgTGlua2VkUmVjb3JkRGlzcGxheSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkoXG4vLyAgICByZXF1aXJlKFwiLi4vLi4vdmlld3MvdHlwZXMvdmlldy9MaW5rZWRSZWNvcmQuanNcIikpO1xuY29uc3QgTGlua2VkUmVjb3JkRWRpdCA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkoXG4gICAgcmVxdWlyZShcIi4uLy4uL3ZpZXdzL3R5cGVzL2VkaXQvTGlua2VkUmVjb3JkLmpzXCIpKTtcblxuY29uc3QgTGlua2VkUmVjb3JkID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgLypcbiAgICBuYW1lXG4gICAgcmVjb3JkVHlwZVxuICAgIHNlYXJjaE5hbWVcbiAgICByZWNvcmRUeXBlOiBTdHJpbmdcbiAgICB0aXRsZShpMThuKVxuICAgIHBsYWNlaG9sZGVyKGkxOG4pXG4gICAgbXVsdGlwbGU6IEJvb2xcbiAgICByZWNvbW1lbmRlZDogQm9vbFxuICAgICovXG59O1xuXG5MaW5rZWRSZWNvcmQucHJvdG90eXBlID0ge1xuICAgIHNlYXJjaE5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc2VhcmNoTmFtZSB8fCB0aGlzLm9wdGlvbnMubmFtZTtcbiAgICB9LFxuXG4gICAgdmFsdWUocXVlcnkpIHtcbiAgICAgICAgcmV0dXJuIHF1ZXJ5W3RoaXMuc2VhcmNoTmFtZSgpXTtcbiAgICB9LFxuXG4gICAgZmllbGRzKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB7W3RoaXMuc2VhcmNoTmFtZSgpXTogdmFsdWV9O1xuICAgIH0sXG5cbiAgICBsb2FkRHluYW1pY1ZhbHVlKHZhbHVlLCBpMThuLCBjYWxsYmFjaykge1xuICAgICAgICBjb25zdCByZWNvcmQgPSByZXF1aXJlKFwiLi4vLi4vbGliL3JlY29yZFwiKTtcbiAgICAgICAgY29uc3QgUmVjb3JkID0gcmVjb3JkKHRoaXMub3B0aW9ucy5yZWNvcmRUeXBlKTtcbiAgICAgICAgUmVjb3JkLmZpbmRCeUlkKHZhbHVlLCAoZXJyLCBpdGVtKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtcbiAgICAgICAgICAgICAgICBpZDogdmFsdWUsXG4gICAgICAgICAgICAgICAgdGl0bGU6IGl0ZW0uZ2V0VGl0bGUoaTE4biksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJlbmRlclZpZXcoKSB7XG4gICAgICAgIC8qXG4gICAgICAgIHJldHVybiBMaW5rZWRSZWNvcmREaXNwbGF5KHtcbiAgICAgICAgICAgIG5hbWU6IHRoaXMub3B0aW9ucy5uYW1lLFxuICAgICAgICAgICAgdHlwZTogdGhpcy5vcHRpb25zLnR5cGUsXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgfSk7XG4gICAgICAgICovXG4gICAgfSxcblxuICAgIHJlbmRlckVkaXQodmFsdWUsIGFsbFZhbHVlcywgaTE4bikge1xuICAgICAgICByZXR1cm4gTGlua2VkUmVjb3JkRWRpdCh7XG4gICAgICAgICAgICBuYW1lOiB0aGlzLm9wdGlvbnMubmFtZSxcbiAgICAgICAgICAgIHR5cGU6IHRoaXMub3B0aW9ucy50eXBlLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBtdWx0aXBsZTogdGhpcy5vcHRpb25zLm11bHRpcGxlLFxuICAgICAgICAgICAgcmVjb3JkVHlwZTogdGhpcy5vcHRpb25zLnJlY29yZFR5cGUsXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogdGhpcy5vcHRpb25zLnBsYWNlaG9sZGVyKGkxOG4pLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2NoZW1hKCkge1xuICAgICAgICBjb25zdCB0eXBlID0ge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZXNfaW5kZXhlZDogdHJ1ZSxcbiAgICAgICAgICAgIHJlY29tbWVuZGVkOiAhIXRoaXMub3B0aW9ucy5yZWNvbW1lbmRlZCxcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm11bHRpcGxlID8gW3R5cGVdIDogdHlwZTtcbiAgICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaW5rZWRSZWNvcmQ7XG4iXX0=