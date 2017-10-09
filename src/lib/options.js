const fs = require("fs");
const path = require("path");

const config = require("./config");
const options = require("./default-options");
const recordOptions = require("./default-record-options");

let loadFile = true;
let optionsFile = path.resolve(process.cwd(), "mongaku.js");

if (process.env.NODE_ENV === "test") {
    optionsFile = "../tests/options.js";
} else if (!fs.existsSync(optionsFile)) {
    console.warn("No options file found: mongaku.js not located.");
    loadFile = false;
}

if (loadFile) {
    // If it exists, load in the options from it...
    const customOptions = require(optionsFile);
    Object.assign(options, customOptions);
}

for (const typeName in options.types) {
    options.types[typeName] = Object.assign(
        {},
        recordOptions,
        options.types[typeName]
    );
}

// Test to see if the translations directory exists, but only if there are
// multiple locales specified.
// Normally we'd do this check in config.js but options.js doesn't exist yet!
if (config.NODE_ENV !== "test") {
    try {
        if (Object.keys(options.locales) > 1) {
            fs.statSync(config.TRANSLATIONS_DIR).isDirectory();
        }
    } catch (e) {
        console.error(`${config.TRANSLATIONS_DIR} does not exist.`);
        process.exit(1);
    }
}

options.defaultLocale = options.defaultLocale ||
    Object.keys(options.locales)[0] || "en";

// Bring in options that could be configured via the config
options.baseURL = options.baseURL || config.BASE_URL;
options.baseDataURL = options.baseDataURL || config.BASE_DATA_URL;
options.baseStaticURL = options.baseStaticURL || config.BASE_STATIC_URL;

module.exports = options;
