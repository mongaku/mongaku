"use strict";

var path = require("path");

var tap = require("tap");

var init = require("../init");
var Source = init.Source;

tap.test("getURL", { autoend: true }, function (t) {
    var source = init.getSource();
    t.equal(source.getURL("en"), "/artworks/source/test", "Check 'en' URL");

    t.equal(source.getURL("de"), "/artworks/source/test?lang=de", "Check 'de' URL");
});

tap.test("getDirBase", { autoend: true }, function (t) {
    var source = init.getSource();
    var file = path.resolve(process.cwd(), "data/test");
    t.equal(source.getDirBase(), file);
});

tap.test("getFullName", { autoend: true }, function (t) {
    var source = init.getSource();
    t.equal(source.getFullName(), "Test Source");
});

tap.test("getShortName", { autoend: true }, function (t) {
    var source = init.getSource();
    t.equal(source.getShortName(), "Test");
});

tap.test("getConverter", { autoend: true }, function (t) {
    var source = init.getSource();
    t.ok(source.getConverter().processFiles);
});

tap.test("getExpectedFiles", { autoend: true }, function (t) {
    var source = init.getSource();
    t.same(source.getExpectedFiles(), ["Upload a JSON file (.json) containing metadata."]);
});

tap.test("cacheTotals", function (t) {
    var source = init.getSource();
    source.cacheTotals(function () {
        t.equal(source.numRecords, 4);
        t.equal(source.numImages, 4);
        t.end();
    });
});

tap.test("Source.cacheSources", function (t) {
    Source.cacheSources(function (err, sources) {
        t.equal(sources[0].numRecords, 4);
        t.equal(sources[1].numRecords, 0);
        t.end();
    });
});

tap.test("Source.getSource", function (t) {
    var source = init.getSource();
    Source.cacheSources(function () {
        t.equal(Source.getSource("test"), source);
        t.notEqual(Source.getSource("test2"), source);
        t.throws(function () {
            return Source.getSource("unknown");
        }, new Error("Source not found: unknown"));
        t.end();
    });
});