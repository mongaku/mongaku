"use strict";

var fs = require("fs");
var path = require("path");

var tap = require("tap");
var request = require("request").defaults({ jar: true });

require("../init");

var login = function login(email, callback) {
    request.post({
        url: "http://localhost:3000/login",
        form: {
            email: email,
            password: "test"
        }
    }, callback);
};

var adminLogin = function adminLogin(callback) {
    return login("test@test.com", callback);
};
var normalLogin = function normalLogin(callback) {
    return login("normal@test.com", callback);
};

tap.test("Admin Page", function (t) {
    adminLogin(function () {
        var url = "http://localhost:3000/artworks/source/test/admin";
        request.get(url, function (err, res) {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Admin Page (Logged Out)", function (t) {
    var url = "http://localhost:3000/artworks/source/test/admin";
    request.get(url, function (err, res) {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.match(res.request.uri.href, "http://localhost:3000/login");
        t.end();
    });
});

tap.test("Admin Page (Unauthorized User)", function (t) {
    normalLogin(function () {
        var url = "http://localhost:3000/artworks/source/test/admin";
        request.get(url, function (err, res) {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 500);
            t.end();
        });
    });
});

tap.test("Record Import Page", function (t) {
    adminLogin(function () {
        var url = "http://localhost:3000/artworks/source/test/admin" + "?records=test/started";
        request.get(url, function (err, res) {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Record Import Page (Completed)", function (t) {
    adminLogin(function () {
        var url = "http://localhost:3000/artworks/source/test/admin" + "?records=test/completed";
        request.get(url, function (err, res) {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Record Import Page (Error)", function (t) {
    adminLogin(function () {
        var url = "http://localhost:3000/artworks/source/test/admin" + "?records=test/error";
        request.get(url, function (err, res) {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Record Import Page (Missing)", function (t) {
    adminLogin(function () {
        var url = "http://localhost:3000/artworks/source/test/admin" + "?records=test/foo";
        request.get(url, function (err, res) {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 404);
            t.end();
        });
    });
});

tap.test("Record Import Finalize", function (t) {
    adminLogin(function () {
        var url = "http://localhost:3000/artworks/source/test/admin" + "?records=test/started&finalize=true";
        request.get(url, function (err, res) {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.match(res.request.uri.href, "http://localhost:3000/artworks/source/test/admin");
            t.end();
        });
    });
});

tap.test("Record Import Abandon", function (t) {
    adminLogin(function () {
        var url = "http://localhost:3000/artworks/source/test/admin" + "?records=test/started&abandon=true";
        request.get(url, function (err, res) {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.match(res.request.uri.href, "http://localhost:3000/artworks/source/test/admin");
            t.end();
        });
    });
});

tap.test("Image Import Page", function (t) {
    adminLogin(function () {
        var url = "http://localhost:3000/artworks/source/test/admin" + "?images=test/started";
        request.get(url, function (err, res) {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Image Import Page (Completed)", function (t) {
    adminLogin(function () {
        var url = "http://localhost:3000/artworks/source/test/admin" + "?images=test/completed";
        request.get(url, function (err, res) {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Image Import Page (Completed, Expanded)", function (t) {
    adminLogin(function () {
        var url = "http://localhost:3000/artworks/source/test/admin" + "?images=test/completed&expanded=models";
        request.get(url, function (err, res) {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Image Import Page (Error)", function (t) {
    adminLogin(function () {
        var url = "http://localhost:3000/artworks/source/test/admin" + "?images=test/error";
        request.get(url, function (err, res) {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Image Import Page (Missing)", function (t) {
    adminLogin(function () {
        var url = "http://localhost:3000/artworks/source/test/admin" + "?images=test/foo";
        request.get(url, function (err, res) {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 404);
            t.end();
        });
    });
});

tap.test("uploadData: Source not found", function (t) {
    adminLogin(function () {
        var url = "http://localhost:3000/artworks/source/foo/upload-data";
        var formData = {};
        request.post({ url: url, formData: formData }, function (err, res) {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 404);
            t.end();
        });
    });
});

tap.test("uploadData: No files", function (t) {
    adminLogin(function () {
        var url = "http://localhost:3000/artworks/source/test/upload-data";
        var formData = {};
        request.post({ url: url, formData: formData }, function (err, res, body) {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 500);
            t.match(body, "No data files specified.");
            t.end();
        });
    });
});

tap.test("uploadData: File Error", function (t) {
    adminLogin(function () {
        var url = "http://localhost:3000/artworks/source/test/upload-data";
        var file = "default-error.json";
        var formData = {
            files: {
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
            t.match(res.headers.location, "/artworks/source/test/admin");
            t.end();
        });
    });
});

tap.test("uploadData: Default File", function (t) {
    adminLogin(function () {
        var url = "http://localhost:3000/artworks/source/test/upload-data";
        var file = "default.json";
        var formData = {
            files: {
                value: fs.createReadStream(path.resolve("testData", file)),
                options: {
                    filename: file
                }
            }
        };
        request.post({
            url: url,
            formData: formData
        }, function (err, res, body) {
            console.log(body);
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 302);
            t.match(res.headers.location, "/artworks/source/test/admin");
            t.end();
        });
    });
});

tap.test("uploadImages: Source not found", function (t) {
    adminLogin(function () {
        var url = "http://localhost:3000/artworks/source/foo/upload-images";
        var formData = {};
        request.post({ url: url, formData: formData }, function (err, res) {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 404);
            t.end();
        });
    });
});

tap.test("uploadImages: No files", function (t) {
    adminLogin(function () {
        var url = "http://localhost:3000/artworks/source/test/upload-images";
        var formData = {};
        request.post({ url: url, formData: formData }, function (err, res, body) {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 500);
            t.match(body, "No zip file specified.");
            t.end();
        });
    });
});

tap.test("uploadImages: Empty Zip", function (t) {
    adminLogin(function () {
        var url = "http://localhost:3000/artworks/source/test/upload-images";
        var file = "empty.zip";
        var formData = {
            zipField: {
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
            t.match(res.headers.location, "/artworks/source/test/admin");
            t.end();
        });
    });
});

tap.test("uploadImages: Corrupted Zip", function (t) {
    adminLogin(function () {
        var url = "http://localhost:3000/artworks/source/test/upload-images";
        var file = "corrupted.zip";
        var formData = {
            zipField: {
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
            t.match(res.headers.location, "/artworks/source/test/admin");
            t.end();
        });
    });
});

tap.test("uploadImages: Normal Zip", function (t) {
    adminLogin(function () {
        var url = "http://localhost:3000/artworks/source/test/upload-images";
        var file = "test.zip";
        var formData = {
            zipField: {
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
            t.match(res.headers.location, "/artworks/source/test/admin");
            t.end();
        });
    });
});