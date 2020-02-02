const passport = require("passport");

const options = require("../../lib/options");
const urls = require("../../lib/urls")(options);
const models = require("../../lib/models");

// Only allow certain users to access these pages
const auth = (req, res, next) => {
    const {user, session, originalUrl, lang} = req;

    passport.authenticate("local", () => {
        if (!user) {
            session.redirectTo = originalUrl;
            res.redirect(urls.gen(lang, "/login"));
        } else {
            next();
        }
    })(req, res, next);
};

const canEdit = ({user, params: {type, source}, i18n}, res, next) => {
    if (!options.types[type]) {
        return res.status(404).render("Error", {
            title: i18n.gettext("Page not found."),
        });
    }

    if (source) {
        try {
            const Source = models("Source");
            Source.getSource(source);
        } catch (e) {
            return res.status(404).render("Error", {
                title: i18n.gettext("Source not found."),
            });
        }

        const sources = user.getEditableSourcesByType()[type];

        if (!sources.includes(source)) {
            return res.status(403).render("Error", {
                title: i18n.gettext("Authorization required."),
            });
        }
    }

    next();
};

const isAdmin = ({user}, res, next) => {
    if (!user.siteAdmin) {
        return res.status(403).render("Error", {
            title: i18n.gettext("Authorization required."),
        });
    }

    next();
};

module.exports = {auth, canEdit, isAdmin};
