"use strict";

const path = require("path");

const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const serveFavicon = require("serve-favicon");
const serveStatic = require("serve-static");
const morgan = require("morgan");
const session = require("express-session");
const mongoStore = require("connect-mongo")(session);
const reactViews = require("express-react-views");

const pkg = require("../package");

const db = require("../lib/db");
const config = require("../lib/config");

const viewMethods = require("./middlewares/view-methods");

const rootPath = path.resolve(__dirname, "..");

module.exports = (app) => {
    /* istanbul ignore if */
    if (config.NODE_ENV !== "test") {
        // A basic logger for tracking who is accessing the service
        app.use(morgan("dev"));
    }

    // Configure all the paths for serving the static content on the site
    app.use(serveFavicon(`${rootPath}/public/images/favicon.png`));
    app.use(serveStatic(`${rootPath}/public`));
    app.use("/data", serveStatic(config.BASE_DATA_DIR));

    // Configure how the views are handled (with React)
    app.engine("jsx", reactViews.createEngine({
        transformViews: false,
    }));
    app.set("views", `${rootPath}/views`);
    app.set("view engine", "jsx");

    // Enable caching of the view files by Express, but only in production
    app.set("view cache", config.NODE_ENV === "production");

    // Parses the contents of HTTP POST bodies, handling URL-encoded forms
    // and also JSON blobs
    app.use(bodyParser.urlencoded({
        extended: true,
    }));

    // Adds in support for overriding HTTP verbs to help
    // clients support DELETE and PUT
    app.use(methodOverride());

    // Parse cookies, which are then used by the session
    app.use(cookieParser());

    // Track user sessions and store them in a Mongodb data store
    let store;

    /* istanbul ignore if */
    if (config.NODE_ENV !== "test") {
        store = new mongoStore({
            mongooseConnection: db.mongoose.connection,
            collection: "sessions",
        });
    }

    app.use(session({
        resave: false,
        saveUninitialized: false,
        secret: pkg.name,
        store,
    }));

    // Bring in the methods that will be available to the views
    app.use(viewMethods);
};
