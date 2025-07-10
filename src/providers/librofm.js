import {
  LIBROFM_API_BASE,
  LIBROFM_API_BOOK,
  defaultOptions,
} from "../provider-resolvers.js";
import axios from "axios";

/**
 * @typedef {import('../index.js').Book} Book
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */

/**
 * Resolves book information from Libro.fm using the provided ISBN.
 * @param {string} isbn - The ISBN of the book.
 * @param {AxiosRequestConfig} options - Additional options for the API request.
 * @returns {Promise<Book>} The book information retrieved from the API.
 * @throws {Error} If the API response code is not 200, or if no books are found with the provided ISBN, or if no volume information is found for the book.
 */
export async function resolveLibroFm(isbn, options) {
  const requestOptions = {
    ...defaultOptions,
    ...options,
  };

  const url = `${LIBROFM_API_BASE}${LIBROFM_API_BOOK}/${isbn}`;

  const response = await axios.get(url, requestOptions);
  try {
    if (response.status !== 200) {
      throw new Error(`Unable to get ${url}: ${response.status}`);
    }
    return standardize(response.data, isbn, url);
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Standardizes a book object by extracting relevant information from the provided book object.
 * @param {string} data - The data to be standardized.
 * @param {string} isbn - The book's ISBN.
 * @param {string} url - The URL of the book.
 * @returns {Promise<Book>} The standardized book object.
 */
export async function standardize(data, isbn, url) {
  // Use a regular expression to extract the JSON
  const regex = /<script type="application\/ld\+json">(.*?)<\/script>/s;
  const match = data.match(regex);
  if (!match) {
    throw new Error(`No information found for ${url}`);
  }

  /**
   * @type {Audiobook}
   */
  const book = JSON.parse(match[1]);
  const standardBook = {
    title: book.name,
    authors: book.author.map((author) => author.name),
    description: formatDescription(book.description),
    format: book.bookFormat.includes("Audiobook")
      ? "audiobook"
      : book.bookFormat,
    categories: extractGenres(data),
    thumbnail: book.image,
    link: book.url,
    publisher: book.publisher,
    publishedDate: book.datePublished,
    language: book.inLanguage,
    isbn,
    bookProvider: "Libro.fm",
    duration: book.duration,
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
export function formatDescription(description) {
  if (!description) return "";
  // Replace <br> with a space
  description = description.replaceAll("<br>", " ");
  // Replace <b>—</b> with a dash
  description = description.replaceAll("<b>—</b>", "—");
  // Remove bold tags and contents
  description = description.replaceAll(/<b>.*?<\/b>/g, "");
  // Strip HTML tags
  description = stripHtmlTags(description);
  // Trim
  description = description.trim();
  // Remove extra spaces
  description = description.replaceAll(/\s{2,}/g, " ");
  return description;
}

/**
 * Extracts the genres from the given text.
 * @param {string} text - The text to extract genres from.
 * @returns {string[]} The extracted genres.
 */
function extractGenres(text) {
  const regex = /<div class="audiobook-genres">\s*([\S\s]*?)\s*<\/div>/;
  const match = text.match(regex);
  if (!match) {
    return [];
  }

  const linkRegex = /<a href="\/genres\/[^"]*">(.*?)<\/a>/g;
  const genres = [];
  let linkMatch;
  while ((linkMatch = linkRegex.exec(match[1])) !== null) {
    genres.push(linkMatch[1]);
  }

  return genres;
}

/**
 * Encodes HTML special characters to prevent XSS attacks.
 * @param {string} string - The string to encode.
 * @returns {string} - The encoded string.
 */
function encodeHTML(string) {
  return string
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('" ', "” ")
    .replaceAll(' "', "“ ")
    .replaceAll("'", "&#39;");
}

/**
 * Removes HTML tags from a string and encodes it to prevent XSS attacks.
 * @param {string} string - The string from which to remove HTML tags.
 * @returns {string} - The sanitized string without HTML tags.
 */
function stripHtmlTags(string) {
  return encodeHTML(string.replaceAll(/<\/?[^>]+(>|$)/g, ""));
}
