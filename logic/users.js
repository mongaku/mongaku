const passport = require("passport");

const urls = require("../lib/urls");

module.exports = (app) => {
    return {
        login(req, res) {
            res.render("Login", {});
        },

        loginRedirect(req, res, next) {
            passport.authenticate("local", (err, user) => {
                if (!user) {
                    return res.redirect(urls.gen(req.lang, "/login"));
                }

                req.login(user, () => {
                    const redirectTo = req.session.redirectTo ||
                        urls.gen(req.lang, "/");
                    delete req.session.redirectTo;
                    res.redirect(redirectTo);
                });
            })(req, res, next);
        },

        logout(req, res) {
            req.logout();
            res.redirect(urls.gen(req.lang, "/"));
        },

        routes() {
            app.get("/login", this.login);
            app.post("/login", this.loginRedirect);
            app.get("/logout", this.logout);
        },
    };
};
