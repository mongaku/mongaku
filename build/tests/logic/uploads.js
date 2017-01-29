"use strict";

var fs = require("fs");
var path = require("path");

var tap = require("tap");
var request = require("request").defaults({ jar: true });

require("../init");

tap.test("Upload New Image", function (t) {
    var url = "http://localhost:3000/artworks/file-upload";
    var file = "bar.jpg";
    var formData = {
        file: {
            value: fs.createReadStream(path.resolve("testData", file)),
            options: {
                filename: file
            }
        }
    };
    request.post({
        url: url,
        formData: formData
    }, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 302);
        t.match(res.headers.location, "/artworks/uploads/2508884691");
        t.end();
    });
});

tap.test("Upload Existing Image", function (t) {
    var url = "http://localhost:3000/artworks/file-upload";
    var file = "foo.jpg";
    var formData = {
        file: {
            value: fs.createReadStream(path.resolve("testData", file)),
            options: {
                filename: file
            }
        }
    };
    request.post({
        url: url,
        formData: formData
    }, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 302);
        t.match(res.headers.location, "/artworks/uploads/4266906334");
        t.end();
    });
});

tap.test("Upload Corrupted Image", function (t) {
    var url = "http://localhost:3000/artworks/file-upload";
    var file = "corrupted.jpg";
    var formData = {
        file: {
            value: fs.createReadStream(path.resolve("testData", file)),
            options: {
                filename: file
            }
        }
    };
    request.post({
        url: url,
        formData: formData
    }, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 500);
        t.end();
    });
});

tap.test("Upload No Image", function (t) {
    var url = "http://localhost:3000/artworks/file-upload";
    var formData = {};
    request.post({
        url: url,
        formData: formData
    }, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 500);
        t.end();
    });
});

tap.test("Upload New Image From URL", function (t) {
    // TODO(jeresig): Change this to a local URL
    var uploadURL = encodeURIComponent("http://data.ukiyo-e.org/met/thumbs/2011_138_Strm1.jpg");
    var url = "http://localhost:3000/artworks/url-upload?url=" + uploadURL;

    request.get({
        url: url
    }, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.match(res.request.uri.href, "http://localhost:3000/artworks/uploads/516463693");
        t.end();
    });
});

tap.test("Upload No Image From URL", function (t) {
    var uploadURL = encodeURIComponent("http://");
    var url = "http://localhost:3000/artworks/url-upload?url=" + uploadURL;

    request.get({
        url: url
    }, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 500);
        t.end();
    });
});

tap.test("Upload Missing Image From URL", function (t) {
    var uploadURL = encodeURIComponent("http://localhost:3000/foo.jpg");
    var url = "http://localhost:3000/artworks/url-upload?url=" + uploadURL;

    request.get({
        url: url
    }, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 500);
        t.end();
    });
});

tap.test("View Upload", function (t) {
    var url = "http://localhost:3000/artworks/uploads/4266906334";
    request.get({
        url: url
    }, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("View Missing Upload", function (t) {
    var url = "http://localhost:3000/artworks/uploads/foo";
    request.get({
        url: url
    }, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 404);
        t.end();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0cy9sb2dpYy91cGxvYWRzLmpzIl0sIm5hbWVzIjpbImZzIiwicmVxdWlyZSIsInBhdGgiLCJ0YXAiLCJyZXF1ZXN0IiwiZGVmYXVsdHMiLCJqYXIiLCJ0ZXN0IiwidCIsInVybCIsImZpbGUiLCJmb3JtRGF0YSIsInZhbHVlIiwiY3JlYXRlUmVhZFN0cmVhbSIsInJlc29sdmUiLCJvcHRpb25zIiwiZmlsZW5hbWUiLCJwb3N0IiwiZXJyIiwicmVzIiwiZXJyb3IiLCJlcXVhbCIsInN0YXR1c0NvZGUiLCJtYXRjaCIsImhlYWRlcnMiLCJsb2NhdGlvbiIsImVuZCIsInVwbG9hZFVSTCIsImVuY29kZVVSSUNvbXBvbmVudCIsImdldCIsInVyaSIsImhyZWYiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsS0FBS0MsUUFBUSxJQUFSLENBQVg7QUFDQSxJQUFNQyxPQUFPRCxRQUFRLE1BQVIsQ0FBYjs7QUFFQSxJQUFNRSxNQUFNRixRQUFRLEtBQVIsQ0FBWjtBQUNBLElBQU1HLFVBQVVILFFBQVEsU0FBUixFQUFtQkksUUFBbkIsQ0FBNEIsRUFBQ0MsS0FBSyxJQUFOLEVBQTVCLENBQWhCOztBQUVBTCxRQUFRLFNBQVI7O0FBRUFFLElBQUlJLElBQUosQ0FBUyxrQkFBVCxFQUE2QixVQUFDQyxDQUFELEVBQU87QUFDaEMsUUFBTUMsTUFBTSw0Q0FBWjtBQUNBLFFBQU1DLE9BQU8sU0FBYjtBQUNBLFFBQU1DLFdBQVc7QUFDYkQsY0FBTTtBQUNGRSxtQkFBT1osR0FBR2EsZ0JBQUgsQ0FBb0JYLEtBQUtZLE9BQUwsQ0FBYSxVQUFiLEVBQXlCSixJQUF6QixDQUFwQixDQURMO0FBRUZLLHFCQUFTO0FBQ0xDLDBCQUFVTjtBQURMO0FBRlA7QUFETyxLQUFqQjtBQVFBTixZQUFRYSxJQUFSLENBQWE7QUFDVFIsZ0JBRFM7QUFFVEU7QUFGUyxLQUFiLEVBR0csVUFBQ08sR0FBRCxFQUFNQyxHQUFOLEVBQWM7QUFDYlgsVUFBRVksS0FB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LEdBQUY7QUFDSCxLQU5EO0FBT0gsQ0FURDs7QUFXQXZCLElBQUlJLElBQUosQ0FBUyxxQkFBVCxFQUFnQyxVQUFDQyxDQUFELEVBQU87QUFDbkMsUUFBTUMsTUFBTSw0Q0FBWjtBQUNBTCxZQUFReUIsR0FBUixDQUFZO0FBQ1JwQjtBQURRLEtBQVosRUFFRyxVQUFDUyxHQUFELEVBQU1DLEdBQU4sRUFBYztBQUNiWCxVQUFFWSxLQUFGLENBQVFGLEdBQVIsRUFBYSx3QkFBYjtBQUNBVixVQUFFYSxLQUFGLENBQVFGLElBQUlHLFVBQVosRUFBd0IsR0FBeEI7QUFDQWQsVUFBRWtCLEdBQUY7QUFDSCxLQU5EO0FBT0gsQ0FURCIsImZpbGUiOiJ1cGxvYWRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZnMgPSByZXF1aXJlKFwiZnNcIik7XG5jb25zdCBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XG5cbmNvbnN0IHRhcCA9IHJlcXVpcmUoXCJ0YXBcIik7XG5jb25zdCByZXF1ZXN0ID0gcmVxdWlyZShcInJlcXVlc3RcIikuZGVmYXVsdHMoe2phcjogdHJ1ZX0pO1xuXG5yZXF1aXJlKFwiLi4vaW5pdFwiKTtcblxudGFwLnRlc3QoXCJVcGxvYWQgTmV3IEltYWdlXCIsICh0KSA9PiB7XG4gICAgY29uc3QgdXJsID0gXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvYXJ0d29ya3MvZmlsZS11cGxvYWRcIjtcbiAgICBjb25zdCBmaWxlID0gXCJiYXIuanBnXCI7XG4gICAgY29uc3QgZm9ybURhdGEgPSB7XG4gICAgICAgIGZpbGU6IHtcbiAgICAgICAgICAgIHZhbHVlOiBmcy5jcmVhdGVSZWFkU3RyZWFtKHBhdGgucmVzb2x2ZShcInRlc3REYXRhXCIsIGZpbGUpKSxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBmaWxlbmFtZTogZmlsZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgfTtcbiAgICByZXF1ZXN0LnBvc3Qoe1xuICAgICAgICB1cmwsXG4gICAgICAgIGZvcm1EYXRhLFxuICAgIH0sIChlcnIsIHJlcykgPT4ge1xuICAgICAgICB0LmVycm9yKGVyciwgXCJFcnJvciBzaG91bGQgYmUgZW1wdHkuXCIpO1xuICAgICAgICB0LmVxdWFsKHJlcy5zdGF0dXNDb2RlLCAzMDIpO1xuICAgICAgICB0Lm1hdGNoKHJlcy5oZWFkZXJzLmxvY2F0aW9uLCBcIi9hcnR3b3Jrcy91cGxvYWRzLzI1MDg4ODQ2OTFcIik7XG4gICAgICAgIHQuZW5kKCk7XG4gICAgfSk7XG59KTtcblxudGFwLnRlc3QoXCJVcGxvYWQgRXhpc3RpbmcgSW1hZ2VcIiwgKHQpID0+IHtcbiAgICBjb25zdCB1cmwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcnR3b3Jrcy9maWxlLXVwbG9hZFwiO1xuICAgIGNvbnN0IGZpbGUgPSBcImZvby5qcGdcIjtcbiAgICBjb25zdCBmb3JtRGF0YSA9IHtcbiAgICAgICAgZmlsZToge1xuICAgICAgICAgICAgdmFsdWU6IGZzLmNyZWF0ZVJlYWRTdHJlYW0ocGF0aC5yZXNvbHZlKFwidGVzdERhdGFcIiwgZmlsZSkpLFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGZpbGVuYW1lOiBmaWxlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9O1xuICAgIHJlcXVlc3QucG9zdCh7XG4gICAgICAgIHVybCxcbiAgICAgICAgZm9ybURhdGEsXG4gICAgfSwgKGVyciwgcmVzKSA9PiB7XG4gICAgICAgIHQuZXJyb3IoZXJyLCBcIkVycm9yIHNob3VsZCBiZSBlbXB0eS5cIik7XG4gICAgICAgIHQuZXF1YWwocmVzLnN0YXR1c0NvZGUsIDMwMik7XG4gICAgICAgIHQubWF0Y2gocmVzLmhlYWRlcnMubG9jYXRpb24sIFwiL2FydHdvcmtzL3VwbG9hZHMvNDI2NjkwNjMzNFwiKTtcbiAgICAgICAgdC5lbmQoKTtcbiAgICB9KTtcbn0pO1xuXG50YXAudGVzdChcIlVwbG9hZCBDb3JydXB0ZWQgSW1hZ2VcIiwgKHQpID0+IHtcbiAgICBjb25zdCB1cmwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcnR3b3Jrcy9maWxlLXVwbG9hZFwiO1xuICAgIGNvbnN0IGZpbGUgPSBcImNvcnJ1cHRlZC5qcGdcIjtcbiAgICBjb25zdCBmb3JtRGF0YSA9IHtcbiAgICAgICAgZmlsZToge1xuICAgICAgICAgICAgdmFsdWU6IGZzLmNyZWF0ZVJlYWRTdHJlYW0ocGF0aC5yZXNvbHZlKFwidGVzdERhdGFcIiwgZmlsZSkpLFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGZpbGVuYW1lOiBmaWxlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9O1xuICAgIHJlcXVlc3QucG9zdCh7XG4gICAgICAgIHVybCxcbiAgICAgICAgZm9ybURhdGEsXG4gICAgfSwgKGVyciwgcmVzKSA9PiB7XG4gICAgICAgIHQuZXJyb3IoZXJyLCBcIkVycm9yIHNob3VsZCBiZSBlbXB0eS5cIik7XG4gICAgICAgIHQuZXF1YWwocmVzLnN0YXR1c0NvZGUsIDUwMCk7XG4gICAgICAgIHQuZW5kKCk7XG4gICAgfSk7XG59KTtcblxudGFwLnRlc3QoXCJVcGxvYWQgTm8gSW1hZ2VcIiwgKHQpID0+IHtcbiAgICBjb25zdCB1cmwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcnR3b3Jrcy9maWxlLXVwbG9hZFwiO1xuICAgIGNvbnN0IGZvcm1EYXRhID0ge307XG4gICAgcmVxdWVzdC5wb3N0KHtcbiAgICAgICAgdXJsLFxuICAgICAgICBmb3JtRGF0YSxcbiAgICB9LCAoZXJyLCByZXMpID0+IHtcbiAgICAgICAgdC5lcnJvcihlcnIsIFwiRXJyb3Igc2hvdWxkIGJlIGVtcHR5LlwiKTtcbiAgICAgICAgdC5lcXVhbChyZXMuc3RhdHVzQ29kZSwgNTAwKTtcbiAgICAgICAgdC5lbmQoKTtcbiAgICB9KTtcbn0pO1xuXG50YXAudGVzdChcIlVwbG9hZCBOZXcgSW1hZ2UgRnJvbSBVUkxcIiwgKHQpID0+IHtcbiAgICAvLyBUT0RPKGplcmVzaWcpOiBDaGFuZ2UgdGhpcyB0byBhIGxvY2FsIFVSTFxuICAgIGNvbnN0IHVwbG9hZFVSTCA9IGVuY29kZVVSSUNvbXBvbmVudChcbiAgICAgICAgXCJodHRwOi8vZGF0YS51a2l5by1lLm9yZy9tZXQvdGh1bWJzLzIwMTFfMTM4X1N0cm0xLmpwZ1wiKTtcbiAgICBjb25zdCB1cmwgPSBgaHR0cDovL2xvY2FsaG9zdDozMDAwL2FydHdvcmtzL3VybC11cGxvYWQ/dXJsPSR7dXBsb2FkVVJMfWA7XG5cbiAgICByZXF1ZXN0LmdldCh7XG4gICAgICAgIHVybCxcbiAgICB9LCAoZXJyLCByZXMpID0+IHtcbiAgICAgICAgdC5lcnJvcihlcnIsIFwiRXJyb3Igc2hvdWxkIGJlIGVtcHR5LlwiKTtcbiAgICAgICAgdC5lcXVhbChyZXMuc3RhdHVzQ29kZSwgMjAwKTtcbiAgICAgICAgdC5tYXRjaChyZXMucmVxdWVzdC51cmkuaHJlZixcbiAgICAgICAgICAgIFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL2FydHdvcmtzL3VwbG9hZHMvNTE2NDYzNjkzXCIpO1xuICAgICAgICB0LmVuZCgpO1xuICAgIH0pO1xufSk7XG5cbnRhcC50ZXN0KFwiVXBsb2FkIE5vIEltYWdlIEZyb20gVVJMXCIsICh0KSA9PiB7XG4gICAgY29uc3QgdXBsb2FkVVJMID0gZW5jb2RlVVJJQ29tcG9uZW50KFwiaHR0cDovL1wiKTtcbiAgICBjb25zdCB1cmwgPSBgaHR0cDovL2xvY2FsaG9zdDozMDAwL2FydHdvcmtzL3VybC11cGxvYWQ/dXJsPSR7dXBsb2FkVVJMfWA7XG5cbiAgICByZXF1ZXN0LmdldCh7XG4gICAgICAgIHVybCxcbiAgICB9LCAoZXJyLCByZXMpID0+IHtcbiAgICAgICAgdC5lcnJvcihlcnIsIFwiRXJyb3Igc2hvdWxkIGJlIGVtcHR5LlwiKTtcbiAgICAgICAgdC5lcXVhbChyZXMuc3RhdHVzQ29kZSwgNTAwKTtcbiAgICAgICAgdC5lbmQoKTtcbiAgICB9KTtcbn0pO1xuXG50YXAudGVzdChcIlVwbG9hZCBNaXNzaW5nIEltYWdlIEZyb20gVVJMXCIsICh0KSA9PiB7XG4gICAgY29uc3QgdXBsb2FkVVJMID0gZW5jb2RlVVJJQ29tcG9uZW50KFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL2Zvby5qcGdcIik7XG4gICAgY29uc3QgdXJsID0gYGh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcnR3b3Jrcy91cmwtdXBsb2FkP3VybD0ke3VwbG9hZFVSTH1gO1xuXG4gICAgcmVxdWVzdC5nZXQoe1xuICAgICAgICB1cmwsXG4gICAgfSwgKGVyciwgcmVzKSA9PiB7XG4gICAgICAgIHQuZXJyb3IoZXJyLCBcIkVycm9yIHNob3VsZCBiZSBlbXB0eS5cIik7XG4gICAgICAgIHQuZXF1YWwocmVzLnN0YXR1c0NvZGUsIDUwMCk7XG4gICAgICAgIHQuZW5kKCk7XG4gICAgfSk7XG59KTtcblxudGFwLnRlc3QoXCJWaWV3IFVwbG9hZFwiLCAodCkgPT4ge1xuICAgIGNvbnN0IHVybCA9IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL2FydHdvcmtzL3VwbG9hZHMvNDI2NjkwNjMzNFwiO1xuICAgIHJlcXVlc3QuZ2V0KHtcbiAgICAgICAgdXJsLFxuICAgIH0sIChlcnIsIHJlcykgPT4ge1xuICAgICAgICB0LmVycm9yKGVyciwgXCJFcnJvciBzaG91bGQgYmUgZW1wdHkuXCIpO1xuICAgICAgICB0LmVxdWFsKHJlcy5zdGF0dXNDb2RlLCAyMDApO1xuICAgICAgICB0LmVuZCgpO1xuICAgIH0pO1xufSk7XG5cbnRhcC50ZXN0KFwiVmlldyBNaXNzaW5nIFVwbG9hZFwiLCAodCkgPT4ge1xuICAgIGNvbnN0IHVybCA9IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL2FydHdvcmtzL3VwbG9hZHMvZm9vXCI7XG4gICAgcmVxdWVzdC5nZXQoe1xuICAgICAgICB1cmwsXG4gICAgfSwgKGVyciwgcmVzKSA9PiB7XG4gICAgICAgIHQuZXJyb3IoZXJyLCBcIkVycm9yIHNob3VsZCBiZSBlbXB0eS5cIik7XG4gICAgICAgIHQuZXF1YWwocmVzLnN0YXR1c0NvZGUsIDQwNCk7XG4gICAgICAgIHQuZW5kKCk7XG4gICAgfSk7XG59KTtcbiJdfQ==