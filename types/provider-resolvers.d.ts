/**
 * @typedef {string[]} Providers
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */
/**
 * Default options for the provider resolvers.
 * @type {AxiosRequestConfig}
 * @property {number} timeout - The timeout value in milliseconds.
 */
export const defaultOptions: AxiosRequestConfig;
export const GOOGLE_BOOKS_API_BASE: "https://www.googleapis.com";
export const GOOGLE_BOOKS_API_BOOK: "/books/v1/volumes";
export const OPENLIBRARY_API_BASE: "https://openlibrary.org";
export const OPENLIBRARY_API_BOOK: "/isbn";
export const LIBROFM_API_BASE: "https://libro.fm";
export const LIBROFM_API_BOOK: "/audiobooks";
export namespace PROVIDER_NAMES {
    let GOOGLE: string;
    let OPENLIBRARY: string;
    let LIBROFM: string;
}
/**
 * Default providers for resolving ISBN information.
 * @type {Providers}
 */
export const DEFAULT_PROVIDERS: Providers;
export const PROVIDER_RESOLVERS: {
    [PROVIDER_NAMES.GOOGLE]: typeof resolveGoogle;
    [PROVIDER_NAMES.OPENLIBRARY]: typeof resolveOpenLibrary;
    [PROVIDER_NAMES.LIBROFM]: typeof resolveLibroFm;
};
export type Providers = string[];
export type AxiosRequestConfig = import("axios").AxiosRequestConfig;
import { resolveGoogle } from "./providers/google.js";
import { resolveOpenLibrary } from "./providers/open-library.js";
import { resolveLibroFm } from "./providers/librofm.js";
