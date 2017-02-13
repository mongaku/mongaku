"use strict";

const async = require("async");

const db = require("../lib/db");
const models = require("../lib/models");
const urls = require("../lib/urls");

const Record = require("./Record");

const Upload = new db.schema({
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
    getTitle(i18n) {
        return i18n.gettext("Uploaded Image");
    },

    getURL(locale) {
        return urls.gen(locale, `/${this.type}/${this._id}`);
    },

    getImages(callback) {
        async.mapLimit(this.images, 4, (id, callback) => {
            if (typeof id !== "string") {
                return process.nextTick(() => callback(null, id));
            }
            models("UploadImage").findById(id, callback);
        }, callback);
    }
});

Upload.statics = Object.assign({}, Record.statics, {
    fromImage(image, type, callback) {
        const Upload = models("Upload");

        const _id = image._id.replace(/\.jpg$/, "");

        // Check to see if image already exists and redirect
        // if it does.
        Upload.findById(_id, (err, existing) => {
            /* istanbul ignore if */
            if (err) {
                return callback(err);
            }

            if (existing) {
                return callback(null, existing);
            }

            const upload = new Upload({
                _id,
                type,
                images: [image._id],
                defaultImageHash: image.hash
            });

            callback(null, upload);
        });
    }
});

module.exports = Upload;