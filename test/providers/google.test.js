import { resolveGoogle } from "../../src/providers/google.js";
import axios from "axios";
import { jest } from "@jest/globals";

jest.mock("axios");

describe("resolveGoogle", () => {
  const isbn = "1234567890";

  it("should resolve book information successfully", async () => {
    const mockResponse = {
      totalItems: 1,
      items: [
        {
          id: "11223344000",
          volumeInfo: {
            title: "Test Book",
            authors: ["Test Author"],
          },
        },
      ],
    };

    const mockVolumeResponse = {
      kind: "books#volume",
      id: "2cl7AgAAQBAJ",
      volumeInfo: {
        categories: [
          "Fiction / General",
          "Fiction / Fantasy / General",
          "Fiction / Horror",
          "Fiction / Literary",
          "Fiction / Science Fiction / General",
          "Fiction / Science Fiction / Action & Adventure",
          "Fiction / Thrillers / Suspense",
          "Fiction / Dystopian",
        ],
        imageLinks: {
          smallThumbnail: "http://smallthumanil",
          thumbnail: "http://thumbnail",
          small: "http://small",
          medium: "http://medium",
          large: "http://large",
          extraLarge: "http://extra-large/",
        },
      },
      saleInfo: {},
      accessInfo: {},
    };

    axios.get = jest.fn().mockImplementation((url) => {
      if (url.includes("isbn")) {
        return Promise.resolve({ status: 200, data: mockResponse });
      }
      return Promise.resolve({
        status: 200,
        data: mockVolumeResponse,
      });
    });

    const book = await resolveGoogle(isbn, {});
    expect(book).toMatchInlineSnapshot(`
      {
        "authors": [
          "Test Author",
        ],
        "bookProvider": "Google Books",
        "categories": [
          "Fiction",
          "Fiction / General",
          "Fiction / Fantasy / General",
          "Fiction / Horror",
          "Fiction / Literary",
          "Fiction / Science Fiction / General",
          "Fiction / Science Fiction / Action & Adventure",
          "Fiction / Thrillers / Suspense",
          "Fiction / Dystopian",
        ],
        "description": undefined,
        "format": undefined,
        "isbn": "1234567890",
        "language": undefined,
        "link": undefined,
        "pageCount": undefined,
        "publishedDate": undefined,
        "publisher": undefined,
        "thumbnail": "http://extra-large/",
        "title": "Test Book",
      }
    `);
  });

  it("should resolve book information successfully, use imageLinks from volume", async () => {
    const mockResponse = {
      totalItems: 1,
      items: [
        {
          id: "11223344000",
          volumeInfo: {
            title: "Test Book",
            authors: ["Test Author"],
            imageLinks: {
              smallThumbnail: "http://smallthumanil",
              thumbnail: "http://thumbnail",
            },
          },
        },
      ],
    };

    const mockVolumeResponse = {
      kind: "books#volume",
      id: "2cl7AgAAQBAJ",
      volumeInfo: {
        categories: [
          "Fiction / General",
          "Fiction / Fantasy / General",
          "Fiction / Horror",
          "Fiction / Literary",
          "Fiction / Science Fiction / General",
          "Fiction / Science Fiction / Action & Adventure",
          "Fiction / Thrillers / Suspense",
          "Fiction / Dystopian",
        ],
        imageLinks: {
          smallThumbnail: "http://smallthumanil",
          thumbnail: "http://thumbnail",
          small: "http://small",
          medium: "http://medium",
          large: "http://large",
          extraLarge: "http://extra-large/",
        },
      },
      saleInfo: {},
      accessInfo: {},
    };

    axios.get = jest.fn().mockImplementation((url) => {
      if (url.includes("isbn")) {
        return Promise.resolve({ status: 200, data: mockResponse });
      }
      return Promise.resolve({
        status: 200,
        data: mockVolumeResponse,
      });
    });

    const book = await resolveGoogle(isbn, {});
    expect(book).toMatchInlineSnapshot(`
      {
        "authors": [
          "Test Author",
        ],
        "bookProvider": "Google Books",
        "categories": [
          "Fiction",
          "Fiction / General",
          "Fiction / Fantasy / General",
          "Fiction / Horror",
          "Fiction / Literary",
          "Fiction / Science Fiction / General",
          "Fiction / Science Fiction / Action & Adventure",
          "Fiction / Thrillers / Suspense",
          "Fiction / Dystopian",
        ],
        "description": undefined,
        "format": undefined,
        "isbn": "1234567890",
        "language": undefined,
        "link": undefined,
        "pageCount": undefined,
        "publishedDate": undefined,
        "publisher": undefined,
        "thumbnail": "http://extra-large/",
        "title": "Test Book",
      }
    `);
  });

  it("should resolve book information successfully, use imageLinks from initial query", async () => {
    const mockResponse = {
      totalItems: 1,
      items: [
        {
          id: "11223344000",
          volumeInfo: {
            title: "Test Book",
            authors: ["Test Author"],
            imageLinks: {
              smallThumbnail: "http://smallthumanil",
              thumbnail: "http://thumbnail",
            },
          },
        },
      ],
    };

    const mockVolumeResponse = {
      kind: "books#volume",
      id: "2cl7AgAAQBAJ",
      volumeInfo: {},
      saleInfo: {},
      accessInfo: {},
    };

    axios.get = jest.fn().mockImplementation((url) => {
      if (url.includes("isbn")) {
        return Promise.resolve({ status: 200, data: mockResponse });
      }
      return Promise.resolve({
        status: 200,
        data: mockVolumeResponse,
      });
    });

    const book = await resolveGoogle(isbn, {});
    expect(book).toMatchInlineSnapshot(`
      {
        "authors": [
          "Test Author",
        ],
        "bookProvider": "Google Books",
        "categories": [],
        "description": undefined,
        "format": undefined,
        "isbn": "1234567890",
        "language": undefined,
        "link": undefined,
        "pageCount": undefined,
        "publishedDate": undefined,
        "publisher": undefined,
        "thumbnail": "http://thumbnail/",
        "title": "Test Book",
      }
    `);
  });

  it("should resolve book information successfully, no imageLinks", async () => {
    const mockResponse = {
      totalItems: 1,
      items: [
        {
          id: "11223344000",
          volumeInfo: {
            title: "Test Book",
            authors: ["Test Author"],
          },
        },
      ],
    };

    axios.get = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ status: 200, data: mockResponse }),
      );

    const book = await resolveGoogle(isbn, {});
    expect(book).toMatchInlineSnapshot(`
      {
        "authors": [
          "Test Author",
        ],
        "bookProvider": "Google Books",
        "categories": [],
        "description": undefined,
        "format": undefined,
        "isbn": "1234567890",
        "language": undefined,
        "link": undefined,
        "pageCount": undefined,
        "publishedDate": undefined,
        "publisher": undefined,
        "thumbnail": undefined,
        "title": "Test Book",
      }
    `);
  });

  it("should throw an error if volume fails", async () => {
    const mockResponse = {
      totalItems: 1,
      items: [
        {
          id: "11223344000",
          volumeInfo: {
            title: "Test Book",
            authors: ["Test Author"],
          },
        },
      ],
    };

    axios.get = jest.fn().mockImplementation((url) => {
      if (url.includes("isbn")) {
        return Promise.resolve({ status: 200, data: mockResponse });
      }
      return Promise.resolve({
        status: 404,
      });
    });

    await expect(resolveGoogle(isbn, {})).rejects.toThrow(
      `Unable to get volume 11223344000: 404`,
    );
  });

  it("should throw an error if status is not 200", async () => {
    const mockResponse = {
      totalItems: 1,
      items: [],
    };

    axios.get = jest.fn().mockResolvedValue({
      status: 404,
      data: mockResponse,
    });

    await expect(resolveGoogle(isbn, {})).rejects.toThrow(
      `Wrong response code: 404`,
    );
  });

  it("should throw an error if no volume info is found", async () => {
    const mockResponse = {
      totalItems: 1,
      items: [],
    };

    axios.get = jest.fn().mockResolvedValue({
      status: 200,
      data: mockResponse,
    });

    await expect(resolveGoogle(isbn, {})).rejects.toThrow(
      `No volume info found for book with isbn: ${isbn}`,
    );
  });
});
