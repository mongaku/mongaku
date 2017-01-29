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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2ZXIvdG1wbC12YXJzLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJhcHAiLCJ1c2UiLCJyZXEiLCJyZXMiLCJuZXh0IiwiT2JqZWN0IiwiYXNzaWduIiwibG9jYWxzIiwidXNlciIsIm9yaWdpbmFsVXJsIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBSUFBLE9BQU9DLE9BQVAsR0FBaUIsVUFBQ0MsR0FBRCxFQUFTO0FBQ3RCQSxRQUFJQyxHQUFKLENBQVEsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVdDLElBQVgsRUFBb0I7QUFDeEJDLGVBQU9DLE1BQVAsQ0FBY0gsSUFBSUksTUFBbEIsRUFBMEI7QUFDdEJDLGtCQUFNTixJQUFJTSxJQURZO0FBRXRCQyx5QkFBYVAsSUFBSU87QUFGSyxTQUExQjtBQUlBTDtBQUNILEtBTkQ7QUFPSCxDQVJEIiwiZmlsZSI6InRtcGwtdmFycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU29tZSB2YXJzIHRvIHBhc3MgaW4gdG8gdGhlIHRlbXBsYXRlcy5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IChhcHApID0+IHtcbiAgICBhcHAudXNlKChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICBPYmplY3QuYXNzaWduKHJlcy5sb2NhbHMsIHtcbiAgICAgICAgICAgIHVzZXI6IHJlcS51c2VyLFxuICAgICAgICAgICAgb3JpZ2luYWxVcmw6IHJlcS5vcmlnaW5hbFVybCxcbiAgICAgICAgfSk7XG4gICAgICAgIG5leHQoKTtcbiAgICB9KTtcbn07XG4iXX0=