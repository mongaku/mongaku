"use strict";

var bcrypt = require("bcrypt");

var models = require("../lib/models");
var db = require("../lib/db");

var User = new db.schema({
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
    var User = models("User");

    // Check only when it is a new user or when email field is modified
    /* istanbul ignore else */
    if (this.isNew || this.isModified("email")) {
        User.findOne({ email: email }, function (err, user) {
            callback(!err && !user);
        });
    } else {
        /* istanbul ignore next */
        callback(true);
    }
}, "Email already exists");

User.methods = {
    authenticate: function authenticate(plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },
    makeSalt: function makeSalt() {
        return bcrypt.genSaltSync(10);
    },
    encryptPassword: function encryptPassword(password) {
        if (!password) {
            return "";
        }

        try {
            return bcrypt.hashSync(password, this.salt);
        } catch (err) {
            /* istanbul ignore next */
            return "";
        }
    }
};

module.exports = User;