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