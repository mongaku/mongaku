"use strict";

var tap = require("tap");

require("../../init");

var paramFilter = require("../../../logic/shared/param-filter");

tap.test("paramFilter - primary", { autoend: true }, function (t) {
    var query = {
        filter: "test"
    };

    t.same(paramFilter(query), {
        all: { filter: "test" },
        primary: ["filter"],
        secondary: {}
    });
});

tap.test("paramFilter - secondary", { autoend: true }, function (t) {
    var query = {
        filter: "test",
        start: 0
    };

    t.same(paramFilter(query), {
        all: { filter: "test" },
        primary: ["filter"],
        secondary: {}
    });

    query.start = 100;

    t.same(paramFilter(query), {
        all: { filter: "test" },
        primary: ["filter"],
        secondary: {
            start: 100
        }
    });

    // Test keepSecondary
    t.same(paramFilter(query, true), {
        all: { filter: "test", start: 100 },
        primary: ["filter"],
        secondary: {
            start: 100
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy90ZXN0cy9sb2dpYy9zaGFyZWQvcGFyYW0tZmlsdGVyLmpzIl0sIm5hbWVzIjpbInRhcCIsInJlcXVpcmUiLCJwYXJhbUZpbHRlciIsInRlc3QiLCJhdXRvZW5kIiwidCIsInF1ZXJ5IiwiZmlsdGVyIiwic2FtZSIsImFsbCIsInByaW1hcnkiLCJzZWNvbmRhcnkiLCJzdGFydCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxNQUFNQyxRQUFRLEtBQVIsQ0FBWjs7QUFFQUEsUUFBUSxZQUFSOztBQUVBLElBQU1DLGNBQWNELFFBQVEsb0NBQVIsQ0FBcEI7O0FBRUFELElBQUlHLElBQUosQ0FBUyx1QkFBVCxFQUFrQyxFQUFDQyxTQUFTLElBQVYsRUFBbEMsRUFBbUQsVUFBQ0MsQ0FBRCxFQUFPO0FBQ3RELFFBQU1DLFFBQVE7QUFDVkMsZ0JBQVE7QUFERSxLQUFkOztBQUlBRixNQUFFRyxJQUFGLENBQU9OLFlBQVlJLEtBQVosQ0FBUCxFQUEyQjtBQUN2QkcsYUFBSyxFQUFDRixRQUFRLE1BQVQsRUFEa0I7QUFFdkJHLGlCQUFTLENBQUMsUUFBRCxDQUZjO0FBR3ZCQyxtQkFBVztBQUhZLEtBQTNCO0FBS0gsQ0FWRDs7QUFZQVgsSUFBSUcsSUFBSixDQUFTLHlCQUFULEVBQW9DLEVBQUNDLFNBQVMsSUFBVixFQUFwQyxFQUFxRCxVQUFDQyxDQUFELEVBQU87QUFDeEQsUUFBTUMsUUFBUTtBQUNWQyxnQkFBUSxNQURFO0FBRVZLLGVBQU87QUFGRyxLQUFkOztBQUtBUCxNQUFFRyxJQUFGLENBQU9OLFlBQVlJLEtBQVosQ0FBUCxFQUEyQjtBQUN2QkcsYUFBSyxFQUFDRixRQUFRLE1BQVQsRUFEa0I7QUFFdkJHLGlCQUFTLENBQUMsUUFBRCxDQUZjO0FBR3ZCQyxtQkFBVztBQUhZLEtBQTNCOztBQU1BTCxVQUFNTSxLQUFOLEdBQWMsR0FBZDs7QUFFQVAsTUFBRUcsSUFBRixDQUFPTixZQUFZSSxLQUFaLENBQVAsRUFBMkI7QUFDdkJHLGFBQUssRUFBQ0YsUUFBUSxNQUFULEVBRGtCO0FBRXZCRyxpQkFBUyxDQUFDLFFBQUQsQ0FGYztBQUd2QkMsbUJBQVc7QUFDUEMsbUJBQU87QUFEQTtBQUhZLEtBQTNCOztBQVFBO0FBQ0FQLE1BQUVHLElBQUYsQ0FBT04sWUFBWUksS0FBWixFQUFtQixJQUFuQixDQUFQLEVBQWlDO0FBQzdCRyxhQUFLLEVBQUNGLFFBQVEsTUFBVCxFQUFpQkssT0FBTyxHQUF4QixFQUR3QjtBQUU3QkYsaUJBQVMsQ0FBQyxRQUFELENBRm9CO0FBRzdCQyxtQkFBVztBQUNQQyxtQkFBTztBQURBO0FBSGtCLEtBQWpDO0FBT0gsQ0E5QkQiLCJmaWxlIjoicGFyYW0tZmlsdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdGFwID0gcmVxdWlyZShcInRhcFwiKTtcblxucmVxdWlyZShcIi4uLy4uL2luaXRcIik7XG5cbmNvbnN0IHBhcmFtRmlsdGVyID0gcmVxdWlyZShcIi4uLy4uLy4uL2xvZ2ljL3NoYXJlZC9wYXJhbS1maWx0ZXJcIik7XG5cbnRhcC50ZXN0KFwicGFyYW1GaWx0ZXIgLSBwcmltYXJ5XCIsIHthdXRvZW5kOiB0cnVlfSwgKHQpID0+IHtcbiAgICBjb25zdCBxdWVyeSA9IHtcbiAgICAgICAgZmlsdGVyOiBcInRlc3RcIixcbiAgICB9O1xuXG4gICAgdC5zYW1lKHBhcmFtRmlsdGVyKHF1ZXJ5KSwge1xuICAgICAgICBhbGw6IHtmaWx0ZXI6IFwidGVzdFwifSxcbiAgICAgICAgcHJpbWFyeTogW1wiZmlsdGVyXCJdLFxuICAgICAgICBzZWNvbmRhcnk6IHt9LFxuICAgIH0pO1xufSk7XG5cbnRhcC50ZXN0KFwicGFyYW1GaWx0ZXIgLSBzZWNvbmRhcnlcIiwge2F1dG9lbmQ6IHRydWV9LCAodCkgPT4ge1xuICAgIGNvbnN0IHF1ZXJ5ID0ge1xuICAgICAgICBmaWx0ZXI6IFwidGVzdFwiLFxuICAgICAgICBzdGFydDogMCxcbiAgICB9O1xuXG4gICAgdC5zYW1lKHBhcmFtRmlsdGVyKHF1ZXJ5KSwge1xuICAgICAgICBhbGw6IHtmaWx0ZXI6IFwidGVzdFwifSxcbiAgICAgICAgcHJpbWFyeTogW1wiZmlsdGVyXCJdLFxuICAgICAgICBzZWNvbmRhcnk6IHt9LFxuICAgIH0pO1xuXG4gICAgcXVlcnkuc3RhcnQgPSAxMDA7XG5cbiAgICB0LnNhbWUocGFyYW1GaWx0ZXIocXVlcnkpLCB7XG4gICAgICAgIGFsbDoge2ZpbHRlcjogXCJ0ZXN0XCJ9LFxuICAgICAgICBwcmltYXJ5OiBbXCJmaWx0ZXJcIl0sXG4gICAgICAgIHNlY29uZGFyeToge1xuICAgICAgICAgICAgc3RhcnQ6IDEwMCxcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRlc3Qga2VlcFNlY29uZGFyeVxuICAgIHQuc2FtZShwYXJhbUZpbHRlcihxdWVyeSwgdHJ1ZSksIHtcbiAgICAgICAgYWxsOiB7ZmlsdGVyOiBcInRlc3RcIiwgc3RhcnQ6IDEwMH0sXG4gICAgICAgIHByaW1hcnk6IFtcImZpbHRlclwiXSxcbiAgICAgICAgc2Vjb25kYXJ5OiB7XG4gICAgICAgICAgICBzdGFydDogMTAwLFxuICAgICAgICB9LFxuICAgIH0pO1xufSk7XG4iXX0=