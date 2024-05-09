import isbn from "../src/index.js";
import axios from "axios";

import { jest } from "@jest/globals";

jest.mock("axios");

const MOCK_ISBN = "isbn";
const GOOGLE_BOOKS_API_BASE = "https://www.googleapis.com";
const OPENLIBRARY_API_BASE = "https://openlibrary.org";
const ISBNDB_API_BASE = "https://api2.isbndb.com";

const DEFAULT_PROVIDER_ORDER = [
  isbn.PROVIDER_NAMES.GOOGLE,
  isbn.PROVIDER_NAMES.OPENLIBRARY,
  isbn.PROVIDER_NAMES.ISBNDB,
];

process.env.ISBNDB_API_KEY = "key-1234";

describe("ISBN Resolver API", () => {
  describe("using async", () => {
    it("should resolve a valid ISBN with Google", async () => {
      const mockResponseGoogle = {
        totalItems: 1,
        items: [
          {
            id: "11223344000",
            volumeInfo: {
              title: "Code Complete",
              authors: ["Steve McConnell"],
            },
          },
        ],
      };

      axios.get = jest.fn().mockResolvedValue({
        status: 200,
        data: mockResponseGoogle,
      });

      const book = await isbn.resolve(MOCK_ISBN);
      expect(book).toMatchInlineSnapshot(`
        {
          "authors": [
            "Steve McConnell",
          ],
          "categories": undefined,
          "description": undefined,
          "link": undefined,
          "pageCount": undefined,
          "printType": undefined,
          "publishedDate": undefined,
          "publisher": undefined,
          "thumbnail": "https://books.google.com/books?id=11223344000&printsec=frontcover&img=1&zoom=6&edge=curl&source=gbs_api",
          "title": "Code Complete",
        }
      `);
    });

    it("should resolve a valid ISBN with Open Library", async () => {
      const mockResponseGoogle = {
        kind: "books#volumes",
        totalItems: 0,
      };

      const mockResponseOpenLibrary = {};
      mockResponseOpenLibrary[`ISBN:${MOCK_ISBN}`] = {
        info_url: "https://openlibrary.org/books/OL1743093M/Book",
        preview_url: "https://archive.org/details/whatsitallabouta00cain",
        thumbnail_url: "https://covers.openlibrary.org/b/id/6739180-S.jpg",
        details: {
          number_of_pages: 521,
          subtitle: "an autobiography",
          title: "Book Title",
          languages: [
            {
              key: "/languages/eng",
            },
          ],
          publishers: ["Turtle Bay Books"],
          authors: [
            {
              name: "Michael Caine",
              key: "/authors/OL840869A",
            },
          ],
          publish_date: "1992",
        },
        preview: "borrow",
      };

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
          "authors": [
            "Michael Caine",
          ],
          "categories": [],
          "description": "an autobiography",
          "link": "https://openlibrary.org/books/OL1743093M/Book",
          "pageCount": 521,
          "printType": "BOOK",
          "publishedDate": "1992",
          "publisher": "Turtle Bay Books",
          "thumbnail": "https://covers.openlibrary.org/b/id/6739180-S.jpg",
          "title": "Book Title",
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
      expect(book).toMatchInlineSnapshot(`
        {
          "authors": [
            "Aswin Pranam",
          ],
          "categories": undefined,
          "description": undefined,
          "link": "",
          "pageCount": 174,
          "printType": "BOOK",
          "publishedDate": "1992-12-13",
          "publisher": "Turtle Bay Books",
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
google: No books found with isbn: isbn
openlibrary: No books found with ISBN: isbn
isbndb: No books found with ISBN: isbn]
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
      const mockResponseGoogle = {
        totalItems: 1,
        items: [
          {
            id: "11223344000",
            volumeInfo: {
              title: "Code Complete",
              authors: ["Steve McConnell"],
            },
          },
        ],
      };

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
      expect(book).toMatchInlineSnapshot(
        mockResponseGoogle.items[0].volumeInfo,
        `
{
  "authors": [
    "Steve McConnell",
  ],
  "categories": undefined,
  "description": undefined,
  "link": undefined,
  "pageCount": undefined,
  "printType": undefined,
  "publishedDate": undefined,
  "publisher": undefined,
  "thumbnail": "https://books.google.com/books?id=11223344000&printsec=frontcover&img=1&zoom=6&edge=curl&source=gbs_api",
  "title": "Code Complete",
}
`
      );
    });

    it("should reset providers after completion", async () => {
      const mockResponseGoogle = {
        totalItems: 1,
        items: [
          {
            id: "11223344000",
            volumeInfo: {
              title: "Code Complete",
              authors: ["Steve McConnell"],
            },
          },
        ],
      };

      axios.get.mockResolvedValue({ status: 200, data: mockResponseGoogle });

      await isbn.provider([isbn.PROVIDER_NAMES.GOOGLE]).resolve(MOCK_ISBN);

      expect(isbn._providers).toMatchInlineSnapshot(
        DEFAULT_PROVIDER_ORDER,
        `
[
  "google",
  "openlibrary",
  "isbndb",
]
`
      );
    });

    it("should override default options", async function () {
      const mockResponseGoogle = {
        totalItems: 1,
        items: [
          {
            id: "11223344000",
            volumeInfo: {
              title: "Code Complete",
              authors: ["Steve McConnell"],
            },
          },
        ],
      };

      axios.get.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({ status: 200, data: mockResponseGoogle });
            }, 10_000);
          })
      );

      const book = await isbn.resolve(MOCK_ISBN, { timeout: 15_000 });
      expect(book).toMatchInlineSnapshot(
        mockResponseGoogle.items[0].volumeInfo,
        `
{
  "authors": [
    "Steve McConnell",
  ],
  "categories": undefined,
  "description": undefined,
  "link": undefined,
  "pageCount": undefined,
  "printType": undefined,
  "publishedDate": undefined,
  "publisher": undefined,
  "thumbnail": "https://books.google.com/books?id=11223344000&printsec=frontcover&img=1&zoom=6&edge=curl&source=gbs_api",
  "title": "Code Complete",
}
`
      );
    }, 20_000);
  });
});

describe("ISBN Provider API", () => {
  it("should use default providers if providers array is empty", () => {
    const expectedProviders = isbn._providers;
    isbn.provider([]);
    expect(isbn._providers).toMatchInlineSnapshot(
      expectedProviders,
      `
[
  "google",
  "openlibrary",
  "isbndb",
]
`
    );
  });

  it("should return an error if providers is not an array", () => {
    const expectedProviders = isbn._providers;

    expect(() => {
      isbn.provider("string-that-must-not-work");
    }).toThrow();
    expect(isbn._providers).toMatchInlineSnapshot(
      expectedProviders,
      `
[
  "google",
  "openlibrary",
  "isbndb",
]
`
    );
  });

  it("should return an error if invalid providers in list", () => {
    const expectedProviders = isbn._providers;

    expect(() => {
      isbn.provider(["gibberish", "wow", "sogood"]);
    }).toThrow();
    expect(isbn._providers).toMatchInlineSnapshot(
      expectedProviders,
      `
[
  "google",
  "openlibrary",
  "isbndb",
]
`
    );
  });

  it("should remove duplicates", () => {
    const providers = [
      isbn.PROVIDER_NAMES.OPENLIBRARY,
      isbn.PROVIDER_NAMES.OPENLIBRARY,
    ];
    const expected = [isbn.PROVIDER_NAMES.OPENLIBRARY];

    isbn.provider(providers);
    expect(isbn._providers).toMatchInlineSnapshot(
      expected,
      `
[
  "openlibrary",
]
`
    );
  });

  it("should set providers as expected", () => {
    const providers = [
      isbn.PROVIDER_NAMES.OPENLIBRARY,
      isbn.PROVIDER_NAMES.GOOGLE,
    ];

    isbn.provider(providers);
    expect(isbn._providers).toMatchInlineSnapshot(
      providers,
      `
[
  "openlibrary",
  "google",
]
`
    );
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
