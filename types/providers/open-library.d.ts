/**
 * @typedef {import('../index.js').Book} Book
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */
/**
 * Resolves a book from the Open Library API using the provided ISBN.
 * @param {string} isbn - The ISBN of the book.
 * @param {AxiosRequestConfig} options - Additional options for the request.
 * @returns {Promise<Book>} A promise that resolves to the standardized book object.
 * @throws {Error} If the response code is not 200 or if no books are found with the provided ISBN.
 */
export function resolveOpenLibrary(isbn: string, options: AxiosRequestConfig): Promise<Book>;
/**
 * @typedef {object} Author
 * @property {string} key - The key of the author.
 */
/**
 * @typedef {object} Language
 * @property {string} key - The key of the language.
 */
/**
 * @typedef {object} Type
 * @property {string} key - The key of the type.
 */
/**
 * @typedef {object} FirstSentence
 * @property {string} type - The type of the first sentence.
 * @property {string} value - The value of the first sentence.
 */
/**
 * @typedef {object} Work
 * @property {string} key - The key of the work.
 */
/**
 * @typedef {object} DateTime
 * @property {string} type - The type of the datetime.
 * @property {string} value - The value of the datetime.
 */
/**
 * @typedef {object} OpenLibraryBook
 * @property {object} identifiers - The identifiers of the book.
 * @property {string} title - The title of the book.
 * @property {Author[]} authors - The authors of the book.
 * @property {string} publish_date - The publish date of the book.
 * @property {string[]} publishers - The publishers of the book.
 * @property {number[]} covers - The covers of the book.
 * @property {string[]} contributions - The contributions to the book.
 * @property {Language[]} languages - The languages of the book.
 * @property {string[]} source_records - The source records of the book.
 * @property {string[]} local_id - The local IDs of the book.
 * @property {Type} type - The type of the book.
 * @property {FirstSentence} first_sentence - The first sentence of the book.
 * @property {string} key - The key of the book.
 * @property {number} number_of_pages - The number of pages in the book.
 * @property {Work[]} works - The works related to the book.
 * @property {object} classifications - The classifications of the book.
 * @property {string} ocaid - The Open Content Alliance ID of the book.
 * @property {string[]} isbn_10 - The ISBN-10 of the book.
 * @property {string[]} isbn_13 - The ISBN-13 of the book.
 * @property {number} latest_revision - The latest revision of the book.
 * @property {number} revision - The revision of the book.
 * @property {DateTime} created - The creation datetime of the book.
 * @property {DateTime} last_modified - The last modified datetime of the book.
 */
/**
 * Standardizes a book object by extracting relevant information from the provided book object.
 * @param {OpenLibraryBook} book - The book object to be standardized.
 * @param {string} isbn - The book's isbn.
 * @returns {Promise<Book>} - The standardized book object.
 */
export function standardize(book: OpenLibraryBook, isbn: string): Promise<Book>;
/**
 * Retrieves the author names from OpenLibrary.
 * @param {{key: string}[]} rawAuthors - List of author keys.
 * @returns {Promise<string[]>} - List of author names.
 */
export function getAuthors(rawAuthors: {
    key: string;
}[]): Promise<string[]>;
/**
 * @typedef {object} OpenLibraryResponse
 * @property {string} description - The description of the book.
 * @property {string[]} subjects - The subjects of the book.
 * @property {{author: {key: string}}[]} authors - The authors of the book.
 */
/**
 * Retrieves the description of the book from OpenLibrary.
 * @param {OpenLibraryBook} book - The book object from OpenLibrary.
 * @returns {Promise<{description: string, subjects: string[], rawAuthors: {key: string}[]}>} - Description of the book.
 */
export function getWorks(book: OpenLibraryBook): Promise<{
    description: string;
    subjects: string[];
    rawAuthors: {
        key: string;
    }[];
}>;
export type Book = import('../index.js').Book;
export type AxiosRequestConfig = import('axios').AxiosRequestConfig;
export type Author = {
    /**
     * - The key of the author.
     */
    key: string;
};
export type Language = {
    /**
     * - The key of the language.
     */
    key: string;
};
export type Type = {
    /**
     * - The key of the type.
     */
    key: string;
};
export type FirstSentence = {
    /**
     * - The type of the first sentence.
     */
    type: string;
    /**
     * - The value of the first sentence.
     */
    value: string;
};
export type Work = {
    /**
     * - The key of the work.
     */
    key: string;
};
export type DateTime = {
    /**
     * - The type of the datetime.
     */
    type: string;
    /**
     * - The value of the datetime.
     */
    value: string;
};
export type OpenLibraryBook = {
    /**
     * - The identifiers of the book.
     */
    identifiers: object;
    /**
     * - The title of the book.
     */
    title: string;
    /**
     * - The authors of the book.
     */
    authors: Author[];
    /**
     * - The publish date of the book.
     */
    publish_date: string;
    /**
     * - The publishers of the book.
     */
    publishers: string[];
    /**
     * - The covers of the book.
     */
    covers: number[];
    /**
     * - The contributions to the book.
     */
    contributions: string[];
    /**
     * - The languages of the book.
     */
    languages: Language[];
    /**
     * - The source records of the book.
     */
    source_records: string[];
    /**
     * - The local IDs of the book.
     */
    local_id: string[];
    /**
     * - The type of the book.
     */
    type: Type;
    /**
     * - The first sentence of the book.
     */
    first_sentence: FirstSentence;
    /**
     * - The key of the book.
     */
    key: string;
    /**
     * - The number of pages in the book.
     */
    number_of_pages: number;
    /**
     * - The works related to the book.
     */
    works: Work[];
    /**
     * - The classifications of the book.
     */
    classifications: object;
    /**
     * - The Open Content Alliance ID of the book.
     */
    ocaid: string;
    /**
     * - The ISBN-10 of the book.
     */
    isbn_10: string[];
    /**
     * - The ISBN-13 of the book.
     */
    isbn_13: string[];
    /**
     * - The latest revision of the book.
     */
    latest_revision: number;
    /**
     * - The revision of the book.
     */
    revision: number;
    /**
     * - The creation datetime of the book.
     */
    created: DateTime;
    /**
     * - The last modified datetime of the book.
     */
    last_modified: DateTime;
};
export type OpenLibraryResponse = {
    /**
     * - The description of the book.
     */
    description: string;
    /**
     * - The subjects of the book.
     */
    subjects: string[];
    /**
     * - The authors of the book.
     */
    authors: {
        author: {
            key: string;
        };
    }[];
};
