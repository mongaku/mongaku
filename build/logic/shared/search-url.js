"use strict";

var qs = require("querystring");

var urls = require("../../lib/urls");
var queries = require("./queries");
var paramFilter = require("./param-filter");

var searchURL = function searchURL(req, query, keepSecondary) {
    var params = paramFilter(query, keepSecondary);
    var primary = params.primary;
    var type = query.type;
    var typeQueries = queries(type);
    var queryString = qs.stringify(params.all);
    var url = urls.gen(req.lang, "/" + type + "/search");

    if (primary.length === 1 && typeQueries[primary[0]].url) {
        queryString = qs.stringify(params.secondary);
        url = typeQueries[primary[0]].url(query[primary[0]]);
        if (url.getURL) {
            url = url.getURL(req.lang);
        } else {
            url = urls.gen(req.lang, url);
        }
    }

    if (queryString) {
        var prefix = url.indexOf("?") >= 0 ? "&" : "?";
        queryString = "" + prefix + queryString;
    }

    return "" + url + queryString;
};

module.exports = searchURL;