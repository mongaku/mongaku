// @flow

const bcrypt = require("bcrypt");

const models = require("../lib/models");
const db = require("../lib/db");

const User = new db.schema({
    // The email address of the user, must be unique
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        validate: {
            isAsync: true,
            message: "Email already exists",
            validator: function(email, callback) {
                const User = models("User");

                // Check only when it is a new user or when email field is modified
                /* istanbul ignore else */
                if (this.isNew || this.isModified("email")) {
                    User.findOne({email: email}, (err, user) => {
                        callback(!err && !user);
                    });
                } else {
                    /* istanbul ignore next */
                    callback(true);
                }
            },
        },
    },

    // The Bcrypt-hashed password
    hashedPassword: {
        type: String,
        required: true,
    },

    // Hashed using the following salt
    salt: {
        type: String,
        required: true,
    },

    // The sources to which the user is an administrator
    sourceAdmin: {
        type: [
            {
                type: String,
                ref: "Source",
            },
        ],
    },

    // If this user is a site administrator
    // (can create new sources and other admins)
    siteAdmin: {
        type: Boolean,
        default: false,
    },

    // Can this user view private sources?
    canViewPrivateSources: {
        type: Boolean,
        default: false,
    },
});

const makeSalt = (): string => bcrypt.genSaltSync(10);

User.virtual("password")
    .set(function(password: string) {
        this._password = password;
        this.salt = makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

User.methods = {
    authenticate(plainText: string): boolean {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },

    encryptPassword(password: string) {
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

    canEditSource(source: string) {
        return this.siteAdmin || this.sourceAdmin.indexOf(source) >= 0;
    },

    getEditableSourcesByType(): {[type: string]: Array<string>} {
        const Source = models("Source");
        const types = {};
        const sources = Source.getSourcesByViewable(this);

        for (const source of sources) {
            if (!types[source.type]) {
                types[source.type] = [];
            }

            if (!this.canEditSource(source)) {
                continue;
            }

            types[source.type].push(source._id);
        }

        return types;
    },
};

module.exports = User;
