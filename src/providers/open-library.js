import axios from "axios";
import {
  defaultOptions,
  OPENLIBRARY_API_BASE,
  OPENLIBRARY_API_SEARCH,
} from "../provider-resolvers.js";

/**
 * @typedef {import('../index.js').Book} Book
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */

const SEARCH_FIELDS = [
  "title",
  "author_name",
  "number_of_pages_median",
  "subject",
  "cover_i",
  "key",
  "editions",
  "editions.key",
  "editions.title",
  "editions.cover_i",
  "editions.publisher",
  "editions.publish_date",
  "editions.language",
].join(",");

/**
 * Resolves a book from the Open Library Search API using the provided ISBN.
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
  const url = `${OPENLIBRARY_API_BASE}${OPENLIBRARY_API_SEARCH}`;

  try {
    const response = await axios.get(url, {
      timeout: requestOptions.timeout,
      params: { isbn, fields: SEARCH_FIELDS, limit: 1 },
    });
    if (response.status !== 200) {
      throw new Error(`Wrong response code: ${response.status}`);
    }
    const { docs } = response.data;
    if (!docs || docs.length === 0) {
      throw new Error(`No books found with ISBN: ${isbn}`);
    }
    const document = docs[0];
    const description = document.key
      ? await getDescription(document.key, requestOptions.timeout)
      : "";
    return standardize(document, isbn, description);
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}

/**
 * @typedef {object} OpenLibraryEdition
 * @property {string} key - Edition key.
 * @property {string} [title] - Edition title.
 * @property {number} [cover_i] - Edition cover image ID.
 * @property {string[]} [publisher] - Publishers.
 * @property {string[]} [publish_date] - Publish dates.
 * @property {string[]} [language] - ISO 639-2 language codes.
 */

/**
 * @typedef {object} OpenLibrarySearchDoc
 * @property {string} title - Work title.
 * @property {string[]} [author_name] - Author names.
 * @property {number} [number_of_pages_median] - Median page count.
 * @property {string[]} [subject] - Subjects/categories.
 * @property {number} [cover_i] - Work cover image ID.
 * @property {string} key - Work key.
 * @property {{docs: OpenLibraryEdition[]}} [editions] - Matched edition data.
 */

/**
 * Standardizes a search result doc into a Book object.
 * @param {OpenLibrarySearchDoc} document - The search result doc.
 * @param {string} isbn - The book's ISBN.
 * @param {string} [description] - The book's description.
 * @returns {Book} The standardized book object.
 */
export function standardize(document, isbn, description = "") {
  const edition = document.editions?.docs?.[0];
  const coverId = edition?.cover_i || document.cover_i;
  return {
    title: edition?.title || document.title,
    authors: document.author_name || [],
    description,
    pageCount: document.number_of_pages_median,
    format: "book",
    categories: document.subject || [],
    thumbnail: coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
      : undefined,
    link: edition?.key
      ? `${OPENLIBRARY_API_BASE}${edition.key}`
      : (document.key
        ? `${OPENLIBRARY_API_BASE}${document.key}`
        : `${OPENLIBRARY_API_BASE}/isbn/${isbn}`),
    publisher: edition?.publisher?.[0],
    publishedDate: edition?.publish_date?.[0],
    language: formatLanguage(edition?.language),
    isbn,
    bookProvider: "Open Library",
  };
}

/**
 * Fetches the description for a work from the Open Library works endpoint.
 * @param {string} workKey - The work key (e.g. "/works/OL45804W").
 * @param {number} [timeout] - Request timeout in milliseconds.
 * @returns {Promise<string>} The description, or an empty string if unavailable.
 */
export async function getDescription(workKey, timeout) {
  try {
    const response = await axios.get(`${OPENLIBRARY_API_BASE}${workKey}.json`, {
      timeout,
    });
    if (response.status !== 200) return "";
    const { description } = response.data;
    if (!description) return "";
    if (typeof description === "string") return description;
    return description.value || "";
  } catch {
    return "";
  }
}

/**
 * Formats ISO 639-2 language codes to ISO 639-1.
 * @param {string[]} [languages] - Array of ISO 639-2 language codes.
 * @returns {string | undefined} ISO 639-1 code, or undefined if not mapped.
 */
function formatLanguage(languages) {
  if (!languages || languages.length === 0) return;
  const languageMap = {
    eng: "en",
    spa: "es",
    fre: "fr",
    ger: "de",
    rus: "ru",
    ita: "it",
    chi: "zh",
    jpn: "ja",
    por: "pt",
    ara: "ar",
    heb: "he",
    kor: "ko",
    pol: "pl",
    dut: "nl",
    lat: "la",
  };
  return languageMap[languages[0]] || undefined;
}
