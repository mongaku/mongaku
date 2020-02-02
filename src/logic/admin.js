const fs = require("fs");
const {Readable} = require("stream");

const async = require("async");
const formidable = require("formidable");
const csv = require("csv-streamify");

const models = require("../lib/models");
const record = require("../lib/record");

const addUser = (
    {email, password, canViewPrivateSources, siteAdmin},
    callback,
) => {
    const User = models("User");

    User.findOne({email}, (err, user) => {
        if (user) {
            user.email = email;
            user.password = password;
            user.canViewPrivateSources = !!canViewPrivateSources;
            user.siteAdmin = !!siteAdmin;
            const error = user.validateSync();
            if (error) {
                return callback(error);
            }
            user.save({validateBeforeSave: false}, callback);
            return;
        }

        const newUser = new User({
            email,
            password,
            canViewPrivateSources: !!canViewPrivateSources,
            siteAdmin: !!siteAdmin,
        });

        newUser.save(callback);
    });
};

module.exports = function(app) {
    const {auth, isAdmin} = require("./shared/auth");

    return {
        admin(req, res) {
            const {i18n, query} = req;
            res.render("Admin", {
                title: i18n.gettext("Admin"),
                success: query.success,
                error: query.error,
            });
        },

        addUser(req, res, next) {
            const {i18n} = req;
            const {
                username: email,
                password,
                canViewPrivateSources,
                siteAdmin,
            } = req.body;

            const handleSave = (err, user) => {
                if (err) {
                    return next(
                        new Error(
                            i18n.gettext("Error creating or updating user."),
                        ),
                    );
                }

                res.redirect(
                    `/admin?success=${encodeURIComponent(
                        i18n.format(
                            i18n.gettext("Created or updated user: %(user)s"),
                            {user: user.email},
                        ),
                    )}`,
                );
            };

            addUser(
                {
                    email,
                    password,
                    canViewPrivateSources,
                    siteAdmin,
                },
                handleSave,
            );
        },

        addUsers(req, res, next) {
            const {i18n} = req;

            let createdOrUpdated = 0;
            const failed = [];

            const stream = new Readable();
            stream.push(req.body.usernames);
            stream.push(null);

            stream.pipe(
                csv({objectMode: true}, (err, results) => {
                    if (err) {
                        return next(
                            new Error(
                                i18n.gettext(
                                    "Error parsing usernames and passwords.",
                                ),
                            ),
                        );
                    }

                    async.eachLimit(
                        results,
                        4,
                        ([username, password], callback) => {
                            addUser(
                                {
                                    email: username,
                                    password,
                                    canViewPrivateSources:
                                        req.body.canViewPrivateSources,
                                    siteAdmin: req.body.siteAdmin,
                                },
                                err => {
                                    if (err) {
                                        failed.push(username);
                                    } else {
                                        createdOrUpdated += 1;
                                    }
                                    callback();
                                },
                            );
                        },
                        () => {
                            if (err) {
                                return next(err);
                            }

                            const qs = [];

                            if (createdOrUpdated > 0) {
                                qs.push(
                                    `success=${encodeURIComponent(
                                        i18n.format(
                                            i18n.gettext(
                                                "Created or updated %(num)s users.",
                                            ),
                                            {num: createdOrUpdated},
                                        ),
                                    )}`,
                                );
                            }

                            if (failed.length > 0) {
                                qs.push(
                                    `error=${encodeURIComponent(
                                        i18n.format(
                                            i18n.gettext(
                                                "Failed to create or update %(num)s users, including: %(failed)s",
                                            ),
                                            {
                                                num: failed.length,
                                                failed: failed
                                                    .slice(0, 10)
                                                    .join(", "),
                                            },
                                        ),
                                    )}`,
                                );
                            }

                            res.redirect(
                                `/admin${
                                    qs.length > 0 ? "?" + qs.join("&") : ""
                                }`,
                            );
                        },
                    );
                }),
            );
        },

        routes() {
            app.get("/admin", auth, isAdmin, this.admin);
            app.post("/admin/add-user", auth, isAdmin, this.addUser);
            app.post("/admin/add-users", auth, isAdmin, this.addUsers);
        },
    };
};
