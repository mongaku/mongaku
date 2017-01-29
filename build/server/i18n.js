"use strict";

var i18n = require("i18n-abide");

var options = require("../lib/options");

var defaultLocale = Object.keys(options.locales)[0] || "en";

module.exports = function (app) {
    app.use(function (req, res, next) {
        // i18n-abide overwrites all the locals, so we need to save them
        // and restore them after it's done.
        res.tmpLocals = res.locals;
        next();
    });

    app.use(i18n.abide({
        supported_languages: Object.keys(options.locales),
        default_lang: defaultLocale,
        translation_directory: "translations",
        translation_type: "po"
    }));

    app.use(function (req, res, next) {
        // Restore the old local properties and methods
        Object.assign(res.locals, res.tmpLocals);

        /* istanbul ignore next */
        var host = req.headers["x-forwarded-host"] || req.get("host");
        var locale = options.usei18nSubdomain ?
        // Set the locale based upon the subdomain
        /^\w*/.exec(host)[0] :

        // Set the locale based upon the ?lang= query string
        req.query.lang;

        // Fall back to the default locale if one isn't given, or it's invalid
        if (!options.locales[locale]) {
            locale = defaultLocale;
        }

        res.locals.setLocale(locale);

        next();
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2ZXIvaTE4bi5qcyJdLCJuYW1lcyI6WyJpMThuIiwicmVxdWlyZSIsIm9wdGlvbnMiLCJkZWZhdWx0TG9jYWxlIiwiT2JqZWN0Iiwia2V5cyIsImxvY2FsZXMiLCJtb2R1bGUiLCJleHBvcnRzIiwiYXBwIiwidXNlIiwicmVxIiwicmVzIiwibmV4dCIsInRtcExvY2FscyIsImxvY2FscyIsImFiaWRlIiwic3VwcG9ydGVkX2xhbmd1YWdlcyIsImRlZmF1bHRfbGFuZyIsInRyYW5zbGF0aW9uX2RpcmVjdG9yeSIsInRyYW5zbGF0aW9uX3R5cGUiLCJhc3NpZ24iLCJob3N0IiwiaGVhZGVycyIsImdldCIsImxvY2FsZSIsInVzZWkxOG5TdWJkb21haW4iLCJleGVjIiwicXVlcnkiLCJsYW5nIiwic2V0TG9jYWxlIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLE9BQU9DLFFBQVEsWUFBUixDQUFiOztBQUVBLElBQU1DLFVBQVVELFFBQVEsZ0JBQVIsQ0FBaEI7O0FBRUEsSUFBTUUsZ0JBQWdCQyxPQUFPQyxJQUFQLENBQVlILFFBQVFJLE9BQXBCLEVBQTZCLENBQTdCLEtBQW1DLElBQXpEOztBQUVBQyxPQUFPQyxPQUFQLEdBQWlCLFVBQUNDLEdBQUQsRUFBUztBQUN0QkEsUUFBSUMsR0FBSixDQUFRLFVBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFXQyxJQUFYLEVBQW9CO0FBQ3hCO0FBQ0E7QUFDQUQsWUFBSUUsU0FBSixHQUFnQkYsSUFBSUcsTUFBcEI7QUFDQUY7QUFDSCxLQUxEOztBQU9BSixRQUFJQyxHQUFKLENBQVFWLEtBQUtnQixLQUFMLENBQVc7QUFDZkMsNkJBQXFCYixPQUFPQyxJQUFQLENBQVlILFFBQVFJLE9BQXBCLENBRE47QUFFZlksc0JBQWNmLGFBRkM7QUFHZmdCLCtCQUF1QixjQUhSO0FBSWZDLDBCQUFrQjtBQUpILEtBQVgsQ0FBUjs7QUFPQVgsUUFBSUMsR0FBSixDQUFRLFVBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFXQyxJQUFYLEVBQW9CO0FBQ3hCO0FBQ0FULGVBQU9pQixNQUFQLENBQWNULElBQUlHLE1BQWxCLEVBQTBCSCxJQUFJRSxTQUE5Qjs7QUFFQTtBQUNBLFlBQU1RLE9BQU9YLElBQUlZLE9BQUosQ0FBWSxrQkFBWixLQUFtQ1osSUFBSWEsR0FBSixDQUFRLE1BQVIsQ0FBaEQ7QUFDQSxZQUFJQyxTQUFTdkIsUUFBUXdCLGdCQUFSO0FBQ1Q7QUFDQSxlQUFPQyxJQUFQLENBQVlMLElBQVosRUFBa0IsQ0FBbEIsQ0FGUzs7QUFJVDtBQUNBWCxZQUFJaUIsS0FBSixDQUFVQyxJQUxkOztBQU9BO0FBQ0EsWUFBSSxDQUFDM0IsUUFBUUksT0FBUixDQUFnQm1CLE1BQWhCLENBQUwsRUFBOEI7QUFDMUJBLHFCQUFTdEIsYUFBVDtBQUNIOztBQUVEUyxZQUFJRyxNQUFKLENBQVdlLFNBQVgsQ0FBcUJMLE1BQXJCOztBQUVBWjtBQUNILEtBckJEO0FBc0JILENBckNEIiwiZmlsZSI6ImkxOG4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBpMThuID0gcmVxdWlyZShcImkxOG4tYWJpZGVcIik7XG5cbmNvbnN0IG9wdGlvbnMgPSByZXF1aXJlKFwiLi4vbGliL29wdGlvbnNcIik7XG5cbmNvbnN0IGRlZmF1bHRMb2NhbGUgPSBPYmplY3Qua2V5cyhvcHRpb25zLmxvY2FsZXMpWzBdIHx8IFwiZW5cIjtcblxubW9kdWxlLmV4cG9ydHMgPSAoYXBwKSA9PiB7XG4gICAgYXBwLnVzZSgocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgICAgLy8gaTE4bi1hYmlkZSBvdmVyd3JpdGVzIGFsbCB0aGUgbG9jYWxzLCBzbyB3ZSBuZWVkIHRvIHNhdmUgdGhlbVxuICAgICAgICAvLyBhbmQgcmVzdG9yZSB0aGVtIGFmdGVyIGl0J3MgZG9uZS5cbiAgICAgICAgcmVzLnRtcExvY2FscyA9IHJlcy5sb2NhbHM7XG4gICAgICAgIG5leHQoKTtcbiAgICB9KTtcblxuICAgIGFwcC51c2UoaTE4bi5hYmlkZSh7XG4gICAgICAgIHN1cHBvcnRlZF9sYW5ndWFnZXM6IE9iamVjdC5rZXlzKG9wdGlvbnMubG9jYWxlcyksXG4gICAgICAgIGRlZmF1bHRfbGFuZzogZGVmYXVsdExvY2FsZSxcbiAgICAgICAgdHJhbnNsYXRpb25fZGlyZWN0b3J5OiBcInRyYW5zbGF0aW9uc1wiLFxuICAgICAgICB0cmFuc2xhdGlvbl90eXBlOiBcInBvXCIsXG4gICAgfSkpO1xuXG4gICAgYXBwLnVzZSgocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgICAgLy8gUmVzdG9yZSB0aGUgb2xkIGxvY2FsIHByb3BlcnRpZXMgYW5kIG1ldGhvZHNcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyZXMubG9jYWxzLCByZXMudG1wTG9jYWxzKTtcblxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICBjb25zdCBob3N0ID0gcmVxLmhlYWRlcnNbXCJ4LWZvcndhcmRlZC1ob3N0XCJdIHx8IHJlcS5nZXQoXCJob3N0XCIpO1xuICAgICAgICBsZXQgbG9jYWxlID0gb3B0aW9ucy51c2VpMThuU3ViZG9tYWluID9cbiAgICAgICAgICAgIC8vIFNldCB0aGUgbG9jYWxlIGJhc2VkIHVwb24gdGhlIHN1YmRvbWFpblxuICAgICAgICAgICAgL15cXHcqLy5leGVjKGhvc3QpWzBdIDpcblxuICAgICAgICAgICAgLy8gU2V0IHRoZSBsb2NhbGUgYmFzZWQgdXBvbiB0aGUgP2xhbmc9IHF1ZXJ5IHN0cmluZ1xuICAgICAgICAgICAgcmVxLnF1ZXJ5Lmxhbmc7XG5cbiAgICAgICAgLy8gRmFsbCBiYWNrIHRvIHRoZSBkZWZhdWx0IGxvY2FsZSBpZiBvbmUgaXNuJ3QgZ2l2ZW4sIG9yIGl0J3MgaW52YWxpZFxuICAgICAgICBpZiAoIW9wdGlvbnMubG9jYWxlc1tsb2NhbGVdKSB7XG4gICAgICAgICAgICBsb2NhbGUgPSBkZWZhdWx0TG9jYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzLmxvY2Fscy5zZXRMb2NhbGUobG9jYWxlKTtcblxuICAgICAgICBuZXh0KCk7XG4gICAgfSk7XG59O1xuIl19