"use strict";

var path = require("path");

var config = require("./config");
var options = require("./options");

var defaultLocale = Object.keys(options.locales)[0] || "en";

var genURL = function genURL(locale, urlBase, origPath) {
    var suffix = "";
    var base = urlBase;
    var path = origPath;

    // See if we're on a non-default locale
    if (locale && locale !== defaultLocale) {
        // Use a sub-domain, if one is requested
        /* istanbul ignore if */
        if (options.usei18nSubdomain) {
            if (base.indexOf("://" + locale + ".") < 0) {
                base = urlBase.replace("://", "://" + locale + ".");
            }

            // Otherwise fall back to using a query string
        } else {
            if (path.indexOf("lang=") >= 0) {
                path = path.replace(/lang=\w+/, "lang=" + locale);
            } else {
                var prefix = /\?/.test(path) ? "&" : "?";
                suffix = prefix + "lang=" + locale;
            }
        }

        // Strip the lang= query param if you're generating a default locale URL
    } else if (locale === defaultLocale && !options.usei18nSubdomain) {
        path = path.replace(/lang=\w+&?/, "").replace(/\?$/, "");
    }

    // Make sure we don't have an accidental // in the URL
    return base.replace(/\/$/, "") + path + suffix;
};

module.exports = {
    // Generate a URL given a path and a locale
    gen: function gen(locale, path) {
        return genURL(locale, config.BASE_URL, path);
    },


    // Generate a URL to a data file, given a path
    genData: function genData(filePath) {
        return genURL(null, config.BASE_DATA_URL, filePath);
    },


    // Generate a path to a data file, given a path
    genLocalFile: function genLocalFile(filePath) {
        return path.resolve(config.BASE_DATA_DIR, filePath);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvdXJscy5qcyJdLCJuYW1lcyI6WyJwYXRoIiwicmVxdWlyZSIsImNvbmZpZyIsIm9wdGlvbnMiLCJkZWZhdWx0TG9jYWxlIiwiT2JqZWN0Iiwia2V5cyIsImxvY2FsZXMiLCJnZW5VUkwiLCJsb2NhbGUiLCJ1cmxCYXNlIiwib3JpZ1BhdGgiLCJzdWZmaXgiLCJiYXNlIiwidXNlaTE4blN1YmRvbWFpbiIsImluZGV4T2YiLCJyZXBsYWNlIiwicHJlZml4IiwidGVzdCIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZW4iLCJCQVNFX1VSTCIsImdlbkRhdGEiLCJmaWxlUGF0aCIsIkJBU0VfREFUQV9VUkwiLCJnZW5Mb2NhbEZpbGUiLCJyZXNvbHZlIiwiQkFTRV9EQVRBX0RJUiJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxPQUFPQyxRQUFRLE1BQVIsQ0FBYjs7QUFFQSxJQUFNQyxTQUFTRCxRQUFRLFVBQVIsQ0FBZjtBQUNBLElBQU1FLFVBQVVGLFFBQVEsV0FBUixDQUFoQjs7QUFFQSxJQUFNRyxnQkFBZ0JDLE9BQU9DLElBQVAsQ0FBWUgsUUFBUUksT0FBcEIsRUFBNkIsQ0FBN0IsS0FBbUMsSUFBekQ7O0FBRUEsSUFBTUMsU0FBUyxTQUFUQSxNQUFTLENBQUNDLE1BQUQsRUFBU0MsT0FBVCxFQUFrQkMsUUFBbEIsRUFBK0I7QUFDMUMsUUFBSUMsU0FBUyxFQUFiO0FBQ0EsUUFBSUMsT0FBT0gsT0FBWDtBQUNBLFFBQUlWLE9BQU9XLFFBQVg7O0FBRUE7QUFDQSxRQUFJRixVQUFVQSxXQUFXTCxhQUF6QixFQUF3QztBQUNwQztBQUNBO0FBQ0EsWUFBSUQsUUFBUVcsZ0JBQVosRUFBOEI7QUFDMUIsZ0JBQUlELEtBQUtFLE9BQUwsU0FBbUJOLE1BQW5CLFVBQWdDLENBQXBDLEVBQXVDO0FBQ25DSSx1QkFBT0gsUUFBUU0sT0FBUixDQUFnQixLQUFoQixVQUE2QlAsTUFBN0IsT0FBUDtBQUNIOztBQUVMO0FBQ0MsU0FORCxNQU1PO0FBQ0gsZ0JBQUlULEtBQUtlLE9BQUwsYUFBeUIsQ0FBN0IsRUFBZ0M7QUFDNUJmLHVCQUFPQSxLQUFLZ0IsT0FBTCxDQUFhLFVBQWIsWUFBaUNQLE1BQWpDLENBQVA7QUFFSCxhQUhELE1BR087QUFDSCxvQkFBTVEsU0FBUyxLQUFLQyxJQUFMLENBQVVsQixJQUFWLElBQWtCLEdBQWxCLEdBQXdCLEdBQXZDO0FBQ0FZLHlCQUFZSyxNQUFaLGFBQTBCUixNQUExQjtBQUNIO0FBQ0o7O0FBRUw7QUFDQyxLQXBCRCxNQW9CTyxJQUFJQSxXQUFXTCxhQUFYLElBQTRCLENBQUNELFFBQVFXLGdCQUF6QyxFQUEyRDtBQUM5RGQsZUFBT0EsS0FBS2dCLE9BQUwsQ0FBYSxZQUFiLEVBQTJCLEVBQTNCLEVBQStCQSxPQUEvQixDQUF1QyxLQUF2QyxFQUE4QyxFQUE5QyxDQUFQO0FBQ0g7O0FBRUQ7QUFDQSxXQUFPSCxLQUFLRyxPQUFMLENBQWEsS0FBYixFQUFvQixFQUFwQixJQUEwQmhCLElBQTFCLEdBQWlDWSxNQUF4QztBQUNILENBaENEOztBQWtDQU8sT0FBT0MsT0FBUCxHQUFpQjtBQUNiO0FBQ0FDLE9BRmEsZUFFVFosTUFGUyxFQUVEVCxJQUZDLEVBRUs7QUFDZCxlQUFPUSxPQUFPQyxNQUFQLEVBQWVQLE9BQU9vQixRQUF0QixFQUFnQ3RCLElBQWhDLENBQVA7QUFDSCxLQUpZOzs7QUFNYjtBQUNBdUIsV0FQYSxtQkFPTEMsUUFQSyxFQU9LO0FBQ2QsZUFBT2hCLE9BQU8sSUFBUCxFQUFhTixPQUFPdUIsYUFBcEIsRUFBbUNELFFBQW5DLENBQVA7QUFDSCxLQVRZOzs7QUFXYjtBQUNBRSxnQkFaYSx3QkFZQUYsUUFaQSxFQVlVO0FBQ25CLGVBQU94QixLQUFLMkIsT0FBTCxDQUFhekIsT0FBTzBCLGFBQXBCLEVBQW1DSixRQUFuQyxDQUFQO0FBQ0g7QUFkWSxDQUFqQiIsImZpbGUiOiJ1cmxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuXG5jb25zdCBjb25maWcgPSByZXF1aXJlKFwiLi9jb25maWdcIik7XG5jb25zdCBvcHRpb25zID0gcmVxdWlyZShcIi4vb3B0aW9uc1wiKTtcblxuY29uc3QgZGVmYXVsdExvY2FsZSA9IE9iamVjdC5rZXlzKG9wdGlvbnMubG9jYWxlcylbMF0gfHwgXCJlblwiO1xuXG5jb25zdCBnZW5VUkwgPSAobG9jYWxlLCB1cmxCYXNlLCBvcmlnUGF0aCkgPT4ge1xuICAgIGxldCBzdWZmaXggPSBcIlwiO1xuICAgIGxldCBiYXNlID0gdXJsQmFzZTtcbiAgICBsZXQgcGF0aCA9IG9yaWdQYXRoO1xuXG4gICAgLy8gU2VlIGlmIHdlJ3JlIG9uIGEgbm9uLWRlZmF1bHQgbG9jYWxlXG4gICAgaWYgKGxvY2FsZSAmJiBsb2NhbGUgIT09IGRlZmF1bHRMb2NhbGUpIHtcbiAgICAgICAgLy8gVXNlIGEgc3ViLWRvbWFpbiwgaWYgb25lIGlzIHJlcXVlc3RlZFxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgaWYgKG9wdGlvbnMudXNlaTE4blN1YmRvbWFpbikge1xuICAgICAgICAgICAgaWYgKGJhc2UuaW5kZXhPZihgOi8vJHtsb2NhbGV9LmApIDwgMCkge1xuICAgICAgICAgICAgICAgIGJhc2UgPSB1cmxCYXNlLnJlcGxhY2UoXCI6Ly9cIiwgYDovLyR7bG9jYWxlfS5gKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAvLyBPdGhlcndpc2UgZmFsbCBiYWNrIHRvIHVzaW5nIGEgcXVlcnkgc3RyaW5nXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocGF0aC5pbmRleE9mKGBsYW5nPWApID49IDApIHtcbiAgICAgICAgICAgICAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC9sYW5nPVxcdysvLCBgbGFuZz0ke2xvY2FsZX1gKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmVmaXggPSAvXFw/Ly50ZXN0KHBhdGgpID8gXCImXCIgOiBcIj9cIjtcbiAgICAgICAgICAgICAgICBzdWZmaXggPSBgJHtwcmVmaXh9bGFuZz0ke2xvY2FsZX1gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAvLyBTdHJpcCB0aGUgbGFuZz0gcXVlcnkgcGFyYW0gaWYgeW91J3JlIGdlbmVyYXRpbmcgYSBkZWZhdWx0IGxvY2FsZSBVUkxcbiAgICB9IGVsc2UgaWYgKGxvY2FsZSA9PT0gZGVmYXVsdExvY2FsZSAmJiAhb3B0aW9ucy51c2VpMThuU3ViZG9tYWluKSB7XG4gICAgICAgIHBhdGggPSBwYXRoLnJlcGxhY2UoL2xhbmc9XFx3KyY/LywgXCJcIikucmVwbGFjZSgvXFw/JC8sIFwiXCIpO1xuICAgIH1cblxuICAgIC8vIE1ha2Ugc3VyZSB3ZSBkb24ndCBoYXZlIGFuIGFjY2lkZW50YWwgLy8gaW4gdGhlIFVSTFxuICAgIHJldHVybiBiYXNlLnJlcGxhY2UoL1xcLyQvLCBcIlwiKSArIHBhdGggKyBzdWZmaXg7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAvLyBHZW5lcmF0ZSBhIFVSTCBnaXZlbiBhIHBhdGggYW5kIGEgbG9jYWxlXG4gICAgZ2VuKGxvY2FsZSwgcGF0aCkge1xuICAgICAgICByZXR1cm4gZ2VuVVJMKGxvY2FsZSwgY29uZmlnLkJBU0VfVVJMLCBwYXRoKTtcbiAgICB9LFxuXG4gICAgLy8gR2VuZXJhdGUgYSBVUkwgdG8gYSBkYXRhIGZpbGUsIGdpdmVuIGEgcGF0aFxuICAgIGdlbkRhdGEoZmlsZVBhdGgpIHtcbiAgICAgICAgcmV0dXJuIGdlblVSTChudWxsLCBjb25maWcuQkFTRV9EQVRBX1VSTCwgZmlsZVBhdGgpO1xuICAgIH0sXG5cbiAgICAvLyBHZW5lcmF0ZSBhIHBhdGggdG8gYSBkYXRhIGZpbGUsIGdpdmVuIGEgcGF0aFxuICAgIGdlbkxvY2FsRmlsZShmaWxlUGF0aCkge1xuICAgICAgICByZXR1cm4gcGF0aC5yZXNvbHZlKGNvbmZpZy5CQVNFX0RBVEFfRElSLCBmaWxlUGF0aCk7XG4gICAgfSxcbn07XG4iXX0=