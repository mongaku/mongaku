"use strict";

var cache = require("../server/middlewares/cache");

var models = require("../lib/models");

module.exports = function (app) {
    var Source = models("Source");

    return {
        index: function index(req, res) {
            var sources = Source.getSources().filter(function (source) {
                return source.numRecords > 0;
            });
            var recordTotal = 0;
            var imageTotal = 0;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = sources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var source = _step.value;

                    recordTotal += source.numRecords;
                    imageTotal += source.numImages;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            res.render("Home", {
                sources: sources,
                recordTotal: recordTotal,
                imageTotal: imageTotal
            });
        },
        routes: function routes() {
            app.get("/", cache(1), this.index);
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sb2dpYy9ob21lLmpzIl0sIm5hbWVzIjpbImNhY2hlIiwicmVxdWlyZSIsIm1vZGVscyIsIm1vZHVsZSIsImV4cG9ydHMiLCJhcHAiLCJTb3VyY2UiLCJpbmRleCIsInJlcSIsInJlcyIsInNvdXJjZXMiLCJnZXRTb3VyY2VzIiwiZmlsdGVyIiwic291cmNlIiwibnVtUmVjb3JkcyIsInJlY29yZFRvdGFsIiwiaW1hZ2VUb3RhbCIsIm51bUltYWdlcyIsInJlbmRlciIsInJvdXRlcyIsImdldCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxRQUFRQyxRQUFRLDZCQUFSLENBQWQ7O0FBRUEsSUFBTUMsU0FBU0QsUUFBUSxlQUFSLENBQWY7O0FBRUFFLE9BQU9DLE9BQVAsR0FBaUIsVUFBQ0MsR0FBRCxFQUFTO0FBQ3RCLFFBQU1DLFNBQVNKLE9BQU8sUUFBUCxDQUFmOztBQUVBLFdBQU87QUFDSEssYUFERyxpQkFDR0MsR0FESCxFQUNRQyxHQURSLEVBQ2E7QUFDWixnQkFBTUMsVUFBVUosT0FBT0ssVUFBUCxHQUNYQyxNQURXLENBQ0osVUFBQ0MsTUFBRDtBQUFBLHVCQUFZQSxPQUFPQyxVQUFQLEdBQW9CLENBQWhDO0FBQUEsYUFESSxDQUFoQjtBQUVBLGdCQUFJQyxjQUFjLENBQWxCO0FBQ0EsZ0JBQUlDLGFBQWEsQ0FBakI7O0FBSlk7QUFBQTtBQUFBOztBQUFBO0FBTVoscUNBQXFCTixPQUFyQiw4SEFBOEI7QUFBQSx3QkFBbkJHLE1BQW1COztBQUMxQkUsbUNBQWVGLE9BQU9DLFVBQXRCO0FBQ0FFLGtDQUFjSCxPQUFPSSxTQUFyQjtBQUNIO0FBVFc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFXWlIsZ0JBQUlTLE1BQUosQ0FBVyxNQUFYLEVBQW1CO0FBQ2ZSLGdDQURlO0FBRWZLLHdDQUZlO0FBR2ZDO0FBSGUsYUFBbkI7QUFLSCxTQWpCRTtBQW1CSEcsY0FuQkcsb0JBbUJNO0FBQ0xkLGdCQUFJZSxHQUFKLENBQVEsR0FBUixFQUFhcEIsTUFBTSxDQUFOLENBQWIsRUFBdUIsS0FBS08sS0FBNUI7QUFDSDtBQXJCRSxLQUFQO0FBdUJILENBMUJEIiwiZmlsZSI6ImhvbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBjYWNoZSA9IHJlcXVpcmUoXCIuLi9zZXJ2ZXIvbWlkZGxld2FyZXMvY2FjaGVcIik7XG5cbmNvbnN0IG1vZGVscyA9IHJlcXVpcmUoXCIuLi9saWIvbW9kZWxzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChhcHApID0+IHtcbiAgICBjb25zdCBTb3VyY2UgPSBtb2RlbHMoXCJTb3VyY2VcIik7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBpbmRleChyZXEsIHJlcykge1xuICAgICAgICAgICAgY29uc3Qgc291cmNlcyA9IFNvdXJjZS5nZXRTb3VyY2VzKClcbiAgICAgICAgICAgICAgICAuZmlsdGVyKChzb3VyY2UpID0+IHNvdXJjZS5udW1SZWNvcmRzID4gMCk7XG4gICAgICAgICAgICBsZXQgcmVjb3JkVG90YWwgPSAwO1xuICAgICAgICAgICAgbGV0IGltYWdlVG90YWwgPSAwO1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VzKSB7XG4gICAgICAgICAgICAgICAgcmVjb3JkVG90YWwgKz0gc291cmNlLm51bVJlY29yZHM7XG4gICAgICAgICAgICAgICAgaW1hZ2VUb3RhbCArPSBzb3VyY2UubnVtSW1hZ2VzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXMucmVuZGVyKFwiSG9tZVwiLCB7XG4gICAgICAgICAgICAgICAgc291cmNlcyxcbiAgICAgICAgICAgICAgICByZWNvcmRUb3RhbCxcbiAgICAgICAgICAgICAgICBpbWFnZVRvdGFsLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcm91dGVzKCkge1xuICAgICAgICAgICAgYXBwLmdldChcIi9cIiwgY2FjaGUoMSksIHRoaXMuaW5kZXgpO1xuICAgICAgICB9LFxuICAgIH07XG59O1xuIl19