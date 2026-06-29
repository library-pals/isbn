/**
 * Resolves a book from the Open Library Search API using the provided ISBN.
 * @param {string} isbn - The ISBN of the book.
 * @param {AxiosRequestConfig} options - Additional options for the request.
 * @returns {Promise<Book>} A promise that resolves to the standardized book object.
 * @throws {Error} If the response code is not 200 or if no books are found with the provided ISBN.
 */
export function resolveOpenLibrary(isbn: string, options: AxiosRequestConfig): Promise<Book>;
/**
 * @typedef {object} OpenLibraryEdition
 * @property {string} key - Edition key.
 * @property {string} [title] - Edition title.
 * @property {number} [cover_i] - Edition cover image ID.
 * @property {string[]} [publisher] - Publishers.
 * @property {string[]} [publish_date] - Publish dates.
 * @property {string[]} [language] - ISO 639-2 language codes.
 */
/**
 * @typedef {object} OpenLibrarySearchDoc
 * @property {string} title - Work title.
 * @property {string[]} [author_name] - Author names.
 * @property {number} [number_of_pages_median] - Median page count.
 * @property {string[]} [subject] - Subjects/categories.
 * @property {number} [cover_i] - Work cover image ID.
 * @property {string} key - Work key.
 * @property {{docs: OpenLibraryEdition[]}} [editions] - Matched edition data.
 */
/**
 * Standardizes a search result doc into a Book object.
 * @param {OpenLibrarySearchDoc} document - The search result doc.
 * @param {string} isbn - The book's ISBN.
 * @param {string} [description] - The book's description.
 * @returns {Book} The standardized book object.
 */
export function standardize(document: OpenLibrarySearchDoc, isbn: string, description?: string): Book;
/**
 * Fetches the description for a work from the Open Library works endpoint.
 * @param {string} workKey - The work key (e.g. "/works/OL45804W").
 * @param {number} [timeout] - Request timeout in milliseconds.
 * @returns {Promise<string>} The description, or an empty string if unavailable.
 */
export function getDescription(workKey: string, timeout?: number): Promise<string>;
export type OpenLibraryEdition = {
    /**
     * - Edition key.
     */
    key: string;
    /**
     * - Edition title.
     */
    title?: string | undefined;
    /**
     * - Edition cover image ID.
     */
    cover_i?: number | undefined;
    /**
     * - Publishers.
     */
    publisher?: string[] | undefined;
    /**
     * - Publish dates.
     */
    publish_date?: string[] | undefined;
    /**
     * - ISO 639-2 language codes.
     */
    language?: string[] | undefined;
};
export type OpenLibrarySearchDoc = {
    /**
     * - Work title.
     */
    title: string;
    /**
     * - Author names.
     */
    author_name?: string[] | undefined;
    /**
     * - Median page count.
     */
    number_of_pages_median?: number | undefined;
    /**
     * - Subjects/categories.
     */
    subject?: string[] | undefined;
    /**
     * - Work cover image ID.
     */
    cover_i?: number | undefined;
    /**
     * - Work key.
     */
    key: string;
    /**
     * - Matched edition data.
     */
    editions?: {
        docs: OpenLibraryEdition[];
    } | undefined;
};
export type Book = import("../index.js").Book;
export type AxiosRequestConfig = import("axios").AxiosRequestConfig;
//# sourceMappingURL=open-library.d.ts.map