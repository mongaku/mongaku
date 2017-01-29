"use strict";

/**
 * Some vars to pass in to the templates.
 */

module.exports = function (app) {
    app.use(function (req, res, next) {
        Object.assign(res.locals, {
            user: req.user,
            originalUrl: req.originalUrl
        });
        next();
    });
};