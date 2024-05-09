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
  const url = `${OPENLIBRARY_API_BASE}${OPENLIBRARY_API_BOOK}?bibkeys=ISBN:${isbn}&format=json&jscmd=details`;

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
 * @typedef {object} OpenLibraryBook
 * @property {object} details - The details of the book.
 * @property {string} details.title - The title of the book.
 * @property {string} details.publish_date - The publish date of the book.
 * @property {Array<{name: string}>} details.authors - The authors of the book.
 * @property {string} details.subtitle - The subtitle of the book.
 * @property {number} details.number_of_pages - The number of pages in the book.
 * @property {Array<string>} details.publishers - The publishers of the book.
 * @property {Array<{key: string}>} details.languages - The languages of the book.
 * @property {string} thumbnail_url - The URL of the book's thumbnail.
 * @property {string} preview_url - The URL of the book's preview.
 * @property {string} info_url - The URL of the book's information.
 */

/**
 * Standardizes a book object by extracting relevant information from the provided book object.
 * @param {OpenLibraryBook} book - The book object to be standardized.
 * @returns {Book} - The standardized book object.
 */
export function standardize(book) {
  const standardBook = {
    title: book.details.title,
    publishedDate: book.details.publish_date,
    authors: book.details.authors
      ? book.details.authors.map(({ name }) => name)
      : [],
    description: book.details.subtitle,
    industryIdentifiers: [],
    pageCount: book.details.number_of_pages,
    printType: "BOOK",
    categories: [],
    imageLinks: {
      smallThumbnail: book.thumbnail_url,
      thumbnail: book.thumbnail_url,
    },
    previewLink: book.preview_url,
    infoLink: book.info_url,
    publisher: book.details.publishers ? book.details.publishers[0] : "",
    language: book.details.languages
      ? {
          "/languages/eng": "en",
          "/languages/spa": "es",
          "/languages/fre": "fr",
        }[book.details.languages[0].key] || "unknown"
      : "unknown",
  };

  return standardBook;
}
