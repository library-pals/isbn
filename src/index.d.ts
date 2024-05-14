/**
 * @typedef {object} Book
 * @property {string} isbn - The ISBN of the book.
 * @property {string} title - The long title of the book.
 * @property {string[]} authors - The authors of the book.
 * @property {string} description - The overview of the book.
 * @property {number} pageCount - The number of pages in the book.
 * @property {string} printType - The print type of the book. Always "BOOK" for this context.
 * @property {string[]} categories - The subjects or categories of the book.
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
    _providers: import("./provider-resolvers.js").Providers;
    PROVIDER_NAMES: {
        GOOGLE: string;
        OPENLIBRARY: string;
        ISBNDB: string;
    };
    /**
     * Sets the providers for the ISBN lookup.
     * @param {string[]} providers - An array of provider names.
     * @returns {object} - The current instance of the ISBN lookup.
     * @throws {TypeError} - If `providers` is not an array.
     * @throws {Error} - If any of the provided providers are not supported.
     */
    provider(providers: string[]): object;
    /**
     * Resolves the book information for the given ISBN.
     * @param {string} isbn - The ISBN of the book.
     * @param {AxiosRequestConfig} options - The options for the request.
     * @returns {Promise<Book>} - A Promise that resolves to the book information.
     * @throws {Error} - If an error occurs while resolving the book information.
     */
    resolve(isbn: string, options?: AxiosRequestConfig): Promise<Book>;
}
export type Book = {
    /**
     * - The ISBN of the book.
     */
    isbn: string;
    /**
     * - The long title of the book.
     */
    title: string;
    /**
     * - The authors of the book.
     */
    authors: string[];
    /**
     * - The overview of the book.
     */
    description: string;
    /**
     * - The number of pages in the book.
     */
    pageCount: number;
    /**
     * - The print type of the book. Always "BOOK" for this context.
     */
    printType: string;
    /**
     * - The subjects or categories of the book.
     */
    categories: string[];
    /**
     * - The thumbnail image link of the book.
     */
    thumbnail?: string | undefined;
    /**
     * - The link of the book.
     */
    link?: string;
};
export type Providers = import('./provider-resolvers.js').Providers;
export type AxiosRequestConfig = import('axios').AxiosRequestConfig;
//# sourceMappingURL=index.d.ts.map