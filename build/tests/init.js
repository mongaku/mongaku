"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var fs = require("fs");
var path = require("path");

var tap = require("tap");
var sinon = require("sinon");
var mockfs = require("mock-fs");
var async = require("async");
var iconv = require("iconv-lite");

// Force ICONV to pre-load its encodings
iconv.getCodec("utf8");

// Force dynamically loaded modules to load now
require("negotiator/lib/mediaType");
require("nyc/node_modules/istanbul-lib-instrument");
require("moment");

// Load in global ENV
process.env.BASE_DATA_DIR = path.resolve(process.cwd(), "data");
process.env.CLIENT_JS_DIR = path.resolve(process.cwd(), "client");

var record = require("../lib/record");
var models = require("../lib/models");
var options = require("../lib/options");
var similarity = require("../lib/similar");
var server = require("../server/server");

// Models used for testing
var Image = models("Image");
var Source = models("Source");
var ImageImport = models("ImageImport");
var RecordImport = models("RecordImport");
var UploadImage = models("UploadImage");
var Upload = models("Upload");
var User = models("User");

// Use the single default record
var Record = record(Object.keys(options.types)[0]);

// Data used for testing
var source = void 0;
var sources = void 0;
var batch = void 0;
var batches = void 0;
var recordBatch = void 0;
var recordBatches = void 0;
var imageResultsData = void 0;
var images = void 0;
var image = void 0;
var uploads = void 0;
var upload = void 0;
var uploadImages = void 0;
var uploadImage = void 0;
var records = void 0;
var primaryRecord = void 0;
var recordData = void 0;
var similar = void 0;
var similarAdded = void 0;
var user = void 0;
var users = void 0;

// Sandbox the bound methods
var sandbox = void 0;

// Root Files
var pkgFile = fs.readFileSync(path.resolve(__dirname, "../../package.json"));

// Files used for testing
var testFiles = {};
var dataDir = path.resolve(__dirname, "data");

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    for (var _iterator = fs.readdirSync(dataDir)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var file = _step.value;

        if (/\.\w+$/.test(file)) {
            testFiles[file] = fs.readFileSync(path.resolve(dataDir, file));
        }
    }

    // Built client-side JS files
} catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
} finally {
    try {
        if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
        }
    } finally {
        if (_didIteratorError) {
            throw _iteratorError;
        }
    }
}

var clientFiles = {};
var clientDir = process.env.CLIENT_JS_DIR;

var _iteratorNormalCompletion2 = true;
var _didIteratorError2 = false;
var _iteratorError2 = undefined;

try {
    for (var _iterator2 = fs.readdirSync(clientDir)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _file = _step2.value;

        if (/\.\w+$/.test(_file)) {
            clientFiles[_file] = fs.readFileSync(path.resolve(clientDir, _file));
        }
    }

    // Views
} catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
} finally {
    try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
        }
    } finally {
        if (_didIteratorError2) {
            throw _iteratorError2;
        }
    }
}

var viewFiles = {};
var viewDir = path.resolve(__dirname, "..", "views");

var _iteratorNormalCompletion3 = true;
var _didIteratorError3 = false;
var _iteratorError3 = undefined;

try {
    for (var _iterator3 = fs.readdirSync(viewDir)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var _file2 = _step3.value;

        if (_file2.indexOf(".js") >= 0) {
            viewFiles[_file2] = fs.readFileSync(path.resolve(viewDir, _file2));
        }
    }
} catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
} finally {
    try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
        }
    } finally {
        if (_didIteratorError3) {
            throw _iteratorError3;
        }
    }
}

var typeViewFiles = {};
var typeViewDir = path.resolve(__dirname, "..", "views", "types", "view");

var _iteratorNormalCompletion4 = true;
var _didIteratorError4 = false;
var _iteratorError4 = undefined;

try {
    for (var _iterator4 = fs.readdirSync(typeViewDir)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var _file3 = _step4.value;

        if (_file3.indexOf(".js") >= 0) {
            typeViewFiles[_file3] = fs.readFileSync(path.resolve(typeViewDir, _file3));
        }
    }
} catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
} finally {
    try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
        }
    } finally {
        if (_didIteratorError4) {
            throw _iteratorError4;
        }
    }
}

var typeFilterFiles = {};
var typeFilterDir = path.resolve(__dirname, "..", "views", "types", "filter");

var _iteratorNormalCompletion5 = true;
var _didIteratorError5 = false;
var _iteratorError5 = undefined;

try {
    for (var _iterator5 = fs.readdirSync(typeFilterDir)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var _file4 = _step5.value;

        if (_file4.indexOf(".js") >= 0) {
            typeFilterFiles[_file4] = fs.readFileSync(path.resolve(typeFilterDir, _file4));
        }
    }
} catch (err) {
    _didIteratorError5 = true;
    _iteratorError5 = err;
} finally {
    try {
        if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
        }
    } finally {
        if (_didIteratorError5) {
            throw _iteratorError5;
        }
    }
}

var typeEditFiles = {};
var typeEditDir = path.resolve(__dirname, "..", "views", "types", "edit");

var _iteratorNormalCompletion6 = true;
var _didIteratorError6 = false;
var _iteratorError6 = undefined;

try {
    for (var _iterator6 = fs.readdirSync(typeEditDir)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var _file5 = _step6.value;

        if (_file5.indexOf(".js") >= 0) {
            typeEditFiles[_file5] = fs.readFileSync(path.resolve(typeEditDir, _file5));
        }
    }

    // Public files used to render the site
} catch (err) {
    _didIteratorError6 = true;
    _iteratorError6 = err;
} finally {
    try {
        if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
        }
    } finally {
        if (_didIteratorError6) {
            throw _iteratorError6;
        }
    }
}

var publicFiles = {};
var publicDir = path.resolve(__dirname, "..", "public");

var _iteratorNormalCompletion7 = true;
var _didIteratorError7 = false;
var _iteratorError7 = undefined;

try {
    for (var _iterator7 = fs.readdirSync(publicDir)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        var dir = _step7.value;

        var dirPath = path.resolve(publicDir, dir);
        var files = publicFiles[dir] = {};

        var _iteratorNormalCompletion12 = true;
        var _didIteratorError12 = false;
        var _iteratorError12 = undefined;

        try {
            for (var _iterator12 = fs.readdirSync(dirPath)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                var _file6 = _step12.value;

                var filePath = path.resolve(dirPath, _file6);
                files[_file6] = fs.readFileSync(filePath);
            }
        } catch (err) {
            _didIteratorError12 = true;
            _iteratorError12 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion12 && _iterator12.return) {
                    _iterator12.return();
                }
            } finally {
                if (_didIteratorError12) {
                    throw _iteratorError12;
                }
            }
        }
    }
} catch (err) {
    _didIteratorError7 = true;
    _iteratorError7 = err;
} finally {
    try {
        if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
        }
    } finally {
        if (_didIteratorError7) {
            throw _iteratorError7;
        }
    }
}

var genData = function genData() {
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
                circa: true
            }]
        }],
        dimensions: [{ width: 123, height: 130, unit: "mm" }],
        dates: [{
            original: "ca. 1456-1457",
            start: 1456,
            end: 1457,
            circa: true
        }],
        locations: [{ city: "New York City" }]
    };

    records = {
        "test/1234": new Record(Object.assign({}, recordData, {
            _id: "test/1234",
            id: "1234",
            images: ["test/foo.jpg"],
            defaultImageHash: "4266906334"
        })),

        "test/1235": new Record(Object.assign({}, recordData, {
            _id: "test/1235",
            id: "1235",
            images: ["test/bar.jpg"],
            defaultImageHash: "2508884691",
            similarRecords: [{
                _id: "test/1236",
                record: "test/1236",
                score: 17,
                source: "test",
                images: ["test/new1.jpg", "test/new2.jpg"]
            }, {
                _id: "test/1234",
                record: "test/1234",
                score: 10,
                source: "test",
                images: ["test/foo.jpg"]
            }]
        })),

        "test/1236": new Record(Object.assign({}, recordData, {
            _id: "test/1236",
            id: "1236",
            images: ["test/new1.jpg", "test/new2.jpg", "test/new3.jpg"],
            defaultImageHash: "2533156274"
        })),

        "test/1237": new Record(Object.assign({}, recordData, {
            _id: "test/1237",
            id: "1237",
            images: ["test/nosimilar.jpg"],
            defaultImageHash: "4246873662",
            similarRecords: []
        }))
    };

    var remove = function remove(callback) {
        delete records[this._id];
        process.nextTick(callback);
    };

    for (var id in records) {
        var _record = records[id];
        _record.validateSync();
        _record.isNew = false;
        sinon.stub(_record, "remove", remove);
    }

    primaryRecord = records["test/1234"];

    sources = [new Source({
        _id: "test",
        type: "artworks",
        url: "http://test.com/",
        name: "Test Source",
        shortName: "Test"
    }), new Source({
        _id: "test2",
        type: "artworks",
        url: "http://test2.com/",
        name: "Test Source 2",
        shortName: "Test2"
    })];

    source = sources[0];

    var testZip = path.resolve(process.cwd(), "testData", "test.zip");

    imageResultsData = [{
        "_id": "bar.jpg",
        "fileName": "bar.jpg",
        "warnings": [],
        "model": "test/bar.jpg"
    }, {
        "_id": "corrupted.jpg",
        "fileName": "corrupted.jpg",
        "error": "MALFORMED_IMAGE"
    }, {
        "_id": "empty.jpg",
        "fileName": "empty.jpg",
        "error": "EMPTY_IMAGE"
    }, {
        "_id": "foo.jpg",
        "fileName": "foo.jpg",
        "warnings": [],
        "model": "test/foo.jpg"
    }, {
        "_id": "new1.jpg",
        "fileName": "new1.jpg",
        "warnings": [],
        "model": "test/new1.jpg"
    }, {
        "_id": "new2.jpg",
        "fileName": "new2.jpg",
        "warnings": [],
        "model": "test/new2.jpg"
    }, {
        "_id": "small.jpg",
        "fileName": "small.jpg",
        "warnings": ["NEW_VERSION", "TOO_SMALL"],
        "model": "test/small.jpg"
    }, {
        "_id": "new3.jpg",
        "fileName": "new3.jpg",
        "warnings": [],
        "model": "test/new3.jpg"
    }, {
        "_id": "nosimilar.jpg",
        "fileName": "nosimilar.jpg",
        "warnings": ["NEW_VERSION"],
        "model": "test/nosimilar.jpg"
    }];

    batches = [new ImageImport({
        _id: "test/started",
        created: new Date(),
        modified: new Date(),
        source: "test",
        zipFile: testZip,
        fileName: "test.zip"
    }), new ImageImport({
        _id: "test/process-started",
        created: new Date(),
        modified: new Date(),
        source: "test",
        state: "process.started",
        zipFile: testZip,
        fileName: "test.zip"
    }), new ImageImport({
        _id: "test/process-completed",
        created: new Date(),
        modified: new Date(),
        source: "test",
        state: "process.completed",
        zipFile: testZip,
        fileName: "test.zip",
        results: imageResultsData
    }), new ImageImport({
        _id: "test/process-completed2",
        created: new Date(),
        modified: new Date(),
        source: "test",
        state: "process.completed",
        zipFile: testZip,
        fileName: "test.zip",
        results: imageResultsData
    }), new ImageImport({
        _id: "test/completed",
        created: new Date(),
        modified: new Date(),
        source: "test",
        state: "completed",
        zipFile: testZip,
        fileName: "test.zip",
        results: imageResultsData
    }), new ImageImport({
        _id: "test/error",
        created: new Date(),
        modified: new Date(),
        source: "test",
        state: "error",
        zipFile: testZip,
        fileName: "test.zip",
        error: "ERROR_READING_ZIP"
    })];

    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
        for (var _iterator8 = batches[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var _batch = _step8.value;

            sinon.stub(_batch, "save", process.nextTick);
        }
    } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion8 && _iterator8.return) {
                _iterator8.return();
            }
        } finally {
            if (_didIteratorError8) {
                throw _iteratorError8;
            }
        }
    }

    batch = batches[0];

    recordBatches = [new RecordImport({
        _id: "test/started",
        created: new Date(),
        modified: new Date(),
        fileName: "data.json",
        source: "test",
        type: "artworks"
    }), new RecordImport({
        _id: "test/completed",
        created: new Date(),
        modified: new Date(),
        fileName: "data.json",
        source: "test",
        type: "artworks",
        state: "completed",
        results: []
    }), new RecordImport({
        _id: "test/error",
        created: new Date(),
        modified: new Date(),
        fileName: "data.json",
        source: "test",
        type: "artworks",
        state: "error",
        error: "ABANDONED",
        results: []
    })];

    var _iteratorNormalCompletion9 = true;
    var _didIteratorError9 = false;
    var _iteratorError9 = undefined;

    try {
        for (var _iterator9 = recordBatches[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
            var _recordBatch = _step9.value;

            sinon.stub(_recordBatch, "save", process.nextTick);
        }
    } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion9 && _iterator9.return) {
                _iterator9.return();
            }
        } finally {
            if (_didIteratorError9) {
                throw _iteratorError9;
            }
        }
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
            similarImages: [{ _id: "test/bar.jpg", score: 10 }]
        }),

        "test/bar.jpg": new Image({
            _id: "test/bar.jpg",
            source: "test",
            fileName: "bar.jpg",
            hash: "2508884691",
            width: 120,
            height: 120,
            similarImages: [{ _id: "test/foo.jpg", score: 10 }, { _id: "test/new2.jpg", score: 9 }, { _id: "test/new1.jpg", score: 8 }]
        }),

        "test/new1.jpg": new Image({
            _id: "test/new1.jpg",
            source: "test",
            fileName: "new1.jpg",
            hash: "2533156274",
            width: 115,
            height: 115,
            similarImages: [{ _id: "test/bar.jpg", score: 8 }]
        }),

        "test/new2.jpg": new Image({
            _id: "test/new2.jpg",
            source: "test",
            fileName: "new2.jpg",
            hash: "614431508",
            width: 116,
            height: 116,
            similarImages: [{ _id: "test/bar.jpg", score: 9 }]
        }),

        "test/new3.jpg": new Image({
            _id: "test/new3.jpg",
            source: "test",
            fileName: "new3.jpg",
            hash: "204571459",
            width: 117,
            height: 117,
            similarImages: []
        }),

        "test/nosimilar.jpg": new Image({
            _id: "test/nosimilar.jpg",
            source: "test",
            fileName: "nosimilar.jpg",
            hash: "4246873662a",
            width: 110,
            height: 110,
            similarImages: []
        }),

        "test/small.jpg": new Image({
            _id: "test/small.jpg",
            source: "test",
            fileName: "small.jpg",
            hash: "4246873662b",
            width: 90,
            height: 90,
            similarImages: []
        })
    };

    image = images["test/foo.jpg"];

    uploadImages = {
        "uploads/4266906334.jpg": new UploadImage({
            _id: "uploads/4266906334.jpg",
            fileName: "4266906334.jpg",
            hash: "4266906334",
            width: 100,
            height: 100,
            similarImages: [{ _id: "test/bar.jpg", score: 10 }]
        })
    };

    uploadImage = uploadImages["uploads/4266906334.jpg"];

    uploads = {
        "uploads/4266906334": new Upload({
            _id: "uploads/4266906334",
            type: "artworks",
            images: ["uploads/4266906334.jpg"],
            defaultImageHash: "4266906334"
        })
    };

    upload = uploads["uploads/4266906334"];

    similar = {
        "4266906334": [{ id: "4266906334", score: 100 }, { id: "2508884691", score: 10 }, { id: "NO_LONGER_EXISTS", score: 1 }],
        "2508884691": [{ id: "2508884691", score: 100 }, { id: "4266906334", score: 10 }, { id: "614431508", score: 9 }, { id: "2533156274", score: 8 }],
        "2533156274": [{ id: "2533156274", score: 100 }, { id: "2508884691", score: 8 }],
        "614431508": [{ id: "614431508", score: 100 }, { id: "2508884691", score: 9 }],
        "204571459": [{ id: "204571459", score: 100 }],
        "1306644102": [{ id: "1306644102", score: 100 }]
    };

    similarAdded = [];

    users = [new User({
        email: "test@test.com",
        password: "test",
        sourceAdmin: ["test"],
        siteAdmin: true
    }), new User({
        email: "normal@test.com",
        password: "test",
        sourceAdmin: [],
        siteAdmin: false
    })];

    user = users[0];
};

var bindStubs = function bindStubs() {
    sandbox = sinon.sandbox.create();

    sandbox.stub(Record, "findById", function (id, callback) {
        if (records[id]) {
            process.nextTick(function () {
                return callback(null, records[id]);
            });
        } else {
            process.nextTick(function () {
                return callback(new Error("Record not found."));
            });
        }
    });

    sandbox.stub(Record, "find", function (query, callback, extra) {
        var matches = [];

        if (query.$or) {
            var imageIds = query.$or.map(function (query) {
                return query.images;
            });

            for (var id in records) {
                var _record2 = records[id];

                if (query._id.$ne === id) {
                    continue;
                }

                var _iteratorNormalCompletion10 = true;
                var _didIteratorError10 = false;
                var _iteratorError10 = undefined;

                try {
                    for (var _iterator10 = imageIds[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                        var imageId = _step10.value;

                        if (_record2.images.indexOf(imageId) >= 0) {
                            matches.push(_record2);
                            break;
                        }
                    }
                } catch (err) {
                    _didIteratorError10 = true;
                    _iteratorError10 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion10 && _iterator10.return) {
                            _iterator10.return();
                        }
                    } finally {
                        if (_didIteratorError10) {
                            throw _iteratorError10;
                        }
                    }
                }
            }
        } else if (query.source) {
            matches = Object.keys(records).filter(function (id) {
                return records[id].source === query.source;
            }).map(function (id) {
                return records[id];
            });
        } else if (query.images) {
            matches = Object.keys(records).filter(function (id) {
                return records[id].images.indexOf(query.images) >= 0;
            }).map(function (id) {
                return records[id];
            });
        } else {
            matches = Object.keys(records).map(function (id) {
                return records[id];
            });
        }

        var _loop = function _loop(_record3) {
            if (!_record3.save.restore) {
                sandbox.stub(_record3, "save", function (callback) {
                    if (!(_record3._id in records)) {
                        records[_record3._id] = _record3;
                    }

                    process.nextTick(callback);
                });
            }
        };

        var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
            for (var _iterator11 = matches[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                var _record3 = _step11.value;

                _loop(_record3);
            }
        } catch (err) {
            _didIteratorError11 = true;
            _iteratorError11 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion11 && _iterator11.return) {
                    _iterator11.return();
                }
            } finally {
                if (_didIteratorError11) {
                    throw _iteratorError11;
                }
            }
        }

        if (!callback || extra) {
            var _ret2 = function () {
                var ret = {
                    lean: function lean() {
                        return ret;
                    },
                    distinct: function distinct(name) {
                        matches = matches.map(function (match) {
                            return match[name];
                        });
                        return ret;
                    },
                    stream: function stream() {
                        return ret;
                    },
                    on: function on(name, callback) {
                        if (name === "data") {
                            ret._ondata = callback.bind(ret);
                            return ret;
                        }

                        ret._onclose = callback.bind(ret);
                        process.nextTick(ret._popData);
                        return ret;
                    },
                    pause: function pause() {
                        return ret;
                    },
                    resume: function resume() {
                        process.nextTick(ret._popData);
                    },
                    _popData: function _popData() {
                        if (matches.length > 0) {
                            ret._ondata(matches.shift());
                        } else {
                            ret._onclose();
                        }
                    },
                    exec: function exec(callback) {
                        return process.nextTick(function () {
                            return callback(null, matches);
                        });
                    }
                };
                return {
                    v: ret
                };
            }();

            if ((typeof _ret2 === "undefined" ? "undefined" : _typeof(_ret2)) === "object") return _ret2.v;
        }

        process.nextTick(function () {
            return callback(null, matches);
        });
    });

    sandbox.stub(Record, "search", function (query, options, callback) {
        var matches = Object.keys(records).map(function (id) {
            return records[id];
        });
        var aggregations = {
            source: {
                buckets: [{ key: "test", doc_count: 2 }]
            },
            objectType: {
                buckets: [{ key: "painting", doc_count: 2 }]
            },
            dates: {
                buckets: [{ from: 1100, to: 1199, doc_count: 2 }]
            },
            artists: {
                buckets: [{ key: "Test", doc_count: 2 }]
            },
            "dimensions.width": {
                buckets: [{ from: 100, to: 199, doc_count: 2 }]
            },
            "dimensions.height": {
                buckets: [{ from: 100, to: 199, doc_count: 2 }]
            }
        };

        process.nextTick(function () {
            return callback(null, {
                aggregations: aggregations,
                hits: {
                    total: matches.length,
                    hits: matches
                }
            });
        });
    });

    sandbox.stub(Record, "update", function (query, update, options, callback) {
        Object.keys(records).forEach(function (id) {
            records[id].needsSimilarUpdate = true;
        });
        process.nextTick(callback);
    });

    sandbox.stub(Record, "count", function (query, callback) {
        var count = Object.keys(records).filter(function (id) {
            return !query.source || records[id].source === query.source;
        }).length;

        process.nextTick(function () {
            return callback(null, count);
        });
    });

    sandbox.stub(Record, "aggregate", function (query, callback) {
        var source = query[0].$match.source;
        var count = Object.keys(records).filter(function (id) {
            return records[id].source === source;
        }).length;

        process.nextTick(function () {
            return callback(null, [{
                total: count,
                totalImages: count
            }]);
        });
    });

    var fromData = Record.fromData;

    sandbox.stub(Record, "fromData", function (tmpData, i18n, callback) {
        fromData.call(Record, tmpData, i18n, function (err, record, warnings, creating) {
            if (record && !record.save.restore) {
                sandbox.stub(record, "save", function (callback) {
                    if (!(record._id in records)) {
                        records[record._id] = record;
                    }

                    process.nextTick(callback);
                });
            }

            callback(err, record, warnings, creating);
        });
    });

    sandbox.stub(ImageImport, "find", function (query, select, options, callback) {
        process.nextTick(function () {
            return callback(null, batches);
        });
    });

    sandbox.stub(ImageImport, "findById", function (id, callback) {
        process.nextTick(function () {
            callback(null, batches.find(function (batch) {
                return batch._id === id;
            }));
        });
    });

    var imageImportFromFile = ImageImport.fromFile;

    sandbox.stub(ImageImport, "fromFile", function (fileName, source) {
        var batch = imageImportFromFile.call(ImageImport, fileName, source);
        if (!batch.save.restore) {
            sandbox.stub(batch, "save", function (callback) {
                return batch.validate(function (err) {
                    /* istanbul ignore if */
                    if (err) {
                        return callback(err);
                    }

                    batch.modified = new Date();
                    batches.push(batch);
                    callback(null, batch);
                });
            });
        }
        return batch;
    });

    sandbox.stub(RecordImport, "find", function (query, select, options, callback) {
        process.nextTick(function () {
            callback(null, recordBatches);
        });
    });

    sandbox.stub(RecordImport, "findById", function (id, callback) {
        process.nextTick(function () {
            callback(null, recordBatches.find(function (batch) {
                return batch._id === id;
            }));
        });
    });

    var recordImportFromFile = RecordImport.fromFile;

    sandbox.stub(RecordImport, "fromFile", function (fileName, source, type) {
        var batch = recordImportFromFile.call(RecordImport, fileName, source, type);
        if (!batch.save.restore) {
            sandbox.stub(batch, "save", function (callback) {
                return batch.validate(function (err) {
                    /* istanbul ignore if */
                    if (err) {
                        return callback(err);
                    }

                    batch.modified = new Date();
                    recordBatches.push(batch);
                    callback(null, batch);
                });
            });
        }
        return batch;
    });

    sandbox.stub(Source, "find", function (query, callback) {
        process.nextTick(function () {
            return callback(null, sources);
        });
    });

    sandbox.stub(Image, "findById", function (id, callback) {
        process.nextTick(function () {
            return callback(null, images[id]);
        });
    });

    sandbox.stub(Image, "findOne", function (query, callback) {
        // NOTE(jeresig): query.hash is assumed
        var id = Object.keys(images).find(function (id) {
            return images[id].hash === query.hash;
        });
        var match = images[id];

        process.nextTick(function () {
            return callback(null, match);
        });
    });

    sandbox.stub(Image, "update", function (query, update, options, callback) {
        process.nextTick(callback);
    });

    var fromFile = Image.fromFile;

    sandbox.stub(Image, "fromFile", function (batch, file, callback) {
        fromFile.call(Image, batch, file, function (err, image, warnings) {
            if (image && !image.save.restore) {
                sandbox.stub(image, "save", function (callback) {
                    images[image._id] = image;
                    image.validate(callback);
                });
            }

            callback(err, image, warnings);
        });
    });

    sandbox.stub(Image, "count", function (query, callback) {
        var count = Object.keys(images).filter(function (id) {
            return !query.source || images[id].source === query.source;
        }).length;

        process.nextTick(function () {
            return callback(null, count);
        });
    });

    sandbox.stub(UploadImage, "findById", function (id, callback) {
        process.nextTick(function () {
            return callback(null, uploadImages[id]);
        });
    });

    var uploadFromFile = UploadImage.fromFile;

    sandbox.stub(UploadImage, "fromFile", function (file, callback) {
        uploadFromFile.call(UploadImage, file, function (err, image, warnings) {
            if (image && !image.save.restore) {
                sandbox.stub(image, "save", function (callback) {
                    uploadImages[image._id] = image;
                    image.validate(callback);
                });
            }

            callback(err, image, warnings);
        });
    });

    sandbox.stub(Upload, "findById", function (id, callback) {
        process.nextTick(function () {
            return callback(null, uploads[id]);
        });
    });

    var fromImage = Upload.fromImage;

    sandbox.stub(Upload, "fromImage", function (image, type, callback) {
        fromImage.call(Upload, image, type, function (err, upload) {
            if (upload && !upload.save.restore) {
                sandbox.stub(upload, "save", function (callback) {
                    if (!(upload._id in uploads)) {
                        uploads[upload._id] = upload;
                    }

                    process.nextTick(callback);
                });
            }

            callback(err, upload);
        });
    });

    sandbox.stub(User, "find", function (query, callback) {
        process.nextTick(function () {
            return callback(null, users);
        });
    });

    sandbox.stub(User, "findOne", function (query, callback) {
        var matches = users.filter(function (user) {
            return user.email === query.email || query._id && user._id.toString() === query._id.toString();
        });
        process.nextTick(function () {
            return callback(null, matches[0]);
        });
    });

    sandbox.stub(similarity, "similar", function (hash, callback) {
        process.nextTick(function () {
            return callback(null, similar[hash]);
        });
    });

    sandbox.stub(similarity, "fileSimilar", function (file, callback) {
        // Cheat and just get the hash from the file name
        var hash = path.basename(file).replace(/\..*$/, "");
        process.nextTick(function () {
            return callback(null, similar[hash]);
        });
    });

    sandbox.stub(similarity, "idIndexed", function (hash, callback) {
        process.nextTick(function () {
            return callback(null, !!similar[hash]);
        });
    });

    sandbox.stub(similarity, "add", function (file, hash, callback) {
        if (hash === "99998") {
            return process.nextTick(function () {
                return callback({
                    type: "IMAGE_SIZE_TOO_SMALL"
                });
            });
        }

        similarAdded.push({ id: hash, score: 5 });
        similar[hash] = similarAdded;

        process.nextTick(callback);
    });
};

var i18n = {
    format: function format(msg, fields) {
        return msg.replace(/%\((.*?)\)s/g, function (all, name) {
            return fields[name];
        });
    },
    gettext: function gettext(msg) {
        return msg;
    },
    lang: "en"
};

var app = void 0;

var init = function init(done) {
    genData();
    bindStubs();

    async.parallel([function (callback) {
        Source.cacheSources(function () {
            async.each(Object.keys(records), function (id, callback) {
                records[id].validate(callback);
            }, callback);
        });
    }, function (callback) {
        server(function (err, _app) {
            app = _app;
            callback(err);
        });
    }], function () {
        mockfs({
            "package.json": pkgFile,
            "node_modules": {
                ".cache": {
                    "nyc": {}
                }
            },
            "testData": testFiles,
            "client": clientFiles,
            "data": {
                "test": {
                    "images": {},
                    "scaled": {},
                    "thumbs": {}
                },
                "uploads": {
                    "images": {
                        "4266906334.jpg": testFiles["4266906334.jpg"],
                        "bar.jpg": testFiles["bar.jpg"]
                    },
                    "scaled": {},
                    "thumbs": {}
                }
            },
            "build": {
                "public": publicFiles,
                "views": Object.assign({
                    "types": {
                        "filter": typeFilterFiles,
                        "view": typeViewFiles,
                        "edit": typeEditFiles
                    }
                }, viewFiles)
            }
        });

        done();
    });
};

tap.beforeEach(init);

tap.afterEach(function (done) {
    app.close();
    sandbox.restore();
    mockfs.restore();
    done();
});

module.exports = {
    getBatch: function getBatch() {
        return batch;
    },
    getBatches: function getBatches() {
        return batches;
    },
    getRecordBatch: function getRecordBatch() {
        return recordBatch;
    },
    getImage: function getImage() {
        return image;
    },
    getSource: function getSource() {
        return source;
    },
    getRecord: function getRecord() {
        return primaryRecord;
    },
    getRecords: function getRecords() {
        return records;
    },
    getRecordData: function getRecordData() {
        return recordData;
    },
    getImageResultsData: function getImageResultsData() {
        return imageResultsData;
    },
    getUpload: function getUpload() {
        return upload;
    },
    getUploads: function getUploads() {
        return uploads;
    },
    getUploadImage: function getUploadImage() {
        return uploadImage;
    },
    getUser: function getUser() {
        return user;
    },
    i18n: i18n,
    Image: Image,
    Record: Record,
    ImageImport: ImageImport,
    RecordImport: RecordImport,
    UploadImage: UploadImage,
    User: User,
    Source: Source,
    stub: sinon.stub,
    init: init
};