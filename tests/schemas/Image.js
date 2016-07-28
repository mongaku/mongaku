"use strict";

const path = require("path");

const tap = require("tap");

const init = require("../init");
const Image = init.Image;
const ImageImport = init.ImageImport;

tap.test("getFilePath", {autoend: true}, (t) => {
    const image = init.getImage();
    t.equal(image.getFilePath(),
        path.resolve(process.cwd(), "data/test/images/4266906334.jpg"),
        "Check file path");
});

tap.test("getOriginalURL", {autoend: true}, (t) => {
    const image = init.getImage();
    t.equal(image.getOriginalURL(),
        "/data/test/images/4266906334.jpg", "Check Image URL");
});

tap.test("getScaledURL", {autoend: true}, (t) => {
    const image = init.getImage();
    t.equal(image.getScaledURL(),
        "/data/test/scaled/4266906334.jpg", "Check Scaled URL");
});

tap.test("getThumbURL", {autoend: true}, (t) => {
    const image = init.getImage();
    t.equal(image.getThumbURL(),
        "/data/test/thumbs/4266906334.jpg", "Check Thumb URL");
});

tap.test("getSource", {autoend: true}, (t) => {
    const image = init.getImage();
    const source = init.getSource();
    t.equal(image.getSource(), source, "Get Source");
});

tap.test("updateSimilarity: Existing Image", (t) => {
    const image = init.getImage();
    const oldSimilar = image.similarImages.slice(0);
    image.updateSimilarity((err) => {
        t.error(err, "No error should be thrown.");
        t.notEqual(image.similarImages, oldSimilar, "Similarity updated.");
        t.equal(image.similarImages.length, 1,
            "Has the correct number of results.");
        t.same(image.similarImages[0].toJSON(),
            {_id: "test/bar.jpg", score: 10},
            "Has the correct result.");
        t.end();
    });
});

tap.test("updateSimilarity: Missing Image", (t) => {
    const image = new Image({
        _id: "test/foo",
        source: "test",
        fileName: "sadfasdfds.jpg",
        hash: "99999",
        width: 115,
        height: 115,
    });

    const oldSimilar = image.similarImages;
    image.updateSimilarity((err) => {
        t.error(err, "No error should be thrown.");
        t.equal(image.similarImages, oldSimilar, "Similarity not updated.");
        t.end();
    });
});

tap.test("indexSimilarity: Existing Image", (t) => {
    const image = init.getImage();
    image.indexSimilarity((err, indexed) => {
        t.error(err, "No error should be thrown.");
        t.equal(indexed, true, "Image is indexed.");
        t.end();
    });
});

tap.test("indexSimilarity: Missing Image", (t) => {
    const image = new Image({
        _id: "test/foo",
        source: "test",
        fileName: "sadfasdfds.jpg",
        hash: "99999",
        width: 115,
        height: 115,
    });

    image.indexSimilarity((err, indexed) => {
        t.error(err, "No error should be thrown.");
        t.equal(indexed, true, "Image is indexed.");
        t.end();
    });
});

tap.test("indexSimilarity: Small Image", (t) => {
    const image = new Image({
        _id: "test/foo2",
        source: "test",
        fileName: "sadfasdfds2.jpg",
        hash: "99998",
        width: 90,
        height: 90,
    });

    image.indexSimilarity((err, indexed) => {
        t.error(err, "No error should be thrown.");
        t.equal(indexed, undefined, "Image is not indexed.");
        t.end();
    });
});

tap.test("Image.fromFile: New Image", (t) => {
    const batch = new ImageImport({
        _id: "testBatch",
        source: "test",
    });

    const testFile = path.resolve(process.cwd(), "testData", "new1.jpg");

    Image.fromFile(batch, testFile, (err, image, warnings) => {
        t.error(err, "No error should be thrown.");
        t.ok(image, "Image exists.");
        t.equal(warnings.length, 0, "No warnings.");
        // TODO: Test that files exist.
        // Test that files are the right dimensions.
        t.end();
    });
});

tap.test("Image.fromFile: New Image (Empty File)", (t) => {
    const batch = new ImageImport({
        _id: "testBatch",
        source: "test",
    });

    const testFile = path.resolve(process.cwd(), "testData", "empty.jpg");

    Image.fromFile(batch, testFile, (err, image, warnings) => {
        t.ok(err, "Has error object.");
        t.equal(err.message, "EMPTY_IMAGE", "Has error message.");
        t.notOk(image, "No image object");
        t.notOk(warnings, "No warnings object.");
        t.end();
    });
});

tap.test("Image.fromFile: New Image (Corrupted File)", (t) => {
    const batch = new ImageImport({
        _id: "testBatch",
        source: "test",
    });

    const testFile = path.resolve(process.cwd(), "testData", "corrupted.jpg");

    Image.fromFile(batch, testFile, (err, image, warnings) => {
        t.ok(err, "Has error object.");
        t.equal(err.message, "MALFORMED_IMAGE", "Has error message.");
        t.notOk(image, "No image object");
        t.notOk(warnings, "No warnings object.");
        t.end();
    });
});

tap.test("Image.fromFile: New Image (Small File)", (t) => {
    const batch = new ImageImport({
        _id: "testBatch",
        source: "test",
    });

    const testFile = path.resolve(process.cwd(), "testData", "test-small.jpg");

    Image.fromFile(batch, testFile, (err, image, warnings) => {
        t.error(err, "No error should be thrown.");
        t.ok(image, "Image exists.");
        t.same(warnings, ["TOO_SMALL"], "One warning.");
        t.end();
    });
});

tap.test("Image.fromFile: Updating Image", (t) => {
    const batch = new ImageImport({
        _id: "testBatch",
        source: "test",
    });

    const testFile = path.resolve(process.cwd(), "testData", "nosimilar.jpg");

    Image.fromFile(batch, testFile, (err, image, warnings) => {
        t.error(err, "No error should be thrown.");
        t.ok(image, "Image exists.");
        t.same(warnings, ["NEW_VERSION"], "One warning.");
        t.end();
    });
});

tap.test("Image.fromFile: Updating Image (files already exist)", (t) => {
    const batch = new ImageImport({
        _id: "testBatch",
        source: "test",
    });

    const testFile = path.resolve(process.cwd(), "testData", "foo.jpg");

    Image.fromFile(batch, testFile, () => {
        // Run this twice to have the images be put into place already
        Image.fromFile(batch, testFile, (err, image, warnings) => {
            t.error(err, "No error should be thrown.");
            t.ok(image, "Image exists.");
            t.equal(warnings.length, 0, "No warnings.");
            t.end();
        });
    });
});
