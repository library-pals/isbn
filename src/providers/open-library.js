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
  // https://openlibrary.org/isbn/9780140328721.json
  const url = `${OPENLIBRARY_API_BASE}${OPENLIBRARY_API_BOOK}${isbn}.json`;

  try {
    const response = await axios.get(url, requestOptions);
    if (response.status !== 200) {
      throw new Error(`Wrong response code: ${response.status}`);
    }
    const book = response.data;
    if (!book || Object.keys(book).length === 0) {
      throw new Error(`No books found with ISBN: ${isbn}`);
    }
    return standardize(book);
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * @typedef {object} OpenLibraryBook
 * @property {string} url - The URL of the book.
 * @property {string} key - The key of the book.
 * @property {string} title - The title of the book.
 * @property {Array<{name: string, url: string}>} authors - The authors of the book.
 * @property {number} number_of_pages - The number of pages in the book.
 * @property {string} weight - The weight of the book.
 * @property {Identifier} identifiers - The identifiers of the book.
 * @property {Array<{name: string}>} publishers - The publishers of the book.
 * @property {string} publish_date - The publish date of the book.
 * @property {Array<{name: string, url: string}>} subjects - The subjects of the book.
 * @property {Array<{text: string, comment: string}>} excerpts - The excerpts of the book.
 * @property {{large: string, medium: string; small: string;}} cover - The cover of the book.
 */

/**
 * Standardizes a book object by extracting relevant information from the provided book object.
 * @param {OpenLibraryBook} book - The book object to be standardized.
 * @returns {Book} - The standardized book object.
 */
export function standardize(book) {
  const standardBook = {
    title: book.title,
    authors: book.authors,
    description: "",
    pageCount: book.number_of_pages,
    printType: "BOOK",
    categories: book.subjects,
    thumbnail: `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`,
    link: book.url,
  };

  return standardBook;
}
