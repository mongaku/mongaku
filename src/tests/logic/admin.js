const fs = require("fs");
const path = require("path");

const tap = require("tap");
const request = require("request").defaults({jar: true});

const {adminLogin, normalLogin, mockFS} = require("../init");

tap.test("Admin Page", t => {
    adminLogin(request, () => {
        const url = "http://localhost:3000/artworks/source/test/admin";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Admin Page (Logged Out)", t => {
    const url = "http://localhost:3000/artworks/source/test/admin";
    request.get(url, (err, res) => {
        t.error(err, "Error should be empty.");
        t.equal(res.statusCode, 200);
        t.match(res.request.uri.href, "http://localhost:3000/login");
        t.end();
    });
});

tap.test("Admin Page (Unauthorized User)", t => {
    normalLogin(request, () => {
        const url = "http://localhost:3000/artworks/source/test/admin";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 403);
            t.end();
        });
    });
});

tap.test("Record Import Page", t => {
    adminLogin(request, () => {
        const url =
            "http://localhost:3000/artworks/source/test/admin" +
            "?records=test/started";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Record Import Page (Completed)", t => {
    adminLogin(request, () => {
        const url =
            "http://localhost:3000/artworks/source/test/admin" +
            "?records=test/completed";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Record Import Page (Error)", t => {
    adminLogin(request, () => {
        const url =
            "http://localhost:3000/artworks/source/test/admin" +
            "?records=test/error";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Record Import Page (Missing)", t => {
    adminLogin(request, () => {
        const url =
            "http://localhost:3000/artworks/source/test/admin" +
            "?records=test/foo";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 404);
            t.end();
        });
    });
});

tap.test("Record Import Finalize", t => {
    adminLogin(request, () => {
        const url =
            "http://localhost:3000/artworks/source/test/admin" +
            "?records=test/started&finalize=true";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.match(
                res.request.uri.href,
                "http://localhost:3000/artworks/source/test/admin"
            );
            t.end();
        });
    });
});

tap.test("Record Import Abandon", t => {
    adminLogin(request, () => {
        const url =
            "http://localhost:3000/artworks/source/test/admin" +
            "?records=test/started&abandon=true";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.match(
                res.request.uri.href,
                "http://localhost:3000/artworks/source/test/admin"
            );
            t.end();
        });
    });
});

tap.test("Image Import Page", t => {
    adminLogin(request, () => {
        const url =
            "http://localhost:3000/artworks/source/test/admin" +
            "?images=test/started";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Image Import Page (Completed)", t => {
    adminLogin(request, () => {
        const url =
            "http://localhost:3000/artworks/source/test/admin" +
            "?images=test/completed";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Image Import Page (Completed, Expanded)", t => {
    adminLogin(request, () => {
        const url =
            "http://localhost:3000/artworks/source/test/admin" +
            "?images=test/completed&expanded=models";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Image Import Page (Error)", t => {
    adminLogin(request, () => {
        const url =
            "http://localhost:3000/artworks/source/test/admin" +
            "?images=test/error";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 200);
            t.end();
        });
    });
});

tap.test("Image Import Page (Missing)", t => {
    adminLogin(request, () => {
        const url =
            "http://localhost:3000/artworks/source/test/admin" +
            "?images=test/foo";
        request.get(url, (err, res) => {
            t.error(err, "Error should be empty.");
            t.equal(res.statusCode, 404);
            t.end();
        });
    });
});

tap.test("uploadData: Source not found", t => {
    mockFS(callback => {
        adminLogin(request, () => {
            const url = "http://localhost:3000/artworks/source/foo/upload-data";
            const formData = {};
            request.post({url, formData}, (err, res) => {
                t.error(err, "Error should be empty.");
                t.equal(res.statusCode, 404);
                t.end();
                callback();
            });
        });
    });
});

tap.test("uploadData: No files", t => {
    mockFS(callback => {
        adminLogin(request, () => {
            const url =
                "http://localhost:3000/artworks/source/test/upload-data";
            const formData = {};
            request.post({url, formData}, (err, res, body) => {
                t.error(err, "Error should be empty.");
                t.equal(res.statusCode, 500);
                t.match(body, "No data files specified.");
                t.end();
                callback();
            });
        });
    });
});

tap.test("uploadData: File Error", t => {
    mockFS(callback => {
        adminLogin(request, () => {
            const url =
                "http://localhost:3000/artworks/source/test/upload-data";
            const file = "default-error.json";
            const formData = {
                files: {
                    value: fs.createReadStream(path.resolve("testData", file)),
                    options: {
                        filename: file,
                    },
                },
            };
            request.post(
                {
                    url,
                    formData,
                },
                (err, res) => {
                    t.error(err, "Error should be empty.");
                    t.equal(res.statusCode, 302);
                    t.match(
                        res.headers.location,
                        "/artworks/source/test/admin"
                    );
                    t.end();
                    callback();
                }
            );
        });
    });
});

tap.test("uploadData: Default File", t => {
    mockFS(callback => {
        adminLogin(request, () => {
            const url =
                "http://localhost:3000/artworks/source/test/upload-data";
            const file = "default.json";
            const formData = {
                files: {
                    value: fs.createReadStream(path.resolve("testData", file)),
                    options: {
                        filename: file,
                    },
                },
            };
            request.post(
                {
                    url,
                    formData,
                },
                (err, res) => {
                    t.error(err, "Error should be empty.");
                    t.equal(res.statusCode, 302);
                    t.match(
                        res.headers.location,
                        "/artworks/source/test/admin"
                    );
                    t.end();
                    callback();
                }
            );
        });
    });
});

tap.test("uploadImages: Source not found", t => {
    mockFS(callback => {
        adminLogin(request, () => {
            const url =
                "http://localhost:3000/artworks/source/foo/upload-images";
            const formData = {};
            request.post({url, formData}, (err, res) => {
                t.error(err, "Error should be empty.");
                t.equal(res.statusCode, 404);
                t.end();
                callback();
            });
        });
    });
});

tap.test("uploadImages: No files", t => {
    mockFS(callback => {
        adminLogin(request, () => {
            const url =
                "http://localhost:3000/artworks/source/test/upload-images";
            const formData = {};
            request.post({url, formData}, (err, res, body) => {
                t.error(err, "Error should be empty.");
                t.equal(res.statusCode, 500);
                t.match(body, "No zip file specified.");
                t.end();
                callback();
            });
        });
    });
});

tap.test("uploadImages: Empty Zip", t => {
    mockFS(callback => {
        adminLogin(request, () => {
            const url =
                "http://localhost:3000/artworks/source/test/upload-images";
            const file = "empty.zip";
            const formData = {
                zipField: {
                    value: fs.createReadStream(path.resolve("testData", file)),
                    options: {
                        filename: file,
                    },
                },
            };
            request.post(
                {
                    url,
                    formData,
                },
                (err, res) => {
                    t.error(err, "Error should be empty.");
                    t.equal(res.statusCode, 302);
                    t.match(
                        res.headers.location,
                        "/artworks/source/test/admin"
                    );
                    t.end();
                    callback();
                }
            );
        });
    });
});

tap.test("uploadImages: Corrupted Zip", t => {
    mockFS(callback => {
        adminLogin(request, () => {
            const url =
                "http://localhost:3000/artworks/source/test/upload-images";
            const file = "corrupted.zip";
            const formData = {
                zipField: {
                    value: fs.createReadStream(path.resolve("testData", file)),
                    options: {
                        filename: file,
                    },
                },
            };
            request.post(
                {
                    url,
                    formData,
                },
                (err, res) => {
                    t.error(err, "Error should be empty.");
                    t.equal(res.statusCode, 302);
                    t.match(
                        res.headers.location,
                        "/artworks/source/test/admin"
                    );
                    t.end();
                    callback();
                }
            );
        });
    });
});

tap.test("uploadImages: Normal Zip", t => {
    mockFS(callback => {
        adminLogin(request, () => {
            const url =
                "http://localhost:3000/artworks/source/test/upload-images";
            const file = "test.zip";
            const formData = {
                zipField: {
                    value: fs.createReadStream(path.resolve("testData", file)),
                    options: {
                        filename: file,
                    },
                },
            };
            request.post(
                {
                    url,
                    formData,
                },
                (err, res) => {
                    t.error(err, "Error should be empty.");
                    t.equal(res.statusCode, 302);
                    t.match(
                        res.headers.location,
                        "/artworks/source/test/admin"
                    );
                    t.end();
                    callback();
                }
            );
        });
    });
});
