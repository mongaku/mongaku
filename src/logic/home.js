const cache = require("../server/middlewares/cache");

const {cloneModel} = require("../lib/clone");
const models = require("../lib/models");

module.exports = app => {
    const Source = models("Source");

    return {
        index({i18n, user}, res) {
            // Only show sources on the homepage that the user is allowed to see
            const sources = Source.getSourcesByViewable(user).map(source => {
                const cloned = cloneModel(source, i18n);
                cloned.numRecords = source.numRecords;
                cloned.numImages = source.numImages;
                return cloned;
            });
            let recordTotal = 0;
            let imageTotal = 0;

            for (const source of sources) {
                recordTotal += source.numRecords;
                imageTotal += source.numImages;
            }

            res.render("Home", {
                sources,
                recordTotal,
                imageTotal,
            });
        },

        routes() {
            app.get("/", cache(1), this.index);
        },
    };
};
