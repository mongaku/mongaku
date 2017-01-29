"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = require("react");

var FixedStringDisplay = React.createFactory(require("../../views/types/view/FixedString.js"));
var FixedStringEdit = React.createFactory(require("../../views/types/edit/FixedString.js"));

var SimpleNumber = function SimpleNumber(options) {
    this.options = options;
    /*
    name
    type
    searchName
    title(i18n)
    placeholder(i18n)
    multiple: Bool
    recommended: Bool
    hidden: Bool
    */
};

SimpleNumber.prototype = {
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
            multiline: this.options.multiline,
            hidden: this.options.hidden
        });
    },
    schema: function schema() {
        var type = {
            type: Number,
            es_indexed: true,
            recommended: !!this.options.recommended
        };

        return this.options.multiple ? [type] : type;
    }
};

module.exports = SimpleNumber;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zY2hlbWFzL3R5cGVzL1NpbXBsZU51bWJlci5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsInJlcXVpcmUiLCJGaXhlZFN0cmluZ0Rpc3BsYXkiLCJjcmVhdGVGYWN0b3J5IiwiRml4ZWRTdHJpbmdFZGl0IiwiU2ltcGxlTnVtYmVyIiwib3B0aW9ucyIsInByb3RvdHlwZSIsInNlYXJjaE5hbWUiLCJuYW1lIiwidmFsdWUiLCJxdWVyeSIsImZpZWxkcyIsInJlbmRlclZpZXciLCJ0eXBlIiwibXVsdGlsaW5lIiwicmVuZGVyRWRpdCIsImhpZGRlbiIsInNjaGVtYSIsIk51bWJlciIsImVzX2luZGV4ZWQiLCJyZWNvbW1lbmRlZCIsIm11bHRpcGxlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQU1BLFFBQVFDLFFBQVEsT0FBUixDQUFkOztBQUVBLElBQU1DLHFCQUFxQkYsTUFBTUcsYUFBTixDQUN2QkYsUUFBUSx1Q0FBUixDQUR1QixDQUEzQjtBQUVBLElBQU1HLGtCQUFrQkosTUFBTUcsYUFBTixDQUNwQkYsUUFBUSx1Q0FBUixDQURvQixDQUF4Qjs7QUFHQSxJQUFNSSxlQUFlLFNBQWZBLFlBQWUsQ0FBU0MsT0FBVCxFQUFrQjtBQUNuQyxTQUFLQSxPQUFMLEdBQWVBLE9BQWY7QUFDQTs7Ozs7Ozs7OztBQVVILENBWkQ7O0FBY0FELGFBQWFFLFNBQWIsR0FBeUI7QUFDckJDLGNBRHFCLHdCQUNSO0FBQ1QsZUFBTyxLQUFLRixPQUFMLENBQWFFLFVBQWIsSUFBMkIsS0FBS0YsT0FBTCxDQUFhRyxJQUEvQztBQUNILEtBSG9CO0FBS3JCQyxTQUxxQixpQkFLZkMsS0FMZSxFQUtSO0FBQ1QsZUFBT0EsTUFBTSxLQUFLSCxVQUFMLEVBQU4sQ0FBUDtBQUNILEtBUG9CO0FBU3JCSSxVQVRxQixrQkFTZEYsS0FUYyxFQVNQO0FBQ1YsbUNBQVMsS0FBS0YsVUFBTCxFQUFULEVBQTZCRSxLQUE3QjtBQUNILEtBWG9CO0FBYXJCRyxjQWJxQixzQkFhVkgsS0FiVSxFQWFIO0FBQ2QsZUFBT1IsbUJBQW1CO0FBQ3RCTyxrQkFBTSxLQUFLSCxPQUFMLENBQWFHLElBREc7QUFFdEJLLGtCQUFNLEtBQUtSLE9BQUwsQ0FBYVEsSUFGRztBQUd0Qkosd0JBSHNCO0FBSXRCSyx1QkFBVyxLQUFLVCxPQUFMLENBQWFTO0FBSkYsU0FBbkIsQ0FBUDtBQU1ILEtBcEJvQjtBQXNCckJDLGNBdEJxQixzQkFzQlZOLEtBdEJVLEVBc0JIO0FBQ2QsZUFBT04sZ0JBQWdCO0FBQ25CSyxrQkFBTSxLQUFLSCxPQUFMLENBQWFHLElBREE7QUFFbkJLLGtCQUFNLEtBQUtSLE9BQUwsQ0FBYVEsSUFGQTtBQUduQkosd0JBSG1CO0FBSW5CSyx1QkFBVyxLQUFLVCxPQUFMLENBQWFTLFNBSkw7QUFLbkJFLG9CQUFRLEtBQUtYLE9BQUwsQ0FBYVc7QUFMRixTQUFoQixDQUFQO0FBT0gsS0E5Qm9CO0FBZ0NyQkMsVUFoQ3FCLG9CQWdDWjtBQUNMLFlBQU1KLE9BQU87QUFDVEEsa0JBQU1LLE1BREc7QUFFVEMsd0JBQVksSUFGSDtBQUdUQyx5QkFBYSxDQUFDLENBQUMsS0FBS2YsT0FBTCxDQUFhZTtBQUhuQixTQUFiOztBQU1BLGVBQU8sS0FBS2YsT0FBTCxDQUFhZ0IsUUFBYixHQUF3QixDQUFDUixJQUFELENBQXhCLEdBQWlDQSxJQUF4QztBQUNIO0FBeENvQixDQUF6Qjs7QUEyQ0FTLE9BQU9DLE9BQVAsR0FBaUJuQixZQUFqQiIsImZpbGUiOiJTaW1wbGVOdW1iZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxuY29uc3QgRml4ZWRTdHJpbmdEaXNwbGF5ID0gUmVhY3QuY3JlYXRlRmFjdG9yeShcbiAgICByZXF1aXJlKFwiLi4vLi4vdmlld3MvdHlwZXMvdmlldy9GaXhlZFN0cmluZy5qc1wiKSk7XG5jb25zdCBGaXhlZFN0cmluZ0VkaXQgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KFxuICAgIHJlcXVpcmUoXCIuLi8uLi92aWV3cy90eXBlcy9lZGl0L0ZpeGVkU3RyaW5nLmpzXCIpKTtcblxuY29uc3QgU2ltcGxlTnVtYmVyID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgLypcbiAgICBuYW1lXG4gICAgdHlwZVxuICAgIHNlYXJjaE5hbWVcbiAgICB0aXRsZShpMThuKVxuICAgIHBsYWNlaG9sZGVyKGkxOG4pXG4gICAgbXVsdGlwbGU6IEJvb2xcbiAgICByZWNvbW1lbmRlZDogQm9vbFxuICAgIGhpZGRlbjogQm9vbFxuICAgICovXG59O1xuXG5TaW1wbGVOdW1iZXIucHJvdG90eXBlID0ge1xuICAgIHNlYXJjaE5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc2VhcmNoTmFtZSB8fCB0aGlzLm9wdGlvbnMubmFtZTtcbiAgICB9LFxuXG4gICAgdmFsdWUocXVlcnkpIHtcbiAgICAgICAgcmV0dXJuIHF1ZXJ5W3RoaXMuc2VhcmNoTmFtZSgpXTtcbiAgICB9LFxuXG4gICAgZmllbGRzKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB7W3RoaXMuc2VhcmNoTmFtZSgpXTogdmFsdWV9O1xuICAgIH0sXG5cbiAgICByZW5kZXJWaWV3KHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBGaXhlZFN0cmluZ0Rpc3BsYXkoe1xuICAgICAgICAgICAgbmFtZTogdGhpcy5vcHRpb25zLm5hbWUsXG4gICAgICAgICAgICB0eXBlOiB0aGlzLm9wdGlvbnMudHlwZSxcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgbXVsdGlsaW5lOiB0aGlzLm9wdGlvbnMubXVsdGlsaW5lLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgcmVuZGVyRWRpdCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gRml4ZWRTdHJpbmdFZGl0KHtcbiAgICAgICAgICAgIG5hbWU6IHRoaXMub3B0aW9ucy5uYW1lLFxuICAgICAgICAgICAgdHlwZTogdGhpcy5vcHRpb25zLnR5cGUsXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIG11bHRpbGluZTogdGhpcy5vcHRpb25zLm11bHRpbGluZSxcbiAgICAgICAgICAgIGhpZGRlbjogdGhpcy5vcHRpb25zLmhpZGRlbixcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNjaGVtYSgpIHtcbiAgICAgICAgY29uc3QgdHlwZSA9IHtcbiAgICAgICAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgICAgICAgIGVzX2luZGV4ZWQ6IHRydWUsXG4gICAgICAgICAgICByZWNvbW1lbmRlZDogISF0aGlzLm9wdGlvbnMucmVjb21tZW5kZWQsXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5tdWx0aXBsZSA/IFt0eXBlXSA6IHR5cGU7XG4gICAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2ltcGxlTnVtYmVyO1xuIl19