// @flow

// Methods and properties defined in view-methods.js and i18n.js
export type Context = {
    lang: string,
    URL: (path: string | {getURL: (lang: string) => string}) => string,
    getOtherURL: (lang: string) => string,
    fullName: (name: *) => string,
    shortName: (name: *) => string,
    getTitle: (item: {getTitle: () => string}) => string,
    getShortTitle: (item: {getShortTitle: () => string}) => string,
    stringNum: (num: number) => string,
    fixedDate: (date: Date) => string,
    relativeDate: (date: Date) => string,
    user?: User,
    gettext: (text: string) => string,
    format: (text: string, options: {}) => string,
};

// From User.js
export type User = {
    email: string,
    sourceAdmin: Array<string>,
    siteAdmin: boolean,
    getEditableSourcesByType: (type: string) => Array<string>,
};
