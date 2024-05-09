import axios from "axios";
import {
  defaultOptions,
  OPENLIBRARY_API_BASE,
  OPENLIBRARY_API_BOOK,
} from "../provider-resolvers.js";

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
export async function resolveOpenLibrary(isbn, options) {
  const requestOptions = {
    ...defaultOptions,
    ...options,
  };
  const url = `${OPENLIBRARY_API_BASE}${OPENLIBRARY_API_BOOK}?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;

  try {
    const response = await axios.get(url, requestOptions);
    if (response.status !== 200) {
      throw new Error(`Wrong response code: ${response.status}`);
    }
    const books = response.data;
    const book = books[`ISBN:${isbn}`];
    if (!book) {
      throw new Error(`No books found with ISBN: ${isbn}`);
    }
    return standardize(book);
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * @typedef {object} Identifier
 * @property {Array<string>} isbn_13
 * @property {Array<string>} openlibrary
 */

/**
 * @typedef {object} Publisher
 * @property {string} name
 */

/**
 * @typedef {object} Subject
 * @property {string} name
 * @property {string} url
 */

/**
 * @typedef {object} Excerpt
 * @property {string} text
 * @property {string} comment
 */

/**
 * @typedef {object} Cover
 * @property {string} small
 * @property {string} medium
 * @property {string} large
 */

/**
 * @typedef {object} Author
 * @property {string} url
 * @property {string} name
 */

/**
 * @typedef {object} BookDetails
 * @property {string} url
 * @property {string} key
 * @property {string} title
 * @property {Array<Author>} authors
 * @property {number} number_of_pages
 * @property {string} weight
 * @property {Identifier} identifiers
 * @property {Array<Publisher>} publishers
 * @property {string} publish_date
 * @property {Array<Subject>} subjects
 * @property {Array<Excerpt>} excerpts
 * @property {Cover} cover
 */

/**
 * @typedef {object} OpenLibraryBook
 * @property {BookDetails} ISBN:9780374104092
 */

/**
 * Standardizes a book object by extracting relevant information from the provided book object.
 * @param {OpenLibraryBook} book - The book object to be standardized.
 * @returns {Book} - The standardized book object.
 */
export function standardize(book) {
  const standardBook = {
    title: book.title,
    publishedDate: book.publish_date,
    authors: book.authors ? book.authors.map(({ name }) => name) : [],
    description: book.subtitle,
    pageCount: book.number_of_pages,
    printType: "BOOK",
    categories: book.subjects.map(({ name }) => name),
    thumbnail: book.cover,
    link: book.url,
    publisher: book.publishers
      ? book.publishers.map((publisher) => publisher.name).join(", ")
      : "",
  };

  return standardBook;
}
