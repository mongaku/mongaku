// @flow

const config = require("../../lib/config");

// Utility method of setting the cache header on a request
// Used as a piece of Express middleware
module.exports = (hours: number) => (
    req: express$Request,
    res: express$Response,
    next: express$NextFunction,
) => {
    /* istanbul ignore if */
    if (config.NODE_ENV === "production") {
        res.setHeader("Cache-Control", `public, max-age=${hours * 3600}`);
    }
    next();
};
