import { resolveIsbnDb } from "../../src/providers/isbndb.js";
import axios from "axios";
import { jest } from "@jest/globals";

jest.mock("axios");

describe("resolveIsbnDb", () => {
  const isbn = "1234567890";

  beforeEach(() => {
    process.env.ISBNDB_API_KEY = "key-1234";
  });

  it("should resolve book information successfully", async () => {
    const mockResponse = {
      book: {
        title_long: "Test Book",
        date_published: "2022-01-01",
        authors: ["Test Author"],
        overview: "Test overview",
        isbn: "1234567890",
        isbn13: "1234567890123",
        dewey_decimal: "123.456",
        pages: 123,
        subjects: ["Test subject"],
        image: "http://example.com/test.jpg",
        publisher: "Test Publisher",
        language: "en",
      },
    };

    axios.get = jest.fn().mockResolvedValue({
      status: 200,
      data: mockResponse,
    });

    const book = await resolveIsbnDb(isbn, {});
    expect(book).toMatchInlineSnapshot(`
      {
        "authors": [
          "Test Author",
        ],
        "bookProvider": "ISBNdb",
        "categories": [
          "Test subject",
        ],
        "description": "Test overview",
        "format": "book",
        "isbn": "1234567890",
        "language": "en",
        "pageCount": 123,
        "publishedDate": "2022-01-01",
        "publisher": "Test Publisher",
        "thumbnail": "http://example.com/test.jpg",
        "title": "Test Book",
      }
    `);
  });

  it("should throw an error if no books are found", async () => {
    const mockResponse = {};

    axios.get = jest.fn().mockResolvedValue({
      status: 200,
      data: mockResponse,
    });

    await expect(resolveIsbnDb(isbn, {})).rejects.toThrow(
      `No books found with ISBN: ${isbn}`
    );
  });

  it("should throw an error if the response status is not 200", async () => {
    const mockResponse = {};

    axios.get = jest.fn().mockResolvedValue({
      status: 404,
      data: mockResponse,
    });

    await expect(resolveIsbnDb(isbn, {})).rejects.toThrow(
      "Wrong response code: 404"
    );
  });

  it("should throw an error if no token", async () => {
    process.env.ISBNDB_API_KEY = "";
    const mockResponse = {};

    axios.get = jest.fn().mockResolvedValue({
      status: 200,
      data: mockResponse,
    });

    await expect(resolveIsbnDb(isbn, {})).rejects.toThrow(
      `ISBNdb requires an API key`
    );
  });
});
