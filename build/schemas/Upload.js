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