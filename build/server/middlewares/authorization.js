"use strict";

module.exports = {
    // Generic require login routing middleware
    requiresLogin: function requiresLogin(req, res, next) {
        if (!req.isAuthenticated()) {
            req.session.returnTo = req.originalUrl;
            return res.redirect("/login");
        }
        next();
    },


    // User authorization routing middleware
    hasAuthorization: function hasAuthorization(req, res, next) {
        if (req.profile.id !== req.user.id) {
            // TODO(jeresig): Come up with a way to display messages
            //req.flash("info", "You are not authorized");
            return res.redirect("/users/" + req.profile.id);
        }
        next();
    }
};