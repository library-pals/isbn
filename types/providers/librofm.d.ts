/**
 * @typedef {import('../index.js').Book} Book
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */
/**
 * Resolves book information from Libro.fm using the provided ISBN.
 * @param {string} isbn - The ISBN of the book.
 * @param {AxiosRequestConfig} options - Additional options for the API request.
 * @returns {Promise<Book>} The book information retrieved from the API.
 * @throws {Error} If the API response code is not 200, or if no books are found with the provided ISBN, or if no volume information is found for the book.
 */
export function resolveLibroFm(isbn: string, options: AxiosRequestConfig): Promise<Book>;
/**
 * Standardizes a book object by extracting relevant information from the provided book object.
 * @param {string} data - The data to be standardized.
 * @param {string} isbn - The book's ISBN.
 * @param {string} url - The URL of the book.
 * @returns {Promise<Book>} The standardized book object.
 */
export function standardize(data: string, isbn: string, url: string): Promise<Book>;
/**
 * @typedef {object} Person
 * @property {string} name - The name of the person.
 */
/**
 * @typedef {object} Audiobook
 * @property {string} url - The URL of the audiobook.
 * @property {string} bookFormat - The format of the audiobook.
 * @property {string} name - The name of the audiobook.
 * @property {string} description - The description of the audiobook.
 * @property {string} isbn - The ISBN of the audiobook.
 * @property {string} image - The image of the audiobook.
 * @property {string} abridged - Whether the audiobook is abridged.
 * @property {Person[]} author - The author of the audiobook.
 * @property {Person[]} readBy - The person who read the audiobook.
 * @property {string} publisher - The publisher of the audiobook.
 * @property {string} datePublished - The date the audiobook was published.
 * @property {string} inLanguage - The language of the audiobook.
 * @property {string} duration - The duration of the audiobook.
 * @property {string[]} regionsAllowed - The regions allowed for the audiobook.
 * @property {object} offers - The offers for the audiobook.
 * @property {object} workExample - The work example for the audiobook.
 */
/**
 * Formats the description by removing HTML tags and contents inside them.
 * @param {string} description - The description to be formatted.
 * @returns {string} The formatted description.
 */
export function formatDescription(description: string): string;
export type Book = import("../index.js").Book;
export type AxiosRequestConfig = import("axios").AxiosRequestConfig;
export type Person = {
    /**
     * - The name of the person.
     */
    name: string;
};
export type Audiobook = {
    /**
     * - The URL of the audiobook.
     */
    url: string;
    /**
     * - The format of the audiobook.
     */
    bookFormat: string;
    /**
     * - The name of the audiobook.
     */
    name: string;
    /**
     * - The description of the audiobook.
     */
    description: string;
    /**
     * - The ISBN of the audiobook.
     */
    isbn: string;
    /**
     * - The image of the audiobook.
     */
    image: string;
    /**
     * - Whether the audiobook is abridged.
     */
    abridged: string;
    /**
     * - The author of the audiobook.
     */
    author: Person[];
    /**
     * - The person who read the audiobook.
     */
    readBy: Person[];
    /**
     * - The publisher of the audiobook.
     */
    publisher: string;
    /**
     * - The date the audiobook was published.
     */
    datePublished: string;
    /**
     * - The language of the audiobook.
     */
    inLanguage: string;
    /**
     * - The duration of the audiobook.
     */
    duration: string;
    /**
     * - The regions allowed for the audiobook.
     */
    regionsAllowed: string[];
    /**
     * - The offers for the audiobook.
     */
    offers: object;
    /**
     * - The work example for the audiobook.
     */
    workExample: object;
};
