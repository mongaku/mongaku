/**
 * Some vars to pass in to the templates.
 */

module.exports = (app) => {
    app.use((req, res, next) => {
        Object.assign(res.locals, {
            user: req.user,
            originalUrl: req.originalUrl,
        });
        next();
    });
};
