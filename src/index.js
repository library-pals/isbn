import {
  PROVIDER_NAMES,
  DEFAULT_PROVIDERS,
  PROVIDER_RESOLVERS,
} from "./provider-resolvers.js";

/**
 * @typedef {object} Book
 * @property {string} isbn - The ISBN of the book.
 * @property {string} title - The long title of the book.
 * @property {string[]} authors - The authors of the book.
 * @property {string} description - The overview of the book.
 * @property {number} pageCount - The number of pages in the book.
 * @property {string} printType - The print type of the book. Always "BOOK" for this context.
 * @property {string[]} categories - The subjects or categories of the book.
 * @property {string} publisher - The publisher of  the book.
 * @property {string | undefined} [thumbnail] - The thumbnail image link of the book.
 * @property {string} [link] - The link of the book.
 */

/**
 * @typedef {import('./provider-resolvers.js').Providers} Providers
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */

export default class Isbn {
  /**
   * @type {Providers}
   */
  _providers = DEFAULT_PROVIDERS;

  constructor() {
    this.PROVIDER_NAMES = PROVIDER_NAMES;
  }

  /**
   * Sets the providers for the ISBN lookup.
   * @param {string[]} providers - An array of provider names.
   * @returns {object} - The current instance of the ISBN lookup.
   * @throws {TypeError} - If `providers` is not an array.
   * @throws {Error} - If any of the provided providers are not supported.
   */
  provider(providers) {
    if (!Array.isArray(providers)) {
      throw new TypeError("`providers` must be an array.");
    }

    if (providers.length === 0) {
      return this;
    }

    const unsupportedProviders = providers.filter(
      (p) => !DEFAULT_PROVIDERS.includes(p),
    );
    if (unsupportedProviders.length > 0) {
      throw new Error(
        `Unsupported providers: ${unsupportedProviders.join(", ")}`,
      );
    }

    this._providers = [...new Set(providers)];
    return this;
  }

  /**
   * Resolves the book information for the given ISBN.
   * @param {string} isbn - The ISBN of the book.
   * @param {AxiosRequestConfig} options - The options for the request.
   * @returns {Promise<Book>} - A Promise that resolves to the book information.
   * @throws {Error} - If an error occurs while resolving the book information.
   */
  async resolve(isbn, options = {}) {
    const messages = [];
    for (const provider of this._providers) {
      try {
        return await PROVIDER_RESOLVERS[provider](isbn, options);
      } catch (error) {
        if (error.message) messages.push(`${provider}: ${error.message}`);
      }
    }
    // If none of the providers worked, we throw an error.
    throw new Error(
      `All providers failed${
        messages.length > 0 ? `\n${messages.join("\n")}` : ""
      }`,
    );
  }
}
