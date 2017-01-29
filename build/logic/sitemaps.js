"use strict";

var async = require("async");

var options = require("../lib/options");
var record = require("../lib/record");
var urls = require("../lib/urls");

var NUM_PER_SITEMAP = 1000;

module.exports = function (app) {
    return {
        index: function index(req, res) {
            var sitemaps = [];

            async.each(Object.keys(options.types), function (type, callback) {
                var Record = record(type);
                Record.count({}, function (err, total) {
                    if (err) {
                        return callback(err);
                    }

                    for (var i = 0; i < total; i += NUM_PER_SITEMAP) {
                        var url = urls.gen(req.lang, "/sitemap-" + type + "-" + i + ".xml");
                        sitemaps.push("<sitemap><loc>" + url + "</loc></sitemap>");
                    }

                    callback();
                });
            }, function (err) {
                if (err) {
                    return res.status(500).render("Error", {
                        title: err.message
                    });
                }

                var sitemap = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n    <sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n    " + sitemaps.join("\n") + "\n    </sitemapindex>\n    ";

                res.header("Content-Type", "application/xml");
                res.status(200).send(sitemap);
            });
        },
        search: function search(req, res) {
            // Query for the records in Elasticsearch
            var Record = record(req.params.type);
            Record.search({
                bool: {
                    must: [{
                        query_string: {
                            query: "*"
                        }
                    }]
                }
            }, {
                size: NUM_PER_SITEMAP,
                from: req.params.start
            }, function (err, results) {
                /* istanbul ignore if */
                if (err) {
                    return res.status(500).render("Error", {
                        title: err.message
                    });
                }

                var sitemaps = results.hits.hits.map(function (item) {
                    return Record.getURLFromID(req.lang, item._id);
                }).map(function (url) {
                    return "<url><loc>" + url + "</loc></url>";
                });

                var sitemap = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"\n        xmlns:image=\"http://www.google.com/schemas/sitemap-image/1.1\">\n" + sitemaps.join("\n") + "\n</urlset>";

                res.header("Content-Type", "application/xml");
                res.status(200).send(sitemap);
            });
        },
        routes: function routes() {
            app.get("/sitemap.xml", this.index);
            app.get("/sitemap-:type-:start.xml", this.search);
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sb2dpYy9zaXRlbWFwcy5qcyJdLCJuYW1lcyI6WyJhc3luYyIsInJlcXVpcmUiLCJvcHRpb25zIiwicmVjb3JkIiwidXJscyIsIk5VTV9QRVJfU0lURU1BUCIsIm1vZHVsZSIsImV4cG9ydHMiLCJhcHAiLCJpbmRleCIsInJlcSIsInJlcyIsInNpdGVtYXBzIiwiZWFjaCIsIk9iamVjdCIsImtleXMiLCJ0eXBlcyIsInR5cGUiLCJjYWxsYmFjayIsIlJlY29yZCIsImNvdW50IiwiZXJyIiwidG90YWwiLCJpIiwidXJsIiwiZ2VuIiwibGFuZyIsInB1c2giLCJzdGF0dXMiLCJyZW5kZXIiLCJ0aXRsZSIsIm1lc3NhZ2UiLCJzaXRlbWFwIiwiam9pbiIsImhlYWRlciIsInNlbmQiLCJzZWFyY2giLCJwYXJhbXMiLCJib29sIiwibXVzdCIsInF1ZXJ5X3N0cmluZyIsInF1ZXJ5Iiwic2l6ZSIsImZyb20iLCJzdGFydCIsInJlc3VsdHMiLCJoaXRzIiwibWFwIiwiaXRlbSIsImdldFVSTEZyb21JRCIsIl9pZCIsInJvdXRlcyIsImdldCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxRQUFRQyxRQUFRLE9BQVIsQ0FBZDs7QUFFQSxJQUFNQyxVQUFVRCxRQUFRLGdCQUFSLENBQWhCO0FBQ0EsSUFBTUUsU0FBU0YsUUFBUSxlQUFSLENBQWY7QUFDQSxJQUFNRyxPQUFPSCxRQUFRLGFBQVIsQ0FBYjs7QUFFQSxJQUFNSSxrQkFBa0IsSUFBeEI7O0FBRUFDLE9BQU9DLE9BQVAsR0FBaUIsVUFBU0MsR0FBVCxFQUFjO0FBQzNCLFdBQU87QUFDSEMsYUFERyxpQkFDR0MsR0FESCxFQUNRQyxHQURSLEVBQ2E7QUFDWixnQkFBTUMsV0FBVyxFQUFqQjs7QUFFQVosa0JBQU1hLElBQU4sQ0FBV0MsT0FBT0MsSUFBUCxDQUFZYixRQUFRYyxLQUFwQixDQUFYLEVBQXVDLFVBQUNDLElBQUQsRUFBT0MsUUFBUCxFQUFvQjtBQUN2RCxvQkFBTUMsU0FBU2hCLE9BQU9jLElBQVAsQ0FBZjtBQUNBRSx1QkFBT0MsS0FBUCxDQUFhLEVBQWIsRUFBaUIsVUFBQ0MsR0FBRCxFQUFNQyxLQUFOLEVBQWdCO0FBQzdCLHdCQUFJRCxHQUFKLEVBQVM7QUFDTCwrQkFBT0gsU0FBU0csR0FBVCxDQUFQO0FBQ0g7O0FBRUQseUJBQUssSUFBSUUsSUFBSSxDQUFiLEVBQWdCQSxJQUFJRCxLQUFwQixFQUEyQkMsS0FBS2xCLGVBQWhDLEVBQWlEO0FBQzdDLDRCQUFNbUIsTUFBTXBCLEtBQUtxQixHQUFMLENBQVNmLElBQUlnQixJQUFiLGdCQUNJVCxJQURKLFNBQ1lNLENBRFosVUFBWjtBQUVBWCxpQ0FBU2UsSUFBVCxvQkFBK0JILEdBQS9CO0FBQ0g7O0FBRUROO0FBQ0gsaUJBWkQ7QUFhSCxhQWZELEVBZUcsVUFBQ0csR0FBRCxFQUFTO0FBQ1Isb0JBQUlBLEdBQUosRUFBUztBQUNMLDJCQUFPVixJQUFJaUIsTUFBSixDQUFXLEdBQVgsRUFBZ0JDLE1BQWhCLENBQXVCLE9BQXZCLEVBQWdDO0FBQ25DQywrQkFBT1QsSUFBSVU7QUFEd0IscUJBQWhDLENBQVA7QUFHSDs7QUFFRCxvQkFBTUMseUlBRWhCcEIsU0FBU3FCLElBQVQsQ0FBYyxJQUFkLENBRmdCLGdDQUFOOztBQU1BdEIsb0JBQUl1QixNQUFKLENBQVcsY0FBWCxFQUEyQixpQkFBM0I7QUFDQXZCLG9CQUFJaUIsTUFBSixDQUFXLEdBQVgsRUFBZ0JPLElBQWhCLENBQXFCSCxPQUFyQjtBQUNILGFBOUJEO0FBK0JILFNBbkNFO0FBcUNISSxjQXJDRyxrQkFxQ0kxQixHQXJDSixFQXFDU0MsR0FyQ1QsRUFxQ2M7QUFDYjtBQUNBLGdCQUFNUSxTQUFTaEIsT0FBT08sSUFBSTJCLE1BQUosQ0FBV3BCLElBQWxCLENBQWY7QUFDQUUsbUJBQU9pQixNQUFQLENBQWM7QUFDVkUsc0JBQU07QUFDRkMsMEJBQU0sQ0FDRjtBQUNJQyxzQ0FBYztBQUNWQyxtQ0FBTztBQURHO0FBRGxCLHFCQURFO0FBREo7QUFESSxhQUFkLEVBVUc7QUFDQ0Msc0JBQU1yQyxlQURQO0FBRUNzQyxzQkFBTWpDLElBQUkyQixNQUFKLENBQVdPO0FBRmxCLGFBVkgsRUFhRyxVQUFDdkIsR0FBRCxFQUFNd0IsT0FBTixFQUFrQjtBQUNqQjtBQUNBLG9CQUFJeEIsR0FBSixFQUFTO0FBQ0wsMkJBQU9WLElBQUlpQixNQUFKLENBQVcsR0FBWCxFQUFnQkMsTUFBaEIsQ0FBdUIsT0FBdkIsRUFBZ0M7QUFDbkNDLCtCQUFPVCxJQUFJVTtBQUR3QixxQkFBaEMsQ0FBUDtBQUdIOztBQUVELG9CQUFNbkIsV0FBV2lDLFFBQVFDLElBQVIsQ0FBYUEsSUFBYixDQUFrQkMsR0FBbEIsQ0FBc0IsVUFBQ0MsSUFBRDtBQUFBLDJCQUNuQzdCLE9BQU84QixZQUFQLENBQW9CdkMsSUFBSWdCLElBQXhCLEVBQThCc0IsS0FBS0UsR0FBbkMsQ0FEbUM7QUFBQSxpQkFBdEIsRUFFWkgsR0FGWSxDQUVSLFVBQUN2QixHQUFEO0FBQUEsMENBQXNCQSxHQUF0QjtBQUFBLGlCQUZRLENBQWpCOztBQUlBLG9CQUFNUSxvTUFHcEJwQixTQUFTcUIsSUFBVCxDQUFjLElBQWQsQ0FIb0IsZ0JBQU47O0FBTUF0QixvQkFBSXVCLE1BQUosQ0FBVyxjQUFYLEVBQTJCLGlCQUEzQjtBQUNBdkIsb0JBQUlpQixNQUFKLENBQVcsR0FBWCxFQUFnQk8sSUFBaEIsQ0FBcUJILE9BQXJCO0FBQ0gsYUFqQ0Q7QUFrQ0gsU0ExRUU7QUE0RUhtQixjQTVFRyxvQkE0RU07QUFDTDNDLGdCQUFJNEMsR0FBSixDQUFRLGNBQVIsRUFBd0IsS0FBSzNDLEtBQTdCO0FBQ0FELGdCQUFJNEMsR0FBSixDQUFRLDJCQUFSLEVBQXFDLEtBQUtoQixNQUExQztBQUNIO0FBL0VFLEtBQVA7QUFpRkgsQ0FsRkQiLCJmaWxlIjoic2l0ZW1hcHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBhc3luYyA9IHJlcXVpcmUoXCJhc3luY1wiKTtcblxuY29uc3Qgb3B0aW9ucyA9IHJlcXVpcmUoXCIuLi9saWIvb3B0aW9uc1wiKTtcbmNvbnN0IHJlY29yZCA9IHJlcXVpcmUoXCIuLi9saWIvcmVjb3JkXCIpO1xuY29uc3QgdXJscyA9IHJlcXVpcmUoXCIuLi9saWIvdXJsc1wiKTtcblxuY29uc3QgTlVNX1BFUl9TSVRFTUFQID0gMTAwMDtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhcHApIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBpbmRleChyZXEsIHJlcykge1xuICAgICAgICAgICAgY29uc3Qgc2l0ZW1hcHMgPSBbXTtcblxuICAgICAgICAgICAgYXN5bmMuZWFjaChPYmplY3Qua2V5cyhvcHRpb25zLnR5cGVzKSwgKHR5cGUsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgUmVjb3JkID0gcmVjb3JkKHR5cGUpO1xuICAgICAgICAgICAgICAgIFJlY29yZC5jb3VudCh7fSwgKGVyciwgdG90YWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdGFsOyBpICs9IE5VTV9QRVJfU0lURU1BUCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdXJsID0gdXJscy5nZW4ocmVxLmxhbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYC9zaXRlbWFwLSR7dHlwZX0tJHtpfS54bWxgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpdGVtYXBzLnB1c2goYDxzaXRlbWFwPjxsb2M+JHt1cmx9PC9sb2M+PC9zaXRlbWFwPmApO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkucmVuZGVyKFwiRXJyb3JcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGVyci5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzaXRlbWFwID0gYDw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cIlVURi04XCI/PlxuICAgIDxzaXRlbWFwaW5kZXggeG1sbnM9XCJodHRwOi8vd3d3LnNpdGVtYXBzLm9yZy9zY2hlbWFzL3NpdGVtYXAvMC45XCI+XG4gICAgJHtzaXRlbWFwcy5qb2luKFwiXFxuXCIpfVxuICAgIDwvc2l0ZW1hcGluZGV4PlxuICAgIGA7XG5cbiAgICAgICAgICAgICAgICByZXMuaGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24veG1sXCIpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHNpdGVtYXApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2VhcmNoKHJlcSwgcmVzKSB7XG4gICAgICAgICAgICAvLyBRdWVyeSBmb3IgdGhlIHJlY29yZHMgaW4gRWxhc3RpY3NlYXJjaFxuICAgICAgICAgICAgY29uc3QgUmVjb3JkID0gcmVjb3JkKHJlcS5wYXJhbXMudHlwZSk7XG4gICAgICAgICAgICBSZWNvcmQuc2VhcmNoKHtcbiAgICAgICAgICAgICAgICBib29sOiB7XG4gICAgICAgICAgICAgICAgICAgIG11c3Q6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVyeV9zdHJpbmc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnk6IFwiKlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgc2l6ZTogTlVNX1BFUl9TSVRFTUFQLFxuICAgICAgICAgICAgICAgIGZyb206IHJlcS5wYXJhbXMuc3RhcnQsXG4gICAgICAgICAgICB9LCAoZXJyLCByZXN1bHRzKSA9PiB7XG4gICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLnJlbmRlcihcIkVycm9yXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBlcnIubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2l0ZW1hcHMgPSByZXN1bHRzLmhpdHMuaGl0cy5tYXAoKGl0ZW0pID0+XG4gICAgICAgICAgICAgICAgICAgIFJlY29yZC5nZXRVUkxGcm9tSUQocmVxLmxhbmcsIGl0ZW0uX2lkKSlcbiAgICAgICAgICAgICAgICAgICAgLm1hcCgodXJsKSA9PiBgPHVybD48bG9jPiR7dXJsfTwvbG9jPjwvdXJsPmApO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2l0ZW1hcCA9IGA8P3htbCB2ZXJzaW9uPVwiMS4wXCIgZW5jb2Rpbmc9XCJVVEYtOFwiPz5cbjx1cmxzZXQgeG1sbnM9XCJodHRwOi8vd3d3LnNpdGVtYXBzLm9yZy9zY2hlbWFzL3NpdGVtYXAvMC45XCJcbiAgICAgICAgeG1sbnM6aW1hZ2U9XCJodHRwOi8vd3d3Lmdvb2dsZS5jb20vc2NoZW1hcy9zaXRlbWFwLWltYWdlLzEuMVwiPlxuJHtzaXRlbWFwcy5qb2luKFwiXFxuXCIpfVxuPC91cmxzZXQ+YDtcblxuICAgICAgICAgICAgICAgIHJlcy5oZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi94bWxcIik7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoc2l0ZW1hcCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICByb3V0ZXMoKSB7XG4gICAgICAgICAgICBhcHAuZ2V0KFwiL3NpdGVtYXAueG1sXCIsIHRoaXMuaW5kZXgpO1xuICAgICAgICAgICAgYXBwLmdldChcIi9zaXRlbWFwLTp0eXBlLTpzdGFydC54bWxcIiwgdGhpcy5zZWFyY2gpO1xuICAgICAgICB9LFxuICAgIH07XG59O1xuIl19