import axios from "axios";
import {
  defaultOptions,
  GOOGLE_BOOKS_API_BASE,
  GOOGLE_BOOKS_API_BOOK,
} from "../provider-resolvers.js";

/**
 * @typedef {import('../index.js').Book} Book
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */

/**
 * Resolves book information from Google Books API using the provided ISBN.
 * @param {string} isbn - The ISBN of the book.
 * @param {AxiosRequestConfig} options - Additional options for the API request.
 * @returns {Promise<Book>} The book information retrieved from the API.
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
    const book = books.items[0];
    return standardize(book.volumeInfo, isbn);
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * @typedef {object} ImageLinks
 * @property {string} [extraLarge] - extraLarge
 * @property {string} [large] - large
 * @property {string} [medium] - medium
 * @property {string} [small] - small
 * @property {string} [thumbnail] - thumbnail
 * @property {string} [smallThumbnail] - smallThumbnail
 */

/**
 * @typedef {object} GoogleBook
 * @property {string} title - The title of the book.
 * @property {string} subtitle - The subtitle of the book.
 * @property {string[]} authors - The authors of the book.
 * @property {string} publisher - The publisher of the book.
 * @property {string} publishedDate - The published date of the book.
 * @property {string} description - The description of the book.
 * @property {object[]} industryIdentifiers - The industry identifiers of the book.
 * @property {object} readingModes - The reading modes of the book.
 * @property {number} pageCount - The number of pages in the book.
 * @property {string} printType - The print type of the book.
 * @property {string[]} categories - The categories of the book.
 * @property {number} averageRating - The average rating of the book.
 * @property {number} ratingsCount - The ratings count of the book.
 * @property {string} maturityRating - The maturity rating of the book.
 * @property {boolean} allowAnonLogging - The allow anon logging of the book.
 * @property {string} contentVersion - The content version of the book.
 * @property {object} panelizationSummary - The panelization summary of the book.
 * @property {ImageLinks} [imageLinks] - The image links of the book.
 * @property {string} language - The language of the book.
 * @property {string} previewLink - The preview link of the book.
 * @property {string} infoLink - The info link of the book.
 * @property {string} canonicalVolumeLink - The canonical volume link of the book.
 * @property {object} saleInfo - The sale info of the book.
 * @property {object} accessInfo - The access info of the book.
 * @property {object} searchInfo - The search info of the book.
 */

/**
 * Standardizes a book object by extracting relevant information from the provided book object.
 * @param {GoogleBook} book - The book object to be standardized.
 * @param {string} isbn - The book's ISBN.
 * @returns {Book} The standardized book object.
 */
export function standardize(book, isbn) {
  const standardBook = {
    title: book.title,
    authors: book.authors,
    description: book.description,
    pageCount: book.pageCount,
    printType: book.printType,
    categories: book.categories,
    thumbnail: getLargestThumbnail(book.imageLinks),
    link: book.canonicalVolumeLink,
    isbn,
  };

  return standardBook;
}

/**
 * Get the largest available thumbnail from a book's image links.
 * @param {ImageLinks} [imageLinks] - The image links object.
 * @returns {string|undefined} The URL of the largest thumbnail, or undefined if not found.
 */
function getLargestThumbnail(imageLinks) {
  const sizes = [
    "extraLarge",
    "large",
    "medium",
    "small",
    "thumbnail",
    "smallThumbnail",
  ];

  if (!imageLinks) return;

  for (const size of sizes) {
    if (size in imageLinks) {
      // @ts-ignore
      return imageLinks[size];
    }
  }
}
