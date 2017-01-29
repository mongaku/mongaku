"use strict";

var models = require("../../lib/models");
var metadata = require("../../lib/metadata");

var defaultFacets = {
    source: {
        title: function title(i18n) {
            return i18n.gettext("Source");
        },

        facet: function facet() {
            return {
                terms: {
                    field: "source.raw"
                }
            };
        },

        formatBuckets: function formatBuckets(buckets) {
            return buckets.map(function (bucket) {
                return {
                    text: models("Source").getSource(bucket.key).name,
                    count: bucket.doc_count,
                    url: { source: bucket.key }
                };
            });
        }
    }
};

module.exports = function (type) {
    var facets = Object.assign({}, defaultFacets);
    var model = metadata.model(type);

    for (var name in model) {
        var typeModel = model[name];

        if (typeModel.facet) {
            Object.assign(facets, typeModel.facet());
        }
    }

    return facets;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sb2dpYy9zaGFyZWQvZmFjZXRzLmpzIl0sIm5hbWVzIjpbIm1vZGVscyIsInJlcXVpcmUiLCJtZXRhZGF0YSIsImRlZmF1bHRGYWNldHMiLCJzb3VyY2UiLCJ0aXRsZSIsImkxOG4iLCJnZXR0ZXh0IiwiZmFjZXQiLCJ0ZXJtcyIsImZpZWxkIiwiZm9ybWF0QnVja2V0cyIsImJ1Y2tldHMiLCJtYXAiLCJidWNrZXQiLCJ0ZXh0IiwiZ2V0U291cmNlIiwia2V5IiwibmFtZSIsImNvdW50IiwiZG9jX2NvdW50IiwidXJsIiwibW9kdWxlIiwiZXhwb3J0cyIsInR5cGUiLCJmYWNldHMiLCJPYmplY3QiLCJhc3NpZ24iLCJtb2RlbCIsInR5cGVNb2RlbCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxTQUFTQyxRQUFRLGtCQUFSLENBQWY7QUFDQSxJQUFNQyxXQUFXRCxRQUFRLG9CQUFSLENBQWpCOztBQUVBLElBQU1FLGdCQUFnQjtBQUNsQkMsWUFBUTtBQUNKQyxlQUFPLGVBQUNDLElBQUQ7QUFBQSxtQkFBVUEsS0FBS0MsT0FBTCxDQUFhLFFBQWIsQ0FBVjtBQUFBLFNBREg7O0FBR0pDLGVBQU87QUFBQSxtQkFBTztBQUNWQyx1QkFBTztBQUNIQywyQkFBTztBQURKO0FBREcsYUFBUDtBQUFBLFNBSEg7O0FBU0pDLHVCQUFlLHVCQUFDQyxPQUFEO0FBQUEsbUJBQWFBLFFBQVFDLEdBQVIsQ0FBWSxVQUFDQyxNQUFEO0FBQUEsdUJBQWE7QUFDakRDLDBCQUFNZixPQUFPLFFBQVAsRUFBaUJnQixTQUFqQixDQUEyQkYsT0FBT0csR0FBbEMsRUFBdUNDLElBREk7QUFFakRDLDJCQUFPTCxPQUFPTSxTQUZtQztBQUdqREMseUJBQUssRUFBQ2pCLFFBQVFVLE9BQU9HLEdBQWhCO0FBSDRDLGlCQUFiO0FBQUEsYUFBWixDQUFiO0FBQUE7QUFUWDtBQURVLENBQXRCOztBQWtCQUssT0FBT0MsT0FBUCxHQUFpQixVQUFDQyxJQUFELEVBQVU7QUFDdkIsUUFBTUMsU0FBU0MsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0J4QixhQUFsQixDQUFmO0FBQ0EsUUFBTXlCLFFBQVExQixTQUFTMEIsS0FBVCxDQUFlSixJQUFmLENBQWQ7O0FBRUEsU0FBSyxJQUFNTixJQUFYLElBQW1CVSxLQUFuQixFQUEwQjtBQUN0QixZQUFNQyxZQUFZRCxNQUFNVixJQUFOLENBQWxCOztBQUVBLFlBQUlXLFVBQVVyQixLQUFkLEVBQXFCO0FBQ2pCa0IsbUJBQU9DLE1BQVAsQ0FBY0YsTUFBZCxFQUFzQkksVUFBVXJCLEtBQVYsRUFBdEI7QUFDSDtBQUNKOztBQUVELFdBQU9pQixNQUFQO0FBQ0gsQ0FiRCIsImZpbGUiOiJmYWNldHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBtb2RlbHMgPSByZXF1aXJlKFwiLi4vLi4vbGliL21vZGVsc1wiKTtcbmNvbnN0IG1ldGFkYXRhID0gcmVxdWlyZShcIi4uLy4uL2xpYi9tZXRhZGF0YVwiKTtcblxuY29uc3QgZGVmYXVsdEZhY2V0cyA9IHtcbiAgICBzb3VyY2U6IHtcbiAgICAgICAgdGl0bGU6IChpMThuKSA9PiBpMThuLmdldHRleHQoXCJTb3VyY2VcIiksXG5cbiAgICAgICAgZmFjZXQ6ICgpID0+ICh7XG4gICAgICAgICAgICB0ZXJtczoge1xuICAgICAgICAgICAgICAgIGZpZWxkOiBcInNvdXJjZS5yYXdcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuXG4gICAgICAgIGZvcm1hdEJ1Y2tldHM6IChidWNrZXRzKSA9PiBidWNrZXRzLm1hcCgoYnVja2V0KSA9PiAoe1xuICAgICAgICAgICAgdGV4dDogbW9kZWxzKFwiU291cmNlXCIpLmdldFNvdXJjZShidWNrZXQua2V5KS5uYW1lLFxuICAgICAgICAgICAgY291bnQ6IGJ1Y2tldC5kb2NfY291bnQsXG4gICAgICAgICAgICB1cmw6IHtzb3VyY2U6IGJ1Y2tldC5rZXl9LFxuICAgICAgICB9KSksXG4gICAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gKHR5cGUpID0+IHtcbiAgICBjb25zdCBmYWNldHMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0RmFjZXRzKTtcbiAgICBjb25zdCBtb2RlbCA9IG1ldGFkYXRhLm1vZGVsKHR5cGUpO1xuXG4gICAgZm9yIChjb25zdCBuYW1lIGluIG1vZGVsKSB7XG4gICAgICAgIGNvbnN0IHR5cGVNb2RlbCA9IG1vZGVsW25hbWVdO1xuXG4gICAgICAgIGlmICh0eXBlTW9kZWwuZmFjZXQpIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oZmFjZXRzLCB0eXBlTW9kZWwuZmFjZXQoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFjZXRzO1xufTtcbiJdfQ==