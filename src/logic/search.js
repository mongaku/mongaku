// @flow

const models = require("../lib/models");
const options = require("../lib/options");

module.exports = function(app: express$Application) {
    const Source = models("Source");

    const cache = require("../server/middlewares/cache");
    const searchPage = require("./shared/search-page");

    const search = (req: express$Request, res, next) => {
        return searchPage(req, res, next);
    };

    const bySource = (req: express$Request, res, next) => {
        const {i18n, params} = req;

        try {
            searchPage(req, res, next, {
                url: Source.getSource(params.source).url,
            });

        } catch (e) {
            return res.status(404).render("Error", {
                title: i18n.gettext("Source not found."),
            });
        }
    };

    return {
        routes() {
            app.get("/:type/search", cache(1), search);
            app.get("/:type/source/:source", cache(1), bySource);

            for (const typeName in options.types) {
                const searchURLs = options.types[typeName].searchURLs;
                for (const path in searchURLs) {
                    app.get(`/:type${path}`, cache(1),
                        (req: express$Request, res, next) => {
                            return searchURLs[path](req, res, next, search);
                        });
                }
            }
        },
    };
};
