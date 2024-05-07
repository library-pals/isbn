import axios from "axios";
import {
  defaultOptions,
  OPENLIBRARY_API_BASE,
  OPENLIBRARY_API_BOOK,
} from "../provider-resolvers.js";

/**
 * Resolves a book from the Open Library API using the provided ISBN.
 * @param {string} isbn - The ISBN of the book.
 * @param {object} options - Additional options for the request.
 * @returns {Promise<object>} A promise that resolves to the standardized book object.
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

const LANGUAGE_MAP = {
  "/languages/eng": "en",
  "/languages/spa": "es",
  "/languages/fre": "fr",
};

/**
 * Standardizes a book object by extracting relevant information from the provided book object.
 * @param {object} book - The book object to be standardized.
 * @returns {object} - The standardized book object.
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
      ? LANGUAGE_MAP[book.details.languages[0].key] || "unknown"
      : "unknown",
  };

  return standardBook;
}
