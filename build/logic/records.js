"use strict";

var async = require("async");
var formidable = require("formidable");

var db = require("../lib/db");
var urls = require("../lib/urls");
var record = require("../lib/record");
var models = require("../lib/models");
var options = require("../lib/options");
var metadata = require("../lib/metadata");

module.exports = function (app) {
    var Source = models("Source");
    var Image = models("Image");

    var cache = require("../server/middlewares/cache");
    var _search = require("./shared/search-page");
    var auth = require("./shared/auth");

    return {
        search: function search(req, res, next) {
            return _search(req, res, next);
        },
        bySource: function bySource(req, res, next) {
            try {
                _search(req, res, next, {
                    url: Source.getSource(req.params.source).url
                });
            } catch (e) {
                return res.status(404).render("Error", {
                    title: req.gettext("Source not found.")
                });
            }
        },
        show: function show(req, res, next) {
            var typeName = req.params.type;

            if (!options.types[typeName]) {
                return res.status(404).render("Error", {
                    title: req.gettext("Page not found.")
                });
            }

            if (options.types[typeName].alwaysEdit) {
                return res.redirect(req.originalUrl + "/edit");
            }

            var Record = record(typeName);
            var compare = "compare" in req.query;
            var id = req.params.source + "/" + req.params.recordName;

            Record.findById(id, function (err, record) {
                if (err || !record) {
                    // We don't return a 404 here to allow this to pass
                    // through to other handlers
                    return next();
                }

                record.loadImages(true, function () {
                    // TODO: Handle error loading images?
                    var title = record.getTitle(req);

                    // Sort the similar records by score
                    record.similarRecords = record.similarRecords.sort(function (a, b) {
                        return b.score - a.score;
                    });

                    if (!compare) {
                        return res.render("Record", {
                            title: title,
                            compare: false,
                            records: [record],
                            similar: record.similarRecords,
                            sources: Source.getSourcesByType(typeName)
                        });
                    }

                    async.eachLimit(record.similarRecords, 4, function (similar, callback) {
                        similar.recordModel.loadImages(false, callback);
                    }, function () {
                        res.render("Record", {
                            title: title,
                            compare: true,
                            noIndex: true,
                            similar: [],
                            records: [record].concat(record.similarRecords.map(function (similar) {
                                return similar.recordModel;
                            })),
                            sources: Source.getSourcesByType(typeName)
                        });
                    });
                });
            });
        },
        editView: function editView(req, res) {
            var type = req.params.type;
            var Record = record(type);
            var id = req.params.source + "/" + req.params.recordName;

            Record.findById(id, function (err, record) {
                if (err || !record) {
                    return res.status(404).render("Error", {
                        title: req.gettext("Not found.")
                    });
                }

                record.loadImages(true, function () {
                    Record.getFacets(req, function (err, globalFacets) {
                        record.getDynamicValues(req, function (err, dynamicValues) {
                            res.render("EditRecord", {
                                mode: "edit",
                                record: record,
                                globalFacets: globalFacets,
                                dynamicValues: dynamicValues,
                                type: type
                            });
                        });
                    });
                });
            });
        },
        edit: function edit(req, res, next) {
            var props = {};
            var type = req.params.type;
            var model = metadata.model(type);
            var hasImageSearch = options.types[type].hasImageSearch();
            var id = req.params.recordName;
            var _id = req.params.source + "/" + id;

            var form = new formidable.IncomingForm();
            form.encoding = "utf-8";
            form.maxFieldsSize = options.maxUploadSize;
            form.multiples = true;

            form.parse(req, function (err, fields, files) {
                /* istanbul ignore if */
                if (err) {
                    return next(new Error(req.gettext("Error processing upload.")));
                }

                req.lang = fields.lang;

                for (var prop in model) {
                    props[prop] = fields[prop];
                }

                Object.assign(props, {
                    id: id,
                    lang: req.lang,
                    source: req.params.source,
                    type: type
                });

                var Record = record(type);

                var _Record$lintData = Record.lintData(props, req),
                    data = _Record$lintData.data,
                    error = _Record$lintData.error;

                if (error) {
                    return next(new Error(error));
                }

                var mockBatch = {
                    _id: db.mongoose.Types.ObjectId().toString(),
                    source: req.params.source
                };

                var images = Array.isArray(files.images) ? files.images : files.images ? [files.images] : [];

                async.mapSeries(images, function (file, callback) {
                    if (!file.path || file.size <= 0) {
                        return process.nextTick(callback);
                    }

                    Image.fromFile(mockBatch, file, function (err, image) {
                        // TODO: Display better error message
                        if (err) {
                            return callback(new Error(req.gettext("Error processing image.")));
                        }

                        image.save(function (err) {
                            /* istanbul ignore if */
                            if (err) {
                                return callback(err);
                            }

                            callback(null, image);
                        });
                    });
                }, function (err, unfilteredImages) {
                    if (err) {
                        return next(err);
                    }

                    Record.findById(_id, function (err, record) {
                        if (err || !record) {
                            return res.status(404).render("Error", {
                                title: req.gettext("Not found.")
                            });
                        }

                        record.set(data);

                        for (var _prop in model) {
                            if (!fields[_prop] && !data[_prop]) {
                                record[_prop] = undefined;
                            }
                        }

                        record.images = record.images.concat(unfilteredImages.filter(function (image) {
                            return image;
                        }).map(function (image) {
                            return image._id;
                        }));

                        record.save(function (err) {
                            if (err) {
                                return next(new Error(req.gettext("Error saving record.")));
                            }

                            var finish = function finish() {
                                return res.redirect(record.getURL(req.lang));
                            };

                            if (record.images.length === 0 || !hasImageSearch) {
                                return finish();
                            }

                            // If new images were added then we need to update
                            // their similarity and the similarity of all other
                            // images, as well.
                            Image.queueBatchSimilarityUpdate(mockBatch._id, finish);
                        });
                    });
                });
            });
        },
        removeImage: function removeImage(req, res, next) {
            var type = req.params.type;
            var Record = record(type);
            var hasImageSearch = options.types[type].hasImageSearch();
            var id = req.params.source + "/" + req.params.recordName;

            var form = new formidable.IncomingForm();
            form.encoding = "utf-8";

            form.parse(req, function (err, fields) {
                /* istanbul ignore if */
                if (err) {
                    return next(new Error(req.gettext("Error processing request.")));
                }

                var imageID = fields.image;

                req.lang = fields.lang;

                Record.findById(id, function (err, record) {
                    if (err || !record) {
                        return next(new Error(req.gettext("Not found.")));
                    }

                    record.images = record.images.filter(function (image) {
                        return image !== imageID;
                    });

                    record.save(function (err) {
                        if (err) {
                            return next(new Error(req.gettext("Error saving record.")));
                        }

                        var finish = function finish() {
                            return res.redirect(record.getURL(req.lang));
                        };

                        if (!hasImageSearch) {
                            return finish();
                        }

                        record.updateSimilarity(finish);
                    });
                });
            });
        },
        facets: function facets(req, res, next) {
            var type = req.params.type;
            var Record = record(type);

            Record.getFacets(req, function (err, facets) {
                if (err) {
                    return next(new Error(req.gettext("Error processing request.")));
                }

                res.json(facets);
            });
        },
        cloneView: function cloneView(req, res) {
            var type = req.params.type;
            var Record = record(type);
            var id = req.params.source + "/" + req.params.recordName;

            Record.findById(id, function (err, oldRecord) {
                if (err || !oldRecord) {
                    return res.status(404).render("Error", {
                        title: req.gettext("Not found.")
                    });
                }

                var data = {
                    type: type,
                    source: oldRecord.source,
                    lang: oldRecord.lang
                };

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = options.types[type].cloneFields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var typeName = _step.value;

                        data[typeName] = oldRecord[typeName];
                    }
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

                var record = new Record(data);

                record.loadImages(true, function () {
                    Record.getFacets(req, function (err, globalFacets) {
                        record.getDynamicValues(req, function (err, dynamicValues) {
                            res.render("EditRecord", {
                                mode: "clone",
                                record: record,
                                globalFacets: globalFacets,
                                dynamicValues: dynamicValues,
                                type: type
                            });
                        });
                    });
                });
            });
        },
        createRedirect: function createRedirect(req, res) {
            var type = req.params.type;
            var sources = Source.getSourcesByType(type).filter(function (source) {
                return req.user.siteAdmin || req.user.sourceAdmin.indexOf(source._id) >= 0;
            });

            if (sources.length === 1) {
                return res.redirect(urls.gen(req.lang, "/" + type + "/" + sources[0]._id + "/create"));
            }

            // TODO(jeresig): Figure out a better way to handle multiple sources
            res.status(404).send({
                error: req.gettext("Page not found.")
            });
        },
        createView: function createView(req, res) {
            var type = req.params.type;
            var Record = record(type);

            Record.getFacets(req, function (err, globalFacets) {
                res.render("EditRecord", {
                    mode: "create",
                    type: type,
                    globalFacets: globalFacets,
                    dynamicValues: {}
                });
            });
        },
        create: function create(req, res, next) {
            var props = {};
            var type = req.params.type;
            var model = metadata.model(type);
            var hasImageSearch = options.types[type].hasImageSearch();

            var form = new formidable.IncomingForm();
            form.encoding = "utf-8";
            form.maxFieldsSize = options.maxUploadSize;
            form.multiples = true;

            form.parse(req, function (err, fields, files) {
                /* istanbul ignore if */
                if (err) {
                    return next(new Error(req.gettext("Error processing upload.")));
                }

                req.lang = fields.lang;

                for (var prop in model) {
                    props[prop] = fields[prop];
                }

                if (options.types[type].autoID) {
                    props.id = db.mongoose.Types.ObjectId().toString();
                } else {
                    props.id = fields.id;
                }

                Object.assign(props, {
                    lang: req.lang,
                    source: req.params.source,
                    type: type
                });

                var Record = record(type);

                var _Record$lintData2 = Record.lintData(props, req),
                    data = _Record$lintData2.data,
                    error = _Record$lintData2.error;

                if (error) {
                    return next(new Error(error));
                }

                var newRecord = new Record(data);

                var mockBatch = {
                    _id: db.mongoose.Types.ObjectId().toString(),
                    source: newRecord.source
                };

                var images = Array.isArray(files.images) ? files.images : files.images ? [files.images] : [];

                async.mapSeries(images, function (file, callback) {
                    if (!file.path || file.size <= 0) {
                        return process.nextTick(callback);
                    }

                    Image.fromFile(mockBatch, file, function (err, image) {
                        // TODO: Display better error message
                        if (err) {
                            return callback(new Error(req.gettext("Error processing image.")));
                        }

                        image.save(function (err) {
                            /* istanbul ignore if */
                            if (err) {
                                return callback(err);
                            }

                            callback(null, image);
                        });
                    });
                }, function (err, unfilteredImages) {
                    if (err) {
                        return next(err);
                    }

                    newRecord.images = unfilteredImages.filter(function (image) {
                        return image;
                    }).map(function (image) {
                        return image._id;
                    });

                    newRecord.save(function (err) {
                        if (err) {
                            return next(new Error(req.gettext("Error saving record.")));
                        }

                        var finish = function finish() {
                            return res.redirect(newRecord.getURL(req.lang));
                        };

                        if (newRecord.images.length === 0 || !hasImageSearch) {
                            return finish();
                        }

                        // If new images were added then we need to update
                        // their similarity and the similarity of all other
                        // images, as well.
                        Image.queueBatchSimilarityUpdate(mockBatch._id, finish);
                    });
                });
            });
        },
        json: function json(req, res) {
            var id = req.params.source + "/" + req.params.recordName;
            var type = req.params.type;
            var Record = record(type);

            Record.findById(id, function (err, record) {
                if (record) {
                    return res.send(record.toJSON());
                }

                res.status(404).send({
                    error: req.gettext("Record not found.")
                });
            });
        },
        routes: function routes() {
            app.get("/:type/search", cache(1), this.search);
            app.get("/:type/facets", cache(1), this.facets);
            app.get("/:type/create", cache(1), this.createRedirect);
            app.get("/:type/source/:source", cache(1), this.bySource);
            app.get("/:type/:source/create", auth, this.createView);
            app.post("/:type/:source/create", auth, this.create);

            var _loop = function _loop(typeName) {
                var searchURLs = options.types[typeName].searchURLs;

                var _loop2 = function _loop2(path) {
                    app.get("/:type" + path, cache(1), function (req, res, next) {
                        return searchURLs[path](req, res, next, _search);
                    });
                };

                for (var path in searchURLs) {
                    _loop2(path);
                }
            };

            for (var typeName in options.types) {
                _loop(typeName);
            }

            // Handle these last as they'll catch almost anything
            app.get("/:type/:source/:recordName/edit", auth, this.editView);
            app.post("/:type/:source/:recordName/edit", auth, this.edit);
            app.get("/:type/:source/:recordName/clone", auth, this.cloneView);
            app.post("/:type/:source/:recordName/remove-image", auth, this.removeImage);
            app.get("/:type/:source/:recordName/json", this.json);
            app.get("/:type/:source/:recordName", this.show);
        }
    };
};