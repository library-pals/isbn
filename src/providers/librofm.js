import { LIBROFM_API_BASE, LIBROFM_API_BOOK } from "../provider-resolvers.js";
import axios from "axios";

/**
 * @typedef {import('../index.js').Book} Book
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */

/**
 * Resolves book information from Libro.fm using the provided ISBN.
 * @param {string} isbn - The ISBN of the book.
 * @returns {Promise<Book>} The book information retrieved from the API.
 * @throws {Error} If the API response code is not 200, or if no books are found with the provided ISBN, or if no volume information is found for the book.
 */
export async function resolveLibroFm(isbn) {
  const url = `${LIBROFM_API_BASE}${LIBROFM_API_BOOK}/${isbn}`;

  const response = await axios.get(url);
  try {
    if (response.status !== 200) {
      throw new Error(`Unable to get ${url}: ${response.status}`);
    }

    // Use a regular expression to extract the JSON
    const regex = /<script type="application\/ld\+json">(.*?)<\/script>/s;
    const match = response.data.match(regex);
    if (!match) {
      throw new Error(`No information found for ${url}`);
    }

    /**
     * @type {Audiobook}
     */
    const jsonData = JSON.parse(match[1]);

    return standardize(jsonData, isbn);
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Standardizes a book object by extracting relevant information from the provided book object.
 * @param {Audiobook} book - The book object to be standardized.
 * @param {string} isbn - The book's ISBN.
 * @returns {Promise<Book>} The standardized book object.
 */
export async function standardize(book, isbn) {
  const standardBook = {
    title: book.name,
    authors: book.author.map((author) => author.name),
    description: formatDescription(book.description),
    printType: book.bookFormat,
    categories: [],
    thumbnail: book.image,
    link: book.url,
    publisher: book.publisher,
    publishedDate: book.datePublished,
    language: book.inLanguage,
    isbn,
    bookProvider: "Libro.fm",
  };

  return standardBook;
}

/**
 * @typedef {object} Person
 * @property {string} name - The name of the person.
 */
/**
 * @typedef {object} Audiobook
 * @property {string} url - The URL of the audiobook.
 * @property {string} bookFormat - The format of the audiobook.
 * @property {string} name - The name of the audiobook.
 * @property {string} description - The description of the audiobook.
 * @property {string} isbn - The ISBN of the audiobook.
 * @property {string} image - The image of the audiobook.
 * @property {string} abridged - Whether the audiobook is abridged.
 * @property {Person[]} author - The author of the audiobook.
 * @property {Person[]} readBy - The person who read the audiobook.
 * @property {string} publisher - The publisher of the audiobook.
 * @property {string} datePublished - The date the audiobook was published.
 * @property {string} inLanguage - The language of the audiobook.
 * @property {string} duration - The duration of the audiobook.
 * @property {string[]} regionsAllowed - The regions allowed for the audiobook.
 * @property {object} offers - The offers for the audiobook.
 * @property {object} workExample - The work example for the audiobook.
 */

/**
 * Formats the description by removing HTML tags and contents inside them.
 * @param {string} description - The description to be formatted.
 * @returns {string} The formatted description.
 */
function formatDescription(description) {
  if (!description) return "";
  // Remove bold tags and contents
  description = description.replaceAll(/<b>.*?<\/b>/g, "");
  // Remove all other html elements
  description = description.replaceAll(/<.*?>/g, "");
  // Remove extra spaces
  description = description.replaceAll(/\s{2,}/g, " ");
  return description.trim();
}
