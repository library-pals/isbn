import axios from "axios";
import {
  defaultOptions,
  ISBNDB_API_BASE,
  ISBNDB_API_BOOK,
} from "../provider-resolvers.js";

/**
 * Resolves the ISBN using the ISBNdb API.
 * @param {string} isbn - The ISBN to resolve.
 * @param {object} options - Additional options for the request.
 * @returns {Promise<object>} - A promise that resolves to the standardized book data.
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
    return standardize(books.book);
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Standardizes a book object by transforming its properties into a consistent format.
 * @param {object} book - The book object to be standardized.
 * @returns {object} - The standardized book object.
 */
function standardize(book) {
  return {
    title: book.title_long,
    publishedDate: book.date_published,
    authors: book.authors,
    description: book.overview,
    industryIdentifiers: [book.isbn, book.isbn13, book.dewey_decimal].filter(
      Boolean
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
