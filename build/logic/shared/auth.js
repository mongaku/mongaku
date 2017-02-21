"use strict";

const passport = require("passport");

const options = require("../../lib/options");
const urls = require("../../lib/urls")(options);

// Only allow certain users to access these pages
module.exports = (req, res, next) => {
    const { user, session, originalUrl, lang, i18n, params } = req;

    passport.authenticate("local", () => {
        if (!user) {
            session.redirectTo = originalUrl;
            res.redirect(urls.gen(lang, "/login"));
        } else if (!user.canEditSource(params.source)) {
            next(new Error(i18n.gettext("Authorization required.")));
        } else {
            next();
        }
    })(req, res, next);
};