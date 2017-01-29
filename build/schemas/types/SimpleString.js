"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = require("react");

var FixedStringDisplay = React.createFactory(require("../../views/types/view/FixedString.js"));
var FixedStringEdit = React.createFactory(require("../../views/types/edit/FixedString.js"));

var SimpleString = function SimpleString(options) {
    this.options = options;
    /*
    name
    type
    searchName
    title(i18n)
    placeholder(i18n)
    multiple: Bool
    recommended: Bool
    */
};

SimpleString.prototype = {
    searchName: function searchName() {
        return this.options.searchName || this.options.name;
    },
    value: function value(query) {
        return query[this.searchName()];
    },
    fields: function fields(value) {
        return _defineProperty({}, this.searchName(), value);
    },
    renderView: function renderView(value) {
        return FixedStringDisplay({
            name: this.options.name,
            type: this.options.type,
            value: value,
            multiline: this.options.multiline
        });
    },
    renderEdit: function renderEdit(value) {
        return FixedStringEdit({
            name: this.options.name,
            type: this.options.type,
            value: value,
            multiline: this.options.multiline
        });
    },
    schema: function schema() {
        var type = {
            type: String,
            es_indexed: true,
            recommended: !!this.options.recommended
        };

        return this.options.multiple ? [type] : type;
    }
};

module.exports = SimpleString;