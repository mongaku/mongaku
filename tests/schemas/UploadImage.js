const path = require("path");

const tap = require("tap");

const init = require("../init");
const UploadImage = init.UploadImage;

tap.test("getFilePath", {autoend: true}, (t) => {
    const image = init.getUploadImage();
    t.equal(image.getFilePath(),
        path.resolve(process.cwd(), "data/uploads/images/4266906334.jpg"),
        "Check file path");
});

tap.test("getOriginalURL", {autoend: true}, (t) => {
    const image = init.getUploadImage();
    t.equal(image.getOriginalURL(),
        "/data/uploads/images/4266906334.jpg",
        "Check UploadImage URL");
});

tap.test("getScaledURL", {autoend: true}, (t) => {
    const image = init.getUploadImage();
    t.equal(image.getScaledURL(),
        "/data/uploads/scaled/4266906334.jpg",
        "Check Scaled URL");
});

tap.test("getThumbURL", {autoend: true}, (t) => {
    const image = init.getUploadImage();
    t.equal(image.getThumbURL(),
        "/data/uploads/thumbs/4266906334.jpg",
        "Check Thumb URL");
});

tap.test("updateSimilarity: New UploadImage", (t) => {
    const image = new UploadImage({
        _id: "uploads/614431508.jpg",
        source: "uploads",
        fileName: "614431508.jpg",
        hash: "614431508",
        width: 100,
        height: 100,
    });

    const oldSimilar = image.similarImages;
    image.updateSimilarity((err) => {
        t.error(err, "No error should be thrown.");
        t.notEqual(image.similarImages, oldSimilar,
            "Similarity updated.");
        t.equal(image.similarImages.length, 1,
            "Has the correct number of results.");
        t.same(image.similarImages[0].toJSON(),
            {_id: "test/bar.jpg", score: 9},
            "Has the correct result.");
        t.end();
    });
});

tap.test("updateSimilarity: Existing UploadImage", (t) => {
    const image = init.getUploadImage();
    const oldSimilar = image.similarImages;
    image.updateSimilarity((err) => {
        t.error(err, "No error should be thrown.");
        t.notEqual(image.similarImages, oldSimilar,
            "Similarity updated.");
        t.equal(image.similarImages.length, 1,
            "Has the correct number of results.");
        t.same(image.similarImages[0].toJSON(),
            {_id: "test/bar.jpg", score: 10},
            "Has the correct result.");
        t.end();
    });
});

tap.test("UploadImage.fromFile: New UploadImage", (t) => {
    const testFile = path.resolve(process.cwd(), "testData", "new1.jpg");

    UploadImage.fromFile(testFile, (err, image) => {
        t.error(err, "No error should be thrown.");
        t.ok(image, "UploadImage exists.");
        // TODO: Test that files exist.
        // Test that files are the right dimensions.
        t.end();
    });
});

tap.test("UploadImage.fromFile: New UploadImage (Empty File)", (t) => {
    const testFile = path.resolve(process.cwd(), "testData", "empty.jpg");

    UploadImage.fromFile(testFile, (err, image) => {
        t.ok(err, "Has error object.");
        t.equal(err.message, "EMPTY_IMAGE", "Has error message.");
        t.notOk(image, "No image object");
        t.end();
    });
});

tap.test("UploadImage.fromFile: New UploadImage (Corrupted File)", (t) => {
    const testFile = path.resolve(process.cwd(), "testData", "corrupted.jpg");

    UploadImage.fromFile(testFile, (err, image) => {
        t.ok(err, "Has error object.");
        t.equal(err.message, "MALFORMED_IMAGE", "Has error message.");
        t.notOk(image, "No image object");
        t.end();
    });
});

tap.test("UploadImage.fromFile: New UploadImage (Small File)", (t) => {
    const testFile = path.resolve(process.cwd(), "testData", "small.jpg");

    UploadImage.fromFile(testFile, (err, image) => {
        t.ok(err, "Has error object.");
        t.equal(err.message, "TOO_SMALL", "Has error message.");
        t.notOk(image, "No image object");
        t.end();
    });
});

tap.test("UploadImage.fromFile: Updating UploadImage", (t) => {
    const testFile = path.resolve(process.cwd(), "testData", "foo.jpg");

    UploadImage.fromFile(testFile, (err, image) => {
        t.error(err, "No error should be thrown.");
        t.ok(image, "UploadImage exists.");
        t.end();
    });
});

tap.test("UploadImage.fromFile: Updating (files already exist)", (t) => {
    const testFile = path.resolve(process.cwd(), "testData", "foo.jpg");

    UploadImage.fromFile(testFile, () => {
        // Run this twice to have the images be put into place already
        UploadImage.fromFile(testFile, (err, image) => {
            t.error(err, "No error should be thrown.");
            t.ok(image, "UploadImage exists.");
            t.end();
        });
    });
});
