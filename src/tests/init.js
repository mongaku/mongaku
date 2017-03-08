const fs = require("fs");
const path = require("path");
const Module = require("module");

const tap = require("tap");
const sinon = require("sinon");
const mockfs = require("mock-fs");
const async = require("async");
const iconv = require("iconv-lite");

// Force ICONV to pre-load its encodings
iconv.getCodec("utf8");

// Bring in any polyfills used for testing (e.g. async)
require("babel-polyfill");

const originalLoader = Module._load;

// Override the normal "require" call to handle any attempts to dynamically
// load react or react-dom instead of preact (e.g. in react-select)
Module._load = function(request, parent) {
    if (request === "react" || request === "react-dom") {
        return originalLoader.call(this, "preact-compat", parent);
    }

    return originalLoader(...arguments);
};

// Force dynamically loaded modules to load now
require("negotiator/lib/mediaType");
require("nyc/node_modules/istanbul-lib-instrument");
require("react-select");

// Load in global ENV
process.env.BASE_DATA_DIR = path.resolve(process.cwd(), "data");
process.env.STATIC_DIR = path.resolve(process.cwd(), "static");

const record = require("../lib/record");
const models = require("../lib/models");
const options = require("../lib/options");
const similarity = require("../lib/similar");
const server = require("../server/server");

// Models used for testing
const Image = models("Image");
const Source = models("Source");
const ImageImport = models("ImageImport");
const RecordImport = models("RecordImport");
const UploadImage = models("UploadImage");
const Upload = models("Upload");
const User = models("User");

// Use the single default record
const Record = record(Object.keys(options.types)[0]);

// Data used for testing
let source;
let sources;
let batch;
let batches;
let recordBatch;
let recordBatches;
let imageResultsData;
let images;
let image;
let uploads;
let upload;
let uploadImages;
let uploadImage;
let records;
let primaryRecord;
let recordData;
let similar;
let similarAdded;
let user;
let users;

const login = (request, email, callback) => {
    request.post({
        url: "http://localhost:3000/login",
        form: {
            email,
            password: "test",
        },
    }, callback);
};

const adminLogin = (request, callback) =>
    login(request, "test@test.com", callback);
const normalLogin = (request, callback) =>
    login(request, "normal@test.com", callback);

// Sandbox the bound methods
let sandbox;

// Root Files
const pkgFile = fs.readFileSync(path.resolve(__dirname, "../../package.json"));

// Files used for testing
const testFiles = {};
const dataDir = path.resolve(__dirname, "data");

for (const file of fs.readdirSync(dataDir)) {
    if (/\.\w+$/.test(file)) {
        testFiles[file] = fs.readFileSync(path.resolve(dataDir, file));
    }
}

// Views
const viewFiles = {};
const viewDir = path.resolve(__dirname, "..", "views");

for (const file of fs.readdirSync(viewDir)) {
    if (file.indexOf(".js") >= 0) {
        viewFiles[file] = fs.readFileSync(path.resolve(viewDir, file));
    }
}

const sharedViewFiles = {};
const sharedViewDir = path.resolve(__dirname, "..", "views", "shared");

for (const file of fs.readdirSync(sharedViewDir)) {
    if (file.indexOf(".js") >= 0) {
        sharedViewFiles[file] =
            fs.readFileSync(path.resolve(sharedViewDir, file));
    }
}

const typeViewFiles = {};
const typeViewDir = path.resolve(__dirname, "..", "views", "types", "view");

for (const file of fs.readdirSync(typeViewDir)) {
    if (file.indexOf(".js") >= 0) {
        typeViewFiles[file] = fs.readFileSync(path.resolve(typeViewDir, file));
    }
}

const typeFilterFiles = {};
const typeFilterDir = path.resolve(__dirname, "..", "views", "types", "filter");

for (const file of fs.readdirSync(typeFilterDir)) {
    if (file.indexOf(".js") >= 0) {
        typeFilterFiles[file] =
            fs.readFileSync(path.resolve(typeFilterDir, file));
    }
}

const typeEditFiles = {};
const typeEditDir = path.resolve(__dirname, "..", "views", "types", "edit");

for (const file of fs.readdirSync(typeEditDir)) {
    if (file.indexOf(".js") >= 0) {
        typeEditFiles[file] =
            fs.readFileSync(path.resolve(typeEditDir, file));
    }
}

// Static files used to render the site
const staticFiles = {};
const staticDir = process.env.STATIC_DIR;

for (const dir of fs.readdirSync(staticDir)) {
    const dirPath = path.resolve(staticDir, dir);
    const files = staticFiles[dir] = {};

    for (const file of fs.readdirSync(dirPath)) {
        const filePath = path.resolve(dirPath, file);
        files[file] = fs.readFileSync(filePath);
    }
}

const genData = () => {
    recordData = {
        id: "1234",
        type: "artworks",
        source: "test",
        lang: "en",
        url: "http://google.com",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting",
        medium: "oil",
        artists: [{
            name: "Test",
            dates: [{
                original: "ca. 1456-1457",
                start: 1456,
                end: 1457,
                circa: true,
            }],
        }],
        dimensions: [{width: 123, height: 130, unit: "mm"}],
        dates: [{
            original: "ca. 1456-1457",
            start: 1456,
            end: 1457,
            circa: true,
        }],
        locations: [{city: "New York City"}],
    };

    records = {
        "test/1234": new Record(Object.assign({}, recordData, {
            _id: "test/1234",
            id: "1234",
            images: ["test/foo.jpg"],
            defaultImageHash: "4266906334",
        })),

        "test/1235": new Record(Object.assign({}, recordData, {
            _id: "test/1235",
            id: "1235",
            images: ["test/bar.jpg"],
            defaultImageHash: "2508884691",
            similarRecords: [
                {
                    _id: "test/1236",
                    record: "test/1236",
                    score: 17,
                    source: "test",
                    images: ["test/new1.jpg", "test/new2.jpg"],
                },
                {
                    _id: "test/1234",
                    record: "test/1234",
                    score: 10,
                    source: "test",
                    images: ["test/foo.jpg"],
                },
            ],
        })),

        "test/1236": new Record(Object.assign({}, recordData, {
            _id: "test/1236",
            id: "1236",
            images: ["test/new1.jpg", "test/new2.jpg", "test/new3.jpg"],
            defaultImageHash: "2533156274",
        })),

        "test/1237": new Record(Object.assign({}, recordData, {
            _id: "test/1237",
            id: "1237",
            images: ["test/nosimilar.jpg"],
            defaultImageHash: "4246873662",
            similarRecords: [],
        })),
    };

    const remove = function(callback) {
        delete records[this._id];
        process.nextTick(callback);
    };

    for (const id in records) {
        const record = records[id];
        record.validateSync();
        record.isNew = false;
        sinon.stub(record, "remove", remove);
    }

    primaryRecord = records["test/1234"];

    sources = [
        new Source({
            _id: "test",
            type: "artworks",
            url: "http://test.com/",
            name: "Test Source",
            shortName: "Test",
        }),
        new Source({
            _id: "test2",
            type: "artworks",
            url: "http://test2.com/",
            name: "Test Source 2",
            shortName: "Test2",
        }),
    ];

    source = sources[0];

    const testZip = path.resolve(process.cwd(), "testData", "test.zip");

    imageResultsData = [
        {
            "_id": "bar.jpg",
            "fileName": "bar.jpg",
            "warnings": [],
            "model": "test/bar.jpg",
        },
        {
            "_id": "corrupted.jpg",
            "fileName": "corrupted.jpg",
            "error": "MALFORMED_IMAGE",
        },
        {
            "_id": "empty.jpg",
            "fileName": "empty.jpg",
            "error": "EMPTY_IMAGE",
        },
        {
            "_id": "foo.jpg",
            "fileName": "foo.jpg",
            "warnings": [],
            "model": "test/foo.jpg",
        },
        {
            "_id": "new1.jpg",
            "fileName": "new1.jpg",
            "warnings": [],
            "model": "test/new1.jpg",
        },
        {
            "_id": "new2.jpg",
            "fileName": "new2.jpg",
            "warnings": [],
            "model": "test/new2.jpg",
        },
        {
            "_id": "small.jpg",
            "fileName": "small.jpg",
            "warnings": [
                "NEW_VERSION",
                "TOO_SMALL",
            ],
            "model": "test/small.jpg",
        },
        {
            "_id": "new3.jpg",
            "fileName": "new3.jpg",
            "warnings": [],
            "model": "test/new3.jpg",
        },
        {
            "_id": "nosimilar.jpg",
            "fileName": "nosimilar.jpg",
            "warnings": [
                "NEW_VERSION",
            ],
            "model": "test/nosimilar.jpg",
        },
    ];

    batches = [
        new ImageImport({
            _id: "test/started",
            created: new Date(),
            modified: new Date(),
            source: "test",
            zipFile: testZip,
            fileName: "test.zip",
        }),

        new ImageImport({
            _id: "test/process-started",
            created: new Date(),
            modified: new Date(),
            source: "test",
            state: "process.started",
            zipFile: testZip,
            fileName: "test.zip",
        }),

        new ImageImport({
            _id: "test/process-completed",
            created: new Date(),
            modified: new Date(),
            source: "test",
            state: "process.completed",
            zipFile: testZip,
            fileName: "test.zip",
            results: imageResultsData,
        }),

        new ImageImport({
            _id: "test/process-completed2",
            created: new Date(),
            modified: new Date(),
            source: "test",
            state: "process.completed",
            zipFile: testZip,
            fileName: "test.zip",
            results: imageResultsData,
        }),

        new ImageImport({
            _id: "test/completed",
            created: new Date(),
            modified: new Date(),
            source: "test",
            state: "completed",
            zipFile: testZip,
            fileName: "test.zip",
            results: imageResultsData,
        }),

        new ImageImport({
            _id: "test/error",
            created: new Date(),
            modified: new Date(),
            source: "test",
            state: "error",
            zipFile: testZip,
            fileName: "test.zip",
            error: "ERROR_READING_ZIP",
        }),
    ];

    for (const batch of batches) {
        sinon.stub(batch, "save", process.nextTick);
    }

    batch = batches[0];

    recordBatches = [
        new RecordImport({
            _id: "test/started",
            created: new Date(),
            modified: new Date(),
            fileName: "data.json",
            source: "test",
            type: "artworks",
        }),
        new RecordImport({
            _id: "test/completed",
            created: new Date(),
            modified: new Date(),
            fileName: "data.json",
            source: "test",
            type: "artworks",
            state: "completed",
            results: [],
        }),
        new RecordImport({
            _id: "test/error",
            created: new Date(),
            modified: new Date(),
            fileName: "data.json",
            source: "test",
            type: "artworks",
            state: "error",
            error: "ABANDONED",
            results: [],
        }),
    ];

    for (const recordBatch of recordBatches) {
        sinon.stub(recordBatch, "save", process.nextTick);
    }

    recordBatch = recordBatches[0];

    images = {
        "test/foo.jpg": new Image({
            _id: "test/foo.jpg",
            source: "test",
            fileName: "foo.jpg",
            hash: "4266906334",
            width: 100,
            height: 100,
            similarImages: [{_id: "test/bar.jpg", score: 10}],
        }),

        "test/bar.jpg": new Image({
            _id: "test/bar.jpg",
            source: "test",
            fileName: "bar.jpg",
            hash: "2508884691",
            width: 120,
            height: 120,
            similarImages: [
                {_id: "test/foo.jpg", score: 10},
                {_id: "test/new2.jpg", score: 9},
                {_id: "test/new1.jpg", score: 8},
            ],
        }),

        "test/new1.jpg": new Image({
            _id: "test/new1.jpg",
            source: "test",
            fileName: "new1.jpg",
            hash: "2533156274",
            width: 115,
            height: 115,
            similarImages: [{_id: "test/bar.jpg", score: 8}],
        }),

        "test/new2.jpg": new Image({
            _id: "test/new2.jpg",
            source: "test",
            fileName: "new2.jpg",
            hash: "614431508",
            width: 116,
            height: 116,
            similarImages: [{_id: "test/bar.jpg", score: 9}],
        }),

        "test/new3.jpg": new Image({
            _id: "test/new3.jpg",
            source: "test",
            fileName: "new3.jpg",
            hash: "204571459",
            width: 117,
            height: 117,
            similarImages: [],
        }),

        "test/nosimilar.jpg": new Image({
            _id: "test/nosimilar.jpg",
            source: "test",
            fileName: "nosimilar.jpg",
            hash: "4246873662a",
            width: 110,
            height: 110,
            similarImages: [],
        }),

        "test/small.jpg": new Image({
            _id: "test/small.jpg",
            source: "test",
            fileName: "small.jpg",
            hash: "4246873662b",
            width: 90,
            height: 90,
            similarImages: [],
        }),
    };

    image = images["test/foo.jpg"];

    uploadImages = {
        "uploads/4266906334.jpg": new UploadImage({
            _id: "uploads/4266906334.jpg",
            fileName: "4266906334.jpg",
            hash: "4266906334",
            width: 100,
            height: 100,
            similarImages: [{_id: "test/bar.jpg", score: 10}],
        }),
    };

    uploadImage = uploadImages["uploads/4266906334.jpg"];

    uploads = {
        "uploads/4266906334": new Upload({
            _id: "uploads/4266906334",
            type: "artworks",
            images: ["uploads/4266906334.jpg"],
            defaultImageHash: "4266906334",
        }),
    };

    upload = uploads["uploads/4266906334"];

    similar = {
        "4266906334": [
            {id: "4266906334", score: 100},
            {id: "2508884691", score: 10},
            {id: "NO_LONGER_EXISTS", score: 1},
        ],
        "2508884691": [
            {id: "2508884691", score: 100},
            {id: "4266906334", score: 10},
            {id: "614431508", score: 9},
            {id: "2533156274", score: 8},
        ],
        "2533156274": [
            {id: "2533156274", score: 100},
            {id: "2508884691", score: 8},
        ],
        "614431508": [
            {id: "614431508", score: 100},
            {id: "2508884691", score: 9},
        ],
        "204571459": [
            {id: "204571459", score: 100},
        ],
        "1306644102": [
            {id: "1306644102", score: 100},
        ],
    };

    similarAdded = [];

    users = [
        new User({
            email: "test@test.com",
            password: "test",
            sourceAdmin: ["test"],
            siteAdmin: true,
        }),
        new User({
            email: "normal@test.com",
            password: "test",
            sourceAdmin: [],
            siteAdmin: false,
        }),
    ];

    user = users[0];
};

const bindStubs = () => {
    sandbox = sinon.sandbox.create();

    sandbox.stub(Record, "findById", (id, callback) => {
        if (records[id]) {
            process.nextTick(() => callback(null, records[id]));
        } else {
            process.nextTick(() => callback(
                new Error("Record not found.")));
        }
    });

    sandbox.stub(Record, "find", (query, callback, extra) => {
        let matches = [];

        if (query.$or) {
            const imageIds = query.$or.map((query) => query.images);

            for (const id in records) {
                const record = records[id];

                if (query._id.$ne === id) {
                    continue;
                }

                for (const imageId of imageIds) {
                    if (record.images.indexOf(imageId) >= 0) {
                        matches.push(record);
                        break;
                    }
                }
            }
        } else if (query.source) {
            matches = Object.keys(records).filter((id) =>
                records[id].source === query.source)
                .map((id) => records[id]);
        } else if (query.images) {
            matches = Object.keys(records).filter((id) =>
                records[id].images.indexOf(query.images) >= 0)
                .map((id) => records[id]);
        } else {
            matches = Object.keys(records).map((id) => records[id]);
        }

        for (const record of matches) {
            if (!record.save.restore) {
                sandbox.stub(record, "save", (callback) => {
                    if (!(record._id in records)) {
                        records[record._id] = record;
                    }

                    process.nextTick(callback);
                });
            }
        }

        if (!callback || extra) {
            const ret = {
                lean: () => ret,
                distinct: (name) => {
                    matches = matches.map((match) => match[name]);
                    return ret;
                },
                stream: () => ret,
                on: (name, callback) => {
                    if (name === "data") {
                        ret._ondata = callback.bind(ret);
                        return ret;
                    }

                    ret._onclose = callback.bind(ret);
                    process.nextTick(ret._popData);
                    return ret;
                },
                pause: () => ret,
                resume: () => {
                    process.nextTick(ret._popData);
                },
                _popData: () => {
                    if (matches.length > 0) {
                        ret._ondata(matches.shift());
                    } else {
                        ret._onclose();
                    }
                },
                exec: (callback) =>
                    process.nextTick(() => callback(null, matches)),
            };
            return ret;
        }

        process.nextTick(() => callback(null, matches));
    });

    sandbox.stub(Record, "search", (query, options, callback) => {
        const matches = Object.keys(records).map((id) => records[id]);
        const aggregations = {
            source: {
                buckets: [{key: "test", doc_count: 2}],
            },
            objectType: {
                buckets: [{key: "painting", doc_count: 2}],
            },
            dates: {
                buckets: [{from: 1100, to: 1199, doc_count: 2}],
            },
            artists: {
                buckets: [{key: "Test", doc_count: 2}],
            },
            "dimensions.width": {
                buckets: [{from: 100, to: 199, doc_count: 2}],
            },
            "dimensions.height": {
                buckets: [{from: 100, to: 199, doc_count: 2}],
            },
        };

        process.nextTick(() => callback(null, {
            aggregations,
            hits: {
                total: matches.length,
                hits: matches,
            },
        }));
    });

    sandbox.stub(Record, "update", (query, update, options, callback) => {
        Object.keys(records).forEach((id) => {
            records[id].needsSimilarUpdate = true;
        });
        process.nextTick(callback);
    });

    sandbox.stub(Record, "count", (query, callback) => {
        const count = Object.keys(records).filter((id) =>
            !query.source || records[id].source === query.source).length;

        process.nextTick(() => callback(null, count));
    });

    sandbox.stub(Record, "aggregate", (query, callback) => {
        const source = query[0].$match.source;
        const count = Object.keys(records).filter((id) =>
            records[id].source === source).length;

        process.nextTick(() => callback(null, [{
            total: count,
            totalImages: count,
        }]));
    });

    const fromData = Record.fromData;

    sandbox.stub(Record, "fromData", (tmpData, i18n, callback) => {
        fromData.call(Record, tmpData, i18n,
            (err, record, warnings, creating) => {
                if (record && !record.save.restore) {
                    sandbox.stub(record, "save", (callback) => {
                        if (!(record._id in records)) {
                            records[record._id] = record;
                        }

                        process.nextTick(callback);
                    });
                }

                callback(err, record, warnings, creating);
            });
    });

    sandbox.stub(ImageImport, "find", (query, select, options, callback) => {
        process.nextTick(() => callback(null, batches));
    });

    sandbox.stub(ImageImport, "findById", (id, callback) => {
        process.nextTick(() => {
            callback(null, batches.find((batch) => batch._id === id));
        });
    });

    const imageImportFromFile = ImageImport.fromFile;

    sandbox.stub(ImageImport, "fromFile", (fileName, source) => {
        const batch = imageImportFromFile.call(ImageImport, fileName,
            source);
        if (!batch.save.restore) {
            sandbox.stub(batch, "save", (callback) => batch.validate((err) => {
                /* istanbul ignore if */
                if (err) {
                    return callback(err);
                }

                batch.modified = new Date();
                batches.push(batch);
                callback(null, batch);
            }));
        }
        return batch;
    });

    sandbox.stub(RecordImport, "find", (query, select, options, callback) => {
        process.nextTick(() => {
            callback(null, recordBatches);
        });
    });

    sandbox.stub(RecordImport, "findById", (id, callback) => {
        process.nextTick(() => {
            callback(null, recordBatches.find((batch) => batch._id === id));
        });
    });

    const recordImportFromFile = RecordImport.fromFile;

    sandbox.stub(RecordImport, "fromFile", (fileName, source, type) => {
        const batch = recordImportFromFile.call(RecordImport, fileName,
            source, type);
        if (!batch.save.restore) {
            sandbox.stub(batch, "save", (callback) => batch.validate((err) => {
                /* istanbul ignore if */
                if (err) {
                    return callback(err);
                }

                batch.modified = new Date();
                recordBatches.push(batch);
                callback(null, batch);
            }));
        }
        return batch;
    });

    sandbox.stub(Source, "find", (query, callback) => {
        process.nextTick(() => callback(null, sources));
    });

    sandbox.stub(Image, "findById", (id, callback) => {
        process.nextTick(() => callback(null, images[id]));
    });

    sandbox.stub(Image, "findOne", (query, callback) => {
        // NOTE(jeresig): query.hash is assumed
        const id = Object.keys(images)
            .find((id) => images[id].hash === query.hash);
        const match = images[id];

        process.nextTick(() => callback(null, match));
    });

    sandbox.stub(Image, "update", (query, update, options, callback) => {
        process.nextTick(callback);
    });

    const fromFile = Image.fromFile;

    sandbox.stub(Image, "fromFile", (batch, file, callback) => {
        fromFile.call(Image, batch, file, (err, image, warnings) => {
            if (image && !image.save.restore) {
                sandbox.stub(image, "save", (callback) => {
                    images[image._id] = image;
                    image.validate(callback);
                });
            }

            callback(err, image, warnings);
        });
    });

    sandbox.stub(Image, "count", (query, callback) => {
        const count = Object.keys(images).filter((id) =>
            !query.source || images[id].source === query.source).length;

        process.nextTick(() => callback(null, count));
    });

    sandbox.stub(UploadImage, "findById", (id, callback) => {
        process.nextTick(() => callback(null, uploadImages[id]));
    });

    const uploadFromFile = UploadImage.fromFile;

    sandbox.stub(UploadImage, "fromFile", (file, callback) => {
        uploadFromFile.call(UploadImage, file, (err, image, warnings) => {
            if (image && !image.save.restore) {
                sandbox.stub(image, "save", (callback) => {
                    uploadImages[image._id] = image;
                    image.validate(callback);
                });
            }

            callback(err, image, warnings);
        });
    });

    sandbox.stub(Upload, "findById", (id, callback) => {
        process.nextTick(() => callback(null, uploads[id]));
    });

    const fromImage = Upload.fromImage;

    sandbox.stub(Upload, "fromImage", (image, type, callback) => {
        fromImage.call(Upload, image, type, (err, upload) => {
            if (upload && !upload.save.restore) {
                sandbox.stub(upload, "save", (callback) => {
                    if (!(upload._id in uploads)) {
                        uploads[upload._id] = upload;
                    }

                    process.nextTick(callback);
                });
            }

            callback(err, upload);
        });
    });

    sandbox.stub(User, "find", (query, callback) => {
        process.nextTick(() => callback(null, users));
    });

    sandbox.stub(User, "findOne", (query, callback) => {
        const matches = users.filter((user) =>
            (user.email === query.email ||
                query._id && user._id.toString() === query._id.toString()));
        process.nextTick(() => callback(null, matches[0]));
    });

    sandbox.stub(similarity, "similar", (hash, callback) => {
        process.nextTick(() => callback(null, similar[hash]));
    });

    sandbox.stub(similarity, "fileSimilar", (file, callback) => {
        // Cheat and just get the hash from the file name
        const hash = path.basename(file).replace(/\..*$/, "");
        process.nextTick(() => callback(null, similar[hash]));
    });

    sandbox.stub(similarity, "idIndexed", (hash, callback) => {
        process.nextTick(() => callback(null, !!similar[hash]));
    });

    sandbox.stub(similarity, "add", (file, hash, callback) => {
        if (hash === "99998") {
            return process.nextTick(() => callback({
                type: "IMAGE_SIZE_TOO_SMALL",
            }));
        }

        similarAdded.push({id: hash, score: 5});
        similar[hash] = similarAdded;

        process.nextTick(callback);
    });
};

const i18n = {
    format: (msg, fields) =>
        msg.replace(/%\((.*?)\)s/g, (all, name) => fields[name]),
    gettext: (msg) => msg,
    lang: "en",
};

let app;

const init = (done) => {
    genData();
    bindStubs();

    async.parallel([
        (callback) => {
            Source.cacheSources(() => {
                async.each(Object.keys(records), (id, callback) => {
                    records[id].validate(callback);
                }, callback);
            });
        },

        (callback) => {
            server((err, _app) => {
                app = _app;
                callback(err);
            });
        },
    ], () => {
        mockfs({
            "package.json": pkgFile,
            "node_modules": {
                ".cache": {
                    "nyc": {},
                },
            },
            "testData": testFiles,
            "data": {
                "test": {
                    "images": {},
                    "scaled": {},
                    "thumbs": {},
                },
                "uploads": {
                    "images": {
                        "4266906334.jpg": testFiles["4266906334.jpg"],
                        "bar.jpg": testFiles["bar.jpg"],
                    },
                    "scaled": {},
                    "thumbs": {},
                },
            },
            "build": {
                "views": Object.assign({
                    "shared": sharedViewFiles,
                    "types": {
                        "filter": typeFilterFiles,
                        "view": typeViewFiles,
                        "edit": typeEditFiles,
                    },
                }, viewFiles),
            },
            "static": staticFiles,
        });

        done();
    });
};

tap.beforeEach(init);

tap.afterEach((done) => {
    app.close();
    sandbox.restore();
    mockfs.restore();
    done();
});

module.exports = {
    getBatch: () => batch,
    getBatches: () => batches,
    getRecordBatch: () => recordBatch,
    getImage: () => image,
    getSource: () => source,
    getRecord: () => primaryRecord,
    getRecords: () => records,
    getRecordData: () => recordData,
    getImageResultsData: () => imageResultsData,
    getUpload: () => upload,
    getUploads: () => uploads,
    getUploadImage: () => uploadImage,
    getUser: () => user,
    adminLogin,
    normalLogin,
    i18n,
    Image,
    Record,
    ImageImport,
    RecordImport,
    UploadImage,
    User,
    Source,
    stub: sinon.stub,
    init,
};
