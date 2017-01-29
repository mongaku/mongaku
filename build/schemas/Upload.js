"use strict";

var async = require("async");

var db = require("../lib/db");
var models = require("../lib/models");
var urls = require("../lib/urls");

var Record = require("./Record");

var Upload = new db.schema({
    // UUID of the image (Format: uploads/defaultImageHash)
    _id: {
        type: String,
        es_indexed: true
    },

    // The type of the upload
    type: {
        type: String,
        required: true
    },

    // The date that this item was created
    created: {
        type: Date,
        default: Date.now
    },

    // The date that this item was updated
    modified: Date,

    // Source is always set to "uploads"
    source: {
        type: String,
        default: "uploads",
        required: true
    },

    // A hash to use to render an image representing the record
    defaultImageHash: {
        type: String,
        required: true
    },

    // The images associated with the upload
    images: {
        type: [{ type: String, ref: "UploadImage" }],
        required: true
    },

    // Computed by looking at the results of images.similarImages
    similarRecords: [{
        _id: String,

        record: {
            type: String,
            ref: "Record",
            required: true
        },

        images: {
            type: [String],
            required: true
        },

        source: {
            type: String,
            es_indexed: true,
            required: true
        },

        score: {
            type: Number,
            es_indexed: true,
            required: true,
            min: 1
        }
    }]
});

Upload.methods = Object.assign({}, Record.methods, {
    getTitle: function getTitle(req) {
        return req.gettext("Uploaded Image");
    },
    getURL: function getURL(locale) {
        return urls.gen(locale, "/" + this.type + "/" + this._id);
    },
    getImages: function getImages(callback) {
        async.mapLimit(this.images, 4, function (id, callback) {
            if (typeof id !== "string") {
                return process.nextTick(function () {
                    return callback(null, id);
                });
            }
            models("UploadImage").findById(id, callback);
        }, callback);
    }
});

Upload.statics = Object.assign({}, Record.statics, {
    fromImage: function fromImage(image, type, callback) {
        var Upload = models("Upload");

        var _id = image._id.replace(/\.jpg$/, "");

        // Check to see if image already exists and redirect
        // if it does.
        Upload.findById(_id, function (err, existing) {
            /* istanbul ignore if */
            if (err) {
                return callback(err);
            }

            if (existing) {
                return callback(null, existing);
            }

            var upload = new Upload({
                _id: _id,
                type: type,
                images: [image._id],
                defaultImageHash: image.hash
            });

            callback(null, upload);
        });
    }
});

module.exports = Upload;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY2hlbWFzL1VwbG9hZC5qcyJdLCJuYW1lcyI6WyJhc3luYyIsInJlcXVpcmUiLCJkYiIsIm1vZGVscyIsInVybHMiLCJSZWNvcmQiLCJVcGxvYWQiLCJzY2hlbWEiLCJfaWQiLCJ0eXBlIiwiU3RyaW5nIiwiZXNfaW5kZXhlZCIsInJlcXVpcmVkIiwiY3JlYXRlZCIsIkRhdGUiLCJkZWZhdWx0Iiwibm93IiwibW9kaWZpZWQiLCJzb3VyY2UiLCJkZWZhdWx0SW1hZ2VIYXNoIiwiaW1hZ2VzIiwicmVmIiwic2ltaWxhclJlY29yZHMiLCJyZWNvcmQiLCJzY29yZSIsIk51bWJlciIsIm1pbiIsIm1ldGhvZHMiLCJPYmplY3QiLCJhc3NpZ24iLCJnZXRUaXRsZSIsInJlcSIsImdldHRleHQiLCJnZXRVUkwiLCJsb2NhbGUiLCJnZW4iLCJnZXRJbWFnZXMiLCJjYWxsYmFjayIsIm1hcExpbWl0IiwiaWQiLCJwcm9jZXNzIiwibmV4dFRpY2siLCJmaW5kQnlJZCIsInN0YXRpY3MiLCJmcm9tSW1hZ2UiLCJpbWFnZSIsInJlcGxhY2UiLCJlcnIiLCJleGlzdGluZyIsInVwbG9hZCIsImhhc2giLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFFBQVFDLFFBQVEsT0FBUixDQUFkOztBQUVBLElBQU1DLEtBQUtELFFBQVEsV0FBUixDQUFYO0FBQ0EsSUFBTUUsU0FBU0YsUUFBUSxlQUFSLENBQWY7QUFDQSxJQUFNRyxPQUFPSCxRQUFRLGFBQVIsQ0FBYjs7QUFFQSxJQUFNSSxTQUFTSixRQUFRLFVBQVIsQ0FBZjs7QUFFQSxJQUFNSyxTQUFTLElBQUlKLEdBQUdLLE1BQVAsQ0FBYztBQUN6QjtBQUNBQyxTQUFLO0FBQ0RDLGNBQU1DLE1BREw7QUFFREMsb0JBQVk7QUFGWCxLQUZvQjs7QUFPekI7QUFDQUYsVUFBTztBQUNIQSxjQUFNQyxNQURIO0FBRUhFLGtCQUFVO0FBRlAsS0FSa0I7O0FBYXpCO0FBQ0FDLGFBQVM7QUFDTEosY0FBTUssSUFERDtBQUVMQyxpQkFBU0QsS0FBS0U7QUFGVCxLQWRnQjs7QUFtQnpCO0FBQ0FDLGNBQVVILElBcEJlOztBQXNCekI7QUFDQUksWUFBUTtBQUNKVCxjQUFNQyxNQURGO0FBRUpLLGlCQUFTLFNBRkw7QUFHSkgsa0JBQVU7QUFITixLQXZCaUI7O0FBNkJ6QjtBQUNBTyxzQkFBa0I7QUFDZFYsY0FBTUMsTUFEUTtBQUVkRSxrQkFBVTtBQUZJLEtBOUJPOztBQW1DekI7QUFDQVEsWUFBUTtBQUNKWCxjQUFNLENBQUMsRUFBQ0EsTUFBTUMsTUFBUCxFQUFlVyxLQUFLLGFBQXBCLEVBQUQsQ0FERjtBQUVKVCxrQkFBVTtBQUZOLEtBcENpQjs7QUF5Q3pCO0FBQ0FVLG9CQUFnQixDQUFDO0FBQ2JkLGFBQUtFLE1BRFE7O0FBR2JhLGdCQUFRO0FBQ0pkLGtCQUFNQyxNQURGO0FBRUpXLGlCQUFLLFFBRkQ7QUFHSlQsc0JBQVU7QUFITixTQUhLOztBQVNiUSxnQkFBUTtBQUNKWCxrQkFBTSxDQUFDQyxNQUFELENBREY7QUFFSkUsc0JBQVU7QUFGTixTQVRLOztBQWNiTSxnQkFBUTtBQUNKVCxrQkFBTUMsTUFERjtBQUVKQyx3QkFBWSxJQUZSO0FBR0pDLHNCQUFVO0FBSE4sU0FkSzs7QUFvQmJZLGVBQU87QUFDSGYsa0JBQU1nQixNQURIO0FBRUhkLHdCQUFZLElBRlQ7QUFHSEMsc0JBQVUsSUFIUDtBQUlIYyxpQkFBSztBQUpGO0FBcEJNLEtBQUQ7QUExQ1MsQ0FBZCxDQUFmOztBQXVFQXBCLE9BQU9xQixPQUFQLEdBQWlCQyxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQnhCLE9BQU9zQixPQUF6QixFQUFrQztBQUMvQ0csWUFEK0Msb0JBQ3RDQyxHQURzQyxFQUNqQztBQUNWLGVBQU9BLElBQUlDLE9BQUosQ0FBWSxnQkFBWixDQUFQO0FBQ0gsS0FIOEM7QUFLL0NDLFVBTCtDLGtCQUt4Q0MsTUFMd0MsRUFLaEM7QUFDWCxlQUFPOUIsS0FBSytCLEdBQUwsQ0FBU0QsTUFBVCxRQUFxQixLQUFLekIsSUFBMUIsU0FBa0MsS0FBS0QsR0FBdkMsQ0FBUDtBQUNILEtBUDhDO0FBUy9DNEIsYUFUK0MscUJBU3JDQyxRQVRxQyxFQVMzQjtBQUNoQnJDLGNBQU1zQyxRQUFOLENBQWUsS0FBS2xCLE1BQXBCLEVBQTRCLENBQTVCLEVBQStCLFVBQUNtQixFQUFELEVBQUtGLFFBQUwsRUFBa0I7QUFDN0MsZ0JBQUksT0FBT0UsRUFBUCxLQUFjLFFBQWxCLEVBQTRCO0FBQ3hCLHVCQUFPQyxRQUFRQyxRQUFSLENBQWlCO0FBQUEsMkJBQU1KLFNBQVMsSUFBVCxFQUFlRSxFQUFmLENBQU47QUFBQSxpQkFBakIsQ0FBUDtBQUNIO0FBQ0RwQyxtQkFBTyxhQUFQLEVBQXNCdUMsUUFBdEIsQ0FBK0JILEVBQS9CLEVBQW1DRixRQUFuQztBQUNILFNBTEQsRUFLR0EsUUFMSDtBQU1IO0FBaEI4QyxDQUFsQyxDQUFqQjs7QUFtQkEvQixPQUFPcUMsT0FBUCxHQUFpQmYsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0J4QixPQUFPc0MsT0FBekIsRUFBa0M7QUFDL0NDLGFBRCtDLHFCQUNyQ0MsS0FEcUMsRUFDOUJwQyxJQUQ4QixFQUN4QjRCLFFBRHdCLEVBQ2Q7QUFDN0IsWUFBTS9CLFNBQVNILE9BQU8sUUFBUCxDQUFmOztBQUVBLFlBQU1LLE1BQU1xQyxNQUFNckMsR0FBTixDQUFVc0MsT0FBVixDQUFrQixRQUFsQixFQUE0QixFQUE1QixDQUFaOztBQUVBO0FBQ0E7QUFDQXhDLGVBQU9vQyxRQUFQLENBQWdCbEMsR0FBaEIsRUFBcUIsVUFBQ3VDLEdBQUQsRUFBTUMsUUFBTixFQUFtQjtBQUNwQztBQUNBLGdCQUFJRCxHQUFKLEVBQVM7QUFDTCx1QkFBT1YsU0FBU1UsR0FBVCxDQUFQO0FBQ0g7O0FBRUQsZ0JBQUlDLFFBQUosRUFBYztBQUNWLHVCQUFPWCxTQUFTLElBQVQsRUFBZVcsUUFBZixDQUFQO0FBQ0g7O0FBRUQsZ0JBQU1DLFNBQVMsSUFBSTNDLE1BQUosQ0FBVztBQUN0QkUsd0JBRHNCO0FBRXRCQywwQkFGc0I7QUFHdEJXLHdCQUFRLENBQUN5QixNQUFNckMsR0FBUCxDQUhjO0FBSXRCVyxrQ0FBa0IwQixNQUFNSztBQUpGLGFBQVgsQ0FBZjs7QUFPQWIscUJBQVMsSUFBVCxFQUFlWSxNQUFmO0FBQ0gsU0FsQkQ7QUFtQkg7QUEzQjhDLENBQWxDLENBQWpCOztBQThCQUUsT0FBT0MsT0FBUCxHQUFpQjlDLE1BQWpCIiwiZmlsZSI6IlVwbG9hZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGFzeW5jID0gcmVxdWlyZShcImFzeW5jXCIpO1xuXG5jb25zdCBkYiA9IHJlcXVpcmUoXCIuLi9saWIvZGJcIik7XG5jb25zdCBtb2RlbHMgPSByZXF1aXJlKFwiLi4vbGliL21vZGVsc1wiKTtcbmNvbnN0IHVybHMgPSByZXF1aXJlKFwiLi4vbGliL3VybHNcIik7XG5cbmNvbnN0IFJlY29yZCA9IHJlcXVpcmUoXCIuL1JlY29yZFwiKTtcblxuY29uc3QgVXBsb2FkID0gbmV3IGRiLnNjaGVtYSh7XG4gICAgLy8gVVVJRCBvZiB0aGUgaW1hZ2UgKEZvcm1hdDogdXBsb2Fkcy9kZWZhdWx0SW1hZ2VIYXNoKVxuICAgIF9pZDoge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIGVzX2luZGV4ZWQ6IHRydWUsXG4gICAgfSxcblxuICAgIC8vIFRoZSB0eXBlIG9mIHRoZSB1cGxvYWRcbiAgICB0eXBlOiAge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIH0sXG5cbiAgICAvLyBUaGUgZGF0ZSB0aGF0IHRoaXMgaXRlbSB3YXMgY3JlYXRlZFxuICAgIGNyZWF0ZWQ6IHtcbiAgICAgICAgdHlwZTogRGF0ZSxcbiAgICAgICAgZGVmYXVsdDogRGF0ZS5ub3csXG4gICAgfSxcblxuICAgIC8vIFRoZSBkYXRlIHRoYXQgdGhpcyBpdGVtIHdhcyB1cGRhdGVkXG4gICAgbW9kaWZpZWQ6IERhdGUsXG5cbiAgICAvLyBTb3VyY2UgaXMgYWx3YXlzIHNldCB0byBcInVwbG9hZHNcIlxuICAgIHNvdXJjZToge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIGRlZmF1bHQ6IFwidXBsb2Fkc1wiLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICB9LFxuXG4gICAgLy8gQSBoYXNoIHRvIHVzZSB0byByZW5kZXIgYW4gaW1hZ2UgcmVwcmVzZW50aW5nIHRoZSByZWNvcmRcbiAgICBkZWZhdWx0SW1hZ2VIYXNoOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgfSxcblxuICAgIC8vIFRoZSBpbWFnZXMgYXNzb2NpYXRlZCB3aXRoIHRoZSB1cGxvYWRcbiAgICBpbWFnZXM6IHtcbiAgICAgICAgdHlwZTogW3t0eXBlOiBTdHJpbmcsIHJlZjogXCJVcGxvYWRJbWFnZVwifV0sXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIH0sXG5cbiAgICAvLyBDb21wdXRlZCBieSBsb29raW5nIGF0IHRoZSByZXN1bHRzIG9mIGltYWdlcy5zaW1pbGFySW1hZ2VzXG4gICAgc2ltaWxhclJlY29yZHM6IFt7XG4gICAgICAgIF9pZDogU3RyaW5nLFxuXG4gICAgICAgIHJlY29yZDoge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgcmVmOiBcIlJlY29yZFwiLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIH0sXG5cbiAgICAgICAgaW1hZ2VzOiB7XG4gICAgICAgICAgICB0eXBlOiBbU3RyaW5nXSxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICB9LFxuXG4gICAgICAgIHNvdXJjZToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgZXNfaW5kZXhlZDogdHJ1ZSxcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICB9LFxuXG4gICAgICAgIHNjb3JlOiB7XG4gICAgICAgICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICAgICAgICBlc19pbmRleGVkOiB0cnVlLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBtaW46IDEsXG4gICAgICAgIH0sXG4gICAgfV0sXG59KTtcblxuVXBsb2FkLm1ldGhvZHMgPSBPYmplY3QuYXNzaWduKHt9LCBSZWNvcmQubWV0aG9kcywge1xuICAgIGdldFRpdGxlKHJlcSkge1xuICAgICAgICByZXR1cm4gcmVxLmdldHRleHQoXCJVcGxvYWRlZCBJbWFnZVwiKTtcbiAgICB9LFxuXG4gICAgZ2V0VVJMKGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gdXJscy5nZW4obG9jYWxlLCBgLyR7dGhpcy50eXBlfS8ke3RoaXMuX2lkfWApO1xuICAgIH0sXG5cbiAgICBnZXRJbWFnZXMoY2FsbGJhY2spIHtcbiAgICAgICAgYXN5bmMubWFwTGltaXQodGhpcy5pbWFnZXMsIDQsIChpZCwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaWQgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvY2Vzcy5uZXh0VGljaygoKSA9PiBjYWxsYmFjayhudWxsLCBpZCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbW9kZWxzKFwiVXBsb2FkSW1hZ2VcIikuZmluZEJ5SWQoaWQsIGNhbGxiYWNrKTtcbiAgICAgICAgfSwgY2FsbGJhY2spO1xuICAgIH0sXG59KTtcblxuVXBsb2FkLnN0YXRpY3MgPSBPYmplY3QuYXNzaWduKHt9LCBSZWNvcmQuc3RhdGljcywge1xuICAgIGZyb21JbWFnZShpbWFnZSwgdHlwZSwgY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3QgVXBsb2FkID0gbW9kZWxzKFwiVXBsb2FkXCIpO1xuXG4gICAgICAgIGNvbnN0IF9pZCA9IGltYWdlLl9pZC5yZXBsYWNlKC9cXC5qcGckLywgXCJcIik7XG5cbiAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIGltYWdlIGFscmVhZHkgZXhpc3RzIGFuZCByZWRpcmVjdFxuICAgICAgICAvLyBpZiBpdCBkb2VzLlxuICAgICAgICBVcGxvYWQuZmluZEJ5SWQoX2lkLCAoZXJyLCBleGlzdGluZykgPT4ge1xuICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChleGlzdGluZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBleGlzdGluZyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHVwbG9hZCA9IG5ldyBVcGxvYWQoe1xuICAgICAgICAgICAgICAgIF9pZCxcbiAgICAgICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgICAgIGltYWdlczogW2ltYWdlLl9pZF0sXG4gICAgICAgICAgICAgICAgZGVmYXVsdEltYWdlSGFzaDogaW1hZ2UuaGFzaCxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1cGxvYWQpO1xuICAgICAgICB9KTtcbiAgICB9LFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVXBsb2FkO1xuIl19