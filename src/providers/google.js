import axios from "axios";
import {
  defaultOptions,
  GOOGLE_BOOKS_API_BASE,
  GOOGLE_BOOKS_API_BOOK,
} from "../provider-resolvers.js";

/**
 * Resolves book information from Google Books API using the provided ISBN.
 * @param {string} isbn - The ISBN of the book.
 * @param {object} options - Additional options for the API request.
 * @returns {Promise<object>} The book information retrieved from the API.
 * @throws {Error} If the API response code is not 200, or if no books are found with the provided ISBN, or if no volume information is found for the book.
 */
export async function resolveGoogle(isbn, options) {
  const requestOptions = {
    ...defaultOptions,
    ...options,
  };
  const url = `${GOOGLE_BOOKS_API_BASE}${GOOGLE_BOOKS_API_BOOK}?q=isbn:${isbn}`;

  try {
    const response = await axios.get(url, requestOptions);
    if (response.status !== 200) {
      throw new Error(`Wrong response code: ${response.status}`);
    }
    const books = response.data;
    if (!books.totalItems) {
      throw new Error(`No books found with isbn: ${isbn}`);
    }
    // In very rare circumstances books.items[0] is undefined (see #2)
    if (!books.items || books.items.length === 0) {
      throw new Error(`No volume info found for book with isbn: ${isbn}`);
    }
    const book = books.items[0].volumeInfo;
    return book;
  } catch (error) {
    throw new Error(error.message);
  }
}
