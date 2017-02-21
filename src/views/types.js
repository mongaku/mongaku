// @flow

type BaseModelType = {
    name: string,
    title: string,
    private?: boolean,
    recommended?: boolean,
    required?: boolean,
    searchName?: string,
    multiple?: boolean,
    hidden?: boolean,
};

type Dimension = BaseModelType & {
    type: "Dimension",
    defaultUnit?: string,
    defaultSearchUnit?: string,
    widthTitle: string,
    heightTitle: string,
    placeholder?: {
        max?: number,
        min?: number,
    },
};

type FixedString = BaseModelType & {
    type: "FixedString",
    placeholder?: string,
    allowUnknown?: boolean,
    url?: string,
    values?: {
        [name: string]: {
            name: string,
        },
    },
};

type LinkedRecord = BaseModelType & {
    type: "LinkedRecord",
    placeholder?: string,
    recordType: string,
};

type Location = BaseModelType & {
    type: "Location",
    placeholder?: string,
};

type Name = BaseModelType & {
    type: "Name",
    placeholder?: string,
};

type SimpleDate = BaseModelType & {
    type: "SimpleDate",
    placeholder?: string,
    interval?: string,
    format?: string,
};

type SimpleNumber = BaseModelType & {
    type: "SimpleNumber",
    placeholder?: string,
};

type SimpleString = BaseModelType & {
    type: "SimpleString",
    placeholder?: string,
    multiline?: boolean,
};

type YearRange = BaseModelType & {
    type: "YearRange",
    ranges?: Array<{
        from?: number,
        to?: number,
    }>,
    placeholder?: {
        start?: number,
        end?: number,
    },
};

export type ModelType = Dimension | FixedString | LinkedRecord | Location |
    Name | SimpleDate | SimpleNumber | SimpleString | YearRange;

type TypeOptions = {
    getSearchPlaceholder: string,
    searchNumRecords: number,
    imagesRequired: boolean,
    noImages: boolean,
    noImageSearch: boolean,
    urlRequired: boolean,
    noURLs: boolean,
    minFacetCount?: number,
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

export type Source = {
    _id: string,
    name: string,
    getURL: string,
    getFullName: string,
    getShortName: string,
};

export type Options = {
    baseURL: string,
    baseDataURL: string,
    getShortTitle: string,
    getTitle: string,
    noIndex: boolean,
    usei18nSubdomain: boolean,
    faviconUrl?: string,
    logoUrl?: string,
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

export type Utils = {
    getOtherURL: (originalUrl: string, locale: string) => string,
    URL: (path: string, query?: Object) => string,
    stringNum: (num: number) => string,
    relativeDate: (date: Date) => string,
    fixedDate: (date: Date) => string,
    format: (fmt: string, props: {[key: string]: any}) => string,
    getSource: (sourceId: string, sources: Array<Source>) => ?Source,
};

// Methods and properties defined in view-methods.js and i18n.js
export type Context = {
    lang: string,
    user?: User,
    originalUrl: string,
    gettext: (text: string) => string,
    options: Options,
    utils: Utils,
};

// From User.js
export type User = {
    email: string,
    sourceAdmin: Array<string>,
    siteAdmin: boolean,
    getEditableSourcesByType: {
        [type: string]: Array<string>,
    },
};
