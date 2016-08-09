"use strict";

const path = require("path");

const tap = require("tap");

const init = require("../init");
const Source = init.Source;

tap.test("getURL", {autoend: true}, (t) => {
    const source = init.getSource();
    t.equal(source.getURL("en"),
        "/source/test", "Check 'en' URL");

    t.equal(source.getURL("de"),
        "/source/test?lang=de", "Check 'de' URL");
});

tap.test("getDirBase", {autoend: true}, (t) => {
    const source = init.getSource();
    const file = path.resolve(process.cwd(), "data/test");
    t.equal(source.getDirBase(), file);
});

tap.test("getFullName", {autoend: true}, (t) => {
    const source = init.getSource();
    t.equal(source.getFullName(), "Test Source");
});

tap.test("getShortName", {autoend: true}, (t) => {
    const source = init.getSource();
    t.equal(source.getShortName(), "Test");
});

tap.test("getConverter", {autoend: true}, (t) => {
    const source = init.getSource();
    t.ok(source.getConverter().processFiles);
});

tap.test("getExpectedFiles", {autoend: true}, (t) => {
    const source = init.getSource();
    t.same(source.getExpectedFiles(), [
        "Upload a JSON file (.json) containing metadata.",
    ]);
});

tap.test("cacheTotals", (t) => {
    const source = init.getSource();
    source.cacheTotals(() => {
        t.equal(source.numRecords, 4);
        t.equal(source.numImages, 4);
        t.end();
    });
});

tap.test("Source.cacheSources", (t) => {
    Source.cacheSources((err, sources) => {
        t.equal(sources[0].numRecords, 4);
        t.equal(sources[1].numRecords, 0);
        t.end();
    });
});

tap.test("Source.getSource", (t) => {
    const source = init.getSource();
    Source.cacheSources(() => {
        t.equal(Source.getSource("test"), source);
        t.notEqual(Source.getSource("test2"), source);
        t.throws(() => Source.getSource("unknown"),
            new Error("Source not found: unknown"));
        t.end();
    });
});
