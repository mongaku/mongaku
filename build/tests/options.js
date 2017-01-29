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