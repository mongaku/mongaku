"use strict";

var jsonlint = require("jsonlint");
var concat = require("concat-stream");

module.exports = {
    files: ["Upload a JSON file (.json) containing metadata."],

    processFiles: function processFiles(files, callback) {
        files[0].pipe(concat(function (fileData) {
            try {
                var results = jsonlint.parse(fileData.toString("utf8"));
                callback(null, results);
            } catch (err) {
                callback(err);
            }
        }));
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZGVmYXVsdC1jb252ZXJ0ZXIuanMiXSwibmFtZXMiOlsianNvbmxpbnQiLCJyZXF1aXJlIiwiY29uY2F0IiwibW9kdWxlIiwiZXhwb3J0cyIsImZpbGVzIiwicHJvY2Vzc0ZpbGVzIiwiY2FsbGJhY2siLCJwaXBlIiwiZmlsZURhdGEiLCJyZXN1bHRzIiwicGFyc2UiLCJ0b1N0cmluZyIsImVyciJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxXQUFXQyxRQUFRLFVBQVIsQ0FBakI7QUFDQSxJQUFNQyxTQUFTRCxRQUFRLGVBQVIsQ0FBZjs7QUFFQUUsT0FBT0MsT0FBUCxHQUFpQjtBQUNiQyxXQUFPLENBQ0gsaURBREcsQ0FETTs7QUFLYkMsZ0JBTGEsd0JBS0FELEtBTEEsRUFLT0UsUUFMUCxFQUtpQjtBQUMxQkYsY0FBTSxDQUFOLEVBQVNHLElBQVQsQ0FBY04sT0FBTyxVQUFDTyxRQUFELEVBQWM7QUFDL0IsZ0JBQUk7QUFDQSxvQkFBTUMsVUFBVVYsU0FBU1csS0FBVCxDQUFlRixTQUFTRyxRQUFULENBQWtCLE1BQWxCLENBQWYsQ0FBaEI7QUFDQUwseUJBQVMsSUFBVCxFQUFlRyxPQUFmO0FBQ0gsYUFIRCxDQUdFLE9BQU9HLEdBQVAsRUFBWTtBQUNWTix5QkFBU00sR0FBVDtBQUNIO0FBQ0osU0FQYSxDQUFkO0FBUUg7QUFkWSxDQUFqQiIsImZpbGUiOiJkZWZhdWx0LWNvbnZlcnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGpzb25saW50ID0gcmVxdWlyZShcImpzb25saW50XCIpO1xuY29uc3QgY29uY2F0ID0gcmVxdWlyZShcImNvbmNhdC1zdHJlYW1cIik7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGZpbGVzOiBbXG4gICAgICAgIFwiVXBsb2FkIGEgSlNPTiBmaWxlICguanNvbikgY29udGFpbmluZyBtZXRhZGF0YS5cIixcbiAgICBdLFxuXG4gICAgcHJvY2Vzc0ZpbGVzKGZpbGVzLCBjYWxsYmFjaykge1xuICAgICAgICBmaWxlc1swXS5waXBlKGNvbmNhdCgoZmlsZURhdGEpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0cyA9IGpzb25saW50LnBhcnNlKGZpbGVEYXRhLnRvU3RyaW5nKFwidXRmOFwiKSk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgfSxcbn07XG4iXX0=