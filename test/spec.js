import isbn from "../src/index.js";
import assert from "node:assert";
import nock from "nock";

const MOCK_ISBN = "isbn";

const GOOGLE_BOOKS_API_BASE = "https://www.googleapis.com";
const GOOGLE_BOOKS_API_BOOK = `/books/v1/volumes?q=isbn:${MOCK_ISBN}`;

const OPENLIBRARY_API_BASE = "https://openlibrary.org";
const OPENLIBRARY_API_BOOK = `/api/books?bibkeys=ISBN:${MOCK_ISBN}&format=json&jscmd=details`;

const ISBNDB_API_BASE = "https://api2.isbndb.com";
const ISBNDB_API_BOOK = `/book/${MOCK_ISBN}`;

const DEFAULT_PROVIDER_ORDER = [
  isbn.PROVIDER_NAMES.GOOGLE,
  isbn.PROVIDER_NAMES.OPENLIBRARY,
  isbn.PROVIDER_NAMES.ISBNDB,
];

describe("ISBN Resolver API", () => {
  describe("using async", () => {
    it("should resolve a valid ISBN with Google", async () => {
      const mockResponseGoogle = {
        totalItems: 1,
        items: [
          {
            volumeInfo: {
              title: "Code Complete",
              authors: ["Steve McConnell"],
            },
          },
        ],
      };

      nock(GOOGLE_BOOKS_API_BASE)
        .get(GOOGLE_BOOKS_API_BOOK)
        .reply(200, JSON.stringify(mockResponseGoogle));

      const book = await isbn.resolve(MOCK_ISBN);
      assert.deepEqual(book, mockResponseGoogle.items[0].volumeInfo);
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

      nock(GOOGLE_BOOKS_API_BASE)
        .get(GOOGLE_BOOKS_API_BOOK)
        .reply(200, JSON.stringify(mockResponseGoogle));

      nock(OPENLIBRARY_API_BASE)
        .get(OPENLIBRARY_API_BOOK)
        .reply(200, JSON.stringify(mockResponseOpenLibrary));

      const book = await isbn.resolve(MOCK_ISBN);
      assert.equal(book.title, "Book Title");
      assert.equal(book.publisher, "Turtle Bay Books");
      assert.equal(book.publishedDate, "1992");
      assert.equal(book.pageCount, 521);
      assert.equal(book.language, "en");
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

      nock(GOOGLE_BOOKS_API_BASE)
        .get(GOOGLE_BOOKS_API_BOOK)
        .reply(200, JSON.stringify(mockResponseGoogle));

      nock(OPENLIBRARY_API_BASE)
        .get(OPENLIBRARY_API_BOOK)
        .reply(200, JSON.stringify(mockResponseOpenLibrary));

      nock(ISBNDB_API_BASE)
        .get(ISBNDB_API_BOOK)
        .reply(200, JSON.stringify(mockResponseIsbnDb));

      const book = await isbn.resolve(MOCK_ISBN);
      assert.equal(book.title, "Book Title");
      assert.equal(book.publisher, "Turtle Bay Books");
      assert.equal(book.publishedDate, "1992-12-13");
    });

    it("should return an error if no book is found", async () => {
      const mockResponseGoogle = {
        kind: "books#volumes",
        totalItems: 0,
      };

      const mockResponseOpenLibrary = {};

      nock(GOOGLE_BOOKS_API_BASE)
        .get(GOOGLE_BOOKS_API_BOOK)
        .reply(200, JSON.stringify(mockResponseGoogle));

      nock(OPENLIBRARY_API_BASE)
        .get(OPENLIBRARY_API_BOOK)
        .reply(200, JSON.stringify(mockResponseOpenLibrary));

      try {
        await isbn.resolve(MOCK_ISBN);
      } catch (error) {
        assert.notEqual(error, null);
      }
    });

    it("should return an error if external endpoints are not reachable", async () => {
      nock.disableNetConnect();

      try {
        await isbn.resolve(MOCK_ISBN);
      } catch (error) {
        assert.notEqual(error, null);
      }
    });

    it("should return an error if external endpoints return a HTTP error", async () => {
      nock(GOOGLE_BOOKS_API_BASE).get(GOOGLE_BOOKS_API_BOOK).reply(500);

      nock(OPENLIBRARY_API_BASE).get(OPENLIBRARY_API_BOOK).reply(500);

      try {
        await isbn.resolve(MOCK_ISBN);
      } catch (error) {
        assert.notEqual(error, null);
      }
    });

    it("should timeout on long connections", async () => {
      nock(GOOGLE_BOOKS_API_BASE)
        .get(GOOGLE_BOOKS_API_BOOK)
        .delay(10_000)
        .reply(200, JSON.stringify({}));

      nock(OPENLIBRARY_API_BASE)
        .get(OPENLIBRARY_API_BOOK)
        .delay(10_000)
        .reply(200, JSON.stringify({}));

      try {
        await isbn.resolve(MOCK_ISBN);
      } catch (error) {
        assert.notEqual(error, null);
      }
    });

    it("should invoke providers in order specified", async () => {
      const mockResponseGoogle = {
        totalItems: 1,
        items: [
          {
            volumeInfo: {
              title: "Code Complete",
              authors: ["Steve McConnell"],
            },
          },
        ],
      };

      const mockResponseOpenLibrary = {};

      nock(GOOGLE_BOOKS_API_BASE)
        .get(GOOGLE_BOOKS_API_BOOK)
        .reply(200, JSON.stringify(mockResponseGoogle));

      nock(OPENLIBRARY_API_BASE)
        .get(OPENLIBRARY_API_BOOK)
        .reply(200, JSON.stringify(mockResponseOpenLibrary));

      const book = await isbn
        .provider([isbn.PROVIDER_NAMES.OPENLIBRARY, isbn.PROVIDER_NAMES.GOOGLE])
        .resolve(MOCK_ISBN);
      assert.deepEqual(book, mockResponseGoogle.items[0].volumeInfo);
    });

    it("should reset providers after completion", async () => {
      const mockResponseGoogle = {
        totalItems: 1,
        items: [
          {
            volumeInfo: {
              title: "Code Complete",
              authors: ["Steve McConnell"],
            },
          },
        ],
      };

      nock(GOOGLE_BOOKS_API_BASE)
        .get(GOOGLE_BOOKS_API_BOOK)
        .reply(200, JSON.stringify(mockResponseGoogle));

      await isbn.provider([isbn.PROVIDER_NAMES.GOOGLE]).resolve(MOCK_ISBN);

      assert.deepEqual(isbn._providers, DEFAULT_PROVIDER_ORDER);
    });

    it("should override default options", async function () {
      this.timeout(20_000); // Set timeout to 20,000 milliseconds

      const mockResponseGoogle = {
        totalItems: 1,
        items: [
          {
            volumeInfo: {
              title: "Code Complete",
              authors: ["Steve McConnell"],
            },
          },
        ],
      };

      nock(GOOGLE_BOOKS_API_BASE)
        .get(GOOGLE_BOOKS_API_BOOK)
        .delay(10_000)
        .reply(200, JSON.stringify(mockResponseGoogle));

      const book = await isbn.resolve(MOCK_ISBN, { timeout: 15_000 });
      assert.deepEqual(book, mockResponseGoogle.items[0].volumeInfo);
    });
  });

  describe("using promise", () => {
    it("should resolve a valid ISBN with Google", (done) => {
      const mockResponseGoogle = {
        totalItems: 1,
        items: [
          {
            volumeInfo: {
              title: "Code Complete",
              authors: ["Steve McConnell"],
            },
          },
        ],
      };

      nock(GOOGLE_BOOKS_API_BASE)
        .get(GOOGLE_BOOKS_API_BOOK)
        .reply(200, JSON.stringify(mockResponseGoogle));

      isbn
        .resolve(MOCK_ISBN)
        .then((book) => {
          assert.deepEqual(book, mockResponseGoogle.items[0].volumeInfo);
          done();
        })
        .catch(done);
    });

    it("should resolve a valid ISBN with Open Library", (done) => {
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

      nock(GOOGLE_BOOKS_API_BASE)
        .get(GOOGLE_BOOKS_API_BOOK)
        .reply(200, JSON.stringify(mockResponseGoogle));

      nock(OPENLIBRARY_API_BASE)
        .get(OPENLIBRARY_API_BOOK)
        .reply(200, JSON.stringify(mockResponseOpenLibrary));

      isbn
        .resolve(MOCK_ISBN)
        .then((book) => {
          assert.equal(book.title, "Book Title");
          assert.equal(book.publisher, "Turtle Bay Books");
          assert.equal(book.publishedDate, "1992");
          assert.equal(book.pageCount, 521);
          assert.equal(book.language, "en");
          done();
        })
        .catch(done);
    });

    it("should resolve a valid ISBN with ISBNdb", (done) => {
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

      nock(GOOGLE_BOOKS_API_BASE)
        .get(GOOGLE_BOOKS_API_BOOK)
        .reply(200, JSON.stringify(mockResponseGoogle));

      nock(OPENLIBRARY_API_BASE)
        .get(OPENLIBRARY_API_BOOK)
        .reply(200, JSON.stringify(mockResponseOpenLibrary));

      nock(ISBNDB_API_BASE)
        .get(ISBNDB_API_BOOK)
        .reply(200, JSON.stringify(mockResponseIsbnDb));

      isbn
        .resolve(MOCK_ISBN)
        .then(({ title, publisher, publishedDate }) => {
          assert.equal(title, "Book Title");
          assert.equal(publisher, "Turtle Bay Books");
          assert.equal(publishedDate, "1992-12-13");
          done();
        })
        .catch(done);
    });

    it("should return an error if no book is found", (done) => {
      const mockResponseGoogle = {
        kind: "books#volumes",
        totalItems: 0,
      };

      const mockResponseOpenLibrary = {};

      nock(GOOGLE_BOOKS_API_BASE)
        .get(GOOGLE_BOOKS_API_BOOK)
        .reply(200, JSON.stringify(mockResponseGoogle));

      nock(OPENLIBRARY_API_BASE)
        .get(OPENLIBRARY_API_BOOK)
        .reply(200, JSON.stringify(mockResponseOpenLibrary));

      isbn
        .resolve(MOCK_ISBN)
        .then(() => {
          done(new Error("resolve succeeded when failure expected"));
        })
        .catch((error) => {
          assert.notEqual(error, null);
          done();
        });
    });

    it("should return an error if external endpoints are not reachable", (done) => {
      nock.disableNetConnect();

      isbn
        .resolve(MOCK_ISBN)
        .then(() => {
          done(new Error("resolve succeeded when failure expected"));
        })
        .catch((error) => {
          assert.notEqual(error, null);
          done();
        });
    });

    it("should return an error if external endpoints return a HTTP error", (done) => {
      nock(GOOGLE_BOOKS_API_BASE).get(GOOGLE_BOOKS_API_BOOK).reply(500);

      nock(OPENLIBRARY_API_BASE).get(OPENLIBRARY_API_BOOK).reply(500);

      isbn
        .resolve(MOCK_ISBN)
        .then(() => {
          done(new Error("resolve succeeded when failure expected"));
        })
        .catch((error) => {
          assert.notEqual(error, null);
          done();
        });
    });

    it("should timeout on long connections", (done) => {
      nock(GOOGLE_BOOKS_API_BASE)
        .get(GOOGLE_BOOKS_API_BOOK)
        .delay(10_000)
        .reply(200, JSON.stringify({}));

      nock(OPENLIBRARY_API_BASE)
        .get(OPENLIBRARY_API_BOOK)
        .delay(10_000)
        .reply(200, JSON.stringify({}));

      isbn
        .resolve(MOCK_ISBN)
        .then(() => {
          done(new Error("resolve succeeded when failure expected"));
        })
        .catch((error) => {
          assert.notEqual(error, null);
          done();
        });
    });

    it("should invoke providers in order specified", (done) => {
      const mockResponseGoogle = {
        totalItems: 1,
        items: [
          {
            volumeInfo: {
              title: "Code Complete",
              authors: ["Steve McConnell"],
            },
          },
        ],
      };

      const mockResponseOpenLibrary = {};

      nock(GOOGLE_BOOKS_API_BASE)
        .get(GOOGLE_BOOKS_API_BOOK)
        .reply(200, JSON.stringify(mockResponseGoogle));

      nock(OPENLIBRARY_API_BASE)
        .get(OPENLIBRARY_API_BOOK)
        .reply(200, JSON.stringify(mockResponseOpenLibrary));

      isbn
        .provider([isbn.PROVIDER_NAMES.OPENLIBRARY, isbn.PROVIDER_NAMES.GOOGLE])
        .resolve(MOCK_ISBN)
        .then((book) => {
          // Assert order: OpenLib (err) -> Google (success)
          assert.deepEqual(book, mockResponseGoogle.items[0].volumeInfo);
          done();
        });
    });

    it("should reset providers after completion", (done) => {
      const mockResponseGoogle = {
        totalItems: 1,
        items: [
          {
            volumeInfo: {
              title: "Code Complete",
              authors: ["Steve McConnell"],
            },
          },
        ],
      };

      nock(GOOGLE_BOOKS_API_BASE)
        .get(GOOGLE_BOOKS_API_BOOK)
        .reply(200, JSON.stringify(mockResponseGoogle));

      isbn
        .provider([isbn.PROVIDER_NAMES.GOOGLE])
        .resolve(MOCK_ISBN)
        .then(() => {
          assert.deepEqual(isbn._providers, DEFAULT_PROVIDER_ORDER);

          done();
        });
    });
  });
});

describe("ISBN Provider API", () => {
  it("should use default providers if providers array is empty", () => {
    const expectedProviders = isbn._providers;
    isbn.provider([]);
    assert.deepEqual(expectedProviders, isbn._providers);
  });

  it("should return an error if providers is not an array", () => {
    const expectedProviders = isbn._providers;

    try {
      isbn.provider("string-that-must-not-work");
      assert.fail(`Test must've failed! 😱`);
    } catch {
      assert.deepEqual(expectedProviders, isbn._providers);
    }
  });

  it("should return an error if invalid providers in list", () => {
    const expectedProviders = isbn._providers;

    try {
      isbn.provider(["gibberish", "wow", "sogood"]);
      assert.fail(`Test must've failed! 😱`);
    } catch {
      assert.deepEqual(expectedProviders, isbn._providers);
    }
  });

  it("should remove duplicates", () => {
    const providers = [
      isbn.PROVIDER_NAMES.OPENLIBRARY,
      isbn.PROVIDER_NAMES.OPENLIBRARY,
    ];
    const expected = [isbn.PROVIDER_NAMES.OPENLIBRARY];

    isbn.provider(providers);
    assert.deepEqual(expected, isbn._providers);
  });

  it("should set providers as expected", () => {
    const providers = [
      isbn.PROVIDER_NAMES.OPENLIBRARY,
      isbn.PROVIDER_NAMES.GOOGLE,
    ];

    isbn.provider(providers);
    assert.deepEqual(providers, isbn._providers);
  });

  it("should return instance after setting provider", () => {
    const providers = [
      isbn.PROVIDER_NAMES.OPENLIBRARY,
      isbn.PROVIDER_NAMES.GOOGLE,
    ];

    const result = isbn.provider(providers);
    assert.strictEqual(result.constructor, isbn.constructor);
  });
});
