import axios from "axios";
import {
  defaultOptions,
  ISBNDB_API_BASE,
  ISBNDB_API_BOOK,
} from "../provider-resolvers.js";

/**
 * @typedef {import('../index.js').Book} Book
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */

/**
 * Resolves the ISBN using the ISBNdb API.
 * @param {string} isbn - The ISBN to resolve.
 * @param {AxiosRequestConfig} options - Additional options for the request.
 * @returns {Promise<Book>} - A promise that resolves to the standardized book data.
 * @throws {Error} - If the response code is not 200 or if no books are found with the given ISBN.
 */
export async function resolveIsbnDb(isbn, options) {
  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: { Authorization: process.env.ISBNDB_API_KEY || "" },
  };

  const url = `${ISBNDB_API_BASE}${ISBNDB_API_BOOK}/${isbn}`;

  try {
    const response = await axios.get(url, requestOptions);
    if (response.status !== 200) {
      throw new Error(`Wrong response code: ${response.status}`);
    }
    const books = response.data;
    if (!books.book) {
      throw new Error(`No books found with ISBN: ${isbn}`);
    }
    return standardize(books.book);
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * @typedef {object} IsbnDbBook
 * @property {string} title_long - The long title of the book.
 * @property {string} date_published - The published date of the book.
 * @property {string[]} authors - The authors of the book.
 * @property {string} overview - The overview of the book.
 * @property {string} isbn - The ISBN of the book.
 * @property {string} isbn13 - The ISBN13 of the book.
 * @property {string} dewey_decimal - The Dewey Decimal classification of the book.
 * @property {number} pages - The number of pages in the book.
 * @property {string[]} subjects - The subjects or categories of the book.
 * @property {string} image - The image link of the book.
 * @property {string} publisher - The publisher of the book.
 * @property {string} language - The language of the book.
 */

/**
 * Standardizes a book object by transforming its properties into a consistent format.
 * @param {IsbnDbBook} book - The book object to be standardized.
 * @returns {Book} - The standardized book object.
 */
function standardize(book) {
  return {
    title: book.title_long,
    publishedDate: book.date_published,
    authors: book.authors,
    description: book.overview,
    industryIdentifiers: [book.isbn, book.isbn13, book.dewey_decimal].filter(
      Boolean,
    ),
    pageCount: book.pages,
    printType: "BOOK",
    categories: book.subjects,
    imageLinks: {
      smallThumbnail: book.image,
      thumbnail: book.image,
    },
    publisher: book.publisher,
    language: book.language,
  };
}
