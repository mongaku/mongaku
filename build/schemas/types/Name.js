"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = require("react");

var YearRange = require("./YearRange.js");

var NameFilter = React.createFactory(require("../../views/types/filter/Name.js"));
var NameDisplay = React.createFactory(require("../../views/types/view/Name.js"));
var NameEdit = React.createFactory(require("../../views/types/edit/Name.js"));

var Name = function Name(options) {
    this.options = options;
    /*
    name
    type
    searchName
    title(i18n)
    placeholder(i18n)
    multiple: Boolean
    */
};

Name.prototype = {
    searchName: function searchName() {
        return this.options.searchName || this.options.name;
    },
    value: function value(query) {
        return query[this.searchName()];
    },
    defaultValue: function defaultValue() {
        return "";
    },
    fields: function fields(value) {
        return _defineProperty({}, this.searchName(), value);
    },
    title: function title(i18n) {
        return this.options.title(i18n);
    },
    searchTitle: function searchTitle(value, i18n) {
        var title = this.options.title(i18n);
        return title + ": " + value;
    },
    filter: function filter(value, sanitize) {
        return {
            multi_match: {
                fields: [this.options.name + ".name"],
                query: sanitize(value),
                operator: "and",
                zero_terms_query: "all"
            }
        };
    },
    facet: function facet() {
        var _this = this;

        return _defineProperty({}, this.options.name, {
            title: function title(i18n) {
                return _this.options.title(i18n);
            },

            // TODO: Make the number of facets configurable
            facet: function facet() {
                return {
                    terms: {
                        field: _this.options.name + ".name.raw",
                        size: 50
                    }
                };
            },

            formatBuckets: function formatBuckets(buckets) {
                return buckets.map(function (bucket) {
                    return {
                        text: bucket.key,
                        count: bucket.doc_count,
                        url: _defineProperty({}, _this.options.name, bucket.key)
                    };
                });
            }
        });
    },
    renderFilter: function renderFilter(value, values, i18n) {
        return NameFilter({
            name: this.options.name,
            searchName: this.searchName(),
            placeholder: this.options.placeholder(i18n),
            title: this.options.title(i18n),
            value: value,
            values: values,
            multiple: this.options.multiple
        });
    },
    renderView: function renderView(value) {
        return NameDisplay({
            name: this.options.name,
            type: this.options.type,
            value: value,
            multiple: this.options.multiple
        });
    },
    renderEdit: function renderEdit(value, names) {
        return NameEdit({
            name: this.options.name,
            type: this.options.type,
            value: value,
            names: names,
            multiple: this.options.multiple
        });
    },
    schema: function schema(Schema) {
        var NameSchema = new Schema({
            // An ID for the name, computed from the original + name properties
            // before validation.
            _id: String,

            // The original string from which the rest of the values were
            // derived
            original: String,

            // The locale for the string (e.g. 'en', 'ja')
            locale: String,

            // Any sort of name parsing options
            settings: Schema.Types.Mixed,

            // The English form of the full artist's name
            name: {
                type: String,
                es_indexed: true,
                es_type: "string",
                // A raw name to use for building aggregations in Elasticsearch
                es_fields: {
                    name: { type: "string", index: "analyzed" },
                    raw: { type: "string", index: "not_analyzed" }
                },
                recommended: true
            },

            // Same but in ascii (for example: Hokushō becomes Hokushoo)
            ascii: String,

            // Same but with diacritics stripped (Hokushō becomes Hokusho)
            plain: { type: String, es_indexed: true },

            // The English form of the given name
            given: String,

            // The English form of the middle name
            middle: String,

            // The English form of the surname
            surname: String,

            // A number representing the generation of the artist
            generation: Number,

            // A pseudonym for the person
            pseudonym: { type: String, es_indexed: true },

            // Is the artist unknown/unattributed
            unknown: Boolean,

            // Is this artist part of a school
            school: Boolean,

            // Was this work done in the style of, or after, an artist
            after: Boolean,

            // Is this work attributed to an artist
            attributed: Boolean,

            // Date when the name was used
            dates: YearRange.prototype.schema(Schema)
        });

        // Dynamically generate the _id attribute
        NameSchema.pre("validate", function (next) {
            this._id = this.original || this.name;
            next();
        });

        return {
            type: [NameSchema],
            convert: function convert(obj) {
                return typeof obj === "string" ? { name: obj } : obj;
            }
        };
    }
};

module.exports = Name;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zY2hlbWFzL3R5cGVzL05hbWUuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiWWVhclJhbmdlIiwiTmFtZUZpbHRlciIsImNyZWF0ZUZhY3RvcnkiLCJOYW1lRGlzcGxheSIsIk5hbWVFZGl0IiwiTmFtZSIsIm9wdGlvbnMiLCJwcm90b3R5cGUiLCJzZWFyY2hOYW1lIiwibmFtZSIsInZhbHVlIiwicXVlcnkiLCJkZWZhdWx0VmFsdWUiLCJmaWVsZHMiLCJ0aXRsZSIsImkxOG4iLCJzZWFyY2hUaXRsZSIsImZpbHRlciIsInNhbml0aXplIiwibXVsdGlfbWF0Y2giLCJvcGVyYXRvciIsInplcm9fdGVybXNfcXVlcnkiLCJmYWNldCIsInRlcm1zIiwiZmllbGQiLCJzaXplIiwiZm9ybWF0QnVja2V0cyIsImJ1Y2tldHMiLCJtYXAiLCJidWNrZXQiLCJ0ZXh0Iiwia2V5IiwiY291bnQiLCJkb2NfY291bnQiLCJ1cmwiLCJyZW5kZXJGaWx0ZXIiLCJ2YWx1ZXMiLCJwbGFjZWhvbGRlciIsIm11bHRpcGxlIiwicmVuZGVyVmlldyIsInR5cGUiLCJyZW5kZXJFZGl0IiwibmFtZXMiLCJzY2hlbWEiLCJTY2hlbWEiLCJOYW1lU2NoZW1hIiwiX2lkIiwiU3RyaW5nIiwib3JpZ2luYWwiLCJsb2NhbGUiLCJzZXR0aW5ncyIsIlR5cGVzIiwiTWl4ZWQiLCJlc19pbmRleGVkIiwiZXNfdHlwZSIsImVzX2ZpZWxkcyIsImluZGV4IiwicmF3IiwicmVjb21tZW5kZWQiLCJhc2NpaSIsInBsYWluIiwiZ2l2ZW4iLCJtaWRkbGUiLCJzdXJuYW1lIiwiZ2VuZXJhdGlvbiIsIk51bWJlciIsInBzZXVkb255bSIsInVua25vd24iLCJCb29sZWFuIiwic2Nob29sIiwiYWZ0ZXIiLCJhdHRyaWJ1dGVkIiwiZGF0ZXMiLCJwcmUiLCJuZXh0IiwiY29udmVydCIsIm9iaiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJ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YWN0XCIpO1xuXG5jb25zdCBZZWFyUmFuZ2UgPSByZXF1aXJlKFwiLi9ZZWFyUmFuZ2UuanNcIik7XG5cbmNvbnN0IE5hbWVGaWx0ZXIgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KFxuICAgIHJlcXVpcmUoXCIuLi8uLi92aWV3cy90eXBlcy9maWx0ZXIvTmFtZS5qc1wiKSk7XG5jb25zdCBOYW1lRGlzcGxheSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkoXG4gICAgcmVxdWlyZShcIi4uLy4uL3ZpZXdzL3R5cGVzL3ZpZXcvTmFtZS5qc1wiKSk7XG5jb25zdCBOYW1lRWRpdCA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkoXG4gICAgcmVxdWlyZShcIi4uLy4uL3ZpZXdzL3R5cGVzL2VkaXQvTmFtZS5qc1wiKSk7XG5cbmNvbnN0IE5hbWUgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAvKlxuICAgIG5hbWVcbiAgICB0eXBlXG4gICAgc2VhcmNoTmFtZVxuICAgIHRpdGxlKGkxOG4pXG4gICAgcGxhY2Vob2xkZXIoaTE4bilcbiAgICBtdWx0aXBsZTogQm9vbGVhblxuICAgICovXG59O1xuXG5OYW1lLnByb3RvdHlwZSA9IHtcbiAgICBzZWFyY2hOYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnNlYXJjaE5hbWUgfHwgdGhpcy5vcHRpb25zLm5hbWU7XG4gICAgfSxcblxuICAgIHZhbHVlKHF1ZXJ5KSB7XG4gICAgICAgIHJldHVybiBxdWVyeVt0aGlzLnNlYXJjaE5hbWUoKV07XG4gICAgfSxcblxuICAgIGRlZmF1bHRWYWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfSxcblxuICAgIGZpZWxkcyh2YWx1ZSkge1xuICAgICAgICByZXR1cm4ge1t0aGlzLnNlYXJjaE5hbWUoKV06IHZhbHVlfTtcbiAgICB9LFxuXG4gICAgdGl0bGUoaTE4bikge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnRpdGxlKGkxOG4pO1xuICAgIH0sXG5cbiAgICBzZWFyY2hUaXRsZSh2YWx1ZSwgaTE4bikge1xuICAgICAgICBjb25zdCB0aXRsZSA9IHRoaXMub3B0aW9ucy50aXRsZShpMThuKTtcbiAgICAgICAgcmV0dXJuIGAke3RpdGxlfTogJHt2YWx1ZX1gO1xuICAgIH0sXG5cbiAgICBmaWx0ZXIodmFsdWUsIHNhbml0aXplKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBtdWx0aV9tYXRjaDoge1xuICAgICAgICAgICAgICAgIGZpZWxkczogW2Ake3RoaXMub3B0aW9ucy5uYW1lfS5uYW1lYF0sXG4gICAgICAgICAgICAgICAgcXVlcnk6IHNhbml0aXplKHZhbHVlKSxcbiAgICAgICAgICAgICAgICBvcGVyYXRvcjogXCJhbmRcIixcbiAgICAgICAgICAgICAgICB6ZXJvX3Rlcm1zX3F1ZXJ5OiBcImFsbFwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgZmFjZXQoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBbdGhpcy5vcHRpb25zLm5hbWVdOiB7XG4gICAgICAgICAgICAgICAgdGl0bGU6IChpMThuKSA9PiB0aGlzLm9wdGlvbnMudGl0bGUoaTE4biksXG5cbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBNYWtlIHRoZSBudW1iZXIgb2YgZmFjZXRzIGNvbmZpZ3VyYWJsZVxuICAgICAgICAgICAgICAgIGZhY2V0OiAoKSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICB0ZXJtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQ6IGAke3RoaXMub3B0aW9ucy5uYW1lfS5uYW1lLnJhd2AsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplOiA1MCxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KSxcblxuICAgICAgICAgICAgICAgIGZvcm1hdEJ1Y2tldHM6IChidWNrZXRzKSA9PiBidWNrZXRzLm1hcCgoYnVja2V0KSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBidWNrZXQua2V5LFxuICAgICAgICAgICAgICAgICAgICBjb3VudDogYnVja2V0LmRvY19jb3VudCxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB7W3RoaXMub3B0aW9ucy5uYW1lXTogYnVja2V0LmtleX0sXG4gICAgICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgcmVuZGVyRmlsdGVyKHZhbHVlLCB2YWx1ZXMsIGkxOG4pIHtcbiAgICAgICAgcmV0dXJuIE5hbWVGaWx0ZXIoe1xuICAgICAgICAgICAgbmFtZTogdGhpcy5vcHRpb25zLm5hbWUsXG4gICAgICAgICAgICBzZWFyY2hOYW1lOiB0aGlzLnNlYXJjaE5hbWUoKSxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiB0aGlzLm9wdGlvbnMucGxhY2Vob2xkZXIoaTE4biksXG4gICAgICAgICAgICB0aXRsZTogdGhpcy5vcHRpb25zLnRpdGxlKGkxOG4pLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICB2YWx1ZXMsXG4gICAgICAgICAgICBtdWx0aXBsZTogdGhpcy5vcHRpb25zLm11bHRpcGxlLFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgcmVuZGVyVmlldyh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gTmFtZURpc3BsYXkoe1xuICAgICAgICAgICAgbmFtZTogdGhpcy5vcHRpb25zLm5hbWUsXG4gICAgICAgICAgICB0eXBlOiB0aGlzLm9wdGlvbnMudHlwZSxcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgbXVsdGlwbGU6IHRoaXMub3B0aW9ucy5tdWx0aXBsZSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJlbmRlckVkaXQodmFsdWUsIG5hbWVzKSB7XG4gICAgICAgIHJldHVybiBOYW1lRWRpdCh7XG4gICAgICAgICAgICBuYW1lOiB0aGlzLm9wdGlvbnMubmFtZSxcbiAgICAgICAgICAgIHR5cGU6IHRoaXMub3B0aW9ucy50eXBlLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBuYW1lcyxcbiAgICAgICAgICAgIG11bHRpcGxlOiB0aGlzLm9wdGlvbnMubXVsdGlwbGUsXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzY2hlbWEoU2NoZW1hKSB7XG4gICAgICAgIGNvbnN0IE5hbWVTY2hlbWEgPSBuZXcgU2NoZW1hKHtcbiAgICAgICAgICAgIC8vIEFuIElEIGZvciB0aGUgbmFtZSwgY29tcHV0ZWQgZnJvbSB0aGUgb3JpZ2luYWwgKyBuYW1lIHByb3BlcnRpZXNcbiAgICAgICAgICAgIC8vIGJlZm9yZSB2YWxpZGF0aW9uLlxuICAgICAgICAgICAgX2lkOiBTdHJpbmcsXG5cbiAgICAgICAgICAgIC8vIFRoZSBvcmlnaW5hbCBzdHJpbmcgZnJvbSB3aGljaCB0aGUgcmVzdCBvZiB0aGUgdmFsdWVzIHdlcmVcbiAgICAgICAgICAgIC8vIGRlcml2ZWRcbiAgICAgICAgICAgIG9yaWdpbmFsOiBTdHJpbmcsXG5cbiAgICAgICAgICAgIC8vIFRoZSBsb2NhbGUgZm9yIHRoZSBzdHJpbmcgKGUuZy4gJ2VuJywgJ2phJylcbiAgICAgICAgICAgIGxvY2FsZTogU3RyaW5nLFxuXG4gICAgICAgICAgICAvLyBBbnkgc29ydCBvZiBuYW1lIHBhcnNpbmcgb3B0aW9uc1xuICAgICAgICAgICAgc2V0dGluZ3M6IFNjaGVtYS5UeXBlcy5NaXhlZCxcblxuICAgICAgICAgICAgLy8gVGhlIEVuZ2xpc2ggZm9ybSBvZiB0aGUgZnVsbCBhcnRpc3QncyBuYW1lXG4gICAgICAgICAgICBuYW1lOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgICAgIGVzX2luZGV4ZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgZXNfdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICAvLyBBIHJhdyBuYW1lIHRvIHVzZSBmb3IgYnVpbGRpbmcgYWdncmVnYXRpb25zIGluIEVsYXN0aWNzZWFyY2hcbiAgICAgICAgICAgICAgICBlc19maWVsZHM6IHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZToge3R5cGU6IFwic3RyaW5nXCIsIGluZGV4OiBcImFuYWx5emVkXCJ9LFxuICAgICAgICAgICAgICAgICAgICByYXc6IHt0eXBlOiBcInN0cmluZ1wiLCBpbmRleDogXCJub3RfYW5hbHl6ZWRcIn0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZWNvbW1lbmRlZDogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIFNhbWUgYnV0IGluIGFzY2lpIChmb3IgZXhhbXBsZTogSG9rdXNoxY0gYmVjb21lcyBIb2t1c2hvbylcbiAgICAgICAgICAgIGFzY2lpOiBTdHJpbmcsXG5cbiAgICAgICAgICAgIC8vIFNhbWUgYnV0IHdpdGggZGlhY3JpdGljcyBzdHJpcHBlZCAoSG9rdXNoxY0gYmVjb21lcyBIb2t1c2hvKVxuICAgICAgICAgICAgcGxhaW46IHt0eXBlOiBTdHJpbmcsIGVzX2luZGV4ZWQ6IHRydWV9LFxuXG4gICAgICAgICAgICAvLyBUaGUgRW5nbGlzaCBmb3JtIG9mIHRoZSBnaXZlbiBuYW1lXG4gICAgICAgICAgICBnaXZlbjogU3RyaW5nLFxuXG4gICAgICAgICAgICAvLyBUaGUgRW5nbGlzaCBmb3JtIG9mIHRoZSBtaWRkbGUgbmFtZVxuICAgICAgICAgICAgbWlkZGxlOiBTdHJpbmcsXG5cbiAgICAgICAgICAgIC8vIFRoZSBFbmdsaXNoIGZvcm0gb2YgdGhlIHN1cm5hbWVcbiAgICAgICAgICAgIHN1cm5hbWU6IFN0cmluZyxcblxuICAgICAgICAgICAgLy8gQSBudW1iZXIgcmVwcmVzZW50aW5nIHRoZSBnZW5lcmF0aW9uIG9mIHRoZSBhcnRpc3RcbiAgICAgICAgICAgIGdlbmVyYXRpb246IE51bWJlcixcblxuICAgICAgICAgICAgLy8gQSBwc2V1ZG9ueW0gZm9yIHRoZSBwZXJzb25cbiAgICAgICAgICAgIHBzZXVkb255bToge3R5cGU6IFN0cmluZywgZXNfaW5kZXhlZDogdHJ1ZX0sXG5cbiAgICAgICAgICAgIC8vIElzIHRoZSBhcnRpc3QgdW5rbm93bi91bmF0dHJpYnV0ZWRcbiAgICAgICAgICAgIHVua25vd246IEJvb2xlYW4sXG5cbiAgICAgICAgICAgIC8vIElzIHRoaXMgYXJ0aXN0IHBhcnQgb2YgYSBzY2hvb2xcbiAgICAgICAgICAgIHNjaG9vbDogQm9vbGVhbixcblxuICAgICAgICAgICAgLy8gV2FzIHRoaXMgd29yayBkb25lIGluIHRoZSBzdHlsZSBvZiwgb3IgYWZ0ZXIsIGFuIGFydGlzdFxuICAgICAgICAgICAgYWZ0ZXI6IEJvb2xlYW4sXG5cbiAgICAgICAgICAgIC8vIElzIHRoaXMgd29yayBhdHRyaWJ1dGVkIHRvIGFuIGFydGlzdFxuICAgICAgICAgICAgYXR0cmlidXRlZDogQm9vbGVhbixcblxuICAgICAgICAgICAgLy8gRGF0ZSB3aGVuIHRoZSBuYW1lIHdhcyB1c2VkXG4gICAgICAgICAgICBkYXRlczogWWVhclJhbmdlLnByb3RvdHlwZS5zY2hlbWEoU2NoZW1hKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gRHluYW1pY2FsbHkgZ2VuZXJhdGUgdGhlIF9pZCBhdHRyaWJ1dGVcbiAgICAgICAgTmFtZVNjaGVtYS5wcmUoXCJ2YWxpZGF0ZVwiLCBmdW5jdGlvbihuZXh0KSB7XG4gICAgICAgICAgICB0aGlzLl9pZCA9IHRoaXMub3JpZ2luYWwgfHwgdGhpcy5uYW1lO1xuICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogW05hbWVTY2hlbWFdLFxuICAgICAgICAgICAgY29udmVydDogKG9iaikgPT4gdHlwZW9mIG9iaiA9PT0gXCJzdHJpbmdcIiA/XG4gICAgICAgICAgICAgICAge25hbWU6IG9ian0gOiBvYmosXG4gICAgICAgIH07XG4gICAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTmFtZTtcbiJdfQ==