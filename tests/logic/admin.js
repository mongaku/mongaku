"use strict";

const fs = require("fs");
const path = require("path");

const tap = require("tap");
const request = require("request").defaults({jar: true});

require("../init");

const login = (email, callback) => {
    request.post({
        url: "http://localhost:3000/login",
        form: {
            email,
            password: "test",
        },
    }, callback);
};

const adminLogin = (callback) => login("test@test.com", callback);
const normalLogin = (callback) => login("normal@test.com", callback);

tap.test("Admin Page", (t) => {
    adminLogin(() => {
        const url = "http://localhost:3000/source/test/admin";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Admin Page (Logged Out)", (t) => {
    const url = "http://localhost:3000/source/test/admin";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.match(res.request.uri.href,
            "http://localhost:3000/login");
        t.end();
    });
});

tap.test("Admin Page (Unauthorized User)", (t) => {
    normalLogin(() => {
        const url = "http://localhost:3000/source/test/admin";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 500);
            t.end();
        });
    });
});

tap.test("Artwork Import Page", (t) => {
    adminLogin(() => {
        const url = "http://localhost:3000/source/test/admin" +
            "?artworks=test/started";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Artwork Import Page (Completed)", (t) => {
    adminLogin(() => {
        const url = "http://localhost:3000/source/test/admin" +
            "?artworks=test/completed";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Artwork Import Page (Error)", (t) => {
    adminLogin(() => {
        const url = "http://localhost:3000/source/test/admin" +
            "?artworks=test/error";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Artwork Import Page (Missing)", (t) => {
    adminLogin(() => {
        const url = "http://localhost:3000/source/test/admin" +
            "?artworks=test/foo";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 404);
            t.end();
        });
    });
});

tap.test("Artwork Import Finalize", (t) => {
    adminLogin(() => {
        const url = "http://localhost:3000/source/test/admin" +
            "?artworks=test/started&finalize=true";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.match(res.request.uri.href,
                "http://localhost:3000/source/test/admin");
            t.end();
        });
    });
});

tap.test("Artwork Import Abandon", (t) => {
    adminLogin(() => {
        const url = "http://localhost:3000/source/test/admin" +
            "?artworks=test/started&abandon=true";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.match(res.request.uri.href,
                "http://localhost:3000/source/test/admin");
            t.end();
        });
    });
});

tap.test("Image Import Page", (t) => {
    adminLogin(() => {
        const url = "http://localhost:3000/source/test/admin" +
            "?images=test/started";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Image Import Page (Completed)", (t) => {
    adminLogin(() => {
        const url = "http://localhost:3000/source/test/admin" +
            "?images=test/completed";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Image Import Page (Completed, Expanded)", (t) => {
    adminLogin(() => {
        const url = "http://localhost:3000/source/test/admin" +
            "?images=test/completed&expanded=models";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Image Import Page (Error)", (t) => {
    adminLogin(() => {
        const url = "http://localhost:3000/source/test/admin" +
            "?images=test/error";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Image Import Page (Missing)", (t) => {
    adminLogin(() => {
        const url = "http://localhost:3000/source/test/admin" +
            "?images=test/foo";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 404);
            t.end();
        });
    });
});

tap.test("uploadData: Source not found", (t) => {
    adminLogin(() => {
        const url = "http://localhost:3000/source/foo/upload-data";
        const formData = {};
        request.post({url, formData}, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 404);
            t.end();
        });
    });
});

tap.test("uploadData: No files", (t) => {
    adminLogin(() => {
        const url = "http://localhost:3000/source/test/upload-data";
        const formData = {};
        request.post({url, formData}, (err, res, body) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 500);
            t.match(body, "No data files specified.");
            t.end();
        });
    });
});

tap.test("uploadData: File Error", (t) => {
    adminLogin(() => {
        const url = "http://localhost:3000/source/test/upload-data";
        const file = "default-error.json";
        const formData = {
            files: {
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
            t.match(res.headers.location, "/source/test/admin");
            t.end();
        });
    });
});

tap.test("uploadData: Default File", (t) => {
    adminLogin(() => {
        const url = "http://localhost:3000/source/test/upload-data";
        const file = "default.json";
        const formData = {
            files: {
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
            t.match(res.headers.location, "/source/test/admin");
            t.end();
        });
    });
});

tap.test("uploadImages: Source not found", (t) => {
    adminLogin(() => {
        const url = "http://localhost:3000/source/foo/upload-images";
        const formData = {};
        request.post({url, formData}, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 404);
            t.end();
        });
    });
});

tap.test("uploadImages: No files", (t) => {
    adminLogin(() => {
        const url = "http://localhost:3000/source/test/upload-images";
        const formData = {};
        request.post({url, formData}, (err, res, body) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 500);
            t.match(body, "No zip file specified.");
            t.end();
        });
    });
});

tap.test("uploadImages: Empty Zip", (t) => {
    adminLogin(() => {
        const url = "http://localhost:3000/source/test/upload-images";
        const file = "empty.zip";
        const formData = {
            zipField: {
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
            t.match(res.headers.location, "/source/test/admin");
            t.end();
        });
    });
});

tap.test("uploadImages: Corrupted Zip", (t) => {
    adminLogin(() => {
        const url = "http://localhost:3000/source/test/upload-images";
        const file = "corrupted.zip";
        const formData = {
            zipField: {
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
            t.match(res.headers.location, "/source/test/admin");
            t.end();
        });
    });
});

tap.test("uploadImages: Normal Zip", (t) => {
    adminLogin(() => {
        const url = "http://localhost:3000/source/test/upload-images";
        const file = "test.zip";
        const formData = {
            zipField: {
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
            t.match(res.headers.location, "/source/test/admin");
            t.end();
        });
    });
});
