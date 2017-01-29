"use strict";

var path = require("path");

var tap = require("tap");

var init = require("../init");
var UploadImage = init.UploadImage;

tap.test("getFilePath", { autoend: true }, function (t) {
    var image = init.getUploadImage();
    t.equal(image.getFilePath(), path.resolve(process.cwd(), "data/uploads/images/4266906334.jpg"), "Check file path");
});

tap.test("getOriginalURL", { autoend: true }, function (t) {
    var image = init.getUploadImage();
    t.equal(image.getOriginalURL(), "/data/uploads/images/4266906334.jpg", "Check UploadImage URL");
});

tap.test("getScaledURL", { autoend: true }, function (t) {
    var image = init.getUploadImage();
    t.equal(image.getScaledURL(), "/data/uploads/scaled/4266906334.jpg", "Check Scaled URL");
});

tap.test("getThumbURL", { autoend: true }, function (t) {
    var image = init.getUploadImage();
    t.equal(image.getThumbURL(), "/data/uploads/thumbs/4266906334.jpg", "Check Thumb URL");
});

tap.test("updateSimilarity: New UploadImage", function (t) {
    var image = new UploadImage({
        _id: "uploads/614431508.jpg",
        source: "uploads",
        fileName: "614431508.jpg",
        hash: "614431508",
        width: 100,
        height: 100
    });

    var oldSimilar = image.similarImages;
    image.updateSimilarity(function (err) {
        t.error(err, "No error should be thrown.");
        t.notEqual(image.similarImages, oldSimilar, "Similarity updated.");
        t.equal(image.similarImages.length, 1, "Has the correct number of results.");
        t.same(image.similarImages[0].toJSON(), { _id: "test/bar.jpg", score: 9 }, "Has the correct result.");
        t.end();
    });
});

tap.test("updateSimilarity: Existing UploadImage", function (t) {
    var image = init.getUploadImage();
    var oldSimilar = image.similarImages;
    image.updateSimilarity(function (err) {
        t.error(err, "No error should be thrown.");
        t.notEqual(image.similarImages, oldSimilar, "Similarity updated.");
        t.equal(image.similarImages.length, 1, "Has the correct number of results.");
        t.same(image.similarImages[0].toJSON(), { _id: "test/bar.jpg", score: 10 }, "Has the correct result.");
        t.end();
    });
});

tap.test("UploadImage.fromFile: New UploadImage", function (t) {
    var testFile = path.resolve(process.cwd(), "testData", "new1.jpg");

    UploadImage.fromFile(testFile, function (err, image) {
        t.error(err, "No error should be thrown.");
        t.ok(image, "UploadImage exists.");
        // TODO: Test that files exist.
        // Test that files are the right dimensions.
        t.end();
    });
});

tap.test("UploadImage.fromFile: New UploadImage (Empty File)", function (t) {
    var testFile = path.resolve(process.cwd(), "testData", "empty.jpg");

    UploadImage.fromFile(testFile, function (err, image) {
        t.ok(err, "Has error object.");
        t.equal(err.message, "EMPTY_IMAGE", "Has error message.");
        t.notOk(image, "No image object");
        t.end();
    });
});

tap.test("UploadImage.fromFile: New UploadImage (Corrupted File)", function (t) {
    var testFile = path.resolve(process.cwd(), "testData", "corrupted.jpg");

    UploadImage.fromFile(testFile, function (err, image) {
        t.ok(err, "Has error object.");
        t.equal(err.message, "MALFORMED_IMAGE", "Has error message.");
        t.notOk(image, "No image object");
        t.end();
    });
});

tap.test("UploadImage.fromFile: New UploadImage (Small File)", function (t) {
    var testFile = path.resolve(process.cwd(), "testData", "small.jpg");

    UploadImage.fromFile(testFile, function (err, image) {
        t.ok(err, "Has error object.");
        t.equal(err.message, "TOO_SMALL", "Has error message.");
        t.notOk(image, "No image object");
        t.end();
    });
});

tap.test("UploadImage.fromFile: Updating UploadImage", function (t) {
    var testFile = path.resolve(process.cwd(), "testData", "foo.jpg");

    UploadImage.fromFile(testFile, function (err, image) {
        t.error(err, "No error should be thrown.");
        t.ok(image, "UploadImage exists.");
        t.end();
    });
});

tap.test("UploadImage.fromFile: Updating (files already exist)", function (t) {
    var testFile = path.resolve(process.cwd(), "testData", "foo.jpg");

    UploadImage.fromFile(testFile, function () {
        // Run this twice to have the images be put into place already
        UploadImage.fromFile(testFile, function (err, image) {
            t.error(err, "No error should be thrown.");
            t.ok(image, "UploadImage exists.");
            t.end();
        });
    });
});