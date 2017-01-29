"use strict";

var db = require("./db");
var options = require("./options");

var types = {
    Name: require("../schemas/types/Name.js"),
    YearRange: require("../schemas/types/YearRange.js"),
    FixedString: require("../schemas/types/FixedString.js"),
    SimpleString: require("../schemas/types/SimpleString.js"),
    SimpleNumber: require("../schemas/types/SimpleNumber.js"),
    SimpleDate: require("../schemas/types/SimpleDate.js"),
    Dimension: require("../schemas/types/Dimension.js"),
    Location: require("../schemas/types/Location.js"),
    LinkedRecord: require("../schemas/types/LinkedRecord.js")
};

module.exports = {
    model: function model(type) {
        if (!options.types[type]) {
            throw new Error("Type " + type + " not found.");
        }

        var model = {};
        var modelType = options.types[type].model;

        for (var name in modelType) {
            var settings = Object.assign({}, modelType[name]);
            var Type = types[settings.type];
            settings.name = name;
            settings.type = type;
            model[name] = new Type(settings);
        }

        return model;
    },
    schemas: function schemas(type) {
        var model = this.model(type);
        var schemas = {};

        for (var modelName in model) {
            schemas[modelName] = model[modelName].schema(db.schema);
        }

        return schemas;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvbWV0YWRhdGEuanMiXSwibmFtZXMiOlsiZGIiLCJyZXF1aXJlIiwib3B0aW9ucyIsInR5cGVzIiwiTmFtZSIsIlllYXJSYW5nZSIsIkZpeGVkU3RyaW5nIiwiU2ltcGxlU3RyaW5nIiwiU2ltcGxlTnVtYmVyIiwiU2ltcGxlRGF0ZSIsIkRpbWVuc2lvbiIsIkxvY2F0aW9uIiwiTGlua2VkUmVjb3JkIiwibW9kdWxlIiwiZXhwb3J0cyIsIm1vZGVsIiwidHlwZSIsIkVycm9yIiwibW9kZWxUeXBlIiwibmFtZSIsInNldHRpbmdzIiwiT2JqZWN0IiwiYXNzaWduIiwiVHlwZSIsInNjaGVtYXMiLCJtb2RlbE5hbWUiLCJzY2hlbWEiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsS0FBS0MsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFNQyxVQUFVRCxRQUFRLFdBQVIsQ0FBaEI7O0FBRUEsSUFBTUUsUUFBUTtBQUNWQyxVQUFNSCxRQUFRLDBCQUFSLENBREk7QUFFVkksZUFBV0osUUFBUSwrQkFBUixDQUZEO0FBR1ZLLGlCQUFhTCxRQUFRLGlDQUFSLENBSEg7QUFJVk0sa0JBQWNOLFFBQVEsa0NBQVIsQ0FKSjtBQUtWTyxrQkFBY1AsUUFBUSxrQ0FBUixDQUxKO0FBTVZRLGdCQUFZUixRQUFRLGdDQUFSLENBTkY7QUFPVlMsZUFBV1QsUUFBUSwrQkFBUixDQVBEO0FBUVZVLGNBQVVWLFFBQVEsOEJBQVIsQ0FSQTtBQVNWVyxrQkFBY1gsUUFBUSxrQ0FBUjtBQVRKLENBQWQ7O0FBWUFZLE9BQU9DLE9BQVAsR0FBaUI7QUFDYkMsU0FEYSxpQkFDUEMsSUFETyxFQUNEO0FBQ1IsWUFBSSxDQUFDZCxRQUFRQyxLQUFSLENBQWNhLElBQWQsQ0FBTCxFQUEwQjtBQUN0QixrQkFBTSxJQUFJQyxLQUFKLFdBQWtCRCxJQUFsQixpQkFBTjtBQUNIOztBQUVELFlBQU1ELFFBQVEsRUFBZDtBQUNBLFlBQU1HLFlBQVloQixRQUFRQyxLQUFSLENBQWNhLElBQWQsRUFBb0JELEtBQXRDOztBQUVBLGFBQUssSUFBTUksSUFBWCxJQUFtQkQsU0FBbkIsRUFBOEI7QUFDMUIsZ0JBQU1FLFdBQVdDLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCSixVQUFVQyxJQUFWLENBQWxCLENBQWpCO0FBQ0EsZ0JBQU1JLE9BQU9wQixNQUFNaUIsU0FBU0osSUFBZixDQUFiO0FBQ0FJLHFCQUFTRCxJQUFULEdBQWdCQSxJQUFoQjtBQUNBQyxxQkFBU0osSUFBVCxHQUFnQkEsSUFBaEI7QUFDQUQsa0JBQU1JLElBQU4sSUFBYyxJQUFJSSxJQUFKLENBQVNILFFBQVQsQ0FBZDtBQUNIOztBQUVELGVBQU9MLEtBQVA7QUFDSCxLQWxCWTtBQW9CYlMsV0FwQmEsbUJBb0JMUixJQXBCSyxFQW9CQztBQUNWLFlBQU1ELFFBQVEsS0FBS0EsS0FBTCxDQUFXQyxJQUFYLENBQWQ7QUFDQSxZQUFNUSxVQUFVLEVBQWhCOztBQUVBLGFBQUssSUFBTUMsU0FBWCxJQUF3QlYsS0FBeEIsRUFBK0I7QUFDM0JTLG9CQUFRQyxTQUFSLElBQXFCVixNQUFNVSxTQUFOLEVBQWlCQyxNQUFqQixDQUF3QjFCLEdBQUcwQixNQUEzQixDQUFyQjtBQUNIOztBQUVELGVBQU9GLE9BQVA7QUFDSDtBQTdCWSxDQUFqQiIsImZpbGUiOiJtZXRhZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGRiID0gcmVxdWlyZShcIi4vZGJcIik7XG5jb25zdCBvcHRpb25zID0gcmVxdWlyZShcIi4vb3B0aW9uc1wiKTtcblxuY29uc3QgdHlwZXMgPSB7XG4gICAgTmFtZTogcmVxdWlyZShcIi4uL3NjaGVtYXMvdHlwZXMvTmFtZS5qc1wiKSxcbiAgICBZZWFyUmFuZ2U6IHJlcXVpcmUoXCIuLi9zY2hlbWFzL3R5cGVzL1llYXJSYW5nZS5qc1wiKSxcbiAgICBGaXhlZFN0cmluZzogcmVxdWlyZShcIi4uL3NjaGVtYXMvdHlwZXMvRml4ZWRTdHJpbmcuanNcIiksXG4gICAgU2ltcGxlU3RyaW5nOiByZXF1aXJlKFwiLi4vc2NoZW1hcy90eXBlcy9TaW1wbGVTdHJpbmcuanNcIiksXG4gICAgU2ltcGxlTnVtYmVyOiByZXF1aXJlKFwiLi4vc2NoZW1hcy90eXBlcy9TaW1wbGVOdW1iZXIuanNcIiksXG4gICAgU2ltcGxlRGF0ZTogcmVxdWlyZShcIi4uL3NjaGVtYXMvdHlwZXMvU2ltcGxlRGF0ZS5qc1wiKSxcbiAgICBEaW1lbnNpb246IHJlcXVpcmUoXCIuLi9zY2hlbWFzL3R5cGVzL0RpbWVuc2lvbi5qc1wiKSxcbiAgICBMb2NhdGlvbjogcmVxdWlyZShcIi4uL3NjaGVtYXMvdHlwZXMvTG9jYXRpb24uanNcIiksXG4gICAgTGlua2VkUmVjb3JkOiByZXF1aXJlKFwiLi4vc2NoZW1hcy90eXBlcy9MaW5rZWRSZWNvcmQuanNcIiksXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBtb2RlbCh0eXBlKSB7XG4gICAgICAgIGlmICghb3B0aW9ucy50eXBlc1t0eXBlXSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUeXBlICR7dHlwZX0gbm90IGZvdW5kLmApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbW9kZWwgPSB7fTtcbiAgICAgICAgY29uc3QgbW9kZWxUeXBlID0gb3B0aW9ucy50eXBlc1t0eXBlXS5tb2RlbDtcblxuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gbW9kZWxUeXBlKSB7XG4gICAgICAgICAgICBjb25zdCBzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIG1vZGVsVHlwZVtuYW1lXSk7XG4gICAgICAgICAgICBjb25zdCBUeXBlID0gdHlwZXNbc2V0dGluZ3MudHlwZV07XG4gICAgICAgICAgICBzZXR0aW5ncy5uYW1lID0gbmFtZTtcbiAgICAgICAgICAgIHNldHRpbmdzLnR5cGUgPSB0eXBlO1xuICAgICAgICAgICAgbW9kZWxbbmFtZV0gPSBuZXcgVHlwZShzZXR0aW5ncyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbW9kZWw7XG4gICAgfSxcblxuICAgIHNjaGVtYXModHlwZSkge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHRoaXMubW9kZWwodHlwZSk7XG4gICAgICAgIGNvbnN0IHNjaGVtYXMgPSB7fTtcblxuICAgICAgICBmb3IgKGNvbnN0IG1vZGVsTmFtZSBpbiBtb2RlbCkge1xuICAgICAgICAgICAgc2NoZW1hc1ttb2RlbE5hbWVdID0gbW9kZWxbbW9kZWxOYW1lXS5zY2hlbWEoZGIuc2NoZW1hKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzY2hlbWFzO1xuICAgIH0sXG59O1xuIl19