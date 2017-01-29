"use strict";

var tap = require("tap");

var init = require("../init");
var req = init.req;

tap.test("getURL", { autoend: true }, function (t) {
    var upload = init.getUpload();
    t.equal(upload.getURL("en"), "/artworks/uploads/4266906334", "Check 'en' URL");

    t.equal(upload.getURL("de"), "/artworks/uploads/4266906334?lang=de", "Check 'de' URL");
});

tap.test("getThumbURL", { autoend: true }, function (t) {
    var upload = init.getUpload();
    t.equal(upload.getThumbURL(), "/data/uploads/thumbs/4266906334.jpg", "Check Thumb URL");
});

tap.test("getTitle", { autoend: true }, function (t) {
    var upload = init.getUpload();
    t.equal(upload.getTitle(req), "Uploaded Image", "Check Title");
});

tap.test("updateSimilarity", function (t) {
    var upload = init.getUpload();
    upload.updateSimilarity(function (err) {
        t.error(err, "Error should be empty.");
        t.equal(upload.similarRecords.length, 1, "Correct number of matches.");
        t.same(upload.similarRecords[0].toJSON(), {
            _id: "test/1235",
            record: "test/1235",
            score: 10,
            source: "test",
            images: ["test/bar.jpg"]
        }, "Check similar upload result");
        t.end();
    });
});

tap.test("updateSimilarity with no similar", function (t) {
    var upload = init.getUpload();
    var uploadImage = init.getUploadImage();
    uploadImage.similarImages = [];

    upload.updateSimilarity(function (err) {
        t.error(err, "Error should be empty.");
        t.equal(upload.similarRecords.length, 0, "Correct number of matches.");
        t.end();
    });
});