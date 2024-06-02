import axios from "axios";
import {
  defaultOptions,
  OPENLIBRARY_API_BASE,
  OPENLIBRARY_API_BOOK,
} from "../provider-resolvers.js";

/**
 * @typedef {import('../index.js').Book} Book
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */

/**
 * Resolves a book from the Open Library API using the provided ISBN.
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
  const url = `${OPENLIBRARY_API_BASE}${OPENLIBRARY_API_BOOK}/${isbn}.json`;

  try {
    const response = await axios.get(url, requestOptions);
    if (response.status !== 200) {
      throw new Error(`Wrong response code: ${response.status}`);
    }
    const book = response.data;
    if (!book || Object.keys(book).length === 0) {
      throw new Error(`No books found with ISBN: ${isbn}`);
    }
    return await standardize(book, isbn);
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * @typedef {object} Author
 * @property {string} key - The key of the author.
 */

/**
 * @typedef {object} Language
 * @property {string} key - The key of the language.
 */

/**
 * @typedef {object} Type
 * @property {string} key - The key of the type.
 */

/**
 * @typedef {object} FirstSentence
 * @property {string} type - The type of the first sentence.
 * @property {string} value - The value of the first sentence.
 */

/**
 * @typedef {object} Work
 * @property {string} key - The key of the work.
 */

/**
 * @typedef {object} DateTime
 * @property {string} type - The type of the datetime.
 * @property {string} value - The value of the datetime.
 */

/**
 * @typedef {object} OpenLibraryBook
 * @property {object} identifiers - The identifiers of the book.
 * @property {string} title - The title of the book.
 * @property {Author[]} authors - The authors of the book.
 * @property {string} publish_date - The publish date of the book.
 * @property {string[]} publishers - The publishers of the book.
 * @property {number[]} covers - The covers of the book.
 * @property {string[]} contributions - The contributions to the book.
 * @property {Language[]} languages - The languages of the book.
 * @property {string[]} source_records - The source records of the book.
 * @property {string[]} local_id - The local IDs of the book.
 * @property {Type} type - The type of the book.
 * @property {FirstSentence} first_sentence - The first sentence of the book.
 * @property {string} key - The key of the book.
 * @property {number} number_of_pages - The number of pages in the book.
 * @property {Work[]} works - The works related to the book.
 * @property {object} classifications - The classifications of the book.
 * @property {string} ocaid - The Open Content Alliance ID of the book.
 * @property {string[]} isbn_10 - The ISBN-10 of the book.
 * @property {string[]} isbn_13 - The ISBN-13 of the book.
 * @property {number} latest_revision - The latest revision of the book.
 * @property {number} revision - The revision of the book.
 * @property {DateTime} created - The creation datetime of the book.
 * @property {DateTime} last_modified - The last modified datetime of the book.
 */

/**
 * Standardizes a book object by extracting relevant information from the provided book object.
 * @param {OpenLibraryBook} book - The book object to be standardized.
 * @param {string} isbn - The book's isbn.
 * @returns {Promise<Book>} - The standardized book object.
 */
export async function standardize(book, isbn) {
  const { description, subjects, rawAuthors } = await getWorks(book);
  const authors = await getAuthors(rawAuthors);
  const standardBook = {
    title: book.title,
    authors,
    description,
    pageCount: book.number_of_pages,
    format: "book",
    categories: subjects,
    thumbnail: `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`,
    link: book.key
      ? `${OPENLIBRARY_API_BASE}${book.key}`
      : `${OPENLIBRARY_API_BASE}${OPENLIBRARY_API_BOOK}/${isbn}`,
    publisher: book.publishers?.join(", "),
    publishedDate: book.publish_date,
    language: formatLanguage(book.languages),
    isbn,
    bookProvider: "Open Library",
  };

  return standardBook;
}

/**
 * Retrieves the author names from OpenLibrary.
 * @param {{key: string}[]} rawAuthors - List of author keys.
 * @returns {Promise<string[]>} - List of author names.
 */
export async function getAuthors(rawAuthors) {
  const promises = rawAuthors
    .filter((author) => author && author.key)
    .map((author) =>
      axios
        .get(`https://openlibrary.org/${author.key}.json`)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error(
              `Unable to get author ${author.key}: ${response.status}`,
            );
          }
          return response.data && response.data.name;
        }),
    );

  try {
    return await Promise.all(promises);
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * @typedef {object} OpenLibraryResponse
 * @property {string} description - The description of the book.
 * @property {string[]} subjects - The subjects of the book.
 * @property {{author: {key: string}}[]} authors - The authors of the book.
 */

/**
 * Retrieves the description of the book from OpenLibrary.
 * @param {OpenLibraryBook} book - The book object from OpenLibrary.
 * @returns {Promise<{description: string, subjects: string[], rawAuthors: {key: string}[]}>} - Description of the book.
 */
export async function getWorks(book) {
  const defaultResponse = {
    description: "",
    subjects: [],
    rawAuthors: [],
  };

  if (!book.works) {
    return defaultResponse;
  }

  const [work] = book.works;

  if (!work || !work.key) {
    return defaultResponse;
  }

  try {
    const response = await axios.get(
      `https://openlibrary.org/${work.key}.json`,
    );

    if (response.status !== 200) {
      throw new Error(`Unable to get ${work.key}: ${response.status}`);
    }

    /** @type {OpenLibraryResponse} */
    const data = response.data;

    return {
      description: data.description || "",
      subjects: data.subjects || [],
      rawAuthors: data.authors?.map((a) => a.author) || [],
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Formats the language codes from Open Library API to their corresponding ISO 639-1 codes.
 * @param {Language[]} languages - An array of language codes from Open Library API.
 * @returns {string | undefined} - A new language map object with ISO 639-1 codes as keys and language codes as values.
 */
function formatLanguage(languages) {
  if (!languages || languages.length === 0) {
    return;
  }
  /**
   * Mapping of Open Library language codes to their corresponding language names.
   * https://openlibrary.org/languages.json
   * @type {{ [key: string]: string } } - A new language map object with ISO 639-1 codes as keys and language codes as values.
   */
  const newLanguageMap = {
    "/languages/eng": "en",
    "/languages/spa": "es",
    "/languages/fre": "fr",
    "/languages/ger": "de",
    "/languages/rus": "ru",
    "/languages/ita": "it",
    "/languages/chi": "zh",
    "/languages/jpn": "ja",
    "/languages/por": "pt",
    "/languages/ara": "ar",
    "/languages/heb": "he",
    "/languages/kor": "ko",
    "/languages/pol": "pl",
    "/languages/dut": "nl",
    "/languages/lat": "la",
  };

  return newLanguageMap[languages[0].key] || undefined;
}
