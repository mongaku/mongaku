"use strict";

var path = require("path");

var async = require("async");

var db = require("../lib/db");
var models = require("../lib/models");
var urls = require("../lib/urls");
var similar = require("../lib/similar");

var Image = require("./Image");

var uploadName = "uploads";

var UploadImage = new db.schema({
    // An ID for the image in the form: SOURCE/IMAGENAME
    _id: String,

    // The date that this item was created
    created: {
        type: Date,
        default: Date.now
    },

    // The date that this item was updated
    modified: {
        type: Date
    },

    // Source is always set to "uploads"
    source: {
        type: String,
        default: uploadName,
        required: true
    },

    // The name of the original file (e.g. `foo.jpg`)
    fileName: {
        type: String,
        required: true
    },

    // The hashed contents of the image
    hash: {
        type: String,
        required: true
    },

    // The width of the image
    width: {
        type: Number,
        required: true,
        min: 1
    },

    // The height of the image
    height: {
        type: Number,
        required: true,
        min: 1
    },

    // Similar images (as determined by image similarity)
    similarImages: [{
        // The ID of the visually similar image
        _id: {
            type: String,
            required: true
        },

        // The similarity score between the images
        score: {
            type: Number,
            required: true,
            min: 1
        }
    }]
});

var getDirBase = function getDirBase() {
    return urls.genLocalFile(uploadName);
};

UploadImage.methods = Object.assign({}, Image.methods, {
    getFilePath: function getFilePath() {
        return path.resolve(getDirBase(), "images/" + this.hash + ".jpg");
    },


    // We don't save the uploaded files in the index so we override this
    // method to use `fileSimilar` to re-query every time.
    updateSimilarity: function updateSimilarity(callback) {
        var _this = this;

        var Image = models("Image");

        var file = this.getFilePath();

        similar.fileSimilar(file, function (err, matches) {
            /* istanbul ignore if */
            if (err) {
                return callback(err);
            }

            async.mapLimit(matches, 1, function (match, callback) {
                // Skip matches for the image itself
                if (match.id === _this.hash) {
                    return callback();
                }

                Image.findOne({
                    hash: match.id
                }, function (err, image) {
                    if (err || !image) {
                        return callback();
                    }

                    callback(null, {
                        _id: image._id,
                        score: match.score
                    });
                });
            }, function (err, matches) {
                _this.similarImages = matches.filter(function (match) {
                    return match;
                });
                callback();
            });
        });
    }
});

UploadImage.statics = Object.assign({}, Image.statics, {
    fromFile: function fromFile(file, callback) {
        var _this2 = this;

        var UploadImage = models("UploadImage");

        var sourceDir = getDirBase();

        this.processImage(file, sourceDir, function (err, hash) {
            if (err) {
                return callback(new Error("MALFORMED_IMAGE"));
            }

            _this2.getSize(file, function (err, size) {
                /* istanbul ignore if */
                if (err) {
                    return callback(new Error("MALFORMED_IMAGE"));
                }

                var width = size.width;
                var height = size.height;

                if (width <= 1 || height <= 1) {
                    return callback(new Error("EMPTY_IMAGE"));
                }

                if (width < 150 || height < 150) {
                    return callback(new Error("TOO_SMALL"));
                }

                var fileName = hash + ".jpg";
                var _id = uploadName + "/" + fileName;

                _this2.findById(_id, function (err, image) {
                    /* istanbul ignore if */
                    if (err) {
                        return callback(new Error("ERROR_RETRIEVING"));
                    }

                    if (image) {
                        return callback(null, image);
                    }

                    var model = new UploadImage({
                        _id: _id,
                        fileName: fileName,
                        hash: hash,
                        width: width,
                        height: height
                    });

                    model.validate(function (err) {
                        /* istanbul ignore if */
                        if (err) {
                            return callback(new Error("ERROR_SAVING"));
                        }

                        callback(null, model);
                    });
                });
            });
        });
    }
});

module.exports = UploadImage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL1VwbG9hZEltYWdlLmpzIl0sIm5hbWVzIjpbInBhdGgiLCJyZXF1aXJlIiwiYXN5bmMiLCJkYiIsIm1vZGVscyIsInVybHMiLCJzaW1pbGFyIiwiSW1hZ2UiLCJ1cGxvYWROYW1lIiwiVXBsb2FkSW1hZ2UiLCJzY2hlbWEiLCJfaWQiLCJTdHJpbmciLCJjcmVhdGVkIiwidHlwZSIsIkRhdGUiLCJkZWZhdWx0Iiwibm93IiwibW9kaWZpZWQiLCJzb3VyY2UiLCJyZXF1aXJlZCIsImZpbGVOYW1lIiwiaGFzaCIsIndpZHRoIiwiTnVtYmVyIiwibWluIiwiaGVpZ2h0Iiwic2ltaWxhckltYWdlcyIsInNjb3JlIiwiZ2V0RGlyQmFzZSIsImdlbkxvY2FsRmlsZSIsIm1ldGhvZHMiLCJPYmplY3QiLCJhc3NpZ24iLCJnZXRGaWxlUGF0aCIsInJlc29sdmUiLCJ1cGRhdGVTaW1pbGFyaXR5IiwiY2FsbGJhY2siLCJmaWxlIiwiZmlsZVNpbWlsYXIiLCJlcnIiLCJtYXRjaGVzIiwibWFwTGltaXQiLCJtYXRjaCIsImlkIiwiZmluZE9uZSIsImltYWdlIiwiZmlsdGVyIiwic3RhdGljcyIsImZyb21GaWxlIiwic291cmNlRGlyIiwicHJvY2Vzc0ltYWdlIiwiRXJyb3IiLCJnZXRTaXplIiwic2l6ZSIsImZpbmRCeUlkIiwibW9kZWwiLCJ2YWxpZGF0ZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsT0FBT0MsUUFBUSxNQUFSLENBQWI7O0FBRUEsSUFBTUMsUUFBUUQsUUFBUSxPQUFSLENBQWQ7O0FBRUEsSUFBTUUsS0FBS0YsUUFBUSxXQUFSLENBQVg7QUFDQSxJQUFNRyxTQUFTSCxRQUFRLGVBQVIsQ0FBZjtBQUNBLElBQU1JLE9BQU9KLFFBQVEsYUFBUixDQUFiO0FBQ0EsSUFBTUssVUFBVUwsUUFBUSxnQkFBUixDQUFoQjs7QUFFQSxJQUFNTSxRQUFRTixRQUFRLFNBQVIsQ0FBZDs7QUFFQSxJ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SixFQUFTO0FBQ0wsK0JBQU9ILFNBQVMsSUFBSWUsS0FBSixDQUFVLGtCQUFWLENBQVQsQ0FBUDtBQUNIOztBQUVELHdCQUFJTixLQUFKLEVBQVc7QUFDUCwrQkFBT1QsU0FBUyxJQUFULEVBQWVTLEtBQWYsQ0FBUDtBQUNIOztBQUVELHdCQUFNVSxRQUFRLElBQUkvQyxXQUFKLENBQWdCO0FBQzFCRSxnQ0FEMEI7QUFFMUJVLDBDQUYwQjtBQUcxQkMsa0NBSDBCO0FBSTFCQyxvQ0FKMEI7QUFLMUJHO0FBTDBCLHFCQUFoQixDQUFkOztBQVFBOEIsMEJBQU1DLFFBQU4sQ0FBZSxVQUFDakIsR0FBRCxFQUFTO0FBQ3BCO0FBQ0EsNEJBQUlBLEdBQUosRUFBUztBQUNMLG1DQUFPSCxTQUFTLElBQUllLEtBQUosQ0FBVSxjQUFWLENBQVQsQ0FBUDtBQUNIOztBQUVEZixpQ0FBUyxJQUFULEVBQWVtQixLQUFmO0FBQ0gscUJBUEQ7QUFRSCxpQkExQkQ7QUEyQkgsYUEvQ0Q7QUFnREgsU0FyREQ7QUFzREg7QUE1RGtELENBQWpDLENBQXRCOztBQStEQUUsT0FBT0MsT0FBUCxHQUFpQmxELFdBQWpCIiwiZmlsZSI6IlVwbG9hZEltYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuXG5jb25zdCBhc3luYyA9IHJlcXVpcmUoXCJhc3luY1wiKTtcblxuY29uc3QgZGIgPSByZXF1aXJlKFwiLi4vbGliL2RiXCIpO1xuY29uc3QgbW9kZWxzID0gcmVxdWlyZShcIi4uL2xpYi9tb2RlbHNcIik7XG5jb25zdCB1cmxzID0gcmVxdWlyZShcIi4uL2xpYi91cmxzXCIpO1xuY29uc3Qgc2ltaWxhciA9IHJlcXVpcmUoXCIuLi9saWIvc2ltaWxhclwiKTtcblxuY29uc3QgSW1hZ2UgPSByZXF1aXJlKFwiLi9JbWFnZVwiKTtcblxuY29uc3QgdXBsb2FkTmFtZSA9IFwidXBsb2Fkc1wiO1xuXG5jb25zdCBVcGxvYWRJbWFnZSA9IG5ldyBkYi5zY2hlbWEoe1xuICAgIC8vIEFuIElEIGZvciB0aGUgaW1hZ2UgaW4gdGhlIGZvcm06IFNPVVJDRS9JTUFHRU5BTUVcbiAgICBfaWQ6IFN0cmluZyxcblxuICAgIC8vIFRoZSBkYXRlIHRoYXQgdGhpcyBpdGVtIHdhcyBjcmVhdGVkXG4gICAgY3JlYXRlZDoge1xuICAgICAgICB0eXBlOiBEYXRlLFxuICAgICAgICBkZWZhdWx0OiBEYXRlLm5vdyxcbiAgICB9LFxuXG4gICAgLy8gVGhlIGRhdGUgdGhhdCB0aGlzIGl0ZW0gd2FzIHVwZGF0ZWRcbiAgICBtb2RpZmllZDoge1xuICAgICAgICB0eXBlOiBEYXRlLFxuICAgIH0sXG5cbiAgICAvLyBTb3VyY2UgaXMgYWx3YXlzIHNldCB0byBcInVwbG9hZHNcIlxuICAgIHNvdXJjZToge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIGRlZmF1bHQ6IHVwbG9hZE5hbWUsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIH0sXG5cbiAgICAvLyBUaGUgbmFtZSBvZiB0aGUgb3JpZ2luYWwgZmlsZSAoZS5nLiBgZm9vLmpwZ2ApXG4gICAgZmlsZU5hbWU6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICB9LFxuXG4gICAgLy8gVGhlIGhhc2hlZCBjb250ZW50cyBvZiB0aGUgaW1hZ2VcbiAgICBoYXNoOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgfSxcblxuICAgIC8vIFRoZSB3aWR0aCBvZiB0aGUgaW1hZ2VcbiAgICB3aWR0aDoge1xuICAgICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICBtaW46IDEsXG4gICAgfSxcblxuICAgIC8vIFRoZSBoZWlnaHQgb2YgdGhlIGltYWdlXG4gICAgaGVpZ2h0OiB7XG4gICAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIG1pbjogMSxcbiAgICB9LFxuXG4gICAgLy8gU2ltaWxhciBpbWFnZXMgKGFzIGRldGVybWluZWQgYnkgaW1hZ2Ugc2ltaWxhcml0eSlcbiAgICBzaW1pbGFySW1hZ2VzOiBbe1xuICAgICAgICAvLyBUaGUgSUQgb2YgdGhlIHZpc3VhbGx5IHNpbWlsYXIgaW1hZ2VcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBUaGUgc2ltaWxhcml0eSBzY29yZSBiZXR3ZWVuIHRoZSBpbWFnZXNcbiAgICAgICAgc2NvcmU6IHtcbiAgICAgICAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgbWluOiAxLFxuICAgICAgICB9LFxuICAgIH1dLFxufSk7XG5cbmNvbnN0IGdldERpckJhc2UgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdXJscy5nZW5Mb2NhbEZpbGUodXBsb2FkTmFtZSk7XG59O1xuXG5VcGxvYWRJbWFnZS5tZXRob2RzID0gT2JqZWN0LmFzc2lnbih7fSwgSW1hZ2UubWV0aG9kcywge1xuICAgIGdldEZpbGVQYXRoKCkge1xuICAgICAgICByZXR1cm4gcGF0aC5yZXNvbHZlKGdldERpckJhc2UoKSwgYGltYWdlcy8ke3RoaXMuaGFzaH0uanBnYCk7XG4gICAgfSxcblxuICAgIC8vIFdlIGRvbid0IHNhdmUgdGhlIHVwbG9hZGVkIGZpbGVzIGluIHRoZSBpbmRleCBzbyB3ZSBvdmVycmlkZSB0aGlzXG4gICAgLy8gbWV0aG9kIHRvIHVzZSBgZmlsZVNpbWlsYXJgIHRvIHJlLXF1ZXJ5IGV2ZXJ5IHRpbWUuXG4gICAgdXBkYXRlU2ltaWxhcml0eShjYWxsYmFjaykge1xuICAgICAgICBjb25zdCBJbWFnZSA9IG1vZGVscyhcIkltYWdlXCIpO1xuXG4gICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmdldEZpbGVQYXRoKCk7XG5cbiAgICAgICAgc2ltaWxhci5maWxlU2ltaWxhcihmaWxlLCAoZXJyLCBtYXRjaGVzKSA9PiB7XG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXN5bmMubWFwTGltaXQobWF0Y2hlcywgMSwgKG1hdGNoLCBjYWxsYmFjaykgPT4ge1xuICAgICAgICAgICAgICAgIC8vIFNraXAgbWF0Y2hlcyBmb3IgdGhlIGltYWdlIGl0c2VsZlxuICAgICAgICAgICAgICAgIGlmIChtYXRjaC5pZCA9PT0gdGhpcy5oYXNoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIEltYWdlLmZpbmRPbmUoe1xuICAgICAgICAgICAgICAgICAgICBoYXNoOiBtYXRjaC5pZCxcbiAgICAgICAgICAgICAgICB9LCAoZXJyLCBpbWFnZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyIHx8ICFpbWFnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IGltYWdlLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlOiBtYXRjaC5zY29yZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCAoZXJyLCBtYXRjaGVzKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaW1pbGFySW1hZ2VzID0gbWF0Y2hlcy5maWx0ZXIoKG1hdGNoKSA9PiBtYXRjaCk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxufSk7XG5cblVwbG9hZEltYWdlLnN0YXRpY3MgPSBPYmplY3QuYXNzaWduKHt9LCBJbWFnZS5zdGF0aWNzLCB7XG4gICAgZnJvbUZpbGUoZmlsZSwgY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3QgVXBsb2FkSW1hZ2UgPSBtb2RlbHMoXCJVcGxvYWRJbWFnZVwiKTtcblxuICAgICAgICBjb25zdCBzb3VyY2VEaXIgPSBnZXREaXJCYXNlKCk7XG5cbiAgICAgICAgdGhpcy5wcm9jZXNzSW1hZ2UoZmlsZSwgc291cmNlRGlyLCAoZXJyLCBoYXNoKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcihcIk1BTEZPUk1FRF9JTUFHRVwiKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZ2V0U2l6ZShmaWxlLCAoZXJyLCBzaXplKSA9PiB7XG4gICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKFwiTUFMRk9STUVEX0lNQUdFXCIpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCB3aWR0aCA9IHNpemUud2lkdGg7XG4gICAgICAgICAgICAgICAgY29uc3QgaGVpZ2h0ID0gc2l6ZS5oZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICBpZiAod2lkdGggPD0gMSB8fCBoZWlnaHQgPD0gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKFwiRU1QVFlfSU1BR0VcIikpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh3aWR0aCA8IDE1MCB8fCBoZWlnaHQgPCAxNTApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcihcIlRPT19TTUFMTFwiKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBgJHtoYXNofS5qcGdgO1xuICAgICAgICAgICAgICAgIGNvbnN0IF9pZCA9IGAke3VwbG9hZE5hbWV9LyR7ZmlsZU5hbWV9YDtcblxuICAgICAgICAgICAgICAgIHRoaXMuZmluZEJ5SWQoX2lkLCAoZXJyLCBpbWFnZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcihcIkVSUk9SX1JFVFJJRVZJTkdcIikpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGltYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgaW1hZ2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBuZXcgVXBsb2FkSW1hZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNoLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIG1vZGVsLnZhbGlkYXRlKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IoXCJFUlJPUl9TQVZJTkdcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBtb2RlbCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBVcGxvYWRJbWFnZTtcbiJdfQ==