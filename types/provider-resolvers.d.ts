import { resolveGoogle } from "./providers/google.js";
import { resolveOpenLibrary } from "./providers/open-library.js";
import { resolveLibroFm } from "./providers/librofm.js";
export type Providers = string[];
export type AxiosRequestConfig = import('axios').AxiosRequestConfig;
/**
 * @typedef {string[]} Providers
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */
/**
 * Default options for the provider resolvers.
 * @type {AxiosRequestConfig}
 * @property {number} timeout - The timeout value in milliseconds.
 */
export declare const defaultOptions: AxiosRequestConfig;
export declare const GOOGLE_BOOKS_API_BASE = "https://www.googleapis.com";
export declare const GOOGLE_BOOKS_API_BOOK = "/books/v1/volumes";
export declare const OPENLIBRARY_API_BASE = "https://openlibrary.org";
export declare const OPENLIBRARY_API_BOOK = "/isbn";
export declare const OPENLIBRARY_API_SEARCH = "/search.json";
export declare const LIBROFM_API_BASE = "https://libro.fm";
export declare const LIBROFM_API_BOOK = "/audiobooks";
export declare const PROVIDER_NAMES: {
    GOOGLE: string;
    OPENLIBRARY: string;
    LIBROFM: string;
};
/**
 * Default providers for resolving ISBN information.
 * @type {Providers}
 */
export declare const DEFAULT_PROVIDERS: Providers;
export declare const PROVIDER_RESOLVERS: {
    [PROVIDER_NAMES.GOOGLE]: typeof resolveGoogle;
    [PROVIDER_NAMES.OPENLIBRARY]: typeof resolveOpenLibrary;
    [PROVIDER_NAMES.LIBROFM]: typeof resolveLibroFm;
};
//# sourceMappingURL=provider-resolvers.d.ts.map