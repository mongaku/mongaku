const React = require("react");

//const LinkedRecordDisplay = React.createFactory(
//    require("../../views/types/view/LinkedRecord.jsx"));
const LinkedRecordEdit = React.createFactory(
    require("../../views/types/edit/LinkedRecord.jsx"));

const LinkedRecord = function(options) {
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
    searchName() {
        return this.options.searchName || this.options.name;
    },

    value(query) {
        return query[this.searchName()];
    },

    fields(value) {
        return {[this.searchName()]: value};
    },

    loadDynamicValue(value, i18n, callback) {
        const record = require("../../lib/record");
        const Record = record(this.options.recordType);
        Record.findById(value, (err, item) => {
            if (err) {
                return callback(err);
            }

            callback(null, {
                id: value,
                title: item.getTitle(i18n),
            });
        });
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

    renderEdit(value, allValues, i18n) {
        return LinkedRecordEdit({
            name: this.options.name,
            type: this.options.type,
            value,
            multiple: this.options.multiple,
            recordType: this.options.recordType,
            placeholder: this.options.placeholder(i18n),
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
