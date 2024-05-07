import {
  PROVIDER_NAMES,
  DEFAULT_PROVIDERS,
  PROVIDER_RESOLVERS,
} from "./provider-resolvers.js";

class Isbn {
  constructor() {
    this.PROVIDER_NAMES = PROVIDER_NAMES;

    this._resetProviders();
  }

  /**
   * Resets the providers to the default set of providers.
   */
  _resetProviders() {
    this._providers = DEFAULT_PROVIDERS;
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
      (p) => !DEFAULT_PROVIDERS.includes(p)
    );
    if (unsupportedProviders.length > 0) {
      throw new Error(
        `Unsupported providers: ${unsupportedProviders.join(", ")}`
      );
    }

    this._providers = [...new Set(providers)];
    return this;
  }

  /**
   * Retrieves book information from a list of providers using the given ISBN.
   * @param {Array<string>} providers - The list of providers to retrieve book information from.
   * @param {string} isbn - The ISBN of the book.
   * @param {object} options - Additional options for retrieving book information.
   * @returns {Promise<object>} A promise that resolves to the book information.
   * @throws {Error} If none of the providers are able to retrieve the book information.
   */
  async _getBookInfo(providers, isbn, options) {
    for (const provider of providers) {
      try {
        return await PROVIDER_RESOLVERS[provider](isbn, options);
      } catch {
        // console.debug(`Unable to reach ${provider}. Trying the next one...`);
      }
    }
    // If none of the providers worked, we throw an error.
    throw new Error("All providers failed.");
  }

  /**
   * Resolves the book information for the given ISBN.
   * @param {string} isbn - The ISBN of the book.
   * @param {object} options - The options for the request.
   * @returns {Promise<object>} - A Promise that resolves to the book information.
   * @throws {Error} - If an error occurs while resolving the book information.
   */
  async resolve(isbn, options = {}) {
    try {
      const book = await this._getBookInfo(this._providers, isbn, options);
      this._resetProviders();
      return book;
    } catch (error) {
      this._resetProviders();
      throw error;
    }
  }
}

export default new Isbn();
