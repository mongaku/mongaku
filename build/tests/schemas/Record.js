"use strict";

var tap = require("tap");

var init = require("../init");
var req = init.req;
var Record = init.Record;

tap.test("getURL", { autoend: true }, function (t) {
    var record = init.getRecord();
    t.equal(record.getURL("en"), "/artworks/test/1234", "Check 'en' URL");

    t.equal(record.getURL("de"), "/artworks/test/1234?lang=de", "Check 'de' URL");
});

tap.test("getThumbURL", { autoend: true }, function (t) {
    var record = init.getRecord();
    t.equal(record.getThumbURL(), "/data/test/thumbs/4266906334.jpg", "Check Thumb URL");
});

tap.test("getTitle", { autoend: true }, function (t) {
    var record = init.getRecord();
    t.equal(record.getTitle(req), "Test", "Check Title");

    record.title = null;
    t.equal(record.getTitle(req), null, "Check Title");

    record.title = "Test";
});

tap.test("getSource", { autoend: true }, function (t) {
    var record = init.getRecord();
    var source = init.getSource();
    t.equal(record.getSource(), source, "Get Source");
});

tap.test("date", { autoend: true }, function (t) {
    var record = init.getRecord();
    t.same(record.dates[0].toJSON(), {
        _id: "ca. 1456-1457",
        start: 1456,
        end: 1457,
        circa: true
    }, "Get Date");
});

tap.test("Record.fromData: Data error", function (t) {
    Record.fromData({}, req, function (err, value, warnings) {
        t.equal(err.message, "Required field `id` is empty.", "Data error.");
        t.equal(value, undefined, "No record should be returned.");
        t.equal(warnings, undefined, "There should be no warnings.");
        t.end();
    });
});

tap.test("Record.fromData: Existing record", function (t) {
    var record = init.getRecord();
    var recordData = init.getRecordData();
    Record.fromData(recordData, req, function (err, value, warnings) {
        t.error(err, "Error should be empty.");
        t.equal(value, record, "Record should be returned.");
        t.equal(value.defaultImageHash, "4266906334", "defaultImageHash is set.");
        t.equal(value.images.length, 1, "Images are set.");
        t.equal(value.images[0], "test/foo.jpg", "Images are set.");
        t.same(warnings, [], "There should be no warnings.");
        t.end();
    });
});

tap.test("Record.fromData: New record", function (t) {
    var recordData = init.getRecordData();
    var newData = Object.assign({}, recordData, {
        id: "4266906334"
    });

    Record.fromData(newData, req, function (err, value, warnings) {
        t.error(err, "Error should be empty.");
        t.equal(value._id, "test/4266906334", "New record should be returned.");
        t.equal(value.defaultImageHash, "4266906334", "defaultImageHash is set.");
        t.equal(value.images.length, 1, "Images are set.");
        t.equal(value.images[0], "test/foo.jpg", "Images are set.");
        t.same(warnings, [], "There should be no warnings.");
        t.end();
    });
});

tap.test("Record.fromData: New record with warnings", function (t) {
    var recordData = init.getRecordData();
    var newData = Object.assign({}, recordData, {
        id: "4266906334",
        batch: "batch"
    });

    Record.fromData(newData, req, function (err, value, warnings) {
        t.error(err, "Error should be empty.");
        t.equal(value._id, "test/4266906334", "New record should be returned.");
        t.equal(value.defaultImageHash, "4266906334", "defaultImageHash is set.");
        t.equal(value.images.length, 1, "Images are set.");
        t.equal(value.images[0], "test/foo.jpg", "Images are set.");
        t.same(warnings, ["Unrecognized field `batch`."], "There should be a single warning.");
        t.end();
    });
});

tap.test("Record.fromData: New record missing images", function (t) {
    var recordData = init.getRecordData();
    var newData = Object.assign({}, recordData, {
        id: "4266906334",
        images: ["missing.jpg"]
    });

    Record.fromData(newData, req, function (err, value, warnings) {
        t.equal(err.message, "No images found.", "No images found.");
        t.equal(value, undefined, "No record should be returned.");
        t.equal(warnings, undefined, "There should be no warnings.");
        t.end();
    });
});

tap.test("Record.fromData: New record missing single image", function (t) {
    var recordData = init.getRecordData();
    var newData = Object.assign({}, recordData, {
        id: "4266906334",
        images: ["missing.jpg", "foo.jpg"]
    });

    Record.fromData(newData, req, function (err, value, warnings) {
        t.error(err, "Error should be empty.");
        t.equal(value._id, "test/4266906334", "New record should be returned.");
        t.equal(value.defaultImageHash, "4266906334", "defaultImageHash is set.");
        t.equal(value.images.length, 1, "Images are set.");
        t.equal(value.images[0], "test/foo.jpg", "Images are set.");
        t.same(warnings, ["Image file not found: missing.jpg"], "There should be a warning.");
        t.end();
    });
});

tap.test("updateSimilarity", function (t) {
    var record = init.getRecord();
    record.updateSimilarity(function (err) {
        t.error(err, "Error should be empty.");
        t.equal(record.similarRecords.length, 1, "Correct number of matches.");
        t.same(record.similarRecords[0].toJSON(), {
            _id: "test/1235",
            record: "test/1235",
            score: 10,
            source: "test",
            images: ["test/bar.jpg"]
        }, "Check similar record result");
        t.end();
    });
});

tap.test("updateSimilarity with two matches", function (t) {
    var records = init.getRecords();
    var record = records["test/1235"];
    record.updateSimilarity(function (err) {
        t.error(err, "Error should be empty.");
        t.equal(record.similarRecords.length, 2, "Correct number of matches.");
        t.same(record.similarRecords[0].toJSON(), {
            _id: "test/1236",
            record: "test/1236",
            score: 17,
            source: "test",
            images: ["test/new1.jpg", "test/new2.jpg"]
        }, "Check similar record result");
        t.same(record.similarRecords[1].toJSON(), {
            _id: "test/1234",
            record: "test/1234",
            score: 10,
            source: "test",
            images: ["test/foo.jpg"]
        }, "Check similar record result");
        t.end();
    });
});

tap.test("updateSimilarity with no similar", function (t) {
    var records = init.getRecords();
    var record = records["test/1237"];
    record.updateSimilarity(function (err) {
        t.error(err, "Error should be empty.");
        t.equal(record.similarRecords.length, 0, "Correct number of matches.");
        t.end();
    });
});

tap.test("Record.lintData: Unknown Fields", { autoend: true }, function (t) {
    t.same(Record.lintData({
        batch: "test"
    }, req), {
        "error": "Required field `id` is empty.",
        "warnings": ["Unrecognized field `batch`."]
    }, "Known field");

    t.same(Record.lintData({
        random: "test"
    }, req), {
        "error": "Required field `id` is empty.",
        "warnings": ["Unrecognized field `random`."]
    }, "Unknown field");
});

tap.test("Record.lintData: Required Fields", { autoend: true }, function (t) {
    t.same(Record.lintData({}, req), {
        "error": "Required field `id` is empty.",
        "warnings": []
    }, "ID");

    t.same(Record.lintData({
        id: ""
    }, req), {
        "error": "Required field `id` is empty.",
        "warnings": []
    }, "ID Empty String");

    t.same(Record.lintData({
        id: "1234"
    }, req), {
        "error": "Required field `type` is empty.",
        "warnings": []
    }, "Type");

    t.same(Record.lintData({
        id: "1234",
        type: ""
    }, req), {
        "error": "Required field `type` is empty.",
        "warnings": []
    }, "Type Empty String");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks"
    }, req), {
        "error": "Required field `source` is empty.",
        "warnings": []
    }, "Source");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: ""
    }, req), {
        "error": "Required field `source` is empty.",
        "warnings": []
    }, "Source Empty String");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga"
    }, req), {
        "error": "Required field `lang` is empty.",
        "warnings": []
    }, "Lang");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: ""
    }, req), {
        "error": "Required field `lang` is empty.",
        "warnings": []
    }, "Lang Empty String");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en"
    }, req), {
        "error": "Required field `url` is empty.",
        "warnings": []
    }, "URL");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: ""
    }, req), {
        "error": "Required field `url` is empty.",
        "warnings": []
    }, "URL Empty String");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com/"
    }, req), {
        "error": "Required field `images` is empty.",
        "warnings": []
    }, "Images");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com/",
        images: []
    }, req), {
        "error": "Required field `images` is empty.",
        "warnings": []
    }, "Images Empty Array");
});

tap.test("Record.lintData: Recommended Fields", { autoend: true }, function (t) {
    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com/",
        images: ["foo.jpg"]
    }, req), {
        data: {
            id: "1234",
            type: "artworks",
            source: "nga",
            lang: "en",
            url: "http://google.com/",
            images: ["nga/foo.jpg"]
        },
        "warnings": ["Recommended field `title` is empty.", "Recommended field `objectType` is empty."]
    }, "Title and objectType recommended.");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com/",
        images: ["foo.jpg"],
        title: "",
        objectType: ""
    }, req), {
        data: {
            id: "1234",
            type: "artworks",
            source: "nga",
            lang: "en",
            url: "http://google.com/",
            images: ["nga/foo.jpg"]
        },
        "warnings": ["Recommended field `title` is empty.", "Recommended field `objectType` is empty."]
    }, "Title and objectType recommended.");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com/",
        images: ["foo.jpg"],
        title: "Test"
    }, req), {
        data: {
            id: "1234",
            type: "artworks",
            source: "nga",
            lang: "en",
            url: "http://google.com/",
            images: ["nga/foo.jpg"],
            title: "Test"
        },
        "warnings": ["Recommended field `objectType` is empty."]
    }, "objectType recommended.");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com/",
        images: ["foo.jpg"],
        title: "Test",
        objectType: ""
    }, req), {
        data: {
            id: "1234",
            type: "artworks",
            source: "nga",
            lang: "en",
            url: "http://google.com/",
            images: ["nga/foo.jpg"],
            title: "Test"
        },
        "warnings": ["Recommended field `objectType` is empty."]
    }, "objectType recommended.");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com/",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting"
    }, req), {
        data: {
            id: "1234",
            type: "artworks",
            source: "nga",
            lang: "en",
            url: "http://google.com/",
            images: ["nga/foo.jpg"],
            title: "Test",
            objectType: "painting"
        },
        "warnings": []
    }, "No recommended.");
});

tap.test("Record.lintData: Type checking", { autoend: true }, function (t) {
    t.same(Record.lintData({
        id: 1234,
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com/",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting"
    }, req), {
        "error": "Required field `id` is empty.",
        "warnings": ["`id` is the wrong type. Expected a string."]
    }, "ID");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: 1234,
        lang: "en",
        url: "http://google.com/",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting"
    }, req), {
        "error": "Required field `source` is empty.",
        "warnings": ["`source` is the wrong type. Expected a string."]
    }, "Source");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: true,
        url: "http://google.com/",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting"
    }, req), {
        "error": "Required field `lang` is empty.",
        "warnings": ["`lang` is the wrong type. Expected a string."]
    }, "Lang");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: {},
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting"
    }, req), {
        "error": "Required field `url` is empty.",
        "warnings": ["`url` is the wrong type. Expected a string."]
    }, "URL");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com/",
        images: {},
        title: "Test",
        objectType: "painting"
    }, req), {
        "error": "Required field `images` is empty.",
        "warnings": ["Images must be a valid image file name. For example: `image.jpg`."]
    }, "Images");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com/",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting",
        dates: [{ start: "1234", end: 1976 }]
    }, req), {
        data: {
            id: "1234",
            type: "artworks",
            source: "nga",
            lang: "en",
            url: "http://google.com/",
            images: ["nga/foo.jpg"],
            title: "Test",
            objectType: "painting",
            dates: [{ start: 1234, end: 1976 }]
        },
        "warnings": []
    }, "Date Start");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com/",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting",
        dates: [{ start: 1234, end: 1976, circa: "foo" }]
    }, req), {
        data: {
            id: "1234",
            type: "artworks",
            source: "nga",
            lang: "en",
            url: "http://google.com/",
            images: ["nga/foo.jpg"],
            title: "Test",
            objectType: "painting",
            dates: [{ start: 1234, end: 1976 }]
        },
        "warnings": ["`dates`: `circa` is the wrong type. Expected a boolean."]
    }, "Date Circa");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com/",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting",
        categories: {}
    }, req), {
        data: {
            id: "1234",
            type: "artworks",
            source: "nga",
            lang: "en",
            url: "http://google.com/",
            images: ["nga/foo.jpg"],
            title: "Test",
            objectType: "painting"
        },
        "warnings": ["`categories` value is the wrong type. Expected a string."]
    }, "Categories");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com/",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting",
        categories: [true]
    }, req), {
        data: {
            id: "1234",
            type: "artworks",
            source: "nga",
            lang: "en",
            url: "http://google.com/",
            images: ["nga/foo.jpg"],
            title: "Test",
            objectType: "painting"
        },
        "warnings": ["`categories` value is the wrong type. Expected a string."]
    }, "Categories Values");
});

tap.test("Record.lintData: Validation", { autoend: true }, function (t) {
    t.same(Record.lintData({
        id: "1234/456",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com/",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting"
    }, req), {
        "error": "Required field `id` is empty.",
        "warnings": ["IDs can only contain letters, numbers, underscores, and hyphens."]
    }, "ID");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "",
        url: "http://google.com/",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting"
    }, req), {
        "error": "Required field `lang` is empty.",
        "warnings": []
    }, "Lang");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http//google.com",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting"
    }, req), {
        "error": "Required field `url` is empty.",
        "warnings": ["`url` must be properly-formatted URL."]
    }, "URL");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com",
        images: ["foojpg"],
        title: "Test",
        objectType: "painting"
    }, req), {
        "error": "Required field `images` is empty.",
        "warnings": ["Images must be a valid image file name. For example: `image.jpg`."]
    }, "Images");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "foo"
    }, req), {
        data: {
            id: "1234",
            type: "artworks",
            source: "nga",
            lang: "en",
            url: "http://google.com",
            images: ["nga/foo.jpg"],
            title: "Test"
        },
        "warnings": ["`objectType` must be one of the following types: architecture, " + "decorative arts, drawing, fresco, medal, miniature, mosaic, " + "painting, photo, print, sculpture, stained glass.", "Recommended field `objectType` is empty."]
    }, "objectType");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting",
        artists: [{ pseudonym: "Test" }]
    }, req), {
        data: {
            id: "1234",
            type: "artworks",
            source: "nga",
            lang: "en",
            url: "http://google.com",
            images: ["nga/foo.jpg"],
            title: "Test",
            objectType: "painting",
            artists: [{ pseudonym: "Test" }]
        },
        "warnings": ["`artists`: Recommended field `name` is empty."]
    }, "artists");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting",
        artists: [{ name: "Test" }],
        dimensions: [{ width: 123 }]
    }, req), {
        data: {
            id: "1234",
            type: "artworks",
            source: "nga",
            lang: "en",
            url: "http://google.com",
            images: ["nga/foo.jpg"],
            title: "Test",
            objectType: "painting",
            artists: [{ name: "Test" }]
        },
        "warnings": ["Dimensions must have a unit specified and at least a width " + "or height."]
    }, "dimensions");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting",
        artists: [{ name: "Test" }],
        dimensions: [{ unit: "mm" }]
    }, req), {
        data: {
            id: "1234",
            type: "artworks",
            source: "nga",
            lang: "en",
            url: "http://google.com",
            images: ["nga/foo.jpg"],
            title: "Test",
            objectType: "painting",
            artists: [{ name: "Test" }]
        },
        "warnings": ["Dimensions must have a unit specified and at least a width " + "or height."]
    }, "dimensions");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting",
        artists: [{ name: "Test" }],
        dimensions: [{ width: 123, unit: "mm" }],
        dates: [{ circa: true }]
    }, req), {
        data: {
            id: "1234",
            type: "artworks",
            source: "nga",
            lang: "en",
            url: "http://google.com",
            images: ["nga/foo.jpg"],
            title: "Test",
            objectType: "painting",
            artists: [{ name: "Test" }],
            dimensions: [{ width: 123, unit: "mm" }]
        },
        "warnings": ["Dates must have a start or end specified."]
    }, "dates");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting",
        artists: [{
            name: "Test",
            dates: [{ circa: true }]
        }],
        dimensions: [{ width: 123, unit: "mm" }]
    }, req), {
        data: {
            id: "1234",
            type: "artworks",
            source: "nga",
            lang: "en",
            url: "http://google.com",
            images: ["nga/foo.jpg"],
            title: "Test",
            objectType: "painting",
            artists: [{ name: "Test" }],
            dimensions: [{ width: 123, unit: "mm" }]
        },
        "warnings": ["`artists`: Dates must have a start or end specified."]
    }, "dates in artists");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting",
        artists: [{ name: "Test" }],
        dimensions: [{ width: 123, unit: "mm" }],
        dates: [{ start: 1456, end: 1457, circa: true }],
        locations: [{ country: "United States" }]
    }, req), {
        data: {
            id: "1234",
            type: "artworks",
            source: "nga",
            lang: "en",
            url: "http://google.com",
            images: ["nga/foo.jpg"],
            title: "Test",
            objectType: "painting",
            artists: [{ name: "Test" }],
            dimensions: [{ width: 123, unit: "mm" }],
            dates: [{ start: 1456, end: 1457, circa: true }]
        },
        "warnings": ["Locations must have a name or city specified."]
    }, "locations");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting",
        artists: [{ name: "Test" }],
        dimensions: [{ width: 123, unit: "mm" }],
        dates: [{ start: 1456, end: 1457, circa: true }],
        locations: [{ city: "New York City" }]
    }, req), {
        data: {
            id: "1234",
            type: "artworks",
            source: "nga",
            lang: "en",
            url: "http://google.com",
            images: ["nga/foo.jpg"],
            title: "Test",
            objectType: "painting",
            artists: [{ name: "Test" }],
            dimensions: [{ width: 123, unit: "mm" }],
            dates: [{ start: 1456, end: 1457, circa: true }],
            locations: [{ city: "New York City" }]
        },
        "warnings": []
    }, "All pass");
});

tap.test("Record.lintData: Conversion", { autoend: true }, function (t) {
    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting",
        artists: ["Test"],
        dimensions: [{ width: 123, unit: "mm" }],
        dates: [{ start: 1456, end: 1457, circa: true }],
        locations: [{ city: "New York City" }]
    }, req), {
        data: {
            id: "1234",
            type: "artworks",
            source: "nga",
            lang: "en",
            url: "http://google.com",
            images: ["nga/foo.jpg"],
            title: "Test",
            objectType: "painting",
            artists: [{ name: "Test" }],
            dimensions: [{ width: 123, unit: "mm" }],
            dates: [{ start: 1456, end: 1457, circa: true }],
            locations: [{ city: "New York City" }]
        },
        "warnings": []
    }, "Artists");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting",
        artists: [{ name: "Test" }],
        dimensions: ["123 x 100 cm"],
        dates: [{ start: 1456, end: 1457, circa: true }],
        locations: [{ city: "New York City" }]
    }, req), {
        data: {
            id: "1234",
            type: "artworks",
            source: "nga",
            lang: "en",
            url: "http://google.com",
            images: ["nga/foo.jpg"],
            title: "Test",
            objectType: "painting",
            artists: [{ name: "Test" }],
            dimensions: [{
                "original": "123 x 100 cm",
                height: 1230,
                width: 1000,
                unit: "mm"
            }],
            dates: [{ start: 1456, end: 1457, circa: true }],
            locations: [{ city: "New York City" }]
        },
        "warnings": []
    }, "Dimensions");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting",
        artists: [{ name: "Test" }],
        dimensions: ["123"],
        dates: [{ start: 1456, end: 1457, circa: true }],
        locations: [{ city: "New York City" }]
    }, req), {
        data: {
            id: "1234",
            type: "artworks",
            source: "nga",
            lang: "en",
            url: "http://google.com",
            images: ["nga/foo.jpg"],
            title: "Test",
            objectType: "painting",
            artists: [{ name: "Test" }],
            dates: [{ start: 1456, end: 1457, circa: true }],
            locations: [{ city: "New York City" }]
        },
        "warnings": ["Dimensions must have a unit specified and at least a width" + " or height."]
    }, "Dimensions produce warnings");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting",
        artists: [{ name: "Test" }],
        dimensions: [{ width: 123, unit: "mm" }],
        dates: ["ca. 1456-1457"],
        locations: [{ city: "New York City" }]
    }, req), {
        data: {
            id: "1234",
            type: "artworks",
            source: "nga",
            lang: "en",
            url: "http://google.com",
            images: ["nga/foo.jpg"],
            title: "Test",
            objectType: "painting",
            artists: [{ name: "Test" }],
            dimensions: [{ width: 123, unit: "mm" }],
            dates: [{
                start: 1456,
                end: 1457,
                circa: true,
                "original": "ca. 1456-1457"
            }],
            locations: [{ city: "New York City" }]
        },
        "warnings": []
    }, "Dates");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting",
        artists: [{ name: "Test" }],
        dimensions: [{ width: 123, unit: "mm" }],
        dates: ["blah"],
        locations: [{ city: "New York City" }]
    }, req), {
        data: {
            id: "1234",
            type: "artworks",
            source: "nga",
            lang: "en",
            url: "http://google.com",
            images: ["nga/foo.jpg"],
            title: "Test",
            objectType: "painting",
            artists: [{ name: "Test" }],
            dimensions: [{ width: 123, unit: "mm" }],
            locations: [{ city: "New York City" }]
        },
        "warnings": ["Dates must have a start or end specified."]
    }, "Dates produce warnings");

    t.same(Record.lintData({
        id: "1234",
        type: "artworks",
        source: "nga",
        lang: "en",
        url: "http://google.com",
        images: ["foo.jpg"],
        title: "Test",
        objectType: "painting",
        artists: [{
            name: "Test",
            dates: ["ca. 1456-1457"]
        }],
        dimensions: [{ width: 123, unit: "mm" }],
        dates: ["ca. 1456-1457"],
        locations: [{ city: "New York City" }]
    }, req), {
        data: {
            id: "1234",
            type: "artworks",
            source: "nga",
            lang: "en",
            url: "http://google.com",
            images: ["nga/foo.jpg"],
            title: "Test",
            objectType: "painting",
            artists: [{
                name: "Test",
                dates: [{
                    start: 1456,
                    end: 1457,
                    circa: true,
                    "original": "ca. 1456-1457"
                }]
            }],
            dimensions: [{ width: 123, unit: "mm" }],
            dates: [{
                start: 1456,
                end: 1457,
                circa: true,
                "original": "ca. 1456-1457"
            }],
            locations: [{ city: "New York City" }]
        },
        "warnings": []
    }, "Dates in Artists");
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0cy9zY2hlbWFzL1JlY29yZC5qcyJdLCJuYW1lcyI6WyJ0YXAiLCJyZXF1aXJlIiwiaW5pdCIsInJlcSIsIlJlY29yZCIsInRlc3QiLCJhdXRvZW5kIiwidCIsInJlY29yZCIsImdldFJlY29yZCIsImVxdWFsIiwiZ2V0VVJMIiwiZ2V0VGh1bWJVUkwiLCJnZXRUaXRsZSIsInRpdGxlIiwic291cmNlIiwiZ2V0U291cmNlIiwic2FtZSIsImRhdGVzIiwidG9KU09OIiwiX2lkIiwic3RhcnQiLCJlbmQiLCJjaXJjYSIsImZyb21EYXRhIiwiZXJyIiwidmFsdWUiLCJ3YXJuaW5ncyIsIm1lc3NhZ2UiLCJ1bmRlZmluZWQiLCJyZWNvcmREYXRhIiwiZ2V0UmVjb3JkRGF0YSIsImVycm9yIiwiZGVmYXVsdEltYWdlSGFzaCIsImltYWdlcyIsImxlbmd0aCIsIm5ld0RhdGEiLCJPYmplY3QiLCJhc3NpZ24iLCJpZCIsImJhdGNoIiwidXBkYXRlU2ltaWxhcml0eSIsInNpbWlsYXJSZWNvcmRzIiwic2NvcmUiLCJyZWNvcmRzIiwiZ2V0UmVjb3JkcyIsImxpbnREYXRhIiwicmFuZG9tIiwidHlwZSIsImxhbmciLCJ1cmwiLCJkYXRhIiwib2JqZWN0VHlwZSIsImNhdGVnb3JpZXMiLCJhcnRpc3RzIiwicHNldWRvbnltIiwibmFtZSIsImRpbWVuc2lvbnMiLCJ3aWR0aCIsInVuaXQiLCJsb2NhdGlvbnMiLCJjb3VudHJ5IiwiY2l0eSIsImhlaWdodCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxNQUFNQyxRQUFRLEtBQVIsQ0FBWjs7QUFFQSxJQUFNQyxPQUFPRCxRQUFRLFNBQVIsQ0FBYjtBQUNBLElBQU1FLE1BQU1ELEtBQUtDLEdBQWpCO0FBQ0EsSUFBTUMsU0FBU0YsS0FBS0UsTUFBcEI7O0FBRUFKLElBQUlLLElBQUosQ0FBUyxRQUFULEVBQW1CLEVBQUNDLFNBQVMsSUFBVixFQUFuQixFQUFvQyxVQUFDQyxDQUFELEVBQU87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SDtBQUVKQyxxQkFBSyxJQUZEO0FBR0pDLHVCQUFPLElBSEg7QUFJSiw0QkFBWTtBQUpSLGFBQUQsQ0FuQkw7QUF5QkZxQyx1QkFBVyxDQUFDLEVBQUNFLE1BQU0sZUFBUCxFQUFEO0FBekJULFNBREQ7QUE0Qkwsb0JBQVk7QUE1QlAsS0FoQlQsRUE2Q0csa0JBN0NIO0FBOENILENBdk5EIiwiZmlsZSI6IlJlY29yZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHRhcCA9IHJlcXVpcmUoXCJ0YXBcIik7XG5cbmNvbnN0IGluaXQgPSByZXF1aXJlKFwiLi4vaW5pdFwiKTtcbmNvbnN0IHJlcSA9IGluaXQucmVxO1xuY29uc3QgUmVjb3JkID0gaW5pdC5SZWNvcmQ7XG5cbnRhcC50ZXN0KFwiZ2V0VVJMXCIsIHthdXRvZW5kOiB0cnVlfSwgKHQpID0+IHtcbiAgICBjb25zdCByZWNvcmQgPSBpbml0LmdldFJlY29yZCgpO1xuICAgIHQuZXF1YWwocmVjb3JkLmdldFVSTChcImVuXCIpLFxuICAgICAgICBcIi9hcnR3b3Jrcy90ZXN0LzEyMzRcIiwgXCJDaGVjayAnZW4nIFVSTFwiKTtcblxuICAgIHQuZXF1YWwocmVjb3JkLmdldFVSTChcImRlXCIpLFxuICAgICAgICBcIi9hcnR3b3Jrcy90ZXN0LzEyMzQ/bGFuZz1kZVwiLCBcIkNoZWNrICdkZScgVVJMXCIpO1xufSk7XG5cbnRhcC50ZXN0KFwiZ2V0VGh1bWJVUkxcIiwge2F1dG9lbmQ6IHRydWV9LCAodCkgPT4ge1xuICAgIGNvbnN0IHJlY29yZCA9IGluaXQuZ2V0UmVjb3JkKCk7XG4gICAgdC5lcXVhbChyZWNvcmQuZ2V0VGh1bWJVUkwoKSxcbiAgICAgICAgXCIvZGF0YS90ZXN0L3RodW1icy80MjY2OTA2MzM0LmpwZ1wiLFxuICAgICAgICBcIkNoZWNrIFRodW1iIFVSTFwiKTtcbn0pO1xuXG50YXAudGVzdChcImdldFRpdGxlXCIsIHthdXRvZW5kOiB0cnVlfSwgKHQpID0+IHtcbiAgICBjb25zdCByZWNvcmQgPSBpbml0LmdldFJlY29yZCgpO1xuICAgIHQuZXF1YWwocmVjb3JkLmdldFRpdGxlKHJlcSksIFwiVGVzdFwiLCBcIkNoZWNrIFRpdGxlXCIpO1xuXG4gICAgcmVjb3JkLnRpdGxlID0gbnVsbDtcbiAgICB0LmVxdWFsKHJlY29yZC5nZXRUaXRsZShyZXEpLCBudWxsLCBcIkNoZWNrIFRpdGxlXCIpO1xuXG4gICAgcmVjb3JkLnRpdGxlID0gXCJUZXN0XCI7XG59KTtcblxudGFwLnRlc3QoXCJnZXRTb3VyY2VcIiwge2F1dG9lbmQ6IHRydWV9LCAodCkgPT4ge1xuICAgIGNvbnN0IHJlY29yZCA9IGluaXQuZ2V0UmVjb3JkKCk7XG4gICAgY29uc3Qgc291cmNlID0gaW5pdC5nZXRTb3VyY2UoKTtcbiAgICB0LmVxdWFsKHJlY29yZC5nZXRTb3VyY2UoKSwgc291cmNlLCBcIkdldCBTb3VyY2VcIik7XG59KTtcblxudGFwLnRlc3QoXCJkYXRlXCIsIHthdXRvZW5kOiB0cnVlfSwgKHQpID0+IHtcbiAgICBjb25zdCByZWNvcmQgPSBpbml0LmdldFJlY29yZCgpO1xuICAgIHQuc2FtZShyZWNvcmQuZGF0ZXNbMF0udG9KU09OKCksXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9pZDogXCJjYS4gMTQ1Ni0xNDU3XCIsXG4gICAgICAgICAgICBzdGFydDogMTQ1NixcbiAgICAgICAgICAgIGVuZDogMTQ1NyxcbiAgICAgICAgICAgIGNpcmNhOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBcIkdldCBEYXRlXCIpO1xufSk7XG5cbnRhcC50ZXN0KFwiUmVjb3JkLmZyb21EYXRhOiBEYXRhIGVycm9yXCIsICh0KSA9PiB7XG4gICAgUmVjb3JkLmZyb21EYXRhKHt9LCByZXEsIChlcnIsIHZhbHVlLCB3YXJuaW5ncykgPT4ge1xuICAgICAgICB0LmVxdWFsKGVyci5tZXNzYWdlLCBcIlJlcXVpcmVkIGZpZWxkIGBpZGAgaXMgZW1wdHkuXCIsXG4gICAgICAgICAgICBcIkRhdGEgZXJyb3IuXCIpO1xuICAgICAgICB0LmVxdWFsKHZhbHVlLCB1bmRlZmluZWQsIFwiTm8gcmVjb3JkIHNob3VsZCBiZSByZXR1cm5lZC5cIik7XG4gICAgICAgIHQuZXF1YWwod2FybmluZ3MsIHVuZGVmaW5lZCwgXCJUaGVyZSBzaG91bGQgYmUgbm8gd2FybmluZ3MuXCIpO1xuICAgICAgICB0LmVuZCgpO1xuICAgIH0pO1xufSk7XG5cbnRhcC50ZXN0KFwiUmVjb3JkLmZyb21EYXRhOiBFeGlzdGluZyByZWNvcmRcIiwgKHQpID0+IHtcbiAgICBjb25zdCByZWNvcmQgPSBpbml0LmdldFJlY29yZCgpO1xuICAgIGNvbnN0IHJlY29yZERhdGEgPSBpbml0LmdldFJlY29yZERhdGEoKTtcbiAgICBSZWNvcmQuZnJvbURhdGEocmVjb3JkRGF0YSwgcmVxLCAoZXJyLCB2YWx1ZSwgd2FybmluZ3MpID0+IHtcbiAgICAgICAgdC5lcnJvcihlcnIsIFwiRXJyb3Igc2hvdWxkIGJlIGVtcHR5LlwiKTtcbiAgICAgICAgdC5lcXVhbCh2YWx1ZSwgcmVjb3JkLCBcIlJlY29yZCBzaG91bGQgYmUgcmV0dXJuZWQuXCIpO1xuICAgICAgICB0LmVxdWFsKHZhbHVlLmRlZmF1bHRJbWFnZUhhc2gsIFwiNDI2NjkwNjMzNFwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0SW1hZ2VIYXNoIGlzIHNldC5cIik7XG4gICAgICAgIHQuZXF1YWwodmFsdWUuaW1hZ2VzLmxlbmd0aCwgMSwgXCJJbWFnZXMgYXJlIHNldC5cIik7XG4gICAgICAgIHQuZXF1YWwodmFsdWUuaW1hZ2VzWzBdLCBcInRlc3QvZm9vLmpwZ1wiLCBcIkltYWdlcyBhcmUgc2V0LlwiKTtcbiAgICAgICAgdC5zYW1lKHdhcm5pbmdzLCBbXSwgXCJUaGVyZSBzaG91bGQgYmUgbm8gd2FybmluZ3MuXCIpO1xuICAgICAgICB0LmVuZCgpO1xuICAgIH0pO1xufSk7XG5cbnRhcC50ZXN0KFwiUmVjb3JkLmZyb21EYXRhOiBOZXcgcmVjb3JkXCIsICh0KSA9PiB7XG4gICAgY29uc3QgcmVjb3JkRGF0YSA9IGluaXQuZ2V0UmVjb3JkRGF0YSgpO1xuICAgIGNvbnN0IG5ld0RhdGEgPSBPYmplY3QuYXNzaWduKHt9LCByZWNvcmREYXRhLCB7XG4gICAgICAgIGlkOiBcIjQyNjY5MDYzMzRcIixcbiAgICB9KTtcblxuICAgIFJlY29yZC5mcm9tRGF0YShuZXdEYXRhLCByZXEsIChlcnIsIHZhbHVlLCB3YXJuaW5ncykgPT4ge1xuICAgICAgICB0LmVycm9yKGVyciwgXCJFcnJvciBzaG91bGQgYmUgZW1wdHkuXCIpO1xuICAgICAgICB0LmVxdWFsKHZhbHVlLl9pZCwgXCJ0ZXN0LzQyNjY5MDYzMzRcIixcbiAgICAgICAgICAgIFwiTmV3IHJlY29yZCBzaG91bGQgYmUgcmV0dXJuZWQuXCIpO1xuICAgICAgICB0LmVxdWFsKHZhbHVlLmRlZmF1bHRJbWFnZUhhc2gsIFwiNDI2NjkwNjMzNFwiLFxuICAgICAgICAgICAgXCJkZWZhdWx0SW1hZ2VIYXNoIGlzIHNldC5cIik7XG4gICAgICAgIHQuZXF1YWwodmFsdWUuaW1hZ2VzLmxlbmd0aCwgMSwgXCJJbWFnZXMgYXJlIHNldC5cIik7XG4gICAgICAgIHQuZXF1YWwodmFsdWUuaW1hZ2VzWzBdLCBcInRlc3QvZm9vLmpwZ1wiLCBcIkltYWdlcyBhcmUgc2V0LlwiKTtcbiAgICAgICAgdC5zYW1lKHdhcm5pbmdzLCBbXSwgXCJUaGVyZSBzaG91bGQgYmUgbm8gd2FybmluZ3MuXCIpO1xuICAgICAgICB0LmVuZCgpO1xuICAgIH0pO1xufSk7XG5cbnRhcC50ZXN0KFwiUmVjb3JkLmZyb21EYXRhOiBOZXcgcmVjb3JkIHdpdGggd2FybmluZ3NcIiwgKHQpID0+IHtcbiAgICBjb25zdCByZWNvcmREYXRhID0gaW5pdC5nZXRSZWNvcmREYXRhKCk7XG4gICAgY29uc3QgbmV3RGF0YSA9IE9iamVjdC5hc3NpZ24oe30sIHJlY29yZERhdGEsIHtcbiAgICAgICAgaWQ6IFwiNDI2NjkwNjMzNFwiLFxuICAgICAgICBiYXRjaDogXCJiYXRjaFwiLFxuICAgIH0pO1xuXG4gICAgUmVjb3JkLmZyb21EYXRhKG5ld0RhdGEsIHJlcSwgKGVyciwgdmFsdWUsIHdhcm5pbmdzKSA9PiB7XG4gICAgICAgIHQuZXJyb3IoZXJyLCBcIkVycm9yIHNob3VsZCBiZSBlbXB0eS5cIik7XG4gICAgICAgIHQuZXF1YWwodmFsdWUuX2lkLCBcInRlc3QvNDI2NjkwNjMzNFwiLFxuICAgICAgICAgICAgXCJOZXcgcmVjb3JkIHNob3VsZCBiZSByZXR1cm5lZC5cIik7XG4gICAgICAgIHQuZXF1YWwodmFsdWUuZGVmYXVsdEltYWdlSGFzaCwgXCI0MjY2OTA2MzM0XCIsXG4gICAgICAgICAgICBcImRlZmF1bHRJbWFnZUhhc2ggaXMgc2V0LlwiKTtcbiAgICAgICAgdC5lcXVhbCh2YWx1ZS5pbWFnZXMubGVuZ3RoLCAxLCBcIkltYWdlcyBhcmUgc2V0LlwiKTtcbiAgICAgICAgdC5lcXVhbCh2YWx1ZS5pbWFnZXNbMF0sIFwidGVzdC9mb28uanBnXCIsIFwiSW1hZ2VzIGFyZSBzZXQuXCIpO1xuICAgICAgICB0LnNhbWUod2FybmluZ3MsIFtcIlVucmVjb2duaXplZCBmaWVsZCBgYmF0Y2hgLlwiXSxcbiAgICAgICAgICAgIFwiVGhlcmUgc2hvdWxkIGJlIGEgc2luZ2xlIHdhcm5pbmcuXCIpO1xuICAgICAgICB0LmVuZCgpO1xuICAgIH0pO1xufSk7XG5cbnRhcC50ZXN0KFwiUmVjb3JkLmZyb21EYXRhOiBOZXcgcmVjb3JkIG1pc3NpbmcgaW1hZ2VzXCIsICh0KSA9PiB7XG4gICAgY29uc3QgcmVjb3JkRGF0YSA9IGluaXQuZ2V0UmVjb3JkRGF0YSgpO1xuICAgIGNvbnN0IG5ld0RhdGEgPSBPYmplY3QuYXNzaWduKHt9LCByZWNvcmREYXRhLCB7XG4gICAgICAgIGlkOiBcIjQyNjY5MDYzMzRcIixcbiAgICAgICAgaW1hZ2VzOiBbXCJtaXNzaW5nLmpwZ1wiXSxcbiAgICB9KTtcblxuICAgIFJlY29yZC5mcm9tRGF0YShuZXdEYXRhLCByZXEsIChlcnIsIHZhbHVlLCB3YXJuaW5ncykgPT4ge1xuICAgICAgICB0LmVxdWFsKGVyci5tZXNzYWdlLCBcIk5vIGltYWdlcyBmb3VuZC5cIiwgXCJObyBpbWFnZXMgZm91bmQuXCIpO1xuICAgICAgICB0LmVxdWFsKHZhbHVlLCB1bmRlZmluZWQsIFwiTm8gcmVjb3JkIHNob3VsZCBiZSByZXR1cm5lZC5cIik7XG4gICAgICAgIHQuZXF1YWwod2FybmluZ3MsIHVuZGVmaW5lZCwgXCJUaGVyZSBzaG91bGQgYmUgbm8gd2FybmluZ3MuXCIpO1xuICAgICAgICB0LmVuZCgpO1xuICAgIH0pO1xufSk7XG5cbnRhcC50ZXN0KFwiUmVjb3JkLmZyb21EYXRhOiBOZXcgcmVjb3JkIG1pc3Npbmcgc2luZ2xlIGltYWdlXCIsICh0KSA9PiB7XG4gICAgY29uc3QgcmVjb3JkRGF0YSA9IGluaXQuZ2V0UmVjb3JkRGF0YSgpO1xuICAgIGNvbnN0IG5ld0RhdGEgPSBPYmplY3QuYXNzaWduKHt9LCByZWNvcmREYXRhLCB7XG4gICAgICAgIGlkOiBcIjQyNjY5MDYzMzRcIixcbiAgICAgICAgaW1hZ2VzOiBbXCJtaXNzaW5nLmpwZ1wiLCBcImZvby5qcGdcIl0sXG4gICAgfSk7XG5cbiAgICBSZWNvcmQuZnJvbURhdGEobmV3RGF0YSwgcmVxLCAoZXJyLCB2YWx1ZSwgd2FybmluZ3MpID0+IHtcbiAgICAgICAgdC5lcnJvcihlcnIsIFwiRXJyb3Igc2hvdWxkIGJlIGVtcHR5LlwiKTtcbiAgICAgICAgdC5lcXVhbCh2YWx1ZS5faWQsIFwidGVzdC80MjY2OTA2MzM0XCIsXG4gICAgICAgICAgICBcIk5ldyByZWNvcmQgc2hvdWxkIGJlIHJldHVybmVkLlwiKTtcbiAgICAgICAgdC5lcXVhbCh2YWx1ZS5kZWZhdWx0SW1hZ2VIYXNoLCBcIjQyNjY5MDYzMzRcIixcbiAgICAgICAgICAgIFwiZGVmYXVsdEltYWdlSGFzaCBpcyBzZXQuXCIpO1xuICAgICAgICB0LmVxdWFsKHZhbHVlLmltYWdlcy5sZW5ndGgsIDEsIFwiSW1hZ2VzIGFyZSBzZXQuXCIpO1xuICAgICAgICB0LmVxdWFsKHZhbHVlLmltYWdlc1swXSwgXCJ0ZXN0L2Zvby5qcGdcIiwgXCJJbWFnZXMgYXJlIHNldC5cIik7XG4gICAgICAgIHQuc2FtZSh3YXJuaW5ncywgW1wiSW1hZ2UgZmlsZSBub3QgZm91bmQ6IG1pc3NpbmcuanBnXCJdLFxuICAgICAgICAgICAgXCJUaGVyZSBzaG91bGQgYmUgYSB3YXJuaW5nLlwiKTtcbiAgICAgICAgdC5lbmQoKTtcbiAgICB9KTtcbn0pO1xuXG50YXAudGVzdChcInVwZGF0ZVNpbWlsYXJpdHlcIiwgKHQpID0+IHtcbiAgICBjb25zdCByZWNvcmQgPSBpbml0LmdldFJlY29yZCgpO1xuICAgIHJlY29yZC51cGRhdGVTaW1pbGFyaXR5KChlcnIpID0+IHtcbiAgICAgICAgdC5lcnJvcihlcnIsIFwiRXJyb3Igc2hvdWxkIGJlIGVtcHR5LlwiKTtcbiAgICAgICAgdC5lcXVhbChyZWNvcmQuc2ltaWxhclJlY29yZHMubGVuZ3RoLCAxLFxuICAgICAgICAgICAgXCJDb3JyZWN0IG51bWJlciBvZiBtYXRjaGVzLlwiKTtcbiAgICAgICAgdC5zYW1lKHJlY29yZC5zaW1pbGFyUmVjb3Jkc1swXS50b0pTT04oKSwge1xuICAgICAgICAgICAgX2lkOiBcInRlc3QvMTIzNVwiLFxuICAgICAgICAgICAgcmVjb3JkOiBcInRlc3QvMTIzNVwiLFxuICAgICAgICAgICAgc2NvcmU6IDEwLFxuICAgICAgICAgICAgc291cmNlOiBcInRlc3RcIixcbiAgICAgICAgICAgIGltYWdlczogW1widGVzdC9iYXIuanBnXCJdLFxuICAgICAgICB9LCBcIkNoZWNrIHNpbWlsYXIgcmVjb3JkIHJlc3VsdFwiKTtcbiAgICAgICAgdC5lbmQoKTtcbiAgICB9KTtcbn0pO1xuXG50YXAudGVzdChcInVwZGF0ZVNpbWlsYXJpdHkgd2l0aCB0d28gbWF0Y2hlc1wiLCAodCkgPT4ge1xuICAgIGNvbnN0IHJlY29yZHMgPSBpbml0LmdldFJlY29yZHMoKTtcbiAgICBjb25zdCByZWNvcmQgPSByZWNvcmRzW1widGVzdC8xMjM1XCJdO1xuICAgIHJlY29yZC51cGRhdGVTaW1pbGFyaXR5KChlcnIpID0+IHtcbiAgICAgICAgdC5lcnJvcihlcnIsIFwiRXJyb3Igc2hvdWxkIGJlIGVtcHR5LlwiKTtcbiAgICAgICAgdC5lcXVhbChyZWNvcmQuc2ltaWxhclJlY29yZHMubGVuZ3RoLCAyLFxuICAgICAgICAgICAgXCJDb3JyZWN0IG51bWJlciBvZiBtYXRjaGVzLlwiKTtcbiAgICAgICAgdC5zYW1lKHJlY29yZC5zaW1pbGFyUmVjb3Jkc1swXS50b0pTT04oKSwge1xuICAgICAgICAgICAgX2lkOiBcInRlc3QvMTIzNlwiLFxuICAgICAgICAgICAgcmVjb3JkOiBcInRlc3QvMTIzNlwiLFxuICAgICAgICAgICAgc2NvcmU6IDE3LFxuICAgICAgICAgICAgc291cmNlOiBcInRlc3RcIixcbiAgICAgICAgICAgIGltYWdlczogW1widGVzdC9uZXcxLmpwZ1wiLCBcInRlc3QvbmV3Mi5qcGdcIl0sXG4gICAgICAgIH0sIFwiQ2hlY2sgc2ltaWxhciByZWNvcmQgcmVzdWx0XCIpO1xuICAgICAgICB0LnNhbWUocmVjb3JkLnNpbWlsYXJSZWNvcmRzWzFdLnRvSlNPTigpLCB7XG4gICAgICAgICAgICBfaWQ6IFwidGVzdC8xMjM0XCIsXG4gICAgICAgICAgICByZWNvcmQ6IFwidGVzdC8xMjM0XCIsXG4gICAgICAgICAgICBzY29yZTogMTAsXG4gICAgICAgICAgICBzb3VyY2U6IFwidGVzdFwiLFxuICAgICAgICAgICAgaW1hZ2VzOiBbXCJ0ZXN0L2Zvby5qcGdcIl0sXG4gICAgICAgIH0sIFwiQ2hlY2sgc2ltaWxhciByZWNvcmQgcmVzdWx0XCIpO1xuICAgICAgICB0LmVuZCgpO1xuICAgIH0pO1xufSk7XG5cbnRhcC50ZXN0KFwidXBkYXRlU2ltaWxhcml0eSB3aXRoIG5vIHNpbWlsYXJcIiwgKHQpID0+IHtcbiAgICBjb25zdCByZWNvcmRzID0gaW5pdC5nZXRSZWNvcmRzKCk7XG4gICAgY29uc3QgcmVjb3JkID0gcmVjb3Jkc1tcInRlc3QvMTIzN1wiXTtcbiAgICByZWNvcmQudXBkYXRlU2ltaWxhcml0eSgoZXJyKSA9PiB7XG4gICAgICAgIHQuZXJyb3IoZXJyLCBcIkVycm9yIHNob3VsZCBiZSBlbXB0eS5cIik7XG4gICAgICAgIHQuZXF1YWwocmVjb3JkLnNpbWlsYXJSZWNvcmRzLmxlbmd0aCwgMCxcbiAgICAgICAgICAgIFwiQ29ycmVjdCBudW1iZXIgb2YgbWF0Y2hlcy5cIik7XG4gICAgICAgIHQuZW5kKCk7XG4gICAgfSk7XG59KTtcblxudGFwLnRlc3QoXCJSZWNvcmQubGludERhdGE6IFVua25vd24gRmllbGRzXCIsIHthdXRvZW5kOiB0cnVlfSwgKHQpID0+IHtcbiAgICB0LnNhbWUoUmVjb3JkLmxpbnREYXRhKHtcbiAgICAgICAgYmF0Y2g6IFwidGVzdFwiLFxuICAgIH0sIHJlcSksIHtcbiAgICAgICAgXCJlcnJvclwiOiBcIlJlcXVpcmVkIGZpZWxkIGBpZGAgaXMgZW1wdHkuXCIsXG4gICAgICAgIFwid2FybmluZ3NcIjogW1xuICAgICAgICAgICAgXCJVbnJlY29nbml6ZWQgZmllbGQgYGJhdGNoYC5cIixcbiAgICAgICAgXSxcbiAgICB9LCBcIktub3duIGZpZWxkXCIpO1xuXG4gICAgdC5zYW1lKFJlY29yZC5saW50RGF0YSh7XG4gICAgICAgIHJhbmRvbTogXCJ0ZXN0XCIsXG4gICAgfSwgcmVxKSwge1xuICAgICAgICBcImVycm9yXCI6IFwiUmVxdWlyZWQgZmllbGQgYGlkYCBpcyBlbXB0eS5cIixcbiAgICAgICAgXCJ3YXJuaW5nc1wiOiBbXG4gICAgICAgICAgICBcIlVucmVjb2duaXplZCBmaWVsZCBgcmFuZG9tYC5cIixcbiAgICAgICAgXSxcbiAgICB9LCBcIlVua25vd24gZmllbGRcIik7XG59KTtcblxudGFwLnRlc3QoXCJSZWNvcmQubGludERhdGE6IFJlcXVpcmVkIEZpZWxkc1wiLCB7YXV0b2VuZDogdHJ1ZX0sICh0KSA9PiB7XG4gICAgdC5zYW1lKFJlY29yZC5saW50RGF0YSh7fSwgcmVxKSwge1xuICAgICAgICBcImVycm9yXCI6IFwiUmVxdWlyZWQgZmllbGQgYGlkYCBpcyBlbXB0eS5cIixcbiAgICAgICAgXCJ3YXJuaW5nc1wiOiBbXSxcbiAgICB9LCBcIklEXCIpO1xuXG4gICAgdC5zYW1lKFJlY29yZC5saW50RGF0YSh7XG4gICAgICAgIGlkOiBcIlwiLFxuICAgIH0sIHJlcSksIHtcbiAgICAgICAgXCJlcnJvclwiOiBcIlJlcXVpcmVkIGZpZWxkIGBpZGAgaXMgZW1wdHkuXCIsXG4gICAgICAgIFwid2FybmluZ3NcIjogW10sXG4gICAgfSwgXCJJRCBFbXB0eSBTdHJpbmdcIik7XG5cbiAgICB0LnNhbWUoUmVjb3JkLmxpbnREYXRhKHtcbiAgICAgICAgaWQ6IFwiMTIzNFwiLFxuICAgIH0sIHJlcSksIHtcbiAgICAgICAgXCJlcnJvclwiOiBcIlJlcXVpcmVkIGZpZWxkIGB0eXBlYCBpcyBlbXB0eS5cIixcbiAgICAgICAgXCJ3YXJuaW5nc1wiOiBbXSxcbiAgICB9LCBcIlR5cGVcIik7XG5cbiAgICB0LnNhbWUoUmVjb3JkLmxpbnREYXRhKHtcbiAgICAgICAgaWQ6IFwiMTIzNFwiLFxuICAgICAgICB0eXBlOiBcIlwiLFxuICAgIH0sIHJlcSksIHtcbiAgICAgICAgXCJlcnJvclwiOiBcIlJlcXVpcmVkIGZpZWxkIGB0eXBlYCBpcyBlbXB0eS5cIixcbiAgICAgICAgXCJ3YXJuaW5nc1wiOiBbXSxcbiAgICB9LCBcIlR5cGUgRW1wdHkgU3RyaW5nXCIpO1xuXG4gICAgdC5zYW1lKFJlY29yZC5saW50RGF0YSh7XG4gICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgIH0sIHJlcSksIHtcbiAgICAgICAgXCJlcnJvclwiOiBcIlJlcXVpcmVkIGZpZWxkIGBzb3VyY2VgIGlzIGVtcHR5LlwiLFxuICAgICAgICBcIndhcm5pbmdzXCI6IFtdLFxuICAgIH0sIFwiU291cmNlXCIpO1xuXG4gICAgdC5zYW1lKFJlY29yZC5saW50RGF0YSh7XG4gICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICBzb3VyY2U6IFwiXCIsXG4gICAgfSwgcmVxKSwge1xuICAgICAgICBcImVycm9yXCI6IFwiUmVxdWlyZWQgZmllbGQgYHNvdXJjZWAgaXMgZW1wdHkuXCIsXG4gICAgICAgIFwid2FybmluZ3NcIjogW10sXG4gICAgfSwgXCJTb3VyY2UgRW1wdHkgU3RyaW5nXCIpO1xuXG4gICAgdC5zYW1lKFJlY29yZC5saW50RGF0YSh7XG4gICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICBzb3VyY2U6IFwibmdhXCIsXG4gICAgfSwgcmVxKSwge1xuICAgICAgICBcImVycm9yXCI6IFwiUmVxdWlyZWQgZmllbGQgYGxhbmdgIGlzIGVtcHR5LlwiLFxuICAgICAgICBcIndhcm5pbmdzXCI6IFtdLFxuICAgIH0sIFwiTGFuZ1wiKTtcblxuICAgIHQuc2FtZShSZWNvcmQubGludERhdGEoe1xuICAgICAgICBpZDogXCIxMjM0XCIsXG4gICAgICAgIHR5cGU6IFwiYXJ0d29ya3NcIixcbiAgICAgICAgc291cmNlOiBcIm5nYVwiLFxuICAgICAgICBsYW5nOiBcIlwiLFxuICAgIH0sIHJlcSksIHtcbiAgICAgICAgXCJlcnJvclwiOiBcIlJlcXVpcmVkIGZpZWxkIGBsYW5nYCBpcyBlbXB0eS5cIixcbiAgICAgICAgXCJ3YXJuaW5nc1wiOiBbXSxcbiAgICB9LCBcIkxhbmcgRW1wdHkgU3RyaW5nXCIpO1xuXG4gICAgdC5zYW1lKFJlY29yZC5saW50RGF0YSh7XG4gICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICBzb3VyY2U6IFwibmdhXCIsXG4gICAgICAgIGxhbmc6IFwiZW5cIixcbiAgICB9LCByZXEpLCB7XG4gICAgICAgIFwiZXJyb3JcIjogXCJSZXF1aXJlZCBmaWVsZCBgdXJsYCBpcyBlbXB0eS5cIixcbiAgICAgICAgXCJ3YXJuaW5nc1wiOiBbXSxcbiAgICB9LCBcIlVSTFwiKTtcblxuICAgIHQuc2FtZShSZWNvcmQubGludERhdGEoe1xuICAgICAgICBpZDogXCIxMjM0XCIsXG4gICAgICAgIHR5cGU6IFwiYXJ0d29ya3NcIixcbiAgICAgICAgc291cmNlOiBcIm5nYVwiLFxuICAgICAgICBsYW5nOiBcImVuXCIsXG4gICAgICAgIHVybDogXCJcIixcbiAgICB9LCByZXEpLCB7XG4gICAgICAgIFwiZXJyb3JcIjogXCJSZXF1aXJlZCBmaWVsZCBgdXJsYCBpcyBlbXB0eS5cIixcbiAgICAgICAgXCJ3YXJuaW5nc1wiOiBbXSxcbiAgICB9LCBcIlVSTCBFbXB0eSBTdHJpbmdcIik7XG5cbiAgICB0LnNhbWUoUmVjb3JkLmxpbnREYXRhKHtcbiAgICAgICAgaWQ6IFwiMTIzNFwiLFxuICAgICAgICB0eXBlOiBcImFydHdvcmtzXCIsXG4gICAgICAgIHNvdXJjZTogXCJuZ2FcIixcbiAgICAgICAgbGFuZzogXCJlblwiLFxuICAgICAgICB1cmw6IFwiaHR0cDovL2dvb2dsZS5jb20vXCIsXG4gICAgfSwgcmVxKSwge1xuICAgICAgICBcImVycm9yXCI6IFwiUmVxdWlyZWQgZmllbGQgYGltYWdlc2AgaXMgZW1wdHkuXCIsXG4gICAgICAgIFwid2FybmluZ3NcIjogW10sXG4gICAgfSwgXCJJbWFnZXNcIik7XG5cbiAgICB0LnNhbWUoUmVjb3JkLmxpbnREYXRhKHtcbiAgICAgICAgaWQ6IFwiMTIzNFwiLFxuICAgICAgICB0eXBlOiBcImFydHdvcmtzXCIsXG4gICAgICAgIHNvdXJjZTogXCJuZ2FcIixcbiAgICAgICAgbGFuZzogXCJlblwiLFxuICAgICAgICB1cmw6IFwiaHR0cDovL2dvb2dsZS5jb20vXCIsXG4gICAgICAgIGltYWdlczogW10sXG4gICAgfSwgcmVxKSwge1xuICAgICAgICBcImVycm9yXCI6IFwiUmVxdWlyZWQgZmllbGQgYGltYWdlc2AgaXMgZW1wdHkuXCIsXG4gICAgICAgIFwid2FybmluZ3NcIjogW10sXG4gICAgfSwgXCJJbWFnZXMgRW1wdHkgQXJyYXlcIik7XG59KTtcblxudGFwLnRlc3QoXCJSZWNvcmQubGludERhdGE6IFJlY29tbWVuZGVkIEZpZWxkc1wiLCB7YXV0b2VuZDogdHJ1ZX0sICh0KSA9PiB7XG4gICAgdC5zYW1lKFJlY29yZC5saW50RGF0YSh7XG4gICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICBzb3VyY2U6IFwibmdhXCIsXG4gICAgICAgIGxhbmc6IFwiZW5cIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9nb29nbGUuY29tL1wiLFxuICAgICAgICBpbWFnZXM6IFtcImZvby5qcGdcIl0sXG4gICAgfSwgcmVxKSwge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBpZDogXCIxMjM0XCIsXG4gICAgICAgICAgICB0eXBlOiBcImFydHdvcmtzXCIsXG4gICAgICAgICAgICBzb3VyY2U6IFwibmdhXCIsXG4gICAgICAgICAgICBsYW5nOiBcImVuXCIsXG4gICAgICAgICAgICB1cmw6IFwiaHR0cDovL2dvb2dsZS5jb20vXCIsXG4gICAgICAgICAgICBpbWFnZXM6IFtcIm5nYS9mb28uanBnXCJdLFxuICAgICAgICB9LFxuICAgICAgICBcIndhcm5pbmdzXCI6IFtcbiAgICAgICAgICAgIFwiUmVjb21tZW5kZWQgZmllbGQgYHRpdGxlYCBpcyBlbXB0eS5cIixcbiAgICAgICAgICAgIFwiUmVjb21tZW5kZWQgZmllbGQgYG9iamVjdFR5cGVgIGlzIGVtcHR5LlwiLFxuICAgICAgICBdLFxuICAgIH0sIFwiVGl0bGUgYW5kIG9iamVjdFR5cGUgcmVjb21tZW5kZWQuXCIpO1xuXG4gICAgdC5zYW1lKFJlY29yZC5saW50RGF0YSh7XG4gICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICBzb3VyY2U6IFwibmdhXCIsXG4gICAgICAgIGxhbmc6IFwiZW5cIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9nb29nbGUuY29tL1wiLFxuICAgICAgICBpbWFnZXM6IFtcImZvby5qcGdcIl0sXG4gICAgICAgIHRpdGxlOiBcIlwiLFxuICAgICAgICBvYmplY3RUeXBlOiBcIlwiLFxuICAgIH0sIHJlcSksIHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgaWQ6IFwiMTIzNFwiLFxuICAgICAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICAgICAgc291cmNlOiBcIm5nYVwiLFxuICAgICAgICAgICAgbGFuZzogXCJlblwiLFxuICAgICAgICAgICAgdXJsOiBcImh0dHA6Ly9nb29nbGUuY29tL1wiLFxuICAgICAgICAgICAgaW1hZ2VzOiBbXCJuZ2EvZm9vLmpwZ1wiXSxcbiAgICAgICAgfSxcbiAgICAgICAgXCJ3YXJuaW5nc1wiOiBbXG4gICAgICAgICAgICBcIlJlY29tbWVuZGVkIGZpZWxkIGB0aXRsZWAgaXMgZW1wdHkuXCIsXG4gICAgICAgICAgICBcIlJlY29tbWVuZGVkIGZpZWxkIGBvYmplY3RUeXBlYCBpcyBlbXB0eS5cIixcbiAgICAgICAgXSxcbiAgICB9LCBcIlRpdGxlIGFuZCBvYmplY3RUeXBlIHJlY29tbWVuZGVkLlwiKTtcblxuICAgIHQuc2FtZShSZWNvcmQubGludERhdGEoe1xuICAgICAgICBpZDogXCIxMjM0XCIsXG4gICAgICAgIHR5cGU6IFwiYXJ0d29ya3NcIixcbiAgICAgICAgc291cmNlOiBcIm5nYVwiLFxuICAgICAgICBsYW5nOiBcImVuXCIsXG4gICAgICAgIHVybDogXCJodHRwOi8vZ29vZ2xlLmNvbS9cIixcbiAgICAgICAgaW1hZ2VzOiBbXCJmb28uanBnXCJdLFxuICAgICAgICB0aXRsZTogXCJUZXN0XCIsXG4gICAgfSwgcmVxKSwge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBpZDogXCIxMjM0XCIsXG4gICAgICAgICAgICB0eXBlOiBcImFydHdvcmtzXCIsXG4gICAgICAgICAgICBzb3VyY2U6IFwibmdhXCIsXG4gICAgICAgICAgICBsYW5nOiBcImVuXCIsXG4gICAgICAgICAgICB1cmw6IFwiaHR0cDovL2dvb2dsZS5jb20vXCIsXG4gICAgICAgICAgICBpbWFnZXM6IFtcIm5nYS9mb28uanBnXCJdLFxuICAgICAgICAgICAgdGl0bGU6IFwiVGVzdFwiLFxuICAgICAgICB9LFxuICAgICAgICBcIndhcm5pbmdzXCI6IFtcbiAgICAgICAgICAgIFwiUmVjb21tZW5kZWQgZmllbGQgYG9iamVjdFR5cGVgIGlzIGVtcHR5LlwiLFxuICAgICAgICBdLFxuICAgIH0sIFwib2JqZWN0VHlwZSByZWNvbW1lbmRlZC5cIik7XG5cbiAgICB0LnNhbWUoUmVjb3JkLmxpbnREYXRhKHtcbiAgICAgICAgaWQ6IFwiMTIzNFwiLFxuICAgICAgICB0eXBlOiBcImFydHdvcmtzXCIsXG4gICAgICAgIHNvdXJjZTogXCJuZ2FcIixcbiAgICAgICAgbGFuZzogXCJlblwiLFxuICAgICAgICB1cmw6IFwiaHR0cDovL2dvb2dsZS5jb20vXCIsXG4gICAgICAgIGltYWdlczogW1wiZm9vLmpwZ1wiXSxcbiAgICAgICAgdGl0bGU6IFwiVGVzdFwiLFxuICAgICAgICBvYmplY3RUeXBlOiBcIlwiLFxuICAgIH0sIHJlcSksIHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgaWQ6IFwiMTIzNFwiLFxuICAgICAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICAgICAgc291cmNlOiBcIm5nYVwiLFxuICAgICAgICAgICAgbGFuZzogXCJlblwiLFxuICAgICAgICAgICAgdXJsOiBcImh0dHA6Ly9nb29nbGUuY29tL1wiLFxuICAgICAgICAgICAgaW1hZ2VzOiBbXCJuZ2EvZm9vLmpwZ1wiXSxcbiAgICAgICAgICAgIHRpdGxlOiBcIlRlc3RcIixcbiAgICAgICAgfSxcbiAgICAgICAgXCJ3YXJuaW5nc1wiOiBbXG4gICAgICAgICAgICBcIlJlY29tbWVuZGVkIGZpZWxkIGBvYmplY3RUeXBlYCBpcyBlbXB0eS5cIixcbiAgICAgICAgXSxcbiAgICB9LCBcIm9iamVjdFR5cGUgcmVjb21tZW5kZWQuXCIpO1xuXG4gICAgdC5zYW1lKFJlY29yZC5saW50RGF0YSh7XG4gICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICBzb3VyY2U6IFwibmdhXCIsXG4gICAgICAgIGxhbmc6IFwiZW5cIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9nb29nbGUuY29tL1wiLFxuICAgICAgICBpbWFnZXM6IFtcImZvby5qcGdcIl0sXG4gICAgICAgIHRpdGxlOiBcIlRlc3RcIixcbiAgICAgICAgb2JqZWN0VHlwZTogXCJwYWludGluZ1wiLFxuICAgIH0sIHJlcSksIHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgaWQ6IFwiMTIzNFwiLFxuICAgICAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICAgICAgc291cmNlOiBcIm5nYVwiLFxuICAgICAgICAgICAgbGFuZzogXCJlblwiLFxuICAgICAgICAgICAgdXJsOiBcImh0dHA6Ly9nb29nbGUuY29tL1wiLFxuICAgICAgICAgICAgaW1hZ2VzOiBbXCJuZ2EvZm9vLmpwZ1wiXSxcbiAgICAgICAgICAgIHRpdGxlOiBcIlRlc3RcIixcbiAgICAgICAgICAgIG9iamVjdFR5cGU6IFwicGFpbnRpbmdcIixcbiAgICAgICAgfSxcbiAgICAgICAgXCJ3YXJuaW5nc1wiOiBbXSxcbiAgICB9LCBcIk5vIHJlY29tbWVuZGVkLlwiKTtcbn0pO1xuXG50YXAudGVzdChcIlJlY29yZC5saW50RGF0YTogVHlwZSBjaGVja2luZ1wiLCB7YXV0b2VuZDogdHJ1ZX0sICh0KSA9PiB7XG4gICAgdC5zYW1lKFJlY29yZC5saW50RGF0YSh7XG4gICAgICAgIGlkOiAxMjM0LFxuICAgICAgICB0eXBlOiBcImFydHdvcmtzXCIsXG4gICAgICAgIHNvdXJjZTogXCJuZ2FcIixcbiAgICAgICAgbGFuZzogXCJlblwiLFxuICAgICAgICB1cmw6IFwiaHR0cDovL2dvb2dsZS5jb20vXCIsXG4gICAgICAgIGltYWdlczogW1wiZm9vLmpwZ1wiXSxcbiAgICAgICAgdGl0bGU6IFwiVGVzdFwiLFxuICAgICAgICBvYmplY3RUeXBlOiBcInBhaW50aW5nXCIsXG4gICAgfSwgcmVxKSwge1xuICAgICAgICBcImVycm9yXCI6IFwiUmVxdWlyZWQgZmllbGQgYGlkYCBpcyBlbXB0eS5cIixcbiAgICAgICAgXCJ3YXJuaW5nc1wiOiBbXG4gICAgICAgICAgICBcImBpZGAgaXMgdGhlIHdyb25nIHR5cGUuIEV4cGVjdGVkIGEgc3RyaW5nLlwiLFxuICAgICAgICBdLFxuICAgIH0sIFwiSURcIik7XG5cbiAgICB0LnNhbWUoUmVjb3JkLmxpbnREYXRhKHtcbiAgICAgICAgaWQ6IFwiMTIzNFwiLFxuICAgICAgICB0eXBlOiBcImFydHdvcmtzXCIsXG4gICAgICAgIHNvdXJjZTogMTIzNCxcbiAgICAgICAgbGFuZzogXCJlblwiLFxuICAgICAgICB1cmw6IFwiaHR0cDovL2dvb2dsZS5jb20vXCIsXG4gICAgICAgIGltYWdlczogW1wiZm9vLmpwZ1wiXSxcbiAgICAgICAgdGl0bGU6IFwiVGVzdFwiLFxuICAgICAgICBvYmplY3RUeXBlOiBcInBhaW50aW5nXCIsXG4gICAgfSwgcmVxKSwge1xuICAgICAgICBcImVycm9yXCI6IFwiUmVxdWlyZWQgZmllbGQgYHNvdXJjZWAgaXMgZW1wdHkuXCIsXG4gICAgICAgIFwid2FybmluZ3NcIjogW1xuICAgICAgICAgICAgXCJgc291cmNlYCBpcyB0aGUgd3JvbmcgdHlwZS4gRXhwZWN0ZWQgYSBzdHJpbmcuXCIsXG4gICAgICAgIF0sXG4gICAgfSwgXCJTb3VyY2VcIik7XG5cbiAgICB0LnNhbWUoUmVjb3JkLmxpbnREYXRhKHtcbiAgICAgICAgaWQ6IFwiMTIzNFwiLFxuICAgICAgICB0eXBlOiBcImFydHdvcmtzXCIsXG4gICAgICAgIHNvdXJjZTogXCJuZ2FcIixcbiAgICAgICAgbGFuZzogdHJ1ZSxcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9nb29nbGUuY29tL1wiLFxuICAgICAgICBpbWFnZXM6IFtcImZvby5qcGdcIl0sXG4gICAgICAgIHRpdGxlOiBcIlRlc3RcIixcbiAgICAgICAgb2JqZWN0VHlwZTogXCJwYWludGluZ1wiLFxuICAgIH0sIHJlcSksIHtcbiAgICAgICAgXCJlcnJvclwiOiBcIlJlcXVpcmVkIGZpZWxkIGBsYW5nYCBpcyBlbXB0eS5cIixcbiAgICAgICAgXCJ3YXJuaW5nc1wiOiBbXG4gICAgICAgICAgICBcImBsYW5nYCBpcyB0aGUgd3JvbmcgdHlwZS4gRXhwZWN0ZWQgYSBzdHJpbmcuXCIsXG4gICAgICAgIF0sXG4gICAgfSwgXCJMYW5nXCIpO1xuXG4gICAgdC5zYW1lKFJlY29yZC5saW50RGF0YSh7XG4gICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICBzb3VyY2U6IFwibmdhXCIsXG4gICAgICAgIGxhbmc6IFwiZW5cIixcbiAgICAgICAgdXJsOiB7fSxcbiAgICAgICAgaW1hZ2VzOiBbXCJmb28uanBnXCJdLFxuICAgICAgICB0aXRsZTogXCJUZXN0XCIsXG4gICAgICAgIG9iamVjdFR5cGU6IFwicGFpbnRpbmdcIixcbiAgICB9LCByZXEpLCB7XG4gICAgICAgIFwiZXJyb3JcIjogXCJSZXF1aXJlZCBmaWVsZCBgdXJsYCBpcyBlbXB0eS5cIixcbiAgICAgICAgXCJ3YXJuaW5nc1wiOiBbXG4gICAgICAgICAgICBcImB1cmxgIGlzIHRoZSB3cm9uZyB0eXBlLiBFeHBlY3RlZCBhIHN0cmluZy5cIixcbiAgICAgICAgXSxcbiAgICB9LCBcIlVSTFwiKTtcblxuICAgIHQuc2FtZShSZWNvcmQubGludERhdGEoe1xuICAgICAgICBpZDogXCIxMjM0XCIsXG4gICAgICAgIHR5cGU6IFwiYXJ0d29ya3NcIixcbiAgICAgICAgc291cmNlOiBcIm5nYVwiLFxuICAgICAgICBsYW5nOiBcImVuXCIsXG4gICAgICAgIHVybDogXCJodHRwOi8vZ29vZ2xlLmNvbS9cIixcbiAgICAgICAgaW1hZ2VzOiB7fSxcbiAgICAgICAgdGl0bGU6IFwiVGVzdFwiLFxuICAgICAgICBvYmplY3RUeXBlOiBcInBhaW50aW5nXCIsXG4gICAgfSwgcmVxKSwge1xuICAgICAgICBcImVycm9yXCI6IFwiUmVxdWlyZWQgZmllbGQgYGltYWdlc2AgaXMgZW1wdHkuXCIsXG4gICAgICAgIFwid2FybmluZ3NcIjogW1xuICAgICAgICAgICAgXCJJbWFnZXMgbXVzdCBiZSBhIHZhbGlkIGltYWdlIGZpbGUgbmFtZS4gRm9yIGV4YW1wbGU6IGBpbWFnZS5qcGdgLlwiLFxuICAgICAgICBdLFxuICAgIH0sIFwiSW1hZ2VzXCIpO1xuXG4gICAgdC5zYW1lKFJlY29yZC5saW50RGF0YSh7XG4gICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICBzb3VyY2U6IFwibmdhXCIsXG4gICAgICAgIGxhbmc6IFwiZW5cIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9nb29nbGUuY29tL1wiLFxuICAgICAgICBpbWFnZXM6IFtcImZvby5qcGdcIl0sXG4gICAgICAgIHRpdGxlOiBcIlRlc3RcIixcbiAgICAgICAgb2JqZWN0VHlwZTogXCJwYWludGluZ1wiLFxuICAgICAgICBkYXRlczogW1xuICAgICAgICAgICAge3N0YXJ0OiBcIjEyMzRcIiwgZW5kOiAxOTc2fSxcbiAgICAgICAgXSxcbiAgICB9LCByZXEpLCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgICAgIHR5cGU6IFwiYXJ0d29ya3NcIixcbiAgICAgICAgICAgIHNvdXJjZTogXCJuZ2FcIixcbiAgICAgICAgICAgIGxhbmc6IFwiZW5cIixcbiAgICAgICAgICAgIHVybDogXCJodHRwOi8vZ29vZ2xlLmNvbS9cIixcbiAgICAgICAgICAgIGltYWdlczogW1wibmdhL2Zvby5qcGdcIl0sXG4gICAgICAgICAgICB0aXRsZTogXCJUZXN0XCIsXG4gICAgICAgICAgICBvYmplY3RUeXBlOiBcInBhaW50aW5nXCIsXG4gICAgICAgICAgICBkYXRlczogW1xuICAgICAgICAgICAgICAgIHtzdGFydDogMTIzNCwgZW5kOiAxOTc2fSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIFwid2FybmluZ3NcIjogW10sXG4gICAgfSwgXCJEYXRlIFN0YXJ0XCIpO1xuXG4gICAgdC5zYW1lKFJlY29yZC5saW50RGF0YSh7XG4gICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICBzb3VyY2U6IFwibmdhXCIsXG4gICAgICAgIGxhbmc6IFwiZW5cIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9nb29nbGUuY29tL1wiLFxuICAgICAgICBpbWFnZXM6IFtcImZvby5qcGdcIl0sXG4gICAgICAgIHRpdGxlOiBcIlRlc3RcIixcbiAgICAgICAgb2JqZWN0VHlwZTogXCJwYWludGluZ1wiLFxuICAgICAgICBkYXRlczogW1xuICAgICAgICAgICAge3N0YXJ0OiAxMjM0LCBlbmQ6IDE5NzYsIGNpcmNhOiBcImZvb1wifSxcbiAgICAgICAgXSxcbiAgICB9LCByZXEpLCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgICAgIHR5cGU6IFwiYXJ0d29ya3NcIixcbiAgICAgICAgICAgIHNvdXJjZTogXCJuZ2FcIixcbiAgICAgICAgICAgIGxhbmc6IFwiZW5cIixcbiAgICAgICAgICAgIHVybDogXCJodHRwOi8vZ29vZ2xlLmNvbS9cIixcbiAgICAgICAgICAgIGltYWdlczogW1wibmdhL2Zvby5qcGdcIl0sXG4gICAgICAgICAgICB0aXRsZTogXCJUZXN0XCIsXG4gICAgICAgICAgICBvYmplY3RUeXBlOiBcInBhaW50aW5nXCIsXG4gICAgICAgICAgICBkYXRlczogW1xuICAgICAgICAgICAgICAgIHtzdGFydDogMTIzNCwgZW5kOiAxOTc2fSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIFwid2FybmluZ3NcIjogW1xuICAgICAgICAgICAgXCJgZGF0ZXNgOiBgY2lyY2FgIGlzIHRoZSB3cm9uZyB0eXBlLiBFeHBlY3RlZCBhIGJvb2xlYW4uXCIsXG4gICAgICAgIF0sXG4gICAgfSwgXCJEYXRlIENpcmNhXCIpO1xuXG4gICAgdC5zYW1lKFJlY29yZC5saW50RGF0YSh7XG4gICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICBzb3VyY2U6IFwibmdhXCIsXG4gICAgICAgIGxhbmc6IFwiZW5cIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9nb29nbGUuY29tL1wiLFxuICAgICAgICBpbWFnZXM6IFtcImZvby5qcGdcIl0sXG4gICAgICAgIHRpdGxlOiBcIlRlc3RcIixcbiAgICAgICAgb2JqZWN0VHlwZTogXCJwYWludGluZ1wiLFxuICAgICAgICBjYXRlZ29yaWVzOiB7fSxcbiAgICB9LCByZXEpLCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgICAgIHR5cGU6IFwiYXJ0d29ya3NcIixcbiAgICAgICAgICAgIHNvdXJjZTogXCJuZ2FcIixcbiAgICAgICAgICAgIGxhbmc6IFwiZW5cIixcbiAgICAgICAgICAgIHVybDogXCJodHRwOi8vZ29vZ2xlLmNvbS9cIixcbiAgICAgICAgICAgIGltYWdlczogW1wibmdhL2Zvby5qcGdcIl0sXG4gICAgICAgICAgICB0aXRsZTogXCJUZXN0XCIsXG4gICAgICAgICAgICBvYmplY3RUeXBlOiBcInBhaW50aW5nXCIsXG4gICAgICAgIH0sXG4gICAgICAgIFwid2FybmluZ3NcIjogW1xuICAgICAgICAgICAgXCJgY2F0ZWdvcmllc2AgdmFsdWUgaXMgdGhlIHdyb25nIHR5cGUuIEV4cGVjdGVkIGEgc3RyaW5nLlwiLFxuICAgICAgICBdLFxuICAgIH0sIFwiQ2F0ZWdvcmllc1wiKTtcblxuICAgIHQuc2FtZShSZWNvcmQubGludERhdGEoe1xuICAgICAgICBpZDogXCIxMjM0XCIsXG4gICAgICAgIHR5cGU6IFwiYXJ0d29ya3NcIixcbiAgICAgICAgc291cmNlOiBcIm5nYVwiLFxuICAgICAgICBsYW5nOiBcImVuXCIsXG4gICAgICAgIHVybDogXCJodHRwOi8vZ29vZ2xlLmNvbS9cIixcbiAgICAgICAgaW1hZ2VzOiBbXCJmb28uanBnXCJdLFxuICAgICAgICB0aXRsZTogXCJUZXN0XCIsXG4gICAgICAgIG9iamVjdFR5cGU6IFwicGFpbnRpbmdcIixcbiAgICAgICAgY2F0ZWdvcmllczogW3RydWVdLFxuICAgIH0sIHJlcSksIHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgaWQ6IFwiMTIzNFwiLFxuICAgICAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICAgICAgc291cmNlOiBcIm5nYVwiLFxuICAgICAgICAgICAgbGFuZzogXCJlblwiLFxuICAgICAgICAgICAgdXJsOiBcImh0dHA6Ly9nb29nbGUuY29tL1wiLFxuICAgICAgICAgICAgaW1hZ2VzOiBbXCJuZ2EvZm9vLmpwZ1wiXSxcbiAgICAgICAgICAgIHRpdGxlOiBcIlRlc3RcIixcbiAgICAgICAgICAgIG9iamVjdFR5cGU6IFwicGFpbnRpbmdcIixcbiAgICAgICAgfSxcbiAgICAgICAgXCJ3YXJuaW5nc1wiOiBbXG4gICAgICAgICAgICBcImBjYXRlZ29yaWVzYCB2YWx1ZSBpcyB0aGUgd3JvbmcgdHlwZS4gRXhwZWN0ZWQgYSBzdHJpbmcuXCIsXG4gICAgICAgIF0sXG4gICAgfSwgXCJDYXRlZ29yaWVzIFZhbHVlc1wiKTtcbn0pO1xuXG50YXAudGVzdChcIlJlY29yZC5saW50RGF0YTogVmFsaWRhdGlvblwiLCB7YXV0b2VuZDogdHJ1ZX0sICh0KSA9PiB7XG4gICAgdC5zYW1lKFJlY29yZC5saW50RGF0YSh7XG4gICAgICAgIGlkOiBcIjEyMzQvNDU2XCIsXG4gICAgICAgIHR5cGU6IFwiYXJ0d29ya3NcIixcbiAgICAgICAgc291cmNlOiBcIm5nYVwiLFxuICAgICAgICBsYW5nOiBcImVuXCIsXG4gICAgICAgIHVybDogXCJodHRwOi8vZ29vZ2xlLmNvbS9cIixcbiAgICAgICAgaW1hZ2VzOiBbXCJmb28uanBnXCJdLFxuICAgICAgICB0aXRsZTogXCJUZXN0XCIsXG4gICAgICAgIG9iamVjdFR5cGU6IFwicGFpbnRpbmdcIixcbiAgICB9LCByZXEpLCB7XG4gICAgICAgIFwiZXJyb3JcIjogXCJSZXF1aXJlZCBmaWVsZCBgaWRgIGlzIGVtcHR5LlwiLFxuICAgICAgICBcIndhcm5pbmdzXCI6IFtcbiAgICAgICAgICAgIFwiSURzIGNhbiBvbmx5IGNvbnRhaW4gbGV0dGVycywgbnVtYmVycywgdW5kZXJzY29yZXMsIGFuZCBoeXBoZW5zLlwiLFxuICAgICAgICBdLFxuICAgIH0sIFwiSURcIik7XG5cbiAgICB0LnNhbWUoUmVjb3JkLmxpbnREYXRhKHtcbiAgICAgICAgaWQ6IFwiMTIzNFwiLFxuICAgICAgICB0eXBlOiBcImFydHdvcmtzXCIsXG4gICAgICAgIHNvdXJjZTogXCJuZ2FcIixcbiAgICAgICAgbGFuZzogXCJcIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9nb29nbGUuY29tL1wiLFxuICAgICAgICBpbWFnZXM6IFtcImZvby5qcGdcIl0sXG4gICAgICAgIHRpdGxlOiBcIlRlc3RcIixcbiAgICAgICAgb2JqZWN0VHlwZTogXCJwYWludGluZ1wiLFxuICAgIH0sIHJlcSksIHtcbiAgICAgICAgXCJlcnJvclwiOiBcIlJlcXVpcmVkIGZpZWxkIGBsYW5nYCBpcyBlbXB0eS5cIixcbiAgICAgICAgXCJ3YXJuaW5nc1wiOiBbXSxcbiAgICB9LCBcIkxhbmdcIik7XG5cbiAgICB0LnNhbWUoUmVjb3JkLmxpbnREYXRhKHtcbiAgICAgICAgaWQ6IFwiMTIzNFwiLFxuICAgICAgICB0eXBlOiBcImFydHdvcmtzXCIsXG4gICAgICAgIHNvdXJjZTogXCJuZ2FcIixcbiAgICAgICAgbGFuZzogXCJlblwiLFxuICAgICAgICB1cmw6IFwiaHR0cC8vZ29vZ2xlLmNvbVwiLFxuICAgICAgICBpbWFnZXM6IFtcImZvby5qcGdcIl0sXG4gICAgICAgIHRpdGxlOiBcIlRlc3RcIixcbiAgICAgICAgb2JqZWN0VHlwZTogXCJwYWludGluZ1wiLFxuICAgIH0sIHJlcSksIHtcbiAgICAgICAgXCJlcnJvclwiOiBcIlJlcXVpcmVkIGZpZWxkIGB1cmxgIGlzIGVtcHR5LlwiLFxuICAgICAgICBcIndhcm5pbmdzXCI6IFtcbiAgICAgICAgICAgIFwiYHVybGAgbXVzdCBiZSBwcm9wZXJseS1mb3JtYXR0ZWQgVVJMLlwiLFxuICAgICAgICBdLFxuICAgIH0sIFwiVVJMXCIpO1xuXG4gICAgdC5zYW1lKFJlY29yZC5saW50RGF0YSh7XG4gICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICBzb3VyY2U6IFwibmdhXCIsXG4gICAgICAgIGxhbmc6IFwiZW5cIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9nb29nbGUuY29tXCIsXG4gICAgICAgIGltYWdlczogW1wiZm9vanBnXCJdLFxuICAgICAgICB0aXRsZTogXCJUZXN0XCIsXG4gICAgICAgIG9iamVjdFR5cGU6IFwicGFpbnRpbmdcIixcbiAgICB9LCByZXEpLCB7XG4gICAgICAgIFwiZXJyb3JcIjogXCJSZXF1aXJlZCBmaWVsZCBgaW1hZ2VzYCBpcyBlbXB0eS5cIixcbiAgICAgICAgXCJ3YXJuaW5nc1wiOiBbXG4gICAgICAgICAgICBcIkltYWdlcyBtdXN0IGJlIGEgdmFsaWQgaW1hZ2UgZmlsZSBuYW1lLiBGb3IgZXhhbXBsZTogYGltYWdlLmpwZ2AuXCIsXG4gICAgICAgIF0sXG4gICAgfSwgXCJJbWFnZXNcIik7XG5cbiAgICB0LnNhbWUoUmVjb3JkLmxpbnREYXRhKHtcbiAgICAgICAgaWQ6IFwiMTIzNFwiLFxuICAgICAgICB0eXBlOiBcImFydHdvcmtzXCIsXG4gICAgICAgIHNvdXJjZTogXCJuZ2FcIixcbiAgICAgICAgbGFuZzogXCJlblwiLFxuICAgICAgICB1cmw6IFwiaHR0cDovL2dvb2dsZS5jb21cIixcbiAgICAgICAgaW1hZ2VzOiBbXCJmb28uanBnXCJdLFxuICAgICAgICB0aXRsZTogXCJUZXN0XCIsXG4gICAgICAgIG9iamVjdFR5cGU6IFwiZm9vXCIsXG4gICAgfSwgcmVxKSwge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBpZDogXCIxMjM0XCIsXG4gICAgICAgICAgICB0eXBlOiBcImFydHdvcmtzXCIsXG4gICAgICAgICAgICBzb3VyY2U6IFwibmdhXCIsXG4gICAgICAgICAgICBsYW5nOiBcImVuXCIsXG4gICAgICAgICAgICB1cmw6IFwiaHR0cDovL2dvb2dsZS5jb21cIixcbiAgICAgICAgICAgIGltYWdlczogW1wibmdhL2Zvby5qcGdcIl0sXG4gICAgICAgICAgICB0aXRsZTogXCJUZXN0XCIsXG4gICAgICAgIH0sXG4gICAgICAgIFwid2FybmluZ3NcIjogW1xuICAgICAgICAgICAgXCJgb2JqZWN0VHlwZWAgbXVzdCBiZSBvbmUgb2YgdGhlIGZvbGxvd2luZyB0eXBlczogYXJjaGl0ZWN0dXJlLCBcIiArXG4gICAgICAgICAgICAgICAgXCJkZWNvcmF0aXZlIGFydHMsIGRyYXdpbmcsIGZyZXNjbywgbWVkYWwsIG1pbmlhdHVyZSwgbW9zYWljLCBcIiArXG4gICAgICAgICAgICAgICAgXCJwYWludGluZywgcGhvdG8sIHByaW50LCBzY3VscHR1cmUsIHN0YWluZWQgZ2xhc3MuXCIsXG4gICAgICAgICAgICBcIlJlY29tbWVuZGVkIGZpZWxkIGBvYmplY3RUeXBlYCBpcyBlbXB0eS5cIixcbiAgICAgICAgXSxcbiAgICB9LCBcIm9iamVjdFR5cGVcIik7XG5cbiAgICB0LnNhbWUoUmVjb3JkLmxpbnREYXRhKHtcbiAgICAgICAgaWQ6IFwiMTIzNFwiLFxuICAgICAgICB0eXBlOiBcImFydHdvcmtzXCIsXG4gICAgICAgIHNvdXJjZTogXCJuZ2FcIixcbiAgICAgICAgbGFuZzogXCJlblwiLFxuICAgICAgICB1cmw6IFwiaHR0cDovL2dvb2dsZS5jb21cIixcbiAgICAgICAgaW1hZ2VzOiBbXCJmb28uanBnXCJdLFxuICAgICAgICB0aXRsZTogXCJUZXN0XCIsXG4gICAgICAgIG9iamVjdFR5cGU6IFwicGFpbnRpbmdcIixcbiAgICAgICAgYXJ0aXN0czogW3twc2V1ZG9ueW06IFwiVGVzdFwifV0sXG4gICAgfSwgcmVxKSwge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBpZDogXCIxMjM0XCIsXG4gICAgICAgICAgICB0eXBlOiBcImFydHdvcmtzXCIsXG4gICAgICAgICAgICBzb3VyY2U6IFwibmdhXCIsXG4gICAgICAgICAgICBsYW5nOiBcImVuXCIsXG4gICAgICAgICAgICB1cmw6IFwiaHR0cDovL2dvb2dsZS5jb21cIixcbiAgICAgICAgICAgIGltYWdlczogW1wibmdhL2Zvby5qcGdcIl0sXG4gICAgICAgICAgICB0aXRsZTogXCJUZXN0XCIsXG4gICAgICAgICAgICBvYmplY3RUeXBlOiBcInBhaW50aW5nXCIsXG4gICAgICAgICAgICBhcnRpc3RzOiBbe3BzZXVkb255bTogXCJUZXN0XCJ9XSxcbiAgICAgICAgfSxcbiAgICAgICAgXCJ3YXJuaW5nc1wiOiBbXG4gICAgICAgICAgICBcImBhcnRpc3RzYDogUmVjb21tZW5kZWQgZmllbGQgYG5hbWVgIGlzIGVtcHR5LlwiLFxuICAgICAgICBdLFxuICAgIH0sIFwiYXJ0aXN0c1wiKTtcblxuICAgIHQuc2FtZShSZWNvcmQubGludERhdGEoe1xuICAgICAgICBpZDogXCIxMjM0XCIsXG4gICAgICAgIHR5cGU6IFwiYXJ0d29ya3NcIixcbiAgICAgICAgc291cmNlOiBcIm5nYVwiLFxuICAgICAgICBsYW5nOiBcImVuXCIsXG4gICAgICAgIHVybDogXCJodHRwOi8vZ29vZ2xlLmNvbVwiLFxuICAgICAgICBpbWFnZXM6IFtcImZvby5qcGdcIl0sXG4gICAgICAgIHRpdGxlOiBcIlRlc3RcIixcbiAgICAgICAgb2JqZWN0VHlwZTogXCJwYWludGluZ1wiLFxuICAgICAgICBhcnRpc3RzOiBbe25hbWU6IFwiVGVzdFwifV0sXG4gICAgICAgIGRpbWVuc2lvbnM6IFt7d2lkdGg6IDEyM31dLFxuICAgIH0sIHJlcSksIHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgaWQ6IFwiMTIzNFwiLFxuICAgICAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICAgICAgc291cmNlOiBcIm5nYVwiLFxuICAgICAgICAgICAgbGFuZzogXCJlblwiLFxuICAgICAgICAgICAgdXJsOiBcImh0dHA6Ly9nb29nbGUuY29tXCIsXG4gICAgICAgICAgICBpbWFnZXM6IFtcIm5nYS9mb28uanBnXCJdLFxuICAgICAgICAgICAgdGl0bGU6IFwiVGVzdFwiLFxuICAgICAgICAgICAgb2JqZWN0VHlwZTogXCJwYWludGluZ1wiLFxuICAgICAgICAgICAgYXJ0aXN0czogW3tuYW1lOiBcIlRlc3RcIn1dLFxuICAgICAgICB9LFxuICAgICAgICBcIndhcm5pbmdzXCI6IFtcbiAgICAgICAgICAgIFwiRGltZW5zaW9ucyBtdXN0IGhhdmUgYSB1bml0IHNwZWNpZmllZCBhbmQgYXQgbGVhc3QgYSB3aWR0aCBcIiArXG4gICAgICAgICAgICAgICAgXCJvciBoZWlnaHQuXCIsXG4gICAgICAgIF0sXG4gICAgfSwgXCJkaW1lbnNpb25zXCIpO1xuXG4gICAgdC5zYW1lKFJlY29yZC5saW50RGF0YSh7XG4gICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICBzb3VyY2U6IFwibmdhXCIsXG4gICAgICAgIGxhbmc6IFwiZW5cIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9nb29nbGUuY29tXCIsXG4gICAgICAgIGltYWdlczogW1wiZm9vLmpwZ1wiXSxcbiAgICAgICAgdGl0bGU6IFwiVGVzdFwiLFxuICAgICAgICBvYmplY3RUeXBlOiBcInBhaW50aW5nXCIsXG4gICAgICAgIGFydGlzdHM6IFt7bmFtZTogXCJUZXN0XCJ9XSxcbiAgICAgICAgZGltZW5zaW9uczogW3t1bml0OiBcIm1tXCJ9XSxcbiAgICB9LCByZXEpLCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgICAgIHR5cGU6IFwiYXJ0d29ya3NcIixcbiAgICAgICAgICAgIHNvdXJjZTogXCJuZ2FcIixcbiAgICAgICAgICAgIGxhbmc6IFwiZW5cIixcbiAgICAgICAgICAgIHVybDogXCJodHRwOi8vZ29vZ2xlLmNvbVwiLFxuICAgICAgICAgICAgaW1hZ2VzOiBbXCJuZ2EvZm9vLmpwZ1wiXSxcbiAgICAgICAgICAgIHRpdGxlOiBcIlRlc3RcIixcbiAgICAgICAgICAgIG9iamVjdFR5cGU6IFwicGFpbnRpbmdcIixcbiAgICAgICAgICAgIGFydGlzdHM6IFt7bmFtZTogXCJUZXN0XCJ9XSxcbiAgICAgICAgfSxcbiAgICAgICAgXCJ3YXJuaW5nc1wiOiBbXG4gICAgICAgICAgICBcIkRpbWVuc2lvbnMgbXVzdCBoYXZlIGEgdW5pdCBzcGVjaWZpZWQgYW5kIGF0IGxlYXN0IGEgd2lkdGggXCIgK1xuICAgICAgICAgICAgICAgIFwib3IgaGVpZ2h0LlwiLFxuICAgICAgICBdLFxuICAgIH0sIFwiZGltZW5zaW9uc1wiKTtcblxuICAgIHQuc2FtZShSZWNvcmQubGludERhdGEoe1xuICAgICAgICBpZDogXCIxMjM0XCIsXG4gICAgICAgIHR5cGU6IFwiYXJ0d29ya3NcIixcbiAgICAgICAgc291cmNlOiBcIm5nYVwiLFxuICAgICAgICBsYW5nOiBcImVuXCIsXG4gICAgICAgIHVybDogXCJodHRwOi8vZ29vZ2xlLmNvbVwiLFxuICAgICAgICBpbWFnZXM6IFtcImZvby5qcGdcIl0sXG4gICAgICAgIHRpdGxlOiBcIlRlc3RcIixcbiAgICAgICAgb2JqZWN0VHlwZTogXCJwYWludGluZ1wiLFxuICAgICAgICBhcnRpc3RzOiBbe25hbWU6IFwiVGVzdFwifV0sXG4gICAgICAgIGRpbWVuc2lvbnM6IFt7d2lkdGg6IDEyMywgdW5pdDogXCJtbVwifV0sXG4gICAgICAgIGRhdGVzOiBbe2NpcmNhOiB0cnVlfV0sXG4gICAgfSwgcmVxKSwge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBpZDogXCIxMjM0XCIsXG4gICAgICAgICAgICB0eXBlOiBcImFydHdvcmtzXCIsXG4gICAgICAgICAgICBzb3VyY2U6IFwibmdhXCIsXG4gICAgICAgICAgICBsYW5nOiBcImVuXCIsXG4gICAgICAgICAgICB1cmw6IFwiaHR0cDovL2dvb2dsZS5jb21cIixcbiAgICAgICAgICAgIGltYWdlczogW1wibmdhL2Zvby5qcGdcIl0sXG4gICAgICAgICAgICB0aXRsZTogXCJUZXN0XCIsXG4gICAgICAgICAgICBvYmplY3RUeXBlOiBcInBhaW50aW5nXCIsXG4gICAgICAgICAgICBhcnRpc3RzOiBbe25hbWU6IFwiVGVzdFwifV0sXG4gICAgICAgICAgICBkaW1lbnNpb25zOiBbe3dpZHRoOiAxMjMsIHVuaXQ6IFwibW1cIn1dLFxuICAgICAgICB9LFxuICAgICAgICBcIndhcm5pbmdzXCI6IFtcbiAgICAgICAgICAgIFwiRGF0ZXMgbXVzdCBoYXZlIGEgc3RhcnQgb3IgZW5kIHNwZWNpZmllZC5cIixcbiAgICAgICAgXSxcbiAgICB9LCBcImRhdGVzXCIpO1xuXG4gICAgdC5zYW1lKFJlY29yZC5saW50RGF0YSh7XG4gICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICBzb3VyY2U6IFwibmdhXCIsXG4gICAgICAgIGxhbmc6IFwiZW5cIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9nb29nbGUuY29tXCIsXG4gICAgICAgIGltYWdlczogW1wiZm9vLmpwZ1wiXSxcbiAgICAgICAgdGl0bGU6IFwiVGVzdFwiLFxuICAgICAgICBvYmplY3RUeXBlOiBcInBhaW50aW5nXCIsXG4gICAgICAgIGFydGlzdHM6IFt7XG4gICAgICAgICAgICBuYW1lOiBcIlRlc3RcIixcbiAgICAgICAgICAgIGRhdGVzOiBbe2NpcmNhOiB0cnVlfV0sXG4gICAgICAgIH1dLFxuICAgICAgICBkaW1lbnNpb25zOiBbe3dpZHRoOiAxMjMsIHVuaXQ6IFwibW1cIn1dLFxuICAgIH0sIHJlcSksIHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgaWQ6IFwiMTIzNFwiLFxuICAgICAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICAgICAgc291cmNlOiBcIm5nYVwiLFxuICAgICAgICAgICAgbGFuZzogXCJlblwiLFxuICAgICAgICAgICAgdXJsOiBcImh0dHA6Ly9nb29nbGUuY29tXCIsXG4gICAgICAgICAgICBpbWFnZXM6IFtcIm5nYS9mb28uanBnXCJdLFxuICAgICAgICAgICAgdGl0bGU6IFwiVGVzdFwiLFxuICAgICAgICAgICAgb2JqZWN0VHlwZTogXCJwYWludGluZ1wiLFxuICAgICAgICAgICAgYXJ0aXN0czogW3tuYW1lOiBcIlRlc3RcIn1dLFxuICAgICAgICAgICAgZGltZW5zaW9uczogW3t3aWR0aDogMTIzLCB1bml0OiBcIm1tXCJ9XSxcbiAgICAgICAgfSxcbiAgICAgICAgXCJ3YXJuaW5nc1wiOiBbXG4gICAgICAgICAgICBcImBhcnRpc3RzYDogRGF0ZXMgbXVzdCBoYXZlIGEgc3RhcnQgb3IgZW5kIHNwZWNpZmllZC5cIixcbiAgICAgICAgXSxcbiAgICB9LCBcImRhdGVzIGluIGFydGlzdHNcIik7XG5cbiAgICB0LnNhbWUoUmVjb3JkLmxpbnREYXRhKHtcbiAgICAgICAgaWQ6IFwiMTIzNFwiLFxuICAgICAgICB0eXBlOiBcImFydHdvcmtzXCIsXG4gICAgICAgIHNvdXJjZTogXCJuZ2FcIixcbiAgICAgICAgbGFuZzogXCJlblwiLFxuICAgICAgICB1cmw6IFwiaHR0cDovL2dvb2dsZS5jb21cIixcbiAgICAgICAgaW1hZ2VzOiBbXCJmb28uanBnXCJdLFxuICAgICAgICB0aXRsZTogXCJUZXN0XCIsXG4gICAgICAgIG9iamVjdFR5cGU6IFwicGFpbnRpbmdcIixcbiAgICAgICAgYXJ0aXN0czogW3tuYW1lOiBcIlRlc3RcIn1dLFxuICAgICAgICBkaW1lbnNpb25zOiBbe3dpZHRoOiAxMjMsIHVuaXQ6IFwibW1cIn1dLFxuICAgICAgICBkYXRlczogW3tzdGFydDogMTQ1NiwgZW5kOiAxNDU3LCBjaXJjYTogdHJ1ZX1dLFxuICAgICAgICBsb2NhdGlvbnM6IFt7Y291bnRyeTogXCJVbml0ZWQgU3RhdGVzXCJ9XSxcbiAgICB9LCByZXEpLCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgICAgIHR5cGU6IFwiYXJ0d29ya3NcIixcbiAgICAgICAgICAgIHNvdXJjZTogXCJuZ2FcIixcbiAgICAgICAgICAgIGxhbmc6IFwiZW5cIixcbiAgICAgICAgICAgIHVybDogXCJodHRwOi8vZ29vZ2xlLmNvbVwiLFxuICAgICAgICAgICAgaW1hZ2VzOiBbXCJuZ2EvZm9vLmpwZ1wiXSxcbiAgICAgICAgICAgIHRpdGxlOiBcIlRlc3RcIixcbiAgICAgICAgICAgIG9iamVjdFR5cGU6IFwicGFpbnRpbmdcIixcbiAgICAgICAgICAgIGFydGlzdHM6IFt7bmFtZTogXCJUZXN0XCJ9XSxcbiAgICAgICAgICAgIGRpbWVuc2lvbnM6IFt7d2lkdGg6IDEyMywgdW5pdDogXCJtbVwifV0sXG4gICAgICAgICAgICBkYXRlczogW3tzdGFydDogMTQ1NiwgZW5kOiAxNDU3LCBjaXJjYTogdHJ1ZX1dLFxuICAgICAgICB9LFxuICAgICAgICBcIndhcm5pbmdzXCI6IFtcbiAgICAgICAgICAgIFwiTG9jYXRpb25zIG11c3QgaGF2ZSBhIG5hbWUgb3IgY2l0eSBzcGVjaWZpZWQuXCIsXG4gICAgICAgIF0sXG4gICAgfSwgXCJsb2NhdGlvbnNcIik7XG5cbiAgICB0LnNhbWUoUmVjb3JkLmxpbnREYXRhKHtcbiAgICAgICAgaWQ6IFwiMTIzNFwiLFxuICAgICAgICB0eXBlOiBcImFydHdvcmtzXCIsXG4gICAgICAgIHNvdXJjZTogXCJuZ2FcIixcbiAgICAgICAgbGFuZzogXCJlblwiLFxuICAgICAgICB1cmw6IFwiaHR0cDovL2dvb2dsZS5jb21cIixcbiAgICAgICAgaW1hZ2VzOiBbXCJmb28uanBnXCJdLFxuICAgICAgICB0aXRsZTogXCJUZXN0XCIsXG4gICAgICAgIG9iamVjdFR5cGU6IFwicGFpbnRpbmdcIixcbiAgICAgICAgYXJ0aXN0czogW3tuYW1lOiBcIlRlc3RcIn1dLFxuICAgICAgICBkaW1lbnNpb25zOiBbe3dpZHRoOiAxMjMsIHVuaXQ6IFwibW1cIn1dLFxuICAgICAgICBkYXRlczogW3tzdGFydDogMTQ1NiwgZW5kOiAxNDU3LCBjaXJjYTogdHJ1ZX1dLFxuICAgICAgICBsb2NhdGlvbnM6IFt7Y2l0eTogXCJOZXcgWW9yayBDaXR5XCJ9XSxcbiAgICB9LCByZXEpLCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgICAgIHR5cGU6IFwiYXJ0d29ya3NcIixcbiAgICAgICAgICAgIHNvdXJjZTogXCJuZ2FcIixcbiAgICAgICAgICAgIGxhbmc6IFwiZW5cIixcbiAgICAgICAgICAgIHVybDogXCJodHRwOi8vZ29vZ2xlLmNvbVwiLFxuICAgICAgICAgICAgaW1hZ2VzOiBbXCJuZ2EvZm9vLmpwZ1wiXSxcbiAgICAgICAgICAgIHRpdGxlOiBcIlRlc3RcIixcbiAgICAgICAgICAgIG9iamVjdFR5cGU6IFwicGFpbnRpbmdcIixcbiAgICAgICAgICAgIGFydGlzdHM6IFt7bmFtZTogXCJUZXN0XCJ9XSxcbiAgICAgICAgICAgIGRpbWVuc2lvbnM6IFt7d2lkdGg6IDEyMywgdW5pdDogXCJtbVwifV0sXG4gICAgICAgICAgICBkYXRlczogW3tzdGFydDogMTQ1NiwgZW5kOiAxNDU3LCBjaXJjYTogdHJ1ZX1dLFxuICAgICAgICAgICAgbG9jYXRpb25zOiBbe2NpdHk6IFwiTmV3IFlvcmsgQ2l0eVwifV0sXG4gICAgICAgIH0sXG4gICAgICAgIFwid2FybmluZ3NcIjogW10sXG4gICAgfSwgXCJBbGwgcGFzc1wiKTtcbn0pO1xuXG50YXAudGVzdChcIlJlY29yZC5saW50RGF0YTogQ29udmVyc2lvblwiLCB7YXV0b2VuZDogdHJ1ZX0sICh0KSA9PiB7XG4gICAgdC5zYW1lKFJlY29yZC5saW50RGF0YSh7XG4gICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICBzb3VyY2U6IFwibmdhXCIsXG4gICAgICAgIGxhbmc6IFwiZW5cIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9nb29nbGUuY29tXCIsXG4gICAgICAgIGltYWdlczogW1wiZm9vLmpwZ1wiXSxcbiAgICAgICAgdGl0bGU6IFwiVGVzdFwiLFxuICAgICAgICBvYmplY3RUeXBlOiBcInBhaW50aW5nXCIsXG4gICAgICAgIGFydGlzdHM6IFtcIlRlc3RcIl0sXG4gICAgICAgIGRpbWVuc2lvbnM6IFt7d2lkdGg6IDEyMywgdW5pdDogXCJtbVwifV0sXG4gICAgICAgIGRhdGVzOiBbe3N0YXJ0OiAxNDU2LCBlbmQ6IDE0NTcsIGNpcmNhOiB0cnVlfV0sXG4gICAgICAgIGxvY2F0aW9uczogW3tjaXR5OiBcIk5ldyBZb3JrIENpdHlcIn1dLFxuICAgIH0sIHJlcSksIHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgaWQ6IFwiMTIzNFwiLFxuICAgICAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICAgICAgc291cmNlOiBcIm5nYVwiLFxuICAgICAgICAgICAgbGFuZzogXCJlblwiLFxuICAgICAgICAgICAgdXJsOiBcImh0dHA6Ly9nb29nbGUuY29tXCIsXG4gICAgICAgICAgICBpbWFnZXM6IFtcIm5nYS9mb28uanBnXCJdLFxuICAgICAgICAgICAgdGl0bGU6IFwiVGVzdFwiLFxuICAgICAgICAgICAgb2JqZWN0VHlwZTogXCJwYWludGluZ1wiLFxuICAgICAgICAgICAgYXJ0aXN0czogW3tuYW1lOiBcIlRlc3RcIn1dLFxuICAgICAgICAgICAgZGltZW5zaW9uczogW3t3aWR0aDogMTIzLCB1bml0OiBcIm1tXCJ9XSxcbiAgICAgICAgICAgIGRhdGVzOiBbe3N0YXJ0OiAxNDU2LCBlbmQ6IDE0NTcsIGNpcmNhOiB0cnVlfV0sXG4gICAgICAgICAgICBsb2NhdGlvbnM6IFt7Y2l0eTogXCJOZXcgWW9yayBDaXR5XCJ9XSxcbiAgICAgICAgfSxcbiAgICAgICAgXCJ3YXJuaW5nc1wiOiBbXSxcbiAgICB9LCBcIkFydGlzdHNcIik7XG5cbiAgICB0LnNhbWUoUmVjb3JkLmxpbnREYXRhKHtcbiAgICAgICAgaWQ6IFwiMTIzNFwiLFxuICAgICAgICB0eXBlOiBcImFydHdvcmtzXCIsXG4gICAgICAgIHNvdXJjZTogXCJuZ2FcIixcbiAgICAgICAgbGFuZzogXCJlblwiLFxuICAgICAgICB1cmw6IFwiaHR0cDovL2dvb2dsZS5jb21cIixcbiAgICAgICAgaW1hZ2VzOiBbXCJmb28uanBnXCJdLFxuICAgICAgICB0aXRsZTogXCJUZXN0XCIsXG4gICAgICAgIG9iamVjdFR5cGU6IFwicGFpbnRpbmdcIixcbiAgICAgICAgYXJ0aXN0czogW3tuYW1lOiBcIlRlc3RcIn1dLFxuICAgICAgICBkaW1lbnNpb25zOiBbXCIxMjMgeCAxMDAgY21cIl0sXG4gICAgICAgIGRhdGVzOiBbe3N0YXJ0OiAxNDU2LCBlbmQ6IDE0NTcsIGNpcmNhOiB0cnVlfV0sXG4gICAgICAgIGxvY2F0aW9uczogW3tjaXR5OiBcIk5ldyBZb3JrIENpdHlcIn1dLFxuICAgIH0sIHJlcSksIHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgaWQ6IFwiMTIzNFwiLFxuICAgICAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICAgICAgc291cmNlOiBcIm5nYVwiLFxuICAgICAgICAgICAgbGFuZzogXCJlblwiLFxuICAgICAgICAgICAgdXJsOiBcImh0dHA6Ly9nb29nbGUuY29tXCIsXG4gICAgICAgICAgICBpbWFnZXM6IFtcIm5nYS9mb28uanBnXCJdLFxuICAgICAgICAgICAgdGl0bGU6IFwiVGVzdFwiLFxuICAgICAgICAgICAgb2JqZWN0VHlwZTogXCJwYWludGluZ1wiLFxuICAgICAgICAgICAgYXJ0aXN0czogW3tuYW1lOiBcIlRlc3RcIn1dLFxuICAgICAgICAgICAgZGltZW5zaW9uczogW3tcbiAgICAgICAgICAgICAgICBcIm9yaWdpbmFsXCI6IFwiMTIzIHggMTAwIGNtXCIsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAxMjMwLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAwLFxuICAgICAgICAgICAgICAgIHVuaXQ6IFwibW1cIixcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgZGF0ZXM6IFt7c3RhcnQ6IDE0NTYsIGVuZDogMTQ1NywgY2lyY2E6IHRydWV9XSxcbiAgICAgICAgICAgIGxvY2F0aW9uczogW3tjaXR5OiBcIk5ldyBZb3JrIENpdHlcIn1dLFxuICAgICAgICB9LFxuICAgICAgICBcIndhcm5pbmdzXCI6IFtdLFxuICAgIH0sIFwiRGltZW5zaW9uc1wiKTtcblxuICAgIHQuc2FtZShSZWNvcmQubGludERhdGEoe1xuICAgICAgICBpZDogXCIxMjM0XCIsXG4gICAgICAgIHR5cGU6IFwiYXJ0d29ya3NcIixcbiAgICAgICAgc291cmNlOiBcIm5nYVwiLFxuICAgICAgICBsYW5nOiBcImVuXCIsXG4gICAgICAgIHVybDogXCJodHRwOi8vZ29vZ2xlLmNvbVwiLFxuICAgICAgICBpbWFnZXM6IFtcImZvby5qcGdcIl0sXG4gICAgICAgIHRpdGxlOiBcIlRlc3RcIixcbiAgICAgICAgb2JqZWN0VHlwZTogXCJwYWludGluZ1wiLFxuICAgICAgICBhcnRpc3RzOiBbe25hbWU6IFwiVGVzdFwifV0sXG4gICAgICAgIGRpbWVuc2lvbnM6IFtcIjEyM1wiXSxcbiAgICAgICAgZGF0ZXM6IFt7c3RhcnQ6IDE0NTYsIGVuZDogMTQ1NywgY2lyY2E6IHRydWV9XSxcbiAgICAgICAgbG9jYXRpb25zOiBbe2NpdHk6IFwiTmV3IFlvcmsgQ2l0eVwifV0sXG4gICAgfSwgcmVxKSwge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBpZDogXCIxMjM0XCIsXG4gICAgICAgICAgICB0eXBlOiBcImFydHdvcmtzXCIsXG4gICAgICAgICAgICBzb3VyY2U6IFwibmdhXCIsXG4gICAgICAgICAgICBsYW5nOiBcImVuXCIsXG4gICAgICAgICAgICB1cmw6IFwiaHR0cDovL2dvb2dsZS5jb21cIixcbiAgICAgICAgICAgIGltYWdlczogW1wibmdhL2Zvby5qcGdcIl0sXG4gICAgICAgICAgICB0aXRsZTogXCJUZXN0XCIsXG4gICAgICAgICAgICBvYmplY3RUeXBlOiBcInBhaW50aW5nXCIsXG4gICAgICAgICAgICBhcnRpc3RzOiBbe25hbWU6IFwiVGVzdFwifV0sXG4gICAgICAgICAgICBkYXRlczogW3tzdGFydDogMTQ1NiwgZW5kOiAxNDU3LCBjaXJjYTogdHJ1ZX1dLFxuICAgICAgICAgICAgbG9jYXRpb25zOiBbe2NpdHk6IFwiTmV3IFlvcmsgQ2l0eVwifV0sXG4gICAgICAgIH0sXG4gICAgICAgIFwid2FybmluZ3NcIjogW1xuICAgICAgICAgICAgXCJEaW1lbnNpb25zIG11c3QgaGF2ZSBhIHVuaXQgc3BlY2lmaWVkIGFuZCBhdCBsZWFzdCBhIHdpZHRoXCIgK1xuICAgICAgICAgICAgICAgIFwiIG9yIGhlaWdodC5cIixcbiAgICAgICAgXSxcbiAgICB9LCBcIkRpbWVuc2lvbnMgcHJvZHVjZSB3YXJuaW5nc1wiKTtcblxuICAgIHQuc2FtZShSZWNvcmQubGludERhdGEoe1xuICAgICAgICBpZDogXCIxMjM0XCIsXG4gICAgICAgIHR5cGU6IFwiYXJ0d29ya3NcIixcbiAgICAgICAgc291cmNlOiBcIm5nYVwiLFxuICAgICAgICBsYW5nOiBcImVuXCIsXG4gICAgICAgIHVybDogXCJodHRwOi8vZ29vZ2xlLmNvbVwiLFxuICAgICAgICBpbWFnZXM6IFtcImZvby5qcGdcIl0sXG4gICAgICAgIHRpdGxlOiBcIlRlc3RcIixcbiAgICAgICAgb2JqZWN0VHlwZTogXCJwYWludGluZ1wiLFxuICAgICAgICBhcnRpc3RzOiBbe25hbWU6IFwiVGVzdFwifV0sXG4gICAgICAgIGRpbWVuc2lvbnM6IFt7d2lkdGg6IDEyMywgdW5pdDogXCJtbVwifV0sXG4gICAgICAgIGRhdGVzOiBbXCJjYS4gMTQ1Ni0xNDU3XCJdLFxuICAgICAgICBsb2NhdGlvbnM6IFt7Y2l0eTogXCJOZXcgWW9yayBDaXR5XCJ9XSxcbiAgICB9LCByZXEpLCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgICAgIHR5cGU6IFwiYXJ0d29ya3NcIixcbiAgICAgICAgICAgIHNvdXJjZTogXCJuZ2FcIixcbiAgICAgICAgICAgIGxhbmc6IFwiZW5cIixcbiAgICAgICAgICAgIHVybDogXCJodHRwOi8vZ29vZ2xlLmNvbVwiLFxuICAgICAgICAgICAgaW1hZ2VzOiBbXCJuZ2EvZm9vLmpwZ1wiXSxcbiAgICAgICAgICAgIHRpdGxlOiBcIlRlc3RcIixcbiAgICAgICAgICAgIG9iamVjdFR5cGU6IFwicGFpbnRpbmdcIixcbiAgICAgICAgICAgIGFydGlzdHM6IFt7bmFtZTogXCJUZXN0XCJ9XSxcbiAgICAgICAgICAgIGRpbWVuc2lvbnM6IFt7d2lkdGg6IDEyMywgdW5pdDogXCJtbVwifV0sXG4gICAgICAgICAgICBkYXRlczogW3tcbiAgICAgICAgICAgICAgICBzdGFydDogMTQ1NixcbiAgICAgICAgICAgICAgICBlbmQ6IDE0NTcsXG4gICAgICAgICAgICAgICAgY2lyY2E6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJvcmlnaW5hbFwiOiBcImNhLiAxNDU2LTE0NTdcIixcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgbG9jYXRpb25zOiBbe2NpdHk6IFwiTmV3IFlvcmsgQ2l0eVwifV0sXG4gICAgICAgIH0sXG4gICAgICAgIFwid2FybmluZ3NcIjogW10sXG4gICAgfSwgXCJEYXRlc1wiKTtcblxuICAgIHQuc2FtZShSZWNvcmQubGludERhdGEoe1xuICAgICAgICBpZDogXCIxMjM0XCIsXG4gICAgICAgIHR5cGU6IFwiYXJ0d29ya3NcIixcbiAgICAgICAgc291cmNlOiBcIm5nYVwiLFxuICAgICAgICBsYW5nOiBcImVuXCIsXG4gICAgICAgIHVybDogXCJodHRwOi8vZ29vZ2xlLmNvbVwiLFxuICAgICAgICBpbWFnZXM6IFtcImZvby5qcGdcIl0sXG4gICAgICAgIHRpdGxlOiBcIlRlc3RcIixcbiAgICAgICAgb2JqZWN0VHlwZTogXCJwYWludGluZ1wiLFxuICAgICAgICBhcnRpc3RzOiBbe25hbWU6IFwiVGVzdFwifV0sXG4gICAgICAgIGRpbWVuc2lvbnM6IFt7d2lkdGg6IDEyMywgdW5pdDogXCJtbVwifV0sXG4gICAgICAgIGRhdGVzOiBbXCJibGFoXCJdLFxuICAgICAgICBsb2NhdGlvbnM6IFt7Y2l0eTogXCJOZXcgWW9yayBDaXR5XCJ9XSxcbiAgICB9LCByZXEpLCB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgICAgIHR5cGU6IFwiYXJ0d29ya3NcIixcbiAgICAgICAgICAgIHNvdXJjZTogXCJuZ2FcIixcbiAgICAgICAgICAgIGxhbmc6IFwiZW5cIixcbiAgICAgICAgICAgIHVybDogXCJodHRwOi8vZ29vZ2xlLmNvbVwiLFxuICAgICAgICAgICAgaW1hZ2VzOiBbXCJuZ2EvZm9vLmpwZ1wiXSxcbiAgICAgICAgICAgIHRpdGxlOiBcIlRlc3RcIixcbiAgICAgICAgICAgIG9iamVjdFR5cGU6IFwicGFpbnRpbmdcIixcbiAgICAgICAgICAgIGFydGlzdHM6IFt7bmFtZTogXCJUZXN0XCJ9XSxcbiAgICAgICAgICAgIGRpbWVuc2lvbnM6IFt7d2lkdGg6IDEyMywgdW5pdDogXCJtbVwifV0sXG4gICAgICAgICAgICBsb2NhdGlvbnM6IFt7Y2l0eTogXCJOZXcgWW9yayBDaXR5XCJ9XSxcbiAgICAgICAgfSxcbiAgICAgICAgXCJ3YXJuaW5nc1wiOiBbXG4gICAgICAgICAgICBcIkRhdGVzIG11c3QgaGF2ZSBhIHN0YXJ0IG9yIGVuZCBzcGVjaWZpZWQuXCIsXG4gICAgICAgIF0sXG4gICAgfSwgXCJEYXRlcyBwcm9kdWNlIHdhcm5pbmdzXCIpO1xuXG4gICAgdC5zYW1lKFJlY29yZC5saW50RGF0YSh7XG4gICAgICAgIGlkOiBcIjEyMzRcIixcbiAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICBzb3VyY2U6IFwibmdhXCIsXG4gICAgICAgIGxhbmc6IFwiZW5cIixcbiAgICAgICAgdXJsOiBcImh0dHA6Ly9nb29nbGUuY29tXCIsXG4gICAgICAgIGltYWdlczogW1wiZm9vLmpwZ1wiXSxcbiAgICAgICAgdGl0bGU6IFwiVGVzdFwiLFxuICAgICAgICBvYmplY3RUeXBlOiBcInBhaW50aW5nXCIsXG4gICAgICAgIGFydGlzdHM6IFt7XG4gICAgICAgICAgICBuYW1lOiBcIlRlc3RcIixcbiAgICAgICAgICAgIGRhdGVzOiBbXCJjYS4gMTQ1Ni0xNDU3XCJdLFxuICAgICAgICB9XSxcbiAgICAgICAgZGltZW5zaW9uczogW3t3aWR0aDogMTIzLCB1bml0OiBcIm1tXCJ9XSxcbiAgICAgICAgZGF0ZXM6IFtcImNhLiAxNDU2LTE0NTdcIl0sXG4gICAgICAgIGxvY2F0aW9uczogW3tjaXR5OiBcIk5ldyBZb3JrIENpdHlcIn1dLFxuICAgIH0sIHJlcSksIHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgaWQ6IFwiMTIzNFwiLFxuICAgICAgICAgICAgdHlwZTogXCJhcnR3b3Jrc1wiLFxuICAgICAgICAgICAgc291cmNlOiBcIm5nYVwiLFxuICAgICAgICAgICAgbGFuZzogXCJlblwiLFxuICAgICAgICAgICAgdXJsOiBcImh0dHA6Ly9nb29nbGUuY29tXCIsXG4gICAgICAgICAgICBpbWFnZXM6IFtcIm5nYS9mb28uanBnXCJdLFxuICAgICAgICAgICAgdGl0bGU6IFwiVGVzdFwiLFxuICAgICAgICAgICAgb2JqZWN0VHlwZTogXCJwYWludGluZ1wiLFxuICAgICAgICAgICAgYXJ0aXN0czogW3tcbiAgICAgICAgICAgICAgICBuYW1lOiBcIlRlc3RcIixcbiAgICAgICAgICAgICAgICBkYXRlczogW3tcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IDE0NTYsXG4gICAgICAgICAgICAgICAgICAgIGVuZDogMTQ1NyxcbiAgICAgICAgICAgICAgICAgICAgY2lyY2E6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwib3JpZ2luYWxcIjogXCJjYS4gMTQ1Ni0xNDU3XCIsXG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIGRpbWVuc2lvbnM6IFt7d2lkdGg6IDEyMywgdW5pdDogXCJtbVwifV0sXG4gICAgICAgICAgICBkYXRlczogW3tcbiAgICAgICAgICAgICAgICBzdGFydDogMTQ1NixcbiAgICAgICAgICAgICAgICBlbmQ6IDE0NTcsXG4gICAgICAgICAgICAgICAgY2lyY2E6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJvcmlnaW5hbFwiOiBcImNhLiAxNDU2LTE0NTdcIixcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgbG9jYXRpb25zOiBbe2NpdHk6IFwiTmV3IFlvcmsgQ2l0eVwifV0sXG4gICAgICAgIH0sXG4gICAgICAgIFwid2FybmluZ3NcIjogW10sXG4gICAgfSwgXCJEYXRlcyBpbiBBcnRpc3RzXCIpO1xufSk7XG4iXX0=