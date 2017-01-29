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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sb2dpYy9yZWNvcmRzLmpzIl0sIm5hbWVzIjpbImFzeW5jIiwicmVxdWlyZSIsImZvcm1pZGFibGUiLCJkYiIsInVybHMiLCJyZWNvcmQiLCJtb2RlbHMiLCJvcHRpb25zIiwibWV0YWRhdGEiLCJtb2R1bGUiLCJleHBvcnRzIiwiYXBwIiwiU291cmNlIiwiSW1hZ2UiLCJjYWNoZSIsInNlYXJjaCIsImF1dGgiLCJyZXEiLCJyZXMiLCJuZXh0IiwiYnlTb3VyY2UiLCJ1cmwiLCJnZXRTb3VyY2UiLCJwYXJhbXMiLCJzb3VyY2UiLCJlIiwic3RhdHVzIiwicmVuZGVyIiwidGl0bGUiLCJnZXR0ZXh0Iiwic2hvdyIsInR5cGVOYW1lIiwidHlwZSIsInR5cGVzIiwiYWx3YXlzRWRpdCIsInJlZGlyZWN0Iiwib3JpZ2luYWxVcmwiLCJSZWNvcmQiLCJjb21wYXJlIiwicXVlcnkiLCJpZCIsInJlY29yZE5hbWUiLCJmaW5kQnlJZCIsImVyciIsImxvYWRJbWFnZXMiLCJnZXRUaXRsZSIsInNpbWlsYXJSZWNvcmRzIiwic29ydCIsImEiLCJiIiwic2NvcmUiLCJyZWNvcmRzIiwic2ltaWxhciIsInNvdXJjZXMiLCJnZXRTb3VyY2VzQnlUeXBlIiwiZWFjaExpbWl0IiwiY2FsbGJhY2siLCJyZWNvcmRNb2RlbCIsIm5vSW5kZXgiLCJjb25jYXQiLCJtYXAiLCJlZGl0VmlldyIsImdldEZhY2V0cyIsImdsb2JhbEZhY2V0cyIsImdldER5bmFtaWNWYWx1ZXMiLCJkeW5hbWljVmFsdWVzIiwibW9kZSIsImVkaXQiLCJwcm9wcyIsIm1vZGVsIiwiaGFzSW1hZ2VTZWFyY2giLCJfaWQiLCJmb3JtIiwiSW5jb21pbmdGb3JtIiwiZW5jb2RpbmciLCJtYXhGaWVsZHNTaXplIiwibWF4VXBsb2FkU2l6ZSIsIm11bHRpcGxlcyIsInBhcnNlIiwiZmllbGRzIiwiZmlsZXMiLCJFcnJvciIsImxhbmciLCJwcm9wIiwiT2JqZWN0IiwiYXNzaWduIiwibGludERhdGEiLCJkYXRhIiwiZXJyb3IiLCJtb2NrQmF0Y2giLCJtb25nb29zZSIsIlR5cGVzIiwiT2JqZWN0SWQiLCJ0b1N0cmluZyIsImltYWdlcyIsIkFycmF5IiwiaXNBcnJheSIsIm1hcFNlcmllcyIsImZpbGUiLCJwYXRoIiwic2l6ZSIsInByb2Nlc3MiLCJuZXh0VGljayIsImZyb21GaWxlIiwiaW1hZ2UiLCJzYXZlIiwidW5maWx0ZXJlZEltYWdlcyIsInNldCIsInVuZGVmaW5lZCIsImZpbHRlciIsImZpbmlzaCIsImdldFVSTCIsImxlbmd0aCIsInF1ZXVlQmF0Y2hTaW1pbGFyaXR5VXBkYXRlIiwicmVtb3ZlSW1hZ2UiLCJpbWFnZUlEIiwidXBkYXRlU2ltaWxhcml0eSIsImZhY2V0cyIsImpzb24iLCJjbG9uZVZpZXciLCJvbGRSZWNvcmQiLCJjbG9uZUZpZWxkcyIsImNyZWF0ZVJlZGlyZWN0IiwidXNlciIsInNpdGVBZG1pbiIsInNvdXJjZUFkbWluIiwiaW5kZXhPZiIsImdlbiIsInNlbmQiLCJjcmVhdGVWaWV3IiwiY3JlYXRlIiwiYXV0b0lEIiwibmV3UmVjb3JkIiwidG9KU09OIiwicm91dGVzIiwiZ2V0IiwicG9zdCIsInNlYXJjaFVSTHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsUUFBUUMsUUFBUSxPQUFSLENBQWQ7QUFDQSxJQUFNQyxhQUFhRCxRQUFRLFlBQVIsQ0FBbkI7O0FBRUEsSUFBTUUsS0FBS0YsUUFBUSxXQUFSLENBQVg7QUFDQSxJQUFNRyxPQUFPSCxRQUFRLGFBQVIsQ0FBYjtBQUNBLElBQU1JLFNBQVNKLFFBQVEsZUFBUixDQUFmO0FBQ0EsSUFBTUssU0FBU0wsUUFBUSxlQUFSLENBQWY7QUFDQSxJQUFNTSxVQUFVTixRQUFRLGdCQUFSLENBQWhCO0FBQ0EsSUFBTU8sV0FBV1AsUUFBUSxpQkFBUixDQUFqQjs7QUFFQVEsT0FBT0MsT0FBUCxHQUFpQixVQUFTQyxHQUFULEVBQWM7QUFDM0IsUUFBTUMsU0FBU04sT0FBTyxRQUFQLENBQWY7QUFDQSxRQUFNTyxR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QUFTRCxvQkFBTTBHLGFBQWFsSSxRQUFRMEIsS0FBUixDQUFjRixRQUFkLEVBQXdCMEcsVUFBM0M7O0FBVEMsNkNBVVV0QyxJQVZWO0FBV0d4Rix3QkFBSTRILEdBQUosWUFBaUJwQyxJQUFqQixFQUF5QnJGLE1BQU0sQ0FBTixDQUF6QixFQUFtQyxVQUFDRyxHQUFELEVBQU1DLEdBQU4sRUFBV0MsSUFBWDtBQUFBLCtCQUMvQnNILFdBQVd0QyxJQUFYLEVBQWlCbEYsR0FBakIsRUFBc0JDLEdBQXRCLEVBQTJCQyxJQUEzQixFQUFpQ0osT0FBakMsQ0FEK0I7QUFBQSxxQkFBbkM7QUFYSDs7QUFVRCxxQkFBSyxJQUFNb0YsSUFBWCxJQUFtQnNDLFVBQW5CLEVBQStCO0FBQUEsMkJBQXBCdEMsSUFBb0I7QUFHOUI7QUFiQTs7QUFRTCxpQkFBSyxJQUFNcEUsUUFBWCxJQUF1QnhCLFFBQVEwQixLQUEvQixFQUFzQztBQUFBLHNCQUEzQkYsUUFBMkI7QUFNckM7O0FBRUQ7QUFDQXBCLGdCQUFJNEgsR0FBSixDQUFRLGlDQUFSLEVBQTJDdkgsSUFBM0MsRUFBaUQsS0FBSzZDLFFBQXREO0FBQ0FsRCxnQkFBSTZILElBQUosQ0FBUyxpQ0FBVCxFQUE0Q3hILElBQTVDLEVBQWtELEtBQUttRCxJQUF2RDtBQUNBeEQsZ0JBQUk0SCxHQUFKLENBQVEsa0NBQVIsRUFBNEN2SCxJQUE1QyxFQUFrRCxLQUFLdUcsU0FBdkQ7QUFDQTVHLGdCQUFJNkgsSUFBSixDQUFTLHlDQUFULEVBQW9EeEgsSUFBcEQsRUFDSSxLQUFLa0csV0FEVDtBQUVBdkcsZ0JBQUk0SCxHQUFKLENBQVEsaUNBQVIsRUFBMkMsS0FBS2pCLElBQWhEO0FBQ0EzRyxnQkFBSTRILEdBQUosQ0FBUSw0QkFBUixFQUFzQyxLQUFLekcsSUFBM0M7QUFDSDtBQTFmRSxLQUFQO0FBNGZILENBcGdCRCIsImZpbGUiOiJyZWNvcmRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgYXN5bmMgPSByZXF1aXJlKFwiYXN5bmNcIik7XG5jb25zdCBmb3JtaWRhYmxlID0gcmVxdWlyZShcImZvcm1pZGFibGVcIik7XG5cbmNvbnN0IGRiID0gcmVxdWlyZShcIi4uL2xpYi9kYlwiKTtcbmNvbnN0IHVybHMgPSByZXF1aXJlKFwiLi4vbGliL3VybHNcIik7XG5jb25zdCByZWNvcmQgPSByZXF1aXJlKFwiLi4vbGliL3JlY29yZFwiKTtcbmNvbnN0IG1vZGVscyA9IHJlcXVpcmUoXCIuLi9saWIvbW9kZWxzXCIpO1xuY29uc3Qgb3B0aW9ucyA9IHJlcXVpcmUoXCIuLi9saWIvb3B0aW9uc1wiKTtcbmNvbnN0IG1ldGFkYXRhID0gcmVxdWlyZShcIi4uL2xpYi9tZXRhZGF0YVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhcHApIHtcbiAgICBjb25zdCBTb3VyY2UgPSBtb2RlbHMoXCJTb3VyY2VcIik7XG4gICAgY29uc3QgSW1hZ2UgPSBtb2RlbHMoXCJJbWFnZVwiKTtcblxuICAgIGNvbnN0IGNhY2hlID0gcmVxdWlyZShcIi4uL3NlcnZlci9taWRkbGV3YXJlcy9jYWNoZVwiKTtcbiAgICBjb25zdCBzZWFyY2ggPSByZXF1aXJlKFwiLi9zaGFyZWQvc2VhcmNoLXBhZ2VcIik7XG4gICAgY29uc3QgYXV0aCA9IHJlcXVpcmUoXCIuL3NoYXJlZC9hdXRoXCIpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2VhcmNoKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gc2VhcmNoKHJlcSwgcmVzLCBuZXh0KTtcbiAgICAgICAgfSxcblxuICAgICAgICBieVNvdXJjZShyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBzZWFyY2gocmVxLCByZXMsIG5leHQsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBTb3VyY2UuZ2V0U291cmNlKHJlcS5wYXJhbXMuc291cmNlKS51cmwsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLnJlbmRlcihcIkVycm9yXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHJlcS5nZXR0ZXh0KFwiU291cmNlIG5vdCBmb3VuZC5cIiksXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2hvdyhyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICAgICAgY29uc3QgdHlwZU5hbWUgPSByZXEucGFyYW1zLnR5cGU7XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLnR5cGVzW3R5cGVOYW1lXS5hbHdheXNFZGl0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5yZWRpcmVjdChgJHtyZXEub3JpZ2luYWxVcmx9L2VkaXRgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgUmVjb3JkID0gcmVjb3JkKHR5cGVOYW1lKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbXBhcmUgPSAoXCJjb21wYXJlXCIgaW4gcmVxLnF1ZXJ5KTtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gYCR7cmVxLnBhcmFtcy5zb3VyY2V9LyR7cmVxLnBhcmFtcy5yZWNvcmROYW1lfWA7XG5cbiAgICAgICAgICAgIFJlY29yZC5maW5kQnlJZChpZCwgKGVyciwgcmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVyciB8fCAhcmVjb3JkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIGRvbid0IHJldHVybiBhIDQwNCBoZXJlIHRvIGFsbG93IHRoaXMgdG8gcGFzc1xuICAgICAgICAgICAgICAgICAgICAvLyB0aHJvdWdoIHRvIG90aGVyIGhhbmRsZXJzXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVjb3JkLmxvYWRJbWFnZXModHJ1ZSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiBIYW5kbGUgZXJyb3IgbG9hZGluZyBpbWFnZXM/XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gcmVjb3JkLmdldFRpdGxlKHJlcSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gU29ydCB0aGUgc2ltaWxhciByZWNvcmRzIGJ5IHNjb3JlXG4gICAgICAgICAgICAgICAgICAgIHJlY29yZC5zaW1pbGFyUmVjb3JkcyA9IHJlY29yZC5zaW1pbGFyUmVjb3Jkc1xuICAgICAgICAgICAgICAgICAgICAgICAgLnNvcnQoKGEsIGIpID0+IGIuc2NvcmUgLSBhLnNjb3JlKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbXBhcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXMucmVuZGVyKFwiUmVjb3JkXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wYXJlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWNvcmRzOiBbcmVjb3JkXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaW1pbGFyOiByZWNvcmQuc2ltaWxhclJlY29yZHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlczogU291cmNlLmdldFNvdXJjZXNCeVR5cGUodHlwZU5hbWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBhc3luYy5lYWNoTGltaXQocmVjb3JkLnNpbWlsYXJSZWNvcmRzLCA0LFxuICAgICAgICAgICAgICAgICAgICAgICAgKHNpbWlsYXIsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2ltaWxhci5yZWNvcmRNb2RlbC5sb2FkSW1hZ2VzKGZhbHNlLCBjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnJlbmRlcihcIlJlY29yZFwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wYXJlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub0luZGV4OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaW1pbGFyOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkczogW3JlY29yZF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jb25jYXQocmVjb3JkLnNpbWlsYXJSZWNvcmRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgoc2ltaWxhcikgPT4gc2ltaWxhci5yZWNvcmRNb2RlbCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VzOiBTb3VyY2UuZ2V0U291cmNlc0J5VHlwZSh0eXBlTmFtZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGVkaXRWaWV3KHJlcSwgcmVzKSB7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gcmVxLnBhcmFtcy50eXBlO1xuICAgICAgICAgICAgY29uc3QgUmVjb3JkID0gcmVjb3JkKHR5cGUpO1xuICAgICAgICAgICAgY29uc3QgaWQgPSBgJHtyZXEucGFyYW1zLnNvdXJjZX0vJHtyZXEucGFyYW1zLnJlY29yZE5hbWV9YDtcblxuICAgICAgICAgICAgUmVjb3JkLmZpbmRCeUlkKGlkLCAoZXJyLCByZWNvcmQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyIHx8ICFyZWNvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5yZW5kZXIoXCJFcnJvclwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogcmVxLmdldHRleHQoXCJOb3QgZm91bmQuXCIpLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZWNvcmQubG9hZEltYWdlcyh0cnVlLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFJlY29yZC5nZXRGYWNldHMocmVxLCAoZXJyLCBnbG9iYWxGYWNldHMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZC5nZXREeW5hbWljVmFsdWVzKHJlcSwgKGVyciwgZHluYW1pY1ZhbHVlcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5yZW5kZXIoXCJFZGl0UmVjb3JkXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZTogXCJlZGl0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsRmFjZXRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkeW5hbWljVmFsdWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZWRpdChyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICAgICAgY29uc3QgcHJvcHMgPSB7fTtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSByZXEucGFyYW1zLnR5cGU7XG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IG1ldGFkYXRhLm1vZGVsKHR5cGUpO1xuICAgICAgICAgICAgY29uc3QgaGFzSW1hZ2VTZWFyY2ggPSBvcHRpb25zLnR5cGVzW3R5cGVdLmhhc0ltYWdlU2VhcmNoKCk7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHJlcS5wYXJhbXMucmVjb3JkTmFtZTtcbiAgICAgICAgICAgIGNvbnN0IF9pZCA9IGAke3JlcS5wYXJhbXMuc291cmNlfS8ke2lkfWA7XG5cbiAgICAgICAgICAgIGNvbnN0IGZvcm0gPSBuZXcgZm9ybWlkYWJsZS5JbmNvbWluZ0Zvcm0oKTtcbiAgICAgICAgICAgIGZvcm0uZW5jb2RpbmcgPSBcInV0Zi04XCI7XG4gICAgICAgICAgICBmb3JtLm1heEZpZWxkc1NpemUgPSBvcHRpb25zLm1heFVwbG9hZFNpemU7XG4gICAgICAgICAgICBmb3JtLm11bHRpcGxlcyA9IHRydWU7XG5cbiAgICAgICAgICAgIGZvcm0ucGFyc2UocmVxLCAoZXJyLCBmaWVsZHMsIGZpbGVzKSA9PiB7XG4gICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICByZXEuZ2V0dGV4dChcIkVycm9yIHByb2Nlc3NpbmcgdXBsb2FkLlwiKSkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlcS5sYW5nID0gZmllbGRzLmxhbmc7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHByb3AgaW4gbW9kZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcHNbcHJvcF0gPSBmaWVsZHNbcHJvcF07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihwcm9wcywge1xuICAgICAgICAgICAgICAgICAgICBpZCxcbiAgICAgICAgICAgICAgICAgICAgbGFuZzogcmVxLmxhbmcsXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogcmVxLnBhcmFtcy5zb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBSZWNvcmQgPSByZWNvcmQodHlwZSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB7ZGF0YSwgZXJyb3J9ID0gUmVjb3JkLmxpbnREYXRhKHByb3BzLCByZXEpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvcihlcnJvcikpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IG1vY2tCYXRjaCA9IHtcbiAgICAgICAgICAgICAgICAgICAgX2lkOiBkYi5tb25nb29zZS5UeXBlcy5PYmplY3RJZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogcmVxLnBhcmFtcy5zb3VyY2UsXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlcyA9IEFycmF5LmlzQXJyYXkoZmlsZXMuaW1hZ2VzKSA/XG4gICAgICAgICAgICAgICAgICAgIGZpbGVzLmltYWdlcyA6XG4gICAgICAgICAgICAgICAgICAgIGZpbGVzLmltYWdlcyA/XG4gICAgICAgICAgICAgICAgICAgICAgICBbZmlsZXMuaW1hZ2VzXSA6XG4gICAgICAgICAgICAgICAgICAgICAgICBbXTtcblxuICAgICAgICAgICAgICAgIGFzeW5jLm1hcFNlcmllcyhpbWFnZXMsIChmaWxlLCBjYWxsYmFjaykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWZpbGUucGF0aCB8fCBmaWxlLnNpemUgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2soY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgSW1hZ2UuZnJvbUZpbGUobW9ja0JhdGNoLCBmaWxlLCAoZXJyLCBpbWFnZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogRGlzcGxheSBiZXR0ZXIgZXJyb3IgbWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxLmdldHRleHQoXCJFcnJvciBwcm9jZXNzaW5nIGltYWdlLlwiKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZS5zYXZlKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGltYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAoZXJyLCB1bmZpbHRlcmVkSW1hZ2VzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KGVycik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBSZWNvcmQuZmluZEJ5SWQoX2lkLCAoZXJyLCByZWNvcmQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIgfHwgIXJlY29yZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwNCkucmVuZGVyKFwiRXJyb3JcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogcmVxLmdldHRleHQoXCJOb3QgZm91bmQuXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZWNvcmQuc2V0KGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHByb3AgaW4gbW9kZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWZpZWxkc1twcm9wXSAmJiAhZGF0YVtwcm9wXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWNvcmRbcHJvcF0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZWNvcmQuaW1hZ2VzID0gcmVjb3JkLmltYWdlcy5jb25jYXQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5maWx0ZXJlZEltYWdlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKChpbWFnZSkgPT4gaW1hZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKGltYWdlKSA9PiBpbWFnZS5faWQpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkLnNhdmUoKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxLmdldHRleHQoXCJFcnJvciBzYXZpbmcgcmVjb3JkLlwiKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5yZWRpcmVjdChyZWNvcmQuZ2V0VVJMKHJlcS5sYW5nKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVjb3JkLmltYWdlcy5sZW5ndGggPT09IDAgfHwgIWhhc0ltYWdlU2VhcmNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmaW5pc2goKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBuZXcgaW1hZ2VzIHdlcmUgYWRkZWQgdGhlbiB3ZSBuZWVkIHRvIHVwZGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZWlyIHNpbWlsYXJpdHkgYW5kIHRoZSBzaW1pbGFyaXR5IG9mIGFsbCBvdGhlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGltYWdlcywgYXMgd2VsbC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbWFnZS5xdWV1ZUJhdGNoU2ltaWxhcml0eVVwZGF0ZShtb2NrQmF0Y2guX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5pc2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlSW1hZ2UocmVxLCByZXMsIG5leHQpIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSByZXEucGFyYW1zLnR5cGU7XG4gICAgICAgICAgICBjb25zdCBSZWNvcmQgPSByZWNvcmQodHlwZSk7XG4gICAgICAgICAgICBjb25zdCBoYXNJbWFnZVNlYXJjaCA9IG9wdGlvbnMudHlwZXNbdHlwZV0uaGFzSW1hZ2VTZWFyY2goKTtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gYCR7cmVxLnBhcmFtcy5zb3VyY2V9LyR7cmVxLnBhcmFtcy5yZWNvcmROYW1lfWA7XG5cbiAgICAgICAgICAgIGNvbnN0IGZvcm0gPSBuZXcgZm9ybWlkYWJsZS5JbmNvbWluZ0Zvcm0oKTtcbiAgICAgICAgICAgIGZvcm0uZW5jb2RpbmcgPSBcInV0Zi04XCI7XG5cbiAgICAgICAgICAgIGZvcm0ucGFyc2UocmVxLCAoZXJyLCBmaWVsZHMpID0+IHtcbiAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcS5nZXR0ZXh0KFwiRXJyb3IgcHJvY2Vzc2luZyByZXF1ZXN0LlwiKSkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlSUQgPSBmaWVsZHMuaW1hZ2U7XG5cbiAgICAgICAgICAgICAgICByZXEubGFuZyA9IGZpZWxkcy5sYW5nO1xuXG4gICAgICAgICAgICAgICAgUmVjb3JkLmZpbmRCeUlkKGlkLCAoZXJyLCByZWNvcmQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVyciB8fCAhcmVjb3JkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3IocmVxLmdldHRleHQoXCJOb3QgZm91bmQuXCIpKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZWNvcmQuaW1hZ2VzID0gcmVjb3JkLmltYWdlc1xuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcigoaW1hZ2UpID0+IGltYWdlICE9PSBpbWFnZUlEKTtcblxuICAgICAgICAgICAgICAgICAgICByZWNvcmQuc2F2ZSgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXEuZ2V0dGV4dChcIkVycm9yIHNhdmluZyByZWNvcmQuXCIpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnJlZGlyZWN0KHJlY29yZC5nZXRVUkwocmVxLmxhbmcpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFoYXNJbWFnZVNlYXJjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmaW5pc2goKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkLnVwZGF0ZVNpbWlsYXJpdHkoZmluaXNoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBmYWNldHMocmVxLCByZXMsIG5leHQpIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSByZXEucGFyYW1zLnR5cGU7XG4gICAgICAgICAgICBjb25zdCBSZWNvcmQgPSByZWNvcmQodHlwZSk7XG5cbiAgICAgICAgICAgIFJlY29yZC5nZXRGYWNldHMocmVxLCAoZXJyLCBmYWNldHMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcS5nZXR0ZXh0KFwiRXJyb3IgcHJvY2Vzc2luZyByZXF1ZXN0LlwiKSkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlcy5qc29uKGZhY2V0cyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBjbG9uZVZpZXcocmVxLCByZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSByZXEucGFyYW1zLnR5cGU7XG4gICAgICAgICAgICBjb25zdCBSZWNvcmQgPSByZWNvcmQodHlwZSk7XG4gICAgICAgICAgICBjb25zdCBpZCA9IGAke3JlcS5wYXJhbXMuc291cmNlfS8ke3JlcS5wYXJhbXMucmVjb3JkTmFtZX1gO1xuXG4gICAgICAgICAgICBSZWNvcmQuZmluZEJ5SWQoaWQsIChlcnIsIG9sZFJlY29yZCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnIgfHwgIW9sZFJlY29yZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLnJlbmRlcihcIkVycm9yXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiByZXEuZ2V0dGV4dChcIk5vdCBmb3VuZC5cIiksXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogb2xkUmVjb3JkLnNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgbGFuZzogb2xkUmVjb3JkLmxhbmcsXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdHlwZU5hbWUgb2Ygb3B0aW9ucy50eXBlc1t0eXBlXS5jbG9uZUZpZWxkcykge1xuICAgICAgICAgICAgICAgICAgICBkYXRhW3R5cGVOYW1lXSA9IG9sZFJlY29yZFt0eXBlTmFtZV07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gbmV3IFJlY29yZChkYXRhKTtcblxuICAgICAgICAgICAgICAgIHJlY29yZC5sb2FkSW1hZ2VzKHRydWUsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgUmVjb3JkLmdldEZhY2V0cyhyZXEsIChlcnIsIGdsb2JhbEZhY2V0cykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkLmdldER5bmFtaWNWYWx1ZXMocmVxLCAoZXJyLCBkeW5hbWljVmFsdWVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnJlbmRlcihcIkVkaXRSZWNvcmRcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlOiBcImNsb25lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsRmFjZXRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkeW5hbWljVmFsdWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JlYXRlUmVkaXJlY3QocmVxLCByZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSByZXEucGFyYW1zLnR5cGU7XG4gICAgICAgICAgICBjb25zdCBzb3VyY2VzID0gU291cmNlLmdldFNvdXJjZXNCeVR5cGUodHlwZSkuZmlsdGVyKChzb3VyY2UpID0+XG4gICAgICAgICAgICAgICAgcmVxLnVzZXIuc2l0ZUFkbWluIHx8XG4gICAgICAgICAgICAgICAgcmVxLnVzZXIuc291cmNlQWRtaW4uaW5kZXhPZihzb3VyY2UuX2lkKSA+PSAwKTtcblxuICAgICAgICAgICAgaWYgKHNvdXJjZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5yZWRpcmVjdCh1cmxzLmdlbihyZXEubGFuZyxcbiAgICAgICAgICAgICAgICAgICAgYC8ke3R5cGV9LyR7c291cmNlc1swXS5faWR9L2NyZWF0ZWApKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVE9ETyhqZXJlc2lnKTogRmlndXJlIG91dCBhIGJldHRlciB3YXkgdG8gaGFuZGxlIG11bHRpcGxlIHNvdXJjZXNcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDA0KS5zZW5kKHtcbiAgICAgICAgICAgICAgICBlcnJvcjogcmVxLmdldHRleHQoXCJQYWdlIG5vdCBmb3VuZC5cIiksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBjcmVhdGVWaWV3KHJlcSwgcmVzKSB7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gcmVxLnBhcmFtcy50eXBlO1xuICAgICAgICAgICAgY29uc3QgUmVjb3JkID0gcmVjb3JkKHR5cGUpO1xuXG4gICAgICAgICAgICBSZWNvcmQuZ2V0RmFjZXRzKHJlcSwgKGVyciwgZ2xvYmFsRmFjZXRzKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzLnJlbmRlcihcIkVkaXRSZWNvcmRcIiwge1xuICAgICAgICAgICAgICAgICAgICBtb2RlOiBcImNyZWF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgICAgICAgICBnbG9iYWxGYWNldHMsXG4gICAgICAgICAgICAgICAgICAgIGR5bmFtaWNWYWx1ZXM6IHt9LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JlYXRlKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgICAgICAgICBjb25zdCBwcm9wcyA9IHt9O1xuICAgICAgICAgICAgY29uc3QgdHlwZSA9IHJlcS5wYXJhbXMudHlwZTtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gbWV0YWRhdGEubW9kZWwodHlwZSk7XG4gICAgICAgICAgICBjb25zdCBoYXNJbWFnZVNlYXJjaCA9IG9wdGlvbnMudHlwZXNbdHlwZV0uaGFzSW1hZ2VTZWFyY2goKTtcblxuICAgICAgICAgICAgY29uc3QgZm9ybSA9IG5ldyBmb3JtaWRhYmxlLkluY29taW5nRm9ybSgpO1xuICAgICAgICAgICAgZm9ybS5lbmNvZGluZyA9IFwidXRmLThcIjtcbiAgICAgICAgICAgIGZvcm0ubWF4RmllbGRzU2l6ZSA9IG9wdGlvbnMubWF4VXBsb2FkU2l6ZTtcbiAgICAgICAgICAgIGZvcm0ubXVsdGlwbGVzID0gdHJ1ZTtcblxuICAgICAgICAgICAgZm9ybS5wYXJzZShyZXEsIChlcnIsIGZpZWxkcywgZmlsZXMpID0+IHtcbiAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcS5nZXR0ZXh0KFwiRXJyb3IgcHJvY2Vzc2luZyB1cGxvYWQuXCIpKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVxLmxhbmcgPSBmaWVsZHMubGFuZztcblxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcHJvcCBpbiBtb2RlbCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wc1twcm9wXSA9IGZpZWxkc1twcm9wXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy50eXBlc1t0eXBlXS5hdXRvSUQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcHMuaWQgPSBkYi5tb25nb29zZS5UeXBlcy5PYmplY3RJZCgpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcHMuaWQgPSBmaWVsZHMuaWQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihwcm9wcywge1xuICAgICAgICAgICAgICAgICAgICBsYW5nOiByZXEubGFuZyxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiByZXEucGFyYW1zLnNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IFJlY29yZCA9IHJlY29yZCh0eXBlKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHtkYXRhLCBlcnJvcn0gPSBSZWNvcmQubGludERhdGEocHJvcHMsIHJlcSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9yKGVycm9yKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3UmVjb3JkID0gbmV3IFJlY29yZChkYXRhKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG1vY2tCYXRjaCA9IHtcbiAgICAgICAgICAgICAgICAgICAgX2lkOiBkYi5tb25nb29zZS5UeXBlcy5PYmplY3RJZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbmV3UmVjb3JkLnNvdXJjZSxcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgY29uc3QgaW1hZ2VzID0gQXJyYXkuaXNBcnJheShmaWxlcy5pbWFnZXMpID9cbiAgICAgICAgICAgICAgICAgICAgZmlsZXMuaW1hZ2VzIDpcbiAgICAgICAgICAgICAgICAgICAgZmlsZXMuaW1hZ2VzID9cbiAgICAgICAgICAgICAgICAgICAgICAgIFtmaWxlcy5pbWFnZXNdIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIFtdO1xuXG4gICAgICAgICAgICAgICAgYXN5bmMubWFwU2VyaWVzKGltYWdlcywgKGZpbGUsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZmlsZS5wYXRoIHx8IGZpbGUuc2l6ZSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvY2Vzcy5uZXh0VGljayhjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBJbWFnZS5mcm9tRmlsZShtb2NrQmF0Y2gsIGZpbGUsIChlcnIsIGltYWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiBEaXNwbGF5IGJldHRlciBlcnJvciBtZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXEuZ2V0dGV4dChcIkVycm9yIHByb2Nlc3NpbmcgaW1hZ2UuXCIpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlLnNhdmUoKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgaW1hZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIChlcnIsIHVuZmlsdGVyZWRJbWFnZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5leHQoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIG5ld1JlY29yZC5pbWFnZXMgPSB1bmZpbHRlcmVkSW1hZ2VzXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKChpbWFnZSkgPT4gaW1hZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKChpbWFnZSkgPT4gaW1hZ2UuX2lkKTtcblxuICAgICAgICAgICAgICAgICAgICBuZXdSZWNvcmQuc2F2ZSgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXEuZ2V0dGV4dChcIkVycm9yIHNhdmluZyByZWNvcmQuXCIpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnJlZGlyZWN0KG5ld1JlY29yZC5nZXRVUkwocmVxLmxhbmcpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1JlY29yZC5pbWFnZXMubGVuZ3RoID09PSAwIHx8ICFoYXNJbWFnZVNlYXJjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmaW5pc2goKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgbmV3IGltYWdlcyB3ZXJlIGFkZGVkIHRoZW4gd2UgbmVlZCB0byB1cGRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZWlyIHNpbWlsYXJpdHkgYW5kIHRoZSBzaW1pbGFyaXR5IG9mIGFsbCBvdGhlclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW1hZ2VzLCBhcyB3ZWxsLlxuICAgICAgICAgICAgICAgICAgICAgICAgSW1hZ2UucXVldWVCYXRjaFNpbWlsYXJpdHlVcGRhdGUobW9ja0JhdGNoLl9pZCwgZmluaXNoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBqc29uKHJlcSwgcmVzKSB7XG4gICAgICAgICAgICBjb25zdCBpZCA9IGAke3JlcS5wYXJhbXMuc291cmNlfS8ke3JlcS5wYXJhbXMucmVjb3JkTmFtZX1gO1xuICAgICAgICAgICAgY29uc3QgdHlwZSA9IHJlcS5wYXJhbXMudHlwZTtcbiAgICAgICAgICAgIGNvbnN0IFJlY29yZCA9IHJlY29yZCh0eXBlKTtcblxuICAgICAgICAgICAgUmVjb3JkLmZpbmRCeUlkKGlkLCAoZXJyLCByZWNvcmQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXMuc2VuZChyZWNvcmQudG9KU09OKCkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNDA0KS5zZW5kKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IHJlcS5nZXR0ZXh0KFwiUmVjb3JkIG5vdCBmb3VuZC5cIiksXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICByb3V0ZXMoKSB7XG4gICAgICAgICAgICBhcHAuZ2V0KFwiLzp0eXBlL3NlYXJjaFwiLCBjYWNoZSgxKSwgdGhpcy5zZWFyY2gpO1xuICAgICAgICAgICAgYXBwLmdldChcIi86dHlwZS9mYWNldHNcIiwgY2FjaGUoMSksIHRoaXMuZmFjZXRzKTtcbiAgICAgICAgICAgIGFwcC5nZXQoXCIvOnR5cGUvY3JlYXRlXCIsIGNhY2hlKDEpLCB0aGlzLmNyZWF0ZVJlZGlyZWN0KTtcbiAgICAgICAgICAgIGFwcC5nZXQoXCIvOnR5cGUvc291cmNlLzpzb3VyY2VcIiwgY2FjaGUoMSksIHRoaXMuYnlTb3VyY2UpO1xuICAgICAgICAgICAgYXBwLmdldChcIi86dHlwZS86c291cmNlL2NyZWF0ZVwiLCBhdXRoLCB0aGlzLmNyZWF0ZVZpZXcpO1xuICAgICAgICAgICAgYXBwLnBvc3QoXCIvOnR5cGUvOnNvdXJjZS9jcmVhdGVcIiwgYXV0aCwgdGhpcy5jcmVhdGUpO1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHR5cGVOYW1lIGluIG9wdGlvbnMudHlwZXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzZWFyY2hVUkxzID0gb3B0aW9ucy50eXBlc1t0eXBlTmFtZV0uc2VhcmNoVVJMcztcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHBhdGggaW4gc2VhcmNoVVJMcykge1xuICAgICAgICAgICAgICAgICAgICBhcHAuZ2V0KGAvOnR5cGUke3BhdGh9YCwgY2FjaGUoMSksIChyZXEsIHJlcywgbmV4dCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaFVSTHNbcGF0aF0ocmVxLCByZXMsIG5leHQsIHNlYXJjaCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSGFuZGxlIHRoZXNlIGxhc3QgYXMgdGhleSdsbCBjYXRjaCBhbG1vc3QgYW55dGhpbmdcbiAgICAgICAgICAgIGFwcC5nZXQoXCIvOnR5cGUvOnNvdXJjZS86cmVjb3JkTmFtZS9lZGl0XCIsIGF1dGgsIHRoaXMuZWRpdFZpZXcpO1xuICAgICAgICAgICAgYXBwLnBvc3QoXCIvOnR5cGUvOnNvdXJjZS86cmVjb3JkTmFtZS9lZGl0XCIsIGF1dGgsIHRoaXMuZWRpdCk7XG4gICAgICAgICAgICBhcHAuZ2V0KFwiLzp0eXBlLzpzb3VyY2UvOnJlY29yZE5hbWUvY2xvbmVcIiwgYXV0aCwgdGhpcy5jbG9uZVZpZXcpO1xuICAgICAgICAgICAgYXBwLnBvc3QoXCIvOnR5cGUvOnNvdXJjZS86cmVjb3JkTmFtZS9yZW1vdmUtaW1hZ2VcIiwgYXV0aCxcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUltYWdlKTtcbiAgICAgICAgICAgIGFwcC5nZXQoXCIvOnR5cGUvOnNvdXJjZS86cmVjb3JkTmFtZS9qc29uXCIsIHRoaXMuanNvbik7XG4gICAgICAgICAgICBhcHAuZ2V0KFwiLzp0eXBlLzpzb3VyY2UvOnJlY29yZE5hbWVcIiwgdGhpcy5zaG93KTtcbiAgICAgICAgfSxcbiAgICB9O1xufTtcbiJdfQ==