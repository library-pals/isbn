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
  if (!process.env.ISBNDB_API_KEY) {
    throw new Error(`ISBNdb requires an API key`);
  }

  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: { Authorization: process.env.ISBNDB_API_KEY },
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
    return standardize(books.book, isbn);
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * @typedef {object} Dimension
 * @property {string} unit - The unit of the dimension.
 * @property {number} value - The value of the dimension.
 */

/**
 * @typedef {object} Offset
 * @property {string} x - The x offset.
 * @property {string} y - The y offset.
 */

/**
 * @typedef {object} Price
 * @property {string} condition - The condition of the book.
 * @property {string} merchant - The merchant selling the book.
 * @property {string} merchant_logo - The logo of the merchant.
 * @property {Offset} merchant_logo_offset - The offset of the merchant logo.
 * @property {string} shipping - The shipping cost.
 * @property {string} price - The price of the book.
 * @property {string} total - The total cost.
 * @property {string} link - The link to buy the book.
 */

/**
 * @typedef {object} OtherIsbn
 * @property {string} isbn - The ISBN of the book.
 * @property {string} binding - The binding of the book.
 */

/**
 * @typedef {object} IsbnDbBook
 * @property {string} title - The title of the book.
 * @property {string} title_long - The long title of the book.
 * @property {string} isbn - The ISBN of the book.
 * @property {string} isbn13 - The ISBN13 of the book.
 * @property {string} dewey_decimal - The Dewey Decimal classification of the book.
 * @property {string} binding - The binding of the book.
 * @property {string} publisher - The publisher of the book.
 * @property {string} language - The language of the book.
 * @property {string} date_published - The published date of the book.
 * @property {string} edition - The edition of the book.
 * @property {number} pages - The number of pages in the book.
 * @property {string} dimensions - The dimensions of the book.
 * @property {object} dimensions_structured - The structured dimensions of the book.
 * @property {Dimension} dimensions_structured.length - The length of the book.
 * @property {Dimension} dimensions_structured.width - The width of the book.
 * @property {Dimension} dimensions_structured.height - The height of the book.
 * @property {Dimension} dimensions_structured.weight - The weight of the book.
 * @property {string} overview - The overview of the book.
 * @property {string} image - The image link of the book.
 * @property {number} msrp - The manufacturer's suggested retail price of the book.
 * @property {string} excerpt - The excerpt of the book.
 * @property {string} synopsis - The synopsis of the book.
 * @property {string[]} authors - The authors of the book.
 * @property {string[]} subjects - The subjects or categories of the book.
 * @property {string[]} reviews - The reviews of the book.
 * @property {Price[]} prices - The prices of the book.
 * @property {object} related - The related books.
 * @property {string} related.type - The type of the related books.
 * @property {OtherIsbn[]} other_isbns - The other ISBNs of the book.
 */

/**
 * Standardizes a book object by transforming its properties into a consistent format.
 * @param {IsbnDbBook} book - The book object to be standardized.
 * @param {string} isbn - The book's ISBN.
 * @returns {Book} - The standardized book object.
 */
function standardize(book, isbn) {
  return {
    title: book.title_long,
    authors: book.authors,
    description: book.overview,
    pageCount: book.pages,
    printType: "BOOK",
    categories: book.subjects,
    thumbnail: book.image,
    publisher: book.publisher,
    isbn,
  };
}
