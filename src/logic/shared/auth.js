const passport = require("passport");

const urls = require("../../lib/urls");

// Only allow certain users to access these pages
module.exports = (req, res, next) => {
    passport.authenticate("local", () => {
        if (!req.user) {
            req.session.redirectTo = req.originalUrl;
            res.redirect(urls.gen(req.lang, "/login"));
        } else if (!req.user.canEditSource(req.params.source)) {
            next(new Error(req.gettext("Authorization required.")));
        } else {
            next();
        }
    })(req, res, next);
};
