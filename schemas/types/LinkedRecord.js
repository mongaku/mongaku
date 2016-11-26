"use strict";

const React = require("react");

//const LinkedRecordDisplay = React.createFactory(
//    require("../../views/types/view/LinkedRecord.jsx"));
const LinkedRecordEdit = React.createFactory(
    require("../../views/types/edit/LinkedRecord.jsx"));

const LinkedRecord = function(options) {
    this.options = options;
    /*
    name
    type
    searchName
    recordType: String
    title(i18n)
    placeholder(i18n)
    multiple: Bool
    recommended: Bool
    hidden: Bool
    */
};

LinkedRecord.prototype = {
    searchName() {
        return this.options.searchName || this.options.name;
    },

    value(query) {
        return query[this.searchName()];
    },

    fields(value) {
        return {[this.searchName()]: value};
    },

    renderView() {
        /*
        return LinkedRecordDisplay({
            name: this.options.name,
            type: this.options.type,
            value,
        });
        */
    },

    renderEdit(value) {
        return LinkedRecordEdit({
            name: this.options.name,
            type: this.options.type,
            value,
            hidden: this.options.hidden,
            multiple: this.options.multiple,
        });
    },

    schema() {
        const type = {
            type: String,
            es_indexed: true,
            recommended: !!this.options.recommended,
        };

        return this.options.multiple ? [type] : type;
    },
};

module.exports = LinkedRecord;
