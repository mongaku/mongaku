module.exports = {
    // Generic require login routing middleware
    requiresLogin(req, res, next) {
        const {session, originalUrl} = req;
        if (!req.isAuthenticated()) {
            session.returnTo = originalUrl;
            return res.redirect("/login");
        }
        next();
    },

    // User authorization routing middleware
    hasAuthorization({profile, user}, res, next) {
        if (profile.id !== user.id) {
            // TODO(jeresig): Come up with a way to display messages
            return res.redirect(`/users/${profile.id}`);
        }
        next();
    },
};
