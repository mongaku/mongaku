// @flow

type BaseModelType = {
    name: string,
    title: string,
    private?: boolean,
    recommended?: boolean,
    required?: boolean,
    searchName?: string,
    multiple?: boolean,
    filterMultiple?: boolean,
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

type URL = BaseModelType & {
    type: "URL",
    placeholder?: string,
};

type YearRange = BaseModelType & {
    type: "YearRange",
    ranges?: Array<{
        from?: number,
        to?: number,
    }>,
    placeholder?: {
        start?: number | string,
        end?: number | string,
    },
};

export type ModelType =
    | Dimension
    | FixedString
    | LinkedRecord
    | Location
    | Name
    | SimpleDate
    | SimpleNumber
    | SimpleString
    | URL
    | YearRange;

type TypeOptions = {
    getSearchPlaceholder: string,
    searchNumRecords: number,
    imagesRequired: boolean,
    noImages: boolean,
    noImageSearch: boolean,
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
    baseStaticURL: string,
    getShortTitle: string,
    getTitle: string,
    noIndex: boolean,
    usei18nSubdomain: boolean,
    favicon?: string,
    logo?: string,
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
    user?: User,
    originalUrl: string,
    options: Options,

    // Coming from utils.js
    getOtherURL: (originalUrl: string, locale: string) => string,
    URL: (path: string, query?: Object) => string,
    STATIC: (path: string) => string,
    stringNum: (num: number) => string,
    fixedDate: (date: Date) => string,
    gettext: (text: string) => string,
    format: (fmt: string, props: {[key: string]: any}) => string,
    getSource: (sourceId: string, sources: Array<Source>) => ?Source,
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
