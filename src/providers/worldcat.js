import axios from "axios";
import {
  defaultOptions,
  WORLDCAT_API_BASE,
  WORLDCAT_API_BOOK,
} from "../provider-resolvers.js";

/**
 * Resolves a book using the Worldcat API based on the provided ISBN.
 * @param {string} isbn - The ISBN of the book to resolve.
 * @param {object} options - Additional options for the request.
 * @returns {Promise<object>} A promise that resolves to the standardized book object.
 * @throws {Error} If the response code is not 200 or if no books are found with the provided ISBN.
 */
export async function resolveWorldcat(isbn, options) {
  const requestOptions = {
    ...defaultOptions,
    ...options,
    url: `${WORLDCAT_API_BASE}${WORLDCAT_API_BOOK}/${isbn}?method=getMetadata&fl=*&format=json`,
  };

  const { status, data } = await axios.request(requestOptions);
  if (status !== 200) {
    throw new Error(
      `Wrong response code: ${status}. Response data: ${JSON.stringify(data)}`
    );
  }
  const books = data;
  if (books.stat !== "ok") {
    throw new Error(`No books found with ISBN: ${isbn}`);
  }
  const [book] = books.list;
  return standardize(book);
}

const LANGUAGE_MAP = {
  eng: "en",
  spa: "es",
  fre: "fr",
};

/**
 * Standardizes a book object by extracting relevant information from the provided book object.
 * @param {object} book - The book object to be standardized.
 * @returns {object} - The standardized book object.
 */
function standardize(book) {
  const standardBook = {
    title: book.title,
    publishedDate: book.year,
    authors: book.author ? [book.author] : [],
    description: null,
    industryIdentifiers: [],
    pageCount: null,
    printType: "BOOK",
    categories: [],
    imageLinks: {},
    publisher: book.publisher,
    language: LANGUAGE_MAP[book.lang] || "unknown",
  };

  return standardBook;
}
