"use strict";

var path = require("path");

var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var cookieParser = require("cookie-parser");
var serveFavicon = require("serve-favicon");
var serveStatic = require("serve-static");
var morgan = require("morgan");
var session = require("express-session");
var mongoStore = require("connect-mongo")(session);

var pkg = require("../../package.json");

var db = require("../lib/db");
var config = require("../lib/config");
var reactViews = require("./react-views.js");

var rootPath = path.resolve(__dirname, "..");

module.exports = function (app) {
    /* istanbul ignore if */
    if (config.NODE_ENV !== "test") {
        // A basic logger for tracking who is accessing the service
        app.use(morgan("dev"));
    }

    // Configure all the paths for serving the static content on the site
    app.use(serveFavicon(rootPath + "/public/images/favicon.png"));
    app.use(serveStatic(rootPath + "/public"));
    app.use("/client", serveStatic(config.CLIENT_JS_DIR));
    app.use("/data", serveStatic(config.BASE_DATA_DIR));

    // Configure how the views are handled (with React)
    app.engine("js", reactViews);
    app.set("views", rootPath + "/views");
    app.set("view engine", "js");

    // Enable caching of the view files by Express, but only in production
    app.set("view cache", config.NODE_ENV === "production");

    // Parses the contents of HTTP POST bodies, handling URL-encoded forms
    // and also JSON blobs
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // Adds in support for overriding HTTP verbs to help
    // clients support DELETE and PUT
    app.use(methodOverride());

    // Parse cookies, which are then used by the session
    app.use(cookieParser());

    // Track user sessions and store them in a Mongodb data store
    var store = void 0;

    /* istanbul ignore if */
    if (config.NODE_ENV !== "test") {
        store = new mongoStore({
            mongooseConnection: db.mongoose.connection,
            collection: "sessions"
        });
    }

    app.use(session({
        resave: false,
        saveUninitialized: false,
        secret: pkg.name,
        store: store
    }));
};