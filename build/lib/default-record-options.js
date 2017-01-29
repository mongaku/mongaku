"use strict";

module.exports = {
    getSearchPlaceholder: function getSearchPlaceholder() {
        return "";
    },

    searchNumRecords: 100,

    imagesRequired: true,
    noImages: false,
    noImageSearch: false,

    urlRequired: false,
    noURLs: false,

    name: function name(i18n) {
        return i18n.gettext("Records");
    },

    recordTitle: function recordTitle(record) {
        return record.title;
    },


    defaultImage: "/images/broken-image.svg",

    converters: {},

    views: {},

    filters: [],

    display: [],

    cloneFields: [],

    sorts: {},

    model: {},

    searchURLs: {},

    hasImages: function hasImages() {
        return !this.noImages;
    },
    requiresImages: function requiresImages() {
        return this.hasImages() && this.imagesRequired;
    },
    hasImageSearch: function hasImageSearch() {
        return this.hasImages() && !this.noImageSearch;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZGVmYXVsdC1yZWNvcmQtb3B0aW9ucy5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0U2VhcmNoUGxhY2Vob2xkZXIiLCJzZWFyY2hOdW1SZWNvcmRzIiwiaW1hZ2VzUmVxdWlyZWQiLCJub0ltYWdlcyIsIm5vSW1hZ2VTZWFyY2giLCJ1cmxSZXF1aXJlZCIsIm5vVVJMcyIsIm5hbWUiLCJpMThuIiwiZ2V0dGV4dCIsInJlY29yZFRpdGxlIiwicmVjb3JkIiwidGl0bGUiLCJkZWZhdWx0SW1hZ2UiLCJjb252ZXJ0ZXJzIiwidmlld3MiLCJmaWx0ZXJzIiwiZGlzcGxheSIsImNsb25lRmllbGRzIiwic29ydHMiLCJtb2RlbCIsInNlYXJjaFVSTHMiLCJoYXNJbWFnZXMiLCJyZXF1aXJlc0ltYWdlcyIsImhhc0ltYWdlU2VhcmNoIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2JDLDBCQUFzQjtBQUFBLGVBQU0sRUFBTjtBQUFBLEtBRFQ7O0FBR2JDLHNCQUFrQixHQUhMOztBQUtiQyxvQkFBZ0IsSUFMSDtBQU1iQyxjQUFVLEtBTkc7QUFPYkMsbUJBQWUsS0FQRjs7QUFTYkMsaUJBQWEsS0FUQTtBQVViQyxZQUFRLEtBVks7O0FBWWJDLFVBQU0sY0FBQ0MsSUFBRDtBQUFBLGVBQVVBLEtBQUtDLE9BQUwsQ0FBYSxTQUFiLENBQVY7QUFBQSxLQVpPOztBQWNiQyxlQWRhLHVCQWNEQyxNQWRDLEVBY087QUFDaEIsZUFBT0EsT0FBT0MsS0FBZDtBQUNILEtBaEJZOzs7QUFrQmJDLGtCQUFjLDBCQWxCRDs7QUFvQmJDLGdCQUFZLEVBcEJDOztBQXNCYkMsV0FBTyxFQXRCTTs7QUF3QmJDLGFBQVMsRUF4Qkk7O0FBMEJiQyxhQUFTLEVBMUJJOztBQTRCYkMsaUJBQWEsRUE1QkE7O0FBOEJiQyxXQUFPLEVBOUJNOztBQWdDYkMsV0FBTyxFQWhDTTs7QUFrQ2JDLGdCQUFZLEVBbENDOztBQW9DYkMsYUFwQ2EsdUJBb0NEO0FBQ1IsZUFBTyxDQUFDLEtBQUtuQixRQUFiO0FBQ0gsS0F0Q1k7QUF3Q2JvQixrQkF4Q2EsNEJBd0NJO0FBQ2IsZUFBTyxLQUFLRCxTQUFMLE1BQW9CLEtBQUtwQixjQUFoQztBQUNILEtBMUNZO0FBNENic0Isa0JBNUNhLDRCQTRDSTtBQUNiLGVBQU8sS0FBS0YsU0FBTCxNQUFvQixDQUFDLEtBQUtsQixhQUFqQztBQUNIO0FBOUNZLENBQWpCIiwiZmlsZSI6ImRlZmF1bHQtcmVjb3JkLW9wdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZXRTZWFyY2hQbGFjZWhvbGRlcjogKCkgPT4gXCJcIixcblxuICAgIHNlYXJjaE51bVJlY29yZHM6IDEwMCxcblxuICAgIGltYWdlc1JlcXVpcmVkOiB0cnVlLFxuICAgIG5vSW1hZ2VzOiBmYWxzZSxcbiAgICBub0ltYWdlU2VhcmNoOiBmYWxzZSxcblxuICAgIHVybFJlcXVpcmVkOiBmYWxzZSxcbiAgICBub1VSTHM6IGZhbHNlLFxuXG4gICAgbmFtZTogKGkxOG4pID0+IGkxOG4uZ2V0dGV4dChcIlJlY29yZHNcIiksXG5cbiAgICByZWNvcmRUaXRsZShyZWNvcmQpIHtcbiAgICAgICAgcmV0dXJuIHJlY29yZC50aXRsZTtcbiAgICB9LFxuXG4gICAgZGVmYXVsdEltYWdlOiBcIi9pbWFnZXMvYnJva2VuLWltYWdlLnN2Z1wiLFxuXG4gICAgY29udmVydGVyczoge30sXG5cbiAgICB2aWV3czoge30sXG5cbiAgICBmaWx0ZXJzOiBbXSxcblxuICAgIGRpc3BsYXk6IFtdLFxuXG4gICAgY2xvbmVGaWVsZHM6IFtdLFxuXG4gICAgc29ydHM6IHt9LFxuXG4gICAgbW9kZWw6IHt9LFxuXG4gICAgc2VhcmNoVVJMczoge30sXG5cbiAgICBoYXNJbWFnZXMoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5ub0ltYWdlcztcbiAgICB9LFxuXG4gICAgcmVxdWlyZXNJbWFnZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc0ltYWdlcygpICYmIHRoaXMuaW1hZ2VzUmVxdWlyZWQ7XG4gICAgfSxcblxuICAgIGhhc0ltYWdlU2VhcmNoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXNJbWFnZXMoKSAmJiAhdGhpcy5ub0ltYWdlU2VhcmNoO1xuICAgIH0sXG59O1xuIl19