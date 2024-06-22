/**
 * @typedef {import('../index.js').Book} Book
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */
/**
 * Resolves book information from Google Books API using the provided ISBN.
 * @param {string} isbn - The ISBN of the book.
 * @param {AxiosRequestConfig} options - Additional options for the API request.
 * @returns {Promise<Book>} The book information retrieved from the API.
 * @throws {Error} If the API response code is not 200, or if no books are found with the provided ISBN, or if no volume information is found for the book.
 */
export function resolveGoogle(isbn: string, options: AxiosRequestConfig): Promise<Book>;
/**
 * @typedef {object} ImageLinks
 * @property {string} [extraLarge] - extraLarge
 * @property {string} [large] - large
 * @property {string} [medium] - medium
 * @property {string} [small] - small
 * @property {string} [thumbnail] - thumbnail
 * @property {string} [smallThumbnail] - smallThumbnail
 */
/**
 * @typedef {object} GoogleBook
 * @property {string} title - The title of the book.
 * @property {string} subtitle - The subtitle of the book.
 * @property {string[]} authors - The authors of the book.
 * @property {string} publisher - The publisher of the book.
 * @property {string} publishedDate - The published date of the book.
 * @property {string} description - The description of the book.
 * @property {object[]} industryIdentifiers - The industry identifiers of the book.
 * @property {object} readingModes - The reading modes of the book.
 * @property {number} pageCount - The number of pages in the book.
 * @property {string} printType - The print type of the book.
 * @property {string[]} categories - The categories of the book.
 * @property {number} averageRating - The average rating of the book.
 * @property {number} ratingsCount - The ratings count of the book.
 * @property {string} maturityRating - The maturity rating of the book.
 * @property {boolean} allowAnonLogging - The allow anon logging of the book.
 * @property {string} contentVersion - The content version of the book.
 * @property {object} panelizationSummary - The panelization summary of the book.
 * @property {ImageLinks} [imageLinks] - The image links of the book.
 * @property {string} language - The language of the book.
 * @property {string} previewLink - The preview link of the book.
 * @property {string} infoLink - The info link of the book.
 * @property {string} canonicalVolumeLink - The canonical volume link of the book.
 * @property {object} saleInfo - The sale info of the book.
 * @property {object} accessInfo - The access info of the book.
 * @property {object} searchInfo - The search info of the book.
 */
/**
 * Standardizes a book object by extracting relevant information from the provided book object.
 * @param {GoogleBook} book - The book object to be standardized.
 * @param {string} id - The book id.
 * @param {string} isbn - The book's ISBN.
 * @returns {Promise<Book>} The standardized book object.
 */
export function standardize(book: GoogleBook, id: string, isbn: string): Promise<Book>;
/**
 * Retrieves the volume information for a book.
 * @param {string} id - The book id.
 * @returns {Promise<{imageLinks?: ImageLinks, categories?: string[]}>} - A promise that resolves to an array of author names.
 * @throws {Error} - If there is an error retrieving the author information.
 */
export function getVolume(id: string): Promise<{
    imageLinks?: ImageLinks;
    categories?: string[];
}>;
export type Book = import("../index.js").Book;
export type AxiosRequestConfig = import("axios").AxiosRequestConfig;
export type ImageLinks = {
    /**
     * - extraLarge
     */
    extraLarge?: string;
    /**
     * - large
     */
    large?: string;
    /**
     * - medium
     */
    medium?: string;
    /**
     * - small
     */
    small?: string;
    /**
     * - thumbnail
     */
    thumbnail?: string;
    /**
     * - smallThumbnail
     */
    smallThumbnail?: string;
};
export type GoogleBook = {
    /**
     * - The title of the book.
     */
    title: string;
    /**
     * - The subtitle of the book.
     */
    subtitle: string;
    /**
     * - The authors of the book.
     */
    authors: string[];
    /**
     * - The publisher of the book.
     */
    publisher: string;
    /**
     * - The published date of the book.
     */
    publishedDate: string;
    /**
     * - The description of the book.
     */
    description: string;
    /**
     * - The industry identifiers of the book.
     */
    industryIdentifiers: object[];
    /**
     * - The reading modes of the book.
     */
    readingModes: object;
    /**
     * - The number of pages in the book.
     */
    pageCount: number;
    /**
     * - The print type of the book.
     */
    printType: string;
    /**
     * - The categories of the book.
     */
    categories: string[];
    /**
     * - The average rating of the book.
     */
    averageRating: number;
    /**
     * - The ratings count of the book.
     */
    ratingsCount: number;
    /**
     * - The maturity rating of the book.
     */
    maturityRating: string;
    /**
     * - The allow anon logging of the book.
     */
    allowAnonLogging: boolean;
    /**
     * - The content version of the book.
     */
    contentVersion: string;
    /**
     * - The panelization summary of the book.
     */
    panelizationSummary: object;
    /**
     * - The image links of the book.
     */
    imageLinks?: ImageLinks;
    /**
     * - The language of the book.
     */
    language: string;
    /**
     * - The preview link of the book.
     */
    previewLink: string;
    /**
     * - The info link of the book.
     */
    infoLink: string;
    /**
     * - The canonical volume link of the book.
     */
    canonicalVolumeLink: string;
    /**
     * - The sale info of the book.
     */
    saleInfo: object;
    /**
     * - The access info of the book.
     */
    accessInfo: object;
    /**
     * - The search info of the book.
     */
    searchInfo: object;
};
