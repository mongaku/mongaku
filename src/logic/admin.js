const fs = require("fs");
const path = require("path");
const {Readable} = require("stream");

const async = require("async");
const csv = require("csv-streamify");

const models = require("../lib/models");
const options = require("../lib/options");
const urls = require("../lib/urls")(options);

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
            const {i18n, lang} = req;
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
                    urls.gen(
                        lang,
                        `/admin?success=${encodeURIComponent(
                            i18n.format(
                                i18n.gettext(
                                    "Created or updated user: %(user)s",
                                ),
                                {user: user.email},
                            ),
                        )}`,
                    ),
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
            const {lang, i18n} = req;

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
                                urls.gen(
                                    lang,
                                    `/admin${
                                        qs.length > 0 ? `?${qs.join("&")}` : ""
                                    }`,
                                ),
                            );
                        },
                    );
                }),
            );
        },

        addSource(req, res, next) {
            const {i18n, lang} = req;
            const {
                _id,
                name,
                shortName,
                url,
                isPrivate,
                type,
                converter,
            } = req.body;

            const Source = models("Source");
            const source = new Source({
                _id,
                name,
                shortName,
                url,
                private: !!isPrivate,
                type,
                converter,
            });

            // Create directories to hold images
            try {
                const dir = source.getDirBase();
                fs.mkdirSync(dir, {recursive: true});
                fs.mkdirSync(path.join(dir, "images"), {recursive: true});
                fs.mkdirSync(path.join(dir, "scaled"), {recursive: true});
                fs.mkdirSync(path.join(dir, "thumbs"), {recursive: true});
            } catch (e) {
                return next(
                    new Error(
                        i18n.gettext(
                            "Error creating source image directories.",
                        ),
                    ),
                );
            }

            source.save(err => {
                if (err) {
                    return next(
                        new Error(i18n.gettext("Error creating source.")),
                    );
                }

                // Update the internal source cache
                Source.cacheSources(() => {
                    res.redirect(
                        urls.gen(
                            lang,
                            `/admin?success=${encodeURIComponent(
                                i18n.format(
                                    i18n.gettext(
                                        "New source created: %(source)s",
                                    ),
                                    {source: name},
                                ),
                            )}`,
                        ),
                    );
                });
            });
        },

        routes() {
            app.get("/admin", auth, isAdmin, this.admin);
            app.post("/admin/add-user", auth, isAdmin, this.addUser);
            app.post("/admin/add-users", auth, isAdmin, this.addUsers);
            app.post("/admin/add-source", auth, isAdmin, this.addSource);
        },
    };
};
