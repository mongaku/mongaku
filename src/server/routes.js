// @flow

const options = require("../lib/options");

module.exports = function(app: express$Application) {
    const {auth} = require("../logic/shared/auth");

    if (options.authRequired) {
        app.use((req: express$Request, res, next) => {
            const {path} = req;

            if (path === "/login" || path === "/logout") {
                return next();
            }

            auth(req, res, next);
        });
    }

    // Import all the logic routes
    require("../logic/admin")(app).routes();
    require("../logic/source-admin")(app).routes();
    require("../logic/create")(app).routes();
    require("../logic/edit")(app).routes();
    require("../logic/home")(app).routes();
    require("../logic/search")(app).routes();
    require("../logic/sitemaps")(app).routes();
    require("../logic/uploads")(app).routes();
    require("../logic/users")(app).routes();

    // Keep at end as it has a catch-all route
    require("../logic/view")(app).routes();

    // Enable error handling and displaying of a 500 error page
    // when an exception is thrown
    app.use((err: ?Error, req: express$Request, res, next) => {
        /* istanbul ignore else */
        if (err) {
            res.status(500).render("Error", {
                title: err.message,
                body: err.stack,
            });
        } else {
            next();
        }
    });

    // Handle missing pages
    app.use(({i18n}: express$Request, res, next) => {
        res.status(404).render("Error", {
            title: i18n.gettext("Page Not Found"),
        });
        next();
    });
};
