import Isbn from "../src/index.js";
import axios from "axios";

import { jest } from "@jest/globals";

jest.mock("axios");

const MOCK_ISBN = "9780374104092";
const GOOGLE_BOOKS_API_BASE = "https://www.googleapis.com";
const OPENLIBRARY_API_BASE = "https://openlibrary.org";
const ISBNDB_API_BASE = "https://api2.isbndb.com";

import openLibraryMock from "./fixtures/open-library-isbn-9780374104092.json";
import googleMock from "./fixtures/google-9780374104092.json";

process.env.ISBNDB_API_KEY = "key-1234";

describe("ISBN Resolver API", () => {
  let isbn;
  beforeEach(() => {
    isbn = new Isbn();
  });

  afterEach(() => {
    isbn = null;
  });

  describe("using async", () => {
    it("should resolve a valid ISBN with Google", async () => {
      const mockResponseGoogle = googleMock;

      axios.get = jest.fn().mockResolvedValue({
        status: 200,
        data: mockResponseGoogle,
      });

      const book = await isbn.resolve(MOCK_ISBN);
      expect(book).toMatchInlineSnapshot(`
        {
          "authors": [
            "Jeff VanderMeer",
          ],
          "categories": [
            "Fiction",
          ],
          "description": "Describes the 12th expedition to “Area X,” a region cut off from the continent for decades, by a group of intrepid women scientists who try to ignore the high mortality rates of those on the previous 11 missions. Original. 75,000 first printing.",
          "isbn": "9780374104092",
          "link": "https://books.google.com/books/about/Annihilation.html?hl=&id=2cl7AgAAQBAJ",
          "pageCount": 209,
          "printType": "BOOK",
          "thumbnail": "https://books.google.com/books?id=2cl7AgAAQBAJ&printsec=frontcover&img=1&zoom=6&edge=curl&source=gbs_api",
          "title": "Annihilation",
        }
      `);
    });

    it("should resolve a valid ISBN with Open Library", async () => {
      const mockResponseGoogle = {
        kind: "books#volumes",
        totalItems: 0,
      };

      const mockResponseOpenLibrary = openLibraryMock;

      axios.get.mockImplementation((url) => {
        if (url.includes(GOOGLE_BOOKS_API_BASE)) {
          return Promise.resolve({ status: 200, data: mockResponseGoogle });
        } else if (url.includes(OPENLIBRARY_API_BASE)) {
          return Promise.resolve({
            status: 200,
            data: mockResponseOpenLibrary,
          });
        }
      });

      const book = await isbn.resolve(MOCK_ISBN);
      expect(book).toMatchInlineSnapshot(`
        {
          "authors": [],
          "categories": [],
          "description": "",
          "isbn": "9780374104092",
          "link": "https://openlibrary.org/books/OL7353617M",
          "pageCount": 96,
          "printType": "BOOK",
          "thumbnail": "https://covers.openlibrary.org/b/id/8739161-L.jpg",
          "title": "Fantastic Mr. Fox",
        }
      `);
    });

    it("should resolve a valid ISBN with ISBNdb", async () => {
      const mockResponseGoogle = {
        kind: "books#volumes",
        totalItems: 0,
      };

      const mockResponseOpenLibrary = {};

      const mockResponseIsbnDb = {
        book: {
          publisher: "Turtle Bay Books",
          image: "https://images.isbndb.com/covers/30/23/9781484233023.jpg",
          title_long: "Book Title",
          edition: "1",
          pages: 174,
          date_published: "1992-12-13",
          authors: ["Aswin Pranam"],
          title: "Book Title",
          isbn13: "9781484233023",
          msrp: "1.23",
          binding: "Paperback",
          isbn: "1484233026",
        },
      };

      axios.get.mockImplementation((url) => {
        if (url.includes(GOOGLE_BOOKS_API_BASE)) {
          return Promise.resolve({ status: 200, data: mockResponseGoogle });
        } else if (url.includes(OPENLIBRARY_API_BASE)) {
          return Promise.resolve({
            status: 200,
            data: mockResponseOpenLibrary,
          });
        } else if (url.includes(ISBNDB_API_BASE)) {
          return Promise.resolve({ status: 200, data: mockResponseIsbnDb });
        }
      });

      const book = await isbn.resolve(MOCK_ISBN);
      expect(isbn._providers).toMatchInlineSnapshot(`
        [
          "google",
          "openlibrary",
          "isbndb",
        ]
      `);
      expect(book).toMatchInlineSnapshot(`
        {
          "authors": [
            "Aswin Pranam",
          ],
          "categories": undefined,
          "description": undefined,
          "isbn": "9780374104092",
          "pageCount": 174,
          "printType": "BOOK",
          "thumbnail": "https://images.isbndb.com/covers/30/23/9781484233023.jpg",
          "title": "Book Title",
        }
      `);
    });

    it("should return an error if no book is found", async () => {
      const mockResponseGoogle = {
        kind: "books#volumes",
        totalItems: 0,
      };

      const mockResponseOpenLibrary = {};

      const mockResponseIsbnDb = {};

      axios.get.mockImplementation((url) => {
        if (url.includes(GOOGLE_BOOKS_API_BASE)) {
          return Promise.resolve({ status: 200, data: mockResponseGoogle });
        } else if (url.includes(OPENLIBRARY_API_BASE)) {
          return Promise.resolve({
            status: 200,
            data: mockResponseOpenLibrary,
          });
        } else if (url.includes(ISBNDB_API_BASE)) {
          return Promise.resolve({
            status: 200,
            data: mockResponseIsbnDb,
          });
        }
      });

      await expect(isbn.resolve(MOCK_ISBN)).rejects.toMatchInlineSnapshot(`
        [Error: All providers failed
        google: No books found with isbn: 9780374104092
        openlibrary: No books found with ISBN: 9780374104092
        isbndb: No books found with ISBN: 9780374104092]
      `);
    });

    it("should return an error if external endpoints are not reachable", async () => {
      axios.get.mockRejectedValue(new Error("Network Error"));

      await expect(isbn.resolve(MOCK_ISBN)).rejects.toMatchInlineSnapshot(`
        [Error: All providers failed
        google: Network Error
        openlibrary: Network Error
        isbndb: Network Error]
      `);
    });

    it("should return an error if external endpoints return a HTTP error", async () => {
      axios.get.mockRejectedValue({ status: 500 });

      await expect(isbn.resolve(MOCK_ISBN)).rejects.toMatchInlineSnapshot(
        `[Error: All providers failed]`
      );
    });

    it("should invoke providers in order specified", async () => {
      const mockResponseGoogle = googleMock;

      const mockResponseOpenLibrary = {};

      axios.get.mockImplementation((url) => {
        if (url.includes(GOOGLE_BOOKS_API_BASE)) {
          return Promise.resolve({ status: 200, data: mockResponseGoogle });
        } else if (url.includes(OPENLIBRARY_API_BASE)) {
          return Promise.resolve({
            status: 200,
            data: mockResponseOpenLibrary,
          });
        }
      });

      const book = await isbn
        .provider([isbn.PROVIDER_NAMES.OPENLIBRARY, isbn.PROVIDER_NAMES.GOOGLE])
        .resolve(MOCK_ISBN);
      expect(book).toMatchInlineSnapshot(`
        {
          "authors": [
            "Jeff VanderMeer",
          ],
          "categories": [
            "Fiction",
          ],
          "description": "Describes the 12th expedition to “Area X,” a region cut off from the continent for decades, by a group of intrepid women scientists who try to ignore the high mortality rates of those on the previous 11 missions. Original. 75,000 first printing.",
          "isbn": "9780374104092",
          "link": "https://books.google.com/books/about/Annihilation.html?hl=&id=2cl7AgAAQBAJ",
          "pageCount": 209,
          "printType": "BOOK",
          "thumbnail": "https://books.google.com/books?id=2cl7AgAAQBAJ&printsec=frontcover&img=1&zoom=6&edge=curl&source=gbs_api",
          "title": "Annihilation",
        }
      `);
    });

    it("should override default options", async function () {
      const mockResponseGoogle = googleMock;

      axios.get.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({ status: 200, data: mockResponseGoogle });
            }, 10_000);
          })
      );

      const book = await isbn.resolve(MOCK_ISBN, { timeout: 15_000 });
      expect(book).toMatchInlineSnapshot(`
        {
          "authors": [
            "Jeff VanderMeer",
          ],
          "categories": [
            "Fiction",
          ],
          "description": "Describes the 12th expedition to “Area X,” a region cut off from the continent for decades, by a group of intrepid women scientists who try to ignore the high mortality rates of those on the previous 11 missions. Original. 75,000 first printing.",
          "isbn": "9780374104092",
          "link": "https://books.google.com/books/about/Annihilation.html?hl=&id=2cl7AgAAQBAJ",
          "pageCount": 209,
          "printType": "BOOK",
          "thumbnail": "https://books.google.com/books?id=2cl7AgAAQBAJ&printsec=frontcover&img=1&zoom=6&edge=curl&source=gbs_api",
          "title": "Annihilation",
        }
      `);
    }, 20_000);
  });
});

describe("ISBN Provider API", () => {
  let isbn;
  beforeEach(() => {
    isbn = new Isbn();
  });

  afterEach(() => {
    isbn = null;
  });

  it("should use default providers if providers array is empty", () => {
    isbn.provider([]);
    expect(isbn._providers).toMatchInlineSnapshot(`
      [
        "google",
        "openlibrary",
        "isbndb",
      ]
    `);
  });

  it("should return an error if providers is not an array", () => {
    expect(() => {
      isbn.provider("string-that-must-not-work");
    }).toThrow();
    expect(isbn._providers).toMatchInlineSnapshot(`
      [
        "google",
        "openlibrary",
        "isbndb",
      ]
    `);
  });

  it("should return an error if invalid providers in list", () => {
    expect(() => {
      isbn.provider(["gibberish", "wow", "sogood"]);
    }).toThrow();
    expect(isbn._providers).toMatchInlineSnapshot(`
      [
        "google",
        "openlibrary",
        "isbndb",
      ]
    `);
  });

  it("should remove duplicates", () => {
    const providers = [
      isbn.PROVIDER_NAMES.OPENLIBRARY,
      isbn.PROVIDER_NAMES.OPENLIBRARY,
    ];

    isbn.provider(providers);
    expect(isbn._providers).toMatchInlineSnapshot(`
      [
        "openlibrary",
      ]
    `);
  });

  it("should set providers as expected", () => {
    const providers = [
      isbn.PROVIDER_NAMES.OPENLIBRARY,
      isbn.PROVIDER_NAMES.GOOGLE,
    ];

    isbn.provider(providers);
    expect(isbn._providers).toMatchInlineSnapshot(`
      [
        "openlibrary",
        "google",
      ]
    `);
  });

  it("should return instance after setting provider", () => {
    const providers = [
      isbn.PROVIDER_NAMES.OPENLIBRARY,
      isbn.PROVIDER_NAMES.GOOGLE,
    ];

    const result = isbn.provider(providers);
    expect(result.constructor).toBe(isbn.constructor);
  });
});
