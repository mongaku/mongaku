"use strict";

const bcrypt = require("bcrypt");

const models = require("../lib/models");
const db = require("../lib/db");

const User = new db.schema({
    // The email address of the user, must be unique
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    // The Bcrypt-hashed password
    hashedPassword: {
        type: String,
        required: true
    },

    // Hashed using the following salt
    salt: {
        type: String,
        required: true
    },

    // The sources to which the user is an administrator
    sourceAdmin: {
        type: [{
            type: String,
            ref: "Source"
        }]
    },

    // If this user is a site administrator
    // (can create new sources and other admins)
    siteAdmin: {
        type: Boolean,
        default: false
    }
});

User.virtual("password").set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
}).get(function () {
    return this._password;
});

User.path("email").validate(function (email, callback) {
    const User = models("User");

    // Check only when it is a new user or when email field is modified
    /* istanbul ignore else */
    if (this.isNew || this.isModified("email")) {
        User.findOne({ email: email }, (err, user) => {
            callback(!err && !user);
        });
    } else {
        /* istanbul ignore next */
        callback(true);
    }
}, "Email already exists");

User.methods = {
    authenticate(plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },

    makeSalt() {
        return bcrypt.genSaltSync(10);
    },

    encryptPassword(password) {
        if (!password) {
            return "";
        }

        try {
            return bcrypt.hashSync(password, this.salt);
        } catch (err) {
            /* istanbul ignore next */
            return "";
        }
    },

    canEditSource(source) {
        return this.siteAdmin || this.sourceAdmin.indexOf(source) >= 0;
    },

    getEditableSourcesByType(type) {
        const Source = models("Source");
        const sources = Source.getSourcesByType(type).map(source => source._id).filter(source => this.canEditSource(source));
        return sources;
    }
};

module.exports = User;