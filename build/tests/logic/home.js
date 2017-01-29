"use strict";

var tap = require("tap");
var request = require("request");

require("../init");

tap.test("Home Page", function (t) {
    var url = "http://localhost:3000/";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0cy9sb2dpYy9ob21lLmpzIl0sIm5hbWVzIjpbInRhcCIsInJlcXVpcmUiLCJyZXF1ZXN0IiwidGVzdCIsInQiLCJ1cmwiLCJnZXQiLCJlcnIiLCJyZXMiLCJlcnJvciIsImVxdWFsIiwic3RhdHVzQ29kZSIsImVuZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxNQUFNQyxRQUFRLEtBQVIsQ0FBWjtBQUNBLElBQU1DLFVBQVVELFFBQVEsU0FBUixDQUFoQjs7QUFFQUEsUUFBUSxTQUFSOztBQUVBRCxJQUFJRyxJQUFKLENBQVMsV0FBVCxFQUFzQixVQUFDQyxDQUFELEVBQU87QUFDekIsUUFBTUMsTUFBTSx3QkFBWjtBQUNBSCxZQUFRSSxHQUFSLENBQVlELEdBQVosRUFBaUIsVUFBQ0UsR0FBRCxFQUFNQyxHQUFOLEVBQWM7QUFDM0JKLFVBQUVLLEtBQUYsQ0FBUUYsR0FBUixFQUFhLHdCQUFiO0FBQ0FILFVBQUVNLEtBQUYsQ0FBUUYsSUFBSUcsVUFBWixFQUF3QixHQUF4QjtBQUNBUCxVQUFFUSxHQUFGO0FBQ0gsS0FKRDtBQUtILENBUEQiLCJmaWxlIjoiaG9tZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHRhcCA9IHJlcXVpcmUoXCJ0YXBcIik7XG5jb25zdCByZXF1ZXN0ID0gcmVxdWlyZShcInJlcXVlc3RcIik7XG5cbnJlcXVpcmUoXCIuLi9pbml0XCIpO1xuXG50YXAudGVzdChcIkhvbWUgUGFnZVwiLCAodCkgPT4ge1xuICAgIGNvbnN0IHVybCA9IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL1wiO1xuICAgIHJlcXVlc3QuZ2V0KHVybCwgKGVyciwgcmVzKSA9PiB7XG4gICAgICAgIHQuZXJyb3IoZXJyLCBcIkVycm9yIHNob3VsZCBiZSBlbXB0eS5cIik7XG4gICAgICAgIHQuZXF1YWwocmVzLnN0YXR1c0NvZGUsIDIwMCk7XG4gICAgICAgIHQuZW5kKCk7XG4gICAgfSk7XG59KTtcbiJdfQ==