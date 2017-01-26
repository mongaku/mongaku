const fs = require("fs");
const path = require("path");

const tap = require("tap");
const request = require("request").defaults({jar: true});

require("../init");

tap.test("Upload New Image", (t) => {
    const url = "http://localhost:3000/artworks/file-upload";
    const file = "bar.jpg";
    const formData = {
        file: {
            value: fs.createReadStream(path.resolve("testData", file)),
            options: {
                filename: file,
            },
        },
    };
    request.post({
        url,
        formData,
    }, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 302);
        t.match(res.headers.location, "/artworks/uploads/2508884691");
        t.end();
    });
});

tap.test("Upload Existing Image", (t) => {
    const url = "http://localhost:3000/artworks/file-upload";
    const file = "foo.jpg";
    const formData = {
        file: {
            value: fs.createReadStream(path.resolve("testData", file)),
            options: {
                filename: file,
            },
        },
    };
    request.post({
        url,
        formData,
    }, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 302);
        t.match(res.headers.location, "/artworks/uploads/4266906334");
        t.end();
    });
});

tap.test("Upload Corrupted Image", (t) => {
    const url = "http://localhost:3000/artworks/file-upload";
    const file = "corrupted.jpg";
    const formData = {
        file: {
            value: fs.createReadStream(path.resolve("testData", file)),
            options: {
                filename: file,
            },
        },
    };
    request.post({
        url,
        formData,
    }, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 500);
        t.end();
    });
});

tap.test("Upload No Image", (t) => {
    const url = "http://localhost:3000/artworks/file-upload";
    const formData = {};
    request.post({
        url,
        formData,
    }, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 500);
        t.end();
    });
});

tap.test("Upload New Image From URL", (t) => {
    // TODO(jeresig): Change this to a local URL
    const uploadURL = encodeURIComponent(
        "http://data.ukiyo-e.org/met/thumbs/2011_138_Strm1.jpg");
    const url = `http://localhost:3000/artworks/url-upload?url=${uploadURL}`;

    request.get({
        url,
    }, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.match(res.request.uri.href,
            "http://localhost:3000/artworks/uploads/516463693");
        t.end();
    });
});

tap.test("Upload No Image From URL", (t) => {
    const uploadURL = encodeURIComponent("http://");
    const url = `http://localhost:3000/artworks/url-upload?url=${uploadURL}`;

    request.get({
        url,
    }, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 500);
        t.end();
    });
});

tap.test("Upload Missing Image From URL", (t) => {
    const uploadURL = encodeURIComponent("http://localhost:3000/foo.jpg");
    const url = `http://localhost:3000/artworks/url-upload?url=${uploadURL}`;

    request.get({
        url,
    }, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 500);
        t.end();
    });
});

tap.test("View Upload", (t) => {
    const url = "http://localhost:3000/artworks/uploads/4266906334";
    request.get({
        url,
    }, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.end();
    });
});

tap.test("View Missing Upload", (t) => {
    const url = "http://localhost:3000/artworks/uploads/foo";
    request.get({
        url,
    }, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 404);
        t.end();
    });
});
