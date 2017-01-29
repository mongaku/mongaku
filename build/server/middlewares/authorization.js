"use strict";

module.exports = {
    // Generic require login routing middleware
    requiresLogin: function requiresLogin(req, res, next) {
        if (!req.isAuthenticated()) {
            req.session.returnTo = req.originalUrl;
            return res.redirect("/login");
        }
        next();
    },


    // User authorization routing middleware
    hasAuthorization: function hasAuthorization(req, res, next) {
        if (req.profile.id !== req.user.id) {
            // TODO(jeresig): Come up with a way to display messages
            //req.flash("info", "You are not authorized");
            return res.redirect("/users/" + req.profile.id);
        }
        next();
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2ZXIvbWlkZGxld2FyZXMvYXV0aG9yaXphdGlvbi5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwicmVxdWlyZXNMb2dpbiIsInJlcSIsInJlcyIsIm5leHQiLCJpc0F1dGhlbnRpY2F0ZWQiLCJzZXNzaW9uIiwicmV0dXJuVG8iLCJvcmlnaW5hbFVybCIsInJlZGlyZWN0IiwiaGFzQXV0aG9yaXphdGlvbiIsInByb2ZpbGUiLCJpZCIsInVzZXIiXSwibWFwcGluZ3MiOiI7O0FBQUFBLE9BQU9DLE9BQVAsR0FBaUI7QUFDYjtBQUNBQyxpQkFGYSx5QkFFQ0MsR0FGRCxFQUVNQyxHQUZOLEVBRVdDLElBRlgsRUFFaUI7QUFDMUIsWUFBSSxDQUFDRixJQUFJRyxlQUFKLEVBQUwsRUFBNEI7QUFDeEJILGdCQUFJSSxPQUFKLENBQVlDLFFBQVosR0FBdUJMLElBQUlNLFdBQTNCO0FBQ0EsbUJBQU9MLElBQUlNLFFBQUosQ0FBYSxRQUFiLENBQVA7QUFDSDtBQUNETDtBQUNILEtBUlk7OztBQVViO0FBQ0FNLG9CQVhhLDRCQVdJUixHQVhKLEVBV1NDLEdBWFQsRUFXY0MsSUFYZCxFQVdvQjtBQUM3QixZQUFJRixJQUFJUyxPQUFKLENBQVlDLEVBQVosS0FBbUJWLElBQUlXLElBQUosQ0FBU0QsRUFBaEMsRUFBb0M7QUFDaEM7QUFDQTtBQUNBLG1CQUFPVCxJQUFJTSxRQUFKLGFBQXVCUCxJQUFJUyxPQUFKLENBQVlDLEVBQW5DLENBQVA7QUFDSDtBQUNEUjtBQUNIO0FBbEJZLENBQWpCIiwiZmlsZSI6ImF1dGhvcml6YXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAvLyBHZW5lcmljIHJlcXVpcmUgbG9naW4gcm91dGluZyBtaWRkbGV3YXJlXG4gICAgcmVxdWlyZXNMb2dpbihyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICBpZiAoIXJlcS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgICAgICAgICAgcmVxLnNlc3Npb24ucmV0dXJuVG8gPSByZXEub3JpZ2luYWxVcmw7XG4gICAgICAgICAgICByZXR1cm4gcmVzLnJlZGlyZWN0KFwiL2xvZ2luXCIpO1xuICAgICAgICB9XG4gICAgICAgIG5leHQoKTtcbiAgICB9LFxuXG4gICAgLy8gVXNlciBhdXRob3JpemF0aW9uIHJvdXRpbmcgbWlkZGxld2FyZVxuICAgIGhhc0F1dGhvcml6YXRpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICAgICAgaWYgKHJlcS5wcm9maWxlLmlkICE9PSByZXEudXNlci5pZCkge1xuICAgICAgICAgICAgLy8gVE9ETyhqZXJlc2lnKTogQ29tZSB1cCB3aXRoIGEgd2F5IHRvIGRpc3BsYXkgbWVzc2FnZXNcbiAgICAgICAgICAgIC8vcmVxLmZsYXNoKFwiaW5mb1wiLCBcIllvdSBhcmUgbm90IGF1dGhvcml6ZWRcIik7XG4gICAgICAgICAgICByZXR1cm4gcmVzLnJlZGlyZWN0KGAvdXNlcnMvJHtyZXEucHJvZmlsZS5pZH1gKTtcbiAgICAgICAgfVxuICAgICAgICBuZXh0KCk7XG4gICAgfSxcbn07XG4iXX0=