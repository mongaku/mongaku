const {Readable} = require("stream");

const async = require("async");
const csv = require("csv-streamify");

const models = require("../lib/models");
const options = require("../lib/options");
const urls = require("../lib/urls")(options);
const {cloneModel} = require("../lib/clone");

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

const addSource = (
    {_id, name, shortName, url, isPrivate, type, converter},
    i18n,
    callback,
) => {
    if (!_id || !name || !shortName) {
        return callback(
            new Error(i18n.gettext("Required field not provided.")),
        );
    }

    if (!/^[a-z0-9-]+$/.test(_id)) {
        return callback(
            new Error(
                "Invalid character specified for ID (only letters, numbers, and hyphen allowed).",
            ),
        );
    }

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
        source.createDirectories();
    } catch (e) {
        return callback(
            new Error(i18n.gettext("Error creating source image directories.")),
        );
    }

    source.save(err => {
        if (err) {
            return callback(new Error(i18n.gettext("Error creating source.")));
        }

        return callback();
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

        addUserPage(req, res) {
            const {i18n, query} = req;
            res.render("AddUser", {
                title: i18n.gettext("Add or Update User"),
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
                        `/admin/add-user?success=${encodeURIComponent(
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

        addUsersPage(req, res) {
            const {i18n, query} = req;
            res.render("AddUsers", {
                title: i18n.gettext("Bulk Add or Update Users"),
                success: query.success,
                error: query.error,
            });
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
                                    `/admin/add-users${
                                        qs.length > 0 ? `?${qs.join("&")}` : ""
                                    }`,
                                ),
                            );
                        },
                    );
                }),
            );
        },

        addSourcePage(req, res) {
            const {i18n, query} = req;
            res.render("AddSource", {
                title: i18n.gettext("Add or Update Source"),
                success: query.success,
                error: query.error,
            });
        },

        addSource(req, res, next) {
            const {i18n, lang} = req;

            addSource(req.body, i18n, err => {
                if (err) {
                    return next(err);
                }

                // Update the internal source cache
                const Source = models("Source");
                Source.cacheSources(() => {
                    res.redirect(
                        urls.gen(
                            lang,
                            `/admin/manage-sources?success=${encodeURIComponent(
                                i18n.format(
                                    i18n.gettext(
                                        "New source created: %(source)s",
                                    ),
                                    {source: req.body.name},
                                ),
                            )}`,
                        ),
                    );
                });
            });
        },

        addSourcesPage(req, res) {
            const {i18n, query} = req;
            res.render("AddSources", {
                title: i18n.gettext("Bulk Add or Update Sources"),
                success: query.success,
                error: query.error,
            });
        },

        addSources(req, res, next) {
            const {i18n, lang} = req;
            const {isPrivate, type, converter, sources} = req.body;

            let createdOrUpdated = 0;
            const failed = [];

            const stream = new Readable();
            stream.push(sources);
            stream.push(null);

            stream.pipe(
                csv({objectMode: true}, (err, results) => {
                    if (err) {
                        return next(
                            new Error(
                                i18n.gettext("Error parsing source data."),
                            ),
                        );
                    }

                    async.eachLimit(
                        results,
                        4,
                        ([_id, name, shortName, url], callback) => {
                            addSource(
                                {
                                    _id,
                                    name,
                                    shortName,
                                    url,
                                    isPrivate,
                                    type,
                                    converter,
                                },
                                i18n,
                                err => {
                                    if (err) {
                                        failed.push(name);
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
                                                "Created or updated %(num)s sources.",
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
                                                "Failed to create or update %(num)s sources, including: %(failed)s",
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

                            // Update the internal source cache
                            const Source = models("Source");
                            Source.cacheSources(() => {
                                res.redirect(
                                    urls.gen(
                                        lang,
                                        `/admin/manage-sources${
                                            qs.length > 0
                                                ? `?${qs.join("&")}`
                                                : ""
                                        }`,
                                    ),
                                );
                            });
                        },
                    );
                }),
            );
        },

        manageSourcesPage(req, res) {
            const {i18n, query, user} = req;
            const Source = models("Source");

            // Only show sources on the homepage that the user is allowed to see
            const sources = Source.getSourcesByViewable(user)
                .map(source => {
                    const cloned = cloneModel(source, i18n);
                    cloned.numRecords = source.numRecords;
                    cloned.numImages = source.numImages;
                    return cloned;
                })
                .sort((a, b) => a._id.localeCompare(b._id));

            res.render("ManageSources", {
                title: i18n.gettext("Manage Sources"),
                success: query.success,
                error: query.error,
                sources,
            });
        },

        routes() {
            app.get("/admin", auth, isAdmin, this.admin);
            app.get("/admin/add-user", auth, isAdmin, this.addUserPage);
            app.post("/admin/add-user", auth, isAdmin, this.addUser);
            app.get("/admin/add-users", auth, isAdmin, this.addUsersPage);
            app.post("/admin/add-users", auth, isAdmin, this.addUsers);
            app.get("/admin/add-source", auth, isAdmin, this.addSourcePage);
            app.post("/admin/add-source", auth, isAdmin, this.addSource);
            app.get("/admin/add-sources", auth, isAdmin, this.addSourcesPage);
            app.post("/admin/add-sources", auth, isAdmin, this.addSources);
            app.get(
                "/admin/manage-sources",
                auth,
                isAdmin,
                this.manageSourcesPage,
            );
        },
    };
};
