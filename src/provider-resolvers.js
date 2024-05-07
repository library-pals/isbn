import { resolveGoogle } from "./providers/google.js";
import { resolveOpenLibrary } from "./providers/open-library.js";
import { resolveIsbnDb } from "./providers/isbndb.js";

export const defaultOptions = {
  poll: {
    maxSockets: 500,
  },
  timeout: 5000,
};

export const GOOGLE_BOOKS_API_BASE = "https://www.googleapis.com";
export const GOOGLE_BOOKS_API_BOOK = "/books/v1/volumes";

export const OPENLIBRARY_API_BASE = "https://openlibrary.org";
export const OPENLIBRARY_API_BOOK = "/api/books";

export const ISBNDB_API_BASE = "https://api2.isbndb.com";
export const ISBNDB_API_BOOK = "/book";
export const PROVIDER_NAMES = {
  GOOGLE: "google",
  OPENLIBRARY: "openlibrary",
  ISBNDB: "isbndb",
};
export const DEFAULT_PROVIDERS = [
  PROVIDER_NAMES.GOOGLE,
  PROVIDER_NAMES.OPENLIBRARY,
  PROVIDER_NAMES.ISBNDB,
];
export const PROVIDER_RESOLVERS = {
  [PROVIDER_NAMES.GOOGLE]: resolveGoogle,
  [PROVIDER_NAMES.OPENLIBRARY]: resolveOpenLibrary,
  [PROVIDER_NAMES.ISBNDB]: resolveIsbnDb,
};
