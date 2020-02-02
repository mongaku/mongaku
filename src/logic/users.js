const passport = require("passport");

const options = require("../lib/options");
const urls = require("../lib/urls")(options);

module.exports = app => {
    return {
        login({i18n, query}, res) {
            res.render("Login", {
                title: i18n.gettext("Login"),
                error: query.error,
            });
        },

        loginRedirect(req, res, next) {
            const {lang, session, i18n} = req;

            passport.authenticate("local", (err, user) => {
                if (!user) {
                    return res.redirect(
                        urls.gen(
                            lang,
                            `/login?error=${encodeURIComponent(
                                i18n.gettext("Invalid username or password."),
                            )}`,
                        ),
                    );
                }

                req.login(user, () => {
                    const redirectTo =
                        session.redirectTo || urls.gen(lang, "/");
                    delete session.redirectTo;
                    res.redirect(redirectTo);
                });
            })(req, res, next);
        },

        logout(req, res) {
            const {lang} = req;
            req.logout();
            res.redirect(urls.gen(lang, "/"));
        },

        routes() {
            app.get("/login", this.login);
            app.post("/login", this.loginRedirect);
            app.get("/logout", this.logout);
        },
    };
};
