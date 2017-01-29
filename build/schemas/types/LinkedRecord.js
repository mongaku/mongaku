"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = require("react");

//const LinkedRecordDisplay = React.createFactory(
//    require("../../views/types/view/LinkedRecord.js"));
var LinkedRecordEdit = React.createFactory(require("../../views/types/edit/LinkedRecord.js"));

var LinkedRecord = function LinkedRecord(options) {
    this.options = options;
    /*
    name
    recordType
    searchName
    recordType: String
    title(i18n)
    placeholder(i18n)
    multiple: Bool
    recommended: Bool
    */
};

LinkedRecord.prototype = {
    searchName: function searchName() {
        return this.options.searchName || this.options.name;
    },
    value: function value(query) {
        return query[this.searchName()];
    },
    fields: function fields(value) {
        return _defineProperty({}, this.searchName(), value);
    },
    loadDynamicValue: function loadDynamicValue(value, i18n, callback) {
        var record = require("../../lib/record");
        var Record = record(this.options.recordType);
        Record.findById(value, function (err, item) {
            if (err) {
                return callback(err);
            }

            callback(null, {
                id: value,
                title: item.getTitle(i18n)
            });
        });
    },
    renderView: function renderView() {
        /*
        return LinkedRecordDisplay({
            name: this.options.name,
            type: this.options.type,
            value,
        });
        */
    },
    renderEdit: function renderEdit(value, allValues, i18n) {
        return LinkedRecordEdit({
            name: this.options.name,
            type: this.options.type,
            value: value,
            multiple: this.options.multiple,
            recordType: this.options.recordType,
            placeholder: this.options.placeholder(i18n)
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

module.exports = LinkedRecord;