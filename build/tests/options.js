"use strict";

var types = {
    architecture: {
        name: function name(i18n) {
            return i18n.gettext("Architecture");
        }
    },

    "decorative arts": {
        name: function name(i18n) {
            return i18n.gettext("Decorative Arts");
        }
    },

    drawing: {
        name: function name(i18n) {
            return i18n.gettext("Drawing");
        }
    },

    fresco: {
        name: function name(i18n) {
            return i18n.gettext("Fresco");
        }
    },

    medal: {
        name: function name(i18n) {
            return i18n.gettext("Medal");
        }
    },

    miniature: {
        name: function name(i18n) {
            return i18n.gettext("Miniature");
        }
    },

    mosaic: {
        name: function name(i18n) {
            return i18n.gettext("Mosaic");
        }
    },

    painting: {
        name: function name(i18n) {
            return i18n.gettext("Painting");
        }
    },

    photo: {
        name: function name(i18n) {
            return i18n.gettext("Photo");
        }
    },

    print: {
        name: function name(i18n) {
            return i18n.gettext("Print");
        }
    },

    sculpture: {
        name: function name(i18n) {
            return i18n.gettext("Sculpture");
        }
    },

    "stained glass": {
        name: function name(i18n) {
            return i18n.gettext("Stained Glass");
        }
    }
};

module.exports = {
    types: {
        artworks: {
            urlRequired: true,

            filters: ["artists", "locations", "objectType", "dates", "dimensions"],

            display: ["artists", "dates", "objectType", "medium", "dimensions", "categories", "locations"],

            sorts: {
                "dates.asc": function datesAsc(i18n) {
                    return i18n.gettext("Date, earliest first");
                },
                "dates.desc": function datesDesc(i18n) {
                    return i18n.gettext("Date, latest first");
                }
            },

            model: {
                // The title of the record.
                title: {
                    type: "SimpleString",
                    title: function title(i18n) {
                        return i18n.gettext("Title");
                    },
                    recommended: true
                },

                // A list of artist names extracted from the page.
                artists: {
                    type: "Name",
                    searchName: "artist",
                    title: function title(i18n) {
                        return i18n.gettext("Artist");
                    },
                    placeholder: function placeholder(i18n) {
                        return i18n.gettext("Sample: Andrea del Sarto");
                    }
                },

                // Date ranges when the record was created or modified.
                dates: {
                    type: "YearRange",
                    searchName: "date",
                    title: function title(i18n) {
                        return i18n.gettext("Date");
                    },
                    placeholder: function placeholder() {
                        return {
                            end: 1900,
                            start: 1000
                        };
                    }
                },

                // The English form of the object type (e.g. painting, print)
                objectType: {
                    type: "FixedString",
                    searchName: "objectType",
                    title: function title(i18n) {
                        return i18n.gettext("Type");
                    },
                    placeholder: function placeholder(i18n) {
                        return i18n.gettext("Any Type");
                    },
                    allowUnknown: false,
                    values: types,
                    recommended: true,
                    url: function url(value) {
                        return "/artworks/type/" + value;
                    }
                },

                // The medium of the record (e.g. "watercolor")
                medium: {
                    type: "SimpleString",
                    title: function title(i18n) {
                        return i18n.gettext("Medium");
                    },
                    searchField: "filter"
                },

                // The size of the record (e.g. 100mm x 200mm)
                dimensions: {
                    type: "Dimension",
                    title: function title(i18n) {
                        return i18n.gettext("Dimensions");
                    },
                    heightTitle: function heightTitle(i18n) {
                        return i18n.gettext("Height");
                    },
                    widthTitle: function widthTitle(i18n) {
                        return i18n.gettext("Width");
                    },
                    placeholder: function placeholder() {
                        return {
                            max: 200,
                            min: 10
                        };
                    }
                },

                // Locations where the record is stored
                locations: {
                    type: "Location",
                    searchName: "location",
                    title: function title(i18n) {
                        return i18n.gettext("Location");
                    },
                    placeholder: function placeholder(i18n) {
                        return i18n.gettext("Sample: Louvre");
                    }
                },

                // Categories classifying the record
                // The medium of the record (e.g. "watercolor")
                categories: {
                    type: "SimpleString",
                    title: function title(i18n) {
                        return i18n.gettext("Categories");
                    },
                    multiple: true,
                    searchField: "filter"
                }
            },

            searchURLs: {
                "/type/:objectType": function typeObjectType(req, res, next, search) {
                    var type = types[req.params.objectType];

                    if (!type) {
                        return res.status(404).render("Error", {
                            title: req.gettext("Not found.")
                        });
                    }

                    search(req, res);
                }
            }
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0cy9vcHRpb25zLmpzIl0sIm5hbWVzIjpbInR5cGVzIiwiYXJjaGl0ZWN0dXJlIiwibmFtZSIsImkxOG4iLCJnZXR0ZXh0IiwiZHJhd2luZyIsImZyZXNjbyIsIm1lZGFsIiwibWluaWF0dXJlIiwibW9zYWljIiwicGFpbnRpbmciLCJwaG90byIsInByaW50Iiwic2N1bHB0dXJlIiwibW9kdWxlIiwiZXhwb3J0cyIsImFydHdvcmtzIiwidXJsUmVxdWlyZWQiLCJmaWx0ZXJzIiwiZGlzcGxheSIsInNvcnRzIiwibW9kZWwiLCJ0aXRsZSIsInR5cGUiLCJyZWNvbW1lbmRlZCIsImFydGlzdHMiLCJzZWFyY2hOYW1lIiwicGxhY2Vob2xkZXIiLCJkYXRlcyIsImVuZCIsInN0YXJ0Iiwib2JqZWN0VHlwZSIsImFsbG93VW5rbm93biIsInZhbHVlcyIsInVybCIsInZhbHVlIiwibWVkaXVtIiwic2VhcmNoRmllbGQiLCJkaW1lbnNpb25zIiwiaGVpZ2h0VGl0bGUiLCJ3aWR0aFRpdGxlIiwibWF4IiwibWluIiwibG9jYXRpb25zIiwiY2F0ZWdvcmllcyIsIm11bHRpcGxlIiwic2VhcmNoVVJMcyIsInJlcSIsInJlcyIsIm5leHQiLCJzZWFyY2giLCJwYXJhbXMiLCJzdGF0dXMiLCJyZW5kZXIiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsUUFBUTtBQUNWQyxrQkFBYztBQUNWQyxjQUFNLGNBQUNDLElBQUQ7QUFBQSxtQkFBVUEsS0FBS0MsT0FBTCxDQUFhLGNBQWIsQ0FBVjtBQUFBO0FBREksS0FESjs7QUFLVix1QkFBbUI7QUFDZkYsY0FBTSxjQUFDQyxJQUFEO0FBQUEsbUJBQVVBLEtBQUtDLE9BQUwsQ0FBYSxpQkFBYixDQUFWO0FBQUE7QUFEUyxLQUxUOztBQVNWQyxhQUFTO0FBQ0xILGNBQU0sY0FBQ0MsSUFBRDtBQUFBLG1CQUFVQSxLQUFLQyxPQUFMLENBQWEsU0FBYixDQUFWO0FBQUE7QUFERCxLQVRDOztBQWFWRSxZQUFR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K0JBQVVBLEtBQUtDLE9BQUwsQ0FBYSxnQkFBYixDQUFWO0FBQUE7QUFKTixpQkE1RFI7O0FBbUVIO0FBQ0E7QUFDQXdDLDRCQUFZO0FBQ1JyQiwwQkFBTSxjQURFO0FBRVJELDJCQUFPLGVBQUNuQixJQUFEO0FBQUEsK0JBQVVBLEtBQUtDLE9BQUwsQ0FBYSxZQUFiLENBQVY7QUFBQSxxQkFGQztBQUdSeUMsOEJBQVUsSUFIRjtBQUlSUixpQ0FBYTtBQUpMO0FBckVULGFBZEQ7O0FBMkZOUyx3QkFBWTtBQUNSLHFDQUFxQix3QkFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVdDLElBQVgsRUFBaUJDLE1BQWpCLEVBQTRCO0FBQzdDLHdCQUFNM0IsT0FBT3ZCLE1BQU0rQyxJQUFJSSxNQUFKLENBQVdwQixVQUFqQixDQUFiOztBQUVBLHdCQUFJLENBQUNSLElBQUwsRUFBVztBQUNQLCtCQUFPeUIsSUFBSUksTUFBSixDQUFXLEdBQVgsRUFBZ0JDLE1BQWhCLENBQXVCLE9BQXZCLEVBQWdDO0FBQ25DL0IsbUNBQU95QixJQUFJM0MsT0FBSixDQUFZLFlBQVo7QUFENEIseUJBQWhDLENBQVA7QUFHSDs7QUFFRDhDLDJCQUFPSCxHQUFQLEVBQVlDLEdBQVo7QUFDSDtBQVhPO0FBM0ZOO0FBRFA7QUFETSxDQUFqQiIsImZpbGUiOiJvcHRpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdHlwZXMgPSB7XG4gICAgYXJjaGl0ZWN0dXJlOiB7XG4gICAgICAgIG5hbWU6IChpMThuKSA9PiBpMThuLmdldHRleHQoXCJBcmNoaXRlY3R1cmVcIiksXG4gICAgfSxcblxuICAgIFwiZGVjb3JhdGl2ZSBhcnRzXCI6IHtcbiAgICAgICAgbmFtZTogKGkxOG4pID0+IGkxOG4uZ2V0dGV4dChcIkRlY29yYXRpdmUgQXJ0c1wiKSxcbiAgICB9LFxuXG4gICAgZHJhd2luZzoge1xuICAgICAgICBuYW1lOiAoaTE4bikgPT4gaTE4bi5nZXR0ZXh0KFwiRHJhd2luZ1wiKSxcbiAgICB9LFxuXG4gICAgZnJlc2NvOiB7XG4gICAgICAgIG5hbWU6IChpMThuKSA9PiBpMThuLmdldHRleHQoXCJGcmVzY29cIiksXG4gICAgfSxcblxuICAgIG1lZGFsOiB7XG4gICAgICAgIG5hbWU6IChpMThuKSA9PiBpMThuLmdldHRleHQoXCJNZWRhbFwiKSxcbiAgICB9LFxuXG4gICAgbWluaWF0dXJlOiB7XG4gICAgICAgIG5hbWU6IChpMThuKSA9PiBpMThuLmdldHRleHQoXCJNaW5pYXR1cmVcIiksXG4gICAgfSxcblxuICAgIG1vc2FpYzoge1xuICAgICAgICBuYW1lOiAoaTE4bikgPT4gaTE4bi5nZXR0ZXh0KFwiTW9zYWljXCIpLFxuICAgIH0sXG5cbiAgICBwYWludGluZzoge1xuICAgICAgICBuYW1lOiAoaTE4bikgPT4gaTE4bi5nZXR0ZXh0KFwiUGFpbnRpbmdcIiksXG4gICAgfSxcblxuICAgIHBob3RvOiB7XG4gICAgICAgIG5hbWU6IChpMThuKSA9PiBpMThuLmdldHRleHQoXCJQaG90b1wiKSxcbiAgICB9LFxuXG4gICAgcHJpbnQ6IHtcbiAgICAgICAgbmFtZTogKGkxOG4pID0+IGkxOG4uZ2V0dGV4dChcIlByaW50XCIpLFxuICAgIH0sXG5cbiAgICBzY3VscHR1cmU6IHtcbiAgICAgICAgbmFtZTogKGkxOG4pID0+IGkxOG4uZ2V0dGV4dChcIlNjdWxwdHVyZVwiKSxcbiAgICB9LFxuXG4gICAgXCJzdGFpbmVkIGdsYXNzXCI6IHtcbiAgICAgICAgbmFtZTogKGkxOG4pID0+IGkxOG4uZ2V0dGV4dChcIlN0YWluZWQgR2xhc3NcIiksXG4gICAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHR5cGVzOiB7XG4gICAgICAgIGFydHdvcmtzOiB7XG4gICAgICAgICAgICB1cmxSZXF1aXJlZDogdHJ1ZSxcblxuICAgICAgICAgICAgZmlsdGVyczogW1wiYXJ0aXN0c1wiLCBcImxvY2F0aW9uc1wiLCBcIm9iamVjdFR5cGVcIiwgXCJkYXRlc1wiLFxuICAgICAgICAgICAgICAgIFwiZGltZW5zaW9uc1wiXSxcblxuICAgICAgICAgICAgZGlzcGxheTogW1wiYXJ0aXN0c1wiLCBcImRhdGVzXCIsIFwib2JqZWN0VHlwZVwiLCBcIm1lZGl1bVwiLCBcImRpbWVuc2lvbnNcIixcbiAgICAgICAgICAgICAgICBcImNhdGVnb3JpZXNcIiwgXCJsb2NhdGlvbnNcIl0sXG5cbiAgICAgICAgICAgIHNvcnRzOiB7XG4gICAgICAgICAgICAgICAgXCJkYXRlcy5hc2NcIjogKGkxOG4pID0+IGkxOG4uZ2V0dGV4dChcIkRhdGUsIGVhcmxpZXN0IGZpcnN0XCIpLFxuICAgICAgICAgICAgICAgIFwiZGF0ZXMuZGVzY1wiOiAoaTE4bikgPT4gaTE4bi5nZXR0ZXh0KFwiRGF0ZSwgbGF0ZXN0IGZpcnN0XCIpLFxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgdGl0bGUgb2YgdGhlIHJlY29yZC5cbiAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlNpbXBsZVN0cmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogKGkxOG4pID0+IGkxOG4uZ2V0dGV4dChcIlRpdGxlXCIpLFxuICAgICAgICAgICAgICAgICAgICByZWNvbW1lbmRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLy8gQSBsaXN0IG9mIGFydGlzdCBuYW1lcyBleHRyYWN0ZWQgZnJvbSB0aGUgcGFnZS5cbiAgICAgICAgICAgICAgICBhcnRpc3RzOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiTmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICBzZWFyY2hOYW1lOiBcImFydGlzdFwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogKGkxOG4pID0+IGkxOG4uZ2V0dGV4dChcIkFydGlzdFwiKSxcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IChpMThuKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgaTE4bi5nZXR0ZXh0KFwiU2FtcGxlOiBBbmRyZWEgZGVsIFNhcnRvXCIpLFxuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvLyBEYXRlIHJhbmdlcyB3aGVuIHRoZSByZWNvcmQgd2FzIGNyZWF0ZWQgb3IgbW9kaWZpZWQuXG4gICAgICAgICAgICAgICAgZGF0ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJZZWFyUmFuZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoTmFtZTogXCJkYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAoaTE4bikgPT4gaTE4bi5nZXR0ZXh0KFwiRGF0ZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6ICgpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IDE5MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydDogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8vIFRoZSBFbmdsaXNoIGZvcm0gb2YgdGhlIG9iamVjdCB0eXBlIChlLmcuIHBhaW50aW5nLCBwcmludClcbiAgICAgICAgICAgICAgICBvYmplY3RUeXBlOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiRml4ZWRTdHJpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoTmFtZTogXCJvYmplY3RUeXBlXCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAoaTE4bikgPT4gaTE4bi5nZXR0ZXh0KFwiVHlwZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IChpMThuKSA9PiBpMThuLmdldHRleHQoXCJBbnkgVHlwZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgYWxsb3dVbmtub3duOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiB0eXBlcyxcbiAgICAgICAgICAgICAgICAgICAgcmVjb21tZW5kZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHVybDogKHZhbHVlKSA9PiBgL2FydHdvcmtzL3R5cGUvJHt2YWx1ZX1gLFxuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvLyBUaGUgbWVkaXVtIG9mIHRoZSByZWNvcmQgKGUuZy4gXCJ3YXRlcmNvbG9yXCIpXG4gICAgICAgICAgICAgICAgbWVkaXVtOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiU2ltcGxlU3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAoaTE4bikgPT4gaTE4bi5nZXR0ZXh0KFwiTWVkaXVtXCIpLFxuICAgICAgICAgICAgICAgICAgICBzZWFyY2hGaWVsZDogXCJmaWx0ZXJcIixcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLy8gVGhlIHNpemUgb2YgdGhlIHJlY29yZCAoZS5nLiAxMDBtbSB4IDIwMG1tKVxuICAgICAgICAgICAgICAgIGRpbWVuc2lvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJEaW1lbnNpb25cIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IChpMThuKSA9PiBpMThuLmdldHRleHQoXCJEaW1lbnNpb25zXCIpLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHRUaXRsZTogKGkxOG4pID0+IGkxOG4uZ2V0dGV4dChcIkhlaWdodFwiKSxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGhUaXRsZTogKGkxOG4pID0+IGkxOG4uZ2V0dGV4dChcIldpZHRoXCIpLFxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogKCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heDogMjAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWluOiAxMCxcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8vIExvY2F0aW9ucyB3aGVyZSB0aGUgcmVjb3JkIGlzIHN0b3JlZFxuICAgICAgICAgICAgICAgIGxvY2F0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkxvY2F0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaE5hbWU6IFwibG9jYXRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IChpMThuKSA9PiBpMThuLmdldHRleHQoXCJMb2NhdGlvblwiKSxcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IChpMThuKSA9PiBpMThuLmdldHRleHQoXCJTYW1wbGU6IExvdXZyZVwiKSxcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLy8gQ2F0ZWdvcmllcyBjbGFzc2lmeWluZyB0aGUgcmVjb3JkXG4gICAgICAgICAgICAgICAgLy8gVGhlIG1lZGl1bSBvZiB0aGUgcmVjb3JkIChlLmcuIFwid2F0ZXJjb2xvclwiKVxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJTaW1wbGVTdHJpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IChpMThuKSA9PiBpMThuLmdldHRleHQoXCJDYXRlZ29yaWVzXCIpLFxuICAgICAgICAgICAgICAgICAgICBtdWx0aXBsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoRmllbGQ6IFwiZmlsdGVyXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNlYXJjaFVSTHM6IHtcbiAgICAgICAgICAgICAgICBcIi90eXBlLzpvYmplY3RUeXBlXCI6IChyZXEsIHJlcywgbmV4dCwgc2VhcmNoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSB0eXBlc1tyZXEucGFyYW1zLm9iamVjdFR5cGVdO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghdHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5yZW5kZXIoXCJFcnJvclwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHJlcS5nZXR0ZXh0KFwiTm90IGZvdW5kLlwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoKHJlcSwgcmVzKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9LFxufTtcbiJdfQ==