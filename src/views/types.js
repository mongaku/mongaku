// @flow

type BaseModelType = {
    title: string,
    recommended?: boolean,
    required?: boolean,
    searchName?: string,
    multiple?: boolean,
    hidden?: boolean,
};

type Dimension = BaseModelType & {
    title: string,
    recommended?: boolean,
    required?: boolean,
    searchName?: string,
    multiple?: boolean,
    hidden?: boolean,
    type: "Dimension",
};

type FixedString = BaseModelType & {
    title: string,
    recommended?: boolean,
    required?: boolean,
    searchName?: string,
    multiple?: boolean,
    hidden?: boolean,
    type: "FixedString",
    allowUnknown?: boolean,
};

// LinkedRecord

type Location = BaseModelType & {
    type: "Location",
    placeholder?: string,
};

type Name = BaseModelType & {
    type: "Name",
    placeholder: string,
};

type SimpleDate = BaseModelType & {
    type: "SimpleDate",
    interval?: string,
    format?: string,
    placeholder?: {
        start: number,
        end: number,
    },
};

type SimpleString = BaseModelType & {
    type: "SimpleString",
};

type ModelType = Dimension | FixedString | Location | Name | SimpleDate |
    SimpleString;

type TypeOptions = {
    getSearchPlaceholder: string,
    searchNumRecords: number,
    imagesRequired: boolean,
    noImages: boolean,
    noImageSearch: boolean,
    urlRequired: boolean,
    noURLs: boolean,
    name: string,
    defaultImage: string,
    filters: Array<string>,
    display: Array<string>,
    cloneFields: Array<string>,
    sorts: {
        [id: string]: string,
    },
    model: {
        [name: string]: ModelType,
    },
    hasImages: boolean,
    requiresImages: boolean,
    hasImageSearch: boolean,
};

export type Options = {
    getShortTitle: string,
    getTitle: string,
    noIndex: boolean,
    usei18nSubdomain: boolean,
    maxUploadSize: number,
    imageThumbSize: string,
    imageScaledSize: string,
    locales: {
        [key: string]: string,
    },
    types: {
        [type: string]: TypeOptions,
    },
};

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
    options: Options,
};

// From User.js
export type User = {
    email: string,
    sourceAdmin: Array<string>,
    siteAdmin: boolean,
    getEditableSourcesByType: (type: string) => Array<string>,
};
