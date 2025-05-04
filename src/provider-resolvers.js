import { resolveGoogle } from "./providers/google.js";
import { resolveOpenLibrary } from "./providers/open-library.js";
import { resolveLibroFm } from "./providers/librofm.js";

/**
 * @typedef {string[]} Providers
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */

/**
 * Default options for the provider resolvers.
 * @type {AxiosRequestConfig}
 * @property {number} timeout - The timeout value in milliseconds.
 */
export const defaultOptions = {
  timeout: 15_000,
};

export const GOOGLE_BOOKS_API_BASE = "https://www.googleapis.com";
export const GOOGLE_BOOKS_API_BOOK = "/books/v1/volumes";

export const OPENLIBRARY_API_BASE = "https://openlibrary.org";
export const OPENLIBRARY_API_BOOK = "/isbn";

export const LIBROFM_API_BASE = "https://libro.fm";
export const LIBROFM_API_BOOK = "/audiobooks";

export const PROVIDER_NAMES = {
  GOOGLE: "google",
  OPENLIBRARY: "openlibrary",
  LIBROFM: "librofm",
};

/**
 * Default providers for resolving ISBN information.
 * @type {Providers}
 */
export const DEFAULT_PROVIDERS = [
  PROVIDER_NAMES.GOOGLE,
  PROVIDER_NAMES.OPENLIBRARY,
  PROVIDER_NAMES.LIBROFM,
];

export const PROVIDER_RESOLVERS = {
  [PROVIDER_NAMES.GOOGLE]: resolveGoogle,
  [PROVIDER_NAMES.OPENLIBRARY]: resolveOpenLibrary,
  [PROVIDER_NAMES.LIBROFM]: resolveLibroFm,
};
