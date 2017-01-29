"use strict";

var models = require("../../lib/models");
var metadata = require("../../lib/metadata");
var options = require("../../lib/options");

var getCurType = function getCurType(fields) {
    return fields.type || Object.keys(options.types)[0];
};

var defaultQueries = {
    format: {
        value: function value(fields) {
            return fields.format;
        },
        defaultValue: function defaultValue() {
            return "html";
        },
        secondary: true
    },

    type: {
        value: function value(fields) {
            return fields.type;
        },
        defaultValue: getCurType,
        secondary: true
    },

    start: {
        value: function value(fields) {
            return parseFloat(fields.start);
        },
        defaultValue: function defaultValue() {
            return 0;
        },
        secondary: true
    },

    rows: {
        value: function value(fields) {
            return parseFloat(fields.rows);
        },
        defaultValue: function defaultValue(fields) {
            return options.types[getCurType(fields)].searchNumRecords;
        },
        secondary: true
    },

    sort: {
        value: function value(fields) {
            return fields.sort;
        },
        defaultValue: function defaultValue(fields) {
            return Object.keys(options.types[getCurType(fields)].sorts)[0];
        },
        secondary: true
    },

    filter: {
        value: function value(fields) {
            return fields.filter;
        },
        defaultValue: function defaultValue() {
            return "";
        },
        searchTitle: function searchTitle(value, i18n) {
            return i18n.format(i18n.gettext("Query: '%(query)s'"), { query: value });
        },
        filter: function filter(value) {
            return {
                query_string: {
                    query: value || "*",
                    default_operator: "and"
                }
            };
        }
    },

    source: {
        value: function value(fields) {
            return fields.source;
        },
        defaultValue: function defaultValue() {
            return undefined;
        },
        searchTitle: function searchTitle(value, i18n) {
            return models("Source").getSource(value).getFullName(i18n.lang);
        },
        url: function url(value) {
            return models("Source").getSource(value);
        },
        filter: function filter(value) {
            return {
                match: {
                    "source.name": {
                        query: escape(value),
                        operator: "or",
                        zero_terms_query: "all"
                    }
                }
            };
        }
    },

    similar: {
        filters: {
            any: {
                getTitle: function getTitle(i18n) {
                    return i18n.gettext("Similar to Any Record");
                },
                match: function match() {
                    return {
                        range: {
                            "similarRecords.score": {
                                gte: 1
                            }
                        }
                    };
                }
            },

            external: {
                getTitle: function getTitle(i18n) {
                    return i18n.gettext("Similar to an External Record");
                },
                match: function match() {
                    var sourceIDs = models("Source").getSources().map(function (source) {
                        return source._id;
                    });
                    var should = sourceIDs.map(function (sourceID) {
                        return {
                            bool: {
                                must: [{
                                    match: {
                                        source: sourceID
                                    }
                                }, {
                                    match: {
                                        "similarRecords.source": {
                                            query: sourceIDs.filter(function (id) {
                                                return id !== sourceID;
                                            }).join(" "),
                                            operator: "or"
                                        }
                                    }
                                }]
                            }
                        };
                    });

                    return { bool: { should: should } };
                }
            },

            internal: {
                getTitle: function getTitle(i18n) {
                    return i18n.gettext("Similar to an Internal Record");
                },
                match: function match() {
                    var sourceIDs = models("Source").getSources().map(function (source) {
                        return source._id;
                    });
                    var should = sourceIDs.map(function (sourceID) {
                        return {
                            bool: {
                                must: [{
                                    match: {
                                        source: sourceID
                                    }
                                }, {
                                    match: {
                                        "similarRecords.source": {
                                            query: sourceID,
                                            operator: "or"
                                        }
                                    }
                                }]
                            }
                        };
                    });

                    return { bool: { should: should } };
                }
            }
        },
        value: function value(fields) {
            return fields.similar;
        },
        defaultValue: function defaultValue() {
            return undefined;
        },
        searchTitle: function searchTitle(value, i18n) {
            return this.filters[value].getTitle(i18n);
        },
        filter: function filter(value) {
            return this.filters[value].match();
        }
    },

    images: {
        filters: {
            hasImage: {
                getTitle: function getTitle(i18n) {
                    return i18n.gettext("Has An Image");
                },
                match: function match() {
                    return {
                        exists: {
                            field: "images"
                        }
                    };
                }
            },

            hasNoImage: {
                getTitle: function getTitle(i18n) {
                    return i18n.gettext("Has No Image");
                },
                match: function match() {
                    return {
                        bool: {
                            must_not: [{
                                exists: {
                                    field: "images"
                                }
                            }]
                        }
                    };
                }
            }
        },
        value: function value(fields) {
            return fields.images;
        },
        defaultValue: function defaultValue() {
            return undefined;
        },
        searchTitle: function searchTitle(value, i18n) {
            return this.filters[value].getTitle(i18n);
        },
        filter: function filter(value) {
            return this.filters[value].match();
        }
    },

    created: {
        value: function value() {
            return 0;
        },
        defaultValue: function defaultValue() {
            return 0;
        },
        secondary: true,
        sort: function sort() {
            return {
                asc: [{
                    "created": {
                        order: "asc"
                    }
                }],

                desc: [{
                    "created": {
                        order: "desc"
                    }
                }]
            };
        }
    }
};

module.exports = function (type) {
    return Object.assign({}, defaultQueries, metadata.model(type));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sb2dpYy9zaGFyZWQvcXVlcmllcy5qcyJdLCJuYW1lcyI6WyJtb2RlbHMiLCJyZXF1aXJlIiwibWV0YWRhdGEiLCJvcHRpb25zIiwiZ2V0Q3VyVHlwZSIsImZpZWxkcyIsInR5cGUiLCJPYmplY3QiLCJrZXlzIiwidHlwZXMiLCJkZWZhdWx0UXVlcmllcyIsImZvcm1hdCIsInZhbHVlIiwiZGVmYXVsdFZhbHVlIiwic2Vjb25kYXJ5Iiwic3RhcnQiLCJwYXJzZUZsb2F0Iiwicm93cyIsInNlYXJjaE51bVJlY29yZHMiLCJzb3J0Iiwic29ydHMiLCJmaWx0ZXIiLCJzZWFyY2hUaXRsZSIsImkxOG4iLCJnZXR0ZXh0IiwicXVlcnkiLCJxdWVyeV9zdHJpbmciLCJkZWZhdWx0X29wZXJhdG9yIiwic291cmNlIiwidW5kZWZpbmVkIiwiZ2V0U291cmNlIiwiZ2V0RnVsbE5hbWUiLCJsYW5nIiwidXJsIiwibWF0Y2giLCJlc2NhcGUiLCJvcGVyYXRvciIsInplcm9fdGVybXNfcXVlcnkiLCJzaW1pbGFyIiwiZmlsdGVycyIsImFueSIsImdldFRpdGxlIiwicmFuZ2UiLCJndGUiLCJleHRlcm5hbCIsInNvdXJjZUlEcyIsImdldFNvdXJjZXMiLCJtYXAiLCJfaWQiLCJzaG91bGQiLCJzb3VyY2VJRCIsImJvb2wiLCJtdXN0IiwiaWQiLCJqb2luIiwiaW50ZXJuYWwiLCJpbWFnZXMiLCJoYXNJbWFnZSIsImV4aXN0cyIsImZpZWxkIiwiaGFzTm9JbWFnZSIsIm11c3Rfbm90IiwiY3JlYXRlZCIsImFzYyIsIm9yZGVyIiwiZGVzYyIsIm1vZHVsZSIsImV4cG9ydHMiLCJhc3NpZ24iLCJtb2RlbCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxTQUFTQyxRQUFRLGtCQUFSLENBQWY7QUFDQSxJQUFNQyxXQUFXRCxRQUFRLG9CQUFSLENBQWpCO0FBQ0EsSUFBTUUsVUFBVUYsUUFBUSxtQkFBUixDQUFoQjs7QUFFQSxJQUFNRyxhQUFhLFNBQWJB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RSxPQUFPQyxPQUFQLEdBQWlCLFVBQUM3RCxJQUFELEVBQVU7QUFDdkIsV0FBT0MsT0FBTzZELE1BQVAsQ0FBYyxFQUFkLEVBQWtCMUQsY0FBbEIsRUFDSFIsU0FBU21FLEtBQVQsQ0FBZS9ELElBQWYsQ0FERyxDQUFQO0FBRUgsQ0FIRCIsImZpbGUiOiJxdWVyaWVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgbW9kZWxzID0gcmVxdWlyZShcIi4uLy4uL2xpYi9tb2RlbHNcIik7XG5jb25zdCBtZXRhZGF0YSA9IHJlcXVpcmUoXCIuLi8uLi9saWIvbWV0YWRhdGFcIik7XG5jb25zdCBvcHRpb25zID0gcmVxdWlyZShcIi4uLy4uL2xpYi9vcHRpb25zXCIpO1xuXG5jb25zdCBnZXRDdXJUeXBlID0gKGZpZWxkcykgPT4gZmllbGRzLnR5cGUgfHxcbiAgICBPYmplY3Qua2V5cyhvcHRpb25zLnR5cGVzKVswXTtcblxuY29uc3QgZGVmYXVsdFF1ZXJpZXMgPSB7XG4gICAgZm9ybWF0OiB7XG4gICAgICAgIHZhbHVlOiAoZmllbGRzKSA9PiBmaWVsZHMuZm9ybWF0LFxuICAgICAgICBkZWZhdWx0VmFsdWU6ICgpID0+IFwiaHRtbFwiLFxuICAgICAgICBzZWNvbmRhcnk6IHRydWUsXG4gICAgfSxcblxuICAgIHR5cGU6IHtcbiAgICAgICAgdmFsdWU6IChmaWVsZHMpID0+IGZpZWxkcy50eXBlLFxuICAgICAgICBkZWZhdWx0VmFsdWU6IGdldEN1clR5cGUsXG4gICAgICAgIHNlY29uZGFyeTogdHJ1ZSxcbiAgICB9LFxuXG4gICAgc3RhcnQ6IHtcbiAgICAgICAgdmFsdWU6IChmaWVsZHMpID0+IHBhcnNlRmxvYXQoZmllbGRzLnN0YXJ0KSxcbiAgICAgICAgZGVmYXVsdFZhbHVlOiAoKSA9PiAwLFxuICAgICAgICBzZWNvbmRhcnk6IHRydWUsXG4gICAgfSxcblxuICAgIHJvd3M6IHtcbiAgICAgICAgdmFsdWU6IChmaWVsZHMpID0+IHBhcnNlRmxvYXQoZmllbGRzLnJvd3MpLFxuICAgICAgICBkZWZhdWx0VmFsdWU6IChmaWVsZHMpID0+XG4gICAgICAgICAgICBvcHRpb25zLnR5cGVzW2dldEN1clR5cGUoZmllbGRzKV0uc2VhcmNoTnVtUmVjb3JkcyxcbiAgICAgICAgc2Vjb25kYXJ5OiB0cnVlLFxuICAgIH0sXG5cbiAgICBzb3J0OiB7XG4gICAgICAgIHZhbHVlOiAoZmllbGRzKSA9PiBmaWVsZHMuc29ydCxcbiAgICAgICAgZGVmYXVsdFZhbHVlOiAoZmllbGRzKSA9PlxuICAgICAgICAgICAgT2JqZWN0LmtleXMob3B0aW9ucy50eXBlc1tnZXRDdXJUeXBlKGZpZWxkcyldLnNvcnRzKVswXSxcbiAgICAgICAgc2Vjb25kYXJ5OiB0cnVlLFxuICAgIH0sXG5cbiAgICBmaWx0ZXI6IHtcbiAgICAgICAgdmFsdWU6IChmaWVsZHMpID0+IGZpZWxkcy5maWx0ZXIsXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogKCkgPT4gXCJcIixcbiAgICAgICAgc2VhcmNoVGl0bGU6ICh2YWx1ZSwgaTE4bikgPT4gaTE4bi5mb3JtYXQoXG4gICAgICAgICAgICBpMThuLmdldHRleHQoXCJRdWVyeTogJyUocXVlcnkpcydcIiksIHtxdWVyeTogdmFsdWV9KSxcbiAgICAgICAgZmlsdGVyOiAodmFsdWUpID0+ICh7XG4gICAgICAgICAgICBxdWVyeV9zdHJpbmc6IHtcbiAgICAgICAgICAgICAgICBxdWVyeTogdmFsdWUgfHwgXCIqXCIsXG4gICAgICAgICAgICAgICAgZGVmYXVsdF9vcGVyYXRvcjogXCJhbmRcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgIH0sXG5cbiAgICBzb3VyY2U6IHtcbiAgICAgICAgdmFsdWU6IChmaWVsZHMpID0+IGZpZWxkcy5zb3VyY2UsXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogKCkgPT4gdW5kZWZpbmVkLFxuICAgICAgICBzZWFyY2hUaXRsZTogKHZhbHVlLCBpMThuKSA9PiBtb2RlbHMoXCJTb3VyY2VcIikuZ2V0U291cmNlKHZhbHVlKVxuICAgICAgICAgICAgLmdldEZ1bGxOYW1lKGkxOG4ubGFuZyksXG4gICAgICAgIHVybDogKHZhbHVlKSA9PiBtb2RlbHMoXCJTb3VyY2VcIikuZ2V0U291cmNlKHZhbHVlKSxcbiAgICAgICAgZmlsdGVyOiAodmFsdWUpID0+ICh7XG4gICAgICAgICAgICBtYXRjaDoge1xuICAgICAgICAgICAgICAgIFwic291cmNlLm5hbWVcIjoge1xuICAgICAgICAgICAgICAgICAgICBxdWVyeTogZXNjYXBlKHZhbHVlKSxcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0b3I6IFwib3JcIixcbiAgICAgICAgICAgICAgICAgICAgemVyb190ZXJtc19xdWVyeTogXCJhbGxcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgfSxcblxuICAgIHNpbWlsYXI6IHtcbiAgICAgICAgZmlsdGVyczoge1xuICAgICAgICAgICAgYW55OiB7XG4gICAgICAgICAgICAgICAgZ2V0VGl0bGU6IChpMThuKSA9PiBpMThuLmdldHRleHQoXCJTaW1pbGFyIHRvIEFueSBSZWNvcmRcIiksXG4gICAgICAgICAgICAgICAgbWF0Y2g6ICgpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInNpbWlsYXJSZWNvcmRzLnNjb3JlXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBndGU6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZXh0ZXJuYWw6IHtcbiAgICAgICAgICAgICAgICBnZXRUaXRsZTogKGkxOG4pID0+XG4gICAgICAgICAgICAgICAgICAgIGkxOG4uZ2V0dGV4dChcIlNpbWlsYXIgdG8gYW4gRXh0ZXJuYWwgUmVjb3JkXCIpLFxuICAgICAgICAgICAgICAgIG1hdGNoOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNvdXJjZUlEcyA9IG1vZGVscyhcIlNvdXJjZVwiKS5nZXRTb3VyY2VzKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKHNvdXJjZSkgPT4gc291cmNlLl9pZCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNob3VsZCA9IHNvdXJjZUlEcy5tYXAoKHNvdXJjZUlEKSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgYm9vbDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG11c3Q6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2g6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHNvdXJjZUlELFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2g6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNpbWlsYXJSZWNvcmRzLnNvdXJjZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5OiBzb3VyY2VJRHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoKGlkKSA9PiBpZCAhPT0gc291cmNlSUQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuam9pbihcIiBcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yOiBcIm9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge2Jvb2w6IHtzaG91bGR9fTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgaW50ZXJuYWw6IHtcbiAgICAgICAgICAgICAgICBnZXRUaXRsZTogKGkxOG4pID0+XG4gICAgICAgICAgICAgICAgICAgIGkxOG4uZ2V0dGV4dChcIlNpbWlsYXIgdG8gYW4gSW50ZXJuYWwgUmVjb3JkXCIpLFxuICAgICAgICAgICAgICAgIG1hdGNoOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNvdXJjZUlEcyA9IG1vZGVscyhcIlNvdXJjZVwiKS5nZXRTb3VyY2VzKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKHNvdXJjZSkgPT4gc291cmNlLl9pZCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNob3VsZCA9IHNvdXJjZUlEcy5tYXAoKHNvdXJjZUlEKSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgYm9vbDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG11c3Q6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2g6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHNvdXJjZUlELFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2g6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNpbWlsYXJSZWNvcmRzLnNvdXJjZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5OiBzb3VyY2VJRCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0b3I6IFwib3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7Ym9vbDoge3Nob3VsZH19O1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB2YWx1ZTogKGZpZWxkcykgPT4gZmllbGRzLnNpbWlsYXIsXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogKCkgPT4gdW5kZWZpbmVkLFxuICAgICAgICBzZWFyY2hUaXRsZSh2YWx1ZSwgaTE4bikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyc1t2YWx1ZV0uZ2V0VGl0bGUoaTE4bik7XG4gICAgICAgIH0sXG4gICAgICAgIGZpbHRlcih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyc1t2YWx1ZV0ubWF0Y2goKTtcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgaW1hZ2VzOiB7XG4gICAgICAgIGZpbHRlcnM6IHtcbiAgICAgICAgICAgIGhhc0ltYWdlOiB7XG4gICAgICAgICAgICAgICAgZ2V0VGl0bGU6IChpMThuKSA9PiBpMThuLmdldHRleHQoXCJIYXMgQW4gSW1hZ2VcIiksXG4gICAgICAgICAgICAgICAgbWF0Y2g6ICgpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgIGV4aXN0czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQ6IFwiaW1hZ2VzXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBoYXNOb0ltYWdlOiB7XG4gICAgICAgICAgICAgICAgZ2V0VGl0bGU6IChpMThuKSA9PiBpMThuLmdldHRleHQoXCJIYXMgTm8gSW1hZ2VcIiksXG4gICAgICAgICAgICAgICAgbWF0Y2g6ICgpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgIGJvb2w6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG11c3Rfbm90OiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGlzdHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkOiBcImltYWdlc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgdmFsdWU6IChmaWVsZHMpID0+IGZpZWxkcy5pbWFnZXMsXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogKCkgPT4gdW5kZWZpbmVkLFxuICAgICAgICBzZWFyY2hUaXRsZSh2YWx1ZSwgaTE4bikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyc1t2YWx1ZV0uZ2V0VGl0bGUoaTE4bik7XG4gICAgICAgIH0sXG4gICAgICAgIGZpbHRlcih2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyc1t2YWx1ZV0ubWF0Y2goKTtcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgY3JlYXRlZDoge1xuICAgICAgICB2YWx1ZTogKCkgPT4gMCxcbiAgICAgICAgZGVmYXVsdFZhbHVlOiAoKSA9PiAwLFxuICAgICAgICBzZWNvbmRhcnk6IHRydWUsXG4gICAgICAgIHNvcnQoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGFzYzogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImNyZWF0ZWRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyOiBcImFzY1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuXG4gICAgICAgICAgICAgICAgZGVzYzogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImNyZWF0ZWRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyOiBcImRlc2NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gKHR5cGUpID0+IHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdFF1ZXJpZXMsXG4gICAgICAgIG1ldGFkYXRhLm1vZGVsKHR5cGUpKTtcbn07XG4iXX0=