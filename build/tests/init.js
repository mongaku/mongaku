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

// Load in global ENV
process.env.BASE_DATA_DIR = path.resolve(process.cwd(), "data");

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

    // Views
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

var viewFiles = {};
var viewDir = path.resolve(__dirname, "..", "views");

var _iteratorNormalCompletion2 = true;
var _didIteratorError2 = false;
var _iteratorError2 = undefined;

try {
    for (var _iterator2 = fs.readdirSync(viewDir)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _file = _step2.value;

        if (_file.indexOf(".js") >= 0) {
            viewFiles[_file] = fs.readFileSync(path.resolve(viewDir, _file));
        }
    }
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

var typeViewFiles = {};
var typeViewDir = path.resolve(__dirname, "..", "views", "types", "view");

var _iteratorNormalCompletion3 = true;
var _didIteratorError3 = false;
var _iteratorError3 = undefined;

try {
    for (var _iterator3 = fs.readdirSync(typeViewDir)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var _file2 = _step3.value;

        if (_file2.indexOf(".js") >= 0) {
            typeViewFiles[_file2] = fs.readFileSync(path.resolve(typeViewDir, _file2));
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

var typeFilterFiles = {};
var typeFilterDir = path.resolve(__dirname, "..", "views", "types", "filter");

var _iteratorNormalCompletion4 = true;
var _didIteratorError4 = false;
var _iteratorError4 = undefined;

try {
    for (var _iterator4 = fs.readdirSync(typeFilterDir)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var _file3 = _step4.value;

        if (_file3.indexOf(".js") >= 0) {
            typeFilterFiles[_file3] = fs.readFileSync(path.resolve(typeFilterDir, _file3));
        }
    }

    // Public files used to render the site
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

var publicFiles = {};
var publicDir = path.resolve(__dirname, "..", "public");

var _iteratorNormalCompletion5 = true;
var _didIteratorError5 = false;
var _iteratorError5 = undefined;

try {
    for (var _iterator5 = fs.readdirSync(publicDir)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var dir = _step5.value;

        var dirPath = path.resolve(publicDir, dir);
        var files = publicFiles[dir] = {};

        var _iteratorNormalCompletion10 = true;
        var _didIteratorError10 = false;
        var _iteratorError10 = undefined;

        try {
            for (var _iterator10 = fs.readdirSync(dirPath)[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                var _file4 = _step10.value;

                var filePath = path.resolve(dirPath, _file4);
                files[_file4] = fs.readFileSync(filePath);
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

    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
        for (var _iterator6 = batches[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var _batch = _step6.value;

            sinon.stub(_batch, "save", process.nextTick);
        }
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

    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
        for (var _iterator7 = recordBatches[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var _recordBatch = _step7.value;

            sinon.stub(_recordBatch, "save", process.nextTick);
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

                var _iteratorNormalCompletion8 = true;
                var _didIteratorError8 = false;
                var _iteratorError8 = undefined;

                try {
                    for (var _iterator8 = imageIds[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                        var imageId = _step8.value;

                        if (_record2.images.indexOf(imageId) >= 0) {
                            matches.push(_record2);
                            break;
                        }
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

        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
            var _loop = function _loop() {
                var record = _step9.value;

                if (!record.save.restore) {
                    sandbox.stub(record, "save", function (callback) {
                        if (!(record._id in records)) {
                            records[record._id] = record;
                        }

                        process.nextTick(callback);
                    });
                }
            };

            for (var _iterator9 = matches[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                _loop();
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

        if (!callback || extra) {
            var _ret = function () {
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

            if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
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

    sandbox.stub(Record, "fromData", function (tmpData, req, callback) {
        fromData.call(Record, tmpData, req, function (err, record, warnings, creating) {
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

var req = {
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
            "testData": testFiles,
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
                        "view": typeViewFiles
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
    req: req,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0cy9pbml0LmpzIl0sIm5hbWVzIjpbImZzIiwicmVxdWlyZSIsInBhdGgiLCJ0YXAiLCJzaW5vbiIsIm1vY2tmcyIsImFzeW5jIiwiaWNvbnYiLCJnZXRDb2RlYyIsInByb2Nlc3MiLCJlbnYiLCJCQVNFX0RBVEFfRElSIiwicmVzb2x2ZSIsImN3ZCIsInJlY29yZCIsIm1vZGVscyIsIm9wdGlvbnMiLCJzaW1pbGFyaXR5Iiwic2VydmVyIiwiSW1hZ2UiLCJTb3VyY2UiLCJJbWFnZUltcG9ydCIsIlJlY29yZEltcG9ydCIsIlVwbG9hZEltYWdlIiwiVXBsb2FkIiwiVXNlciIsIlJlY29yZCIsIk9iamVjdCIsImtleXMiLCJ0eXBlcyIsInNvdXJjZSIsInNvdXJjZXMiLCJiYXRjaCIsImJhdGNoZXMiLCJyZWNvcmRCYXRjaCIsInJlY29yZEJhdGNoZXMiLCJpbWFnZVJlc3VsdHNEYXRhIiwiaW1hZ2VzIiwiaW1hZ2UiLCJ1cGxvYWRzIiwidXBsb2FkIiwidXBsb2FkSW1hZ2VzIiwidXBsb2FkSW1hZ2UiLCJyZWNvcmRzIiwicHJpbWFyeVJlY29yZCIsInJlY29yZERhdGEiLCJzaW1pbGFyIiwic2ltaWxhckFkZGVkIiwidXNlciIsInVzZXJzIiwic2FuZGJveCIsInBrZ0ZpbGUiLCJyZWFkRmlsZVN5bmMiLCJfX2Rpcm5hbWUiLCJ0ZXN0RmlsZXMiLCJkYXRhRGlyIiwicmVhZGRpclN5bmMiLCJmaWxlIiwidGVzdCIsInZpZXdGaWxlcyIsInZpZXdEaXIiLCJpbmRleE9mIiwidHlwZVZpZXdGaWxlcyIsInR5cGVWaWV3RGlyIiwidHlwZUZpbHRlckZpbGVzIiwidHlwZUZpbHRlckRpciIsInB1YmxpY0ZpbGVzIiwicHVibGljRGlyIiwiZGlyIiwiZGlyUGF0aCIsImZpbGVzIiwiZmlsZVBhdGgiLCJnZW5EYXRhIiwiaWQiLCJ0eXBlIiwibGFuZyIsInVybCIsInRpdGxlIiwib2JqZWN0VHlwZSIsIm1lZGl1bSIsImFydGlzdHMiLCJuYW1lIiwiZGF0ZXMiLCJvcmlnaW5hbCIsInN0YXJ0IiwiZW5kIiwiY2lyY2EiLCJkaW1lbnNpb25zIiwid2lkdGgiLCJoZWlnaHQiLCJ1bml0IiwibG9jYXRpb25zIiwiY2l0eSIsImFzc2lnbiIsIl9pZCIsImRlZmF1bHRJbWFnZUhhc2giLCJzaW1pbGFyUmVjb3JkcyIsInNjb3JlIiwicmVtb3ZlIiwiY2FsbGJhY2siLCJuZXh0VGljayIsInZhbGlkYXRlU3luYyIsImlzTmV3Iiwic3R1YiIsInNob3J0TmFtZSIsInRlc3RaaXAiLCJjcmVhdGVkIiwiRGF0ZSIsIm1vZGlmaWVkIiwiemlwRmlsZSIsImZpbGVOYW1lIiwic3RhdGUiLCJyZXN1bHRzIiwiZXJyb3IiLCJoYXNoIiwic2ltaWxhckltYWdlcyIsImVtYWlsIiwicGFzc3dvcmQiLCJzb3VyY2VBZG1pbiIsInNpdGVBZG1pbiIsImJpbmRTdHVicyIsImNyZWF0ZSIsIkVycm9yIiwicXVlcnkiLCJleHRyYSIsIm1hdGNoZXMiLCIkb3IiLCJpbWFnZUlkcyIsIm1hcCIsIiRuZSIsImltYWdlSWQiLCJwdXNoIiwiZmlsdGVyIiwic2F2ZSIsInJlc3RvcmUiLCJyZXQiLCJsZWFuIiwiZGlzdGluY3QiLCJtYXRjaCIsInN0cmVhbSIsIm9uIiwiX29uZGF0YSIsImJpbmQiLCJfb25jbG9zZSIsIl9wb3BEYXRhIiwicGF1c2UiLCJyZXN1bWUiLCJsZW5ndGgiLCJzaGlmdCIsImV4ZWMiLCJhZ2dyZWdhdGlvbnMiLCJidWNrZXRzIiwia2V5IiwiZG9jX2NvdW50IiwiZnJvbSIsInRvIiwiaGl0cyIsInRvdGFsIiwidXBkYXRlIiwiZm9yRWFjaCIsIm5lZWRzU2ltaWxhclVwZGF0ZSIsImNvdW50IiwiJG1hdGNoIiwidG90YWxJbWFnZXMiLCJmcm9tRGF0YSIsInRtcERhdGEiLCJyZXEiLCJjYWxsIiwiZXJyIiwid2FybmluZ3MiLCJjcmVhdGluZyIsInNlbGVjdCIsImZpbmQiLCJpbWFnZUltcG9ydEZyb21GaWxlIiwiZnJvbUZpbGUiLCJ2YWxpZGF0ZSIsInJlY29yZEltcG9ydEZyb21GaWxlIiwidXBsb2FkRnJvbUZpbGUiLCJmcm9tSW1hZ2UiLCJ0b1N0cmluZyIsImJhc2VuYW1lIiwicmVwbGFjZSIsImZvcm1hdCIsIm1zZyIsImZpZWxkcyIsImFsbCIsImdldHRleHQiLCJhcHAiLCJpbml0IiwiZG9uZSIsInBhcmFsbGVsIiwiY2FjaGVTb3VyY2VzIiwiZWFjaCIsIl9hcHAiLCJiZWZvcmVFYWNoIiwiYWZ0ZXJFYWNoIiwiY2xvc2UiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0QmF0Y2giLCJnZXRCYXRjaGVzIiwiZ2V0UmVjb3JkQmF0Y2giLCJnZXRJbWFnZSIsImdldFNvdXJjZSIsImdldFJlY29yZCIsImdldFJlY29yZHMiLCJnZXRSZWNvcmREYXRhIiwiZ2V0SW1hZ2VSZXN1bHRzRGF0YSIsImdldFVwbG9hZCIsImdldFVwbG9hZHMiLCJnZXRVcGxvYWRJbWFnZSIsImdldFVzZXIiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFNQSxLQUFLQyxRQUFRLElBQVIsQ0FBWDtBQUNBLElBQU1DLE9BQU9ELFFBQVEsTUFBUixDQUFiOztBQUVBLElBQU1FLE1BQU1GLFFBQVEsS0FBUixDQUFaO0FBQ0EsSUFBTUcsUUFBUUgsUUFBUSxPQUFSLENBQWQ7QUFDQSxJQUFNSSxTQUFTSixRQUFRLFNBQVIsQ0FBZjtBQUNBLElBQU1LLFFBQVFMLFFBQVEsT0FBUixDQUFkO0FBQ0EsSUFBTU0sUUFBUU4sUUFBUSxZQUFSLENBQWQ7O0FBRUE7QUFDQU0sTUFBTUMsUUFBTixDQUFlLE1BQWY7O0FBRUE7QUFDQUMsUUFBUUMsR0FBUixDQUFZQyxhQUFaLEdBQTRCVCxLQUFLVSxPQUFMLENBQWFILFFBQVFJLEdBQVIsRUFBYixFQUE0QixNQUE1QixDQUE1Qjs7QUFFQSxJQUFNQyxTQUFTYixRQUFRLGVBQVIsQ0FBZjtBQUNBLElBQU1jLFNBQVNkLFFBQVEsZUFBUixDQUFmO0FBQ0EsSUFBTWUsVUFBVWYsUUFBUSxnQkFBUixDQUFoQjtBQUNBLElBQU1nQixhQUFh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QVNia0sseUJBQXFCO0FBQUEsZUFBTTNLLGdCQUFOO0FBQUEsS0FUUjtBQVViNEssZUFBVztBQUFBLGVBQU14SyxNQUFOO0FBQUEsS0FWRTtBQVdieUssZ0JBQVk7QUFBQSxlQUFNMUssT0FBTjtBQUFBLEtBWEM7QUFZYjJLLG9CQUFnQjtBQUFBLGVBQU14SyxXQUFOO0FBQUEsS0FaSDtBQWFieUssYUFBUztBQUFBLGVBQU1uSyxJQUFOO0FBQUEsS0FiSTtBQWNic0gsWUFkYTtBQWVibkosZ0JBZmE7QUFnQmJPLGtCQWhCYTtBQWlCYkwsNEJBakJhO0FBa0JiQyw4QkFsQmE7QUFtQmJDLDRCQW5CYTtBQW9CYkUsY0FwQmE7QUFxQmJMLGtCQXJCYTtBQXNCYm1GLFVBQU1uRyxNQUFNbUcsSUF0QkM7QUF1QmJxRjtBQXZCYSxDQUFqQiIsImZpbGUiOiJpbml0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZnMgPSByZXF1aXJlKFwiZnNcIik7XG5jb25zdCBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XG5cbmNvbnN0IHRhcCA9IHJlcXVpcmUoXCJ0YXBcIik7XG5jb25zdCBzaW5vbiA9IHJlcXVpcmUoXCJzaW5vblwiKTtcbmNvbnN0IG1vY2tmcyA9IHJlcXVpcmUoXCJtb2NrLWZzXCIpO1xuY29uc3QgYXN5bmMgPSByZXF1aXJlKFwiYXN5bmNcIik7XG5jb25zdCBpY29udiA9IHJlcXVpcmUoXCJpY29udi1saXRlXCIpO1xuXG4vLyBGb3JjZSBJQ09OViB0byBwcmUtbG9hZCBpdHMgZW5jb2RpbmdzXG5pY29udi5nZXRDb2RlYyhcInV0ZjhcIik7XG5cbi8vIExvYWQgaW4gZ2xvYmFsIEVOVlxucHJvY2Vzcy5lbnYuQkFTRV9EQVRBX0RJUiA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBcImRhdGFcIik7XG5cbmNvbnN0IHJlY29yZCA9IHJlcXVpcmUoXCIuLi9saWIvcmVjb3JkXCIpO1xuY29uc3QgbW9kZWxzID0gcmVxdWlyZShcIi4uL2xpYi9tb2RlbHNcIik7XG5jb25zdCBvcHRpb25zID0gcmVxdWlyZShcIi4uL2xpYi9vcHRpb25zXCIpO1xuY29uc3Qgc2ltaWxhcml0eSA9IHJlcXVpcmUoXCIuLi9saWIvc2ltaWxhclwiKTtcbmNvbnN0IHNlcnZlciA9IHJlcXVpcmUoXCIuLi9zZXJ2ZXIvc2VydmVyXCIpO1xuXG4vLyBNb2RlbHMgdXNlZCBmb3IgdGVzdGluZ1xuY29uc3QgSW1hZ2UgPSBtb2RlbHMoXCJJbWFnZVwiKTtcbmNvbnN0IFNvdXJjZSA9IG1vZGVscyhcIlNvdXJjZVwiKTtcbmNvbnN0IEltYWdlSW1wb3J0ID0gbW9kZWxzKFwiSW1hZ2VJbXBvcnRcIik7XG5jb25zdCBSZWNvcmRJbXBvcnQgPSBtb2RlbHMoXCJSZWNvcmRJbXBvcnRcIik7XG5jb25zdCBVcGxvYWRJbWFnZSA9IG1vZGVscyhcIlVwbG9hZEltYWdlXCIpO1xuY29uc3QgVXBsb2FkID0gbW9kZWxzKFwiVXBsb2FkXCIpO1xuY29uc3QgVXNlciA9IG1vZGVscyhcIlVzZXJcIik7XG5cbi8vIFVzZSB0aGUgc2luZ2xlIGRlZmF1bHQgcmVjb3JkXG5jb25zdCBSZWNvcmQgPSByZWNvcmQoT2JqZWN0LmtleXMob3B0aW9ucy50eXBlcylbMF0pO1xuXG4vLyBEYXRhIHVzZWQgZm9yIHRlc3RpbmdcbmxldCBzb3VyY2U7XG5sZXQgc291cmNlcztcbmxldCBiYXRjaDtcbmxldCBiYXRjaGVzO1xubGV0IHJlY29yZEJhdGNoO1xubGV0IHJlY29yZEJhdGNoZXM7XG5sZXQgaW1hZ2VSZXN1bHRzRGF0YTtcbmxldCBpbWFnZXM7XG5sZXQgaW1hZ2U7XG5sZXQgdXBsb2FkcztcbmxldCB1cGxvYWQ7XG5sZXQgdXBsb2FkSW1hZ2VzO1xubGV0IHVwbG9hZEltYWdlO1xubGV0IHJlY29yZHM7XG5sZXQgcHJpbWFyeVJlY29yZDtcbmxldCByZWNvcmREYXRhO1xubGV0IHNpbWlsYXI7XG5sZXQgc2ltaWxhckFkZGVkO1xubGV0IHVzZXI7XG5sZXQgdXNlcnM7XG5cbi8vIFNhbmRib3ggdGhlIGJvdW5kIG1ldGhvZHNcbmxldCBzYW5kYm94O1xuXG4vLyBSb290IEZpbGVzXG5jb25zdCBwa2dGaWxlID0gZnMucmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vLi4vcGFja2FnZS5qc29uXCIpKTtcblxuLy8gRmlsZXMgdXNlZCBmb3IgdGVzdGluZ1xuY29uc3QgdGVzdEZpbGVzID0ge307XG5jb25zdCBkYXRhRGlyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJkYXRhXCIpO1xuXG5mb3IgKGNvbnN0IGZpbGUgb2YgZnMucmVhZGRpclN5bmMoZGF0YURpcikpIHtcbiAgICBpZiAoL1xcLlxcdyskLy50ZXN0KGZpbGUpKSB7XG4gICAgICAgIHRlc3RGaWxlc1tmaWxlXSA9IGZzLnJlYWRGaWxlU3luYyhwYXRoLnJlc29sdmUoZGF0YURpciwgZmlsZSkpO1xuICAgIH1cbn1cblxuLy8gVmlld3NcbmNvbnN0IHZpZXdGaWxlcyA9IHt9O1xuY29uc3Qgdmlld0RpciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi5cIiwgXCJ2aWV3c1wiKTtcblxuZm9yIChjb25zdCBmaWxlIG9mIGZzLnJlYWRkaXJTeW5jKHZpZXdEaXIpKSB7XG4gICAgaWYgKGZpbGUuaW5kZXhPZihcIi5qc1wiKSA+PSAwKSB7XG4gICAgICAgIHZpZXdGaWxlc1tmaWxlXSA9IGZzLnJlYWRGaWxlU3luYyhwYXRoLnJlc29sdmUodmlld0RpciwgZmlsZSkpO1xuICAgIH1cbn1cblxuY29uc3QgdHlwZVZpZXdGaWxlcyA9IHt9O1xuY29uc3QgdHlwZVZpZXdEaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uXCIsIFwidmlld3NcIiwgXCJ0eXBlc1wiLCBcInZpZXdcIik7XG5cbmZvciAoY29uc3QgZmlsZSBvZiBmcy5yZWFkZGlyU3luYyh0eXBlVmlld0RpcikpIHtcbiAgICBpZiAoZmlsZS5pbmRleE9mKFwiLmpzXCIpID49IDApIHtcbiAgICAgICAgdHlwZVZpZXdGaWxlc1tmaWxlXSA9IGZzLnJlYWRGaWxlU3luYyhwYXRoLnJlc29sdmUodHlwZVZpZXdEaXIsIGZpbGUpKTtcbiAgICB9XG59XG5cbmNvbnN0IHR5cGVGaWx0ZXJGaWxlcyA9IHt9O1xuY29uc3QgdHlwZUZpbHRlckRpciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi5cIiwgXCJ2aWV3c1wiLCBcInR5cGVzXCIsIFwiZmlsdGVyXCIpO1xuXG5mb3IgKGNvbnN0IGZpbGUgb2YgZnMucmVhZGRpclN5bmModHlwZUZpbHRlckRpcikpIHtcbiAgICBpZiAoZmlsZS5pbmRleE9mKFwiLmpzXCIpID49IDApIHtcbiAgICAgICAgdHlwZUZpbHRlckZpbGVzW2ZpbGVdID1cbiAgICAgICAgICAgIGZzLnJlYWRGaWxlU3luYyhwYXRoLnJlc29sdmUodHlwZUZpbHRlckRpciwgZmlsZSkpO1xuICAgIH1cbn1cblxuLy8gUHVibGljIGZpbGVzIHVzZWQgdG8gcmVuZGVyIHRoZSBzaXRlXG5jb25zdCBwdWJsaWNGaWxlcyA9IHt9O1xuY29uc3QgcHVibGljRGlyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLlwiLCBcInB1YmxpY1wiKTtcblxuZm9yIChjb25zdCBkaXIgb2YgZnMucmVhZGRpclN5bmMocHVibGljRGlyKSkge1xuICAgIGNvbnN0IGRpclBhdGggPSBwYXRoLnJlc29sdmUocHVibGljRGlyLCBkaXIpO1xuICAgIGNvbnN0IGZpbGVzID0gcHVibGljRmlsZXNbZGlyXSA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBmaWxlIG9mIGZzLnJlYWRkaXJTeW5jKGRpclBhdGgpKSB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKGRpclBhdGgsIGZpbGUpO1xuICAgICAgICBmaWxlc1tmaWxlXSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCk7XG4gICAgfVxufVxuXG5jb25zdCBnZW5EYXRhID0gKCkgPT4ge1xuICAgIHJlY29yZERhdGEgPSB7XG4gICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICBzb3VyY2U6IFwidGVzdFwiLFxuICAgICAgICBsYW5nOiBcImVuXCIsXG4gICAgICAgIHVybDogXCJodHRwOi8vZ29vZ2xlLmNvbVwiLFxuICAgICAgICBpbWFnZXM6IFtcImZvby5qcGdcIl0sXG4gICAgICAgIHRpdGxlOiBcIlRlc3RcIixcbiAgICAgICAgb2JqZWN0VHlwZTogXCJwYWludGluZ1wiLFxuICAgICAgICBtZWRpdW06IFwib2lsXCIsXG4gICAgICAgIGFydGlzdHM6IFt7XG4gICAgICAgICAgICBuYW1lOiBcIlRlc3RcIixcbiAgICAgICAgICAgIGRhdGVzOiBbe1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsOiBcImNhLiAxNDU2LTE0NTdcIixcbiAgICAgICAgICAgICAgICBzdGFydDogMTQ1NixcbiAgICAgICAgICAgICAgICBlbmQ6IDE0NTcsXG4gICAgICAgICAgICAgICAgY2lyY2E6IHRydWUsXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgfV0sXG4gICAgICAgIGRpbWVuc2lvbnM6IFt7d2lkdGg6IDEyMywgaGVpZ2h0OiAxMzAsIHVuaXQ6IFwibW1cIn1dLFxuICAgICAgICBkYXRlczogW3tcbiAgICAgICAgICAgIG9yaWdpbmFsOiBcImNhLiAxNDU2LTE0NTdcIixcbiAgICAgICAgICAgIHN0YXJ0OiAxNDU2LFxuICAgICAgICAgICAgZW5kOiAxNDU3LFxuICAgICAgICAgICAgY2lyY2E6IHRydWUsXG4gICAgICAgIH1dLFxuICAgICAgICBsb2NhdGlvbnM6IFt7Y2l0eTogXCJOZXcgWW9yayBDaXR5XCJ9XSxcbiAgICB9O1xuXG4gICAgcmVjb3JkcyA9IHtcbiAgICAgICAgXCJ0ZXN0LzEyMzRcIjogbmV3IFJlY29yZChPYmplY3QuYXNzaWduKHt9LCByZWNvcmREYXRhLCB7XG4gICAgICAgICAgICBfaWQ6IFwidGVzdC8xMjM0XCIsXG4gICAgICAgICAgICBpZDogXCIxMjM0XCIsXG4gICAgICAgICAgICBpbWFnZXM6IFtcInRlc3QvZm9vLmpwZ1wiXSxcbiAgICAgICAgICAgIGRlZmF1bHRJbWFnZUhhc2g6IFwiNDI2NjkwNjMzNFwiLFxuICAgICAgICB9KSksXG5cbiAgICAgICAgXCJ0ZXN0LzEyMzVcIjogbmV3IFJlY29yZChPYmplY3QuYXNzaWduKHt9LCByZWNvcmREYXRhLCB7XG4gICAgICAgICAgICBfaWQ6IFwidGVzdC8xMjM1XCIsXG4gICAgICAgICAgICBpZDogXCIxMjM1XCIsXG4gICAgICAgICAgICBpbWFnZXM6IFtcInRlc3QvYmFyLmpwZ1wiXSxcbiAgICAgICAgICAgIGRlZmF1bHRJbWFnZUhhc2g6IFwiMjUwODg4NDY5MVwiLFxuICAgICAgICAgICAgc2ltaWxhclJlY29yZHM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIF9pZDogXCJ0ZXN0LzEyMzZcIixcbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkOiBcInRlc3QvMTIzNlwiLFxuICAgICAgICAgICAgICAgICAgICBzY29yZTogMTcsXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogXCJ0ZXN0XCIsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlczogW1widGVzdC9uZXcxLmpwZ1wiLCBcInRlc3QvbmV3Mi5qcGdcIl0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIF9pZDogXCJ0ZXN0LzEyMzRcIixcbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkOiBcInRlc3QvMTIzNFwiLFxuICAgICAgICAgICAgICAgICAgICBzY29yZTogMTAsXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogXCJ0ZXN0XCIsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlczogW1widGVzdC9mb28uanBnXCJdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9KSksXG5cbiAgICAgICAgXCJ0ZXN0LzEyMzZcIjogbmV3IFJlY29yZChPYmplY3QuYXNzaWduKHt9LCByZWNvcmREYXRhLCB7XG4gICAgICAgICAgICBfaWQ6IFwidGVzdC8xMjM2XCIsXG4gICAgICAgICAgICBpZDogXCIxMjM2XCIsXG4gICAgICAgICAgICBpbWFnZXM6IFtcInRlc3QvbmV3MS5qcGdcIiwgXCJ0ZXN0L25ldzIuanBnXCIsIFwidGVzdC9uZXczLmpwZ1wiXSxcbiAgICAgICAgICAgIGRlZmF1bHRJbWFnZUhhc2g6IFwiMjUzMzE1NjI3NFwiLFxuICAgICAgICB9KSksXG5cbiAgICAgICAgXCJ0ZXN0LzEyMzdcIjogbmV3IFJlY29yZChPYmplY3QuYXNzaWduKHt9LCByZWNvcmREYXRhLCB7XG4gICAgICAgICAgICBfaWQ6IFwidGVzdC8xMjM3XCIsXG4gICAgICAgICAgICBpZDogXCIxMjM3XCIsXG4gICAgICAgICAgICBpbWFnZXM6IFtcInRlc3Qvbm9zaW1pbGFyLmpwZ1wiXSxcbiAgICAgICAgICAgIGRlZmF1bHRJbWFnZUhhc2g6IFwiNDI0Njg3MzY2MlwiLFxuICAgICAgICAgICAgc2ltaWxhclJlY29yZHM6IFtdLFxuICAgICAgICB9KSksXG4gICAgfTtcblxuICAgIGNvbnN0IHJlbW92ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIGRlbGV0ZSByZWNvcmRzW3RoaXMuX2lkXTtcbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIGZvciAoY29uc3QgaWQgaW4gcmVjb3Jkcykge1xuICAgICAgICBjb25zdCByZWNvcmQgPSByZWNvcmRzW2lkXTtcbiAgICAgICAgcmVjb3JkLnZhbGlkYXRlU3luYygpO1xuICAgICAgICByZWNvcmQuaXNOZXcgPSBmYWxzZTtcbiAgICAgICAgc2lub24uc3R1YihyZWNvcmQsIFwicmVtb3ZlXCIsIHJlbW92ZSk7XG4gICAgfVxuXG4gICAgcHJpbWFyeVJlY29yZCA9IHJlY29yZHNbXCJ0ZXN0LzEyMzRcIl07XG5cbiAgICBzb3VyY2VzID0gW1xuICAgICAgICBuZXcgU291cmNlKHtcbiAgICAgICAgICAgIF9pZDogXCJ0ZXN0XCIsXG4gICAgICAgICAgICB0eXBlOiBcImFydHdvcmtzXCIsXG4gICAgICAgICAgICB1cmw6IFwiaHR0cDovL3Rlc3QuY29tL1wiLFxuICAgICAgICAgICAgbmFtZTogXCJUZXN0IFNvdXJjZVwiLFxuICAgICAgICAgICAgc2hvcnROYW1lOiBcIlRlc3RcIixcbiAgICAgICAgfSksXG4gICAgICAgIG5ldyBTb3VyY2Uoe1xuICAgICAgICAgICAgX2lkOiBcInRlc3QyXCIsXG4gICAgICAgICAgICB0eXBlOiBcImFydHdvcmtzXCIsXG4gICAgICAgICAgICB1cmw6IFwiaHR0cDovL3Rlc3QyLmNvbS9cIixcbiAgICAgICAgICAgIG5hbWU6IFwiVGVzdCBTb3VyY2UgMlwiLFxuICAgICAgICAgICAgc2hvcnROYW1lOiBcIlRlc3QyXCIsXG4gICAgICAgIH0pLFxuICAgIF07XG5cbiAgICBzb3VyY2UgPSBzb3VyY2VzWzBdO1xuXG4gICAgY29uc3QgdGVzdFppcCA9IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBcInRlc3REYXRhXCIsIFwidGVzdC56aXBcIik7XG5cbiAgICBpbWFnZVJlc3VsdHNEYXRhID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcImJhci5qcGdcIixcbiAgICAgICAgICAgIFwiZmlsZU5hbWVcIjogXCJiYXIuanBnXCIsXG4gICAgICAgICAgICBcIndhcm5pbmdzXCI6IFtdLFxuICAgICAgICAgICAgXCJtb2RlbFwiOiBcInRlc3QvYmFyLmpwZ1wiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcImNvcnJ1cHRlZC5qcGdcIixcbiAgICAgICAgICAgIFwiZmlsZU5hbWVcIjogXCJjb3JydXB0ZWQuanBnXCIsXG4gICAgICAgICAgICBcImVycm9yXCI6IFwiTUFMRk9STUVEX0lNQUdFXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiX2lkXCI6IFwiZW1wdHkuanBnXCIsXG4gICAgICAgICAgICBcImZpbGVOYW1lXCI6IFwiZW1wdHkuanBnXCIsXG4gICAgICAgICAgICBcImVycm9yXCI6IFwiRU1QVFlfSU1BR0VcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJfaWRcIjogXCJmb28uanBnXCIsXG4gICAgICAgICAgICBcImZpbGVOYW1lXCI6IFwiZm9vLmpwZ1wiLFxuICAgICAgICAgICAgXCJ3YXJuaW5nc1wiOiBbXSxcbiAgICAgICAgICAgIFwibW9kZWxcIjogXCJ0ZXN0L2Zvby5qcGdcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJfaWRcIjogXCJuZXcxLmpwZ1wiLFxuICAgICAgICAgICAgXCJmaWxlTmFtZVwiOiBcIm5ldzEuanBnXCIsXG4gICAgICAgICAgICBcIndhcm5pbmdzXCI6IFtdLFxuICAgICAgICAgICAgXCJtb2RlbFwiOiBcInRlc3QvbmV3MS5qcGdcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJfaWRcIjogXCJuZXcyLmpwZ1wiLFxuICAgICAgICAgICAgXCJmaWxlTmFtZVwiOiBcIm5ldzIuanBnXCIsXG4gICAgICAgICAgICBcIndhcm5pbmdzXCI6IFtdLFxuICAgICAgICAgICAgXCJtb2RlbFwiOiBcInRlc3QvbmV3Mi5qcGdcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJfaWRcIjogXCJzbWFsbC5qcGdcIixcbiAgICAgICAgICAgIFwiZmlsZU5hbWVcIjogXCJzbWFsbC5qcGdcIixcbiAgICAgICAgICAgIFwid2FybmluZ3NcIjogW1xuICAgICAgICAgICAgICAgIFwiTkVXX1ZFUlNJT05cIixcbiAgICAgICAgICAgICAgICBcIlRPT19TTUFMTFwiLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwibW9kZWxcIjogXCJ0ZXN0L3NtYWxsLmpwZ1wiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcIm5ldzMuanBnXCIsXG4gICAgICAgICAgICBcImZpbGVOYW1lXCI6IFwibmV3My5qcGdcIixcbiAgICAgICAgICAgIFwid2FybmluZ3NcIjogW10sXG4gICAgICAgICAgICBcIm1vZGVsXCI6IFwidGVzdC9uZXczLmpwZ1wiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcIl9pZFwiOiBcIm5vc2ltaWxhci5qcGdcIixcbiAgICAgICAgICAgIFwiZmlsZU5hbWVcIjogXCJub3NpbWlsYXIuanBnXCIsXG4gICAgICAgICAgICBcIndhcm5pbmdzXCI6IFtcbiAgICAgICAgICAgICAgICBcIk5FV19WRVJTSU9OXCIsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJtb2RlbFwiOiBcInRlc3Qvbm9zaW1pbGFyLmpwZ1wiLFxuICAgICAgICB9LFxuICAgIF07XG5cbiAgICBiYXRjaGVzID0gW1xuICAgICAgICBuZXcgSW1hZ2VJbXBvcnQoe1xuICAgICAgICAgICAgX2lkOiBcInRlc3Qvc3RhcnRlZFwiLFxuICAgICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIG1vZGlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgc291cmNlOiBcInRlc3RcIixcbiAgICAgICAgICAgIHppcEZpbGU6IHRlc3RaaXAsXG4gICAgICAgICAgICBmaWxlTmFtZTogXCJ0ZXN0LnppcFwiLFxuICAgICAgICB9KSxcblxuICAgICAgICBuZXcgSW1hZ2VJbXBvcnQoe1xuICAgICAgICAgICAgX2lkOiBcInRlc3QvcHJvY2Vzcy1zdGFydGVkXCIsXG4gICAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgbW9kaWZpZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICBzb3VyY2U6IFwidGVzdFwiLFxuICAgICAgICAgICAgc3RhdGU6IFwicHJvY2Vzcy5zdGFydGVkXCIsXG4gICAgICAgICAgICB6aXBGaWxlOiB0ZXN0WmlwLFxuICAgICAgICAgICAgZmlsZU5hbWU6IFwidGVzdC56aXBcIixcbiAgICAgICAgfSksXG5cbiAgICAgICAgbmV3IEltYWdlSW1wb3J0KHtcbiAgICAgICAgICAgIF9pZDogXCJ0ZXN0L3Byb2Nlc3MtY29tcGxldGVkXCIsXG4gICAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgbW9kaWZpZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICBzb3VyY2U6IFwidGVzdFwiLFxuICAgICAgICAgICAgc3RhdGU6IFwicHJvY2Vzcy5jb21wbGV0ZWRcIixcbiAgICAgICAgICAgIHppcEZpbGU6IHRlc3RaaXAsXG4gICAgICAgICAgICBmaWxlTmFtZTogXCJ0ZXN0LnppcFwiLFxuICAgICAgICAgICAgcmVzdWx0czogaW1hZ2VSZXN1bHRzRGF0YSxcbiAgICAgICAgfSksXG5cbiAgICAgICAgbmV3IEltYWdlSW1wb3J0KHtcbiAgICAgICAgICAgIF9pZDogXCJ0ZXN0L3Byb2Nlc3MtY29tcGxldGVkMlwiLFxuICAgICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIG1vZGlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgc291cmNlOiBcInRlc3RcIixcbiAgICAgICAgICAgIHN0YXRlOiBcInByb2Nlc3MuY29tcGxldGVkXCIsXG4gICAgICAgICAgICB6aXBGaWxlOiB0ZXN0WmlwLFxuICAgICAgICAgICAgZmlsZU5hbWU6IFwidGVzdC56aXBcIixcbiAgICAgICAgICAgIHJlc3VsdHM6IGltYWdlUmVzdWx0c0RhdGEsXG4gICAgICAgIH0pLFxuXG4gICAgICAgIG5ldyBJbWFnZUltcG9ydCh7XG4gICAgICAgICAgICBfaWQ6IFwidGVzdC9jb21wbGV0ZWRcIixcbiAgICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICBtb2RpZmllZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIHNvdXJjZTogXCJ0ZXN0XCIsXG4gICAgICAgICAgICBzdGF0ZTogXCJjb21wbGV0ZWRcIixcbiAgICAgICAgICAgIHppcEZpbGU6IHRlc3RaaXAsXG4gICAgICAgICAgICBmaWxlTmFtZTogXCJ0ZXN0LnppcFwiLFxuICAgICAgICAgICAgcmVzdWx0czogaW1hZ2VSZXN1bHRzRGF0YSxcbiAgICAgICAgfSksXG5cbiAgICAgICAgbmV3IEltYWdlSW1wb3J0KHtcbiAgICAgICAgICAgIF9pZDogXCJ0ZXN0L2Vycm9yXCIsXG4gICAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgbW9kaWZpZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICBzb3VyY2U6IFwidGVzdFwiLFxuICAgICAgICAgICAgc3RhdGU6IFwiZXJyb3JcIixcbiAgICAgICAgICAgIHppcEZpbGU6IHRlc3RaaXAsXG4gICAgICAgICAgICBmaWxlTmFtZTogXCJ0ZXN0LnppcFwiLFxuICAgICAgICAgICAgZXJyb3I6IFwiRVJST1JfUkVBRElOR19aSVBcIixcbiAgICAgICAgfSksXG4gICAgXTtcblxuICAgIGZvciAoY29uc3QgYmF0Y2ggb2YgYmF0Y2hlcykge1xuICAgICAgICBzaW5vbi5zdHViKGJhdGNoLCBcInNhdmVcIiwgcHJvY2Vzcy5uZXh0VGljayk7XG4gICAgfVxuXG4gICAgYmF0Y2ggPSBiYXRjaGVzWzBdO1xuXG4gICAgcmVjb3JkQmF0Y2hlcyA9IFtcbiAgICAgICAgbmV3IFJlY29yZEltcG9ydCh7XG4gICAgICAgICAgICBfaWQ6IFwidGVzdC9zdGFydGVkXCIsXG4gICAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgbW9kaWZpZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICBmaWxlTmFtZTogXCJkYXRhLmpzb25cIixcbiAgICAgICAgICAgIHNvdXJjZTogXCJ0ZXN0XCIsXG4gICAgICAgICAgICB0eXBlOiBcImFydHdvcmtzXCIsXG4gICAgICAgIH0pLFxuICAgICAgICBuZXcgUmVjb3JkSW1wb3J0KHtcbiAgICAgICAgICAgIF9pZDogXCJ0ZXN0L2NvbXBsZXRlZFwiLFxuICAgICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIG1vZGlmaWVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgZmlsZU5hbWU6IFwiZGF0YS5qc29uXCIsXG4gICAgICAgICAgICBzb3VyY2U6IFwidGVzdFwiLFxuICAgICAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICAgICAgc3RhdGU6IFwiY29tcGxldGVkXCIsXG4gICAgICAgICAgICByZXN1bHRzOiBbXSxcbiAgICAgICAgfSksXG4gICAgICAgIG5ldyBSZWNvcmRJbXBvcnQoe1xuICAgICAgICAgICAgX2lkOiBcInRlc3QvZXJyb3JcIixcbiAgICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICBtb2RpZmllZDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIGZpbGVOYW1lOiBcImRhdGEuanNvblwiLFxuICAgICAgICAgICAgc291cmNlOiBcInRlc3RcIixcbiAgICAgICAgICAgIHR5cGU6IFwiYXJ0d29ya3NcIixcbiAgICAgICAgICAgIHN0YXRlOiBcImVycm9yXCIsXG4gICAgICAgICAgICBlcnJvcjogXCJBQkFORE9ORURcIixcbiAgICAgICAgICAgIHJlc3VsdHM6IFtdLFxuICAgICAgICB9KSxcbiAgICBdO1xuXG4gICAgZm9yIChjb25zdCByZWNvcmRCYXRjaCBvZiByZWNvcmRCYXRjaGVzKSB7XG4gICAgICAgIHNpbm9uLnN0dWIocmVjb3JkQmF0Y2gsIFwic2F2ZVwiLCBwcm9jZXNzLm5leHRUaWNrKTtcbiAgICB9XG5cbiAgICByZWNvcmRCYXRjaCA9IHJlY29yZEJhdGNoZXNbMF07XG5cbiAgICBpbWFnZXMgPSB7XG4gICAgICAgIFwidGVzdC9mb28uanBnXCI6IG5ldyBJbWFnZSh7XG4gICAgICAgICAgICBfaWQ6IFwidGVzdC9mb28uanBnXCIsXG4gICAgICAgICAgICBzb3VyY2U6IFwidGVzdFwiLFxuICAgICAgICAgICAgZmlsZU5hbWU6IFwiZm9vLmpwZ1wiLFxuICAgICAgICAgICAgaGFzaDogXCI0MjY2OTA2MzM0XCIsXG4gICAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAxMDAsXG4gICAgICAgICAgICBzaW1pbGFySW1hZ2VzOiBbe19pZDogXCJ0ZXN0L2Jhci5qcGdcIiwgc2NvcmU6IDEwfV0sXG4gICAgICAgIH0pLFxuXG4gICAgICAgIFwidGVzdC9iYXIuanBnXCI6IG5ldyBJbWFnZSh7XG4gICAgICAgICAgICBfaWQ6IFwidGVzdC9iYXIuanBnXCIsXG4gICAgICAgICAgICBzb3VyY2U6IFwidGVzdFwiLFxuICAgICAgICAgICAgZmlsZU5hbWU6IFwiYmFyLmpwZ1wiLFxuICAgICAgICAgICAgaGFzaDogXCIyNTA4ODg0NjkxXCIsXG4gICAgICAgICAgICB3aWR0aDogMTIwLFxuICAgICAgICAgICAgaGVpZ2h0OiAxMjAsXG4gICAgICAgICAgICBzaW1pbGFySW1hZ2VzOiBbXG4gICAgICAgICAgICAgICAge19pZDogXCJ0ZXN0L2Zvby5qcGdcIiwgc2NvcmU6IDEwfSxcbiAgICAgICAgICAgICAgICB7X2lkOiBcInRlc3QvbmV3Mi5qcGdcIiwgc2NvcmU6IDl9LFxuICAgICAgICAgICAgICAgIHtfaWQ6IFwidGVzdC9uZXcxLmpwZ1wiLCBzY29yZTogOH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9KSxcblxuICAgICAgICBcInRlc3QvbmV3MS5qcGdcIjogbmV3IEltYWdlKHtcbiAgICAgICAgICAgIF9pZDogXCJ0ZXN0L25ldzEuanBnXCIsXG4gICAgICAgICAgICBzb3VyY2U6IFwidGVzdFwiLFxuICAgICAgICAgICAgZmlsZU5hbWU6IFwibmV3MS5qcGdcIixcbiAgICAgICAgICAgIGhhc2g6IFwiMjUzMzE1NjI3NFwiLFxuICAgICAgICAgICAgd2lkdGg6IDExNSxcbiAgICAgICAgICAgIGhlaWdodDogMTE1LFxuICAgICAgICAgICAgc2ltaWxhckltYWdlczogW3tfaWQ6IFwidGVzdC9iYXIuanBnXCIsIHNjb3JlOiA4fV0sXG4gICAgICAgIH0pLFxuXG4gICAgICAgIFwidGVzdC9uZXcyLmpwZ1wiOiBuZXcgSW1hZ2Uoe1xuICAgICAgICAgICAgX2lkOiBcInRlc3QvbmV3Mi5qcGdcIixcbiAgICAgICAgICAgIHNvdXJjZTogXCJ0ZXN0XCIsXG4gICAgICAgICAgICBmaWxlTmFtZTogXCJuZXcyLmpwZ1wiLFxuICAgICAgICAgICAgaGFzaDogXCI2MTQ0MzE1MDhcIixcbiAgICAgICAgICAgIHdpZHRoOiAxMTYsXG4gICAgICAgICAgICBoZWlnaHQ6IDExNixcbiAgICAgICAgICAgIHNpbWlsYXJJbWFnZXM6IFt7X2lkOiBcInRlc3QvYmFyLmpwZ1wiLCBzY29yZTogOX1dLFxuICAgICAgICB9KSxcblxuICAgICAgICBcInRlc3QvbmV3My5qcGdcIjogbmV3IEltYWdlKHtcbiAgICAgICAgICAgIF9pZDogXCJ0ZXN0L25ldzMuanBnXCIsXG4gICAgICAgICAgICBzb3VyY2U6IFwidGVzdFwiLFxuICAgICAgICAgICAgZmlsZU5hbWU6IFwibmV3My5qcGdcIixcbiAgICAgICAgICAgIGhhc2g6IFwiMjA0NTcxNDU5XCIsXG4gICAgICAgICAgICB3aWR0aDogMTE3LFxuICAgICAgICAgICAgaGVpZ2h0OiAxMTcsXG4gICAgICAgICAgICBzaW1pbGFySW1hZ2VzOiBbXSxcbiAgICAgICAgfSksXG5cbiAgICAgICAgXCJ0ZXN0L25vc2ltaWxhci5qcGdcIjogbmV3IEltYWdlKHtcbiAgICAgICAgICAgIF9pZDogXCJ0ZXN0L25vc2ltaWxhci5qcGdcIixcbiAgICAgICAgICAgIHNvdXJjZTogXCJ0ZXN0XCIsXG4gICAgICAgICAgICBmaWxlTmFtZTogXCJub3NpbWlsYXIuanBnXCIsXG4gICAgICAgICAgICBoYXNoOiBcIjQyNDY4NzM2NjJhXCIsXG4gICAgICAgICAgICB3aWR0aDogMTEwLFxuICAgICAgICAgICAgaGVpZ2h0OiAxMTAsXG4gICAgICAgICAgICBzaW1pbGFySW1hZ2VzOiBbXSxcbiAgICAgICAgfSksXG5cbiAgICAgICAgXCJ0ZXN0L3NtYWxsLmpwZ1wiOiBuZXcgSW1hZ2Uoe1xuICAgICAgICAgICAgX2lkOiBcInRlc3Qvc21hbGwuanBnXCIsXG4gICAgICAgICAgICBzb3VyY2U6IFwidGVzdFwiLFxuICAgICAgICAgICAgZmlsZU5hbWU6IFwic21hbGwuanBnXCIsXG4gICAgICAgICAgICBoYXNoOiBcIjQyNDY4NzM2NjJiXCIsXG4gICAgICAgICAgICB3aWR0aDogOTAsXG4gICAgICAgICAgICBoZWlnaHQ6IDkwLFxuICAgICAgICAgICAgc2ltaWxhckltYWdlczogW10sXG4gICAgICAgIH0pLFxuICAgIH07XG5cbiAgICBpbWFnZSA9IGltYWdlc1tcInRlc3QvZm9vLmpwZ1wiXTtcblxuICAgIHVwbG9hZEltYWdlcyA9IHtcbiAgICAgICAgXCJ1cGxvYWRzLzQyNjY5MDYzMzQuanBnXCI6IG5ldyBVcGxvYWRJbWFnZSh7XG4gICAgICAgICAgICBfaWQ6IFwidXBsb2Fkcy80MjY2OTA2MzM0LmpwZ1wiLFxuICAgICAgICAgICAgZmlsZU5hbWU6IFwiNDI2NjkwNjMzNC5qcGdcIixcbiAgICAgICAgICAgIGhhc2g6IFwiNDI2NjkwNjMzNFwiLFxuICAgICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICAgIGhlaWdodDogMTAwLFxuICAgICAgICAgICAgc2ltaWxhckltYWdlczogW3tfaWQ6IFwidGVzdC9iYXIuanBnXCIsIHNjb3JlOiAxMH1dLFxuICAgICAgICB9KSxcbiAgICB9O1xuXG4gICAgdXBsb2FkSW1hZ2UgPSB1cGxvYWRJbWFnZXNbXCJ1cGxvYWRzLzQyNjY5MDYzMzQuanBnXCJdO1xuXG4gICAgdXBsb2FkcyA9IHtcbiAgICAgICAgXCJ1cGxvYWRzLzQyNjY5MDYzMzRcIjogbmV3IFVwbG9hZCh7XG4gICAgICAgICAgICBfaWQ6IFwidXBsb2Fkcy80MjY2OTA2MzM0XCIsXG4gICAgICAgICAgICB0eXBlOiBcImFydHdvcmtzXCIsXG4gICAgICAgICAgICBpbWFnZXM6IFtcInVwbG9hZHMvNDI2NjkwNjMzNC5qcGdcIl0sXG4gICAgICAgICAgICBkZWZhdWx0SW1hZ2VIYXNoOiBcIjQyNjY5MDYzMzRcIixcbiAgICAgICAgfSksXG4gICAgfTtcblxuICAgIHVwbG9hZCA9IHVwbG9hZHNbXCJ1cGxvYWRzLzQyNjY5MDYzMzRcIl07XG5cbiAgICBzaW1pbGFyID0ge1xuICAgICAgICBcIjQyNjY5MDYzMzRcIjogW1xuICAgICAgICAgICAge2lkOiBcIjQyNjY5MDYzMzRcIiwgc2NvcmU6IDEwMH0sXG4gICAgICAgICAgICB7aWQ6IFwiMjUwODg4NDY5MVwiLCBzY29yZTogMTB9LFxuICAgICAgICAgICAge2lkOiBcIk5PX0xPTkdFUl9FWElTVFNcIiwgc2NvcmU6IDF9LFxuICAgICAgICBdLFxuICAgICAgICBcIjI1MDg4ODQ2OTFcIjogW1xuICAgICAgICAgICAge2lkOiBcIjI1MDg4ODQ2OTFcIiwgc2NvcmU6IDEwMH0sXG4gICAgICAgICAgICB7aWQ6IFwiNDI2NjkwNjMzNFwiLCBzY29yZTogMTB9LFxuICAgICAgICAgICAge2lkOiBcIjYxNDQzMTUwOFwiLCBzY29yZTogOX0sXG4gICAgICAgICAgICB7aWQ6IFwiMjUzMzE1NjI3NFwiLCBzY29yZTogOH0sXG4gICAgICAgIF0sXG4gICAgICAgIFwiMjUzMzE1NjI3NFwiOiBbXG4gICAgICAgICAgICB7aWQ6IFwiMjUzMzE1NjI3NFwiLCBzY29yZTogMTAwfSxcbiAgICAgICAgICAgIHtpZDogXCIyNTA4ODg0NjkxXCIsIHNjb3JlOiA4fSxcbiAgICAgICAgXSxcbiAgICAgICAgXCI2MTQ0MzE1MDhcIjogW1xuICAgICAgICAgICAge2lkOiBcIjYxNDQzMTUwOFwiLCBzY29yZTogMTAwfSxcbiAgICAgICAgICAgIHtpZDogXCIyNTA4ODg0NjkxXCIsIHNjb3JlOiA5fSxcbiAgICAgICAgXSxcbiAgICAgICAgXCIyMDQ1NzE0NTlcIjogW1xuICAgICAgICAgICAge2lkOiBcIjIwNDU3MTQ1OVwiLCBzY29yZTogMTAwfSxcbiAgICAgICAgXSxcbiAgICAgICAgXCIxMzA2NjQ0MTAyXCI6IFtcbiAgICAgICAgICAgIHtpZDogXCIxMzA2NjQ0MTAyXCIsIHNjb3JlOiAxMDB9LFxuICAgICAgICBdLFxuICAgIH07XG5cbiAgICBzaW1pbGFyQWRkZWQgPSBbXTtcblxuICAgIHVzZXJzID0gW1xuICAgICAgICBuZXcgVXNlcih7XG4gICAgICAgICAgICBlbWFpbDogXCJ0ZXN0QHRlc3QuY29tXCIsXG4gICAgICAgICAgICBwYXNzd29yZDogXCJ0ZXN0XCIsXG4gICAgICAgICAgICBzb3VyY2VBZG1pbjogW1widGVzdFwiXSxcbiAgICAgICAgICAgIHNpdGVBZG1pbjogdHJ1ZSxcbiAgICAgICAgfSksXG4gICAgICAgIG5ldyBVc2VyKHtcbiAgICAgICAgICAgIGVtYWlsOiBcIm5vcm1hbEB0ZXN0LmNvbVwiLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IFwidGVzdFwiLFxuICAgICAgICAgICAgc291cmNlQWRtaW46IFtdLFxuICAgICAgICAgICAgc2l0ZUFkbWluOiBmYWxzZSxcbiAgICAgICAgfSksXG4gICAgXTtcblxuICAgIHVzZXIgPSB1c2Vyc1swXTtcbn07XG5cbmNvbnN0IGJpbmRTdHVicyA9ICgpID0+IHtcbiAgICBzYW5kYm94ID0gc2lub24uc2FuZGJveC5jcmVhdGUoKTtcblxuICAgIHNhbmRib3guc3R1YihSZWNvcmQsIFwiZmluZEJ5SWRcIiwgKGlkLCBjYWxsYmFjaykgPT4ge1xuICAgICAgICBpZiAocmVjb3Jkc1tpZF0pIHtcbiAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4gY2FsbGJhY2sobnVsbCwgcmVjb3Jkc1tpZF0pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4gY2FsbGJhY2soXG4gICAgICAgICAgICAgICAgbmV3IEVycm9yKFwiUmVjb3JkIG5vdCBmb3VuZC5cIikpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2FuZGJveC5zdHViKFJlY29yZCwgXCJmaW5kXCIsIChxdWVyeSwgY2FsbGJhY2ssIGV4dHJhKSA9PiB7XG4gICAgICAgIGxldCBtYXRjaGVzID0gW107XG5cbiAgICAgICAgaWYgKHF1ZXJ5LiRvcikge1xuICAgICAgICAgICAgY29uc3QgaW1hZ2VJZHMgPSBxdWVyeS4kb3IubWFwKChxdWVyeSkgPT4gcXVlcnkuaW1hZ2VzKTtcblxuICAgICAgICAgICAgZm9yIChjb25zdCBpZCBpbiByZWNvcmRzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gcmVjb3Jkc1tpZF07XG5cbiAgICAgICAgICAgICAgICBpZiAocXVlcnkuX2lkLiRuZSA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpbWFnZUlkIG9mIGltYWdlSWRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWNvcmQuaW1hZ2VzLmluZGV4T2YoaW1hZ2VJZCkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlcy5wdXNoKHJlY29yZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChxdWVyeS5zb3VyY2UpIHtcbiAgICAgICAgICAgIG1hdGNoZXMgPSBPYmplY3Qua2V5cyhyZWNvcmRzKS5maWx0ZXIoKGlkKSA9PlxuICAgICAgICAgICAgICAgIHJlY29yZHNbaWRdLnNvdXJjZSA9PT0gcXVlcnkuc291cmNlKVxuICAgICAgICAgICAgICAgIC5tYXAoKGlkKSA9PiByZWNvcmRzW2lkXSk7XG4gICAgICAgIH0gZWxzZSBpZiAocXVlcnkuaW1hZ2VzKSB7XG4gICAgICAgICAgICBtYXRjaGVzID0gT2JqZWN0LmtleXMocmVjb3JkcykuZmlsdGVyKChpZCkgPT5cbiAgICAgICAgICAgICAgICByZWNvcmRzW2lkXS5pbWFnZXMuaW5kZXhPZihxdWVyeS5pbWFnZXMpID49IDApXG4gICAgICAgICAgICAgICAgLm1hcCgoaWQpID0+IHJlY29yZHNbaWRdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1hdGNoZXMgPSBPYmplY3Qua2V5cyhyZWNvcmRzKS5tYXAoKGlkKSA9PiByZWNvcmRzW2lkXSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IHJlY29yZCBvZiBtYXRjaGVzKSB7XG4gICAgICAgICAgICBpZiAoIXJlY29yZC5zYXZlLnJlc3RvcmUpIHtcbiAgICAgICAgICAgICAgICBzYW5kYm94LnN0dWIocmVjb3JkLCBcInNhdmVcIiwgKGNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHJlY29yZC5faWQgaW4gcmVjb3JkcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZHNbcmVjb3JkLl9pZF0gPSByZWNvcmQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY2FsbGJhY2sgfHwgZXh0cmEpIHtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IHtcbiAgICAgICAgICAgICAgICBsZWFuOiAoKSA9PiByZXQsXG4gICAgICAgICAgICAgICAgZGlzdGluY3Q6IChuYW1lKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoZXMgPSBtYXRjaGVzLm1hcCgobWF0Y2gpID0+IG1hdGNoW25hbWVdKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0cmVhbTogKCkgPT4gcmV0LFxuICAgICAgICAgICAgICAgIG9uOiAobmFtZSwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWUgPT09IFwiZGF0YVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXQuX29uZGF0YSA9IGNhbGxiYWNrLmJpbmQocmV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXQuX29uY2xvc2UgPSBjYWxsYmFjay5iaW5kKHJldCk7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2socmV0Ll9wb3BEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHBhdXNlOiAoKSA9PiByZXQsXG4gICAgICAgICAgICAgICAgcmVzdW1lOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2socmV0Ll9wb3BEYXRhKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF9wb3BEYXRhOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldC5fb25kYXRhKG1hdGNoZXMuc2hpZnQoKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXQuX29uY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXhlYzogKGNhbGxiYWNrKSA9PlxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IGNhbGxiYWNrKG51bGwsIG1hdGNoZXMpKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiBjYWxsYmFjayhudWxsLCBtYXRjaGVzKSk7XG4gICAgfSk7XG5cbiAgICBzYW5kYm94LnN0dWIoUmVjb3JkLCBcInNlYXJjaFwiLCAocXVlcnksIG9wdGlvbnMsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hdGNoZXMgPSBPYmplY3Qua2V5cyhyZWNvcmRzKS5tYXAoKGlkKSA9PiByZWNvcmRzW2lkXSk7XG4gICAgICAgIGNvbnN0IGFnZ3JlZ2F0aW9ucyA9IHtcbiAgICAgICAgICAgIHNvdXJjZToge1xuICAgICAgICAgICAgICAgIGJ1Y2tldHM6IFt7a2V5OiBcInRlc3RcIiwgZG9jX2NvdW50OiAyfV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb2JqZWN0VHlwZToge1xuICAgICAgICAgICAgICAgIGJ1Y2tldHM6IFt7a2V5OiBcInBhaW50aW5nXCIsIGRvY19jb3VudDogMn1dLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRhdGVzOiB7XG4gICAgICAgICAgICAgICAgYnVja2V0czogW3tmcm9tOiAxMTAwLCB0bzogMTE5OSwgZG9jX2NvdW50OiAyfV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYXJ0aXN0czoge1xuICAgICAgICAgICAgICAgIGJ1Y2tldHM6IFt7a2V5OiBcIlRlc3RcIiwgZG9jX2NvdW50OiAyfV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJkaW1lbnNpb25zLndpZHRoXCI6IHtcbiAgICAgICAgICAgICAgICBidWNrZXRzOiBbe2Zyb206IDEwMCwgdG86IDE5OSwgZG9jX2NvdW50OiAyfV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJkaW1lbnNpb25zLmhlaWdodFwiOiB7XG4gICAgICAgICAgICAgICAgYnVja2V0czogW3tmcm9tOiAxMDAsIHRvOiAxOTksIGRvY19jb3VudDogMn1dLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcblxuICAgICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IGNhbGxiYWNrKG51bGwsIHtcbiAgICAgICAgICAgIGFnZ3JlZ2F0aW9ucyxcbiAgICAgICAgICAgIGhpdHM6IHtcbiAgICAgICAgICAgICAgICB0b3RhbDogbWF0Y2hlcy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgaGl0czogbWF0Y2hlcyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pKTtcbiAgICB9KTtcblxuICAgIHNhbmRib3guc3R1YihSZWNvcmQsIFwidXBkYXRlXCIsIChxdWVyeSwgdXBkYXRlLCBvcHRpb25zLCBjYWxsYmFjaykgPT4ge1xuICAgICAgICBPYmplY3Qua2V5cyhyZWNvcmRzKS5mb3JFYWNoKChpZCkgPT4ge1xuICAgICAgICAgICAgcmVjb3Jkc1tpZF0ubmVlZHNTaW1pbGFyVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soY2FsbGJhY2spO1xuICAgIH0pO1xuXG4gICAgc2FuZGJveC5zdHViKFJlY29yZCwgXCJjb3VudFwiLCAocXVlcnksIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvdW50ID0gT2JqZWN0LmtleXMocmVjb3JkcykuZmlsdGVyKChpZCkgPT5cbiAgICAgICAgICAgICFxdWVyeS5zb3VyY2UgfHwgcmVjb3Jkc1tpZF0uc291cmNlID09PSBxdWVyeS5zb3VyY2UpLmxlbmd0aDtcblxuICAgICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IGNhbGxiYWNrKG51bGwsIGNvdW50KSk7XG4gICAgfSk7XG5cbiAgICBzYW5kYm94LnN0dWIoUmVjb3JkLCBcImFnZ3JlZ2F0ZVwiLCAocXVlcnksIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIGNvbnN0IHNvdXJjZSA9IHF1ZXJ5WzBdLiRtYXRjaC5zb3VyY2U7XG4gICAgICAgIGNvbnN0IGNvdW50ID0gT2JqZWN0LmtleXMocmVjb3JkcykuZmlsdGVyKChpZCkgPT5cbiAgICAgICAgICAgIHJlY29yZHNbaWRdLnNvdXJjZSA9PT0gc291cmNlKS5sZW5ndGg7XG5cbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiBjYWxsYmFjayhudWxsLCBbe1xuICAgICAgICAgICAgdG90YWw6IGNvdW50LFxuICAgICAgICAgICAgdG90YWxJbWFnZXM6IGNvdW50LFxuICAgICAgICB9XSkpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZnJvbURhdGEgPSBSZWNvcmQuZnJvbURhdGE7XG5cbiAgICBzYW5kYm94LnN0dWIoUmVjb3JkLCBcImZyb21EYXRhXCIsICh0bXBEYXRhLCByZXEsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIGZyb21EYXRhLmNhbGwoUmVjb3JkLCB0bXBEYXRhLCByZXEsXG4gICAgICAgICAgICAoZXJyLCByZWNvcmQsIHdhcm5pbmdzLCBjcmVhdGluZykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZWNvcmQgJiYgIXJlY29yZC5zYXZlLnJlc3RvcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2FuZGJveC5zdHViKHJlY29yZCwgXCJzYXZlXCIsIChjYWxsYmFjaykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEocmVjb3JkLl9pZCBpbiByZWNvcmRzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZHNbcmVjb3JkLl9pZF0gPSByZWNvcmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIHJlY29yZCwgd2FybmluZ3MsIGNyZWF0aW5nKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgc2FuZGJveC5zdHViKEltYWdlSW1wb3J0LCBcImZpbmRcIiwgKHF1ZXJ5LCBzZWxlY3QsIG9wdGlvbnMsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4gY2FsbGJhY2sobnVsbCwgYmF0Y2hlcykpO1xuICAgIH0pO1xuXG4gICAgc2FuZGJveC5zdHViKEltYWdlSW1wb3J0LCBcImZpbmRCeUlkXCIsIChpZCwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBiYXRjaGVzLmZpbmQoKGJhdGNoKSA9PiBiYXRjaC5faWQgPT09IGlkKSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgY29uc3QgaW1hZ2VJbXBvcnRGcm9tRmlsZSA9IEltYWdlSW1wb3J0LmZyb21GaWxlO1xuXG4gICAgc2FuZGJveC5zdHViKEltYWdlSW1wb3J0LCBcImZyb21GaWxlXCIsIChmaWxlTmFtZSwgc291cmNlKSA9PiB7XG4gICAgICAgIGNvbnN0IGJhdGNoID0gaW1hZ2VJbXBvcnRGcm9tRmlsZS5jYWxsKEltYWdlSW1wb3J0LCBmaWxlTmFtZSxcbiAgICAgICAgICAgIHNvdXJjZSk7XG4gICAgICAgIGlmICghYmF0Y2guc2F2ZS5yZXN0b3JlKSB7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoYmF0Y2gsIFwic2F2ZVwiLCAoY2FsbGJhY2spID0+IGJhdGNoLnZhbGlkYXRlKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJhdGNoLm1vZGlmaWVkID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICBiYXRjaGVzLnB1c2goYmF0Y2gpO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGJhdGNoKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmF0Y2g7XG4gICAgfSk7XG5cbiAgICBzYW5kYm94LnN0dWIoUmVjb3JkSW1wb3J0LCBcImZpbmRcIiwgKHF1ZXJ5LCBzZWxlY3QsIG9wdGlvbnMsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVjb3JkQmF0Y2hlcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgc2FuZGJveC5zdHViKFJlY29yZEltcG9ydCwgXCJmaW5kQnlJZFwiLCAoaWQsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVjb3JkQmF0Y2hlcy5maW5kKChiYXRjaCkgPT4gYmF0Y2guX2lkID09PSBpZCkpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlY29yZEltcG9ydEZyb21GaWxlID0gUmVjb3JkSW1wb3J0LmZyb21GaWxlO1xuXG4gICAgc2FuZGJveC5zdHViKFJlY29yZEltcG9ydCwgXCJmcm9tRmlsZVwiLCAoZmlsZU5hbWUsIHNvdXJjZSwgdHlwZSkgPT4ge1xuICAgICAgICBjb25zdCBiYXRjaCA9IHJlY29yZEltcG9ydEZyb21GaWxlLmNhbGwoUmVjb3JkSW1wb3J0LCBmaWxlTmFtZSxcbiAgICAgICAgICAgIHNvdXJjZSwgdHlwZSk7XG4gICAgICAgIGlmICghYmF0Y2guc2F2ZS5yZXN0b3JlKSB7XG4gICAgICAgICAgICBzYW5kYm94LnN0dWIoYmF0Y2gsIFwic2F2ZVwiLCAoY2FsbGJhY2spID0+IGJhdGNoLnZhbGlkYXRlKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJhdGNoLm1vZGlmaWVkID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICByZWNvcmRCYXRjaGVzLnB1c2goYmF0Y2gpO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGJhdGNoKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmF0Y2g7XG4gICAgfSk7XG5cbiAgICBzYW5kYm94LnN0dWIoU291cmNlLCBcImZpbmRcIiwgKHF1ZXJ5LCBjYWxsYmFjaykgPT4ge1xuICAgICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IGNhbGxiYWNrKG51bGwsIHNvdXJjZXMpKTtcbiAgICB9KTtcblxuICAgIHNhbmRib3guc3R1YihJbWFnZSwgXCJmaW5kQnlJZFwiLCAoaWQsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4gY2FsbGJhY2sobnVsbCwgaW1hZ2VzW2lkXSkpO1xuICAgIH0pO1xuXG4gICAgc2FuZGJveC5zdHViKEltYWdlLCBcImZpbmRPbmVcIiwgKHF1ZXJ5LCBjYWxsYmFjaykgPT4ge1xuICAgICAgICAvLyBOT1RFKGplcmVzaWcpOiBxdWVyeS5oYXNoIGlzIGFzc3VtZWRcbiAgICAgICAgY29uc3QgaWQgPSBPYmplY3Qua2V5cyhpbWFnZXMpXG4gICAgICAgICAgICAuZmluZCgoaWQpID0+IGltYWdlc1tpZF0uaGFzaCA9PT0gcXVlcnkuaGFzaCk7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gaW1hZ2VzW2lkXTtcblxuICAgICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IGNhbGxiYWNrKG51bGwsIG1hdGNoKSk7XG4gICAgfSk7XG5cbiAgICBzYW5kYm94LnN0dWIoSW1hZ2UsIFwidXBkYXRlXCIsIChxdWVyeSwgdXBkYXRlLCBvcHRpb25zLCBjYWxsYmFjaykgPT4ge1xuICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGNhbGxiYWNrKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGZyb21GaWxlID0gSW1hZ2UuZnJvbUZpbGU7XG5cbiAgICBzYW5kYm94LnN0dWIoSW1hZ2UsIFwiZnJvbUZpbGVcIiwgKGJhdGNoLCBmaWxlLCBjYWxsYmFjaykgPT4ge1xuICAgICAgICBmcm9tRmlsZS5jYWxsKEltYWdlLCBiYXRjaCwgZmlsZSwgKGVyciwgaW1hZ2UsIHdhcm5pbmdzKSA9PiB7XG4gICAgICAgICAgICBpZiAoaW1hZ2UgJiYgIWltYWdlLnNhdmUucmVzdG9yZSkge1xuICAgICAgICAgICAgICAgIHNhbmRib3guc3R1YihpbWFnZSwgXCJzYXZlXCIsIChjYWxsYmFjaykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpbWFnZXNbaW1hZ2UuX2lkXSA9IGltYWdlO1xuICAgICAgICAgICAgICAgICAgICBpbWFnZS52YWxpZGF0ZShjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgaW1hZ2UsIHdhcm5pbmdzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzYW5kYm94LnN0dWIoSW1hZ2UsIFwiY291bnRcIiwgKHF1ZXJ5LCBjYWxsYmFjaykgPT4ge1xuICAgICAgICBjb25zdCBjb3VudCA9IE9iamVjdC5rZXlzKGltYWdlcykuZmlsdGVyKChpZCkgPT5cbiAgICAgICAgICAgICFxdWVyeS5zb3VyY2UgfHwgaW1hZ2VzW2lkXS5zb3VyY2UgPT09IHF1ZXJ5LnNvdXJjZSkubGVuZ3RoO1xuXG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4gY2FsbGJhY2sobnVsbCwgY291bnQpKTtcbiAgICB9KTtcblxuICAgIHNhbmRib3guc3R1YihVcGxvYWRJbWFnZSwgXCJmaW5kQnlJZFwiLCAoaWQsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4gY2FsbGJhY2sobnVsbCwgdXBsb2FkSW1hZ2VzW2lkXSkpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgdXBsb2FkRnJvbUZpbGUgPSBVcGxvYWRJbWFnZS5mcm9tRmlsZTtcblxuICAgIHNhbmRib3guc3R1YihVcGxvYWRJbWFnZSwgXCJmcm9tRmlsZVwiLCAoZmlsZSwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgdXBsb2FkRnJvbUZpbGUuY2FsbChVcGxvYWRJbWFnZSwgZmlsZSwgKGVyciwgaW1hZ2UsIHdhcm5pbmdzKSA9PiB7XG4gICAgICAgICAgICBpZiAoaW1hZ2UgJiYgIWltYWdlLnNhdmUucmVzdG9yZSkge1xuICAgICAgICAgICAgICAgIHNhbmRib3guc3R1YihpbWFnZSwgXCJzYXZlXCIsIChjYWxsYmFjaykgPT4ge1xuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJbWFnZXNbaW1hZ2UuX2lkXSA9IGltYWdlO1xuICAgICAgICAgICAgICAgICAgICBpbWFnZS52YWxpZGF0ZShjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgaW1hZ2UsIHdhcm5pbmdzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzYW5kYm94LnN0dWIoVXBsb2FkLCBcImZpbmRCeUlkXCIsIChpZCwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiBjYWxsYmFjayhudWxsLCB1cGxvYWRzW2lkXSkpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZnJvbUltYWdlID0gVXBsb2FkLmZyb21JbWFnZTtcblxuICAgIHNhbmRib3guc3R1YihVcGxvYWQsIFwiZnJvbUltYWdlXCIsIChpbWFnZSwgdHlwZSwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgZnJvbUltYWdlLmNhbGwoVXBsb2FkLCBpbWFnZSwgdHlwZSwgKGVyciwgdXBsb2FkKSA9PiB7XG4gICAgICAgICAgICBpZiAodXBsb2FkICYmICF1cGxvYWQuc2F2ZS5yZXN0b3JlKSB7XG4gICAgICAgICAgICAgICAgc2FuZGJveC5zdHViKHVwbG9hZCwgXCJzYXZlXCIsIChjYWxsYmFjaykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoISh1cGxvYWQuX2lkIGluIHVwbG9hZHMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRzW3VwbG9hZC5faWRdID0gdXBsb2FkO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgdXBsb2FkKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzYW5kYm94LnN0dWIoVXNlciwgXCJmaW5kXCIsIChxdWVyeSwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiBjYWxsYmFjayhudWxsLCB1c2VycykpO1xuICAgIH0pO1xuXG4gICAgc2FuZGJveC5zdHViKFVzZXIsIFwiZmluZE9uZVwiLCAocXVlcnksIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hdGNoZXMgPSB1c2Vycy5maWx0ZXIoKHVzZXIpID0+XG4gICAgICAgICAgICAodXNlci5lbWFpbCA9PT0gcXVlcnkuZW1haWwgfHxcbiAgICAgICAgICAgICAgICBxdWVyeS5faWQgJiYgdXNlci5faWQudG9TdHJpbmcoKSA9PT0gcXVlcnkuX2lkLnRvU3RyaW5nKCkpKTtcbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiBjYWxsYmFjayhudWxsLCBtYXRjaGVzWzBdKSk7XG4gICAgfSk7XG5cbiAgICBzYW5kYm94LnN0dWIoc2ltaWxhcml0eSwgXCJzaW1pbGFyXCIsIChoYXNoLCBjYWxsYmFjaykgPT4ge1xuICAgICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IGNhbGxiYWNrKG51bGwsIHNpbWlsYXJbaGFzaF0pKTtcbiAgICB9KTtcblxuICAgIHNhbmRib3guc3R1YihzaW1pbGFyaXR5LCBcImZpbGVTaW1pbGFyXCIsIChmaWxlLCBjYWxsYmFjaykgPT4ge1xuICAgICAgICAvLyBDaGVhdCBhbmQganVzdCBnZXQgdGhlIGhhc2ggZnJvbSB0aGUgZmlsZSBuYW1lXG4gICAgICAgIGNvbnN0IGhhc2ggPSBwYXRoLmJhc2VuYW1lKGZpbGUpLnJlcGxhY2UoL1xcLi4qJC8sIFwiXCIpO1xuICAgICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IGNhbGxiYWNrKG51bGwsIHNpbWlsYXJbaGFzaF0pKTtcbiAgICB9KTtcblxuICAgIHNhbmRib3guc3R1YihzaW1pbGFyaXR5LCBcImlkSW5kZXhlZFwiLCAoaGFzaCwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiBjYWxsYmFjayhudWxsLCAhIXNpbWlsYXJbaGFzaF0pKTtcbiAgICB9KTtcblxuICAgIHNhbmRib3guc3R1YihzaW1pbGFyaXR5LCBcImFkZFwiLCAoZmlsZSwgaGFzaCwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgaWYgKGhhc2ggPT09IFwiOTk5OThcIikge1xuICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2soKCkgPT4gY2FsbGJhY2soe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiSU1BR0VfU0laRV9UT09fU01BTExcIixcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNpbWlsYXJBZGRlZC5wdXNoKHtpZDogaGFzaCwgc2NvcmU6IDV9KTtcbiAgICAgICAgc2ltaWxhcltoYXNoXSA9IHNpbWlsYXJBZGRlZDtcblxuICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGNhbGxiYWNrKTtcbiAgICB9KTtcbn07XG5cbmNvbnN0IHJlcSA9IHtcbiAgICBmb3JtYXQ6IChtc2csIGZpZWxkcykgPT5cbiAgICAgICAgbXNnLnJlcGxhY2UoLyVcXCgoLio/KVxcKXMvZywgKGFsbCwgbmFtZSkgPT4gZmllbGRzW25hbWVdKSxcbiAgICBnZXR0ZXh0OiAobXNnKSA9PiBtc2csXG4gICAgbGFuZzogXCJlblwiLFxufTtcblxubGV0IGFwcDtcblxuY29uc3QgaW5pdCA9IChkb25lKSA9PiB7XG4gICAgZ2VuRGF0YSgpO1xuICAgIGJpbmRTdHVicygpO1xuXG4gICAgYXN5bmMucGFyYWxsZWwoW1xuICAgICAgICAoY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgIFNvdXJjZS5jYWNoZVNvdXJjZXMoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGFzeW5jLmVhY2goT2JqZWN0LmtleXMocmVjb3JkcyksIChpZCwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVjb3Jkc1tpZF0udmFsaWRhdGUoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIH0sIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIChjYWxsYmFjaykgPT4ge1xuICAgICAgICAgICAgc2VydmVyKChlcnIsIF9hcHApID0+IHtcbiAgICAgICAgICAgICAgICBhcHAgPSBfYXBwO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICBdLCAoKSA9PiB7XG4gICAgICAgIG1vY2tmcyh7XG4gICAgICAgICAgICBcInBhY2thZ2UuanNvblwiOiBwa2dGaWxlLFxuICAgICAgICAgICAgXCJ0ZXN0RGF0YVwiOiB0ZXN0RmlsZXMsXG4gICAgICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgICAgICAgIFwidGVzdFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2VzXCI6IHt9LFxuICAgICAgICAgICAgICAgICAgICBcInNjYWxlZFwiOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgXCJ0aHVtYnNcIjoge30sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcInVwbG9hZHNcIjoge1xuICAgICAgICAgICAgICAgICAgICBcImltYWdlc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIjQyNjY5MDYzMzQuanBnXCI6IHRlc3RGaWxlc1tcIjQyNjY5MDYzMzQuanBnXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJiYXIuanBnXCI6IHRlc3RGaWxlc1tcImJhci5qcGdcIl0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwic2NhbGVkXCI6IHt9LFxuICAgICAgICAgICAgICAgICAgICBcInRodW1ic1wiOiB7fSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiYnVpbGRcIjoge1xuICAgICAgICAgICAgICAgIFwicHVibGljXCI6IHB1YmxpY0ZpbGVzLFxuICAgICAgICAgICAgICAgIFwidmlld3NcIjogT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICAgICAgICAgIFwidHlwZXNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJmaWx0ZXJcIjogdHlwZUZpbHRlckZpbGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2aWV3XCI6IHR5cGVWaWV3RmlsZXMsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSwgdmlld0ZpbGVzKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvbmUoKTtcbiAgICB9KTtcbn07XG5cbnRhcC5iZWZvcmVFYWNoKGluaXQpO1xuXG50YXAuYWZ0ZXJFYWNoKChkb25lKSA9PiB7XG4gICAgYXBwLmNsb3NlKCk7XG4gICAgc2FuZGJveC5yZXN0b3JlKCk7XG4gICAgbW9ja2ZzLnJlc3RvcmUoKTtcbiAgICBkb25lKCk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2V0QmF0Y2g6ICgpID0+IGJhdGNoLFxuICAgIGdldEJhdGNoZXM6ICgpID0+IGJhdGNoZXMsXG4gICAgZ2V0UmVjb3JkQmF0Y2g6ICgpID0+IHJlY29yZEJhdGNoLFxuICAgIGdldEltYWdlOiAoKSA9PiBpbWFnZSxcbiAgICBnZXRTb3VyY2U6ICgpID0+IHNvdXJjZSxcbiAgICBnZXRSZWNvcmQ6ICgpID0+IHByaW1hcnlSZWNvcmQsXG4gICAgZ2V0UmVjb3JkczogKCkgPT4gcmVjb3JkcyxcbiAgICBnZXRSZWNvcmREYXRhOiAoKSA9PiByZWNvcmREYXRhLFxuICAgIGdldEltYWdlUmVzdWx0c0RhdGE6ICgpID0+IGltYWdlUmVzdWx0c0RhdGEsXG4gICAgZ2V0VXBsb2FkOiAoKSA9PiB1cGxvYWQsXG4gICAgZ2V0VXBsb2FkczogKCkgPT4gdXBsb2FkcyxcbiAgICBnZXRVcGxvYWRJbWFnZTogKCkgPT4gdXBsb2FkSW1hZ2UsXG4gICAgZ2V0VXNlcjogKCkgPT4gdXNlcixcbiAgICByZXEsXG4gICAgSW1hZ2UsXG4gICAgUmVjb3JkLFxuICAgIEltYWdlSW1wb3J0LFxuICAgIFJlY29yZEltcG9ydCxcbiAgICBVcGxvYWRJbWFnZSxcbiAgICBVc2VyLFxuICAgIFNvdXJjZSxcbiAgICBzdHViOiBzaW5vbi5zdHViLFxuICAgIGluaXQsXG59O1xuIl19